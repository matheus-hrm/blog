import { NextResponse } from "next/server";

const getAccessToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    cache: "no-store",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN!,
    }).toString(),
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export async function GET() {
  try {
    const { access_token } = await getAccessToken();
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (response.status === 204) {
      return NextResponse.json({ isPlaying: false });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({
      isPlaying: data.is_playing,
      title: data.item?.name,
      artist: data.item?.artists
        .map((artist: { name: string }) => artist.name)
        .join(", "),
      album: data.item?.album.name,
      albumImageUrl: data.item?.album.images[0]?.url,
      songUrl: data.item?.external_urls?.spotify,
    });
  } catch (error) {
    console.error("Error in Spotify API route:", error);
    return NextResponse.json({ isPlaying: false }, { status: 500 });
  }
}
