import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, Sparkles, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResumeAnalysis = () => {
  const navigate = useNavigate();
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('ts_recent_analyses') || '[]');
    setRecentAnalyses(list);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setErrorMsg('');
    } else if (file) {
      setErrorMsg('Please upload a PDF file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setErrorMsg('');
    } else if (file) {
      setErrorMsg('Please drop a PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMsg('Please choose or drop a resume PDF file first.');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('roleDescription', roleDescription);

      const response = await fetch('http://localhost:5000/api/resume/analyze', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze resume.');
      }

      const data = await response.json();

      // Save to recent analysis history in local storage
      const newAnalysis = {
        id: Date.now(),
        fileName: selectedFile.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        score: data.score,
        report: data
      };

      const existing = JSON.parse(localStorage.getItem('ts_recent_analyses') || '[]');
      const updated = [newAnalysis, ...existing];
      localStorage.setItem('ts_recent_analyses', JSON.stringify(updated));
      setRecentAnalyses(updated);

      navigate('/dashboard/resume/report', {
        state: {
          report: data,
          fileName: selectedFile.name
        }
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-10">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Resume Analysis</h1>
        <p className="text-slate-500 dark:text-gray-400">Upload your resume and get AI-powered insights to improve it.</p>
      </header>

      {/* Main Upload Box */}
      <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-8 flex flex-col md:flex-row gap-8">
        
        {/* Left: Drag & Drop */}
        <div className="flex-1">
          <div 
            className="border-2 border-dashed border-purple-300 dark:border-purple-900/50 bg-purple-50 dark:bg-[#130f1e] rounded-2xl flex flex-col items-center justify-center p-10 h-64 hover:border-purple-400 dark:hover:border-purple-500/50 transition-colors cursor-pointer group relative overflow-hidden"
            onClick={() => !isAnalyzing && fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input 
              type="file" 
              accept=".pdf" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              disabled={isAnalyzing}
            />
            
            {selectedFile ? (
              <>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-slate-900 dark:text-white font-medium mb-1 truncate w-full text-center px-2">{selectedFile.name}</p>
                <p className="text-slate-500 dark:text-gray-500 text-sm mb-4">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                {!isAnalyzing && (
                  <button 
                    className="text-purple-600 dark:text-purple-400 text-sm hover:underline font-medium z-10" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setSelectedFile(null); 
                      setErrorMsg('');
                      if(fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Remove or change file
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-slate-900 dark:text-white font-medium mb-1">Drag & drop your resume here</p>
                <p className="text-slate-500 dark:text-gray-500 text-sm mb-4">or</p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-lg transition-colors pointer-events-none">
                  Choose PDF File
                </button>
              </>
            )}
          </div>
          <p className="text-center text-slate-500 dark:text-gray-500 text-xs mt-3">Supports PDF (Max 10MB)</p>
        </div>

        {/* Right: Textarea */}
        <div className="flex-1 flex flex-col">
          <label className="text-slate-900 dark:text-white text-sm font-medium mb-2">
            Tell us about the role you're targeting...
          </label>
          <p className="text-slate-500 dark:text-gray-400 text-xs mb-3">
            This helps our AI give more relevant suggestions.
          </p>
          <div className="flex-1 relative">
            <textarea 
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              disabled={isAnalyzing}
              className="w-full h-full min-h-[160px] bg-slate-100 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 resize-none disabled:opacity-75"
              placeholder="e.g. I am applying for a Frontend Developer role with 2+ years of experience..."
              maxLength={500}
            ></textarea>
            <span className="absolute bottom-4 right-4 text-slate-500 dark:text-gray-500 text-xs">
              {roleDescription.length}/500 characters
            </span>
          </div>
        </div>
      </div>

      {/* Analyze Button */}
      <button 
        onClick={handleAnalyze}
        disabled={isAnalyzing || !selectedFile}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20 text-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer animate-fade-in"
      >
        {isAnalyzing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Analyzing Resume...
          </>
        ) : (
          <>
            Analyze Resume <Sparkles className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Inline Error Display */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-sm font-medium flex items-center gap-2.5 animate-pulse">
          <span className="text-base">⚠️</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Recent Analyses */}
      {recentAnalyses.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Your recent analyses</h3>
          <div className="flex flex-col gap-4">
            {recentAnalyses.slice(0, 5).map((item) => {
              const isConfirming = deletingId === item.id;
              return (
                <div key={item.id} className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-5 flex items-center justify-between hover:border-purple-200 dark:hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 dark:bg-[#1a142c] rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-medium">{item.fileName}</h4>
                      <p className="text-slate-500 dark:text-gray-500 text-xs">Analyzed on {item.date} • {item.score}% Score</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {isConfirming ? (
                      <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 px-3.5 py-1.5 rounded-xl animate-fade-in">
                        <span className="text-xs font-semibold text-red-500 dark:text-red-400">Delete this report?</span>
                        <button 
                          onClick={() => {
                            const updated = recentAnalyses.filter(x => x.id !== item.id);
                            localStorage.setItem('ts_recent_analyses', JSON.stringify(updated));
                            setRecentAnalyses(updated);
                            setDeletingId(null);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Yes
                        </button>
                        <button 
                          onClick={() => setDeletingId(null)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => navigate('/dashboard/resume/report', { state: { report: item.report, fileName: item.fileName } })}
                          className="flex items-center gap-2 text-sm font-medium bg-slate-50 dark:bg-[#1a142c] text-slate-900 dark:text-white px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#251b3d] border border-gray-200 dark:border-white/5 transition-colors cursor-pointer"
                        >
                          View Report
                        </button>
                        <button 
                          onClick={() => setDeletingId(item.id)}
                          className="p-2.5 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          title="Delete Analysis"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
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

export default ResumeAnalysis;
