import React, { useState } from 'react';
import {
  Home,
  User,
  History,
  Bookmark,
  Bell,
  Settings,
  Send,
  Sparkles,
  Users
} from 'lucide-react';
import { AshokaEmblem } from './AshokaEmblem';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface SaarthiAiAssistantProps {
  onNavigateHome?: () => void;
  onNavigateProfile?: () => void;
}

export const SaarthiAiAssistant: React.FC<SaarthiAiAssistantProps> = ({
  onNavigateHome,
  onNavigateProfile
}) => {
  const [selectedLang, setSelectedLang] = useState<'en' | 'hi' | 'gu'>('hi');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [activeMenu, setActiveMenu] = useState<string>('assistant');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initial messages matching Screen 6 of the collage
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'user',
      text: 'Mujhe chhota business start karna hai aur 1 lakh loan chahiye. Kya scheme milegi?',
      timestamp: '10:24 AM'
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      text: `Aapke details ke hisaab se Micro Finance Scheme aapke liye suitable hai.
Is scheme ke tahat aapko ₹1,40,000 tak ka loan mil sakta hai, 6.5%-8% interest rate par. 3-6 months moratorium bhi milta hai.
Kya aap chahte hain ki main aapke liye nearby authorized partners bhi dhoondh kar dikhaun?`,
      timestamp: '10:24 AM'
    }
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call backend /api/gemini/advisor
      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userText,
          language: selectedLang === 'hi' ? 'Hindi' : selectedLang === 'gu' ? 'Gujarati' : 'English',
          applicantContext: { income: 200000, category: 'SC' }
        })
      });

      const data = await res.json();
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || "Micro Finance Scheme provides loans up to ₹1.40 Lakh at 6.5% interest.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } catch {
      // Fallback
      const fallbackMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: selectedLang === 'hi'
          ? "Micro Finance Scheme ke tahat ₹1,40,000 tak ka loan 6.5% byaj dar par uplabdh hai. Kripya apna Aadhaar aur Jati praman patra taiyar rakhein."
          : "Under the SC Micro Finance Scheme, loans up to ₹1,40,000 are available at 6.5% interest rate.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Sidebar Menu (Screen 6 Left) */}
        <div className="lg:col-span-3 border-r border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between bg-slate-50/50">
          <div className="space-y-1.5">
            <button
              onClick={() => { setActiveMenu('home'); if (onNavigateHome) onNavigateHome(); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'home' ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Home</span>
            </button>

            <button
              onClick={() => { setActiveMenu('profile'); if (onNavigateProfile) onNavigateProfile(); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'profile' ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveMenu('history')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'history' ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>Scheme History</span>
            </button>

            <button
              onClick={() => setActiveMenu('saved_partners')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'saved_partners' ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4 text-slate-500" />
              <span>Saved Partners</span>
            </button>

            <button
              onClick={() => setActiveMenu('notifications')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'notifications' ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bell className="w-4 h-4 text-slate-500" />
              <span>Notifications</span>
            </button>

            <button
              onClick={() => setActiveMenu('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'settings' ? 'bg-white text-[#0d5c46] shadow-xs border border-slate-200' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </button>
          </div>

          {/* Bottom Card: "Empowering SC Communities" (Collage Screen 6) */}
          <div className="pt-6">
            <div className="p-4 rounded-2xl bg-[#EAF7EE] border border-[#d3ebd9] text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#d5f0dd] flex items-center justify-center text-[#0d5c46]">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Empowering SC Communities
              </h4>
              <p className="text-[11px] text-slate-500">
                Direct statutory assistance at concessional interest rates.
              </p>
            </div>
          </div>
        </div>

        {/* Main Chat Area (Screen 6 Right) */}
        <div className="lg:col-span-9 flex flex-col justify-between p-4 sm:p-6 bg-white">
          {/* Header */}
          <div className="pb-4 border-b border-slate-100 space-y-1">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0d5c46]" />
              <span>AI Assistant</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ask your questions in your preferred language.
            </p>
          </div>

          {/* Chat Thread Messages */}
          <div className="flex-1 py-6 space-y-5 overflow-y-auto max-h-[380px] pr-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {m.sender === 'user' ? (
                  /* User Bubble (Dark Green as in collage) */
                  <div className="max-w-md bg-[#0d5c46] text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-xs text-xs sm:text-sm">
                    {m.text}
                  </div>
                ) : (
                  /* Bot Bubble (White Card with Ashoka Avatar as in collage) */
                  <div className="flex items-start gap-3 max-w-lg">
                    <div className="w-8 h-8 rounded-full bg-[#EAF7EE] border border-[#c3ebcb] flex items-center justify-center text-[#0d5c46] shrink-0 mt-1">
                      <AshokaEmblem size={16} />
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 shadow-xs text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                      {m.text}
                    </div>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {m.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic">
                <div className="w-2 h-2 rounded-full bg-[#0d5c46] animate-pulse" />
                <span>AI is formulating your response...</span>
              </div>
            )}
          </div>

          {/* Bottom Chat Controls: Language Chips + Input Bar (Exact as in collage) */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            {/* Language Chips */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedLang('en')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  selectedLang === 'en' ? 'bg-[#0d5c46] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('hi')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  selectedLang === 'hi' ? 'bg-[#0d5c46] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setSelectedLang('gu')}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  selectedLang === 'gu' ? 'bg-[#0d5c46] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ગુજરાતી
              </button>
            </div>

            {/* Input Bar with Send Button */}
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d5c46]/20 focus:border-[#0d5c46]"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 w-8 h-8 rounded-lg bg-[#0d5c46] hover:bg-[#0a4635] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
