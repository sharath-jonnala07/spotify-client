"use client";

import React, { useState, useEffect } from "react";
import { useSpotify, Song } from "@/context/SpotifyContext";
import { Play, Pause, Clock, Check, MoreHorizontal } from "lucide-react";
import ContextMenu from "../ui/ContextMenu";

interface ArtistDetailProps {
  artistName: string;
}

export default function ArtistDetail({ artistName }: ArtistDetailProps) {
  const {
    activeTrack,
    isPlaying,
    playTrack,
    likedSongs,
    likeTrackToggle
  } = useSpotify();

  const [artistTracks, setArtistTracks] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [listeners, setListeners] = useState<string>("15,249,584");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; song: Song } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, song: Song) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      song
    });
  };

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // Map API song helper
  const mapSongFromApi = (apiSong: any): Song => {
    let durationSeconds = 200;
    if (apiSong.duration && apiSong.duration.includes(":")) {
      const parts = apiSong.duration.split(":");
      durationSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return {
      id: apiSong.id,
      title: apiSong.title,
      artist: apiSong.artist,
      album: apiSong.album,
      duration: apiSong.duration,
      durationSeconds: durationSeconds,
      coverUrl: apiSong.image_url || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60",
      audioUrl: ""
    };
  };

  useEffect(() => {
    const fetchArtistTracks = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/tracks/artists/${encodeURIComponent(artistName)}`);
        if (res.ok) {
          const data = await res.json();
          setArtistTracks(data.map(mapSongFromApi));
        }
      } catch (err) {
        console.error("Failed to fetch artist tracks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistTracks();

    // Check following state in localStorage
    const followingList = localStorage.getItem("spotify_following_artists");
    if (followingList) {
      const parsed = JSON.parse(followingList);
      setIsFollowing(parsed.includes(artistName));
    }

    // Generate a consistent listener count based on name length
    const hash = artistName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const count = (hash * 12345) % 30000000 + 5000000;
    setListeners(count.toLocaleString());
  }, [artistName]);

  const handleFollowToggle = () => {
    const followingList = localStorage.getItem("spotify_following_artists");
    let parsed: string[] = [];
    if (followingList) {
      parsed = JSON.parse(followingList);
    }

    if (isFollowing) {
      parsed = parsed.filter((a) => a !== artistName);
      setIsFollowing(false);
    } else {
      parsed.push(artistName);
      setIsFollowing(true);
    }
    localStorage.setItem("spotify_following_artists", JSON.stringify(parsed));
  };

  const handlePlayArtist = () => {
    if (artistTracks.length > 0) {
      const isSongPlaying = isPlaying && artistTracks.some((s) => s.id === activeTrack?.id);
      if (isSongPlaying) {
        // Toggle play
        playTrack(activeTrack!);
      } else {
        // Play first track and set queue to artist tracks
        playTrack(artistTracks[0], artistTracks);
      }
    }
  };

  const isArtistPlaying = isPlaying && artistTracks.some((s) => s.id === activeTrack?.id);

  // Background banner image based on artist or generic high quality musical background
  const bannerImage = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&auto=format&fit=crop&q=80";

  return (
    <div className="flex-1 flex flex-col bg-[#121212] overflow-y-auto pb-24 font-sans select-none relative">
      {/* Top Banner Header */}
      <div
        className="relative flex items-end px-6 pt-28 pb-6 min-h-[380px] bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(18, 18, 18, 1)), url(${bannerImage})` }}
      >
        <div className="flex flex-col gap-2 z-10">
          <div className="flex items-center gap-1.5 text-[14px] font-bold text-white">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3d91f4] text-white">
              <Check size={12} strokeWidth={3} />
            </span>
            <span>Verified Artist</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight drop-shadow-md py-2">
            {artistName}
          </h1>

          <p className="text-[14px] text-white/90 font-medium drop-shadow-md mt-1">
            {listeners} monthly listeners
          </p>
        </div>
      </div>

      {/* Control Buttons Bar */}
      <div className="flex items-center gap-6 px-6 py-6 bg-black/10">
        {/* Play Circle button */}
        <button
          onClick={handlePlayArtist}
          disabled={artistTracks.length === 0}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] text-black hover:scale-104 active:scale-98 transition duration-100 shadow-md hover:bg-[#1fdf64] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
        >
          {isArtistPlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" className="ml-1" />
          )}
        </button>

        {/* Follow Button */}
        <button
          onClick={handleFollowToggle}
          className={`rounded-full border px-4 py-1.5 text-[13px] font-bold tracking-tight hover:scale-104 active:scale-98 transition duration-100 uppercase ${
            isFollowing
              ? "border-[#1ed760] text-[#1ed760] hover:border-[#1fdf64]"
              : "border-[#7c7c7c] text-white hover:border-white"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>

        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#b3b3b3] hover:text-white transition">
          <MoreHorizontal size={28} />
        </button>
      </div>

      {/* Popular Tracks Table */}
      <div className="px-6">
        <h3 className="text-[20px] font-bold text-white tracking-tight mb-4">Popular</h3>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 w-full bg-[#1f1f1f] rounded animate-pulse" />
            ))}
          </div>
        ) : artistTracks.length > 0 ? (
          <table className="w-full text-left border-collapse text-[#b3b3b3] font-sans">
            <tbody>
              {artistTracks.map((song, index) => {
                const isTrackActive = activeTrack?.id === song.id;
                const isTrackPlaying = isTrackActive && isPlaying;
                const isSongLiked = likedSongs.some((s) => s.id === song.id);

                // Consistent mock play count
                const trackHash = song.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
                const plays = ((trackHash * 98765) % 80000000 + 1000000).toLocaleString();

                return (
                  <tr
                    key={song.id}
                    onClick={() => playTrack(song, artistTracks)}
                    onContextMenu={(e) => handleContextMenu(e, song)}
                    className="group hover:bg-white/10 rounded-md transition duration-100 cursor-pointer"
                  >
                    {/* Index or Play button */}
                    <td className="py-3.5 text-center text-[14px] font-medium w-12 text-[#b3b3b3]">
                      <span className="group-hover:hidden">
                        {isTrackActive ? (
                          <span className="text-[#1ed760]">●</span>
                        ) : (
                          index + 1
                        )}
                      </span>
                      <span className="hidden group-hover:block text-white">
                        {isTrackPlaying ? (
                          <Pause size={14} className="mx-auto" />
                        ) : (
                          <Play size={14} className="mx-auto" fill="currentColor" />
                        )}
                      </span>
                    </td>

                    {/* Cover art + Title */}
                    <td className="py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="h-10 w-10 object-cover rounded"
                        />
                        <p className={`text-[14px] font-bold truncate ${isTrackActive ? "text-[#1ed760]" : "text-white"}`}>
                          {song.title}
                        </p>
                      </div>
                    </td>

                    {/* Play count */}
                    <td className="py-3 text-[14px] font-normal hidden sm:table-cell">
                      {plays}
                    </td>

                    {/* Like Heart */}
                    <td className="py-3 text-center w-12">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          likeTrackToggle(song);
                        }}
                        className={`hover:scale-104 active:scale-95 transition ${
                          isSongLiked ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white hidden group-hover:inline-block"
                        }`}
                      >
                        <svg
                          role="img"
                          height="16"
                          width="16"
                          viewBox="0 0 16 16"
                          fill={isSongLiked ? "currentColor" : "none"}
                          stroke="currentColor"
                          strokeWidth={isSongLiked ? 0 : 2}
                        >
                          <path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.083.083 0 0 1-.14-.057V1.13A4.27 4.27 0 0 0 4.808.814a4.313 4.313 0 0 0-3.532 3.407c-.1.574-.08 1.161.059 1.719a7.652 7.652 0 0 0 2.215 3.86l4.28 4.215a.302.302 0 0 0 .44 0l4.28-4.215a7.652 7.652 0 0 0 2.215-3.86c.139-.558.159-1.145.059-1.719z" />
                        </svg>
                      </button>
                    </td>

                    {/* Duration */}
                    <td className="py-3 text-[14px] font-normal text-center w-16">
                      {song.duration}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="text-[14px] text-[#b3b3b3] py-4">No tracks available for this artist.</p>
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          song={contextMenu.song}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
