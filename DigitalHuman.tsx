import React, { useState } from 'react';
import { generateVideo } from './geminiService';

const DigitalHuman: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [api, setApi] = useState({ 
    endpoint: localStorage.getItem('dh_url') || '', 
    key: localStorage.getItem('dh_key') || '' 
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
      const url = await generateVideo("Speak naturally", image, api.endpoint ? api : undefined);
      setVideo(url);
    } finally { setLoading(false); }
  };

  const saveApi = () => {
    localStorage.setItem('dh_url', api.endpoint);
    localStorage.setItem('dh_key', api.key);
    setShowConfig(false);
  };

  return (
    <div className="p-8 pt-20 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif-luxury font-black gold-text">分身实验室</h2>
        <button onClick={() => setShowConfig(true)} className="w-10 h-10 glass rounded-xl text-[#D4B261]"><i className="fas fa-cog"></i></button>
      </div>

      <div className="aspect-[3/4] bg-white/5 rounded-[3.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center relative overflow-hidden group">
        {image ? <img src={image} className="w-full h-full object-cover" /> : <div className="text-center opacity-20"><i className="fas fa-user-plus text-4xl mb-4"></i><p className="text-[10px] font-black uppercase tracking-widest">点击上传形象照片</p></div>}
        <input type="file" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>

      {!video ? (
        <button onClick={handleCreate} disabled={!image || loading} className="w-full py-6 gold-gradient rounded-[2.5rem] text-black font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
          {loading ? '全速渲染中...' : '生成唇形同步视频'}
        </button>
      ) : (
        <div className="space-y-6">
          <video src={video} controls autoPlay className="w-full rounded-[2.5rem] border border-[#D4B261]/20 shadow-2xl" />
          <button onClick={() => setVideo(null)} className="w-full py-4 text-[10px] font-black opacity-30 uppercase">重新制作</button>
        </div>
      )}

      {showConfig && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="w-full space-y-8">
            <h3 className="text-center font-black gold-text uppercase tracking-widest">私有 API 配置</h3>
            <div className="space-y-4">
              <input value={api.endpoint} onChange={e=>setApi({...api, endpoint:e.target.value})} placeholder="接口 Endpoint (URL)" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none" />
              <input value={api.key} onChange={e=>setApi({...api, key:e.target.value})} type="password" placeholder="API Key (可选)" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none" />
            </div>
            <button onClick={saveApi} className="w-full py-5 gold-gradient rounded-2xl text-black font-black uppercase tracking-widest">保存配置</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DigitalHuman;