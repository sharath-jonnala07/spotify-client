"use client";

import React, { useState } from "react";
import { useSpotify, Playlist } from "@/context/SpotifyContext";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Player from "@/components/layout/Player";
import HomeFeed from "@/components/layout/HomeFeed";
import PlaylistDetail from "@/components/playlist/PlaylistDetail";
import EditDetailsModal from "@/components/playlist/EditDetailsModal";
import QueuePanel from "@/components/layout/QueuePanel";
import ArtistDetail from "@/components/artist/ArtistDetail";
import OnboardingModal from "@/components/ui/OnboardingModal";
import { Home, Search, Library, Plus, Music } from "lucide-react";

export default function Page() {
  const { currentView, setView, playlists, createPlaylist, updatePlaylist, showQueue } = useSpotify();
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

  // Helper to render the primary main viewport
  const renderMainContent = () => {
    if (currentView === "home") {
      return <HomeFeed />;
    }
    
    if (currentView === "search") {
      return <HomeFeed />;
    }

    if (currentView.startsWith("artist_")) {
      const artistName = currentView.replace("artist_", "");
      return <ArtistDetail artistName={decodeURIComponent(artistName)} />;
    }
    
    if (currentView.startsWith("playlist_")) {
      const playlistId = currentView.replace("playlist_", "");
      return (
        <PlaylistDetail
          playlistId={playlistId}
          onEditPlaylist={(p) => setEditingPlaylist(p)}
        />
      );
    }

    // Mobile specific Library tab view
    if (currentView === "library") {
      return (
        <div className="flex-1 bg-[#121212] overflow-y-auto px-6 pt-6 pb-24 font-sans select-none">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[24px] font-bold text-white tracking-tight">Your Library</h2>
            <button
              onClick={createPlaylist}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f1f1f] text-white hover:bg-[#2a2a2a] transition cursor-pointer"
            >
              <Plus size={20} />
            </button>
          </div>

          {playlists.length === 0 ? (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 rounded-lg bg-[#1f1f1f] p-5 shadow-sm">
                <h4 className="font-bold text-[14px] text-white">Create your first playlist</h4>
                <p className="text-[12px] text-white font-normal leading-normal">It's easy, we'll help you</p>
                <button
                  onClick={createPlaylist}
                  className="w-fit rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-black hover:scale-104 active:scale-98 transition duration-100 cursor-pointer"
                >
                  Create playlist
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => setView(`playlist_${playlist.id}`)}
                  className="flex flex-col gap-3 rounded-lg bg-[#181818] p-4 hover:bg-[#242424] cursor-pointer transition duration-300"
                >
                  <div className="flex aspect-square w-full items-center justify-center rounded bg-[#282828] text-white shadow-md">
                    <Music size={40} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-white truncate">{playlist.name}</h4>
                    <p className="text-[12px] text-[#b3b3b3] truncate mt-1">Playlist • {playlist.creator}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <HomeFeed />;
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-black text-white select-none">
      {/* Top Header */}
      <Header />

      {/* Onboarding Preference Overlay */}
      <OnboardingModal />

      {/* Main Container */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Sidebar - Hidden on mobile (<768px) */}
        <div className="hidden md:block">
          <Sidebar onEditPlaylist={(p) => setEditingPlaylist(p)} />
        </div>

        {/* Center Main Content Area */}
        <main className="flex flex-1 flex-col overflow-hidden bg-[#121212] md:rounded-lg md:mr-2 md:mb-2">
          {renderMainContent()}
        </main>

        {/* Right Sidebar Queue Panel - Hidden on mobile (<768px) */}
        {showQueue && (
          <div className="hidden md:block md:mr-2 md:mb-2 md:rounded-lg overflow-hidden">
            <QueuePanel />
          </div>
        )}
      </div>

      {/* Bottom Audio Player Bar */}
      <div className="pb-[60px] md:pb-0">
        <Player />
      </div>

      {/* Mobile Bottom Navigation - Visible only on mobile (<768px) */}
      <nav className="fixed bottom-0 left-0 right-0 z-[1000] flex h-[60px] items-center justify-around bg-black border-t border-[#121212] md:hidden">
        <button
          onClick={() => setView("home")}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition duration-150 cursor-pointer ${
            currentView === "home" ? "text-white" : "text-[#b3b3b3]"
          }`}
        >
          <Home size={20} />
          <span>Home</span>
        </button>
        <button
          onClick={() => setView("search")}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition duration-150 cursor-pointer ${
            currentView === "search" ? "text-white" : "text-[#b3b3b3]"
          }`}
        >
          <Search size={20} />
          <span>Search</span>
        </button>
        <button
          onClick={() => setView("library")}
          className={`flex flex-col items-center gap-1 text-[10px] font-bold transition duration-150 cursor-pointer ${
            currentView === "library" ? "text-white" : "text-[#b3b3b3]"
          }`}
        >
          <Library size={20} />
          <span>Your Library</span>
        </button>
      </nav>

      {/* Sidebar Edit Details Modal connector */}
      {editingPlaylist && (
        <EditDetailsModal
          isOpen={!!editingPlaylist}
          onClose={() => setEditingPlaylist(null)}
          playlist={editingPlaylist}
          onSave={(id, name, desc) => {
            updatePlaylist(id, name, desc);
          }}
        />
      )}
    </div>
  );
}
