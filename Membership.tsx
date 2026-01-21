import React, { useState } from 'react';

const Membership: React.FC<{ setCredits: (n: any) => void }> = ({ setCredits }) => {
  const packs = [
    { name: '体验包', pts: '100', price: '9.9' },
    { name: '旗舰包', pts: '1200', price: '99', hot: true },
    { name: '合伙人', pts: '5000', price: '399' }
  ];

  return (
    <div className="p-8 pt-24 space-y-12 pb-32">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-serif-luxury font-black gold-text">算力中心</h2>
        <p className="text-[10px] text-white/30 uppercase tracking-[0.4em]">Asset Management</p>
      </div>

      <div className="bg-[#1C1C1E] p-10 rounded-[3.5rem] border border-white/5 space-y-6">
        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">激活码兑换</span>
        <div className="flex gap-2">
          <input placeholder="输入 16 位序列号" className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-xs outline-none" />
          <button className="gold-gradient text-black px-6 rounded-2xl font-black text-xs uppercase">激活</button>
        </div>
      </div>

      <div className="grid gap-6">
        {packs.map(p => (
          <div key={p.name} className={`p-8 rounded-[3rem] border flex justify-between items-center ${p.hot ? 'border-[#D4B261] bg-[#1C1C1E]' : 'border-white/5 bg-white/5'}`}>
            <div>
              <h4 className="text-2xl font-black">{p.pts} Pts</h4>
              <p className="text-[10px] text-white/30 uppercase font-black">{p.name}</p>
            </div>
            <div className="text-xl font-black text-[#D4B261]">¥{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Membership;