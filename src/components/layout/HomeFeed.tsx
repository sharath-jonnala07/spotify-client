"use client";

import React, { useState } from "react";
import { useSpotify, Song } from "@/context/SpotifyContext";
import { Play, Pause, Search } from "lucide-react";
import ContextMenu from "../ui/ContextMenu";

export default function HomeFeed() {
  const {
    activeTrack,
    isPlaying,
    playTrack,
    recommendedSongs,
    historySongs,
    trendingSongs,
    setView,
    currentView,
    searchQuery,
    songDatabase
  } = useSpotify();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; song: Song; showRemoveFromHistory?: boolean } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, song: Song, showRemoveFromHistory = false) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      song,
      showRemoveFromHistory
    });
  };

  const handlePlayCard = (e: React.MouseEvent, song: Song, list: Song[]) => {
    e.stopPropagation(); // Prevent card click navigation
    playTrack(song, list);
  };

  // Group tracks by language
  const englishTracks = trendingSongs ? trendingSongs.filter(s => s.id.startsWith("eng_")) : [];
  const hindiTracks = trendingSongs ? trendingSongs.filter(s => s.id.startsWith("hin_")) : [];
  const teluguTracks = trendingSongs ? trendingSongs.filter(s => s.id.startsWith("tel_")) : [];

  const displayRecommendations = recommendedSongs && recommendedSongs.length > 0
    ? recommendedSongs.slice(0, 6)
    : [];

  // If in search view with a query, render Search Results
  if (currentView === "search" && searchQuery.trim() !== "") {
    const topResult = songDatabase[0];
    const songsList = songDatabase.slice(0, 5);
    const otherResults = songDatabase.slice(5);

    return (
      <div className="flex-1 bg-[#121212] overflow-y-auto px-6 pt-6 pb-24 font-sans select-none scrollbar-thin relative">
        <h2 className="text-[24px] font-bold text-white mb-6">Search results for "{searchQuery}"</h2>
        
        {songDatabase.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#b3b3b3]">
            <Search size={48} className="opacity-40 mb-4" />
            <p className="text-[16px] font-semibold text-white">No results found for "{searchQuery}"</p>
            <p className="text-[13px] mt-1">Please make sure words are spelled correctly, or use other keywords.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Top Row: Top Result & Songs List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Top Result */}
              {topResult && (
                <div className="lg:col-span-5 flex flex-col">
                  <h3 className="text-[18px] font-bold text-white mb-3">Top result</h3>
                  <div 
                    onClick={() => playTrack(topResult, songDatabase)}
                    onContextMenu={(e) => handleContextMenu(e, topResult, false)}
                    className="group relative flex-1 rounded-md bg-[#181818] p-6 hover:bg-[#282828] cursor-pointer transition-all duration-300 shadow-md"
                  >
                    <img 
                      src={topResult.coverUrl} 
                      alt={topResult.title}
                      className="h-24 w-24 object-cover rounded shadow-md mb-6"
                    />
                    <h4 className="text-[28px] font-bold text-white tracking-tight truncate mb-1">
                      {topResult.title}
                    </h4>
                    <p className="text-[14px] text-[#b3b3b3] hover:underline cursor-pointer" onClick={(e) => { e.stopPropagation(); setView(`artist_${topResult.artist}`); }}>
                      {topResult.artist} <span className="ml-2 rounded-full bg-[#121212] px-3 py-1 text-[11px] font-bold text-white">Song</span>
                    </p>

                    {/* Floating Play Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); playTrack(topResult, songDatabase); }}
                      className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64]"
                    >
                      {activeTrack?.id === topResult.id && isPlaying ? (
                        <Pause size={22} fill="currentColor" />
                      ) : (
                        <Play size={22} fill="currentColor" className="ml-1" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Right Column: Top 5 Songs */}
              <div className="lg:col-span-7 flex flex-col">
                <h3 className="text-[18px] font-bold text-white mb-3">Songs</h3>
                <div className="flex flex-col gap-1">
                  {songsList.map((song, index) => {
                    const isSongActive = activeTrack?.id === song.id;
                    const isSongPlaying = isSongActive && isPlaying;
                    return (
                      <div
                        key={`search-song-${song.id}`}
                        onClick={() => playTrack(song, songDatabase)}
                        onContextMenu={(e) => handleContextMenu(e, song, false)}
                        className="group flex items-center justify-between p-2 rounded hover:bg-white/10 cursor-pointer transition duration-150"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-10 w-10 shrink-0">
                            <img
                              src={song.coverUrl}
                              alt={song.title}
                              className="h-full w-full object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-100">
                              {isSongPlaying ? (
                                <Pause size={14} className="text-white" />
                              ) : (
                                <Play size={14} className="text-white ml-0.5" fill="currentColor" />
                              )}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[14px] font-bold truncate ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>
                              {song.title}
                            </p>
                            <p className="text-[12px] text-[#b3b3b3] group-hover:text-white truncate mt-0.5">
                              {song.artist}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[13px] text-[#b3b3b3]">
                          <span>{song.duration}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Row: Albums and Singles Grid */}
            {otherResults.length > 0 && (
              <div>
                <h3 className="text-[18px] font-bold text-white mb-4">Featured results</h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 w-full">
                  {otherResults.map((song) => {
                    const isSongActive = activeTrack?.id === song.id;
                    const isSongPlaying = isSongActive && isPlaying;
                    return (
                      <div
                        key={`search-featured-${song.id}`}
                        onClick={() => playTrack(song, songDatabase)}
                        onContextMenu={(e) => handleContextMenu(e, song, false)}
                        className="group relative flex flex-col rounded-md bg-transparent p-3 hover:bg-[#1f1f1f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-300 min-w-[160px] w-[calc((100%-80px)/5.5)]"
                      >
                        <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-md">
                          <img
                            src={song.coverUrl}
                            alt={song.title}
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={(e) => { e.stopPropagation(); playTrack(song, songDatabase); }}
                            className={`absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] ${
                              isSongActive ? "translate-y-0 opacity-100 bg-[#1ed760]" : ""
                            }`}
                          >
                            {isSongPlaying ? (
                              <Pause size={18} fill="currentColor" />
                            ) : (
                              <Play size={18} fill="currentColor" className="ml-0.5" />
                            )}
                          </button>
                        </div>
                        <div className="min-h-[50px]">
                          <h4 className={`text-[13px] font-bold truncate mb-0.5 ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>
                            {song.title}
                          </h4>
                          <p className="text-[11px] text-[#b3b3b3] truncate">{song.artist}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            song={contextMenu.song}
            showRemoveFromHistory={contextMenu.showRemoveFromHistory}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#121212] overflow-y-auto px-6 pt-6 pb-24 font-sans select-none scrollbar-thin">
      {/* Filter Chips */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`rounded-full px-3 py-1.5 text-[14px] font-bold transition duration-150 cursor-pointer ${
            activeTab === "all" ? "bg-white text-black" : "bg-[#1f1f1f] text-white hover:bg-[#2a2a2a]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => {
            setActiveTab("music");
            alert("Music category activated.");
          }}
          className={`rounded-full px-3 py-1.5 text-[14px] font-bold transition duration-150 cursor-pointer ${
            activeTab === "music" ? "bg-white text-black" : "bg-[#1f1f1f] text-white hover:bg-[#2a2a2a]"
          }`}
        >
          Music
        </button>
        <button
          onClick={() => {
            setActiveTab("podcasts");
            alert("Podcasts category activated.");
          }}
          className={`rounded-full px-3 py-1.5 text-[14px] font-bold transition duration-150 cursor-pointer ${
            activeTab === "podcasts" ? "bg-white text-black" : "bg-[#1f1f1f] text-white hover:bg-[#2a2a2a]"
          }`}
        >
          Podcasts
        </button>
      </div>

      {/* Recently Played Section (Dynamic) */}
      {historySongs && historySongs.length > 0 && (
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold tracking-tight text-white hover:underline cursor-pointer">
              Recently played
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 w-full">
            {historySongs.slice(0, 12).map((song) => {
              const isSongActive = activeTrack?.id === song.id;
              const isSongPlaying = isSongActive && isPlaying;
              return (
                <div
                  key={`history-${song.id}`}
                  onClick={() => playTrack(song, historySongs)}
                  onContextMenu={(e) => handleContextMenu(e, song, true)}
                  className="group relative flex flex-col rounded-md bg-transparent p-3 hover:bg-[#1f1f1f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-300 min-w-[160px] w-[calc((100%-80px)/5.5)]"
                >
                  <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-md">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => handlePlayCard(e, song, historySongs)}
                      className={`absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] ${
                        isSongActive ? "translate-y-0 opacity-100 bg-[#1ed760]" : ""
                      }`}
                    >
                      {isSongPlaying ? (
                        <Pause size={18} fill="currentColor" />
                      ) : (
                        <Play size={18} fill="currentColor" className="ml-0.5" />
                      )}
                    </button>
                  </div>
                  <div className="min-h-[50px]">
                    <h4 className={`text-[13px] font-bold truncate mb-0.5 ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>
                      {song.title}
                    </h4>
                    <p 
                      onClick={(e) => {
                        e.stopPropagation();
                        setView(`artist_${song.artist}`);
                      }}
                      className="text-[11px] text-[#b3b3b3] hover:underline cursor-pointer truncate"
                    >
                      {song.artist}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* English Hits Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] font-bold tracking-tight text-white hover:underline cursor-pointer">
            English Hits
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 w-full">
          {englishTracks.length > 0 ? (
            englishTracks.map((song) => {
              const isSongActive = activeTrack?.id === song.id;
              const isSongPlaying = isSongActive && isPlaying;
              return (
                <div
                  key={song.id}
                  onClick={() => playTrack(song, trendingSongs)}
                  onContextMenu={(e) => handleContextMenu(e, song, false)}
                  className="group relative flex flex-col rounded-md bg-transparent p-3 hover:bg-[#1f1f1f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-300 min-w-[160px] w-[calc((100%-80px)/5.5)]"
                >
                  <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-md">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => handlePlayCard(e, song, trendingSongs)}
                      className={`absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] active:scale-98 ${
                        isSongActive ? "translate-y-0 opacity-100 bg-[#1ed760]" : ""
                      }`}
                    >
                      {isSongPlaying ? (
                        <Pause size={22} fill="currentColor" />
                      ) : (
                        <Play size={22} fill="currentColor" className="ml-1" />
                      )}
                    </button>
                  </div>
                  <div className="min-h-[62px]">
                    <h4 className={`text-[14px] font-bold truncate mb-1 ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>
                      {song.title}
                    </h4>
                    <p 
                      onClick={(e) => {
                        e.stopPropagation();
                        setView(`artist_${song.artist}`);
                      }}
                      className="text-[12px] text-[#b3b3b3] hover:underline cursor-pointer line-clamp-2 leading-relaxed"
                    >
                      {song.artist}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            [...Array(5)].map((_, i) => (
              <div key={i} className="min-w-[160px] w-[calc((100%-80px)/5.5)] aspect-square bg-[#181818] rounded-md animate-pulse" />
            ))
          )}
        </div>
      </div>

      {/* Hindi Hits Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] font-bold tracking-tight text-white hover:underline cursor-pointer">
            Hindi Hits
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 w-full">
          {hindiTracks.length > 0 ? (
            hindiTracks.map((song) => {
              const isSongActive = activeTrack?.id === song.id;
              const isSongPlaying = isSongActive && isPlaying;
              return (
                <div
                  key={song.id}
                  onClick={() => playTrack(song, trendingSongs)}
                  onContextMenu={(e) => handleContextMenu(e, song, false)}
                  className="group relative flex flex-col rounded-md bg-transparent p-3 hover:bg-[#1f1f1f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-300 min-w-[160px] w-[calc((100%-80px)/5.5)]"
                >
                  <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-md">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => handlePlayCard(e, song, trendingSongs)}
                      className={`absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] active:scale-98 ${
                        isSongActive ? "translate-y-0 opacity-100 bg-[#1ed760]" : ""
                      }`}
                    >
                      {isSongPlaying ? (
                        <Pause size={22} fill="currentColor" />
                      ) : (
                        <Play size={22} fill="currentColor" className="ml-1" />
                      )}
                    </button>
                  </div>
                  <div className="min-h-[62px]">
                    <h4 className={`text-[14px] font-bold truncate mb-1 ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>
                      {song.title}
                    </h4>
                    <p 
                      onClick={(e) => {
                        e.stopPropagation();
                        setView(`artist_${song.artist}`);
                      }}
                      className="text-[12px] text-[#b3b3b3] hover:underline cursor-pointer line-clamp-2 leading-relaxed"
                    >
                      {song.artist}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            [...Array(5)].map((_, i) => (
              <div key={i} className="min-w-[160px] w-[calc((100%-80px)/5.5)] aspect-square bg-[#181818] rounded-md animate-pulse" />
            ))
          )}
        </div>
      </div>

      {/* Telugu Hits Section */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] font-bold tracking-tight text-white hover:underline cursor-pointer">
            Telugu Hits
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 w-full">
          {teluguTracks.length > 0 ? (
            teluguTracks.map((song) => {
              const isSongActive = activeTrack?.id === song.id;
              const isSongPlaying = isSongActive && isPlaying;
              return (
                <div
                  key={song.id}
                  onClick={() => playTrack(song, trendingSongs)}
                  onContextMenu={(e) => handleContextMenu(e, song, false)}
                  className="group relative flex flex-col rounded-md bg-transparent p-3 hover:bg-[#1f1f1f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-300 min-w-[160px] w-[calc((100%-80px)/5.5)]"
                >
                  <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-md">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => handlePlayCard(e, song, trendingSongs)}
                      className={`absolute bottom-2 right-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] active:scale-98 ${
                        isSongActive ? "translate-y-0 opacity-100 bg-[#1ed760]" : ""
                      }`}
                    >
                      {isSongPlaying ? (
                        <Pause size={22} fill="currentColor" />
                      ) : (
                        <Play size={22} fill="currentColor" className="ml-1" />
                      )}
                    </button>
                  </div>
                  <div className="min-h-[62px]">
                    <h4 className={`text-[14px] font-bold truncate mb-1 ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>
                      {song.title}
                    </h4>
                    <p 
                      onClick={(e) => {
                        e.stopPropagation();
                        setView(`artist_${song.artist}`);
                      }}
                      className="text-[12px] text-[#b3b3b3] hover:underline cursor-pointer line-clamp-2 leading-relaxed"
                    >
                      {song.artist}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            [...Array(5)].map((_, i) => (
              <div key={i} className="min-w-[160px] w-[calc((100%-80px)/5.5)] aspect-square bg-[#181818] rounded-md animate-pulse" />
            ))
          )}
        </div>
      </div>

      {/* Recommended for You Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] font-bold tracking-tight text-white hover:underline cursor-pointer">
            Recommended for you
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 w-full">
          {displayRecommendations.length > 0 ? (
            displayRecommendations.map((song) => {
              const isSongActive = activeTrack?.id === song.id;
              const isSongPlaying = isSongActive && isPlaying;
              return (
                <div
                  key={`rec-${song.id}`}
                  onClick={() => playTrack(song, displayRecommendations)}
                  onContextMenu={(e) => handleContextMenu(e, song, false)}
                  className="group relative flex flex-col rounded-md bg-transparent p-3 hover:bg-[#1f1f1f] hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-300 min-w-[160px] w-[calc((100%-80px)/5.5)]"
                >
                  <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-md">
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={(e) => handlePlayCard(e, song, displayRecommendations)}
                      className={`absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-lg transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] ${
                        isSongActive ? "translate-y-0 opacity-100 bg-[#1ed760]" : ""
                      }`}
                    >
                      {isSongPlaying ? (
                        <Pause size={18} fill="currentColor" />
                      ) : (
                        <Play size={18} fill="currentColor" className="ml-0.5" />
                      )}
                    </button>
                  </div>
                  <div className="min-h-[50px]">
                    <h4 className={`text-[13px] font-bold truncate mb-0.5 ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>
                      {song.title}
                    </h4>
                    <p 
                      onClick={(e) => {
                        e.stopPropagation();
                        setView(`artist_${song.artist}`);
                      }}
                      className="text-[11px] text-[#b3b3b3] hover:underline cursor-pointer truncate"
                    >
                      {song.artist}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            [...Array(6)].map((_, i) => (
              <div key={i} className="min-w-[160px] w-[calc((100%-80px)/5.5)] aspect-square bg-[#181818] rounded-md animate-pulse" />
            ))
          )}
        </div>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          song={contextMenu.song}
          showRemoveFromHistory={contextMenu.showRemoveFromHistory}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
