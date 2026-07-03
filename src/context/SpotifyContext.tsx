"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  coverUrl: string;
  audioUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  isPublic: boolean;
  creator: string;
}

interface SpotifyContextType {
  playlists: Playlist[];
  currentView: string; // 'home', 'search', or 'playlist_[id]'
  searchQuery: string;
  activeTrack: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number; // in seconds
  duration: number; // in seconds
  songDatabase: Song[];
  likedSongs: Song[];
  historySongs: Song[];
  recommendedSongs: Song[];
  trendingSongs: Song[];
  queue: Song[];
  currentQueueIndex: number;
  shuffle: boolean;
  repeat: "none" | "all" | "one";
  showQueue: boolean;
  
  // Actions
  setView: (view: string) => void;
  setSearchQuery: (query: string) => void;
  createPlaylist: () => void;
  deletePlaylist: (id: string) => void;
  updatePlaylist: (id: string, name: string, description: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  playTrack: (track: Song, newQueue?: Song[]) => void;
  togglePlay: () => void;
  setVolumeLevel: (level: number) => void;
  seekTo: (seconds: number) => void;
  likeTrackToggle: (song: Song) => void;
  removeFromHistory: (songId: string) => void;
  toggleQueue: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  setQueue: (songs: Song[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const MOCK_SONG_DATABASE: Song[] = [
  // English
  {
    id: "eng_1",
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    duration: "3:53",
    durationSeconds: 233,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "eng_2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: "3:20",
    durationSeconds: 200,
    coverUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "eng_3",
    title: "As It Was",
    artist: "Harry Styles",
    album: "Harry's House",
    duration: "2:47",
    durationSeconds: 167,
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "eng_4",
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    album: "F*CK LOVE 3: OVER YOU",
    duration: "2:21",
    durationSeconds: 141,
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "eng_5",
    title: "Flowers",
    artist: "Miley Cyrus",
    album: "Endless Summer Vacation",
    duration: "3:20",
    durationSeconds: 200,
    coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  // Hindi
  {
    id: "hin_1",
    title: "Tum Hi Ho",
    artist: "Arijit Singh, Mithoon",
    album: "Aashiqui 2",
    duration: "4:22",
    durationSeconds: 262,
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "hin_2",
    title: "Kesariya",
    artist: "Arijit Singh, Pritam",
    album: "Brahmastra",
    duration: "4:28",
    durationSeconds: 268,
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: "hin_3",
    title: "Apna Bana Le",
    artist: "Arijit Singh, Sachin-Jigar",
    album: "Bhediya",
    duration: "4:21",
    durationSeconds: 261,
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    id: "hin_4",
    title: "Raataan Lambiyan",
    artist: "Jubin Nautiyal, Asees Kaur",
    album: "Shershaah",
    duration: "3:50",
    durationSeconds: 230,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
  },
  {
    id: "hin_5",
    title: "Kabira",
    artist: "Tochi Raina, Rekha Bhardwaj",
    album: "Yeh Jawaani Hai Deewani",
    duration: "4:11",
    durationSeconds: 251,
    coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
  },
  // Telugu
  {
    id: "tel_1",
    title: "Naatu Naatu",
    artist: "Rahul Sipligunj, Kaala Bhairava",
    album: "RRR",
    duration: "3:35",
    durationSeconds: 215,
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3"
  },
  {
    id: "tel_2",
    title: "Samajavaragamana",
    artist: "Sid Sriram",
    album: "Ala Vaikunthapurramuloo",
    duration: "3:41",
    durationSeconds: 221,
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"
  },
  {
    id: "tel_3",
    title: "Srivalli",
    artist: "Sid Sriram",
    album: "Pushpa: The Rise",
    duration: "3:44",
    durationSeconds: 224,
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3"
  },
  {
    id: "tel_4",
    title: "Butta Bomma",
    artist: "Armaan Malik",
    album: "Ala Vaikunthapurramuloo",
    duration: "3:17",
    durationSeconds: 197,
    coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3"
  },
  {
    id: "tel_5",
    title: "Adiga Adiga",
    artist: "Sid Sriram",
    album: "Ninnu Kori",
    duration: "3:46",
    durationSeconds: 226,
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=60",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
  }
];

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);
const queryClient = new QueryClient();

// Helper to map API song items
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
    audioUrl: "" // Stream resolved dynamically
  };
};

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentView, setView] = useState<string>("home");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTrack, setActiveTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  
  const [songDatabase, setSongDatabase] = useState<Song[]>(MOCK_SONG_DATABASE);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [historySongs, setHistorySongs] = useState<Song[]>([]);
  const [recommendedSongs, setRecommendedSongs] = useState<Song[]>(MOCK_SONG_DATABASE.slice(5, 11));
  const [trendingSongs, setTrendingSongs] = useState<Song[]>(MOCK_SONG_DATABASE);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(-1);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<"none" | "all" | "one">("none");
  const [showQueue, setShowQueue] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const queueRef = useRef<Song[]>([]);
  const currentQueueIndexRef = useRef<number>(-1);
  const repeatRef = useRef<"none" | "all" | "one">("none");
  const shuffleRef = useRef<boolean>(false);
  const activeTrackRef = useRef<Song | null>(null);
  const playNextRef = useRef<() => void>(() => {});
  const loadingTrackIdRef = useRef<string | null>(null);
  const activeFetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => { queueRef.current = queue; }, [queue]);
  useEffect(() => { currentQueueIndexRef.current = currentQueueIndex; }, [currentQueueIndex]);
  useEffect(() => { repeatRef.current = repeat; }, [repeat]);
  useEffect(() => { shuffleRef.current = shuffle; }, [shuffle]);
  useEffect(() => { activeTrackRef.current = activeTrack; }, [activeTrack]);

  // Queue actions
  const toggleQueue = () => setShowQueue((prev) => !prev);
  
  const addToQueue = (song: Song) => {
    setQueue((prev) => {
      if (prev.some((s) => s.id === song.id)) return prev;
      return [...prev, song];
    });
  };

  const removeFromQueue = (songId: string) => {
    setQueue((prev) => {
      const idx = prev.findIndex((s) => s.id === songId);
      const updated = prev.filter((s) => s.id !== songId);
      if (songId === activeTrackRef.current?.id) {
        // Current track removed: pause or play next
        setTimeout(() => playNext(), 0);
      } else if (idx <= currentQueueIndexRef.current) {
        setCurrentQueueIndex((c) => Math.max(0, c - 1));
      }
      return updated;
    });
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentQueueIndex(-1);
    setActiveTrack(null);
    setIsPlaying(false);
  };

  const toggleShuffle = () => setShuffle((prev) => !prev);

  const toggleRepeat = () => {
    setRepeat((prev) => {
      if (prev === "none") return "all";
      if (prev === "all") return "one";
      return "none";
    });
  };

  const playNext = () => {
    const q = queueRef.current;
    const idx = currentQueueIndexRef.current;
    const rep = repeatRef.current;
    const shuf = shuffleRef.current;

    if (q.length === 0) return;

    let nextIdx = idx + 1;
    if (shuf) {
      nextIdx = Math.floor(Math.random() * q.length);
    } else if (nextIdx >= q.length) {
      if (rep === "all") {
        nextIdx = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    const nextTrack = q[nextIdx];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  };

  const playPrevious = () => {
    const q = queueRef.current;
    const idx = currentQueueIndexRef.current;
    const shuf = shuffleRef.current;

    if (q.length === 0) return;

    let prevIdx = idx - 1;
    if (shuf) {
      prevIdx = Math.floor(Math.random() * q.length);
    } else if (prevIdx < 0) {
      prevIdx = q.length - 1;
    }

    const prevTrack = q[prevIdx];
    if (prevTrack) {
      playTrack(prevTrack);
    }
  };

  useEffect(() => {
    playNextRef.current = playNext;
  });

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setProgress(Math.floor(audioRef.current.currentTime));
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(Math.floor(audioRef.current.duration));
      }
    };

    const handleEnded = () => {
      setProgress(0);
      if (repeatRef.current === "one") {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) => console.error(err));
        }
      } else {
        playNextRef.current();
      }
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle playing state change
  useEffect(() => {
    if (!audioRef.current || !activeTrack) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Playback failed:", err);
            setIsPlaying(false);
          }
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, activeTrack]);

  // Load playlists, likes, and history on mount (sync with API)
  const syncWithBackend = async () => {
    try {
      // 1. Fetch playlists
      const plRes = await fetch(`${API_BASE}/playlists/`);
      if (plRes.ok) {
        const data = await plRes.json();
        setPlaylists(data.map((pl: any) => ({
          id: pl.id,
          name: pl.name,
          description: pl.description || "",
          isPublic: true,
          creator: pl.user_id,
          songs: pl.songs.map(mapSongFromApi)
        })));
      }

      // 2. Fetch likes
      const lRes = await fetch(`${API_BASE}/tracks/likes`);
      if (lRes.ok) {
        const data = await lRes.json();
        setLikedSongs(data.map(mapSongFromApi));
      }

      // 3. Fetch history
      const hRes = await fetch(`${API_BASE}/tracks/history`);
      if (hRes.ok) {
        const data = await hRes.json();
        setHistorySongs(data.map(mapSongFromApi));
      }
      
      // 4. Fetch recommendations
      const rRes = await fetch(`${API_BASE}/recommendations/`);
      if (rRes.ok) {
        const data = await rRes.json();
        if (data && data.length > 0) {
          setRecommendedSongs(data.map(mapSongFromApi));
        } else {
          setRecommendedSongs(MOCK_SONG_DATABASE.slice(5, 11));
        }
      } else {
        setRecommendedSongs(MOCK_SONG_DATABASE.slice(5, 11));
      }

      // 5. Fetch trending songs
      const tRes = await fetch(`${API_BASE}/tracks/trending`);
      if (tRes.ok) {
        const data = await tRes.json();
        if (data && data.length > 0) {
          setTrendingSongs(data.map(mapSongFromApi));
        } else {
          setTrendingSongs(MOCK_SONG_DATABASE);
        }
      } else {
        setTrendingSongs(MOCK_SONG_DATABASE);
      }

    } catch (e) {
      console.warn("Backend offline, falling back to local storage and mocks.");
      setTrendingSongs(MOCK_SONG_DATABASE);
      setRecommendedSongs(MOCK_SONG_DATABASE.slice(5, 11));
      
      // Local Storage Offline Fallback
      const saved = localStorage.getItem("spotify_playlists");
      if (saved) {
        try {
          setPlaylists(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse local playlists", e);
        }
      }
      
      const savedLikes = localStorage.getItem("spotify_likes");
      if (savedLikes) {
        try {
          setLikedSongs(JSON.parse(savedLikes));
        } catch (e) {
          console.error("Failed to parse local likes", e);
        }
      }
    }
  };

  useEffect(() => {
    syncWithBackend();
  }, []);

  // Update recommendations whenever likes change
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const rRes = await fetch(`${API_BASE}/recommendations/`);
        if (rRes.ok) {
          const data = await rRes.json();
          setRecommendedSongs(data.map(mapSongFromApi));
        }
      } catch (e) {}
    };
    fetchRecs();
  }, [likedSongs]);

  // Sync Search results
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSongDatabase(MOCK_SONG_DATABASE);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE}/tracks/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSongDatabase(data.map(mapSongFromApi));
        }
      } catch (e) {
        // Local search fallback
        const filtered = MOCK_SONG_DATABASE.filter(
          (s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.artist.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSongDatabase(filtered);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const createPlaylist = async () => {
    const nextNumber = playlists.length + 1;
    const name = `My Playlist #${nextNumber}`;
    const desc = "";
    
    try {
      const res = await fetch(`${API_BASE}/playlists/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description: desc })
      });
      if (res.ok) {
        await syncWithBackend();
        const data = await res.json();
        setView(`playlist_${data.id}`);
        return;
      }
    } catch (e) {}

    // Offline create fallback
    const newId = `playlist-${Date.now()}`;
    const newPlaylist: Playlist = {
      id: newId,
      name,
      description: desc,
      songs: [],
      isPublic: true,
      creator: "Sharath"
    };
    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    localStorage.setItem("spotify_playlists", JSON.stringify(updatedPlaylists));
    setView(`playlist_${newId}`);
  };

  const deletePlaylist = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/playlists/${id}`, { method: "DELETE" });
      if (res.ok) {
        await syncWithBackend();
        if (currentView === `playlist_${id}`) setView("home");
        return;
      }
    } catch (e) {}

    // Offline delete fallback
    const updatedPlaylists = playlists.filter((p) => p.id !== id);
    setPlaylists(updatedPlaylists);
    localStorage.setItem("spotify_playlists", JSON.stringify(updatedPlaylists));
    if (currentView === `playlist_${id}`) setView("home");
  };

  const updatePlaylist = async (id: string, name: string, description: string) => {
    try {
      const res = await fetch(`${API_BASE}/playlists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) {
        await syncWithBackend();
        return;
      }
    } catch (e) {}

    // Offline update fallback
    const updatedPlaylists = playlists.map((p) => {
      if (p.id === id) {
        return { ...p, name, description };
      }
      return p;
    });
    setPlaylists(updatedPlaylists);
    localStorage.setItem("spotify_playlists", JSON.stringify(updatedPlaylists));
  };

  const addSongToPlaylist = async (playlistId: string, song: Song) => {
    try {
      const res = await fetch(
        `${API_BASE}/playlists/${playlistId}/songs/${song.id}?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}&album=${encodeURIComponent(song.album)}&cover_image=${encodeURIComponent(song.coverUrl)}`,
        { method: "POST" }
      );
      if (res.ok) {
        await syncWithBackend();
        return;
      }
    } catch (e) {}

    // Offline fallback
    const updatedPlaylists = playlists.map((p) => {
      if (p.id === playlistId) {
        if (p.songs.some((s) => s.id === song.id)) return p;
        return { ...p, songs: [...p.songs, song] };
      }
      return p;
    });
    setPlaylists(updatedPlaylists);
    localStorage.setItem("spotify_playlists", JSON.stringify(updatedPlaylists));
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    try {
      const res = await fetch(`${API_BASE}/playlists/${playlistId}/songs/${songId}`, { method: "DELETE" });
      if (res.ok) {
        await syncWithBackend();
        return;
      }
    } catch (e) {}

    // Offline fallback
    const updatedPlaylists = playlists.map((p) => {
      if (p.id === playlistId) {
        return { ...p, songs: p.songs.filter((s) => s.id !== songId) };
      }
      return p;
    });
    setPlaylists(updatedPlaylists);
    localStorage.setItem("spotify_playlists", JSON.stringify(updatedPlaylists));
  };

  const playTrack = async (track: Song, newQueue?: Song[]) => {
    if (!audioRef.current) return;
    
    // Abort previous fetch resolution if active
    if (activeFetchControllerRef.current) {
      activeFetchControllerRef.current.abort();
    }
    
    // Create new controller for this request
    const controller = new AbortController();
    activeFetchControllerRef.current = controller;

    loadingTrackIdRef.current = track.id;
    const trackId = track.id;

    // Immediately pause to cancel any pending play requests and prevent AbortError
    audioRef.current.pause();
    
    let targetQueue = queueRef.current;
    if (newQueue) {
      targetQueue = newQueue;
      setQueue(newQueue);
    }

    const index = targetQueue.findIndex((s) => s.id === track.id);
    if (index === -1) {
      const updatedQueue = [...targetQueue, track];
      setQueue(updatedQueue);
      setCurrentQueueIndex(updatedQueue.length - 1);
    } else {
      setCurrentQueueIndex(index);
    }

    const isSameTrack = activeTrack?.id === track.id;
    if (isSameTrack) {
      togglePlay();
      activeFetchControllerRef.current = null;
      return;
    }

    try {
      console.log(`Resolving stream for track: ${track.id}`);
      const res = await fetch(`${API_BASE}/tracks/resolve/${track.id}`, {
        signal: controller.signal
      });
      if (res.ok) {
        // Discard result if user clicked a different track in the meantime
        if (loadingTrackIdRef.current !== trackId) return;

        const data = await res.json();
        
        // Final sanity check before modifying audio source
        if (loadingTrackIdRef.current !== trackId) return;

        audioRef.current.src = data.streamUrl;
        setActiveTrack(track);
        setIsPlaying(true);
        setProgress(0);

        fetch(
          `${API_BASE}/tracks/history/${track.id}?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}&album=${encodeURIComponent(track.album)}&cover_image=${encodeURIComponent(track.coverUrl)}`,
          { method: "POST" }
        ).then(() => syncWithBackend()).catch(() => {});
        return;
      }
    } catch (e: any) {
      if (e.name === "AbortError") {
        console.log(`Resolution for track ${trackId} was aborted.`);
        return;
      }
      console.warn("Could not resolve stream from API. Using local audioUrl fallback.");
    }

    // Fallback logic (only if this track is still the active loader target)
    if (loadingTrackIdRef.current !== trackId) return;

    let fallbackUrl = track.audioUrl;
    if (!fallbackUrl) {
      const match = MOCK_SONG_DATABASE.find((s) => s.id === track.id);
      fallbackUrl = match?.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    }
    
    audioRef.current.src = fallbackUrl;
    setActiveTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlay = () => {
    if (!activeTrack && queue.length > 0) {
      playTrack(queue[0]);
    } else if (!activeTrack && songDatabase.length > 0) {
      playTrack(songDatabase[0]);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const setVolumeLevel = (level: number) => {
    setVolume(Math.max(0, Math.min(1, level)));
  };

  const seekTo = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setProgress(seconds);
    }
  };

  const likeTrackToggle = async (song: Song) => {
    const isLiked = likedSongs.some((s) => s.id === song.id);
    
    try {
      const url = `${API_BASE}/tracks/likes/${song.id}`;
      const method = isLiked ? "DELETE" : "POST";
      const query = isLiked 
        ? "" 
        : `?title=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.artist)}&album=${encodeURIComponent(song.album)}&cover_image=${encodeURIComponent(song.coverUrl)}`;
      
      const res = await fetch(`${url}${query}`, { method });
      if (res.ok) {
        await syncWithBackend();
        return;
      }
    } catch (e) {}

    let updated;
    if (isLiked) {
      updated = likedSongs.filter((s) => s.id !== song.id);
    } else {
      updated = [...likedSongs, song];
    }
    setLikedSongs(updated);
  };

  const removeFromHistory = async (songId: string) => {
    try {
      const res = await fetch(`${API_BASE}/tracks/history/${songId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await syncWithBackend();
        return;
      }
    } catch (e) {
      console.warn("Failed to delete track history on API. Falling back locally.");
    }

    const updated = historySongs.filter((s) => s.id !== songId);
    setHistorySongs(updated);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SpotifyContext.Provider
        value={{
          playlists,
          currentView,
          searchQuery,
          activeTrack,
          isPlaying,
          volume,
          progress,
          duration,
          songDatabase,
          likedSongs,
          historySongs,
          recommendedSongs,
          trendingSongs,
          queue,
          currentQueueIndex,
          shuffle,
          repeat,
          showQueue,
          setView,
          setSearchQuery,
          createPlaylist,
          deletePlaylist,
          updatePlaylist,
          addSongToPlaylist,
          removeSongFromPlaylist,
          playTrack,
          togglePlay,
          setVolumeLevel,
          seekTo,
          likeTrackToggle,
          removeFromHistory,
          toggleQueue,
          addToQueue,
          removeFromQueue,
          clearQueue,
          setQueue,
          playNext,
          playPrevious,
          toggleShuffle,
          toggleRepeat
        }}
      >
        {children}
      </SpotifyContext.Provider>
    </QueryClientProvider>
  );
}

export function useSpotify() {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error("useSpotify must be used within a SpotifyProvider");
  }
  return context;
}
