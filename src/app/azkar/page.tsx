'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Card {
  type: string;
  title: string;
  color: string;
}

export default function AzkarPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    fetch('/data/azkar.json')
      .then(res => res.json())
      .then(data => setCards(data));
  }, []);

  return (
    <main className={`pt-20 px-6 md:mb-0 mb-12 min-h-screen transition-all duration-300 ${
      darkMode
        ? 'bg-gradient-to-b from-gray-900 via-green-950 to-teal-800 text-white'
        : 'bg-gradient-to-b from-gray-100 via-green-100 to-teal-200 text-black'
    }`}>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📖 اختر نوع الأذكار</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded bg-teal-500 hover:bg-teal-600"
        >
          {darkMode ? '☀️ وضع فاتح' : '🌙 وضع ليلي'}
        </button>
      </div>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.type}
            href={`/azkar/${card.type}`}
            className={`p-6 rounded-lg shadow-lg bg-gradient-to-r ${card.color} text-white text-xl font-semibold text-center transform hover:scale-105 transition`}
          >
            {card.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
