import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  Bot, 
  FileText, 
  History,
  Settings,
  Crown,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onCloseMobile }) => {
  const [showPremium, setShowPremium] = useState(true);
  const navigate = useNavigate();

  const { profile } = useAuth();

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', end: true },
    { name: 'Mock Interviews', icon: Video, path: '/dashboard/interviews' },
    { name: 'AI Practice', icon: Bot, path: '/dashboard/practice' },
    { name: 'Resume Analysis', icon: FileText, path: '/dashboard/resume', badge: 'NEW' },
    { name: 'History', icon: History, path: '/dashboard/history' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] bg-white dark:bg-[#06050a] border-r border-gray-200 dark:border-white/5 flex flex-col justify-between fixed top-16 left-0 transition-colors duration-300">
      <div className="p-6 overflow-y-auto hide-scrollbar flex-1 min-h-0">
        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              onClick={handleLinkClick}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium cursor-pointer ${
                  isActive 
                    ? 'bg-purple-50 dark:bg-[#1a142c] text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30 shadow-[0_0_15px_rgba(107,33,168,0.05)] dark:shadow-[0_0_15px_rgba(107,33,168,0.1)]' 
                    : 'text-slate-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
              {item.badge && (
                <span className="ml-auto text-[0.65rem] font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-gray-200 dark:border-white/5 shrink-0">
        {/* Go Premium Card */}
        {showPremium && (
          <div className="bg-gradient-to-b from-purple-200 to-purple-100 dark:from-[#1a142c] dark:to-[#0d091a] border border-purple-400 dark:border-purple-900/30 rounded-2xl p-4 mb-6 relative overflow-hidden group shadow-lg dark:shadow-none transition-colors duration-300">
            <button 
              onClick={() => setShowPremium(false)}
              className="absolute top-2 right-2 z-20 text-slate-500 hover:text-slate-800 bg-white/50 hover:bg-white/80 dark:text-gray-400 dark:hover:text-white dark:bg-black/20 dark:hover:bg-black/40 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-300/50 dark:bg-purple-600/20 blur-xl rounded-full"></div>
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-500/20 rounded-full flex items-center justify-center mb-2">
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>
              <h4 className="text-slate-900 dark:text-white text-sm font-bold mb-1">Go Premium</h4>
              <p className="text-slate-500 dark:text-gray-400 text-xs mb-3">Unlock unlimited interviews, advanced analytics and more.</p>
              <button 
                onClick={() => {
                  handleLinkClick();
                  navigate('/dashboard/upgrade');
                }}
                className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-sm dark:shadow-none cursor-pointer"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div 
          onClick={() => {
            handleLinkClick();
            navigate('/dashboard/settings');
          }}
          className="flex items-center gap-3 px-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-purple-500/50 transition-colors shrink-0">
            <img src={profile.avatar} alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 dark:text-white text-sm font-medium truncate max-w-[90px]">{profile.fullName}</span>
              {!showPremium && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkClick();
                    navigate('/dashboard/upgrade');
                  }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm hover:shadow transition-all"
                >
                  <Crown className="w-3 h-3" /> PRO
                </button>
              )}
            </div>
            <span className="text-slate-500 dark:text-gray-500 text-xs truncate max-w-[130px]">{profile.email}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
