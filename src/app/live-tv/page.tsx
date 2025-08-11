'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Hls from 'hls.js';

type Channel = {
  id: number;
  name: string;
  url: string;
  logo?: string;
  category?: string;
};

function LivePlayer({
  src,
  poster,
  autoPlay = false,
}: {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoPlay) {
          video.play().catch((e) => console.error('فشل التشغيل التلقائي:', e));
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('خطأ في الشبكة، محاولة إعادة الاتصال...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('خطأ في الوسائط، إعادة التحميل...');
              hls.recoverMediaError();
              break;
            default:
              console.error('خطأ غير قابل للاسترداد:', data);
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        if (autoPlay) {
          video.play().catch((e) => console.error('فشل التشغيل التلقائي:', e));
        }
      });
    } else {
      console.error('HLS غير مدعوم في هذا المتصفح');
    }
  }, [src, autoPlay]);

  return (
    <video
      ref={videoRef}
      controls
      poster={poster}
      className="w-full rounded-lg shadow-lg"
    />
  );
}

export default function LiveTVPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Channel | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('darkMode') === 'false' ? false : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        const res = await fetch('/data/livetv.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data?.livetv)) throw new Error('Invalid data structure');
        setChannels(data.livetv);
        if (data.livetv.length > 0) setSelected(data.livetv[0]);
      } catch (err) {
        console.error(err);
        setError('فشل في تحميل قائمة القنوات.');
      } finally {
        setLoading(false);
      }
    };
    fetchChannels();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', darkMode ? 'true' : 'false');
    } catch {}
  }, [darkMode]);

  const categories = ['الكل', ...Array.from(new Set(channels.map(c => c.category || 'عام')))];

  return (
    <main
      className={`${
        darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'
      } min-h-screen pt-20 px-4 pb-8 transition-colors`}
    >
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">📺 البث المباشر</h1>
            <p className="text-sm text-gray-400">اختَر قناة لبدء المشاهدة داخل الصفحة</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-teal-600 rounded"
          >
            {darkMode ? 'وضع فاتح' : 'وضع ليلي'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* عمود المشغل */}
          <div className="lg:col-span-3">
            {selected ? (
              <>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold">{selected.name}</h2>
                </div>
                <LivePlayer
                  src={selected.url}
                  poster={selected.logo}
                  autoPlay={false}
                />
              </>
            ) : (
              <div className="p-6 bg-white/5 rounded">لم تُختَر قناة بعد.</div>
            )}
          </div>

          {/* عمود قائمة القنوات */}
          <aside className="space-y-4">
            <div className="p-3 bg-white/5 rounded">
              <h3 className="font-semibold mb-2">القنوات ({channels.length})</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map(cat => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-white/10 rounded-full text-sm"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
                {loading && <p>جارٍ التحميل...</p>}
                {channels.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setSelected(ch)}
                    className={`w-full flex items-center gap-3 p-2 rounded hover:bg-white/10 transition ${
                      selected?.id === ch.id ? 'ring-2 ring-teal-500' : ''
                    }`}
                  >
                    <div className="h-12 w-20 relative flex-shrink-0">
                      <Image
                        src={ch.logo || '/tv-placeholder.png'}
                        alt={ch.name}
                        fill
                        className="object-cover rounded"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{ch.name}</div>
                      <div className="text-sm text-gray-400">
                        {ch.category || 'عام'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded">
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full py-2 bg-teal-600 rounded"
              >
                إعادة تحميل القنوات
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
