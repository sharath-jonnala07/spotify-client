"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSpotify, Song } from "@/context/SpotifyContext";
import SafeImage from "./SafeImage";
import { 
  Music, Check, ArrowRight, ArrowLeft, X, Sparkles, Flame, Moon, 
  BookOpen, Search, Heart, CloudRain, Shield, Play, Pause, Edit2, Sliders
} from "lucide-react";

// Types for options
interface LanguageOption {
  id: string;
  name: string;
  desc: string;
  cover: string;
}

interface VibeOption {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  desc: string;
}

interface ArtistOption {
  name: string;
  initials: string;
  color: string;
}

export default function OnboardingModal() {
  const { 
    isOnboardingComplete, 
    savePreferences, 
    songDatabase, 
    likedSongs, 
    likeTrackToggle 
  } = useSpotify();
  
  const [step, setStep] = useState<number>(1);
  
  // Step 1: Languages
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  
  // Step 2: Vibe & Custom Vibe
  const [selectedVibes, setSelectedVibes] = useState<string[]>(["relax"]);
  const [customVibe, setCustomVibe] = useState<string>("");
  const [showCustomVibeInput, setShowCustomVibeInput] = useState<boolean>(false);
  
  // Step 3: Audio Focus
  const [audioFocus, setAutoFocus] = useState<string[]>(["vibe"]);
  
  // Step 4: Favorite Artists
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  
  // Step 5: Suggested Songs Selection
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [playingPreviewId, setPlayingPreviewId] = useState<string | null>(null);
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  
  // Step 6: Custom text notes
  const [customNotes, setCustomNotes] = useState<string>("");

  // Clean up audio previews on step change or unmount
  useEffect(() => {
    return () => {
      if (previewAudio) {
        previewAudio.pause();
      }
    };
  }, [previewAudio, step]);



  // Language options
  const langOptions: LanguageOption[] = [
    { id: "english", name: "English", desc: "Global Pop, Rock, Hip-Hop", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60" },
    { id: "hindi", name: "Hindi (हिंदी)", desc: "Bollywood, Indie, Romantic", cover: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop&q=60" },
    { id: "telugu", name: "Telugu (తెలుగు)", desc: "Tollywood Hits, Melodies", cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=60" },
    { id: "tamil", name: "Tamil (தமிழ்)", desc: "Kollywood, Melodic Beats", cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60" },
    { id: "kannada", name: "Kannada (ಕನ್ನಡ)", desc: "Sandalwood Retro & Modern Hits", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60" },
    { id: "malayalam", name: "Malayalam (മലയാളം)", desc: "Mollywood Classics & Soul Beats", cover: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=60" }
  ];

  // Vibe options (Expanded to 8 moods)
  const vibeOptions: VibeOption[] = [
    { id: "focus", name: "Focus / Study", icon: BookOpen, desc: "Lo-Fi, acoustic melodies, and ambient soundscapes to help concentrate." },
    { id: "energy", name: "Energy / Workout", icon: Flame, desc: "High-tempo beats, synthwave, and power-pop to get your heart rate up." },
    { id: "relax", name: "Relax / Chill", icon: Moon, desc: "Down-tempo melodies, chillwave, and coffee-shop acoustics to wind down." },
    { id: "party", name: "Party / Dance", icon: Sparkles, desc: "Upbeat basslines, electronic dance floor anthems, and club bangers." },
    { id: "acoustic", name: "Acoustic / Indie", icon: Music, desc: "Raw instruments, unplugged sessions, and local singer-songwriter vibes." },
    { id: "melancholy", name: "Melancholy / Sad", icon: CloudRain, desc: "Deeply emotional lyrics, minor keys, and poignant musical paths." },
    { id: "romance", name: "Romance / Love", icon: Heart, desc: "Warm duet harmonies, acoustic guitars, and heartfelt lyrics." },
    { id: "sleep", name: "Deep Sleep / Zen", icon: Shield, desc: "White noise, nature soundscapes, and calming drone music." }
  ];

  // Artist options
  const artistOptions: ArtistOption[] = [
    { name: "Ed Sheeran", initials: "ES", color: "from-blue-600 to-indigo-800" },
    { name: "The Weeknd", initials: "TW", color: "from-red-600 to-black" },
    { name: "Harry Styles", initials: "HS", color: "from-pink-500 to-purple-700" },
    { name: "Miley Cyrus", initials: "MC", color: "from-yellow-500 to-orange-600" },
    { name: "Arijit Singh", initials: "AS", color: "from-emerald-600 to-teal-800" },
    { name: "Jubin Nautiyal", initials: "JN", color: "from-cyan-600 to-blue-700" },
    { name: "Sid Sriram", initials: "SS", color: "from-purple-600 to-pink-700" },
    { name: "Armaan Malik", initials: "AM", color: "from-violet-600 to-indigo-900" }
  ];

  // Audio focus options
  const focusOptions = [
    { id: "vibe", title: "Vibe & Beats", desc: "I prioritize rhythmic bass, drums, synth drops, and overall atmosphere.", highlight: "from-cyan-500 to-blue-600" },
    { id: "story", title: "Story & Lyrics", desc: "I focus deeply on narrative, poetry, lyricism, and vocal clarity.", highlight: "from-emerald-500 to-teal-600" },
    { id: "ambient", title: "Ambient & Instrumental", desc: "I prefer acoustic, classical piano, and wordless/minimalist soundscapes.", highlight: "from-purple-500 to-indigo-600" },
    { id: "vocals", title: "Pure Vocals & duets", desc: "I love powerful solos, high-pitch scales, and close vocal harmonies.", highlight: "from-rose-500 to-pink-600" }
  ];

  // Filter languages based on search query
  const filteredLangs = useMemo(() => {
    return langOptions.filter(lang => 
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Compute dynamic suggested songs in Step 5 based on chosen languages & artists
  const suggestedSongs = useMemo(() => {
    if (!songDatabase) return [];
    
    // Filter database songs matching either chosen languages or chosen artists
    return songDatabase.filter(song => {
      const matchesArtist = selectedArtists.some(artist => song.artist.includes(artist));
      
      const songLangPrefix = song.id.split("_")[0];
      const matchesLang = selectedLangs.some(langId => {
        if (langId === "english" && songLangPrefix === "eng") return true;
        if (langId === "hindi" && songLangPrefix === "hin") return true;
        if (langId === "telugu" && songLangPrefix === "tel") return true;
        if (langId === "tamil" && songLangPrefix === "tam") return true;
        if (langId === "kannada" && songLangPrefix === "kan") return true;
        if (langId === "malayalam" && songLangPrefix === "mal") return true;
        return false;
      });

      return matchesArtist || matchesLang;
    }).slice(0, 5); // Limit to top 5 recommendations to keep cognitive load low
  }, [selectedLangs, selectedArtists, songDatabase]);

  const handleLangToggle = (langId: string) => {
    setSelectedLangs(prev => 
      prev.includes(langId) ? prev.filter(l => l !== langId) : [...prev, langId]
    );
  };

  const handleArtistToggle = (artistName: string) => {
    setSelectedArtists(prev => 
      prev.includes(artistName) ? prev.filter(a => a !== artistName) : [...prev, artistName]
    );
  };

  const handleSongToggle = (songId: string) => {
    setSelectedSongs(prev => 
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  };

  const togglePreview = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingPreviewId === song.id) {
      if (previewAudio) {
        previewAudio.pause();
      }
      setPlayingPreviewId(null);
    } else {
      if (previewAudio) {
        previewAudio.pause();
      }
      const audio = new Audio(song.audioUrl);
      audio.volume = 0.4;
      audio.play().catch(() => {});
      setPreviewAudio(audio);
      setPlayingPreviewId(song.id);
      audio.onended = () => setPlayingPreviewId(null);
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(prev => prev + 1);
    } else {
      // 1. Process batch likes for selected seed songs
      selectedSongs.forEach(songId => {
        const songObj = songDatabase?.find(s => s.id === songId);
        const alreadyLiked = likedSongs?.some(ls => ls.id === songId);
        if (songObj && !alreadyLiked) {
          likeTrackToggle(songObj);
        }
      });

      // 2. Complete onboarding
      const finalLangs = selectedLangs.length > 0 ? selectedLangs : ["english"];
      const finalVibe = showCustomVibeInput ? "custom" : selectedVibes.join(",");
      savePreferences(
        finalLangs, 
        finalVibe, 
        selectedArtists, 
        customVibe || "", 
        audioFocus.join(","), 
        customNotes
      );
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    savePreferences(["english", "hindi", "telugu"], "relax", [], "", "vibe", "");
  };

  if (isOnboardingComplete) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-lg px-4 font-sans select-none animate-fade-in">
      <div className="relative w-full max-w-[720px] rounded-2xl bg-[#121212] border border-[#282828] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden">
        
        {/* Subtle Background Glows */}
        <div className="absolute -top-40 -right-40 h-[320px] w-[320px] rounded-full bg-[#1ed760]/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

        {/* Skip button */}
        <button 
          onClick={handleSkip}
          className="absolute top-6 right-6 flex items-center gap-1.5 text-[12px] font-bold text-[#b3b3b3] hover:text-white transition duration-200 cursor-pointer"
        >
          Skip <X size={14} />
        </button>

        {/* Header Indicator */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 text-[#1ed760] font-semibold">
            <Sliders size={18} className="animate-pulse" />
            <span className="text-[11px] font-bold tracking-[2px] uppercase">Hyper-Personalized Activation</span>
          </div>
          
          <h2 className="text-[28px] font-bold text-white tracking-tight leading-tight transition duration-200">
            {step === 1 && "What languages do you listen to?"}
            {step === 2 && "What is your listening vibe?"}
            {step === 3 && "What is your primary audio focus?"}
            {step === 4 && "Who are your favorite artists?"}
            {step === 5 && "Pick a few seed songs to get started"}
            {step === 6 && "Any custom personalization notes?"}
          </h2>
          
          <p className="text-[14px] text-[#b3b3b3] mt-2 leading-relaxed">
            {step === 1 && "We will arrange your language-specific shelves and prioritize hits from these cultures."}
            {step === 2 && "Configure your listening vibe. You can also write a custom vibe if ours don't match."}
            {step === 3 && "Choose the musical layer that connects with you the most to profile recommendation speeds."}
            {step === 4 && "Select your favorite artists. This directly seeds your personalized recommendation feed."}
            {step === 5 && "Based on your selections, we recommend starting with these tracks. Check the ones you like!"}
            {step === 6 && "Write any instructions (e.g. 'I hate metal', 'Only play acoustic covers'). We'll factor it into our algorithm."}
          </p>
        </div>

        {/* Progress Bar (6 steps) */}
        <div className="w-full bg-[#202020] h-[5px] rounded-full mb-8 relative">
          <div 
            className="bg-gradient-to-r from-[#1ed760] to-emerald-400 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_#1ed760]"
            style={{ width: `${(step / 6) * 100}%` }}
          />
          <span className="absolute right-0 -top-6 text-[11px] font-bold text-[#b3b3b3]">
            Step {step} of 6
          </span>
        </div>

        {/* Step Contents Area */}
        <div className="min-h-[290px] max-h-[360px] overflow-y-auto pr-2 mb-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          
          {/* STEP 1: LANGUAGES WITH SEARCH BAR */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#b3b3b3]" />
                <input
                  type="text"
                  placeholder="Search languages (e.g., Telugu, English, Hindi, Tamil...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#242424] border border-transparent focus:border-[#1ed760]/50 outline-none text-[14px] text-white transition focus:bg-[#282828] placeholder-white/40"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {filteredLangs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-[#b3b3b3]">
                  <p className="text-[14px] font-medium">No languages found matching &quot;{searchQuery}&quot;</p>
                  <p className="text-[12px] mt-1 opacity-70">Try searching English, Hindi, Telugu, Tamil, Malayalam, or Kannada.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredLangs.map(lang => {
                    const isSelected = selectedLangs.includes(lang.id);
                    return (
                      <div
                        key={lang.id}
                        onClick={() => handleLangToggle(lang.id)}
                        className={`group relative flex items-center justify-between rounded-lg bg-[#181818] p-3.5 border cursor-pointer hover:bg-[#222222] transition duration-200 ${
                          isSelected ? "border-[#1ed760] shadow-[0_0_12px_rgba(30,215,96,0.12)] bg-[#1a221a]" : "border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={lang.cover} 
                            alt={lang.name} 
                            className="h-10 w-10 object-cover rounded shadow-md shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-[14px] text-white truncate">{lang.name}</h4>
                            <p className="text-[11px] text-[#b3b3b3] truncate mt-0.5">{lang.desc}</p>
                          </div>
                        </div>
                        <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition duration-200 ${
                          isSelected ? "bg-[#1ed760] border-[#1ed760] text-black" : "border-[#7c7c7c] text-transparent"
                        }`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: EXPANDED LISTENING VIBE */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[12px] text-[#b3b3b3] font-medium">Select up to 3 vibes (at least 1)</span>
                <span className="text-[11px] text-[#fa6635] font-bold">{selectedVibes.length}/3 selected</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {vibeOptions.map(vibe => {
                  const Icon = vibe.icon;
                  const isSelected = selectedVibes.includes(vibe.id) && !showCustomVibeInput;
                  return (
                    <div
                      key={vibe.id}
                      onClick={() => {
                        setSelectedVibes(prev => {
                          if (prev.includes(vibe.id)) {
                            if (prev.length <= 1) return prev; // Keep at least 1
                            return prev.filter(x => x !== vibe.id);
                          }
                          if (prev.length >= 3) {
                            // FIFO - remove oldest, append new
                            return [prev[1], prev[2], vibe.id];
                          }
                          return [...prev, vibe.id];
                        });
                        setShowCustomVibeInput(false);
                      }}
                      className={`group flex flex-col justify-between rounded-xl bg-[#181818] p-4 border cursor-pointer hover:bg-[#222222] transition duration-200 min-h-[110px] ${
                        isSelected ? "border-[#1ed760] shadow-[0_0_12px_rgba(30,215,96,0.12)] bg-[#1a221a]" : "border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg bg-[#282828] group-hover:bg-[#323232] transition duration-150 text-white ${
                          isSelected ? "text-[#1ed760] bg-[#1a2f1a]" : ""
                        }`}>
                          <Icon size={18} />
                        </div>
                        <div className={`flex h-4.5 w-4.5 items-center justify-center rounded-full border transition duration-150 ${
                          isSelected ? "bg-[#1ed760] border-[#1ed760] text-black" : "border-[#7c7c7c] text-transparent"
                        }`}>
                          <Check size={10} strokeWidth={3} />
                        </div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-bold text-[13px] text-white">{vibe.name}</h4>
                        <p className="text-[10px] text-[#b3b3b3] leading-tight truncate mt-0.5">{vibe.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Vibe Toggle */}
              <div className="mt-2 border-t border-[#242424] pt-4">
                <button
                  onClick={() => { setShowCustomVibeInput(prev => !prev); if (!showCustomVibeInput) setSelectedVibes(["relax"]); }}
                  className={`flex items-center gap-2 text-[13px] font-bold transition duration-150 ${
                    showCustomVibeInput ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"
                  }`}
                >
                  <Edit2 size={15} /> 
                  {showCustomVibeInput ? "Select from list instead" : "None of these match? Enter a custom vibe"}
                </button>

                {showCustomVibeInput && (
                  <div className="mt-3 animate-slide-up">
                    <input
                      type="text"
                      placeholder="E.g., Synthwave Retro, Lyrical Hip Hop, Coding Flow..."
                      value={customVibe}
                      onChange={(e) => setCustomVibe(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-[#242424] border border-[#1ed760]/30 outline-none text-[14px] text-white transition focus:bg-[#282828] placeholder-white/30"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: AUDIO FOCUS */}
          {step === 3 && (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[12px] text-[#b3b3b3] font-medium">Select up to 2 areas of focus (at least 1)</span>
                <span className="text-[11px] text-[#fa6635] font-bold">{audioFocus.length}/2 selected</span>
              </div>
              {focusOptions.map(option => {
                const isSelected = audioFocus.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => {
                      setAutoFocus(prev => {
                        if (prev.includes(option.id)) {
                          if (prev.length <= 1) return prev; // Keep at least 1
                          return prev.filter(x => x !== option.id);
                        }
                        if (prev.length >= 2) {
                          // Remove first/oldest selection and append the new one (FIFO)
                          return [prev[1], option.id];
                        }
                        return [...prev, option.id];
                      });
                    }}
                    className={`group relative flex items-center justify-between rounded-xl bg-[#181818] p-4.5 border cursor-pointer hover:bg-[#222222] transition duration-200 ${
                      isSelected ? "border-[#1ed760] shadow-[0_0_12px_rgba(30,215,96,0.12)] bg-[#1a221a]" : "border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-2.5 rounded bg-gradient-to-b ${option.highlight}`} />
                      <div>
                        <h4 className="font-bold text-[15px] text-white">{option.title}</h4>
                        <p className="text-[12px] text-[#b3b3b3] mt-1">{option.desc}</p>
                      </div>
                    </div>
                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition duration-200 ${
                      isSelected ? "bg-[#1ed760] border-[#1ed760] text-black" : "border-[#7c7c7c] text-transparent"
                    }`}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 4: FAVORITE ARTISTS */}
          {step === 4 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
              {artistOptions.map(artist => {
                const isSelected = selectedArtists.includes(artist.name);
                return (
                  <div
                    key={artist.name}
                    onClick={() => handleArtistToggle(artist.name)}
                    className="flex flex-col items-center gap-3 cursor-pointer group"
                  >
                    <div className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${artist.color} text-white text-[24px] font-bold shadow-md transition-all duration-300 ${
                      isSelected ? "ring-4 ring-[#1ed760] scale-102 shadow-[0_0_15px_rgba(30,215,96,0.4)]" : "group-hover:scale-104"
                    }`}>
                      {artist.initials}
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1ed760] text-black shadow-md border border-[#121212]">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span className={`text-[12px] font-bold text-center transition truncate w-full ${
                      isSelected ? "text-[#1ed760]" : "text-[#b3b3b3] group-hover:text-white"
                    }`}>
                      {artist.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* STEP 5: SUGGESTED SEED SONGS (PREVIEW + CHECKBOX) */}
          {step === 5 && (
            <div className="flex flex-col gap-3">
              {suggestedSongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-[#b3b3b3]">
                  <p className="text-[14px]">No songs match your exact criteria yet.</p>
                  <p className="text-[12px] opacity-75 mt-1">We will generate recommendations as you listen.</p>
                </div>
              ) : (
                suggestedSongs.map(song => {
                  const isChecked = selectedSongs.includes(song.id);
                  const isPlaying = playingPreviewId === song.id;
                  return (
                    <div
                      key={song.id}
                      onClick={() => handleSongToggle(song.id)}
                      className={`group flex items-center justify-between p-3 rounded-lg bg-[#181818] hover:bg-[#222222] cursor-pointer transition duration-150 border border-transparent ${
                        isChecked ? "border-[#1ed760]/30 bg-[#1c221c]/40" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Compact Cover Image + Preview Action */}
                        <div className="relative h-11 w-11 shrink-0 rounded overflow-hidden shadow">
                          <SafeImage
                            src={song.coverUrl}
                            alt={song.title}
                            fallbackTitle={song.title}
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={(e) => togglePreview(song, e)}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150 text-white"
                          >
                            {isPlaying ? (
                              <Pause size={14} fill="currentColor" />
                            ) : (
                              <Play size={14} fill="currentColor" className="ml-0.5" />
                            )}
                          </button>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13.5px] font-bold text-white truncate">{song.title}</p>
                          <p className="text-[11.5px] text-[#b3b3b3] truncate mt-0.5">{song.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={(e) => togglePreview(song, e)}
                          className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition ${
                            isPlaying ? "bg-[#1ed760]/20 text-[#1ed760] hover:bg-[#1ed760]/30" : ""
                          }`}
                        >
                          {isPlaying ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                        </button>

                        <div className={`flex h-5 w-5 items-center justify-center rounded-md border transition duration-150 ${
                          isChecked ? "bg-[#1ed760] border-[#1ed760] text-black" : "border-[#7c7c7c] text-transparent"
                        }`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* STEP 6: CUSTOM PERSONALIZATION NOTES */}
          {step === 6 && (
            <div className="flex flex-col gap-4">
              <label className="text-[13px] font-bold text-[#b3b3b3] uppercase tracking-wider">
                Custom personalization instructions:
              </label>
              <textarea
                placeholder="E.g., I love high-tempo Telugu workout music, only slow acoustic romantic songs in Hindi, or lo-fi electronic tracks. Please avoid cover tracks."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={5}
                className="w-full px-4 py-3.5 rounded-lg bg-[#242424] border border-transparent focus:border-[#1ed760]/40 outline-none text-[14px] text-white resize-none transition focus:bg-[#282828] placeholder-white/30 leading-relaxed"
              />
              <p className="text-[11px] text-[#7c7c7c]">
                These custom notes will feed directly into our recommendation algorithm to skew daily mixes.
              </p>
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between border-t border-[#282828] pt-5">
          {/* Back Button */}
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 rounded-full border border-[#7c7c7c] px-5 py-2.5 text-[12px] font-bold text-[#b3b3b3] hover:text-white hover:border-white transition duration-150 cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div />
          )}

          {/* Next / Submit Button */}
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 rounded-full bg-[#1ed760] text-black px-6 py-2.5 text-[13px] font-bold hover:scale-104 active:scale-98 transition duration-150 cursor-pointer shadow-md hover:bg-[#1fdf64]"
          >
            {step === 6 ? "Complete Activation" : "Continue"}
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
