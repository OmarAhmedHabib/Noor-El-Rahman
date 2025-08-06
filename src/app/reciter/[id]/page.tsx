'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Moshaf = {
  id: number;
  name: string;
  server: string;
  surah_list: string;
};

type Reciter = {
  name: string;
  moshaf: Moshaf[];
};

export default function ReciterPage() {
  const { id } = useParams(); // ✅ جلب معرف القارئ من الرابط
  const [reciter, setReciter] = useState<Reciter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://mp3quran.net/api/v3/reciters?language=arg&reciter=${id}`)
      .then(res => res.json())
      .then(data => {
        const r = data.reciters[0];
        if (r) {
          setReciter({ name: r.name, moshaf: r.moshaf });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center text-white">⏳ جاري تحميل بيانات القارئ...</p>;
  if (!reciter) return <p className="text-center text-red-400">❌ عذرًا، لم يتم العثور على بيانات هذا القارئ</p>;

  return (
    <main dir="rtl" className="pt-20 px-6 min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-teal-900 text-white">
      
      {/* ✅ اسم القارئ */}
      <h1 className="text-3xl font-bold mb-4 text-center">🎤 {reciter.name}</h1>
      <p className="text-center text-gray-300 mb-6">📚 اختر أحد المصاحف المتاحة للاستماع</p>

      {/* ✅ عرض المصاحف */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reciter.moshaf.map((m) => (
          <div key={m.id} className="bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg hover:scale-105 transition">
            
            <h3 className="text-xl font-semibold mb-2">{m.name}</h3>
            <p className="text-gray-300 text-sm mb-3">📖 عدد السور: {m.surah_list.split(',').length}</p>

            <button
              onClick={() => {
                const url = `/player?server=${encodeURIComponent(m.server)}&list=${encodeURIComponent(m.surah_list)}`;
                window.location.href = url;
              }}
              className="bg-gradient-to-r from-teal-500 to-green-600 w-full py-2 rounded-lg font-bold text-white hover:opacity-90 transition"
            >
              🎧 تشغيل المصحف
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
