"use client";

import React, { useState } from "react";
import { useSpotify, Song } from "@/context/SpotifyContext";
import { Play, Pause, Search } from "lucide-react";
import ContextMenu from "../ui/ContextMenu";
import SafeImage from "../ui/SafeImage";

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
    songDatabase,
    podcasts,
    userPreferences,
    aiCommentary
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
  const tamilTracks = trendingSongs ? trendingSongs.filter(s => s.id.startsWith("tam_")) : [];
  const kannadaTracks = trendingSongs ? trendingSongs.filter(s => s.id.startsWith("kan_")) : [];
  const malayalamTracks = trendingSongs ? trendingSongs.filter(s => s.id.startsWith("mal_")) : [];

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

  // Curated mood/vibe maps
  const vibeMapping: Record<string, { title: string; subtitle: string; songTitles: string[] }> = {
    focus: {
      title: "Focus / Study Vibe",
      subtitle: "Mellow melodies and lo-fi acoustics for concentration.",
      songTitles: ["Kabira", "Apna Bana Le", "Adiga Adiga", "Samajavaragamana"]
    },
    energy: {
      title: "Energy & Workout Mix",
      subtitle: "High-tempo hits and pumping beats.",
      songTitles: ["Naatu Naatu", "Blinding Lights", "Shape of You", "Stay"]
    },
    relax: {
      title: "Chill & Relax Melodies",
      subtitle: "Breathe in, breathe out, and unwind.",
      songTitles: ["Flowers", "Tum Hi Ho", "Samajavaragamana", "Srivalli", "Apna Bana Le"]
    },
    party: {
      title: "Party & Dance Floor",
      subtitle: "Rhythmic basslines to start the night.",
      songTitles: ["Naatu Naatu", "Stay", "Blinding Lights", "Shape of You", "Kesariya"]
    }
  };

  const userVibes = userPreferences?.vibe ? userPreferences.vibe.toLowerCase().split(",") : [];
  
  // Construct dynamic title/subtitle for the combined vibe shelf
  let vibeShelfTitle = "";
  let vibeShelfSubtitle = "";
  let combinedVibeSongTitles: string[] = [];

  if (userVibes.length === 1) {
    const singleVibe = userVibes[0];
    const info = vibeMapping[singleVibe];
    if (info) {
      vibeShelfTitle = info.title;
      vibeShelfSubtitle = info.subtitle;
      combinedVibeSongTitles = info.songTitles;
    }
  } else if (userVibes.length > 1) {
    const capitalizedVibes = userVibes
      .map(v => v.charAt(0).toUpperCase() + v.slice(1))
      .join(" & ");
    vibeShelfTitle = `${capitalizedVibes} Mix`;
    vibeShelfSubtitle = "Your customized blend matching multiple moods.";
    
    // Accumulate unique song titles
    combinedVibeSongTitles = Array.from(new Set(
      userVibes.reduce((acc: string[], v: string) => {
        if (vibeMapping[v]) {
          acc.push(...vibeMapping[v].songTitles);
        }
        return acc;
      }, [])
    ));
  }

  const vibeTracks = combinedVibeSongTitles.length > 0 && trendingSongs
    ? trendingSongs.filter(song => combinedVibeSongTitles.some(t => song.title.toLowerCase().includes(t.toLowerCase())))
    : [];

  // Curated artist mix based on onboarding selections
  const selectedArtists = userPreferences?.artists || [];
  const artistTracks = selectedArtists.length > 0 && trendingSongs
    ? trendingSongs.filter(song => selectedArtists.some(artist => song.artist.toLowerCase().includes(artist.toLowerCase())))
    : [];

  const showMusic = activeTab === "all" || activeTab === "music";
  const showPodcasts = activeTab === "all" || activeTab === "podcasts";

  // Dynamic Language Shelves Ordering based on onboarding preferences
  const preferredLangs = userPreferences?.languages?.map(l => l.toLowerCase()) || ["english", "hindi", "telugu"];
  
  // Helper to render specific language shelf
  const renderLanguageShelf = (lang: string) => {
    let tracks: Song[] = [];
    let title = "";
    
    if (lang === "english") {
      tracks = englishTracks;
      title = "English Hits";
    } else if (lang === "hindi") {
      tracks = hindiTracks;
      title = "Hindi Hits";
    } else if (lang === "telugu") {
      tracks = teluguTracks;
      title = "Telugu Hits";
    } else if (lang === "tamil") {
      tracks = tamilTracks;
      title = "Tamil Hits";
    } else if (lang === "kannada") {
      tracks = kannadaTracks;
      title = "Kannada Hits";
    } else if (lang === "malayalam") {
      tracks = malayalamTracks;
      title = "Malayalam Hits";
    }

    if (tracks.length === 0) return null;

    return (
      <div key={`shelf-${lang}`} className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] font-bold tracking-tight text-white hover:underline cursor-pointer">
            {title}
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 w-full">
          {tracks.map((song) => {
            const isSongActive = activeTrack?.id === song.id;
            const isSongPlaying = isSongActive && isPlaying;
            return (
              <div
                key={song.id}
                onClick={() => playTrack(song, trendingSongs)}
                onContextMenu={(e) => handleContextMenu(e, song, false)}
                className="group relative flex flex-col rounded-lg bg-[#181818] p-4 hover:bg-[#282828] cursor-pointer transition-all duration-300 min-w-[180px] w-[calc((100%-80px)/5.5)] shadow-md select-none hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
              >
                <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-lg bg-[#282828]">
                  <SafeImage
                    src={song.coverUrl}
                    alt={song.title}
                    fallbackTitle={song.title}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={(e) => handlePlayCard(e, song, trendingSongs)}
                    className={`absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-2xl transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] active:scale-98 ${
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
                <div className="min-h-[58px]">
                  <h4 className={`text-[15px] font-bold truncate mb-1 tracking-tight ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>
                    {song.title}
                  </h4>
                  <p 
                    onClick={(e) => {
                      e.stopPropagation();
                      setView(`artist_${song.artist}`);
                    }}
                    className="text-[13px] text-[#b3b3b3] hover:underline cursor-pointer line-clamp-2 leading-relaxed mt-0.5"
                  >
                    {song.artist}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Compile shelves in sorted order
  const languageShelves = ["english", "hindi", "telugu", "tamil", "kannada", "malayalam"];
  const sortedLanguageShelves = [
    // 1. Render preferred languages first
    ...languageShelves.filter(lang => preferredLangs.includes(lang)),
    // 2. Render remaining languages at the bottom
    ...languageShelves.filter(lang => !preferredLangs.includes(lang))
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-[#1f1f2e]/60 via-[#121212] to-[#121212] overflow-y-auto px-6 pt-6 pb-24 font-sans select-none scrollbar-thin">
      {/* Filter Chips */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wider uppercase transition duration-150 cursor-pointer ${
            activeTab === "all" ? "bg-white text-black" : "bg-[#1f1f1f] text-white hover:bg-[#2a2a2a]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("music")}
          className={`rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wider uppercase transition duration-150 cursor-pointer ${
            activeTab === "music" ? "bg-white text-black" : "bg-[#1f1f1f] text-white hover:bg-[#2a2a2a]"
          }`}
        >
          Music
        </button>
        <button
          onClick={() => setActiveTab("podcasts")}
          className={`rounded-full px-4 py-1.5 text-[12px] font-bold tracking-wider uppercase transition duration-150 cursor-pointer ${
            activeTab === "podcasts" ? "bg-white text-black" : "bg-[#1f1f1f] text-white hover:bg-[#2a2a2a]"
          }`}
        >
          Podcasts
        </button>
      </div>
 
      {/* AI DJ Commentary Banner */}
      {showMusic && aiCommentary && (
        <div className="mb-8 animate-fade-in p-6 rounded-xl bg-gradient-to-r from-[#122e1e] via-[#121814] to-[#121212] border border-[#1db954]/25 shadow-xl relative overflow-hidden group">
          {/* Pulsing indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#1db954]/10 border border-[#1ed760]/30 rounded-full px-2 py-0.5">
            <span className="h-2 w-2 rounded-full bg-[#1ed760] animate-ping" />
            <span className="h-2 w-2 rounded-full bg-[#1ed760] absolute" />
            <span className="text-[10px] font-bold text-[#1ed760] uppercase tracking-wider">AI DJ Active</span>
          </div>
          <div className="flex flex-col gap-2 max-w-[85%]">
            <p className="text-[11px] font-bold text-[#1ed760] uppercase tracking-widest">Horizon Commentary</p>
            <p className="text-[16px] sm:text-[18px] font-bold text-white tracking-tight leading-relaxed italic">
              &ldquo;{aiCommentary}&rdquo;
            </p>
            <p className="text-[11px] text-[#b3b3b3] mt-1">
              Adjust your Exploration appetite and active routines at any time in the Horizon sidebar.
            </p>
          </div>
        </div>
      )}

      {/* MUSIC SHELVES */}
      {showMusic && (
        <>
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
                      className="group relative flex flex-col rounded-lg bg-[#181818] p-4 hover:bg-[#282828] cursor-pointer transition-all duration-300 min-w-[180px] w-[calc((100%-80px)/5.5)] shadow-md select-none hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                    >
                      <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-lg bg-[#282828]">
                        <SafeImage
                          src={song.coverUrl}
                          alt={song.title}
                          fallbackTitle={song.title}
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={(e) => handlePlayCard(e, song, historySongs)}
                          className={`absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-2xl transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] active:scale-98 ${
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
                      <div className="min-h-[58px]">
                        <h4 className={`text-[15px] font-bold truncate mb-1 tracking-tight ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>
                          {song.title}
                        </h4>
                        <p 
                          onClick={(e) => {
                            e.stopPropagation();
                            setView(`artist_${song.artist}`);
                          }}
                          className="text-[13px] text-[#b3b3b3] hover:underline cursor-pointer line-clamp-2 leading-relaxed mt-0.5"
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

          {/* Personalized Listening Vibe Shelf (Hyper-Personalization Step 2) */}
          {vibeTracks.length > 0 && vibeShelfTitle && (
            <div className="mb-8 animate-fade-in p-5 rounded-lg bg-gradient-to-r from-[#1a2f1a] to-[#121212] border border-[#1a3f1a]/30 shadow-md">
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#1ed760] px-2.5 py-0.5 text-[10px] font-bold text-black uppercase tracking-wider">Your Vibe</span>
                  <h2 className="text-[22px] font-bold tracking-tight text-white">{vibeShelfTitle}</h2>
                </div>
                <p className="text-[12px] text-[#b3b3b3]">{vibeShelfSubtitle}</p>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 w-full">
                {vibeTracks.map((song) => {
                  const isSongActive = activeTrack?.id === song.id;
                  const isSongPlaying = isSongActive && isPlaying;
                  return (
                    <div
                      key={`vibe-${song.id}`}
                      onClick={() => playTrack(song, vibeTracks)}
                      className="group relative flex flex-col rounded-lg bg-[#181818] p-4 hover:bg-[#282828] cursor-pointer transition-all duration-300 min-w-[#180px] w-[calc((100%-80px)/5.5)] shadow-md select-none hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
              >
                <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-lg bg-[#282828]">
                  <SafeImage
                    src={song.coverUrl}
                    alt={song.title}
                    fallbackTitle={song.title}
                    className="h-full w-full object-cover"
                  />
                  <button
                          onClick={(e) => handlePlayCard(e, song, vibeTracks)}
                          className={`absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-2xl transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] active:scale-98 ${
                            isSongActive ? "translate-y-0 opacity-100" : ""
                          }`}
                        >
                          {isSongPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                        </button>
                      </div>
                      <div className="min-h-[58px]">
                        <h4 className={`text-[15px] font-bold truncate mb-1 tracking-tight ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>{song.title}</h4>
                        <p className="text-[13px] text-[#b3b3b3] line-clamp-2 leading-relaxed mt-0.5">{song.artist}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Curated Artist Mix Shelf (Hyper-Personalization Step 3) */}
          {artistTracks.length > 0 && (
            <div className="mb-8 animate-fade-in p-5 rounded-lg bg-gradient-to-r from-blue-950/20 to-[#121212] border border-blue-900/10 shadow-md">
              <div className="flex flex-col gap-1 mb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-500 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">Artist Mix</span>
                  <h2 className="text-[22px] font-bold tracking-tight text-white">Your Seed Artist Mix</h2>
                </div>
                <p className="text-[12px] text-[#b3b3b3]">Custom-compiled tracks featuring your selected favorite artists: {selectedArtists.join(", ")}</p>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 w-full">
                {artistTracks.map((song) => {
                  const isSongActive = activeTrack?.id === song.id;
                  const isSongPlaying = isSongActive && isPlaying;
                  return (
                    <div
                      key={`artist-mix-${song.id}`}
                      onClick={() => playTrack(song, artistTracks)}
                      className="group relative flex flex-col rounded-lg bg-[#181818] p-4 hover:bg-[#282828] cursor-pointer transition-all duration-300 min-w-[180px] w-[calc((100%-80px)/5.5)] shadow-md select-none hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                    >
                      <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-lg bg-[#282828]">
                        <SafeImage
                          src={song.coverUrl}
                          alt={song.title}
                          fallbackTitle={song.title}
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={(e) => handlePlayCard(e, song, artistTracks)}
                          className={`absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-2xl transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] active:scale-98 ${
                            isSongActive ? "translate-y-0 opacity-100" : ""
                          }`}
                        >
                          {isSongPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                        </button>
                      </div>
                      <div className="min-h-[58px]">
                        <h4 className={`text-[15px] font-bold truncate mb-1 tracking-tight ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>{song.title}</h4>
                        <p className="text-[13px] text-[#b3b3b3] line-clamp-2 leading-relaxed mt-0.5">{song.artist}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Language Shelves (Hyper-Personalization Step 1) */}
          {sortedLanguageShelves.map(lang => renderLanguageShelf(lang))}

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
                      className="group relative flex flex-col rounded-lg bg-[#181818] p-4 hover:bg-[#282828] cursor-pointer transition-all duration-300 min-w-[180px] w-[calc((100%-80px)/5.5)] shadow-md select-none hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
                    >
                      <div className="relative aspect-square w-full mb-4 rounded-md overflow-hidden shadow-lg bg-[#282828]">
                        <SafeImage
                          src={song.coverUrl}
                          alt={song.title}
                          fallbackTitle={song.title}
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={(e) => handlePlayCard(e, song, displayRecommendations)}
                          className={`absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-2xl transition duration-200 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-106 hover:bg-[#1fdf64] active:scale-98 ${
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
                      <div className="min-h-[58px]">
                        <h4 className={`text-[15px] font-bold truncate mb-1 tracking-tight ${isSongActive ? "text-[#1ed760]" : "text-white"}`}>
                          {song.title}
                        </h4>
                        <p 
                          onClick={(e) => {
                            e.stopPropagation();
                            setView(`artist_${song.artist}`);
                          }}
                          className="text-[13px] text-[#b3b3b3] hover:underline cursor-pointer line-clamp-2 leading-relaxed mt-0.5"
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
        </>
      )}

      {/* PODCASTS SHELVES */}
      {showPodcasts && (
        <>
          {/* Top Podcast Episodes (Seeded) */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[22px] font-bold tracking-tight text-white hover:underline cursor-pointer">
                Top Podcast Episodes
              </h2>
            </div>
            {podcasts.length === 0 ? (
              <div className="flex h-40 items-center justify-center text-[#b3b3b3] text-[14px]">
                No podcasts loaded. Ensure backend is running.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {podcasts.map((podcast) => {
                  const isPodcastActive = activeTrack?.id === podcast.id;
                  const isPodcastPlaying = isPodcastActive && isPlaying;
                  return (
                    <div
                      key={podcast.id}
                      onClick={() => playTrack(podcast, podcasts)}
                      className={`group flex items-center justify-between p-4 rounded-lg bg-[#181818] hover:bg-[#252525] cursor-pointer transition duration-300 border border-transparent ${
                        isPodcastActive ? "border-[#1ed760]/30 bg-[#1c221c]/40" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="relative h-16 w-16 shrink-0 rounded overflow-hidden bg-[#282828] shadow-md">
                          <SafeImage
                            src={podcast.coverUrl}
                            alt={podcast.title}
                            fallbackTitle={podcast.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150">
                            {isPodcastPlaying ? (
                              <Pause size={18} className="text-white" />
                            ) : (
                              <Play size={18} className="text-white ml-0.5" fill="currentColor" />
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className={`text-[15px] font-bold truncate ${isPodcastActive ? "text-[#1ed760]" : "text-white"}`}>
                            {podcast.title}
                          </p>
                          <p className="text-[12px] text-white/80 font-medium truncate mt-0.5">
                            {podcast.artist}
                          </p>
                          <p className="text-[11px] text-[#b3b3b3] truncate mt-1">
                            {podcast.album} • {podcast.duration}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playTrack(podcast, podcasts);
                        }}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black opacity-0 group-hover:opacity-100 transition hover:scale-106 ${
                          isPodcastActive ? "opacity-100 bg-[#1ed760] text-black" : ""
                        }`}
                      >
                        {isPodcastPlaying ? (
                          <Pause size={16} fill="currentColor" />
                        ) : (
                          <Play size={16} fill="currentColor" className="ml-0.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Featured Podcast Shows */}
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[22px] font-bold tracking-tight text-white hover:underline cursor-pointer">
                Featured Podcast Shows
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4 w-full">
              {[
                { title: "Think Fast, Talk Smart", host: "Stanford GSB", cover: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts221/v4/0e/a3/48/0ea34886-96c0-8299-e16c-d039cfaedc78/mza_5307345217675863813.jpg/600x600bb.jpg", category: "Business & Management" },
                { title: "Lex Fridman Podcast", host: "Lex Fridman", cover: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts115/v4/3e/e3/9c/3ee39c89-de08-47a6-7f3d-3849cef6d255/mza_16657851278549137484.png/600x600bb.jpg", category: "Technology & Science" },
                { title: "How I Built This", host: "Guy Raz", cover: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts126/v4/64/45/06/644506b5-c44f-f661-f74e-f63a4b2511bc/mza_14892199991035639268.jpeg/600x600bb.jpg", category: "Entrepreneurship" },
                { title: "Acquired Podcast", host: "Ben Gilbert & David Rosenthal", cover: "https://is1-ssl.mzstatic.com/image/thumb/Podcasts211/v4/43/c5/fb/43c5fbdf-b302-053a-2704-ba5f74322625/mza_13119989780540450831.jpg/600x600bb.jpg", category: "Business History" }
              ].map((show, i) => (
                <div
                  key={`show-${i}`}
                  className="flex flex-col rounded-md bg-[#181818] p-4 hover:bg-[#252525] cursor-pointer transition duration-300 min-w-[160px] w-[calc((100%-80px)/5.5)]"
                >
                  <SafeImage
                    src={show.cover}
                    alt={show.title}
                    fallbackTitle={show.title}
                    className="aspect-square w-full object-cover rounded-md mb-4 shadow-md"
                  />
                  <h4 className="text-[13px] font-bold text-white truncate">{show.title}</h4>
                  <p className="text-[11px] text-[#b3b3b3] truncate mt-1">{show.host}</p>
                  <span className="mt-3 w-fit rounded bg-[#282828] px-2 py-0.5 text-[9px] font-bold text-white/80 uppercase">
                    {show.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
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
