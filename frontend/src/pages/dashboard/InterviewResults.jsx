import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Target, Trophy, ArrowRight, Eye } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const InterviewResults = () => {
  const location = useLocation();
  const { 
    questions = [], 
    typedAnswers = {}, 
    timeTaken = 0,
    domain = 'Frontend Developer',
    experience = 'Fresher',
    evaluationResults: preloadedEvaluation = null
  } = location.state || {};

  const [showReview, setShowReview] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(questions.length > 0 && !preloadedEvaluation);
  const [evaluationResults, setEvaluationResults] = useState(preloadedEvaluation);
  const [error, setError] = useState(null);

  const hasData = questions.length > 0;

  useEffect(() => {
    if (!hasData || preloadedEvaluation) return;

    const runEvaluation = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/interviews/evaluate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ questions, answers: typedAnswers })
        });

        if (!response.ok) {
          throw new Error('Failed to evaluate answers');
        }

        const data = await response.json();
        setEvaluationResults(data);

        // Save to Interview History database in local storage
        const historyItem = {
          id: Date.now().toString(),
          role: domain,
          experience: experience,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          timeTaken: timeTaken, // in seconds
          questions: questions,
          typedAnswers: typedAnswers,
          evaluationResults: data,
          score: data.scorePercent,
          correctCount: data.correctCount
        };

        const existing = JSON.parse(localStorage.getItem('ts_interview_history') || '[]');
        
        // Prevent duplicate saves on manual page reloads
        const alreadySaved = existing.some(item => 
          JSON.stringify(item.questions) === JSON.stringify(questions) && 
          JSON.stringify(item.typedAnswers) === JSON.stringify(typedAnswers)
        );

        if (!alreadySaved) {
          localStorage.setItem('ts_interview_history', JSON.stringify([historyItem, ...existing]));
        }

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsEvaluating(false);
      }
    };

    runEvaluation();
  }, [questions, typedAnswers, hasData, preloadedEvaluation, domain, experience, timeTaken]);

  const totalQuestions = hasData ? questions.length : 25;
  const correctCount = evaluationResults ? evaluationResults.correctCount : 21;
  const scorePercent = evaluationResults ? evaluationResults.scorePercent : 85;

  const formattedTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const timeTakenStr = hasData ? formattedTime(timeTaken) : '28:45';
  const accuracyStr = `${scorePercent}%`;
  const rankStr = scorePercent >= 90 ? 'Top 5%' : scorePercent >= 80 ? 'Top 15%' : scorePercent >= 70 ? 'Top 30%' : 'Top 50%';
  const feedbackMsg = scorePercent >= 90 ? 'Outstanding Performance!' : scorePercent >= 75 ? 'Great Job!' : scorePercent >= 50 ? 'Good Effort!' : 'Keep Practicing!';
  const feedbackColor = scorePercent >= 75 ? 'text-emerald-400' : scorePercent >= 50 ? 'text-yellow-400' : 'text-red-400';

  // Group tags and calculate score breakdown
  let sectionBreakdown = [];
  if (evaluationResults && evaluationResults.results) {
    const tagStats = {};
    questions.forEach(q => {
      const evaluation = evaluationResults.results.find(r => r.id === q.id) || {};
      const isCorrect = evaluation.isCorrect;
      const score = evaluation.score || 0;

      q.tags.forEach(tag => {
        if (!tagStats[tag]) {
          tagStats[tag] = { total: 0, correct: 0, totalScore: 0 };
        }
        tagStats[tag].total += 1;
        if (isCorrect) {
          tagStats[tag].correct += 1;
        }
        tagStats[tag].totalScore += score;
      });
    });

    sectionBreakdown = Object.keys(tagStats).map(tag => {
      const { correct, total, totalScore } = tagStats[tag];
      const pct = Math.round(totalScore / total);
      return {
        label: tag,
        score: `${correct}/${total}`,
        percent: pct,
        color: pct >= 75 ? 'bg-emerald-400' : pct >= 50 ? 'bg-blue-400' : 'bg-red-400'
      };
    });
  } else {
    // Default mock data
    sectionBreakdown = [
      { label: 'HTML & CSS', score: '22/25', percent: 88, color: 'bg-emerald-400' },
      { label: 'JavaScript', score: '20/25', percent: 80, color: 'bg-emerald-400' },
      { label: 'React', score: '19/25', percent: 76, color: 'bg-blue-400' },
      { label: 'Best Practices', score: '23/25', percent: 92, color: 'bg-emerald-400' }
    ];
  }

  if (isEvaluating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full gap-4 text-center">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI Grading System</h2>
        <p className="text-slate-500 dark:text-gray-400 font-medium max-w-md animate-pulse">
          Please wait while our advanced AI evaluates your text answers and computes your score breakdown...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full text-center">
        <p className="text-red-500 font-medium mb-4">Error evaluating results: {error}</p>
        <Link to="/dashboard/interviews" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Interview Completed! <span className="text-3xl">🎉</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400">Here's how you performed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Card */}
        <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center">
          <h3 className="text-slate-500 dark:text-gray-400 font-medium mb-6 w-full text-left">Your Score</h3>
          
          <div className="relative w-40 h-40 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-white/5"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                strokeDasharray={`${scorePercent}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-bold text-slate-900 dark:text-white">
                {scorePercent}
                <span className="text-2xl text-slate-500 dark:text-gray-400">%</span>
              </span>
            </div>
          </div>
          <p className={`${feedbackColor} font-semibold text-xl`}>{feedbackMsg}</p>
        </div>

        {/* Stats Grid */}
        <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-8 flex flex-col justify-center gap-6">
          <StatRow icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} label="Correct Answers" value={`${correctCount} / ${totalQuestions}`} />
          <div className="w-full h-[1px] bg-slate-100 dark:bg-white/5"></div>
          <StatRow icon={<Clock className="w-5 h-5 text-blue-400" />} label="Time Taken" value={timeTakenStr} />
          <div className="w-full h-[1px] bg-slate-100 dark:bg-white/5"></div>
          <StatRow icon={<Target className="w-5 h-5 text-purple-400" />} label="Accuracy" value={accuracyStr} />
          <div className="w-full h-[1px] bg-slate-100 dark:bg-white/5"></div>
          <StatRow icon={<Trophy className="w-5 h-5 text-yellow-400" />} label="Rank" value={rankStr} />
        </div>
      </div>

      {/* Section Breakdown */}
      <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-8 mt-2">
        <h3 className="text-slate-900 dark:text-white font-semibold mb-8">Section Breakdown</h3>
        
        <div className="flex flex-col gap-6">
          {sectionBreakdown.map((sec, idx) => (
            <SectionBar key={idx} label={sec.label} score={sec.score} percent={sec.percent} color={sec.color} />
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
        {hasData && (
          <button 
            onClick={() => setShowReview(!showReview)}
            className="w-full sm:w-1/2 py-4 rounded-xl border border-purple-500/50 bg-slate-50 dark:bg-[#1a142c] text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-900/30 transition-colors flex items-center justify-center gap-2 cursor-pointer animate-fade-in"
          >
            <Eye className="w-5 h-5" /> {showReview ? "Hide Question Review" : "Review Answers"}
          </button>
        )}
        <Link 
          to="/dashboard/interviews" 
          className={`w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shadow-[0_0_15px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2 ${hasData ? 'sm:w-1/2' : 'w-full'}`}
        >
          Take Another Mock <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Question Review Details */}
      {showReview && hasData && (
        <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-8 mt-2 flex flex-col gap-6">
          <h3 className="text-slate-900 dark:text-white font-semibold text-lg border-b border-gray-200 dark:border-white/5 pb-4">
            Question Review
          </h3>
          
          <div className="flex flex-col gap-6">
            {questions.map((q, qIdx) => {
              const userAns = typedAnswers[q.id] || 'No answer provided (skipped).';
              const evalItem = evaluationResults?.results?.find(r => r.id === q.id) || {};
              const isCorrect = evalItem.isCorrect;
              const feedback = evalItem.feedback || 'No feedback available.';

              return (
                <div key={q.id} className="border-b border-gray-100 dark:border-white/5 pb-6 last:border-none last:pb-0">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="font-semibold text-slate-400 dark:text-gray-500 mt-0.5 shrink-0">
                      Q{qIdx + 1}.
                    </span>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <h4 className="text-slate-800 dark:text-gray-200 font-medium text-base">
                        {q.text}
                      </h4>
                      <div className="flex items-center gap-2">
                        {q.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs text-slate-400 dark:text-gray-500 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 mt-4 ml-8">
                    {/* User Answer */}
                    <div className={`p-4 rounded-xl border ${
                      isCorrect 
                        ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-950 dark:text-emerald-400' 
                        : 'border-red-500/30 bg-red-500/5 text-red-950 dark:text-red-400'
                    }`}>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-1">
                        Your Answer ({evalItem.score ?? 0}/100)
                      </p>
                      <p className="text-sm font-medium">{userAns}</p>
                    </div>

                    {/* AI Feedback */}
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#130f1e]/20 text-slate-700 dark:text-gray-300">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-1">
                        AI Feedback
                      </p>
                      <p className="text-sm font-medium">{feedback}</p>
                    </div>

                    {/* Suggested Answer */}
                    {q.suggestedAnswer && (
                      <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 text-purple-900 dark:text-purple-400">
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-400 dark:text-purple-500 mb-1">
                          Suggested Correct Concept
                        </p>
                        <p className="text-sm font-medium">{q.suggestedAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const StatRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-slate-500 dark:text-gray-400">{label}</span>
    </div>
    <span className="text-slate-900 dark:text-white font-bold">{value}</span>
  </div>
);

const SectionBar = ({ label, score, percent, color }) => (
  <div className="flex items-center justify-between text-sm gap-4">
    <span className="text-slate-600 dark:text-gray-300 w-32 font-medium">{label}</span>
    <span className="text-slate-500 dark:text-gray-500 w-12 text-right">{score}</span>
    <div className="flex-1 h-2 bg-slate-100 dark:bg-[#1a142c] rounded-full overflow-hidden border border-gray-200 dark:border-white/5">
      <div className={`h-full ${color} rounded-full relative`} style={{ width: `${percent}%` }}>
        <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent to-white/30"></div>
      </div>
    </div>
    <span className="text-slate-900 dark:text-white font-bold w-10 text-right">{percent}%</span>
  </div>
);

export default InterviewResults;
