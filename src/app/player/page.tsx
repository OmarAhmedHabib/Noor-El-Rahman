'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaVolumeMute, FaStepForward, FaStepBackward, FaMoon, FaSun, FaStar, FaRegStar } from 'react-icons/fa';

type Reciter = {
  id: number;
  name: string;
  moshaf?: Array<{ name: string; server: string; surah_list: string }>;
} & Record<string, any>;

type Surah = {
  id: number;
  name: string;
  ayat?: number;
  type?: string;
} & Record<string, any>;

export default function QuranPage() {
  const API = 'https://mp3quran.net/api/v3';
  const language = 'ar';

  // data
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [selectedReciterId, setSelectedReciterId] = useState<number | null>(null);
  const [selectedMoshafIndex, setSelectedMoshafIndex] = useState<number | null>(null);
  const [moshafs, setMoshafs] = useState<Reciter['moshaf']>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);

  // player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [repeatCount, setRepeatCount] = useState(1);
  const [repeatCounter, setRepeatCounter] = useState(0);

  const selectedReciter = reciters.find(r => r.id === selectedReciterId) || null;
  const selectedMoshaf = selectedMoshafIndex != null ? moshafs?.[selectedMoshafIndex] ?? null : null;

  // fetch reciters on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/reciters?language=${language}`);
        const data = await res.json();
        if (!mounted) return;
        setReciters(data.reciters || []);
      } catch (e) {
        console.error('fetch reciters error', e);
        // silent fail — you can show UI feedback if you want
      }
    })();
    return () => { mounted = false; };
  }, []);

  // load surahs list for moshaf (when moshaf or reciter changes)
  useEffect(() => {
    if (!selectedMoshaf) {
      setSurahs([]);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/suwar`);
        const data = await res.json();
        if (!mounted) return;
        const ids = (selectedMoshaf.surah_list || '').split(',');
        // filter where id present in ids
        const filtered: Surah[] = (data.suwar || []).filter((s: Surah) => ids.includes(String(s.id)));
        setSurahs(filtered);
      } catch (e) {
        console.error('fetch suwar error', e);
      }
    })();
    return () => { mounted = false; };
  }, [selectedMoshaf]);

  // load moshafs when reciter changes
  useEffect(() => {
    if (!selectedReciter) {
      setMoshafs([]);
      setSelectedMoshafIndex(null);
      return;
    }
    // some APIs use 'moshaf' or 'mushaf' — prefer existing shape
    setMoshafs(selectedReciter.moshaf || []);
    setSelectedMoshafIndex(null);
    setSurahs([]);
    setCurrentSurah(null);
    stopAudio();
  }, [selectedReciterId]);

  // load favorites from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('quran_favs_v1');
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  // persist favorites
  useEffect(() => {
    try {
      localStorage.setItem('quran_favs_v1', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setDuration(audio.duration);
      }
    };
    const onEnded = () => {
      if (repeatCounter < repeatCount - 1) {
        setRepeatCounter(prev => prev + 1);
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
      } else {
        setRepeatCounter(0);
        setIsPlaying(false);
        // go to next surah automatically
        handleNext();
      }
    };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatCounter, repeatCount, surahs, currentSurah]);

  // helpers
  const playSurah = (s: Surah) => {
    if (!selectedMoshaf) return;
    const idStr = s.id.toString().padStart(3, '0');
    const url = `${selectedMoshaf.server}${idStr}.mp3`;
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.src = url;
    audioRef.current.volume = volume;
    audioRef.current
      .play()
      .then(() => {
        setCurrentSurah(s);
        setIsPlaying(true);
        setRepeatCounter(0);
      })
      .catch(err => {
        console.error('play error', err);
        setIsPlaying(false);
      });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (audioRef.current.volume > 0) {
      audioRef.current.dataset.previousVolume = String(audioRef.current.volume);
      audioRef.current.volume = 0;
      setVolume(0);
    } else {
      const prev = Number(audioRef.current.dataset.previousVolume || 1);
      audioRef.current.volume = prev;
      setVolume(prev);
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const handleSeek = (value: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    audioRef.current.currentTime = (value / 100) * audioRef.current.duration;
    setProgress(value);
  };

  const handleNext = () => {
    if (!surahs.length || !currentSurah) return;
    const idx = surahs.findIndex(s => s.id === currentSurah.id);
    if (idx >= 0 && idx < surahs.length - 1) {
      playSurah(surahs[idx + 1]);
    } else {
      // نهاية القائمة — إيقاف
      stopAudio();
    }
  };

  const handlePrev = () => {
    if (!surahs.length || !currentSurah) return;
    const idx = surahs.findIndex(s => s.id === currentSurah.id);
    if (idx > 0) playSurah(surahs[idx - 1]);
  };

  const toggleFavorite = (s: Surah) => {
    if (!s) return;
    setFavorites(prev => (prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id]));
  };

  return (
    <main className={`${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-950 to-teal-900 text-white' : 'bg-white text-gray-900'} min-h-screen p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">🎧 مشغل القرآن الكريم</h1>
          <button onClick={() => setDarkMode(d => !d)} className="p-2 rounded-md border">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        {/* اختيار القارئ/المصحف */}
        <section className="bg-white/10 rounded-xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">القارئ</label>
              <select
                className="w-full p-2 rounded bg-white/5"
                value={selectedReciterId ?? ''}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : null;
                  setSelectedReciterId(val);
                }}
              >
                <option value="">--- اختر قارئاً ---</option>
                {reciters.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">المصحف</label>
              <select
                className="w-full p-2 rounded bg-white/5"
                value={selectedMoshafIndex ?? ''}
                onChange={(e) => {
                  const idx = e.target.value !== '' ? Number(e.target.value) : null;
                  setSelectedMoshafIndex(idx);
                }}
                disabled={!selectedReciterId}
              >
                <option value="">--- اختر مصحفاً ---</option>
                {moshafs?.map((m, i) => (
                  <option key={i} value={i}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">البحث / التكرار</label>
              <div className="flex gap-2">
                <select value={repeatCount} onChange={(e) => setRepeatCount(Number(e.target.value))} className="p-2 rounded bg-white/5">
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{`تكرار ×${n}`}</option>)}
                </select>
                <button onClick={() => { if (selectedMoshaf) { setSurahs([]); /* force reload surahs effect */ setTimeout(()=>{},0); } }} className="px-3 rounded border">تحديث</button>
              </div>
            </div>
          </div>
        </section>

        {/* قائمة السور */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">قائمة السور</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
            {surahs.length === 0 ? (
              <div className="text-sm text-gray-300">اختر قارئًا ثم مصحفًا لتحميل السور.</div>
            ) : (
              surahs.map(s => (
                <div key={s.id} className="flex items-center justify-between bg-white/5 p-2 rounded">
                  <button className="text-start w-full" onClick={() => playSurah(s)}>
                    {s.name}
                  </button>
                  <button onClick={() => toggleFavorite(s)} className="ml-2">
                    {favorites.includes(s.id) ? <FaStar /> : <FaRegStar />}
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* مشغل الصوت */}
        <section className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold">{currentSurah ? `${currentSurah.name}` : 'لم يتم اختيار سورة'}</p>
              <p className="text-sm text-gray-300">
                {currentSurah && selectedReciter ? `${selectedReciter.name} — ${selectedMoshaf?.name ?? ''}` : ''}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handlePrev} className="p-2 rounded-md border"><FaStepBackward /></button>
              <button onClick={togglePlay} className="p-3 rounded-full bg-teal-500 text-white shadow">
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button onClick={stopAudio} className="p-2 rounded-md border"><FaStop /></button>
              <button onClick={handleNext} className="p-2 rounded-md border"><FaStepForward /></button>
            </div>
          </div>

          <div className="mb-3">
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm mt-1">
              <span>{audioRef.current ? formatTime((audioRef.current.currentTime || 0)) : '00:00'}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={toggleMute} className="p-2 rounded-md border">
                {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => handleVolume(Number(e.target.value))} className="w-40" />
              <span className="text-sm">{Math.round(volume * 100)}%</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (!currentSurah) return;
                  toggleFavorite(currentSurah);
                }}
                className="px-3 py-1 rounded border"
              >
                {currentSurah && favorites.includes(currentSurah.id) ? <FaStar /> : <FaRegStar />} المفضلة
              </button>
              <div className="text-sm text-gray-300">التكرار: ×{repeatCount} (جاري: {repeatCounter})</div>
            </div>
          </div>

          {/* مخفي: عنصر audio للتوافق (نستخدم أيضاً audioRef element) */}
          <audio ref={audioRef} />
        </section>
      </div>
    </main>
  );
}

/* small helper */
function formatTime(seconds: number) {
  if (!seconds || seconds <= 0 || isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
