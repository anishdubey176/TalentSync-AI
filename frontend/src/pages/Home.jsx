import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="h-full w-full">
      <main className="max-w-7xl mx-auto px-8 pt-8 pb-16 flex flex-col items-center text-center">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tight text-slate-900 dark:text-white transition-colors">
            Practice <span className="text-[#8b5cf6]">With AI.</span><br />
            Perform With Confidence.
          </h1>
          
          <p className="text-slate-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium transition-colors">
            AI-powered mock interviews, resume analysis and personalized feedback
            to help you ace your next interview.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8">
            <Link to="/dashboard/interviews" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#6f3fe0] hover:bg-[#5b32bf] text-white px-8 py-3.5 rounded-xl text-[1.05rem] font-medium transition-all shadow-lg shadow-purple-900/20">
              Start Practicing Now
              <ArrowRight className="w-5 h-5 ml-1" />
            </Link>
            
            <Link to="/dashboard" className="w-full sm:w-auto flex items-center justify-center gap-2 text-purple-600 dark:text-[#9f7aea] hover:text-purple-800 dark:hover:text-[#b794f4] font-medium transition-colors text-[1.05rem]">
              Explore Features
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full max-w-5xl h-[1px] bg-slate-200 dark:bg-white/5 mt-16 mb-16 transition-colors"></div>

        {/* Trusted By Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full"
        >
          <p className="text-slate-500 dark:text-gray-500 text-sm font-medium mb-10 transition-colors">
            Trusted by 5,000+ job seekers from
          </p>
          
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default text-slate-900 dark:text-white">
            {/* Minimal Text Logos representing the brands */}
            <span className="text-2xl font-bold tracking-[-0.05em] font-sans">Google</span>
            <span className="flex items-center gap-2 text-xl font-semibold font-sans tracking-tight">
              <div className="grid grid-cols-2 gap-[2px]">
                <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white transition-colors"></div>
                <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white transition-colors"></div>
                <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white transition-colors"></div>
                <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-white transition-colors"></div>
              </div>
              Microsoft
            </span>
            <span className="text-3xl font-bold tracking-tighter lowercase font-sans">amazon</span>
            <span className="text-2xl font-bold tracking-tight font-sans">Deloitte.</span>
            <span className="text-2xl font-medium tracking-tight font-sans">Infosys</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
