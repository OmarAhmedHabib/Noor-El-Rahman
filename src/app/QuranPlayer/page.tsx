'use client';

import { useEffect, useState, useRef, useMemo } from 'react';

const apiUrl = 'https://mp3quran.net/api/v3';
const language = 'ar';

export default function QuranPlayer() {
  const [reciters, setReciters] = useState<any[]>([]);
  const [moshafs, setMoshafs] = useState<any[]>([]);
  const [surahs, setSurahs] = useState<any[]>([]);
  const [server, setServer] = useState('');
  const [selectedReciter, setSelectedReciter] = useState<string | null>(null);
  const [selectedMoshaf, setSelectedMoshaf] = useState<string | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<any>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [repeat, setRepeat] = useState(1);
  const [repeatCounter, setRepeatCounter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);

  // 🟢 تحميل الإعدادات من LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('quranPlayer');
    if (saved) {
      const { reciter, moshaf, surah, fav, dark } = JSON.parse(saved);
      setSelectedReciter(reciter);
      setSelectedMoshaf(moshaf);
      setSelectedSurah(surah);
      setFavorites(fav || []);
      if (dark !== undefined) setDarkMode(dark);
    }
  }, []);

  // 🟢 حفظ الإعدادات
  useEffect(() => {
    localStorage.setItem(
      'quranPlayer',
      JSON.stringify({
        reciter: selectedReciter,
        moshaf: selectedMoshaf,
        surah: selectedSurah,
        fav: favorites,
        dark: darkMode,
      })
    );
  }, [selectedReciter, selectedMoshaf, selectedSurah, favorites, darkMode]);

  // 🟢 جلب القراء
  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/reciters?language=${language}`)
      .then((res) => res.json())
      .then((data) => setReciters(data.reciters))
      .finally(() => setLoading(false));
  }, []);

  // 🟢 جلب المصاحف
  const fetchMoshaf = async (id: string) => {
    setLoading(true);
    const res = await fetch(`${apiUrl}/reciters?language=${language}&reciter=${id}`);
    const data = await res.json();
    setMoshafs(data.reciters[0].moshaf);
    setSelectedReciter(id);
    setSurahs([]);
    setLoading(false);
  };

  // 🟢 جلب السور
  const fetchSurahs = async (serverUrl: string, list: string, moshafId: string) => {
    setLoading(true);
    const res = await fetch(`${apiUrl}/suwar`);
    const data = await res.json();
    const ids = list.split(',');
    const filtered = data.suwar.filter((s: any) => ids.includes(s.id.toString()));
    setSurahs(filtered);
    setServer(serverUrl);
    setSelectedMoshaf(moshafId);
    setLoading(false);
  };

  // 🟢 تشغيل السورة
  const playSurah = (surah: any) => {
    const audioUrl = `${server}${surah.id.toString().padStart(3, '0')}.mp3`;
    setSelectedSurah({ ...surah, url: audioUrl });
    setTimeout(() => {
      audioRef.current?.play();
      setIsPlaying(true);
    }, 100);
  };

  // 🟢 تحكم التشغيل
  const togglePlay = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // 🟢 التحكم في الصوت
  const handleVolume = (v: number) => {
    if (audioRef.current) audioRef.current.volume = v;
    setVolume(v);
  };

  // 🟢 متابعة التقدم
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleSeek = (val: number) => {
    if (audioRef.current) audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
  };

  const handleEnded = () => {
    if (repeatCounter < repeat - 1) {
      setRepeatCounter(repeatCounter + 1);
      audioRef.current?.play();
    } else {
      setRepeatCounter(0);
      setIsPlaying(false);
    }
  };

  // 🟢 التنقل بين السور
  const currentIndex = useMemo(() => surahs.findIndex((s) => s.id === selectedSurah?.id), [surahs, selectedSurah]);
  const nextSurah = () => currentIndex < surahs.length - 1 && playSurah(surahs[currentIndex + 1]);
  const prevSurah = () => currentIndex > 0 && playSurah(surahs[currentIndex - 1]);

  // 🟢 إدارة المفضلة
  const toggleFavorite = () => {
    if (!selectedSurah) return;
    const exists = favorites.find((f) => f.id === selectedSurah.id);
    setFavorites(exists ? favorites.filter((f) => f.id !== selectedSurah.id) : [...favorites, selectedSurah]);
  };

  return (
    <div
      className={`md:mt-16 mt-5 max-w-4xl mx-auto p-6 rounded-xl shadow-lg transition 
      ${darkMode ? 'bg-gradient-to-r from-[#80084e] via-[#08014d] to-[#1a1a2cb4] text-white' 
      : 'bg-gradient-to-r from-[#f5f5f5] via-[#eaeaea] to-[#d4d4d4] text-black'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">🎧 مشغل القرآن الكريم</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1 rounded transition ${darkMode ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-black'}`}
        >
          {darkMode ? '☀️ وضع فاتح' : '🌙 وضع ليلي'}
        </button>
      </div>

      {/* اختيارات القارئ والمصحف والسورة */}
      <select className={`w-full p-2 rounded mb-3 transition ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-300'}`} onChange={(e) => fetchMoshaf(e.target.value)} defaultValue="">
        <option value="" disabled>اختر قارئًا</option>
        {reciters.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>

      {moshafs.length > 0 && (
        <select className={`w-full p-2 rounded mb-3 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-300'}`} onChange={(e) => {
          const m = moshafs.find((m) => m.id.toString() === e.target.value);
          if (m) fetchSurahs(m.server, m.surah_list, m.id);
        }} defaultValue="">
          <option value="" disabled>اختر مصحفًا</option>
          {moshafs.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      )}

      {surahs.length > 0 && (
        <select className={`w-full p-2 rounded mb-3 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black border border-gray-300'}`} onChange={(e) => {
          const s = surahs.find((s) => s.id.toString() === e.target.value);
          if (s) playSurah(s);
        }} defaultValue="">
          <option value="" disabled>اختر سورة</option>
          {surahs.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      )}

      {/* مشغل الصوت */}
      {selectedSurah && (
        <div className={`mt-4 p-4 rounded-lg border shadow-md ${darkMode ? 'border-teal-500' : 'border-gray-400 bg-white text-black'}`}>
          <p className="mb-2 text-lg font-semibold">📖 {selectedSurah.name}</p>
          <audio ref={audioRef} src={selectedSurah.url} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded} />

          <input type="range" value={progress} onChange={(e) => handleSeek(Number(e.target.value))} className="w-full mb-2" />

          <div className="flex gap-2 mt-2 flex-wrap">
            <button onClick={prevSurah} className="bg-gray-700 px-3 py-1 rounded">⏮️ السابق</button>
            <button onClick={togglePlay} className="bg-green-500 px-4 py-2 rounded">{isPlaying ? '⏸️ إيقاف' : '▶️ تشغيل'}</button>
            <button onClick={stopAudio} className="bg-red-500 px-3 py-1 rounded">⏹️ إيقاف</button>
            <button onClick={nextSurah} className="bg-gray-700 px-3 py-1 rounded">⏭️ التالي</button>
            <button onClick={toggleFavorite} className="bg-yellow-500 px-3 py-1 rounded">{favorites.find((f) => f.id === selectedSurah.id) ? '⭐ مفضلة' : '☆ أضف للمفضلة'}</button>
          </div>

          {/* التحكم بالصوت */}
          <div className="mt-3 flex items-center gap-2">
            <label>🔊</label>
            <input type="range" min="0" max="1" step="0.1" value={volume} onChange={(e) => handleVolume(Number(e.target.value))} />
            <span>{Math.round(volume * 100)}%</span>
          </div>

          {/* التكرار */}
          <div className="mt-2">
            <label>🔁 التكرار:</label>
            <input type="number" min="1" className="ml-2 w-16 p-1 rounded text-black" value={repeat} onChange={(e) => setRepeat(Number(e.target.value))} />
          </div>
        </div>
      )}

      {/* المفضلة */}
      {favorites.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">⭐ السور المفضلة</h3>
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((f) => (
              <button key={f.id} onClick={() => playSurah(f)} className="p-2 rounded bg-white/10 hover:bg-teal-600 transition">
                {f.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="mt-4 text-teal-300">⏳ جاري التحميل...</p>}
    </div>
  );
}
