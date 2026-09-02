import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import ResumeAnalysis from './pages/dashboard/ResumeAnalysis';
import ResumeReport from './pages/dashboard/ResumeReport';
import MockInterviews from './pages/dashboard/MockInterviews';
import ActiveInterview from './pages/dashboard/ActiveInterview';
import InterviewResults from './pages/dashboard/InterviewResults';
import AIPractice from './pages/dashboard/AIPractice';
import Upgrade from './pages/dashboard/Upgrade';
import History from './pages/dashboard/History';
import Settings from './pages/dashboard/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#06050a] text-slate-900 dark:text-white font-sans selection:bg-purple-500/30 transition-colors duration-300">
        <Navbar />
        <div className="flex-1 mt-16 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="resume" element={<ResumeAnalysis />} />
              <Route path="resume/report" element={<ResumeReport />} />
              <Route path="interviews" element={<MockInterviews />} />
              <Route path="interviews/active" element={<ActiveInterview />} />
              <Route path="interviews/results" element={<InterviewResults />} />
              <Route path="practice" element={<AIPractice />} />
              <Route path="history" element={<History />} />
              <Route path="settings" element={<Settings />} />
              <Route path="upgrade" element={<Upgrade />} />
              
              {/* Fallback for undeveloped pages */}
              <Route path="*" element={<div className="text-white p-8">Page Coming Soon</div>} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
