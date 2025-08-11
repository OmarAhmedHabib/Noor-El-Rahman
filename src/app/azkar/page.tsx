'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Category {
  type: string;
  title: string;
  color: string;
}

export default function AzkarPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAzkarCategories = async () => {
      try {
        const res = await fetch('/data/azkar.json');
        if (!res.ok) {
          throw new Error('فشل تحميل بيانات التصنيفات');
        }
        const data = await res.json();
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          throw new Error('هيكل البيانات غير صحيح');
        }
      } catch (err) {
        console.error('Error:', err);
        setError('حدث خطأ أثناء تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchAzkarCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-2xl">⏳ جاري تحميل التصنيفات...</p>
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
    <main
      className={`pt-20 px-6 min-h-screen transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-b from-gray-900 via-green-950 to-teal-800 text-white'
          : 'bg-gradient-to-b from-gray-100 via-green-100 to-teal-200 text-black'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📖 اختر نوع الأذكار</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 transition"
          >
            {darkMode ? '☀️ وضع النهار' : '🌙 وضع الليل'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.type}
              href={`/azkar/${category.type}`}
              className={`p-6 rounded-xl shadow-lg bg-gradient-to-r ${category.color} text-white text-xl font-semibold text-center transform hover:scale-105 transition duration-300 hover:shadow-xl flex flex-col items-center justify-center min-h-[120px]`}
            >
              {category.title}
            </Link>
          ))}
        </div>

        {categories.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-xl">⚠️ لا توجد تصنيفات أذكار متاحة</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              إعادة المحاولة
            </button>
          </div>
        )}
      </div>
    </main>
  );
}