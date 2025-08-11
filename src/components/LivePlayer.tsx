'use client';
import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface Props {
  src: string;
  poster?: string;
  autoPlay?: boolean;
}

export default function LivePlayer({ src, poster, autoPlay = false }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(null);
    setLoading(true);

    const video = videoRef.current;
    if (!video) return;

    const attachHls = async () => {
      // إذا الرابط m3u8 -> استخدم hls.js أو الNative
      const isM3U8 = src.endsWith('.m3u8');

      try {
        if (isM3U8 && Hls.isSupported()) {
          // استخدم hls.js
          const hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false);
            if (autoPlay) {
              video.play().catch(() => {/* autoplay blocked until user interaction */});
            }
          });
          hls.on(Hls.Events.ERROR, (_ev, data) => {
            console.error('HLS error', data);
            setError('حدث خطأ أثناء تشغيل البث (HLS).');
            setLoading(false);
          });
        } else {
          // mp4 أو المتصفح يدعم HLS نيتف (Safari)
          video.src = src;
          video.addEventListener('loadedmetadata', () => {
            setLoading(false);
            if (autoPlay) {
              video.play().catch(() => {/* autoplay blocked */});
            }
          });
          video.addEventListener('error', () => {
            setError('فشل تحميل الفيديو.');
            setLoading(false);
          });
        }
      } catch (err) {
        console.error(err);
        setError('خطأ غير متوقع أثناء تهيئة المشغل.');
        setLoading(false);
      }
    };

    attachHls();

    return () => {
      // تنظيف
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.src = '';
      }
    };
  }, [src, autoPlay]);

  return (
    <div className="w-full">
      <div className="relative bg-black rounded-lg overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="animate-spin h-12 w-12 border-t-4 border-white/30 rounded-full"></div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-30 flex items-center justify-center p-4">
            <div className="bg-black/70 text-red-300 p-3 rounded">
              <p>{error}</p>
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          controls
          poster={poster}
          className="w-full aspect-video bg-black"
          playsInline
        />
      </div>
    </div>
  );
}
