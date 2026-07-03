"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSpotify, Song, Playlist } from "@/context/SpotifyContext";
import { Play, Plus, Heart, ListMusic, Trash2, ChevronRight, Music } from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  song: Song;
  onClose: () => void;
  showRemoveFromHistory?: boolean;
}

export default function ContextMenu({ x, y, song, onClose, showRemoveFromHistory = false }: ContextMenuProps) {
  const {
    playlists,
    likeTrackToggle,
    likedSongs,
    addToQueue,
    playTrack,
    createPlaylist,
    addSongToPlaylist,
    removeFromHistory
  } = useSpotify() as any;

  const [showSubmenu, setShowSubmenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  const isLiked = likedSongs.some((s: Song) => s.id === song.id);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Adjust menu position if it goes off-screen
  const [adjustedCoords, setAdjustedCoords] = useState({ left: x, top: y });

  useEffect(() => {
    if (menuRef.current) {
      const menuWidth = 220;
      const menuHeight = showRemoveFromHistory ? 200 : 160;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let left = x;
      let top = y;

      if (x + menuWidth > screenWidth) {
        left = screenWidth - menuWidth - 10;
      }
      if (y + menuHeight > screenHeight) {
        top = screenHeight - menuHeight - 10;
      }

      setAdjustedCoords({ left, top });
    }
  }, [x, y, showRemoveFromHistory]);

  const handlePlay = () => {
    playTrack(song);
    onClose();
  };

  const handleAddToQueue = () => {
    addToQueue(song);
    onClose();
  };

  const handleToggleLike = () => {
    likeTrackToggle(song);
    onClose();
  };

  const handleRemoveFromHistory = () => {
    if (removeFromHistory) {
      removeFromHistory(song.id);
    }
    onClose();
  };

  const handleCreateAndAdd = async () => {
    // Call createPlaylist
    const nextNumber = playlists.length + 1;
    const name = `My Playlist #${nextNumber}`;
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${API_BASE}/playlists/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: "" })
      });
      if (res.ok) {
        const data = await res.json();
        // Add song to it
        await addSongToPlaylist(data.id, song);
        // Sync context
        window.location.reload(); // Quick sync
      }
    } catch (e) {
      console.error(e);
    }
    onClose();
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addSongToPlaylist(playlistId, song);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: adjustedCoords.left,
        top: adjustedCoords.top,
        zIndex: 99999
      }}
      className="w-[220px] rounded bg-[#282828] p-1 shadow-[0_16px_24px_rgba(0,0,0,0.5)] border border-[#3e3e3e]/20 font-sans text-[13px] text-white"
    >
      <div className="flex flex-col gap-0.5">
        {/* Play Option */}
        <button
          onClick={handlePlay}
          className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-sm hover:bg-[#3e3e3e] hover:text-white transition cursor-pointer"
        >
          <Play size={15} className="text-[#b3b3b3]" />
          <span>Play song</span>
        </button>

        {/* Add to Queue */}
        <button
          onClick={handleAddToQueue}
          className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-sm hover:bg-[#3e3e3e] hover:text-white transition cursor-pointer"
        >
          <ListMusic size={15} className="text-[#b3b3b3]" />
          <span>Add to queue</span>
        </button>

        {/* Like/Unlike */}
        <button
          onClick={handleToggleLike}
          className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-sm hover:bg-[#3e3e3e] hover:text-white transition cursor-pointer"
        >
          <Heart size={15} fill={isLiked ? "#1ed760" : "none"} className={isLiked ? "text-[#1ed760]" : "text-[#b3b3b3]"} />
          <span>{isLiked ? "Remove from Liked Songs" : "Save to Liked Songs"}</span>
        </button>

        {/* Add to Playlist Submenu Trigger */}
        <div
          className="relative group"
          onMouseEnter={() => setShowSubmenu(true)}
          onMouseLeave={() => setShowSubmenu(false)}
        >
          <button
            className="w-full flex items-center justify-between px-3 py-2 text-left rounded-sm hover:bg-[#3e3e3e] hover:text-white transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Plus size={15} className="text-[#b3b3b3]" />
              <span>Add to playlist</span>
            </div>
            <ChevronRight size={14} className="text-[#b3b3b3]" />
          </button>

          {/* Submenu */}
          {showSubmenu && (
            <div
              ref={submenuRef}
              className="absolute left-[216px] top-0 w-[200px] rounded bg-[#282828] p-1 shadow-[0_16px_24px_rgba(0,0,0,0.5)] border border-[#3e3e3e]/20 max-h-[250px] overflow-y-auto"
            >
              <button
                onClick={handleCreateAndAdd}
                className="w-full flex items-center gap-2 px-3 py-2 text-left rounded-sm hover:bg-[#3e3e3e] hover:text-white transition cursor-pointer font-bold border-b border-[#3e3e3e]/30 mb-1"
              >
                <Plus size={14} />
                <span>Create new playlist</span>
              </button>

              {playlists.length === 0 ? (
                <div className="px-3 py-2 text-[#b3b3b3] text-[11px] italic">No playlists available</div>
              ) : (
                playlists.map((pl: Playlist) => (
                  <button
                    key={pl.id}
                    onClick={() => handleAddToPlaylist(pl.id)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-left rounded-sm hover:bg-[#3e3e3e] hover:text-white transition cursor-pointer truncate"
                  >
                    <Music size={12} className="text-[#b3b3b3] shrink-0" />
                    <span className="truncate">{pl.name}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Remove from Recently Played (Conditional) */}
        {showRemoveFromHistory && (
          <>
            <div className="h-[1px] bg-[#3e3e3e]/40 my-1" />
            <button
              onClick={handleRemoveFromHistory}
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#f3727f] rounded-sm hover:bg-[#3e3e3e] transition cursor-pointer"
            >
              <Trash2 size={15} />
              <span>Remove from Recently Played</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
