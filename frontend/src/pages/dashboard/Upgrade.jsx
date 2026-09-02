import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Video, 
  TrendingUp, 
  FileText, 
  Lock,
  Infinity,
  BrainCircuit,
  Rocket
} from 'lucide-react';

const Upgrade = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. You'll retain access to premium features until the end of your current billing period."
    },
    {
      question: "Will I get a refund?",
      answer: "We offer a 7-day money-back guarantee if you are not satisfied with the premium features. No questions asked."
    },
    {
      question: "How does the yearly plan work?",
      answer: "The yearly plan is billed upfront for 12 months, giving you a 30% discount compared to the monthly plan."
    },
    {
      question: "Is my payment information secure?",
      answer: "Absolutely. We use Razorpay, an industry-standard payment processor, to handle all transactions. We do not store your credit card information."
    }
  ];

  return (
    <div className="animate-fade-in pb-10">
      {/* Header Section */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center md:justify-start gap-2">
          Upgrade to <span className="text-purple-600 dark:text-purple-400">Premium</span> <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </h1>
        <p className="text-slate-500 dark:text-gray-400 max-w-2xl text-sm md:text-base">
          Unlock unlimited interviews, in-depth AI feedback and everything you need to ace your dream job.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center md:justify-start gap-4 mt-8">
          <div className="bg-slate-100 dark:bg-[#1a142c] p-1 rounded-full flex items-center border border-gray-200 dark:border-white/10">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'monthly' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                billingCycle === 'yearly' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Yearly
            </button>
          </div>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/30">
            Save 30%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Free Plan */}
          <div 
            className={`bg-white dark:bg-[#0b0914] rounded-3xl p-8 flex flex-col h-fit transition-all duration-300 cursor-pointer ${
              selectedPlan === 'free' 
                ? 'border-2 border-purple-500 dark:border-purple-600 shadow-2xl shadow-purple-500/20 dark:shadow-[0_0_40px_rgba(124,58,237,0.15)] relative opacity-100' 
                : 'border border-gray-200 dark:border-white/5 shadow-lg dark:shadow-md opacity-60 hover:opacity-100'
            }`}
            onClick={() => setSelectedPlan('free')}
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm mb-6">For getting started</p>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">₹0</span>
              <span className="text-slate-500 dark:text-gray-500 text-sm mb-1">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>
            
            <button className={`w-full py-3 px-4 rounded-xl font-medium text-sm mb-8 transition-all flex items-center justify-center gap-2 ${
              selectedPlan === 'free'
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20'
                : 'border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent'
            }`}>
              Current Plan {selectedPlan === 'free' && <Check className="w-4 h-4" />}
            </button>

            <div className="space-y-4 flex-1">
              <FeatureItem label="3 Mock Interviews / month" icon={<Check className="w-4 h-4 text-slate-400 dark:text-gray-500" />} value="3" />
              <FeatureItem label="AI Practice" icon={<Check className="w-4 h-4 text-slate-400 dark:text-gray-500" />} value="Limited" />
              <FeatureItem label="Resume Analysis" icon={<Check className="w-4 h-4 text-slate-400 dark:text-gray-500" />} value="1 / month" />
              <FeatureItem label="Performance Insights" icon={<Check className="w-4 h-4 text-slate-400 dark:text-gray-500" />} value="Basic" />
              <FeatureItem label="Interview History" icon={<Check className="w-4 h-4 text-slate-400 dark:text-gray-500" />} value="Limited" />
              <FeatureItem label="Bookmarks" icon={<Check className="w-4 h-4 text-slate-400 dark:text-gray-500" />} value="5" />
              <FeatureItem label="AI Feedback Quality" icon={<Check className="w-4 h-4 text-slate-400 dark:text-gray-500" />} value="Standard" />
              <FeatureItem label="ATS Score" icon={<X className="w-4 h-4 text-slate-300 dark:text-gray-600" />} value="" disabled />
              <FeatureItem label="Advanced Analytics" icon={<X className="w-4 h-4 text-slate-300 dark:text-gray-600" />} value="" disabled />
              <FeatureItem label="Priority Support" icon={<X className="w-4 h-4 text-slate-300 dark:text-gray-600" />} value="" disabled />
            </div>
          </div>

          {/* Pro Plan */}
          <div 
            className={`bg-white dark:bg-[#0b0914] rounded-3xl p-8 flex flex-col h-fit transition-all duration-300 cursor-pointer ${
              selectedPlan === 'pro'
                ? 'border-2 border-purple-500 dark:border-purple-600 shadow-2xl shadow-purple-500/20 dark:shadow-[0_0_40px_rgba(124,58,237,0.15)] relative opacity-100'
                : 'border border-gray-200 dark:border-white/5 shadow-lg dark:shadow-md relative opacity-60 hover:opacity-100'
            }`}
            onClick={() => setSelectedPlan('pro')}
          >
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md transition-opacity duration-300 ${selectedPlan === 'pro' ? 'opacity-100' : 'opacity-0'}`}>
              🔥 Most Popular
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pro</h3>
            <p className="text-slate-500 dark:text-gray-400 text-sm mb-6">For serious job seekers</p>
            <div className="flex items-end gap-1 mb-8">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">₹{billingCycle === 'monthly' ? '29' : '100'}</span>
              <span className="text-slate-500 dark:text-gray-500 text-sm mb-1">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
            </div>
            
            <button className={`w-full py-3 px-4 rounded-xl font-medium text-sm mb-8 transition-all flex items-center justify-center gap-2 ${
              selectedPlan === 'pro'
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20'
                : 'border border-gray-300 dark:border-gray-600 text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent'
            }`}>
              Upgrade to Pro {selectedPlan === 'pro' && <TrendingUp className="w-4 h-4" />}
            </button>

            <div className="space-y-4 flex-1">
              <FeatureItem label="Unlimited Mock Interviews" icon={<Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />} value="Unlimited" highlight />
              <FeatureItem label="AI Practice" icon={<Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />} value="Unlimited" highlight />
              <FeatureItem label="Resume Analysis" icon={<Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />} value="Unlimited" highlight />
              <FeatureItem label="Performance Insights" icon={<Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />} value="Advanced" highlight />
              <FeatureItem label="Interview History" icon={<Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />} value="Full Access" highlight />
              <FeatureItem label="Bookmarks" icon={<Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />} value="Unlimited" highlight />
              <FeatureItem label="AI Feedback Quality" icon={<Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />} value="Advanced" highlight />
              <FeatureItem label="ATS Score & Suggestions" icon={<Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />} />
              <FeatureItem label="Advanced Analytics" icon={<Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />} />
              <FeatureItem label="Priority Support" icon={<Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />} />
            </div>
          </div>
        </div>
          
        {/* Features moved here to fill empty space */}
        <div className="bg-white dark:bg-[#0b0914] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-lg dark:shadow-md transition-colors duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FooterFeature icon={<Infinity className="w-5 h-5" />} title="Unlimited Access" desc="Practice as much as you want." />
            <FooterFeature icon={<BrainCircuit className="w-5 h-5" />} title="AI-Powered Insights" desc="Get smarter feedback and improve faster." />
            <FooterFeature icon={<TrendingUp className="w-5 h-5" />} title="Track & Improve" desc="Detailed analytics to level up your skills." />
            <FooterFeature icon={<Rocket className="w-5 h-5" />} title="Stay Ahead" desc="Beat the competition with AI." />
          </div>
        </div>
      </div>

      {/* Info Sidebar */}
      <div className="space-y-6">
          {/* Why Upgrade */}
          <div className="bg-white dark:bg-[#0b0914] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-lg dark:shadow-md transition-colors duration-300">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Why Upgrade?
            </h4>
            <div className="space-y-5">
              <WhyUpgradeItem icon={<Video className="w-4 h-4" />} text="Unlimited mock interviews across all roles" />
              <WhyUpgradeItem icon={<BrainCircuit className="w-4 h-4" />} text="In-depth AI feedback and improvement tips" />
              <WhyUpgradeItem icon={<TrendingUp className="w-4 h-4" />} text="Detailed performance analytics and reports" />
              <WhyUpgradeItem icon={<FileText className="w-4 h-4" />} text="ATS score with missing keywords" />
              <WhyUpgradeItem icon={<FileText className="w-4 h-4" />} text="Unlimited resume analysis" />
              <WhyUpgradeItem icon={<Rocket className="w-4 h-4" />} text="Priority support and early access to new features" />
            </div>
          </div>

          {/* Secure Payment */}
          <div className="bg-white dark:bg-[#0b0914] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-lg dark:shadow-md transition-colors duration-300">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Secure Payment
            </h4>
            <p className="text-slate-500 dark:text-gray-400 text-xs mb-4">
              We use industry-standard encryption to keep your data and payments safe.
            </p>
            <div className="flex flex-wrap gap-2">
              {['VISA', 'Mastercard', 'RuPay', 'UPI'].map(method => (
                <div key={method} className="px-3 py-1.5 bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-lg text-xs font-semibold text-slate-700 dark:text-gray-300">
                  {method}
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white dark:bg-[#0b0914] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-lg dark:shadow-md transition-colors duration-300">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-200 dark:border-purple-500/20">?</span> 
              Frequently Asked Questions
            </h4>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden bg-slate-50 dark:bg-[#1a142c]/50 transition-colors">
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                  >
                    <span className="text-sm font-medium text-slate-800 dark:text-gray-200">{faq.question}</span>
                    {openFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-slate-500 dark:text-gray-400 leading-relaxed border-t border-gray-200 dark:border-white/5">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-gray-500">
        <Check className="w-3.5 h-3.5" /> Secure payments powered by Razorpay. Your data is safe with us.
      </div>
    </div>
  );
};

// Helper Components
const FeatureItem = ({ label, icon, value, highlight, disabled }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      {icon}
      <span className={`text-sm ${disabled ? 'text-slate-400 dark:text-gray-600' : 'text-slate-700 dark:text-gray-300'}`}>{label}</span>
    </div>
    {value && (
      <span className={`text-sm font-medium ${highlight ? 'text-emerald-600 dark:text-emerald-400' : disabled ? 'text-slate-400 dark:text-gray-600' : 'text-slate-900 dark:text-white'}`}>
        {value}
      </span>
    )}
  </div>
);

const WhyUpgradeItem = ({ icon, text }) => (
  <div className="flex items-start gap-3">
    <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-[#1a142c] text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30 shrink-0 mt-0.5">
      {icon}
    </div>
    <span className="text-sm text-slate-600 dark:text-gray-300 leading-snug">{text}</span>
  </div>
);

const FooterFeature = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-[#1a142c] text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-900/30 shrink-0">
      {icon}
    </div>
    <div>
      <h5 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{title}</h5>
      <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Upgrade;
