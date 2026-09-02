import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Mic } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AIPractice = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('chat');
  
  const [messages, setMessages] = useState(() => {
    const firstName = profile?.fullName ? profile.fullName.split(' ')[0] : 'Candidate';
    return [
      {
        sender: 'ai',
        text: `Hi ${firstName}! I'm your AI interviewer. You can ask me to explain any concept, or practice any topic you want.`
      },
      {
        sender: 'ai',
        text: "What would you like to practice today?"
      }
    ];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [voiceMessages, setVoiceMessages] = useState(() => {
    const firstName = profile?.fullName ? profile.fullName.split(' ')[0] : 'Candidate';
    return [
      { sender: 'ai', text: `Hi ${firstName}! I'm your AI voice assistant. Click the microphone button to start practicing verbally.` }
    ];
  });
  const [voiceStatus, setVoiceStatus] = useState('Click Mic to start conversation');

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const voiceMessagesEndRef = useRef(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    voiceMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [voiceMessages]);

  // Clean up Speech on unmount
  useEffect(() => {
    // Initialize speech synthesis reference
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setVoiceStatus('Listening... Speak now');
        setIsListening(true);
      };

      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        if (e.error === 'no-speech') {
          setVoiceStatus('No speech detected. Click Mic to try again.');
        } else {
          setVoiceStatus('Error: ' + e.error);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        if (!transcript.trim()) return;

        // Add user voice transcript
        const userMsg = { sender: 'user', text: transcript };
        setVoiceMessages(prev => [...prev, userMsg]);
        setVoiceStatus('AI is thinking...');

        try {
          const response = await fetch('http://localhost:5000/api/interviews/practice/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ history: [...voiceMessages, userMsg] })
          });

          if (response.ok) {
            const data = await response.json();
            const aiText = data.text;

            // Add AI response
            setVoiceMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
            setVoiceStatus('AI is speaking...');

            // Speak response aloud
            if (synthRef.current) {
              synthRef.current.cancel();
              const utterance = new SpeechSynthesisUtterance(aiText);
              utterance.lang = 'en-US';
              
              utterance.onend = () => {
                // Automatically listen again for hands-free loop
                setVoiceStatus('Listening... Speak now');
                try {
                  rec.start();
                } catch (err) {
                  console.error("Error restarting recognition:", err);
                }
              };

              utterance.onerror = (err) => {
                console.error("Speech synthesis error:", err);
                setVoiceStatus('Click Mic to reply');
              };

              synthRef.current.speak(utterance);
            } else {
              setVoiceStatus('Click Mic to reply');
            }
          } else {
            setVoiceStatus('Failed to get AI reply. Click Mic to retry.');
          }
        } catch (err) {
          console.error("Voice chat API error:", err);
          setVoiceStatus('Connection error. Click Mic to retry.');
        }
      };

      recognitionRef.current = rec;
    }
  }, [voiceMessages]);

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
      setVoiceStatus('Conversation paused');
    } else {
      if (synthRef.current) synthRef.current.cancel();
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Recognition start error:", err);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:5000/api/interviews/practice/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ history: [...messages, userMessage] })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { sender: 'ai', text: "Network error. Please make sure the backend is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderMessageContent = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] || 'Code' : 'Code';
        const code = match ? match[2] : part.slice(3, -3);

        return (
          <div key={index} className="bg-[#06050a] rounded-xl border border-white/10 overflow-hidden font-mono text-xs md:text-sm my-3 shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5 text-gray-400">
              <span className="capitalize">{language}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(code)}
                className="hover:text-white transition-colors text-xs font-semibold"
              >
                Copy code
              </button>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-gray-300 whitespace-pre">{code}</pre>
            </div>
          </div>
        );
      } else {
        return (
          <p key={index} className="whitespace-pre-line leading-relaxed">
            {part}
          </p>
        );
      }
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto h-full min-h-[calc(100vh-10rem)]">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          AI Practice <span className="text-xl">✨</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400">Practice any topic with our AI interviewer.</p>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200 dark:border-white/5 pb-0">
        <button 
          onClick={() => {
            setActiveTab('chat');
            if (isListening) handleToggleVoice();
          }}
          className={`font-medium relative pb-4 px-2 cursor-pointer transition-colors ${
            activeTab === 'chat' ? 'text-purple-700 dark:text-purple-400' : 'text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-gray-300'
          }`}
        >
          Chat Practice
          {activeTab === 'chat' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-600 dark:bg-purple-500 rounded-t-full"></span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('voice')}
          className={`font-medium relative pb-4 px-2 cursor-pointer transition-colors ${
            activeTab === 'voice' ? 'text-purple-700 dark:text-purple-400' : 'text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-gray-300'
          }`}
        >
          Voice Practice
          {activeTab === 'voice' && (
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-purple-600 dark:bg-purple-500 rounded-t-full"></span>
          )}
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'chat' ? (
        /* Chat Practice Mode */
        <div className="flex-1 bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl flex flex-col overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            {messages.map((msg, index) => {
              const isAI = msg.sender === 'ai';
              return (
                <div key={index} className={`flex gap-4 ${!isAI ? 'justify-end' : ''}`}>
                  {isAI && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30 bg-purple-900/30 flex items-center justify-center shrink-0">
                      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=TalentSyncAI" alt="AI Avatar" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className={`border rounded-2xl p-4 text-sm max-w-[80%] ${
                    isAI 
                      ? 'bg-slate-50 dark:bg-[#1a142c] border-gray-200 dark:border-white/5 text-slate-700 dark:text-gray-300 rounded-tl-sm' 
                      : 'bg-purple-600 border-transparent text-white rounded-tr-sm shadow-[0_4px_15px_rgba(124,58,237,0.3)]'
                  }`}>
                    {isAI ? renderMessageContent(msg.text) : msg.text}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-4 items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30 bg-purple-900/30 flex items-center justify-center shrink-0">
                  <img src="https://api.dicebear.com/7.x/bottts/svg?seed=TalentSyncAI" alt="AI Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/5 rounded-2xl rounded-tl-sm px-4 py-3 text-slate-400 text-sm flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-slate-400 dark:bg-gray-600 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-slate-400 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#0b0914]">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isTyping}
                className="w-full bg-slate-50 dark:bg-[#1a142c] border border-gray-200 dark:border-white/10 rounded-xl py-4 pl-5 pr-14 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-purple-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
                placeholder={isTyping ? "AI is thinking..." : "Ask anything..."}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-3 w-10 h-10 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Voice Practice Mode */
        <div className="flex-1 bg-white dark:bg-[#0b0914] shadow-sm dark:shadow-none border border-gray-200 dark:border-white/5 rounded-2xl flex flex-col md:flex-row overflow-hidden">
          {/* Left panel: Mic and Status */}
          <div className="md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-white/5 flex flex-col items-center justify-center text-center gap-6">
            <button 
              onClick={handleToggleVoice}
              className={`w-28 h-28 rounded-full flex items-center justify-center shadow-lg relative group transition-all duration-300 cursor-pointer ${
                isListening 
                  ? 'bg-red-500/20 border border-red-500/40 text-red-500' 
                  : 'bg-purple-900/20 border border-purple-500/30 text-purple-400'
              }`}
            >
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-75"></div>
              )}
              <Mic className={`w-12 h-12 transition-transform group-hover:scale-110 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
            
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Voice Assistant</h2>
              <span className={`text-sm font-semibold tracking-wider uppercase ${
                isListening ? 'text-red-400' : 'text-purple-400'
              }`}>
                {voiceStatus}
              </span>
              <p className="text-slate-500 dark:text-gray-400 text-xs max-w-sm mt-1">
                {isListening 
                  ? "Speak into your microphone. Stop speaking to send." 
                  : "Click the microphone button to start or resume the voice session."}
              </p>
            </div>
            
            {isListening && (
              <div className="flex gap-1 items-center justify-center h-6">
                <span className="w-1 h-3 bg-red-400 rounded-full animate-bounce [animation-duration:0.6s]"></span>
                <span className="w-1 h-5 bg-red-400 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.1s]"></span>
                <span className="w-1 h-2 bg-red-400 rounded-full animate-bounce [animation-duration:0.5s] [animation-delay:0.2s]"></span>
                <span className="w-1 h-4 bg-red-400 rounded-full animate-bounce [animation-duration:0.7s] [animation-delay:0.15s]"></span>
                <span className="w-1 h-3 bg-red-400 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.25s]"></span>
              </div>
            )}
          </div>

          {/* Right panel: Live Transcript */}
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden h-[350px] md:h-auto bg-slate-50/50 dark:bg-[#07050e]/50">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm tracking-wide uppercase border-b border-gray-200 dark:border-white/5 pb-2">
              Live Transcript
            </h3>
            <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-2">
              {voiceMessages.map((msg, index) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div key={index} className={`flex gap-3 ${!isAI ? 'justify-end' : ''}`}>
                    {isAI && (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-purple-500/30 bg-purple-900/30 flex items-center justify-center shrink-0">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=TalentSyncAI" alt="AI Avatar" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`p-3 rounded-xl text-xs max-w-[85%] ${
                      isAI 
                        ? 'bg-white dark:bg-[#1a142c] border border-gray-200 dark:border-white/5 text-slate-700 dark:text-gray-300 rounded-tl-sm' 
                        : 'bg-purple-600 text-white rounded-tr-sm shadow-[0_2px_8px_rgba(124,58,237,0.15)]'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={voiceMessagesEndRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPractice;
