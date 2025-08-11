'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

type Channel = {
  id: number;
  name: string;
  url: string;
  logo?: string;
  category?: string;
};

export default function LiveTV() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/livetv.json', {
          next: { revalidate: 3600 } // إعادة التحقق كل ساعة
        });

        if (!response.ok) {
          throw new Error('فشل في تحميل القنوات');
        }

        const data = await response.json();
        
        if (!Array.isArray(data?.livetv)) {
          throw new Error('هيكل البيانات غير صحيح');
        }

        setChannels(data.livetv);
      } catch (err) {
        console.error('Error fetching channels:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // استخراج التصنيفات الفريدة من القنوات
  const categories = ['الكل', ...new Set(channels.map(ch => ch.category || 'عام'))];

  // تصفية القنوات حسب التصنيف المحدد
  const filteredChannels = selectedCategory === 'الكل' 
    ? channels 
    : channels.filter(ch => ch.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-teal-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-500 mb-4"></div>
        <p className="text-xl">جاري تحميل القنوات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-teal-900 p-4">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-teal-600 rounded hover:bg-teal-700 transition"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (filteredChannels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-teal-900 p-4">
        <p className="text-gray-400 text-lg">
          {channels.length === 0 ? 'لا توجد قنوات متاحة' : 'لا توجد قنوات في هذا التصنيف'}
        </p>
        {channels.length > 0 && (
          <button 
            onClick={() => setSelectedCategory('الكل')}
            className="mt-4 px-4 py-2 bg-teal-600 rounded hover:bg-teal-700 transition"
          >
            عرض جميع القنوات
          </button>
        )}
      </div>
    );
  }

  return (
    <main className="pt-20 px-4 min-h-screen bg-gradient-to-b from-gray-900 via-purple-950 to-teal-900 text-white pb-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">📺 البث المباشر</h1>
          <p className="text-gray-300 text-lg">شاهد القنوات الإسلامية مباشرة</p>
        </header>

        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full transition ${
                  selectedCategory === category
                    ? 'bg-teal-600 text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChannels.map(channel => (
            <div
              key={channel.id}
              className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-teal-400/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={channel.logo || '/tv-placeholder.png'}
                  alt={channel.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-3 truncate">{channel.name}</h3>
                <div className="flex gap-2">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 bg-cyan-600 hover:bg-cyan-700 rounded transition"
                  >
                    ▶️ مشاهدة مباشرة
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}