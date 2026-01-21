import React from 'react';
import { Link } from 'react-router-dom';

const Profile: React.FC<{ credits: number }> = ({ credits }) => {
  return (
    <div className="p-8 pt-24 space-y-12">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 gold-gradient rounded-[2.5rem] flex items-center justify-center font-black text-black text-2xl shadow-xl">FN</div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black">方楠 AI 主理人</h2>
          <p className="text-[10px] text-[#D4B261] font-black uppercase tracking-widest">Diamond Member</p>
        </div>
      </div>

      <div className="bg-[#1C1C1E] p-12 rounded-[4rem] border border-[#D4B261]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 gold-gradient opacity-[0.05] rounded-full blur-3xl -mr-16 -mt-16"></div>
        <span className="text-[10px] text-white/30 uppercase font-black tracking-widest">可用算力 (Pts)</span>
        <div className="text-7xl font-serif-luxury font-black mt-4">{credits.toLocaleString()}</div>
        <Link to="/membership" className="mt-10 block text-center py-5 gold-gradient text-black rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all">算力充值</Link>
      </div>
      
      <div className="text-center opacity-20 text-[10px] font-black uppercase tracking-[0.5em] py-10">
        POWERED BY FANGNAN ENGINE
      </div>
    </div>
  );
};
export default Profile;