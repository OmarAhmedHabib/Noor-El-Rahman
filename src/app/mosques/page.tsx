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

  // 📌 دالة لحساب المسافة بين نقطتين
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // المسافة بالكيلومتر
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!navigator.geolocation) {
      setError('⚠️ المتصفح لا يدعم تحديد الموقع الجغرافي.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const query = `
            [out:json];
            (
              node["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${latitude},${longitude});
              way["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${latitude},${longitude});
              relation["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${latitude},${longitude});
            );
            out center;
          `;

          // 📌 استخدام POST بدلاً من GET
          const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query,
          });

          if (!res.ok) throw new Error("فشل الاتصال بخادم البيانات");

          const data = await res.json();

          if (!data.elements || data.elements.length === 0) {
            setMosques([]);
            setLoading(false);
            return;
          }

          // 📌 تحويل البيانات
          const results = data.elements.map((m: any) => {
            const lat = m.lat || m.center?.lat;
            const lon = m.lon || m.center?.lon;

            return {
              name: m.tags?.name || 'مسجد',
              address: m.tags?.['addr:street'] || 'عنوان غير معروف',
              distance: lat && lon ? `${getDistance(latitude, longitude, lat, lon)} كم` : 'غير محدد',
            };
          });

          setMosques(results);
        } catch (err) {
          console.error(err);
          setError('❌ فشل في جلب بيانات المساجد.');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError('⚠️ الرجاء السماح بالوصول إلى الموقع.');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
              <h3 className="text-lg font-semibold">🕌 {m.name}</h3>
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
