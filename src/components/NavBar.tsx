'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/', text: 'الرئيسية', icon: 'fa-home' },
  { href: '/about', text: 'عن التطبيق', icon: 'fa-info-circle' },
  { href: '/azkar', text: 'الأذكار', icon: 'fa-pray' },
  { href: '/QuranPlayer', text: 'القرآن', icon: 'fa-quran' },
  { href: '/times', text: 'مواقيت الصلاة', icon: 'fa-clock' },
  { href: '/mosques', text: 'المساجد', icon: 'fa-mosque' },
  { href: '/live-tv', text: 'بث مباشر', icon: 'fa-tv' },
  { href: '/contact', text: 'تواصل معنا', icon: 'fa-envelope' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  // 🔹 روابط أسفل الموبايل (5 أيقونات)
  const bottomLinks = navLinks.filter(
    (l) => !['/live-tv', '/contact'].includes(l.href)
  );

  // 🔹 روابط أعلى الموبايل (البث المباشر + تواصل معنا)
  const topIcons = navLinks.filter((l) =>
    ['/live-tv', '/contact'].includes(l.href)
  );

  return (
    <>
      {/* ✅ Navbar لأجهزة الكمبيوتر */}
      <nav className="hidden md:flex fixed top-0 w-full z-50 bg-gradient-to-r from-[#80084e] via-[#08014d] to-[#7b7bacb4] border-b border-cyan-400/30 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl flex justify-between items-center px-6 h-16 w-full">
          <Link href="/" className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">نور</span>{' '}
            <span className="bg-gradient-to-r from-pink-400 to-gray-300 bg-clip-text text-transparent">الرحمن</span>
          </Link>

          <ul className="flex ms-28 space-x-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isActive(link.href)
                      ? 'font-bold text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-white hover:text-cyan-300'
                  }`}
                >
                  <i className={`fas ${link.icon}`}></i>
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ✅ شريط أعلى الموبايل (البث المباشر يمين + الشعار في النص + تواصل معنا شمال) */}
      <div className="md:hidden fixed top-0 w-full bg-gradient-to-r from-[#0f0c29] via-[#1a1036] to-[#0f0c29] border-b border-cyan-400/30 z-50 shadow-lg flex items-center justify-between px-4 py-5">
        {/* أيقونة البث المباشر */}
        <Link href="/live-tv" className="flex flex-col items-center text-xs group">
          <i className={`fas fa-tv text-lg ${isActive('/live-tv') ? 'text-cyan-400' : 'text-gray-300 group-hover:text-cyan-300'}`}></i>
        </Link>

        {/* الشعار في النص */}
        <h1 className="text-lg font-extrabold tracking-wide text-center ">
          <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent animate-pulse">نور</span>{' '}
          <span className="bg-gradient-to-r from-pink-400 to-gray-300 bg-clip-text text-transparent">الرحمن</span>
        </h1>

        {/* أيقونة تواصل معنا */}
        <Link href="/contact" className="flex flex-col items-center text-xs group">
          <i className={`fas fa-envelope text-lg ${isActive('/contact') ? 'text-cyan-400' : 'text-gray-300 group-hover:text-cyan-300'}`}></i>
        </Link>
      </div>

      {/* ✅ شريط أسفل الموبايل (5 أيقونات) */}
      <div className="md:hidden fixed bottom-0 w-full bg-gradient-to-r from-[#0f0c29] via-[#1a1036] to-[#0f0c29] border-t border-cyan-400/30 flex justify-around items-center py-2 z-50 backdrop-blur-lg shadow-2xl">
        {bottomLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link key={link.href} href={link.href} className="relative flex flex-col items-center text-xs group w-16">
              {active && <span className="absolute top-0 w-10 h-10 rounded-full bg-cyan-400/20 blur-md animate-pulse"></span>}
              <i className={`fas ${link.icon} text-lg mb-1 transition-all duration-300 ${active ? 'text-cyan-400 scale-125 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'text-gray-400 group-hover:text-cyan-300 group-hover:scale-110'}`}></i>
              <span className={`text-[11px] font-medium ${active ? 'text-cyan-300 font-semibold' : 'text-gray-300 group-hover:text-cyan-300'}`}>{link.text}</span>
            </Link>
          );
        })}
      </div>

      {/* ✅ مسافة أسفل وأعلى لتجنب تغطية المحتوى */}
      <div className="h-16 md:block hidden"></div>
      <div className="h-16   md:hidden block"></div>
    </>
  );
}
