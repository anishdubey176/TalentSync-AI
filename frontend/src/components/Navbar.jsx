import React, { useState, useEffect } from 'react';
import { Sparkles, Sun, Moon, FileText, ChevronDown, LogOut, User, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  
  const { isLoggedIn, profile, login, logout } = useAuth();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Clear errors when modal toggles or inputs change
  useEffect(() => {
    setLoginError('');
  }, [emailInput, passwordInput, showLoginDropdown]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleSignIn = () => {
    setLoginError('');
    const trimmedEmail = emailInput.trim();
    
    if (!trimmedEmail) {
      setLoginError('Email address is required.');
      return;
    }

    // Email format regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setLoginError('Please enter a valid email address.');
      return;
    }

    if (passwordInput.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }

    const result = login(trimmedEmail, passwordInput);
    if (!result.success) {
      setLoginError(result.error);
      return;
    }

    setShowLoginDropdown(false);
    setEmailInput('');
    setPasswordInput('');
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-[#06050a] border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-6 z-50 transition-colors duration-300">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => window.dispatchEvent(new Event('toggle_sidebar'))}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Sparkles className="text-purple-600 w-6 h-6" />
          <span className="text-slate-900 dark:text-white text-lg font-bold tracking-tight">
            TalentSync <span className="text-purple-600">AI</span>
          </span>
        </Link>
      </div>
      
      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard/resume')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-900/50 text-purple-600 dark:text-purple-400 font-medium text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Resume Analysis</span>
        </button>

        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {isLoggedIn ? (
          <div className="relative">
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity pl-4 border-l border-gray-200 dark:border-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-white/10">
                <img src={profile.avatar} alt="User" className="w-full h-full object-cover" />
              </div>
              <span className="text-slate-900 dark:text-white text-sm font-medium hidden sm:block">{profile.fullName}</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-gray-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#130f1e] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="p-4 border-b border-gray-100 dark:border-white/5">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{profile.fullName}</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5 truncate">{profile.email}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/dashboard/settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors text-left font-medium cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button 
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-left font-medium mt-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative pl-4 border-l border-gray-200 dark:border-white/10 flex items-center">
            <button 
              onClick={() => setShowLoginDropdown(!showLoginDropdown)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-purple-900/20 cursor-pointer"
            >
              Login
            </button>

            {showLoginDropdown && (
              <div className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-[#130f1e] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-50 p-5 animate-fade-in animate-in fade-in slide-in-from-top-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Welcome back</h3>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-4">Sign in to your account</p>
                
                <div className="flex flex-col gap-4">
                  {loginError && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold p-2.5 rounded-lg animate-fade-in">
                      {loginError}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1.5">Email</label>
                    <input 
                      type="email" 
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1.5">Password</label>
                    <input 
                      type="password" 
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                  <button 
                    onClick={handleSignIn}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2 shadow-sm shadow-purple-900/20 cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
