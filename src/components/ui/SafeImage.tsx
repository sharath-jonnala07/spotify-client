import React, { useState } from "react";
import { Music } from "lucide-react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackIcon?: React.ReactNode;
}

// Generate a beautiful, stable gradient based on the song title/artist name hash
const getGradientForString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    "from-emerald-900 to-teal-950",
    "from-purple-900 to-indigo-950",
    "from-rose-900 to-pink-950",
    "from-amber-900 to-orange-950",
    "from-blue-900 to-slate-950",
    "from-cyan-900 to-blue-950",
    "from-violet-900 to-purple-950",
    "from-fuchsia-900 to-pink-950",
  ];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function SafeImage({ 
  src, 
  alt, 
  className, 
  fallbackTitle, 
  fallbackIcon, 
  ...props 
}: SafeImageProps) {
  const [error, setError] = useState(false);

  // Intercept empty URLs, load errors, or legacy Unsplash placeholding URLs
  if (error || !src || (typeof src === "string" && src.includes("unsplash.com"))) {
    const gradientClass = getGradientForString(fallbackTitle || alt || "default");
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br ${gradientClass} text-white/70 select-none ${className}`}
        title={fallbackTitle || alt}
      >
        {fallbackIcon || <Music className="opacity-60" style={{ width: "35%", height: "35%" }} />}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
