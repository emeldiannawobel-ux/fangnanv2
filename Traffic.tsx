import React from 'react';
import { Link } from 'react-router-dom';
import { AppMode } from './types';

const Traffic: React.FC = () => {
  const tools = [
    { title: '爆款文案', mode: AppMode.VIRAL_COPY, icon: 'fa-feather' },
    { title: '爆款标题', mode: AppMode.VIRAL_SUBJECT, icon: 'fa-heading' },
    { title: '爆款模仿', mode: AppMode.VIRAL_IMITATION, icon: 'fa-clone' }
  ];
  return (
    <div className="p-8 pt-20 space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif-luxury font-black gold-text">流量实验室</h1>
        <p className="text-[10px] text-white/30 tracking-[0.5em] uppercase">Viral Core Engine</p>
      </div>
      <div className="grid gap-6">
        {tools.map(t => (
          <Link key={t.mode} to={`/ai?mode=${t.mode}`} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-between group active:scale-95 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-[#D4B261]">
                <i className={`fas ${t.icon} text-xl`}></i>
              </div>
              <h3 className="text-lg font-black">{t.title}</h3>
            </div>
            <i className="fas fa-chevron-right opacity-20"></i>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Traffic;