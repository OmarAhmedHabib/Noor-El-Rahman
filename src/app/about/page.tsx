'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Moshaf = {
  id: number;
  name: string;
  server: string;
  surah_list: string;
};

type Reciter = {
  id: number;
  name: string;
  photo?: string;
  country?: string;
  moshaf: Moshaf[];
};

export default function About() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [filtered, setFiltered] = useState<Reciter[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ جلب بيانات القراء من API
  useEffect(() => {
    fetch('https://mp3quran.net/api/v3/reciters?language=ar')
      .then(res => res.json())
      .then(data => {
        setReciters(data.reciters);
        setFiltered(data.reciters);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ البحث عن قارئ بالاسم
  const handleSearch = (val: string) => {
    setSearch(val);
    setFiltered(reciters.filter(r => r.name.toLowerCase().includes(val.toLowerCase())));
  };

  // ✅ تشغيل أول مصحف للقارئ
  const handlePlay = async (reciterId: number) => {
    const res = await fetch(`https://mp3quran.net/api/v3/reciters?language=eng&reciter=${reciterId}`);
    const data = await res.json();
    const moshaf = data.reciters[0]?.moshaf[0];
    if (moshaf) {
      const url = `/player?server=${encodeURIComponent(moshaf.server)}&list=${encodeURIComponent(moshaf.surah_list)}`;
      window.location.href = url;
    } else {
      alert('❌ لا يوجد مصحف متاح لهذا القارئ');
    }
  };

  return (
    <main className="pt-20 px-6 min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-teal-900 text-white" dir="rtl">
      
      {/* 🟢 نبذة عن التطبيق */}
      <div className="mb-8 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl text-center">
        <h1 className="text-4xl font-bold mb-2">✨ نور الرحمن</h1>
        <p className="text-gray-300">تطبيق شامل للاستماع إلى القرآن الكريم بصوت العديد من القراء المشهورين.</p>
      </div>

      {/* 🟢 مربع البحث */}
      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="🔍 ابحث عن قارئ..."
        className="w-full mb-6 p-3 rounded-lg text-black"
      />

      {loading && <p className="text-center">⏳ جاري تحميل البيانات...</p>}

      {/* 🟢 بطاقات القراء */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((r) => {
          // ✅ حساب عدد السور في جميع المصاحف للقارئ
          const totalSurahs = r.moshaf?.reduce((acc, m) => acc + m.surah_list.split(',').length, 0) || 0;

          return (
            <div key={r.id} className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg hover:scale-105 transition">
              <img
                src={r.photo || '/favicon.ico'}
                alt={r.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-bold">{r.name}</h3>
              <p className="text-sm text-gray-300">{r.country || '🌍 غير معروف'}</p>
              <p className="text-xs text-gray-400">📚 {r.moshaf?.length || 0} مصحف</p>
              <p className="text-xs text-gray-400">📖 {totalSurahs} سورة</p>

              <div className="flex justify-between mt-3">
                {/* ✅ زر تشغيل أول مصحف */}
                <button
                  onClick={() => handlePlay(r.id)}
                  className="bg-teal-500 px-3 py-1 rounded hover:bg-teal-600">
                  🎧 استماع
                </button>

                {/* ✅ رابط عرض جميع مصاحف القارئ */}
                <Link href={`/reciter/${r.id}`} className="bg-cyan-500 px-3 py-1 rounded hover:bg-cyan-600">
                  📖 عرض المصاحف
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
