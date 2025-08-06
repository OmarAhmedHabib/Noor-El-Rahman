'use client';

import { useEffect, useState } from 'react';

type Channel = {
  id: number;
  name: string;
  url: string;
};

export default function LiveTV() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/livetv.json') // ✅ ضع هنا رابط API الجديد (أو ملف JSON)
      .then((res) => {
        if (!res.ok) throw new Error('فشل تحميل القنوات');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data.livetv)) {
          setChannels(data.livetv);
        } else {
          setError('❌ البيانات غير صحيحة');
        }
      })
      .catch(() => setError('❌ تعذر الاتصال بالخادم'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="pt-20 flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-teal-900 text-white text-xl">
        ⏳ جاري تحميل القنوات...
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-20 flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-teal-900 text-red-400 text-lg">
        {error}
      </main>
    );
  }

  if (channels.length === 0) {
    return (
      <main className="pt-20 flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-teal-900 text-gray-400 text-lg">
        ❌ لا توجد قنوات متاحة حالياً
      </main>
    );
  }

  return (
    <main className="pt-20 px-6 min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-teal-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📺 البث المباشر</h1>
      <p className="text-center text-gray-300 mb-8">
        شاهد القنوات الإسلامية مباشرة
      </p>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg hover:scale-105 transition-transform hover:shadow-teal-400/20"
          >
            <img
              src="/tv-placeholder.png"
              alt={ch.name}
              className="w-full h-40 object-cover rounded-lg mb-3 border border-gray-700"
            />
            <h3 className="text-lg font-bold mb-2">{ch.name}</h3>

            <button
              onClick={() => window.open(ch.url, '_blank')}
              className="w-full py-2 rounded font-semibold bg-cyan-500 hover:bg-cyan-600 transition"
            >
              ▶️ اضغط للمشاهدة
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
