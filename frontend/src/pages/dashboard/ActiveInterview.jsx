import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ActiveInterview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const domain = location.state?.domain || 'Frontend Developer';
  const experience = location.state?.experience || 'Fresher';
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [validationError, setValidationError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (isLoading || error || questions.length === 0) return;

    if (timeLeft <= 0) {
      navigate('/dashboard/interviews/results', {
        state: {
          questions: questions,
          typedAnswers: selectedOptions,
          timeTaken: 600
        }
      });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isLoading, error, questions.length, navigate, selectedOptions]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/interviews/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ domain: domain, experience: experience, questionCount: 10 })
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate questions');
        }

        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedOption = currentQuestion ? (selectedOptions[currentQuestion.id] || '') : '';

  const handleSelectOption = (text) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentQuestion.id]: text
    }));
  };

  const handleNext = async () => {
    if (!selectedOption.trim()) {
      setValidationError('Please write a correct and meaningful answer.');
      return;
    }

    setValidationError('');
    setIsValidating(true);

    try {
      const response = await fetch('http://localhost:5000/api/interviews/validate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: currentQuestion.text,
          answer: selectedOption
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (!data.isValid) {
          setValidationError(data.message || 'Please write a correct and meaningful answer.');
          setIsValidating(false);
          return;
        }
      }
    } catch (err) {
      console.error("Validation error:", err);
    }

    setIsValidating(false);
    setValidationError('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      navigate('/dashboard/interviews/results', {
        state: {
          questions: questions,
          typedAnswers: selectedOptions,
          timeTaken: 600 - timeLeft,
          domain: domain,
          experience: experience
        }
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 dark:text-gray-400 font-medium animate-pulse">Generating your AI mock interview...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <p className="text-red-500 font-medium mb-4">Error: {error || 'Failed to load AI questions.'}</p>
        <button onClick={() => navigate('/dashboard/interviews')} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-10 min-h-[80vh]">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-4">
        <h2 className="text-slate-900 dark:text-white font-semibold">{domain} Mock</h2>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-8 flex flex-col">
        
        {/* Question Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-white/5 pb-4 mb-6">
          <span className="text-slate-500 dark:text-gray-400 font-medium">Question {currentQuestionIndex + 1} / {questions.length}</span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-mono bg-slate-100 dark:bg-[#1a142c] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">
              <Clock className="w-4 h-4 text-purple-400" />
              {formatTime(timeLeft)}
            </div>
            <button 
              onClick={() => navigate('/dashboard/interviews')}
              className="text-red-400 hover:text-red-300 text-sm font-medium border border-red-900/30 bg-red-900/10 px-4 py-1.5 rounded-lg transition-colors"
            >
              End Interview
            </button>
          </div>
        </div>

        {/* Question Content */}
        <div className="mb-8 flex-1 flex flex-col">
          <h2 className="text-xl md:text-2xl text-slate-900 dark:text-white font-medium mb-4 leading-relaxed">
            {currentQuestion.text}
          </h2>
          <div className="flex items-center gap-2 mb-8">
            {currentQuestion.tags.map((tag, idx) => (
              <span key={idx} className="text-xs font-medium text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>

          {/* Answer Input */}
          <div className="flex flex-col gap-2 flex-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Your Answer:</label>
            <textarea
              value={selectedOption}
              onChange={(e) => {
                handleSelectOption(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="Type your answer here in detail..."
              rows={6}
              className={`w-full p-4 rounded-xl border bg-slate-50 dark:bg-[#130f1e]/40 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-base resize-none flex-1 min-h-[150px] ${
                validationError ? 'border-red-500/50 focus:ring-red-500' : 'border-gray-200 dark:border-white/10'
              }`}
            />
            {validationError && (
              <p className="text-red-500 text-sm font-medium mt-1 animate-pulse">
                ⚠️ {validationError}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center pt-6 border-t border-gray-200 dark:border-white/5 mt-auto">
          <div className="flex items-center gap-3">
            <button 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0 || isValidating}
              className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-slate-600 dark:text-gray-300 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              onClick={handleNext}
              disabled={isValidating}
              className="px-8 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Validating...
                </>
              ) : (
                currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ActiveInterview;
