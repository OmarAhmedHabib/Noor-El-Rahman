'use client';

import { useEffect, useState } from 'react';

type PrayerTimes = {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

export default function Times() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('⚠️ المتصفح لا يدعم تحديد الموقع الجغرافي.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=5`
          );
          const data = await res.json();

          if (!data.data) throw new Error('بيانات غير متوفرة');

          setTimes({
            Fajr: data.data.timings.Fajr,
            Dhuhr: data.data.timings.Dhuhr,
            Asr: data.data.timings.Asr,
            Maghrib: data.data.timings.Maghrib,
            Isha: data.data.timings.Isha,
          });
        } catch (err) {
          setError('❌ فشل في جلب مواقيت الصلاة. تحقق من الاتصال بالإنترنت.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('⚠️ الرجاء السماح بالوصول إلى الموقع للحصول على المواقيت.');
        setLoading(false);
      }
    );
  }, []);

  return (
    <main className="pt-20 px-6 min-h-screen bg-gradient-to-b from-gray-900 via-blue-950 to-teal-900 text-white">
      <div className="max-w-xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-3">🕐 مواقيت الصلاة</h1>
        <p className="text-gray-300">حسب موقعك الجغرافي الحالي (تلقائيًا).</p>
      </div>

      {loading && (
        <p className="text-center text-lg animate-pulse">⏳ جارٍ تحديد الموقع وجلب المواقيت...</p>
      )}

      {error && (
        <p className="text-center text-red-400 bg-red-900/30 p-3 rounded-lg">{error}</p>
      )}

      {!loading && !error && times && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <PrayerCard name="🌅 الفجر" time={times.Fajr} color="from-cyan-500 to-blue-700" />
          <PrayerCard name="🌞 الظهر" time={times.Dhuhr} color="from-yellow-500 to-orange-700" />
          <PrayerCard name="🌇 العصر" time={times.Asr} color="from-orange-400 to-red-600" />
          <PrayerCard name="🌆 المغرب" time={times.Maghrib} color="from-red-500 to-purple-700" />
          <PrayerCard name="🌙 العشاء" time={times.Isha} color="from-indigo-500 to-gray-800" />
        </div>
      )}
    </main>
  );
}

// ✅ مكون صغير لبطاقات الصلاة
function PrayerCard({ name, time, color }: { name: string; time: string; color: string }) {
  return (
    <div className={`p-4 rounded-xl shadow-lg bg-gradient-to-r ${color} text-white text-center`}>
      <h2 className="text-2xl font-bold mb-1">{name}</h2>
      <p className="text-xl">{time}</p>
    </div>
  );
}
  