import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Traffic from './Traffic';
import ChatAgent from './ChatAgent';
import DigitalHuman from './DigitalHuman';
import Profile from './Profile';
import Membership from './Membership';

const App: React.FC = () => {
  const [credits, setCredits] = useState(6200);

  return (
    <Router>
      <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-[#0A0A0B]">
        <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
          <Routes>
            <Route path="/" element={<Traffic />} />
            <Route path="/ai" element={<ChatAgent />} />
            <Route path="/digital-human" element={<DigitalHuman />} />
            <Route path="/profile" element={<Profile credits={credits} />} />
            <Route path="/membership" element={<Membership setCredits={setCredits} />} />
            <Route path="*" element={<Traffic />} />
          </Routes>
        </main>
        
        <Nav />
      </div>
    </Router>
  );
};

const Nav = () => {
  const loc = useLocation();
  if (loc.pathname === '/ai') return null;
  const items = [
    { path: '/', icon: 'fa-bolt', label: '流量' },
    { path: '/digital-human', icon: 'fa-user-astronaut', label: '分身' },
    { path: '/profile', icon: 'fa-wallet', label: '我的' }
  ];
  return (
    <nav className="fixed bottom-8 left-6 right-6 glass rounded-[2.5rem] p-4 flex justify-around items-center z-50 shadow-2xl">
      {items.map(i => (
        <Link key={i.path} to={i.path} className={`flex flex-col items-center gap-1 ${loc.pathname === i.path ? 'text-[#D4B261]' : 'opacity-30'}`}>
          <i className={`fas ${i.icon} text-lg`}></i>
          <span className="text-[10px] font-bold uppercase tracking-widest">{i.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default App;