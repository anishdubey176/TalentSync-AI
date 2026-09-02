import React, { useState, useRef, useEffect } from 'react';
import { User, Settings as SettingsIcon, CreditCard, Shield, Camera, Mail, Briefcase, Globe, AlertTriangle, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);

  const { profile: currentAuthProfile, updateProfile, logout } = useAuth();
  
  // Profile Form States
  const [profile, setProfile] = useState(currentAuthProfile || {});
  const [fullName, setFullName] = useState(currentAuthProfile?.fullName || '');
  const [email, setEmail] = useState(currentAuthProfile?.email || '');
  const [role, setRole] = useState(currentAuthProfile?.role || '');
  const [locationVal, setLocationVal] = useState(currentAuthProfile?.location || '');
  const [avatar, setAvatar] = useState(currentAuthProfile?.avatar || '');
  const [showToast, setShowToast] = useState(false);

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (currentAuthProfile) {
      setProfile(currentAuthProfile);
      setFullName(currentAuthProfile.fullName || '');
      setEmail(currentAuthProfile.email || '');
      setRole(currentAuthProfile.role || '');
      setLocationVal(currentAuthProfile.location || '');
      setAvatar(currentAuthProfile.avatar || '');
    }
  }, [currentAuthProfile]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Max size is 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    const nameSeed = fullName ? fullName.split(' ')[0] : 'Anish';
    setAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${nameSeed}`);
  };

  const handleSaveChanges = () => {
    const updatedProfile = {
      ...profile,
      fullName,
      email,
      role,
      location: locationVal,
      avatar
    };

    updateProfile(updatedProfile);

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleUpdatePassword = () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword) {
      setPasswordError('Please fill in both password fields.');
      return;
    }
    
    if (currentPassword !== profile.password) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    const updatedProfile = { ...profile, password: newPassword };
    updateProfile(updatedProfile);
    
    setPasswordSuccess('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleDeleteAccount = () => {
    localStorage.removeItem('ts_interview_history');
    localStorage.removeItem('ts_resume_history');
    
    logout();
    
    // Navigate back to the main landing page
    navigate('/');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-10">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-gray-400">Manage your account preferences and personal information.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-2 flex flex-row md:flex-col gap-1 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/30'
                      : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 animate-fade-in relative">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h2>
              
              {/* Avatar Upload */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-white/5">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl bg-purple-100 dark:bg-purple-900/30 overflow-hidden border-2 border-white dark:border-gray-800 shadow-md">
                    <img src={avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Anish"} alt="User Avatar" className="w-full h-full object-cover" />
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Change</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="text-slate-900 dark:text-white font-medium mb-1">Profile Picture</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-xs mb-3">PNG, JPG up to 5MB</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      Upload New
                    </button>
                    <button 
                      onClick={handleRemoveAvatar}
                      className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 text-xs font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" /> Current Role
                  </label>
                  <input 
                    type="text" 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1.5 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5" /> Location
                  </label>
                  <input 
                    type="text" 
                    value={locationVal}
                    onChange={(e) => setLocationVal(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                  />
                </div>
              </div>

              {/* Save Button & Toast */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/5">
                <div>
                  {showToast && (
                    <div className="flex items-center gap-2 text-emerald-500 dark:text-emerald-400 text-sm font-semibold animate-fade-in">
                      <Check className="w-4 h-4" /> Settings saved successfully!
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleSaveChanges}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-purple-900/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">App Preferences</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/5">
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-medium mb-1">Email Notifications</h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Receive weekly reports and interview tips.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/5">
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-medium mb-1">Dark Mode</h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Use dark theme across the application.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-medium mb-1">Default Coding Language</h3>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">Preferred language for technical questions.</p>
                  </div>
                  <select className="bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50">
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>Java</option>
                    <option>C++</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Billing & Subscription</h2>
              
              <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-900/30 rounded-xl p-6 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/30 dark:bg-purple-600/20 blur-2xl rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Current Plan</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Free Tier</h3>
                    <p className="text-slate-600 dark:text-purple-300 text-sm">Limited to 2 mock interviews per month.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/dashboard/upgrade')}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-purple-900/20 whitespace-nowrap cursor-pointer"
                  >
                    Upgrade to PRO
                  </button>
                </div>
              </div>

              <h3 className="text-slate-900 dark:text-white font-medium mb-4">Payment Methods</h3>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-white/10 rounded-xl mb-4 bg-slate-50 dark:bg-[#130f1e]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">VISA</div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-medium text-sm">Visa ending in 4242</p>
                    <p className="text-slate-500 dark:text-gray-500 text-xs">Expires 12/28</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                  Remove
                </button>
              </div>
              <button className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline cursor-pointer">
                + Add Payment Method
              </button>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl p-6 md:p-8 animate-fade-in">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-slate-900 dark:text-white font-medium mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1.5">Current Password</label>
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setPasswordError('');
                          setPasswordSuccess('');
                        }}
                        placeholder="••••••••" 
                        className="w-full bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-gray-300 mb-1.5">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setPasswordError('');
                          setPasswordSuccess('');
                        }}
                        placeholder="••••••••" 
                        className="w-full bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-purple-500/50 transition-colors" 
                      />
                    </div>
                    
                    {passwordError && (
                      <div className="text-red-500 dark:text-red-400 text-xs font-semibold animate-fade-in">
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="text-emerald-500 dark:text-emerald-400 text-xs font-semibold animate-fade-in">
                        {passwordSuccess}
                      </div>
                    )}

                    <button 
                      onClick={handleUpdatePassword}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-6 rounded-xl transition-colors shadow-sm cursor-pointer"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-white/5">
                  <h3 className="text-slate-900 dark:text-white font-medium mb-4">Danger Zone</h3>
                  <div className="border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded-xl p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <p className="text-red-800 dark:text-red-400 font-medium mb-1 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Delete Account
                      </p>
                      <p className="text-red-600/80 dark:text-red-400/80 text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/20 px-4 py-2 rounded-xl animate-fade-in">
                        <span className="text-xs font-bold text-red-400">Confirm wipe?</span>
                        <button 
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Yes, Delete
                        </button>
                        <button 
                          onClick={() => setIsConfirmingDelete(false)}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsConfirmingDelete(true)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                      >
                        Delete Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
