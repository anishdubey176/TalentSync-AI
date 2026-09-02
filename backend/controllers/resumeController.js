const { GoogleGenAI } = require('@google/genai');
const pdf = require('pdf-parse');

const analyzeResume = async (req, res) => {
  try {
    const { roleDescription = '' } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Resume PDF file is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
       return res.status(500).json({ error: 'Gemini API Key is missing or invalid. Please update the .env file.' });
    }

    // 1. Parse PDF text
    const dataBuffer = req.file.buffer;
    let resumeText = '';
    try {
      const pdfData = await pdf(dataBuffer);
      resumeText = pdfData.text;
    } catch (parseError) {
      console.error("PDF Parsing Error:", parseError);
      return res.status(500).json({ error: 'Failed to extract text from PDF resume' });
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ error: 'Uploaded PDF does not contain any readable text.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 2. Query Gemini to analyze
    const prompt = `
      You are an expert ATS (Applicant Tracking System) optimizer and professional recruiter.
      Analyze the candidate's resume text against the target job role and details: "${roleDescription}".
      Provide detailed feedback on where they are doing well and exactly how and where they can improve their resume to increase their score.
      
      Resume Text:
      "${resumeText}"
      
      Provide the output EXACTLY in the following JSON format, and nothing else. No markdown wrappers.
      {
        "score": 85,
        "breakdown": {
          "content": 90,
          "skills": 80,
          "experience": 85,
          "formatting": 85
        },
        "summary": "2-3 sentences summarizing their profile match and overall review.",
        "strengths": [
          "Detail of strength 1",
          "Detail of strength 2"
        ],
        "improvements": [
          "Detailed suggestion on where and how to improve (e.g. 'Add details about React state management in your frontend developer role to improve skills score')",
          "Another detailed suggestion"
        ],
        "missingKeywords": [
          "keyword1",
          "keyword2"
        ],
        "atsScore": 88
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
    } catch (err) {
      console.error("JSON parsing error of AI response:", response.text);
      return res.status(500).json({ error: 'Failed to parse AI analysis response' });
    }

    res.status(200).json(result);

  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
};

module.exports = {
  analyzeResume
};
