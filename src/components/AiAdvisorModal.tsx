import React, { useState, useId } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { Sparkles, Send, RefreshCw, X, MessageSquare, ShieldCheck, HelpCircle } from 'lucide-react';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  currentLang
}) => {
  const t = TRANSLATIONS[currentLang];
  const queryInputId = useId();

  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: `Namaste! I am the National SC Channel Finance AI Advisor. I can guide you on concessional loan eligibility (income up to ₹5.00 Lakhs), interest concessions (6.5% - 8%), moratorium terms, and finding authorized Channel Partners. How may I assist you today?`
    }
  ]);

  if (!isOpen) return null;

  const quickPrompts = [
    "What is the maximum income eligibility ceiling?",
    "What is the difference between Micro Credit and Term Loan?",
    "What special benefits exist for women entrepreneurs (Mahila Samriddhi)?",
    "Why can't I apply directly to central headquarters?",
    "What documents are needed for educational loans abroad?"
  ];

  const handleSend = async (userPrompt?: string) => {
    const promptToSend = userPrompt || query;
    if (!promptToSend.trim() || loading) return;

    const newMessages = [...chatHistory, { sender: 'user' as const, text: promptToSend }];
    setChatHistory(newMessages);
    if (!userPrompt) setQuery("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          language: currentLang
        })
      });

      const data = await response.json();
      if (data.reply) {
        setChatHistory([...newMessages, { sender: 'ai', text: data.reply }]);
      } else {
        throw new Error("No response");
      }
    } catch (err) {
      // High-fidelity fallback response
      let fallbackAnswer = "";
      const q = promptToSend.toLowerCase();

      if (q.includes("income") || q.includes("ceiling") || q.includes("limit")) {
        fallbackAnswer = `Statutory Income Limit: To qualify for concessional financial assistance under NSFDC schemes, the beneficiary's annual family income must be up to ₹5.00 Lakhs (both for rural and urban areas). If your family income is ₹5.00 Lakhs or less, you are eligible for up to 90% funding at 6.5% to 8% p.a.`;
      } else if (q.includes("difference") || q.includes("micro") || q.includes("term")) {
        fallbackAnswer = `Key Differences:\n• Micro Finance Scheme: For projects up to ₹1.40 Lakh. Minimal promoter margin (only 5%), 6.5% interest rate, and 3-6 months moratorium. Ideal for street vendors, small traders, and artisans.\n• Term Loan: For larger enterprise setups from ₹5.00 Lakh to ₹50.00 Lakh. Requires 10% promoter contribution, 7.0%-8.0% interest rate, and up to 10 years repayment.`;
      } else if (q.includes("women") || q.includes("mahila") || q.includes("female")) {
        fallbackAnswer = `Mahila Samriddhi Yojana (Women Priority):\n1. Micro-credit up to ₹1.40 Lakh for women beneficiaries.\n2. Highly subsidized interest rate (as low as 4% - 6% p.a.).\n3. An additional 0.5% interest rebate is granted under central guidelines to promote SC women's economic self-reliance.`;
      } else if (q.includes("directly") || q.includes("headquarter") || q.includes("apply")) {
        fallbackAnswer = `Why Direct Applications Are Not Entertained: Direct applications are not processed at central headquarters to ensure grassroots oversight and regional financial discipline. Funds are statutorily routed through over 100 Channel Partners, including State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), and RRBs. Our platform automatically routes your pre-verified application to the nearest solvent partner.`;
      } else {
        fallbackAnswer = `Under the Channel Finance System for the SC population, eligible citizens with family income up to ₹5.00 Lakhs can access concessional loans covering up to 90% of project costs at 6.5% to 8% interest. Applications are processed through State Channelizing Agencies (SCAs) and Public Sector Banks. Use our Smart Recommender to find your ideal scheme and check nearest partner solvency!`;
      }

      setChatHistory([...newMessages, { sender: 'ai', text: fallbackAnswer }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-display">
                National SC Channel Finance AI Advisor
              </h3>
              <p className="text-[11px] text-indigo-200">
                Multilingual Guidance on Eligibility, Concessional Rates & Channel Routing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-slate-700 border border-slate-200 rounded-2xl p-3.5 text-xs flex items-center gap-2 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Consulting National SC Channel Finance Knowledge Base...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggested Prompts */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors border border-slate-200 cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <label htmlFor={queryInputId} className="sr-only">Ask a question about schemes, eligibility, or partner routing</label>
          <input
            id={queryInputId}
            type="text"
            placeholder="Ask in English, हिन्दी, தமிழ், తెలుగు, मराठी, ਪੰਜਾਬੀ..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="flex-1 text-xs border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
          <button
            onClick={() => handleSend()}
            disabled={!query.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
