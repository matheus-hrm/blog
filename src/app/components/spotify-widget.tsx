"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function SpotifyWidget() {
  const [spotifyData, setSpotifyData] = useState<{
    isPlaying: boolean;
    title?: string;
    artist?: string;
    albumImageUrl?: string;
    songUrl?: string;
  }>({ isPlaying: false });

  const fetchSpotifyData = async () => {
    try {
      const res = await fetch("/api/spotify");
      if (!res.ok) throw new Error("Failed to fetch Spotify data");
      const data = await res.json();
      setSpotifyData(data);
    } catch (err) {
      console.error("Error fetching Spotify data", err);
    }
  };

  useEffect(() => {
    fetchSpotifyData();
    const interval = setInterval(fetchSpotifyData, 29999); // Refresh every ~30s
    return () => clearInterval(interval);
  }, []);

  if (!spotifyData.isPlaying) return <div id="spotify-widget" />;

  return (
    <div
      id="spotify-data"
      className="flex-row flex mt-4 items-center justify-center"
    >
      <svg
        width="24"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="12"
          y="2"
          width="1.5"
          height="1.5"
          rx="0.75"
          fill="currentColor"
        >
          <animate
            attributeName="width"
            values="-1.5;12;1.5"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0s"
          />
          <animate
            attributeName="x"
            values="10;6;12"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0s"
          />
        </rect>
        <rect
          x="12"
          y="6"
          width="1.5"
          height="1.5"
          rx="0.75"
          fill="currentColor"
        >
          <animate
            attributeName="width"
            values="-1.5;12;1.5"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.2s"
          />
          <animate
            attributeName="x"
            values="10;6;12"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.2s"
          />
        </rect>
        <rect
          x="12"
          y="10"
          width="1.5"
          height="1.5"
          rx="0.75"
          fill="currentColor"
        >
          <animate
            attributeName="width"
            values="-1.5;12;1.5"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.4s"
          />
          <animate
            attributeName="x"
            values="10;6;12"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.4s"
          />
        </rect>
        <rect
          x="12"
          y="14"
          width="1.5"
          height="1.5"
          rx="0.75"
          fill="currentColor"
        >
          <animate
            attributeName="width"
            values="-1.5;12;1.5"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.6s"
          />
          <animate
            attributeName="x"
            values="10;6;12"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.6s"
          />
        </rect>
        <rect
          x="12"
          y="18"
          width="1.5"
          height="1.5"
          rx="0.75"
          fill="currentColor"
        >
          <animate
            attributeName="width"
            values="-1.5;12;1.5"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.8s"
          />
          <animate
            attributeName="x"
            values="10;6;12"
            dur="1.2s"
            repeatCount="indefinite"
            begin="0.8s"
          />
        </rect>
      </svg>
      <a href={spotifyData.songUrl} target="_blank" rel="noopener noreferrer">
        <Image
          id="album-cover"
          src={spotifyData.albumImageUrl || ""}
          alt={spotifyData.title || ""}
          width={36}
          height={36}
          className="w-[36px]"
        />
      </a>
      <div className="flex flex-col ml-1">
        <p id="title" className="text-sm font-semibold">
          {spotifyData.title}
        </p>
        <p id="artist" className="text-xs font-thin">
          {spotifyData.artist}
        </p>
      </div>
    </div>
  );
}
