"use client";
import { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface Props {
  src: string;
}

export default function VideoPlayer({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        fluid: true,
        preload: "auto",
        autoplay: true,
        sources: [
          {
            src,
            type: "application/x-mpegURL",
          },
        ],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src]);

  return (
    <div>
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered rounded-lg overflow-hidden"
      />
    </div>
  );
}
