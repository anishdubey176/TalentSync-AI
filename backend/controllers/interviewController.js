const { GoogleGenAI } = require('@google/genai');

const generateMockInterview = async (req, res) => {
  try {
    const { domain, experience = 'Fresher', questionCount = 5 } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
       return res.status(500).json({ error: 'Gemini API Key is missing or invalid. Please update the .env file.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an expert interviewer. Generate ${questionCount} conceptual, theoretical, or practical questions for a mock interview in the domain of "${domain}" for a candidate with "${experience}" level of experience.
      These should NOT be multiple-choice questions. They should require short text answers (1-3 sentences) from the user.
      Ensure the difficulty level and complexity of the questions are highly appropriate for a "${experience}" candidate. For example, if experience is "Fresher", ask foundational and conceptual questions. If it is "3+ Years" or "5+ Years", ask more advanced, scenario-based, architectural, or management questions depending on the domain.
      Provide the output EXACTLY in the following JSON array format, and nothing else. No markdown wrappers.
      
      [
        {
          "id": 1,
          "text": "The question text here?",
          "tags": ["Tag1", "Tag2"],
          "suggestedAnswer": "Concise key points or description of what the correct answer should include."
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
          responseMimeType: "application/json"
      }
    });

    const generatedText = response.text;
    let questions;
    
    try {
      questions = JSON.parse(generatedText);
    } catch (parseError) {
      console.error("Error parsing AI response:", generatedText);
      return res.status(500).json({ error: 'Failed to parse AI response into JSON format' });
    }

    res.status(200).json(questions);

  } catch (error) {
    console.error("Error generating mock interview:", error);
    res.status(500).json({ error: 'Failed to generate mock interview questions' });
  }
};

const evaluateMockInterview = async (req, res) => {
  try {
    const { questions, answers } = req.body;

    if (!questions || !answers) {
      return res.status(400).json({ error: 'Questions and answers are required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
       return res.status(500).json({ error: 'Gemini API Key is missing or invalid. Please update the .env file.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Prepare questions with user answers for Gemini
    const evaluationInput = questions.map(q => ({
      id: q.id,
      question: q.text,
      suggestedAnswer: q.suggestedAnswer,
      userAnswer: answers[q.id] || 'Candidate skipped this question / left it blank.'
    }));

    const prompt = `
      You are an expert interviewer grading a candidate's mock interview.
      Below is a JSON list of questions, their suggested correct answers, and the candidate's actual typed answers.
      For each item, evaluate the candidate's answer strictly:
      - If they left it blank, skipped it, or answered with gibberish, repeated letters/words, keyboard mashes (e.g. 'dsttttt...', 'agxdbsjag'), or completely irrelevant text, you MUST mark 'isCorrect' as false and set 'score' to 0. Do not give any partial credit.
      - "isCorrect": true/false (Set to true only if their answer is a valid, semantically coherent attempt that covers the core concepts accurately. Otherwise set to false).
      - "feedback": A short 1-sentence explanation of why their answer is correct, or what specific points were missing from a correct answer.
      - "score": A score from 0 to 100 for this answer.
      
      Evaluation Items:
      ${JSON.stringify(evaluationInput, null, 2)}
      
      Provide the output EXACTLY in the following JSON format, and nothing else. No markdown wrappers:
      {
        "results": [
          {
            "id": 1,
            "isCorrect": true,
            "score": 85,
            "feedback": "Feedback explanation here."
          }
        ],
        "scorePercent": 85,
        "correctCount": 1
      }
      
      Make sure the final "scorePercent" is the average of all individual scores, and "correctCount" is the count of items where "isCorrect" is true.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
          responseMimeType: "application/json"
      }
    });

    let evaluationResults;
    try {
      evaluationResults = JSON.parse(response.text);
    } catch (parseError) {
      console.error("Error parsing AI evaluation:", response.text);
      return res.status(500).json({ error: 'Failed to parse AI evaluation response' });
    }

    res.status(200).json(evaluationResults);

  } catch (error) {
    console.error("Error evaluating mock interview:", error);
    res.status(500).json({ error: 'Failed to evaluate interview answers' });
  }
};

const validateAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const trimmed = answer.trim();
    // 1. Minimum character length check
    if (trimmed.length < 10) {
      return res.status(200).json({ 
        isValid: false, 
        message: 'Your answer is too short. Please write a correct and meaningful answer.' 
      });
    }

    // 2. Character mash check (e.g. "dstttttttttttttterafg...")
    const hasRepeatedChars = /(.)\1{4,}/.test(trimmed);
    const hasNoVowels = !/[aeiouyAEIOUY]/.test(trimmed);
    const words = trimmed.split(/\s+/);
    const hasLongConsonantWord = words.some(w => w.length > 8 && !/[aeiouyAEIOUY]/.test(w));

    if (hasRepeatedChars || hasNoVowels || hasLongConsonantWord) {
      return res.status(200).json({ 
        isValid: false, 
        message: 'Please write a correct and meaningful answer.' 
      });
    }

    // 3. AI Semantic check for relevance and semantic sense
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(200).json({ isValid: true, message: '' });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `
      You are an AI mock interview assistant. Check if the candidate's typed answer is a valid, semantically coherent attempt to answer the question.
      - It does NOT have to be 100% correct, but it must make grammatical sense (not be keyboard gibberish or random letter strings like 'dsttttt...', 'agxdbsjag') and be on-topic/relevant to the question.
      - If it is keyboard gibberish, nonsense words, or completely off-topic, set isValid: false.
      - If it is a genuine attempt to answer the question, set isValid: true.
      
      Question: "${question}"
      Candidate Answer: "${trimmed}"
      
      Provide the output EXACTLY in the following JSON format:
      {
        "isValid": false,
        "message": "Please write a correct and meaningful answer."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
          responseMimeType: "application/json"
      }
    });

    let result;
    try {
      result = JSON.parse(response.text);
    } catch (e) {
      result = { isValid: true, message: '' };
    }

    res.status(200).json(result);

  } catch (error) {
    console.error("Error validating answer:", error);
    // Failsafe: let them proceed if the API fails
    res.status(200).json({ isValid: true, message: '' });
  }
};

const chatPractice = async (req, res) => {
  try {
    const { history = [] } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
       return res.status(500).json({ error: 'Gemini API Key is missing or invalid. Please update the .env file.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const contents = history
      .filter(msg => msg.text && msg.text.trim())
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: {
        systemInstruction: "You are a friendly, highly knowledgeable AI programming mentor and technical interviewer. Your goal is to help the candidate practice engineering, design, coding, or non-technical topics. Explain concepts clearly, write concise code examples when requested, and ask relevant follow-up questions to test their knowledge. Keep your answers brief, structured, and easy to read. Use code blocks with language specifiers for sharing snippets."
      }
    });

    res.status(200).json({ text: response.text });

  } catch (error) {
    console.error("Error in practice chat:", error);
    res.status(500).json({ error: 'Failed to generate chat response' });
  }
};

module.exports = {
  generateMockInterview,
  evaluateMockInterview,
  validateAnswer,
  chatPractice
};
