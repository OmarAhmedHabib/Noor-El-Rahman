'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Zikr = { id: number; title: string; text: string };

export default function AzkarType({ params }: { params: { type: string } }) {
  const [azkar, setAzkar] = useState<Zikr[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    async function fetchAzkar() {
      try {
        const res = await fetch('/data/azkar.json');
        if (!res.ok) throw new Error('HTTP Error');
        const data = await res.json();
        // Decode URL parameter if needed
        const decodedType = decodeURIComponent(params.type);
        setAzkar(data[decodedType] || []);
      } catch {
        setError('⚠️ فشل تحميل البيانات');
      } finally {
        setLoading(false);
      }
    }
    fetchAzkar();
  }, [params.type]);

  if (loading) return <p className="text-center text-white">⏳ جاري التحميل...</p>;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <main className={`pt-20 px-6 min-h-screen transition ${
      darkMode ? 'bg-gradient-to-b from-gray-900 via-green-950 to-teal-800 text-white'
               : 'bg-gradient-to-b from-gray-100 via-green-100 to-teal-200 text-black'}`}>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📖 {decodeURIComponent(params.type)}</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-1 rounded bg-teal-500 hover:bg-teal-600">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <Link href="/azkar" className="block mb-4 text-center bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        ⬅️ رجوع للصفحة الرئيسية
      </Link>

      <div className="space-y-4">
        {azkar.map((z) => (
          <div key={z.id} className="bg-white/10 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2">{z.title}</h3>
            <p className="mb-3">{z.text}</p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(z.text);
                  alert('✅ تم نسخ الذكر');
                }}
                className="px-3 py-1 bg-teal-500 hover:bg-teal-600 rounded"
              >
                📋 نسخ
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: z.title, text: z.text });
                  } else {
                    alert('❌ المشاركة غير مدعومة في هذا المتصفح');
                  }
                }}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded"
              >
                📤 مشاركة
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}