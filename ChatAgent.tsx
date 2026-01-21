import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AppMode } from './types';
import { chatStream } from './geminiService';

const ChatAgent: React.FC = () => {
  const mode = new URLSearchParams(useLocation().search).get('mode') as AppMode || AppMode.VIRAL_COPY;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role:string, text:string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const msg = input; setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg }, { role: 'model', text: '' }]);
    setLoading(true);
    let full = "";
    try {
      for await (const chunk of chatStream(mode, msg)) {
        full += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, text: full }];
        });
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0B]">
      <header className="p-6 glass border-b border-white/5 flex items-center justify-between">
        <button onClick={() => window.history.back()}><i className="fas fa-chevron-left"></i></button>
        <span className="text-[10px] font-black tracking-widest uppercase">方楠 AI 创作助手</span>
        <div className="w-4"></div>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed ${m.role === 'user' ? 'gold-gradient text-black font-bold' : 'bg-white/5 border border-white/10'}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="p-6 pb-10 glass rounded-t-[3rem]">
        <div className="flex gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSend()} placeholder="在此输入灵感..." className="flex-1 bg-transparent px-4 py-3 text-sm outline-none" />
          <button onClick={handleSend} disabled={loading} className="w-12 h-12 gold-gradient rounded-full text-black flex items-center justify-center">
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatAgent;