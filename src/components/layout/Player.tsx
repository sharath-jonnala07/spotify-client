"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSpotify, Song } from "@/context/SpotifyContext";
import { Heart, Maximize2, Minimize2, Music, X } from "lucide-react";
import SafeImage from "../ui/SafeImage";
import {
  PlayIcon,
  PauseIcon,
  PreviousIcon,
  NextIcon,
  ShuffleIcon,
  RepeatIcon,
  VolumeHighIcon,
  VolumeMediumIcon,
  VolumeLowIcon,
  VolumeMutedIcon,
  SpeakerIcon,
  QueueIcon,
  LyricsIcon,
  PipIcon,
  FullscreenIcon
} from "../ui/SpotifyIcons";

export default function Player() {
  const {
    activeTrack,
    isPlaying,
    volume,
    progress,
    duration,
    togglePlay,
    seekTo,
    setVolumeLevel,
    playTrack,
    songDatabase,
    queue,
    currentQueueIndex,
    shuffle,
    repeat,
    showQueue,
    toggleQueue,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    likedSongs,
    likeTrackToggle
  } = useSpotify();

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [prevVolume, setPrevVolume] = useState<number>(0.5);
  const [isHoveringProgress, setIsHoveringProgress] = useState<boolean>(false);
  const [isHoveringVolume, setIsHoveringVolume] = useState<boolean>(false);
  const [showLyrics, setShowLyrics] = useState<boolean>(false);
  const [showFullscreen, setShowFullscreen] = useState<boolean>(false);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolumeLevel(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolumeLevel(0);
      setIsMuted(true);
    }
  };

  // Scrubbing logic for progress bar
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const targetSeconds = Math.floor(percentage * duration);
    seekTo(Math.max(0, Math.min(duration, targetSeconds)));
  };

  // Dragging logic for progress bar
  const handleProgressBarDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only trigger if left mouse is pressed
    handleProgressBarClick(e);
  };

  // Volume bar click/drag logic
  const handleVolumeBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const targetVolume = Math.max(0, Math.min(1, percentage));
    setVolumeLevel(targetVolume);
    if (targetVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleVolumeBarDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    handleVolumeBarClick(e);
  };

  // Helper: Format time seconds to string mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === 0) return "-:--";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Get speaker icon according to volume level
  const renderVolumeIcon = () => {
    if (volume === 0 || isMuted) return <VolumeMutedIcon size={16} />;
    if (volume < 0.3) return <VolumeLowIcon size={16} />;
    if (volume < 0.7) return <VolumeMediumIcon size={16} />;
    return <VolumeHighIcon size={16} />;
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;
  const volumePercent = volume * 100;

  const isLiked = activeTrack ? likedSongs.some((s) => s.id === activeTrack.id) : false;

  const getMockLyrics = (title: string) => {
    if (title.toLowerCase().includes("aashiqui") || title.toLowerCase().includes("ho")) {
      return [
        "Hum tere bin ab reh nahi sakte",
        "Tere bina kya wajood mera",
        "Tujhse juda agar ho jayenge",
        "Toh khud se hi ho jayenge juda",
        "Kyunki tum hi ho",
        "Ab tum hi ho",
        "Zindagi ab tum hi ho",
        "Chain bhi, mera dard bhi",
        "Meri aashiqui ab tum hi ho"
      ];
    }
    if (title.toLowerCase().includes("sanam") || title.toLowerCase().includes("kasam")) {
      return [
        "Betaabiyaan...",
        "Neendein udati hain",
        "Sanam teri kasam...",
        "Tumhe paane ki chahat mein",
        "Sanam teri kasam...",
        "Dil ko behla lete hain",
        "Khwaabon se sazaa lete hain",
        "Sanam teri kasam..."
      ];
    }
    if (title.toLowerCase().includes("yellow")) {
      return [
        "Look at the stars",
        "Look how they shine for you",
        "And everything you do",
        "Yeah, they were all yellow",
        "I came along",
        "I wrote a song for you",
        "And all the things you do",
        "And it was called Yellow"
      ];
    }
    if (title.toLowerCase().includes("blinding") || title.toLowerCase().includes("lights")) {
      return [
        "Yeah...",
        "I've been on my own for long enough",
        "Maybe you can show me how to love, maybe",
        "I'm going through withdrawals",
        "You don't even have to do too much",
        "You can turn me on with just a touch, baby",
        "I look around and Sin City's cold and empty",
        "No one's around to judge me",
        "I can't see clearly when you're gone"
      ];
    }
    return [
      "Music playing...",
      "Enjoy the beautiful rhythm.",
      "Feel the beat flow through your soul.",
      "Sing along to your favorite tune.",
      "Spotify Web Player replica.",
      "Streaming high quality audio..."
    ];
  };

  const activeLyrics = activeTrack ? getMockLyrics(activeTrack.title) : [];
  const lyricIndex = activeLyrics.length > 0 && duration > 0
    ? Math.min(Math.floor((progress / duration) * activeLyrics.length), activeLyrics.length - 1)
    : 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-[999] flex h-[90px] w-full items-center justify-between bg-black px-4 text-white border-t border-[#121212] select-none font-sans">
      
      {/* Left: Active Track Info */}
      <div className="flex w-[30%] min-w-[180px] items-center gap-3.5">
        {activeTrack ? (
          <>
            {/* Album Cover */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded shadow-md">
              <SafeImage
                src={activeTrack.coverUrl}
                alt={activeTrack.album}
                fallbackTitle={activeTrack.title}
                className="h-full w-full object-cover"
              />
            </div>
            {/* Title & Artist */}
            <div className="min-w-0">
              <h5 className="text-[14px] font-bold text-white hover:underline cursor-pointer truncate">
                {activeTrack.title}
              </h5>
              <p className="text-[11px] text-[#b3b3b3] hover:underline hover:text-white cursor-pointer truncate mt-0.5 font-normal">
                {activeTrack.artist}
              </p>
            </div>
            {/* Action heart button */}
            <button
              onClick={() => likeTrackToggle(activeTrack)}
              className={`ml-2 hover:scale-104 active:scale-95 transition ${
                isLiked ? "text-[#1ed760]" : "text-[#b3b3b3] hover:text-white"
              }`}
            >
              <Heart size={16} fill={isLiked ? "#1ed760" : "none"} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3 text-[#b3b3b3]">
            <div className="h-14 w-14 rounded bg-[#1f1f1f] flex items-center justify-center">
              <Music size={20} />
            </div>
            <div>
              <span className="text-[13px] font-medium">No track selected</span>
            </div>
          </div>
        )}
      </div>

      {/* Center: Controls & Time Bar */}
      <div className="flex max-w-[722px] flex-1 flex-col items-center gap-2">
        {/* Buttons Row */}
        <div className="flex items-center gap-5 text-[#b3b3b3]">
          <button 
            onClick={toggleShuffle}
            className={`hover:text-white transition duration-150 flex flex-col items-center relative ${
              shuffle ? "text-[#1ed760] hover:text-[#1fdf64]" : ""
            }`}
            title="Shuffle"
          >
            <ShuffleIcon size={16} />
            {shuffle && <span className="absolute -bottom-1 h-[3px] w-[3px] rounded-full bg-[#1ed760]" />}
          </button>
          
          <button 
            onClick={playPrevious}
            className="hover:text-white transition duration-150 disabled:opacity-50"
            disabled={!activeTrack || queue.length === 0}
            title="Previous"
          >
            <PreviousIcon size={16} />
          </button>

          {/* Play/Pause Circle Button */}
          <button
            onClick={togglePlay}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:scale-106 active:scale-98 transition duration-100"
          >
            {isPlaying ? (
              <PauseIcon size={14} className="ml-[0px]" />
            ) : (
              <PlayIcon size={14} className="ml-[2px]" />
            )}
          </button>

          <button 
            onClick={playNext}
            className="hover:text-white transition duration-150 disabled:opacity-50"
            disabled={!activeTrack || queue.length === 0}
            title="Next"
          >
            <NextIcon size={16} />
          </button>

          <button 
            onClick={toggleRepeat}
            className={`hover:text-white transition duration-150 flex flex-col items-center relative ${
              repeat !== "none" ? "text-[#1ed760] hover:text-[#1fdf64]" : ""
            }`}
            title={`Repeat: ${repeat}`}
          >
            <RepeatIcon size={16} />
            {repeat !== "none" && (
              <span className="absolute -bottom-1 h-[3px] w-[3px] rounded-full bg-[#1ed760]" />
            )}
            {repeat === "one" && (
              <span className="absolute -top-1.5 -right-1.5 text-[7px] font-black bg-[#1ed760] text-black px-0.5 rounded-full min-w-3 text-center">1</span>
            )}
          </button>
        </div>

        {/* Time Progress Row */}
        <div className="flex w-full items-center gap-2 text-[11px] text-[#b3b3b3]">
          <span className="w-8 text-right font-normal">{formatTime(progress)}</span>
          
          {/* Custom Slider Bar */}
          <div
            ref={progressBarRef}
            onClick={handleProgressBarClick}
            onMouseMove={handleProgressBarDrag}
            onMouseEnter={() => setIsHoveringProgress(true)}
            onMouseLeave={() => setIsHoveringProgress(false)}
            className="relative flex flex-1 h-3 cursor-pointer items-center group"
          >
            <div className={`w-full rounded-full bg-[#2a2a2a] transition-all duration-100 ${isHoveringProgress ? "h-1.5" : "h-1"}`}>
              {/* Fill Track */}
              <div
                className={`h-full rounded-full transition-colors duration-100 ${
                  isHoveringProgress ? "bg-[#1ed760]" : "bg-white/80"
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Grab handle dot */}
            {isHoveringProgress && (
              <div
                className="absolute h-3.5 w-3.5 rounded-full bg-white shadow-md transition-all duration-100 hover:scale-110"
                style={{
                  left: `calc(${progressPercent}% - 7px)`,
                  top: "calc(50% - 7px)"
                }}
              />
            )}
          </div>

          
          <span className="w-8 text-left font-normal">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Sound & Utilities */}
      <div className="flex w-[30%] min-w-[180px] items-center justify-end gap-3.5 text-[#b3b3b3]">
        <button 
          onClick={() => {
            setShowLyrics(!showLyrics);
            setShowFullscreen(false);
          }}
          className={`hover:text-white transition duration-150 ${
            showLyrics ? "text-[#1ed760]" : ""
          }`}
          title="Lyrics"
        >
          <LyricsIcon size={16} />
        </button>

        <button 
          onClick={toggleQueue}
          className={`hover:text-white transition duration-150 ${
            showQueue ? "text-[#1ed760]" : ""
          }`}
          title="Queue"
        >
          <QueueIcon size={16} />
        </button>

        {/* Volume Slider Section */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleMuteToggle}
            className="hover:text-white transition duration-150"
          >
            {renderVolumeIcon()}
          </button>

          {/* Custom Volume Slider */}
          <div
            ref={volumeBarRef}
            onClick={handleVolumeBarClick}
            onMouseMove={handleVolumeBarDrag}
            onMouseEnter={() => setIsHoveringVolume(true)}
            onMouseLeave={() => setIsHoveringVolume(false)}
            className="relative w-[93px] h-3 cursor-pointer flex items-center group"
          >
            <div className={`w-full rounded-full bg-[#2a2a2a] transition-all duration-100 ${isHoveringVolume ? "h-1.5" : "h-1"}`}>
              {/* Fill Track */}
              <div
                className={`h-full rounded-full transition-colors duration-100 ${
                  isHoveringVolume ? "bg-[#1ed760]" : "bg-white/80"
                }`}
                style={{ width: `${volumePercent}%` }}
              />
            </div>
            {/* Grab handle dot */}
            {isHoveringVolume && (
              <div
                className="absolute h-3.5 w-3.5 rounded-full bg-white shadow-md transition-all duration-100 hover:scale-110"
                style={{
                  left: `calc(${volumePercent}% - 7px)`,
                  top: "calc(50% - 7px)"
                }}
              />
            )}
          </div>
        </div>

        <button 
          onClick={() => alert("Miniplayer mode: Picture in Picture is not supported by standard mock tracks.")}
          className="hover:text-white transition duration-150"
          title="Miniplayer"
        >
          <PipIcon size={16} />
        </button>

        <button 
          onClick={() => {
            setShowFullscreen(!showFullscreen);
            setShowLyrics(false);
          }}
          className={`hover:text-white transition duration-150 ${
            showFullscreen ? "text-[#1ed760]" : ""
          }`}
          title="Fullscreen"
        >
          <FullscreenIcon size={16} />
        </button>
      </div>

      {/* Synced Lyrics Fullscreen Overlay */}
      {showLyrics && activeTrack && (
        <div className="fixed inset-0 bg-[#0c3022]/98 z-[9999] flex flex-col justify-between p-8 text-white animate-fade-in font-sans">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SafeImage
                src={activeTrack.coverUrl}
                alt={activeTrack.album}
                fallbackTitle={activeTrack.title}
                className="h-12 w-12 object-cover rounded shadow-md"
              />
              <div>
                <p className="font-bold text-[14px]">{activeTrack.title}</p>
                <p className="text-[12px] text-[#b3b3b3]">{activeTrack.artist}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowLyrics(false)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrolling Lyrics */}
          <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto py-8">
            <div className="flex flex-col gap-6 text-center max-w-[600px]">
              {activeLyrics.map((line, idx) => (
                <p
                  key={idx}
                  className={`text-[20px] sm:text-[28px] font-black transition-all duration-300 ${
                    idx === lyricIndex 
                      ? "text-white scale-105" 
                      : "text-white/40 filter blur-[0.5px]"
                  }`}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Simple Control Bar */}
          <div className="flex flex-col items-center gap-4 bg-black/20 p-4 rounded-xl max-w-[800px] mx-auto w-full">
            <div className="flex items-center gap-6 text-white/80">
              <button onClick={playPrevious} className="hover:text-white"><PreviousIcon size={20} /></button>
              <button 
                onClick={togglePlay} 
                className="h-12 w-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-106 active:scale-98 transition cursor-pointer"
              >
                {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} className="ml-0.5" />}
              </button>
              <button onClick={playNext} className="hover:text-white"><NextIcon size={20} /></button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen TV / Canvas Overlay */}
      {showFullscreen && activeTrack && (
        <div 
          className="fixed inset-0 bg-cover bg-center z-[9999] flex flex-col justify-between p-12 text-white animate-fade-in font-sans"
          style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${activeTrack.coverUrl})` }}
        >
          {/* Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[#b3b3b3] text-[13px] font-bold">
              <Music size={16} />
              <span>PLAYING FROM QUEUE</span>
            </div>
            <button 
              onClick={() => setShowFullscreen(false)}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 transition cursor-pointer"
            >
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Grid Layout: Left Album, Right Lyrics */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 overflow-hidden py-8">
            {/* Left Cover */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left shrink-0 animate-fade-in">
              <img
                src={activeTrack.coverUrl}
                alt={activeTrack.album}
                className="w-56 h-56 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-md shadow-[0_12px_48px_rgba(0,0,0,0.6)]"
              />
              <h2 className="text-2xl sm:text-4xl font-extrabold mt-6 truncate max-w-[350px]">{activeTrack.title}</h2>
              <p className="text-[#b3b3b3] text-[16px] mt-1 hover:underline cursor-pointer">{activeTrack.artist}</p>
            </div>

            {/* Right Lyrics */}
            <div className="flex-1 flex flex-col justify-center overflow-y-auto max-h-[400px] pr-4 md:text-left text-center">
              <div className="flex flex-col gap-5">
                {activeLyrics.map((line, idx) => (
                  <p
                    key={idx}
                    className={`text-[18px] sm:text-[24px] font-extrabold transition-all duration-300 ${
                      idx === lyricIndex 
                        ? "text-[#1ed760] text-[20px] sm:text-[26px]" 
                        : "text-white/30"
                    }`}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Scrubber & Controls */}
          <div className="max-w-[900px] w-full mx-auto flex flex-col gap-4 bg-black/30 p-4 rounded-xl backdrop-blur-xs">
            {/* Scrubber */}
            <div className="flex items-center gap-3 text-[12px] text-[#b3b3b3]">
              <span>{formatTime(progress)}</span>
              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${progressPercent}%` }} />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
            {/* Playback Buttons */}
            <div className="flex items-center justify-between text-[#b3b3b3]">
              <button 
                onClick={toggleShuffle} 
                className={`hover:text-white ${shuffle ? "text-[#1ed760]" : ""}`}
              >
                <ShuffleIcon size={18} />
              </button>
              
              <div className="flex items-center gap-8 text-white">
                <button onClick={playPrevious} className="hover:text-white"><PreviousIcon size={20} /></button>
                <button 
                  onClick={togglePlay}
                  className="h-14 w-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-106 active:scale-98 transition cursor-pointer"
                >
                  {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} className="ml-0.5" />}
                </button>
                <button onClick={playNext} className="hover:text-white"><NextIcon size={20} /></button>
              </div>

              <button 
                onClick={toggleRepeat} 
                className={`hover:text-white ${repeat !== "none" ? "text-[#1ed760]" : ""}`}
              >
                <RepeatIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
