import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AppMode } from './types';
import { chatStream, generateDigitalHumanVideo } from './geminiService';

const App: React.FC = () => {
  const [credits, setCredits] = useState(6280);

  return (
    <Router>
      <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-[#0A0A0B] relative">
        <main className="flex-1 pb-32">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai" element={<ChatAgent />} />
            <Route path="/digital-human" element={<DigitalHuman />} />
            <Route path="/membership" element={<Membership setCredits={setCredits} />} />
            <Route path="/profile" element={<Profile credits={credits} />} />
          </Routes>
        </main>
        <Navigation />
      </div>
    </Router>
  );
};

// 导航栏组件
const Navigation = () => {
  const loc = useLocation();
  if (loc.pathname === '/ai') return null;
  const navs = [
    { path: '/', icon: 'fa-bolt', label: '流量' },
    { path: '/digital-human', icon: 'fa-user-astronaut', label: '分身' },
    { path: '/membership', icon: 'fa-crown', label: '充值' },
    { path: '/profile', icon: 'fa-wallet', label: '资产' },
  ];
  return (
    <nav className="fixed bottom-8 left-6 right-6 glass rounded-[2.8rem] p-4 flex justify-around items-center z-50">
      {navs.map(n => (
        <Link key={n.path} to={n.path} className={`flex flex-col items-center gap-1 transition-all ${loc.pathname === n.path ? 'text-[#D4B261] scale-110' : 'opacity-30'}`}>
          <i className={`fas ${n.icon} text-lg`}></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">{n.label}</span>
        </Link>
      ))}
    </nav>
  );
};

// 首页：功能选择
const Home = () => {
  const tools = [
    { title: '爆款文案', mode: AppMode.VIRAL_COPY, icon: 'fa-feather', desc: 'Viral Script' },
    { title: '万能标题', mode: AppMode.VIRAL_SUBJECT, icon: 'fa-heading', desc: 'Hook Master' },
    { title: '风格模仿', mode: AppMode.VIRAL_IMITATION, icon: 'fa-clone', desc: 'Mimic Engine' }
  ];
  return (
    <div className="p-8 pt-20 space-y-12 animate-up">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif-luxury font-black gold-text">流量实验室</h1>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.5em]">Content Hub v2.0</p>
      </div>
      <div className="grid gap-6">
        {tools.map(t => (
          <Link key={t.mode} to={`/ai?mode=${t.mode}`} className="p-8 bg-[#1C1C1E] rounded-[2.5rem] border border-white/5 flex items-center justify-between group active:scale-95 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-[#D4B261]">
                <i className={`fas ${t.icon} text-xl`}></i>
              </div>
              <div>
                <h3 className="text-lg font-black group-hover:text-[#D4B261] transition-colors">{t.title}</h3>
                <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">{t.desc}</p>
              </div>
            </div>
            <i className="fas fa-chevron-right opacity-20 text-xs"></i>
          </Link>
        ))}
      </div>
    </div>
  );
};

// 对话助手页面
const ChatAgent = () => {
  const query = new URLSearchParams(useLocation().search);
  const mode = (query.get('mode') as AppMode) || AppMode.VIRAL_COPY;
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
    let fullText = "";
    try {
      for await (const chunk of chatStream(mode, msg)) {
        fullText += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, text: fullText }];
        });
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0B]">
      <header className="p-6 glass border-b border-white/5 flex items-center justify-between">
        <button onClick={() => window.history.back()}><i className="fas fa-chevron-left"></i></button>
        <span className="text-[10px] font-black tracking-widest uppercase text-[#D4B261]">方楠 AI 创作核心</span>
        <div className="w-4"></div>
      </header>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] text-[15px] leading-relaxed ${m.role === 'user' ? 'gold-gradient text-black font-black' : 'bg-[#1C1C1E] border border-white/10 text-white/90'}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
      <div className="p-6 pb-12 glass rounded-t-[3.5rem] card-shadow">
        <div className="flex gap-3 bg-white/5 p-2 rounded-[2rem] border border-white/10">
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSend()} placeholder="描述你的创作需求..." className="flex-1 bg-transparent px-6 py-4 text-sm outline-none text-white" />
          <button onClick={handleSend} disabled={loading} className="w-14 h-14 gold-gradient rounded-full text-black flex items-center justify-center shadow-xl active:scale-90 transition-all">
            <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

// 数字人页面：支持自定义 API
const DigitalHuman = () => {
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [api, setApi] = useState({ 
    endpoint: localStorage.getItem('custom_dh_url') || '', 
    key: localStorage.getItem('custom_dh_key') || '' 
  });

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const r = new FileReader();
      r.onload = (ev) => setImage(ev.target?.result as string);
      r.readAsDataURL(file);
    }
  };

  const handleCreate = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const url = await generateDigitalHumanVideo("Professional Digital Human", image, api.endpoint ? api : undefined);
      setVideo(url);
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8 pt-20 space-y-10 animate-up">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-serif-luxury font-black gold-text">分身实验室</h2>
          <p className="text-[10px] text-white/20 uppercase tracking-widest font-black">Digital Twin Studio</p>
        </div>
        <button onClick={() => setShowConfig(true)} className="w-12 h-12 glass rounded-2xl text-[#D4B261] flex items-center justify-center border border-[#D4B261]/20">
          <i className="fas fa-cog"></i>
        </button>
      </div>

      <div className="aspect-[3/4] bg-[#1C1C1E] rounded-[3.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
        {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="text-center opacity-20"><i className="fas fa-user-plus text-4xl mb-4"></i><p className="text-[10px] font-black uppercase tracking-widest">点击上传形象照片</p></div>}
        <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>

      {!video ? (
        <button onClick={handleCreate} disabled={!image || loading} className="w-full py-7 gold-gradient rounded-[2.5rem] text-black font-black uppercase tracking-[0.3em] text-xs shadow-2xl active:scale-95 transition-all disabled:opacity-30">
          {loading ? '全速渲染中...' : '启动 4K 唇形同步'}
        </button>
      ) : (
        <div className="space-y-6">
          <video src={video} controls autoPlay className="w-full rounded-[3rem] border border-[#D4B261]/30 shadow-2xl" />
          <button onClick={() => setVideo(null)} className="w-full py-4 text-[10px] font-black text-white/30 uppercase tracking-widest">重新制作</button>
        </div>
      )}

      {showConfig && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="w-full space-y-8 animate-up">
            <h3 className="text-center font-black gold-text uppercase tracking-widest">自定义 API 接入</h3>
            <div className="space-y-4">
              <input value={api.endpoint} onChange={e=>{setApi({...api, endpoint:e.target.value}); localStorage.setItem('custom_dh_url', e.target.value)}} placeholder="接口 Endpoint (URL)" className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none" />
              <input value={api.key} onChange={e=>{setApi({...api, key:e.target.value}); localStorage.setItem('custom_dh_key', e.target.value)}} type="password" placeholder="API Key" className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none" />
            </div>
            <button onClick={() => setShowConfig(false)} className="w-full py-5 gold-gradient rounded-3xl text-black font-black uppercase tracking-widest">保存并应用</button>
          </div>
        </div>
      )}
    </div>
  );
};

// 会员充值页面
const Membership = ({ setCredits }: any) => {
  const packs = [
    { pts: '100', price: '9.9', label: '尝鲜版' },
    { pts: '1200', price: '99', label: '旗舰版', hot: true },
    { pts: '5000', price: '399', label: '专业版' }
  ];
  return (
    <div className="p-8 pt-24 space-y-12 animate-up pb-40">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-serif-luxury font-black gold-text">算力中心</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.4em]">Quota Management</p>
      </div>
      <div className="bg-[#1C1C1E] p-10 rounded-[3.5rem] border border-white/5 space-y-8">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">激活码兑换</span>
        <div className="flex gap-2">
          <input placeholder="输入 16 位序列号" className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl text-sm outline-none" />
          <button className="gold-gradient text-black px-8 rounded-2xl font-black text-xs uppercase">激活</button>
        </div>
      </div>
      <div className="grid gap-6">
        {packs.map(p => (
          <div key={p.pts} className={`p-8 rounded-[3rem] border flex justify-between items-center transition-all active:scale-95 ${p.hot ? 'border-[#D4B261] bg-[#1C1C1E] shadow-2xl' : 'border-white/5 bg-white/5'}`}>
            <div>
              <h4 className="text-2xl font-black">{p.pts} <span className="text-xs opacity-40">Pts</span></h4>
              <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mt-1">{p.label}</p>
            </div>
            <div className="text-xl font-black text-[#D4B261]">¥{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 资产/个人中心页面
const Profile = ({ credits }: { credits: number }) => {
  return (
    <div className="p-8 pt-24 space-y-12 animate-up">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 gold-gradient rounded-[2.5rem] flex items-center justify-center font-black text-black text-3xl shadow-xl">FN</div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black">方楠 AI 主理人</h2>
          <p className="text-[10px] text-[#D4B261] font-black uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-crown"></i> Diamond Partner
          </p>
        </div>
      </div>
      <div className="bg-[#1C1C1E] p-12 rounded-[4.5rem] border border-[#D4B261]/20 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 gold-gradient opacity-[0.05] rounded-full blur-[100px] -mr-40 -mt-40"></div>
        <span className="text-[10px] text-[#D4B261] uppercase font-black tracking-[0.4em]">可用算力资产</span>
        <div className="text-8xl font-serif-luxury font-black mt-6 tracking-tighter">{credits.toLocaleString()}</div>
        <Link to="/membership" className="mt-12 block text-center py-6 gold-gradient text-black rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all">立即扩容</Link>
      </div>
      <div className="text-center opacity-10 text-[9px] font-black uppercase tracking-[0.6em] py-10">
        © 2025 FANGNAN AI ENGINE • ALL RIGHTS RESERVED
      </div>
    </div>
  );
};

export default App;
import { useRef } from 'react';
