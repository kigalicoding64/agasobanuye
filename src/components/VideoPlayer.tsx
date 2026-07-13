"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Maximize, Volume2 } from "lucide-react";

/**
 * If `src` ends in .m3u8 (e.g. a Cloudflare Stream or self-transcoded HLS manifest),
 * we load it through hls.js for automatic adaptive bitrate switching based on the
 * viewer's connection speed - this is the "automatic video quality adjustment"
 * requirement. If `src` is a plain .mp4, the browser plays it natively and the
 * quality selector just swaps between pre-rendered renditions you provide.
 */
export default function VideoPlayer({
  src,
  poster,
  qualityRenditions,
}: {
  src: string;
  poster?: string;
  qualityRenditions?: Record<string, string>; // e.g. { "1080p": url, "720p": url, "480p": url }
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [quality, setQuality] = useState("Auto");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (src.endsWith(".m3u8")) {
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
          return () => hls.destroy();
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src; // Safari has native HLS support
        }
      });
    } else {
      video.src = quality === "Auto" ? src : qualityRenditions?.[quality] || src;
    }
  }, [src, quality, qualityRenditions]);

  return (
    <div className="relative bg-black w-full" style={{ aspectRatio: "16/9" }}>
      <video
        ref={videoRef}
        poster={poster}
        controls
        className="w-full h-full"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {qualityRenditions && (
        <div className="absolute top-3 right-3">
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="bg-black/60 text-cream text-xs border border-cream/30 rounded px-2 py-1"
          >
            <option value="Auto">Auto</option>
            {Object.keys(qualityRenditions).map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
