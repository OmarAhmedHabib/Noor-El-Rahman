"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0d0d2b] to-black text-white pt-20 relative">

      {/* 🌟 خلفية زخارف إسلامية */}
      <div className="absolute inset-0">
        <img 
      src="/images/islamic-bg.jpg" 
          alt="خلفية إسلامية"
          className="md:w-full md:h-full h-full object-cover opacity-100" 
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10">
        {/* 🌟 Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden text-center">
          <div className="max-w-5xl mx-auto relative z-10">
            <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
              نور الرحمن
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-8">
              تطبيق متكامل لخدمات المسلمين، من أذكار وقرآن وأوقات الصلاة والمزيد.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/azkar" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-full font-medium transition transform hover:scale-105 shadow-lg">
                ابدأ الأذكار
              </Link>
              <Link href="/QuranPlayer" className="px-6 py-3 border border-teal-400 text-teal-400 hover:bg-teal-900/30 rounded-full font-medium transition transform hover:scale-105 shadow-lg">
                استمع للقرآن
              </Link>
            </div>
          </div>
        </section>

        {/* 🌟 Features Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-10">
          {[
            { href: '/azkar', title: 'الأذكار اليومية', icon: '📖', desc: 'أذكار الصباح والمساء وأدعية متنوعة' },
            { href: '/QuranPlayer', title: 'مشغل القرآن', icon: '🎧', desc: 'استمع لأي سورة بصوت أشهر القراء' },
            { href: '/times', title: 'مواقيت الصلاة', icon: '🕌', desc: 'مواعيد الصلاة حسب موقعك الجغرافي' },
            { href: '/mosques', title: 'المساجد القريبة', icon: '📍', desc: 'ابحث عن أقرب مسجد في منطقتك' },
            { href: '/about', title: 'عن التطبيق', icon: 'ℹ️', desc: 'معلومات عن التطبيق ومميزاته' },
            { href: '/contact', title: 'اتصل بنا', icon: '📩', desc: 'للاقتراحات أو الاستفسارات' },
          ].map((f) => (
            <Link 
              key={f.href} 
              href={f.href}
              className="bg-white/5 border border-gray-700 rounded-xl p-6 backdrop-blur-md transition-all hover:bg-white/10 hover:shadow-lg hover:shadow-teal-500/10 hover:-translate-y-1"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </Link>
          ))}
        </div>

        {/* 🌟 Footer */}
        <footer className="py-12 px-4 bg-gradient-to-r from-[#0d0d2b] via-[#1a1a3a] to-[#0d0d2b] text-center border-t border-cyan-400/20 shadow-inner relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">💌 تواصل معنا</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              نرحب بآرائكم واقتراحاتكم لتطوير التطبيق وتحسين تجربة المستخدم.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <a href="mailto:omar@example.com" className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 px-6 py-3 rounded-full font-semibold transition transform hover:scale-105 shadow-lg">
                ✉️ البريد الإلكتروني
              </a>
              <a href="tel:01144629507" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 rounded-full font-semibold transition transform hover:scale-105 shadow-lg">
                📞 اتصال مباشر
              </a>
            </div>
            <p className="text-gray-500 text-sm md:py-0 py-5">
              © {new Date().getFullYear()} تم إنشاء هذا الموقع بواسطة <span className="text-cyan-400 font-semibold">عمر حبيب</span>
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
