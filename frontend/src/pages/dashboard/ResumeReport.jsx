import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const ResumeReport = () => {
  const location = useLocation();
  const { report, fileName } = location.state || {};
  const [activeTab, setActiveTab] = useState('overview');

  const defaultReport = {
    score: 94,
    breakdown: {
      content: 96,
      skills: 92,
      experience: 94,
      formatting: 90
    },
    summary: "Your resume is strong and well-structured. It highlights your skills and experience effectively. A few improvements can make it even better, specifically focusing on adding more quantifiable metrics to your recent roles and ensuring consistent bullet point formatting.",
    strengths: [
      "Clear and professional summary statement",
      "Strong technical skills section matching job descriptions",
      "Good project descriptions explaining responsibilities",
      "Relevant professional work experience highlighted"
    ],
    improvements: [
      "Add more quantifiable metrics (e.g. 'optimized load time by 30%') to recent roles",
      "Include industry standard certifications if applicable",
      "Ensure consistent bullet point punctuation and formatting",
      "Add more team collaboration and soft skills"
    ],
    missingKeywords: [
      "Vite",
      "Next.js",
      "Redux Toolkit",
      "TailwindCSS"
    ],
    atsScore: 92
  };

  const activeReport = report || defaultReport;

  const handleDownload = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TalentSync AI Resume Analysis Report',
          text: `I just analyzed my resume for a role and got a score of ${activeReport.score}/100! Check it out.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Report link copied to clipboard! You can share it anywhere.');
      } catch (err) {
        alert('Failed to copy link.');
      }
    }
  };

  const OverviewContent = () => (
    <div className="bg-white dark:bg-[#0b0914] border border-gray-200 dark:border-white/5 rounded-2xl p-8 flex flex-col gap-8 shadow-sm">
      {/* AI Summary */}
      <div>
        <h3 className="text-slate-900 dark:text-white font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" /> AI Executive Summary
        </h3>
        <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
          {activeReport.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Top Strengths */}
        <div className="bg-[#101827] border border-emerald-950 rounded-xl p-5">
          <h4 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Top Strengths
          </h4>
          <ul className="flex flex-col gap-3">
            {activeReport.strengths.slice(0, 4).map((str, idx) => (
              <ListItem key={idx} text={str} type="success" />
            ))}
          </ul>
        </div>

        {/* Key Improvements */}
        <div className="bg-[#1f1616] border border-orange-950 rounded-xl p-5">
          <h4 className="text-orange-400 font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Key Improvements
          </h4>
          <ul className="flex flex-col gap-3">
            {activeReport.improvements.slice(0, 4).map((imp, idx) => (
              <ListItem key={idx} text={imp} type="warning" />
            ))}
          </ul>
        </div>
      </div>

      {/* ATS Compatibility */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-slate-900 dark:text-white font-semibold flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div> ATS Compatibility
          </h3>
          <span className="text-slate-900 dark:text-white font-bold">{activeReport.atsScore}%</span>
        </div>
        <p className="text-slate-500 dark:text-gray-400 text-sm mb-4">
          Your resume is highly compatible with standard applicant tracking algorithms.
        </p>
        <div className="w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${activeReport.atsScore}%` }}></div>
        </div>
      </div>
    </div>
  );

  const StrengthsContent = () => (
    <div className="flex flex-col gap-6">
      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
        <h3 className="text-emerald-400 font-bold text-lg mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Detailed Strengths
        </h3>
        <p className="text-slate-500 dark:text-gray-400 text-sm">
          These elements in your resume are highly optimized and match the industry target role standards.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeReport.strengths.map((str, idx) => (
          <div key={idx} className="p-5 bg-white dark:bg-[#101827]/40 border border-emerald-900/10 rounded-xl flex items-start gap-4 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-slate-950 dark:text-white font-semibold text-sm mb-1">Strength #{idx + 1}</h4>
              <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{str}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ImprovementsContent = () => (
    <div className="flex flex-col gap-6">
      <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
        <h3 className="text-orange-400 font-bold text-lg mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-400" /> Area Improvements
        </h3>
        <p className="text-slate-500 dark:text-gray-400 text-sm">
          Address these suggestions to optimize your resume impact and increase your overall score.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {activeReport.improvements.map((imp, idx) => (
          <div key={idx} className="p-5 bg-white dark:bg-[#1f1616]/40 border border-orange-950/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h4 className="text-slate-950 dark:text-white font-semibold text-sm mb-1">Improvement #{idx + 1}</h4>
                <p className="text-slate-600 dark:text-gray-400 text-sm leading-relaxed">{imp}</p>
              </div>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2 text-left md:text-right shrink-0">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wide block">Score Boost</span>
              <span className="text-sm font-extrabold text-orange-300 font-mono">+10 Points</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const KeywordsContent = () => (
    <div className="flex flex-col gap-6">
      <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
        <h3 className="text-blue-400 font-bold text-lg mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" /> Missing Keywords
        </h3>
        <p className="text-slate-500 dark:text-gray-400 text-sm">
          These key industry and role terms were not found in your resume. Adding these keywords will significantly improve your ATS screening passes.
        </p>
      </div>
      {activeReport.missingKeywords.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {activeReport.missingKeywords.map((kw, idx) => (
            <span key={idx} className="bg-blue-500/15 border border-blue-500/20 text-blue-400 font-semibold px-4 py-2.5 rounded-xl text-sm shadow-sm transition-all hover:bg-blue-500/25">
              + {kw}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm">No missing keywords found. Your resume matches all essential terms!</p>
      )}
    </div>
  );

  const AtsContent = () => (
    <div className="flex flex-col gap-6 items-center justify-center text-center p-12 bg-white dark:bg-[#0b0914] rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-slate-200 dark:text-white/10"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          />
          <path
            className="text-purple-500"
            strokeDasharray={`${activeReport.atsScore}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex items-baseline gap-1">
          <span className="text-5xl font-extrabold text-slate-900 dark:text-white">{activeReport.atsScore}%</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 max-w-md">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">ATS Compatibility Match</h3>
        <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
          Your resume exhibits an {activeReport.atsScore}% compliance match rate with automated recruiters. Incorporating the suggested changes and missing keywords will push this match rate above 95%!
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto pb-10">
      {/* Dynamic Local Styles for Print optimization */}
      <style dangerouslySetInnerHTML={{__html: `
        @media screen {
          .print-only {
            display: none !important;
          }
        }
        @media print {
          /* Hide sidebar, navigation elements, tabs, buttons, etc. */
          aside, 
          nav, 
          button, 
          a,
          .no-print {
            display: none !important;
          }
          
          /* Full page print overrides */
          body, 
          main,
          .min-h-screen,
          .max-w-5xl {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            background: white !important;
            color: black !important;
          }
          
          /* Background cards reset */
          .bg-white, .dark\\:bg-\\[\\#0b0914\\] {
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
          }
          
          /* Force standard dark elements to black text */
          h1, h2, h3, h4, span, p, li {
            color: #000000 !important;
          }
          
          .text-slate-500, .dark\\:text-gray-400, .text-slate-600, .dark\\:text-gray-300 {
            color: #4a5568 !important;
          }
          
          .print-only {
            display: block !important;
          }
          
          .print-section {
            margin-bottom: 2rem !important;
            page-break-inside: avoid !important;
          }
          
          .page-break {
            page-break-before: always !important;
          }
        }
      `}} />

      {/* Header */}
      <div className="flex flex-col gap-4 no-print">
        <Link to="/dashboard/resume" className="text-slate-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white flex items-center gap-2 text-sm transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analysis Report</h1>
            <p className="text-xs text-slate-500 dark:text-gray-500 mt-1">
              File: <span className="font-semibold">{fileName || "Anish_Dubey_Resume.pdf"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Print-only Header (shown only in PDF print layout) */}
      <div className="print-only mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold text-black">TalentSync AI - Resume Analysis Report</h1>
        <p className="text-sm text-gray-600 mt-1">
          Analyzed Resume File: <strong>{fileName || "Anish_Dubey_Resume.pdf"}</strong>
        </p>
      </div>

      {/* Score Card */}
      <div className="bg-white dark:bg-[#0b0914] border border-gray-200 dark:border-white/5 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-12 shadow-sm">
        {/* Overall Score */}
        <div className="flex flex-col">
          <h3 className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-6">Overall Score</h3>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-white/10"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-emerald-400"
                  strokeDasharray={`${activeReport.score}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900 dark:text-white">{activeReport.score}</span>
                <span className="text-slate-500 dark:text-gray-500 text-sm">/100</span>
              </div>
            </div>
            <div>
              <p className="text-emerald-400 font-semibold text-lg mb-1">
                {activeReport.score >= 90 ? 'Excellent Resume!' : activeReport.score >= 75 ? 'Good Resume' : 'Needs Optimization'}
              </p>
              <p className="text-slate-500 dark:text-gray-500 text-sm max-w-[200px]">
                {activeReport.score >= 90 ? 'Your resume is highly optimized and ready for applications.' : 'Addressing minor improvements will boost your response rate.'}
              </p>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="flex flex-col justify-center">
          <h3 className="text-slate-500 dark:text-gray-400 text-sm font-medium mb-6">Score Breakdown</h3>
          <div className="flex flex-col gap-4">
            <ProgressBar label="Content" score={activeReport.breakdown.content} color="bg-emerald-400" />
            <ProgressBar label="Skills" score={activeReport.breakdown.skills} color="bg-blue-400" />
            <ProgressBar label="Experience" score={activeReport.breakdown.experience} color="bg-purple-400" />
            <ProgressBar label="Formatting" score={activeReport.breakdown.formatting} color="bg-yellow-400" />
          </div>
        </div>
      </div>

      {/* Screen Tabs Selector */}
      <div className="flex items-center gap-8 border-b border-gray-200 dark:border-white/5 pb-4 mt-4 no-print">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`font-medium relative cursor-pointer pb-1 transition-colors ${
            activeTab === 'overview' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Overview
          {activeTab === 'overview' && (
            <span className="absolute -bottom-[18px] left-0 w-full h-[2px] bg-purple-500"></span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('strengths')}
          className={`font-medium relative cursor-pointer pb-1 transition-colors ${
            activeTab === 'strengths' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Strengths
          {activeTab === 'strengths' && (
            <span className="absolute -bottom-[18px] left-0 w-full h-[2px] bg-purple-500"></span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('improvements')}
          className={`font-medium relative cursor-pointer pb-1 transition-colors ${
            activeTab === 'improvements' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Improvements
          {activeTab === 'improvements' && (
            <span className="absolute -bottom-[18px] left-0 w-full h-[2px] bg-purple-500"></span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('keywords')}
          className={`font-medium relative cursor-pointer pb-1 transition-colors ${
            activeTab === 'keywords' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          Missing Keywords
          {activeTab === 'keywords' && (
            <span className="absolute -bottom-[18px] left-0 w-full h-[2px] bg-purple-500"></span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('ats')}
          className={`font-medium relative cursor-pointer pb-1 transition-colors ${
            activeTab === 'ats' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          ATS Score
          {activeTab === 'ats' && (
            <span className="absolute -bottom-[18px] left-0 w-full h-[2px] bg-purple-500"></span>
          )}
        </button>
      </div>

      {/* Screen Mode Active Tab Content (Hidden when printing) */}
      <div className="min-h-[300px] no-print">
        {activeTab === 'overview' && <OverviewContent />}
        {activeTab === 'strengths' && <StrengthsContent />}
        {activeTab === 'improvements' && <ImprovementsContent />}
        {activeTab === 'keywords' && <KeywordsContent />}
        {activeTab === 'ats' && <AtsContent />}
      </div>

      {/* Print Mode Full Layout (Shown only in printed PDF) */}
      <div className="print-only flex flex-col gap-8">
        <div className="print-section">
          <OverviewContent />
        </div>
        <div className="page-break" />
        <div className="print-section">
          <StrengthsContent />
        </div>
        <div className="page-break" />
        <div className="print-section">
          <ImprovementsContent />
        </div>
        <div className="page-break" />
        <div className="print-section">
          <KeywordsContent />
        </div>
        <div className="page-break" />
        <div className="print-section">
          <AtsContent />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ProgressBar = ({ label, score, color }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-slate-600 dark:text-gray-300 w-24 text-left">{label}</span>
    <div className="flex-1 mx-4 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }}></div>
    </div>
    <span className="text-slate-950 dark:text-white font-medium w-12 text-right">{score}/100</span>
  </div>
);

const ListItem = ({ text, type }) => (
  <li className="flex items-start gap-3 text-sm">
    {type === 'success' ? (
      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
    ) : (
      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0 ml-1.5 mr-1" />
    )}
    <span className="text-slate-600 dark:text-gray-300 leading-snug">{text}</span>
  </li>
);

export default ResumeReport;
