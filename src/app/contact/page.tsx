'use client';

import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // ✅ تحديث الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ إرسال البيانات عبر WhatsApp بدلاً من Formspree
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    // ✅ رابط واتساب مع البيانات المدخلة
    const whatsappMsg = `👤 الاسم: ${formData.name}%0A📧 البريد: ${formData.email}%0A💬 الرسالة: ${formData.message}`;
    const whatsappUrl = `https://wa.me/201144629507?text=${whatsappMsg}`;

    // فتح الواتساب
    window.open(whatsappUrl, '_blank');

    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  return (
    <main className="pt-20 px-6 min-h-screen bg-gradient-to-b from-gray-900 via-pink-950 to-teal-900 text-white flex flex-col">
      
      {/* ✅ عنوان الصفحة */}
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2">📩 تواصل معنا</h1>
        <p className="text-gray-300">يمكنك إرسال اقتراحاتك أو استفساراتك عبر النموذج أدناه أو مباشرة عبر الواتساب.</p>
      </div>

      {/* ✅ نموذج الاتصال */}
      <form 
        onSubmit={handleSubmit} 
        className="max-w-md mx-auto bg-white/10 p-6 rounded-xl shadow-lg space-y-4 backdrop-blur-md flex-grow"
      >
        <input 
          type="text" 
          name="name"
          placeholder="اسمك" 
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input 
          type="email" 
          name="email"
          placeholder="بريدك الإلكتروني" 
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-500"
        />
        <textarea 
          name="message"
          placeholder="اكتب رسالتك..." 
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-500"
        />

        <button 
          type="submit" 
          disabled={status === 'loading'} 
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 rounded-lg transition disabled:opacity-50"
        >
          {status === 'loading' ? '⏳ جارٍ التحويل للواتساب...' : '📤 إرسال عبر WhatsApp'}
        </button>

        {/* ✅ رسائل التنبيه */}
        {status === 'success' && <p className="text-green-400 text-center">✅ تم فتح الواتساب لإرسال رسالتك!</p>}
        {status === 'error' && <p className="text-red-400 text-center">❌ الرجاء ملء جميع الحقول.</p>}
      </form>

      {/* ✅ النص في الأسفل */}
      <footer className="text-center text-gray-400 mt-6 mb-3">
        🚀 تم إنشاء هذا الموقع بواسطة <span className="text-teal-400 font-bold">عمر حبيب</span>
      </footer>
    </main>
  );
}
