import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, Award, TrendingUp, MonitorPlay, Code, Database, Search, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('ts_interview_history') || '[]');
    setHistoryList(list);
  }, []);

  // Calculations
  const totalInterviews = historyList.length;
  
  const averageScore = totalInterviews > 0 
    ? Math.round(historyList.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalInterviews) 
    : 0;

  const totalSeconds = historyList.reduce((acc, curr) => acc + (curr.timeTaken || 0), 0);
  const timeSpentHours = totalSeconds > 0 ? (totalSeconds / 3600).toFixed(1) : '0.0';

  const handleDelete = (id) => {
    const updated = historyList.filter(item => item.id !== id);
    localStorage.setItem('ts_interview_history', JSON.stringify(updated));
    setHistoryList(updated);
    setDeletingId(null);
  };

  const handleReview = (item) => {
    navigate('/dashboard/interviews/results', {
      state: {
        questions: item.questions,
        typedAnswers: item.typedAnswers,
        timeTaken: item.timeTaken,
        domain: item.role,
        experience: item.experience,
        evaluationResults: item.evaluationResults
      }
    });
  };

  const getRoleIcon = (role) => {
    const r = role.toLowerCase();
    if (r.includes('front') || r.includes('react') || r.includes('web') || r.includes('js')) {
      return <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
    if (r.includes('back') || r.includes('database') || r.includes('sql') || r.includes('devops')) {
      return <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
    return <MonitorPlay className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
  };

  const getRoleIconStyles = (role) => {
    const r = role.toLowerCase();
    if (r.includes('front') || r.includes('react') || r.includes('web') || r.includes('js')) {
      return {
        bg: "bg-blue-50 dark:bg-blue-500/20",
        border: "border-blue-100 dark:border-blue-500/30"
      };
    }
    if (r.includes('back') || r.includes('database') || r.includes('sql') || r.includes('devops')) {
      return {
        bg: "bg-purple-50 dark:bg-purple-500/20",
        border: "border-purple-100 dark:border-purple-500/30"
      };
    }
    return {
      bg: "bg-emerald-50 dark:bg-emerald-500/20",
      border: "border-emerald-100 dark:border-emerald-500/30"
    };
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 65) return "text-blue-500 dark:text-blue-400";
    return "text-yellow-500 dark:text-yellow-400";
  };

  const formatDuration = (secs) => {
    if (!secs) return '0s';
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    if (minutes > 0) {
      return `${minutes}m ${seconds > 0 ? `${seconds}s` : ''}`;
    }
    return `${seconds}s`;
  };

  const filteredList = historyList.filter(item => 
    item.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.experience && item.experience.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-8 w-full pb-10 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Interview History</h1>
          <p className="text-slate-500 dark:text-gray-400">Track your past mock interviews and review your scores.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..." 
              className="pl-9 pr-4 py-2 bg-white dark:bg-[#130f1e] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500/50 text-slate-900 dark:text-white transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 dark:bg-purple-900/20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-purple-50 dark:bg-[#1a142c] rounded-xl flex items-center justify-center border border-purple-100 dark:border-purple-900/30">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Total Interviews</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalInterviews}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 dark:bg-emerald-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Average Score</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{averageScore}%</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 dark:bg-blue-900/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-1">Time Spent</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{timeSpentHours} hrs</h3>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex flex-col gap-4">
        {filteredList.length === 0 ? (
          <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-purple-50 dark:bg-[#1a142c] rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
              <MonitorPlay className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Mock Interviews Found</h3>
              <p className="text-slate-500 dark:text-gray-400 text-sm max-w-sm mt-1">
                You haven't completed any mock interviews yet. Complete your first mock interview to see your detailed reports and scores here!
              </p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/interviews')}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] cursor-pointer"
            >
              Start a Mock Interview
            </button>
          </div>
        ) : (
          filteredList.map((item) => {
            const iconStyles = getRoleIconStyles(item.role);
            const isConfirming = deletingId === item.id;
            return (
              <div 
                key={item.id} 
                className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-purple-300 dark:hover:border-purple-900/50 transition-colors group"
              >
                {/* Left: Info */}
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 border ${iconStyles.bg} ${iconStyles.border}`}>
                    {getRoleIcon(item.role)}
                  </div>
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {item.role} <span className="text-xs font-normal text-slate-400 dark:text-gray-500">({item.experience})</span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
                      <span className="text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> {item.date} {item.time && `at ${item.time}`}
                      </span>
                      <span className="text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {formatDuration(item.timeTaken)}
                      </span>
                      <span className="text-slate-500 dark:text-gray-400">
                        {item.questions ? item.questions.length : 0} Questions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Score & Action */}
                <div className="flex items-center justify-between md:justify-end gap-6 md:gap-8 border-t border-gray-100 dark:border-white/5 md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-slate-500 dark:text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">Score</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold ${getScoreColor(item.score)}`}>{item.score}</span>
                      <span className="text-slate-400 dark:text-gray-500 text-sm font-medium">/ 100</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isConfirming ? (
                      <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/20 px-3 py-1.5 rounded-xl animate-fade-in">
                        <span className="text-xs font-semibold text-red-400">Delete?</span>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded transition-colors cursor-pointer"
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setDeletingId(null)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold px-2 py-0.5 rounded transition-colors cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleReview(item)}
                          className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 dark:bg-[#1a142c] dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 text-slate-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Review <ChevronRight className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingId(item.id)}
                          className="p-2.5 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
