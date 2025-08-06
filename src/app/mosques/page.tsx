'use client';

import { useEffect, useState } from 'react';

type Mosque = {
  name: string;
  address: string;
  distance: string;
};

export default function Mosques() {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('⚠️ المتصفح لا يدعم تحديد الموقع الجغرافي.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // استخدام OpenStreetMap Nominatim API كمثال مجاني
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search.php?q=mosque&format=jsonv2&limit=5&viewbox=${longitude - 0.1},${latitude + 0.1},${longitude + 0.1},${latitude - 0.1}`
          );
          const data = await res.json();

          // تحويل البيانات إلى نموذج بسيط
          const results = data.map((m: any) => ({
            name: m.display_name.split(',')[0],
            address: m.display_name,
            distance: 'قريب', // يمكن لاحقًا حساب المسافة الفعلية
          }));

          setMosques(results);
        } catch (err) {
          setError('❌ فشل في جلب بيانات المساجد.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('⚠️ الرجاء السماح بالوصول إلى الموقع.');
        setLoading(false);
      }
    );
  }, []);

  return (
    <main className="pt-20 px-6 min-h-screen bg-gradient-to-b from-gray-900 via-emerald-950 to-green-900 text-white">
      <h1 className="text-4xl font-bold mb-4">🏛️ المساجد القريبة</h1>
      <p className="text-gray-300 mb-6">ابحث عن أقرب مسجد لمكانك.</p>

      {loading && <p>⏳ جارٍ تحديد الموقع وجلب البيانات...</p>}
      {error && <p className="text-red-400">{error}</p>}

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && !error && mosques.length > 0 ? (
          mosques.map((m, i) => (
            <div key={i} className="bg-white/10 p-4 rounded-xl shadow hover:bg-white/20 transition">
              <h3 className="text-lg font-semibold">{m.name}</h3>
              <p className="text-gray-300">{m.address}</p>
              <p className="mt-1 text-green-400">{m.distance}</p>
            </div>
          ))
        ) : (
          !loading && !error && <p>🚫 لم يتم العثور على مساجد قريبة.</p>
        )}
      </div>
    </main>
  );
}
