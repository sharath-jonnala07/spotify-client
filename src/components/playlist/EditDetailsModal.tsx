"use client";

import React, { useState, useEffect } from "react";
import { Playlist } from "@/context/SpotifyContext";
import { Music, X } from "lucide-react";

interface EditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist;
  onSave: (id: string, name: string, description: string) => void;
}

export default function EditDetailsModal({
  isOpen,
  onClose,
  playlist,
  onSave
}: EditDetailsModalProps) {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description || "");

  useEffect(() => {
    if (isOpen) {
      setName(playlist.name);
      setDescription(playlist.description || "");
    }
  }, [isOpen, playlist]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(playlist.id, name, description);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-[524px] rounded-lg bg-[#282828] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[22px] font-bold font-sans tracking-tight">Edit details</h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full p-1.5 text-[#b3b3b3] hover:bg-white/10 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4">
            {/* Image Placeholder */}
            <div className="group relative flex h-[180px] w-[180px] shrink-0 cursor-pointer items-center justify-center rounded bg-[#333333] text-[#b3b3b3] shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:bg-[#383838] transition duration-200">
              <Music size={48} className="group-hover:hidden" />
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
                <span className="text-[12px] font-bold mt-2 font-sans">Choose photo</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="flex flex-col flex-1 gap-3">
              {/* Name input */}
              <div className="relative flex flex-col">
                <input
                  type="text"
                  placeholder="Add a name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded bg-[#3e3e3e] px-3 pt-6 pb-1.5 text-[14px] text-white placeholder-white/30 border border-transparent focus:border-[#7c7c7c] focus:outline-hidden transition"
                  id="playlist-name-input"
                />
                <label
                  htmlFor="playlist-name-input"
                  className="absolute top-1.5 left-3 text-[10px] font-bold text-[#b3b3b3] uppercase tracking-wider"
                >
                  Name
                </label>
              </div>

              {/* Description input */}
              <div className="relative flex flex-col flex-1">
                <textarea
                  placeholder="Add an optional description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-full rounded bg-[#3e3e3e] px-3 pt-6 pb-2 text-[14px] text-white placeholder-white/30 border border-transparent focus:border-[#7c7c7c] focus:outline-hidden resize-none min-h-[96px] transition"
                  id="playlist-desc-input"
                />
                <label
                  htmlFor="playlist-desc-input"
                  className="absolute top-1.5 left-3 text-[10px] font-bold text-[#b3b3b3] uppercase tracking-wider"
                >
                  Description
                </label>
              </div>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="flex justify-end gap-3 mt-2">
            <button
              type="submit"
              className="rounded-full bg-white px-8 py-3 text-[14px] font-bold text-black hover:scale-104 active:scale-98 transition duration-100"
            >
              Save
            </button>
          </div>
        </form>

        <p className="text-[11px] text-[#b3b3b3] mt-3 font-sans leading-relaxed">
          By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.
        </p>
      </div>
    </div>
  );
}
