import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Moon,
  Sun,
  TrendingUp, 
  Target, 
  Zap, 
  AlertCircle,
  ArrowRight,
  MonitorPlay
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Overview = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const { profile: fullProfile } = useAuth();
  const profile = {
    fullName: fullProfile?.fullName ? fullProfile.fullName.split(' ')[0] : 'Candidate',
    avatar: fullProfile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Candidate"
  };

  const [history, setHistory] = useState([]);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));

    // Load history
    const list = JSON.parse(localStorage.getItem('ts_interview_history') || '[]');
    setHistory(list);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  // Calculations from real history
  const totalMocks = history.length;
  
  const avgScore = totalMocks > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.score || 0), 0) / totalMocks)
    : 0;

  // Compute skill strengths & improvements from all histories
  let strongSkillsCount = 0;
  let improveSkillsCount = 0;
  
  if (totalMocks > 0) {
    const tagScores = {};
    history.forEach(item => {
      if (item.questions && item.evaluationResults && item.evaluationResults.results) {
        item.questions.forEach(q => {
          const evalResult = item.evaluationResults.results.find(r => r.id === q.id) || {};
          const score = evalResult.score || 0;
          q.tags.forEach(tag => {
            if (!tagScores[tag]) tagScores[tag] = { sum: 0, count: 0 };
            tagScores[tag].sum += score;
            tagScores[tag].count += 1;
          });
        });
      }
    });

    Object.keys(tagScores).forEach(tag => {
      const avg = tagScores[tag].sum / tagScores[tag].count;
      if (avg >= 75) strongSkillsCount += 1;
      else improveSkillsCount += 1;
    });
  } else {
    // If no history exists, metrics are 0 (no mock fallback values)
    strongSkillsCount = 0;
    improveSkillsCount = 0;
  }

  // Progress chart data
  const chartData = totalMocks > 0
    ? history.slice(0, 7).reverse().map((item, idx) => ({
        name: item.role.length > 15 ? `${item.role.slice(0, 12)}...` : item.role,
        score: item.score
      }))
    : [];

  return (
    <div className="flex flex-col gap-8 w-full pb-10">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            Welcome back, {profile.fullName} <span className="text-2xl">👋</span>
          </h1>
          <p className="text-slate-500 dark:text-gray-400">Let's continue your interview preparation journey.</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Mocks Taken" 
          value={totalMocks} 
          icon={<MonitorPlay className="w-5 h-5 text-purple-600 dark:text-purple-400" />} 
          trend={totalMocks > 0 ? "Real reports logged" : "Get started now"}
          trendColor={totalMocks > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-purple-500"}
          bg="bg-purple-50 dark:bg-[#1a142c]"
        />
        <StatCard 
          title="Avg. Score" 
          value={`${avgScore}%`} 
          icon={<TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />} 
          trend={totalMocks > 0 ? "Averages updated" : "Complete first test"}
          trendColor={totalMocks > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-blue-500"}
          bg="bg-blue-50 dark:bg-[#131b2c]"
        />
        <StatCard 
          title="Strong Skills" 
          value={strongSkillsCount} 
          icon={<Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />} 
          trend="Score >= 75%"
          trendColor="text-slate-500 dark:text-gray-400"
          bg="bg-emerald-50 dark:bg-[#102422]"
        />
        <StatCard 
          title="To Improve" 
          value={improveSkillsCount} 
          icon={<AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />} 
          trend="Score < 75%"
          trendColor="text-slate-500 dark:text-gray-400"
          bg="bg-orange-50 dark:bg-[#241a1a]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0b0914] border border-slate-300 dark:border-white/5 rounded-2xl p-6 shadow-lg dark:shadow-none transition-colors duration-300 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Your Progress</h3>
          </div>
          
          <div className="h-80 w-full flex items-center justify-center">
            {totalMocks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                  <XAxis dataKey="name" stroke={isDark ? "#6b7280" : "#9ca3af"} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={isDark ? "#6b7280" : "#9ca3af"} domain={[0, 100]} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#130f1e' : '#ffffff', 
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '12px',
                      color: isDark ? '#ffffff' : '#000000'
                    }} 
                  />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-3 p-6">
                <div className="w-12 h-12 bg-purple-50 dark:bg-[#1a142c] rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Progress Data</h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400 max-w-[250px] mt-1">
                    Take your first mock interview to populate your progress and performance analytics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Info */}
        <div className="bg-white dark:bg-[#0b0914] border border-slate-300 dark:border-white/5 rounded-2xl p-6 shadow-lg dark:shadow-none flex flex-col justify-between transition-colors duration-300">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Start Preparing</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              Accelerate your engineering interview preparation. Take specialized AI mock interviews, practice voice synthesis chats, or analyze your resume format.
            </p>
            <div className="flex flex-col gap-4">
              <Link to="/dashboard/interviews" className="flex items-center justify-between p-4 rounded-xl bg-purple-50 dark:bg-[#1a142c] hover:bg-purple-100 dark:hover:bg-[#251b3d] transition-colors border border-purple-100 dark:border-purple-900/30">
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Mock Interviews</span>
                <ArrowRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </Link>
              <Link to="/dashboard/practice" className="flex items-center justify-between p-4 rounded-xl bg-blue-50 dark:bg-[#131b2c] hover:bg-blue-100 dark:hover:bg-[#1b273d] transition-colors border border-blue-100 dark:border-blue-900/30">
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">AI Practice Chat</span>
                <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, trendColor, bg }) => (
  <div className={`p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none flex flex-col gap-4 ${bg}`}>
    <div className="flex items-center justify-between">
      <span className="text-slate-500 dark:text-gray-400 text-sm font-medium">{title}</span>
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/20 flex items-center justify-center border border-gray-100 dark:border-white/5 shadow-sm">
        {icon}
      </div>
    </div>
    <div>
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">{value}</h2>
      <span className={`text-xs font-semibold ${trendColor}`}>{trend}</span>
    </div>
  </div>
);

export default Overview;
