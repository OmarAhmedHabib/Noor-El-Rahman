'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Zikr {
  id: number;
  title: string;
  text: string;
  reference?: string;
  repetition?: number;
}

export default function AzkarTypePage() {
  const params = useParams();
  const [darkMode, setDarkMode] = useState(true);
  const [azkar, setAzkar] = useState<Zikr[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAzkar = async () => {
      try {
        // جلب بيانات التصنيفات أولاً للحصول على عنوان التصنيف
        const categoriesRes = await fetch('/data/azkar.json');
        if (!categoriesRes.ok) throw new Error('Failed to load categories');
        const categoriesData = await categoriesRes.json();
        
        const category = categoriesData.categories.find(
          (cat: any) => cat.type === params.type
        );
        setCategoryTitle(category?.title || '');

        // جلب بيانات الأذكار الخاصة بهذا التصنيف
        const azkarRes = await fetch(`/data/azkar-${params.type}.json`);
        if (!azkarRes.ok) throw new Error('Failed to load azkar');
        const azkarData = await azkarRes.json();
        
        setAzkar(azkarData);
      } catch (err) {
        console.error('Error:', err);
        setError('حدث خطأ أثناء تحميل الأذكار');
      } finally {
        setLoading(false);
      }
    };

    if (params.type) {
      fetchAzkar();
    }
  }, [params.type]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl">⏳ جاري تحميل الأذكار...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div
      className={`pt-20 px-6 min-h-screen transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-b from-gray-900 via-green-950 to-teal-800 text-white'
          : 'bg-gradient-to-b from-gray-100 via-green-100 to-teal-200 text-black'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{categoryTitle}</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 transition"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <Link
          href="/azkar"
          className="inline-block mb-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ⬅️ العودة لتصنيفات الأذكار
        </Link>

        <div className="space-y-6">
          {azkar.map((zikr) => (
            <div
              key={zikr.id}
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? 'bg-white/10' : 'bg-gray-800/10'
              }`}
            >
              <h3 className="text-2xl font-semibold mb-3">{zikr.title}</h3>
              <p className="text-lg mb-4 whitespace-pre-line">{zikr.text}</p>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(zikr.text);
                    alert('تم نسخ الذكر بنجاح');
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition"
                >
                  📋 نسخ الذكر
                </button>
                
                {zikr.repetition && (
                  <span className="px-4 py-2 bg-purple-600 rounded-lg">
                    التكرار: {zikr.repetition} مرات
                  </span>
                )}
              </div>
              
              {zikr.reference && (
                <p className="mt-3 text-sm opacity-80">المصدر: {zikr.reference}</p>
              )}
            </div>
          ))}
        </div>

        {azkar.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl">🚫 لا توجد أذكار متاحة لهذا التصنيف</p>
          </div>
        )}
      </div>
    </div>
  );
}