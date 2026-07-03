import { create } from "zustand";

export interface Song {
  id: string;
  spotify_id?: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  image_url?: string;
}

interface PlayerState {
  activeTrack: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Song[];
  currentQueueIndex: number;
  shuffle: boolean;
  repeat: boolean;

  setTrack: (track: Song | null) => void;
  setPlaying: (playing: boolean) => void;
  setVolume: (vol: number) => void;
  setProgress: (prog: number) => void;
  setDuration: (dur: number) => void;
  setQueue: (tracks: Song[]) => void;
  addToQueue: (track: Song) => void;
  removeFromQueue: (trackId: string) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  activeTrack: null,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  queue: [],
  currentQueueIndex: -1,
  shuffle: false,
  repeat: false,

  setTrack: (track) => {
    const queue = get().queue;
    let index = -1;
    if (track) {
      index = queue.findIndex((s) => s.id === track.id);
      if (index === -1) {
        // Add to queue
        const newQueue = [...queue, track];
        index = newQueue.length - 1;
        set({ queue: newQueue, currentQueueIndex: index, activeTrack: track, progress: 0 });
      } else {
        set({ currentQueueIndex: index, activeTrack: track, progress: 0 });
      }
    } else {
      set({ activeTrack: null, isPlaying: false, progress: 0 });
    }
  },

  setPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (vol) => set({ volume: vol }),
  setProgress: (prog) => set({ progress: prog }),
  setDuration: (dur) => set({ duration: dur }),
  
  setQueue: (tracks) => {
    const activeTrack = get().activeTrack;
    const index = activeTrack ? tracks.findIndex((s) => s.id === activeTrack.id) : -1;
    set({ queue: tracks, currentQueueIndex: index });
  },
  
  addToQueue: (track) => {
    const queue = get().queue;
    if (!queue.some((s) => s.id === track.id)) {
      set({ queue: [...queue, track] });
    }
  },

  removeFromQueue: (trackId) => {
    const queue = get().queue;
    const updated = queue.filter((s) => s.id !== trackId);
    set({ queue: updated });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
  toggleRepeat: () => set((state) => ({ repeat: !state.repeat })),

  playNext: () => {
    const { queue, currentQueueIndex, repeat, shuffle } = get();
    if (queue.length === 0) return;

    if (repeat && !shuffle) {
      // Just restart current track
      set({ progress: 0 });
      return;
    }

    let nextIndex = currentQueueIndex + 1;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      nextIndex = 0; // wrap around
    }

    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      set({ activeTrack: nextTrack, currentQueueIndex: nextIndex, progress: 0, isPlaying: true });
    }
  },

  playPrevious: () => {
    const { queue, currentQueueIndex, shuffle } = get();
    if (queue.length === 0) return;

    let prevIndex = currentQueueIndex - 1;
    if (shuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else if (prevIndex < 0) {
      prevIndex = queue.length - 1; // wrap around
    }

    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      set({ activeTrack: prevTrack, currentQueueIndex: prevIndex, progress: 0, isPlaying: true });
    }
  }
}));
