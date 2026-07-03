"use client";

import React from "react";
import { useSpotify, Song } from "@/context/SpotifyContext";
import { Play, Pause, Trash2, X, Music } from "lucide-react";

export default function QueuePanel() {
  const {
    queue,
    currentQueueIndex,
    activeTrack,
    isPlaying,
    playTrack,
    removeFromQueue,
    clearQueue,
    toggleQueue
  } = useSpotify();

  // Now playing: activeTrack or queue[currentQueueIndex]
  const nowPlaying = activeTrack;

  // Next up: all tracks in queue AFTER the current index
  const nextUp = queue.slice(currentQueueIndex + 1);

  const handlePlayQueueItem = (song: Song) => {
    playTrack(song);
  };

  return (
    <aside className="w-[300px] lg:w-[350px] h-full flex flex-col bg-[#121212] border-l border-[#282828] text-white font-sans select-none shrink-0 overflow-hidden transition-all duration-300 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="font-bold text-[16px]">Play Queue</h3>
        <button
          onClick={toggleQueue}
          className="p-1 text-[#b3b3b3] hover:text-white hover:bg-[#1f1f1f] rounded-full transition"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-6 custom-scrollbar">
        {/* Now Playing Section */}
        <div className="mb-6">
          <h4 className="text-[13px] font-bold text-[#b3b3b3] uppercase tracking-wider mb-3">
            Now playing
          </h4>
          {nowPlaying ? (
            <div className="flex items-center gap-3 rounded-md bg-[#1f1f1f] p-3 shadow-md border border-white/5 group relative">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-[#282828]">
                <img
                  src={nowPlaying.coverUrl}
                  alt={nowPlaying.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-[14px] font-bold text-[#1ed760] truncate">
                  {nowPlaying.title}
                </h5>
                <p className="text-[12px] text-[#b3b3b3] truncate mt-0.5">
                  {nowPlaying.artist}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-[#b3b3b3] p-3 bg-[#181818] rounded-md border border-dashed border-white/10">
              <Music size={20} className="opacity-50" />
              <span className="text-[13px]">No track playing</span>
            </div>
          )}
        </div>

        {/* Next Up Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[13px] font-bold text-[#b3b3b3] uppercase tracking-wider">
              Next up
            </h4>
            {nextUp.length > 0 && (
              <button
                onClick={clearQueue}
                className="text-[11px] font-bold text-[#b3b3b3] hover:text-white uppercase tracking-wider hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {nextUp.length > 0 ? (
            <div className="flex flex-col gap-1">
              {nextUp.map((song, idx) => {
                const queueIdx = currentQueueIndex + 1 + idx;
                return (
                  <div
                    key={`queue-${song.id}-${queueIdx}`}
                    className="group flex items-center justify-between p-2 rounded-md hover:bg-white/5 transition cursor-pointer"
                    onClick={() => handlePlayQueueItem(song)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Image / Hover Play Button */}
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-[#282828] shadow-sm">
                        <img
                          src={song.coverUrl}
                          alt={song.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover:flex">
                          <Play size={14} className="text-white" fill="currentColor" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-white truncate">
                          {song.title}
                        </p>
                        <p className="text-[11px] text-[#b3b3b3] group-hover:text-white truncate mt-0.5">
                          {song.artist}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(song.id);
                      }}
                      className="p-1.5 text-[#b3b3b3] hover:text-white hidden group-hover:block transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-[#b3b3b3] border border-dashed border-white/5 rounded-md">
              <p className="text-[13px]">Queue is empty.</p>
              <p className="text-[11px] mt-1 text-[#7c7c7c]">
                Add songs from your Home or Playlist views.
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
