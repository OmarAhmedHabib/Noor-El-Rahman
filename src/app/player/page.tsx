'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Player() {
  const searchParams = useSearchParams();
  const server = searchParams.get('server') || '';
  const list = searchParams.get('list') || '';

  const [surahs, setSurahs] = useState<any[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [darkMode, setDarkMode] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  // 🟢 جلب السور من API
  useEffect(() => {
    if (!list) return;
    fetch('https://mp3quran.net/api/v3/suwar')
      .then(res => res.json())
      .then(data => {
        const ids = list.split(',');
        setSurahs(data.suwar.filter((s: any) => ids.includes(s.id.toString())));
      });
  }, [list]);

  // 🟢 تشغيل السورة
  const playSurah = (s: any) => {
    setSelectedSurah({ ...s, url: `${server}${s.id.toString().padStart(3, '0')}.mp3` });
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  // 🟢 التحكم في الصوت والتقدم
  const togglePlay = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (v: number) => {
    if (audioRef.current) audioRef.current.currentTime = (v / 100) * audioRef.current.duration;
  };

  const handleVolume = (v: number) => {
    if (audioRef.current) audioRef.current.volume = v;
    setVolume(v);
  };

  const nextSurah = () => {
    const i = surahs.findIndex(s => s.id === selectedSurah?.id);
    if (i >= 0 && i < surahs.length - 1) playSurah(surahs[i + 1]);
  };

  const prevSurah = () => {
    const i = surahs.findIndex(s => s.id === selectedSurah?.id);
    if (i > 0) playSurah(surahs[i - 1]);
  };

  const toggleFavorite = () => {
    if (!selectedSurah) return;
    const exists = favorites.find(f => f.id === selectedSurah.id);
    exists
      ? setFavorites(favorites.filter(f => f.id !== selectedSurah.id))
      : setFavorites([...favorites, selectedSurah]);
  };

  return (
    <main className={`pt-20 px-6 min-h-screen transition ${
      darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-950 to-teal-900 text-white'
               : 'bg-gray-100 text-black'}`}>
      
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">🎧 مشغل القرآن الكريم</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 rounded bg-teal-500">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* 🟢 قائمة السور */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {surahs.map(s => (
          <button key={s.id} onClick={() => playSurah(s)} className="p-2 rounded bg-white/10 hover:bg-teal-600 transition">
            {s.name}
          </button>
        ))}
      </div>

      {/* 🟢 واجهة المشغل */}
      {selectedSurah && (
        <div className="p-4 rounded-lg border border-teal-500 bg-white/10 backdrop-blur-lg shadow-lg">
          <p className="mb-2 text-xl font-semibold">📖 {selectedSurah.name}</p>
          <audio ref={audioRef} src={selectedSurah.url} onTimeUpdate={handleTimeUpdate} />

          <input type="range" value={progress} onChange={(e) => handleSeek(Number(e.target.value))} className="w-full mb-2" />

          <div className="flex gap-2 mt-2">
            <button onClick={prevSurah} className="bg-gray-700 px-3 py-1 rounded">⏮️</button>
            <button onClick={togglePlay} className="bg-green-500 px-4 py-2 rounded">{isPlaying ? '⏸️' : '▶️'}</button>
            <button onClick={nextSurah} className="bg-gray-700 px-3 py-1 rounded">⏭️</button>
            <button onClick={toggleFavorite} className="bg-yellow-500 px-3 py-1 rounded">{favorites.find(f => f.id === selectedSurah.id) ? '⭐' : '☆'}</button>
          </div>

          {/* 🔊 التحكم بالصوت */}
          <div className="mt-3 flex items-center gap-2">
            <label>🔊</label>
            <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => handleVolume(Number(e.target.value))} />
            <span>{Math.round(volume * 100)}%</span>
          </div>
        </div>
      )}
    </main>
  );
}
