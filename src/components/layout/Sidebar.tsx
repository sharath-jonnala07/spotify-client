"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSpotify, Playlist } from "@/context/SpotifyContext";
import { PlusIcon, LibraryIcon } from "../ui/SpotifyIcons";
import { Music, Search, List, ChevronRight, Pin } from "lucide-react";

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  playlist: Playlist | null;
}

export default function Sidebar({ onEditPlaylist }: { onEditPlaylist: (playlist: Playlist) => void }) {
  const { playlists, currentView, setView, createPlaylist, deletePlaylist, likedSongs } = useSpotify();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    playlist: null
  });

  const [showPlusMenu, setShowPlusMenu] = useState<boolean>(false);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target as Node)) {
        setShowPlusMenu(false);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePlaylistRightClick = (e: React.MouseEvent, playlist: Playlist) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      playlist
    });
  };

  const handleCreatePlaylistClick = () => {
    createPlaylist();
    setShowPlusMenu(false);
  };

  const handleContextMenuAction = (action: string) => {
    if (!contextMenu.playlist) return;
    
    if (action === "delete") {
      deletePlaylist(contextMenu.playlist.id);
    } else if (action === "edit") {
      onEditPlaylist(contextMenu.playlist);
    }
    setContextMenu({ visible: false, x: 0, y: 0, playlist: null });
  };

  const hasItems = playlists.length > 0 || likedSongs.length > 0;

  return (
    <aside className={`flex h-full flex-col gap-2 bg-black p-2 text-white shrink-0 font-sans select-none transition-all duration-300 ${isCollapsed ? "w-[72px]" : "w-[360px]"}`}>
      {/* Your Library Panel */}
      <div className="flex flex-1 flex-col rounded-lg bg-[#121212] overflow-hidden">
        {/* Panel Header */}
        <div className={`flex items-center justify-between px-5 pt-5 pb-3 ${isCollapsed ? "justify-center px-2" : ""}`}>
          <div 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-3 text-[#b3b3b3] hover:text-white cursor-pointer transition duration-200"
            title={isCollapsed ? "Expand Your Library" : "Collapse Your Library"}
          >
            <LibraryIcon size={24} />
            {!isCollapsed && <span className="font-bold text-[16px]">Your Library</span>}
          </div>

          {!isCollapsed && (
            <div className="relative">
              <button
                onClick={() => setShowPlusMenu((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#1f1f1f] transition"
              >
                <PlusIcon size={16} />
              </button>

              {/* Plus Dropdown Menu */}
              {showPlusMenu && (
                <div
                  ref={plusMenuRef}
                  className="absolute right-0 mt-2 z-[999] w-[180px] rounded bg-[#282828] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-[#3e3e3e]/30"
                >
                  <button
                    onClick={handleCreatePlaylistClick}
                    className="flex w-full items-center gap-2 rounded-xs px-3 py-2.5 text-left text-[14px] font-semibold text-white hover:bg-white/10"
                  >
                    <Music size={16} />
                    <span>Create playlist</span>
                  </button>
                  <button
                    onClick={() => setShowPlusMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xs px-3 py-2.5 text-left text-[14px] font-semibold text-white hover:bg-white/10"
                  >
                    <svg
                      role="img"
                      height="16"
                      width="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M1 2.75A1.75 1.75 0 0 1 2.75 1h10.5A1.75 1.75 0 0 1 15 2.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75zm1.75-.25a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25H2.75z" />
                    </svg>
                    <span>Create folder</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Playlists Filter Chip (Shows only when expanded and playlists exist) */}
        {!isCollapsed && playlists.length > 0 && (
          <div className="px-5 pb-3">
            <button className="rounded-full bg-[#2a2a2a] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#343434] transition">
              Playlists
            </button>
          </div>
        )}

        {/* Main List Area */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          {!hasItems ? (
            /* Empty State Banners (Only when expanded) */
            !isCollapsed ? (
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-3 rounded-lg bg-[#1f1f1f] p-5 shadow-sm">
                  <h4 className="font-bold text-[14px] text-white">Create your first playlist</h4>
                  <p className="text-[12px] text-white font-normal leading-normal">It's easy, we'll help you</p>
                  <button
                    onClick={createPlaylist}
                    className="w-fit rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-black hover:scale-104 active:scale-98 transition duration-100"
                  >
                    Create playlist
                  </button>
                </div>

                <div className="flex flex-col gap-3 rounded-lg bg-[#1f1f1f] p-5 shadow-sm">
                  <h4 className="font-bold text-[14px] text-white">Let's find some podcasts to follow</h4>
                  <p className="text-[12px] text-white font-normal leading-normal">We'll keep you updated on new episodes</p>
                  <button className="w-fit rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-black hover:scale-104 active:scale-98 transition duration-100">
                    Browse podcasts
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 py-6">
                <button
                  onClick={createPlaylist}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1f1f] text-white hover:bg-[#282828] transition"
                  title="Create Playlist"
                >
                  <PlusIcon size={16} />
                </button>
              </div>
            )
          ) : (
            /* Playlist List */
            <div className="flex flex-col">
              {/* List Search & Filter Header */}
              {!isCollapsed && (
                <div className="flex items-center justify-between px-3 py-1 text-[#b3b3b3]">
                  <button className="p-1.5 rounded-full hover:bg-white/10 hover:text-white transition">
                    <Search size={16} />
                  </button>
                  <button className="flex items-center gap-1 text-[13px] font-medium hover:text-white transition">
                    <span>Recents</span>
                    <List size={16} />
                  </button>
                </div>
              )}

              {/* Items */}
              <div className="flex flex-col gap-1.5 mt-2">
                {/* Liked Songs virtual playlist */}
                {likedSongs.length > 0 && (
                  <div
                    onClick={() => setView("playlist_liked")}
                    className={`group flex items-center gap-3 rounded-md p-2 cursor-pointer transition duration-100 ${
                      currentView === "playlist_liked"
                        ? "bg-[#282828] text-white"
                        : "hover:bg-[#1a1a1a] text-[#b3b3b3] hover:text-white"
                    } ${isCollapsed ? "justify-center" : ""}`}
                    title="Liked Songs"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-gradient-to-br from-[#450af5] to-[#c4b1fc] text-white shadow-md">
                      <svg
                        role="img"
                        height="18"
                        width="18"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M15.724 4.22A4.313 4.313 0 0 0 12.192.814a4.269 4.269 0 0 0-3.622 1.13.083.083 0 0 1-.14-.057V1.13A4.27 4.27 0 0 0 4.808.814a4.313 4.313 0 0 0-3.532 3.407c-.1.574-.08 1.161.059 1.719a7.652 7.652 0 0 0 2.215 3.86l4.28 4.215a.302.302 0 0 0 .44 0l4.28-4.215a7.652 7.652 0 0 0 2.215-3.86c.139-.558.159-1.145.059-1.719z" />
                      </svg>
                    </div>

                    {!isCollapsed && (
                      <div className="flex-1 min-w-0 animate-fade-in">
                        <h4 className={`text-[14px] font-bold truncate ${currentView === "playlist_liked" ? "text-[#1ed760]" : "text-white"}`}>
                          Liked Songs
                        </h4>
                        <p className="text-[12px] text-[#b3b3b3] truncate mt-0.5 font-normal">
                          Playlist • {likedSongs.length} {likedSongs.length === 1 ? "song" : "songs"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Playlists */}
                {playlists.map((playlist) => {
                  const isCurrent = currentView === `playlist_${playlist.id}`;
                  return (
                    <div
                      key={playlist.id}
                      onClick={() => setView(`playlist_${playlist.id}`)}
                      onContextMenu={(e) => handlePlaylistRightClick(e, playlist)}
                      className={`group flex items-center gap-3 rounded-md p-2 cursor-pointer transition duration-100 ${
                        isCurrent 
                          ? "bg-[#282828] text-white" 
                          : "hover:bg-[#1a1a1a] text-[#b3b3b3] hover:text-white"
                      } ${isCollapsed ? "justify-center" : ""}`}
                      title={playlist.name}
                    >
                      {/* Image Cover */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-[#282828] text-[#b3b3b3] hover:text-white shadow-md">
                        <Music size={20} />
                      </div>

                      {/* Text details */}
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-[14px] font-bold truncate ${isCurrent ? "text-[#1ed760]" : "text-white"}`}>
                            {playlist.name}
                          </h4>
                          <p className="text-[12px] text-[#b3b3b3] truncate mt-0.5 font-normal">
                            Playlist • {playlist.creator}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right-click Context Menu */}
      {contextMenu.visible && !isCollapsed && (
        <div
          ref={contextMenuRef}
          className="fixed z-[9999] w-[220px] rounded bg-[#282828] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-[#3e3e3e]/30 font-sans"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`
          }}
        >
          <button
            onClick={() => handleContextMenuAction("remove")}
            className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-[13px] font-semibold text-white hover:bg-white/10"
          >
            <span>Remove from profile</span>
          </button>
          
          <button
            onClick={() => handleContextMenuAction("edit")}
            className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-[13px] font-semibold text-white hover:bg-white/10"
          >
            <span>Edit details</span>
          </button>

          <button
            onClick={() => handleContextMenuAction("delete")}
            className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-[13px] font-semibold text-white hover:bg-white/10"
          >
            <span>Delete</span>
          </button>

          <div className="my-1 border-t border-[#3e3e3e]/50" />

          <button
            onClick={handleCreatePlaylistClick}
            className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-[13px] font-semibold text-white hover:bg-white/10"
          >
            <span>Create playlist</span>
          </button>

          <button
            onClick={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
            className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-[13px] font-semibold text-white hover:bg-white/10"
          >
            <span>Create folder</span>
          </button>
        </div>
      )}
    </aside>
  );
}
