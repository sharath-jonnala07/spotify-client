"use client";

import React, { useState } from "react";
import { useSpotify, Song, Playlist } from "@/context/SpotifyContext";
import { Music, Play, Pause, Search, MoreHorizontal, Clock, Plus, Trash2, X, Sparkles, RefreshCw } from "lucide-react";
import EditDetailsModal from "./EditDetailsModal";
import SafeImage from "../ui/SafeImage";
import ContextMenu from "../ui/ContextMenu";

interface PlaylistDetailProps {
  playlistId: string;
  onEditPlaylist: (playlist: Playlist) => void;
}

export default function PlaylistDetail({ playlistId, onEditPlaylist }: PlaylistDetailProps) {
  const {
    playlists,
    activeTrack,
    isPlaying,
    playTrack,
    songDatabase,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist,
    updatePlaylist,
    likedSongs,
    setView
  } = useSpotify();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  const [localSearch, setLocalSearch] = useState<string>("");
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; song: Song } | null>(null);

  // Horizon Suggestions state
  const [horizonSuggestions, setHorizonSuggestions] = useState<Song[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);

  const fetchHorizonSuggestions = async () => {
    if (playlistId === "liked" || !playlistId) return;
    setLoadingSuggestions(true);
    try {
      const res = await fetch(`${API_BASE}/playlists/${playlistId}/horizon-suggestions`);
      if (res.ok) {
        const data = await res.json();
        setHorizonSuggestions(data.map((apiSong: any) => ({
          id: apiSong.id,
          title: apiSong.title,
          artist: apiSong.artist,
          album: apiSong.album,
          duration: apiSong.duration,
          durationSeconds: 200,
          coverUrl: apiSong.image_url || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=60",
          audioUrl: "", 
          reason: apiSong.reason,
          preview_offset: apiSong.preview_offset
        })));
      }
    } catch (e) {
      console.error("Failed to fetch Horizon suggestions", e);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  React.useEffect(() => {
    fetchHorizonSuggestions();
  }, [playlistId]);

  const handleContextMenu = (e: React.MouseEvent, song: Song) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      song
    });
  };

  // Find or construct the playlist
  let playlist: Playlist | undefined;
  if (playlistId === "liked") {
    playlist = {
      id: "liked",
      name: "Liked Songs",
      description: "Your personal playlist of liked songs.",
      isPublic: false,
      creator: "You",
      songs: likedSongs
    };
  } else {
    playlist = playlists.find((p) => p.id === playlistId);
  }

  if (!playlist) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#121212] text-[#b3b3b3]">
        <div className="text-center">
          <Music size={64} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white">Playlist not found</h3>
        </div>
      </div>
    );
  }

  // Calculate total duration of playlist songs
  const totalDurationSeconds = playlist.songs.reduce((acc, song) => acc + song.durationSeconds, 0);
  const formatTotalDuration = (seconds: number) => {
    if (seconds === 0) return "0 min";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs} hr ${mins} min`;
    }
    return `${mins} min`;
  };

  // Filter song database for recommendations
  const filteredSuggestions = songDatabase.filter((song) => {
    // Exclude songs already in the playlist
    const alreadyInPlaylist = playlist.songs.some((s) => s.id === song.id);
    if (alreadyInPlaylist) return false;

    // Filter by search query
    if (localSearch.trim() === "") return true; // show all as suggestions if empty
    return (
      song.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      song.artist.toLowerCase().includes(localSearch.toLowerCase())
    );
  });

  const handlePlayPlaylist = () => {
    if (playlist.songs.length > 0) {
      const isAlreadyPlayingPlaylistSong = playlist.songs.some((s) => s.id === activeTrack?.id);
      if (isAlreadyPlayingPlaylistSong) {
        // Toggle play/pause
        playTrack(activeTrack!);
      } else {
        // Play first song and set queue
        playTrack(playlist.songs[0], playlist.songs);
      }
    }
  };

  const isPlaylistPlaying = isPlaying && playlist.songs.some((s) => s.id === activeTrack?.id);

  return (
    <div className="flex-1 flex flex-col bg-[#121212] overflow-y-auto pb-24 font-sans select-none relative scrollbar-thin">
      {/* Top Banner Gradient */}
      <div 
        className={`flex items-end gap-6 px-6 pt-20 pb-6 bg-gradient-to-b min-h-[340px] ${
          playlistId === "liked" 
            ? "from-[#512da8] to-[#121212]" 
            : "from-[#535353] to-[#121212]"
        }`}
      >
        {/* Cover Art Box */}
        {playlistId === "liked" ? (
          <div className="flex h-48 w-48 shrink-0 items-center justify-center rounded bg-gradient-to-br from-[#450af5] to-[#c4b1fc] text-white shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <svg
              role="img"
              height="64"
              width="64"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.083.083 0 0 1-.14-.057V1.13A4.27 4.27 0 0 0 4.808.814a4.313 4.313 0 0 0-3.532 3.407c-.1.574-.08 1.161.059 1.719a7.652 7.652 0 0 0 2.215 3.86l4.28 4.215a.302.302 0 0 0 .44 0l4.28-4.215a7.652 7.652 0 0 0 2.215-3.86c.139-.558.159-1.145.059-1.719z" />
            </svg>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditModalOpen(true)}
            className="group relative flex h-48 w-48 shrink-0 cursor-pointer items-center justify-center rounded bg-[#282828] text-[#b3b3b3] shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:bg-[#303030] transition duration-200"
          >
            <Music size={64} className="group-hover:hidden" />
            <div className="hidden absolute inset-0 bg-black/50 flex-col items-center justify-center text-white group-hover:flex">
              <svg
                role="img"
                height="48"
                width="48"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.318 1.975a3.43 3.43 0 0 0-2.435-1.007c-.917 0-1.785.358-2.434 1.007L1.513 12.912a3.432 3.432 0 0 0-1.008 2.439v5.21c0 .917.358 1.786 1.008 2.435.649.65 1.517 1.008 2.434 1.008h5.21c.918 0 1.786-.358 2.435-1.008l10.936-10.938a3.432 3.432 0 0 0 1.008-2.434 3.437 3.437 0 0 0-1.008-2.438L17.318 1.975zm-1.06 1.061c.365.365.567.852.567 1.376 0 .524-.202 1.011-.567 1.376l-1.42 1.42-2.752-2.752 1.42-1.42a1.942 1.942 0 0 1 2.752 0zm-5.232 2.497l2.752 2.752L5.27 16.792l-2.752-2.752 8.508-8.507zm-7.618 10.14L6.16 18.423l-2.029.507.507-2.029z" />
              </svg>
              <span className="text-[12px] font-bold mt-2">Choose photo</span>
            </div>
          </div>
        )}

        {/* Info Area */}
        <div className="flex flex-col gap-2 min-w-0">
          <span className="text-[12px] font-bold uppercase tracking-wider text-white">
            {playlistId === "liked" ? "Private Playlist" : (playlist.isPublic ? "Public Playlist" : "Private Playlist")}
          </span>
          <h1 
            onClick={() => playlistId !== "liked" && setIsEditModalOpen(true)}
            className={`text-5xl md:text-7xl font-extrabold text-[#ffffff] tracking-tight py-1 truncate ${
              playlistId !== "liked" ? "cursor-pointer hover:underline" : ""
            }`}
          >
            {playlist.name}
          </h1>
          <p className="text-[14px] text-[#b3b3b3] font-normal leading-normal line-clamp-2 mt-1">
            {playlist.description || (playlistId === "liked" ? "Your personal liked songs." : "No description. Tap to edit details.")}
          </p>
          <div className="flex items-center gap-1.5 text-[14px] font-bold mt-2 text-white">
            <span className="hover:underline cursor-pointer">{playlist.creator}</span>
            {playlist.songs.length > 0 && (
              <>
                <span className="text-[#b3b3b3] font-normal">•</span>
                <span>{playlist.songs.length} {playlist.songs.length === 1 ? "song" : "songs"},</span>
                <span className="text-[#b3b3b3] font-normal">{formatTotalDuration(totalDurationSeconds)}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Actions Control Bar */}
      <div className="flex items-center gap-6 px-6 py-6 bg-black/20">
        {/* Play Circle button */}
        <button
          onClick={handlePlayPlaylist}
          disabled={playlist.songs.length === 0}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1ed760] text-black hover:scale-104 active:scale-98 transition duration-100 shadow-md hover:bg-[#1fdf64] disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
        >
          {isPlaylistPlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" className="ml-1" />
          )}
        </button>

        {/* More Actions Options */}
        {playlistId !== "liked" && (
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#b3b3b3] hover:text-white transition"
            >
              <MoreHorizontal size={28} />
            </button>

            {/* More actions context menu */}
            {showMoreMenu && (
              <div className="absolute left-0 mt-2 z-[999] w-[180px] rounded bg-[#282828] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-[#3e3e3e]/30">
                <button
                  onClick={() => {
                    setIsEditModalOpen(true);
                    setShowMoreMenu(false);
                  }}
                  className="flex w-full px-3 py-2 text-left text-[14px] font-semibold text-white hover:bg-white/10"
                >
                  Edit details
                </button>
                <button
                  onClick={() => {
                    deletePlaylist(playlist.id);
                    setShowMoreMenu(false);
                  }}
                  className="flex w-full px-3 py-2 text-left text-[14px] font-semibold text-white hover:bg-white/10"
                >
                  Delete playlist
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tracklist Table */}
      <div className="px-6">
        {playlist.songs.length > 0 ? (
          <table className="w-full text-left border-collapse text-[#b3b3b3] font-sans">
            <thead>
              <tr className="border-b border-[#282828] text-[12px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 w-12 text-center">#</th>
                <th className="py-2.5">Title</th>
                <th className="py-2.5 hidden md:table-cell">Album</th>
                <th className="py-2.5 w-16 text-center">
                  <Clock size={16} className="mx-auto" />
                </th>
                <th className="py-2.5 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {playlist.songs.map((song, index) => {
                const isTrackActive = activeTrack?.id === song.id;
                const isTrackPlaying = isTrackActive && isPlaying;
                return (
                  <tr
                    key={song.id}
                    onContextMenu={(e) => handleContextMenu(e, song)}
                    className="group hover:bg-white/10 rounded-md transition duration-100 cursor-pointer"
                  >
                    {/* Index or Play on hover */}
                    <td 
                      onClick={() => playTrack(song, playlist.songs)}
                      className="py-3 text-center text-[14px] font-medium w-12"
                    >
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

                    {/* Cover art + Title & Artist */}
                    <td className="py-2">
                      <div className="flex items-center gap-3">
                        <SafeImage
                          src={song.coverUrl}
                          alt={song.title}
                          fallbackTitle={song.title}
                          className="h-10 w-10 object-cover rounded"
                        />
                        <div className="min-w-0">
                          <p className={`text-[14px] font-bold truncate ${isTrackActive ? "text-[#1ed760]" : "text-white"}`}>
                            {song.title}
                          </p>
                          <p 
                            onClick={(e) => {
                              e.stopPropagation();
                              setView(`artist_${song.artist}`);
                            }}
                            className="text-[12px] text-[#b3b3b3] group-hover:text-white hover:underline truncate mt-0.5"
                          >
                            {song.artist}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Album */}
                    <td className="py-3 hidden md:table-cell text-[14px] font-normal truncate max-w-[200px]">
                      {song.album}
                    </td>

                    {/* Duration */}
                    <td className="py-3 text-[14px] font-normal text-center w-16">
                      {song.duration}
                    </td>

                    {/* Remove button */}
                    <td className="py-3 text-center w-12">
                      {playlistId !== "liked" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSongFromPlaylist(playlist.id, song.id);
                          }}
                          className="hidden group-hover:block text-[#b3b3b3] hover:text-white transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          /* Empty Playlist Placeholder */
          <div className="border-t border-[#282828] pt-12 pb-8 text-center text-[#b3b3b3]">
            <Music size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-[14px] font-semibold text-white">Your playlist is empty.</p>
            {playlistId !== "liked" && <p className="text-[12px] mt-1">Add songs from the suggestions below.</p>}
          </div>
        )}
      </div>

      {/* Suggested Tracks Section */}
      {playlistId !== "liked" && (
        <div className="mt-8 px-6 border-t border-[#282828]/50 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[18px] font-bold text-white tracking-tight">Let's find something for your playlist</h3>
            </div>
            <button
              onClick={() => setLocalSearch("")}
              className="text-[#b3b3b3] hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Suggested Search Input */}
          <div className="relative flex items-center h-10 w-full max-w-[400px] rounded bg-[#2a2a2a] px-3.5 hover:bg-[#333] focus-within:ring-1 focus-within:ring-white transition mb-6">
            <Search size={18} className="text-[#b3b3b3]" />
            <input
              type="text"
              placeholder="Search for songs or artists..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full h-full pl-3 bg-transparent text-[13px] text-white placeholder-[#b3b3b3] focus:outline-hidden font-sans font-medium"
            />
          </div>

          {/* Suggestion List */}
          <div className="flex flex-col gap-1.5 max-w-[800px]">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-white/5 group transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <SafeImage
                      src={song.coverUrl}
                      alt={song.title}
                      fallbackTitle={song.title}
                      className="h-10 w-10 object-cover rounded shrink-0 shadow-sm"
                    />
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-white truncate">{song.title}</p>
                      <p 
                        onClick={() => setView(`artist_${song.artist}`)}
                        className="text-[12px] text-[#b3b3b3] group-hover:text-white hover:underline cursor-pointer truncate mt-0.5"
                      >
                        {song.artist}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:inline text-[13px] text-[#b3b3b3] font-normal truncate max-w-[150px]">
                      {song.album}
                    </span>
                    <button
                      onClick={() => addSongToPlaylist(playlist.id, song)}
                      className="flex items-center gap-1.5 rounded-full border border-[#7c7c7c] hover:border-white px-3.5 py-1 text-[12px] font-bold text-white hover:scale-104 active:scale-98 transition duration-100 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[13px] text-[#b3b3b3] py-2">No matching song suggestions found.</p>
            )}
          </div>
        </div>
      )}

      {/* Horizon AI Suggestions section - Only for custom playlists, not liked songs */}
      {playlistId !== "liked" && (
        <div className="mx-6 mt-12 p-6 rounded-xl bg-gradient-to-br from-[#122218] to-[#121212] border border-[#1ed760]/15 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#1ed760]">
              <Sparkles size={18} className="animate-pulse" />
              <h3 className="text-[18px] font-bold text-white tracking-tight">Horizon AI Discovery Suggestions</h3>
            </div>
            <button
              onClick={fetchHorizonSuggestions}
              disabled={loadingSuggestions}
              className="p-1.5 text-[#b3b3b3] hover:text-white hover:bg-white/5 rounded-full transition cursor-pointer"
              title="Refresh AI suggestions"
            >
              <RefreshCw size={16} className={`${loadingSuggestions ? "animate-spin" : ""}`} />
            </button>
          </div>
          <p className="text-[12px] text-[#b3b3b3] mb-6 leading-relaxed">
            Unfamiliar tracks handpicked by the Horizon engine matching your active context routines and appetite settings. Click the play button to preview from its peak chorus hook!
          </p>

          <div className="flex flex-col gap-3">
            {loadingSuggestions ? (
              <div className="flex flex-col gap-2 py-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 w-full bg-[#181818] rounded-md animate-pulse" />
                ))}
              </div>
            ) : horizonSuggestions.length > 0 ? (
              horizonSuggestions.map((song) => {
                const isCurrentActive = activeTrack?.id === song.id;
                const isCurrentPlaying = isCurrentActive && isPlaying;
                return (
                  <div
                    key={`horizon-sugg-${song.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#181818]/60 hover:bg-[#181818] border border-white/5 hover:border-white/10 transition group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Play Preview Hook trigger */}
                      <div className="relative h-11 w-11 shrink-0 rounded overflow-hidden shadow bg-[#282828]">
                        <SafeImage
                          src={song.coverUrl}
                          alt={song.title}
                          fallbackTitle={song.title}
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => playTrack(song, [song], song.preview_offset || 0)}
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-150 text-[#1ed760]"
                        >
                          {isCurrentPlaying ? (
                            <Pause size={16} fill="currentColor" />
                          ) : (
                            <Play size={16} fill="currentColor" className="ml-0.5" />
                          )}
                        </button>
                      </div>

                      <div className="min-w-0 flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-[14px] font-bold text-white truncate">{song.title}</p>
                          {song.reason && (
                            <span className="text-[9px] bg-[#1ed760]/10 border border-[#1ed760]/20 text-[#1ed760] font-bold px-1.5 py-0.5 rounded tracking-wide shrink-0">
                              {song.reason}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#b3b3b3] truncate">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Preview Badge */}
                      {song.preview_offset !== undefined && (
                        <span className="hidden sm:inline text-[10px] text-[#7c7c7c] border border-white/5 px-2 py-0.5 rounded font-medium">
                          Chorus @ {Math.floor(song.preview_offset)}s
                        </span>
                      )}

                      {/* Add Song */}
                      <button
                        onClick={() => {
                          addSongToPlaylist(playlist.id, song);
                          setHorizonSuggestions(prev => prev.filter(s => s.id !== song.id));
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-white hover:bg-white/10 text-white transition cursor-pointer"
                        title="Add to playlist"
                      >
                        <Plus size={16} />
                      </button>

                      {/* Reject Song */}
                      <button
                        onClick={() => setHorizonSuggestions(prev => prev.filter(s => s.id !== song.id))}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:border-red-400/50 hover:bg-red-500/10 text-[#b3b3b3] hover:text-red-400 transition cursor-pointer"
                        title="Dismiss suggestion"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-[#7c7c7c] border border-dashed border-white/5 rounded-xl">
                <p className="text-[12px]">All suggested tracks added or dismissed.</p>
                <p className="text-[10px] mt-1">Tap the refresh icon to scan for more discoveries.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Details Overlay modal */}
      {playlistId !== "liked" && (
        <EditDetailsModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          playlist={playlist}
          onSave={updatePlaylist}
        />
      )}

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
