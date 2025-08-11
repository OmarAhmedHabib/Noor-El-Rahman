'use client';
import { useEffect, useState } from 'react';
import Hls from 'hls.js';

type Channel = {
  id: number;
  name: string;
  url: string;
  logo: string;
  category: string;
};

export default function LiveTVPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);

  useEffect(() => {
    fetch('/data/livetv.json')
      .then((res) => res.json())
      .then((data) => setChannels(data.livetv));
  }, []);

  useEffect(() => {
    if (currentChannel && currentChannel.url) {
      const video = document.getElementById('liveVideo') as HTMLVideoElement;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(currentChannel.url);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = currentChannel.url;
      }
    }
  }, [currentChannel]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">📺 القنوات المباشرة</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className="bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition"
            onClick={() => setCurrentChannel(ch)}
          >
            <img src={ch.logo} alt={ch.name} className="w-full h-40 object-contain bg-gray-200" />
            <div className="p-4 text-center font-semibold">{ch.name}</div>
          </div>
        ))}
      </div>

      {currentChannel && (
        <div className="mt-6 bg-black p-4 rounded-lg">
          <h2 className="text-white mb-2">{currentChannel.name}</h2>
          <video
            id="liveVideo"
            controls
            autoPlay
            className="w-full rounded-lg"
          ></video>
        </div>
      )}
    </div>
  );
}
