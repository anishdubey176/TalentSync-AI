import React, { useState } from 'react';
import { MonitorPlay, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const techDomains = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'React Developer',
  'Node.js Developer',
  'Java Developer',
  'Python Developer',
  'Data Scientist',
  'Mobile App Developer',
  'DevOps Engineer',
  'Cloud Architect',
  'Cybersecurity Analyst',
  'AI/ML Engineer',
  'Database Administrator'
];

const nonTechDomains = [
  'HR Manager',
  'Product Manager',
  'Marketing Specialist',
  'Sales Executive',
  'Financial Analyst',
  'Content Writer',
  'Customer Support Representative',
  'Operations Manager',
  'UI/UX Designer',
  'Data Analyst',
  'Business Analyst',
  'Project Manager'
];

const experienceLevels = [
  'Fresher',
  '1-2 Years',
  '3+ Years',
  '5+ Years'
];

const MockInterviews = () => {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState(techDomains[0]);
  const [selectedExperience, setSelectedExperience] = useState(experienceLevels[0]);

  const handleStartInterview = () => {
    navigate('/dashboard/interviews/active', {
      state: {
        domain: selectedDomain,
        experience: selectedExperience
      }
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-10 min-h-[80vh] justify-center items-center">
      {/* Header */}
      <header className="text-center max-w-xl">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-400 bg-clip-text text-transparent animate-pulse">
          AI Mock Interviews
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-base md:text-lg">
          Configure your domain and experience level, and our AI will simulate a live technical or non-technical mock interview for you.
        </p>
      </header>

      {/* Main Configuration Card */}
      <div className="w-full max-w-lg bg-white dark:bg-[#0b0914] shadow-xl dark:shadow-[0_0_50px_rgba(124,58,237,0.05)] border border-gray-200 dark:border-white/5 rounded-3xl p-8 md:p-10 flex flex-col gap-6 transition-all hover:border-purple-500/20">
        <div className="flex flex-col gap-2 text-center">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-2 text-purple-600 dark:text-purple-400 shadow-inner">
            <MonitorPlay className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Configure Interview</h2>
          <p className="text-slate-500 dark:text-gray-400 text-xs">
            Your custom questions will be instantly generated using Google Gemini.
          </p>
        </div>

        <div className="flex flex-col gap-5 mt-2">
          {/* Domain Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Select Domain / Role
            </label>
            <div className="relative">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-[#130f1e] text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer text-sm font-medium appearance-none"
              >
                <optgroup label="Technical Roles" className="bg-slate-50 dark:bg-[#130f1e] text-slate-800 dark:text-gray-200">
                  {techDomains.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </optgroup>
                <optgroup label="Non-Technical & Creative Roles" className="bg-slate-50 dark:bg-[#130f1e] text-slate-800 dark:text-gray-200">
                  {nonTechDomains.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </optgroup>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Experience Dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold tracking-wider text-slate-400 uppercase">
              Years of Experience
            </label>
            <div className="relative">
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-slate-50 dark:bg-[#130f1e] text-slate-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer text-sm font-medium appearance-none"
              >
                {experienceLevels.map(exp => (
                  <option key={exp} value={exp} className="bg-slate-50 dark:bg-[#130f1e]">
                    {exp}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartInterview}
          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] flex items-center justify-center gap-3 cursor-pointer group active:scale-98"
        >
          <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
          Start AI Mock Interview
        </button>
      </div>
    </div>
  );
};

export default MockInterviews;
