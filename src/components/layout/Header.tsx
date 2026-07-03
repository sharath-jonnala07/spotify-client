"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSpotify } from "@/context/SpotifyContext";
import { Bell, ArrowDownCircle, Search, X } from "lucide-react";
import Image from "next/image";

export default function Header() {
  const { currentView, setView, searchQuery, setSearchQuery } = useSpotify();
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex h-16 w-full items-center justify-between bg-black px-6 text-white select-none">
      {/* Left Area: Logo */}
      <div 
        className="flex items-center cursor-pointer" 
        onClick={() => setView("home")}
      >
        <Image
          src="/spotify-logo.svg"
          alt="Spotify"
          width={100}
          height={32}
          priority
          className="h-8 w-auto filter brightness-0 invert" // Make logo white like the production web player
        />
      </div>

      {/* Middle Area: Home & Search Bar */}
      <div className="flex flex-1 max-w-[480px] mx-8 items-center gap-2">
        {/* Home Button */}
        <button
          onClick={() => setView("home")}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1f1f1f] text-white hover:scale-104 active:scale-98 transition duration-150 hover:bg-[#2a2a2a] ${
            currentView === "home" ? "ring-1 ring-white/10" : ""
          }`}
          title="Home"
        >
          <svg
            role="img"
            height="22"
            width="22"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {currentView === "home" ? (
              // Filled Home Icon
              <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33z" />
            ) : (
              // Outline Home Icon
              <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
            )}
          </svg>
        </button>

        {/* Search input container */}
        <div className="relative flex flex-1 items-center h-12 rounded-full bg-[#1f1f1f] hover:bg-[#242424] hover:ring-1 hover:ring-white/10 focus-within:ring-2 focus-within:ring-white focus-within:bg-[#1f1f1f] transition group">
          <div className="absolute left-4 text-[#b3b3b3] group-focus-within:text-white">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="What do you want to play?"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (currentView !== "search" && e.target.value.trim() !== "") {
                setView("search");
              } else if (e.target.value.trim() === "" && currentView === "search") {
                setView("home");
              }
            }}
            className="w-full h-full pl-12 pr-12 rounded-full bg-transparent text-[14px] text-white placeholder-[#7c7c7c] focus:outline-hidden font-sans font-medium"
          />
          {/* Clear search when typed */}
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery("");
                setView("home");
              }}
              className="absolute right-12 text-[#b3b3b3] hover:text-white"
            >
              <X size={16} />
            </button>
          )}
          {/* Browse Icon at end */}
          <button className="absolute right-4 text-[#b3b3b3] hover:text-white border-l border-white/10 pl-3">
            <svg
              role="img"
              height="20"
              width="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15 4H9v2h6V4zm2 4H7v2h10V8zm2 4H5v2h14v-2zM3 16h18v2H3v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Right Area: Buttons */}
      <div className="flex items-center gap-4 relative">
        {/* Explore Premium */}
        <button 
          onClick={() => alert("Explore Premium: Access offline downloads and ad-free music!")}
          className="hidden md:block rounded-full bg-white px-4 py-2 text-[14px] font-bold text-black hover:scale-104 active:scale-98 transition cursor-pointer"
        >
          Explore Premium
        </button>

        {/* Install App */}
        <button 
          onClick={() => alert("Install App: Download Spotify Desktop app for local media playback and global hotkeys!")}
          className="hidden sm:flex items-center gap-1.5 rounded-full px-4 py-2 text-[14px] font-bold text-white hover:scale-104 active:scale-98 transition hover:bg-white/10 cursor-pointer"
        >
          <ArrowDownCircle size={16} />
          Install App
        </button>

        {/* Bell Icon */}
        <div ref={notificationsRef} className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`flex h-10 w-10 items-center justify-center rounded-full text-[#b3b3b3] hover:text-white hover:bg-[#1f1f1f] transition duration-150 ${
              showNotifications ? "bg-[#1f1f1f] text-white" : ""
            }`}
          >
            <Bell size={20} />
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 z-[999] w-[300px] rounded bg-[#282828] p-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-[#3e3e3e]/30">
              <h4 className="font-bold text-[15px] mb-3 text-white">What's New</h4>
              <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
                <div className="flex flex-col gap-1 text-[12px] border-b border-[#3e3e3e]/30 pb-2">
                  <p className="text-white font-semibold">New Release from Arijit Singh</p>
                  <p className="text-[#b3b3b3]">Listen to the latest romantic single, streaming now!</p>
                  <span className="text-[10px] text-[#7c7c7c]">2 hours ago</span>
                </div>
                <div className="flex flex-col gap-1 text-[12px]">
                  <p className="text-white font-semibold">Your Weekly Playlist is Ready</p>
                  <p className="text-[#b3b3b3]">We've updated your custom recommendations based on your tastes.</p>
                  <span className="text-[10px] text-[#7c7c7c]">1 day ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div ref={profileRef} className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fa6635] text-[14px] font-bold text-black hover:scale-104 transition cursor-pointer"
          >
            S
          </button>
          
          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 z-[999] w-[180px] rounded bg-[#282828] p-1 shadow-[0_8px_24px_rgba(0,0,0,0.5)] border border-[#3e3e3e]/30">
              <button 
                onClick={() => alert("Account page: Profile Settings")}
                className="flex w-full px-3 py-2 text-left text-[13px] font-semibold text-white hover:bg-white/10 rounded-sm"
              >
                Account
              </button>
              <button 
                onClick={() => setView("playlist_liked")}
                className="flex w-full px-3 py-2 text-left text-[13px] font-semibold text-white hover:bg-white/10 rounded-sm"
              >
                Profile
              </button>
              <button 
                onClick={() => alert("Settings page")}
                className="flex w-full px-3 py-2 text-left text-[13px] font-semibold text-white hover:bg-white/10 rounded-sm"
              >
                Settings
              </button>
              <div className="my-1 border-t border-[#3e3e3e]/50" />
              <button 
                onClick={() => alert("Logged out successfully!")}
                className="flex w-full px-3 py-2 text-left text-[13px] font-semibold text-white hover:bg-white/10 rounded-sm"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
