"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSpotify, Story, RoutineTimePeriod } from "@/context/SpotifyContext";
import { X, Plus, Trash2, Sparkles, Clock, Calendar, Check, Compass, HelpCircle } from "lucide-react";

export default function HorizonPanel() {
  const {
    userPreferences,
    updateDials,
    updateStories,
    toggleHorizon
  } = useSpotify();

  // Local state for dials to allow sliding before saving (debounced/on mouseUp)
  const [appetite, setAppetite] = useState<number>(userPreferences?.discovery_appetite ?? 50);
  const [breadth, setBreadth] = useState<number>(userPreferences?.exploration_depth_width ?? 50);

  // Scroll ref
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Form states
  const [newStoryText, setNewStoryText] = useState<string>(" ");
  const [addingStory, setAddingStory] = useState<boolean>(false);
  const [newStoryRoutineActive, setNewStoryRoutineActive] = useState<boolean>(false);
  const [newStoryRoutines, setNewStoryRoutines] = useState<RoutineTimePeriod[]>([]);
  const [activeStoryRoutineId, setActiveStoryRoutineId] = useState<string | null>(null);

  // Routine period form states
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [selectedDays, setSelectedDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Auto-scroll to bottom when story creation form expands
  useEffect(() => {
    if (addingStory && scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth"
        });
      }, 100);
    }
  }, [addingStory, newStoryRoutineActive, newStoryRoutines.length]);

  // Dials saving
  const handleDialChange = (type: "appetite" | "breadth", val: number) => {
    if (type === "appetite") {
      setAppetite(val);
    } else {
      setBreadth(val);
    }
  };

  const handleDialMouseUp = () => {
    updateDials(appetite, breadth);
  };

  // Story CRUD
  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoryText.trim()) return;

    const newStory: Story = {
      id: `story-${Date.now()}`,
      text: newStoryText.trim(),
      active: true,
      routineActive: newStoryRoutineActive,
      routines: newStoryRoutineActive ? [...newStoryRoutines] : []
    };

    const currentStories = userPreferences?.stories || [];
    updateStories([...currentStories, newStory]);
    
    // Reset states
    setNewStoryText("");
    setNewStoryRoutineActive(false);
    setNewStoryRoutines([]);
    setAddingStory(false);
  };

  const handleDeleteStory = (storyId: string) => {
    const currentStories = userPreferences?.stories || [];
    updateStories(currentStories.filter((s) => s.id !== storyId));
    if (activeStoryRoutineId === storyId) {
      setActiveStoryRoutineId(null);
    }
  };

  const handleToggleStoryActive = (storyId: string) => {
    const currentStories = userPreferences?.stories || [];
    const updated = currentStories.map((s) => {
      if (s.id === storyId) {
        return { ...s, active: !s.active };
      }
      return s;
    });
    updateStories(updated);
  };

  const handleToggleStoryRoutine = (storyId: string) => {
    const currentStories = userPreferences?.stories || [];
    const updated = currentStories.map((s) => {
      if (s.id === storyId) {
        return { ...s, routineActive: !s.routineActive };
      }
      return s;
    });
    updateStories(updated);
  };

  // Routine periods
  const handleAddRoutinePeriod = (storyId: string) => {
    if (selectedDays.length === 0) return;

    const newPeriod: RoutineTimePeriod = {
      id: `period-${Date.now()}`,
      startTime,
      endTime,
      days: [...selectedDays]
    };

    const currentStories = userPreferences?.stories || [];
    const updated = currentStories.map((s) => {
      if (s.id === storyId) {
        return {
          ...s,
          routines: [...s.routines, newPeriod]
        };
      }
      return s;
    });

    updateStories(updated);
    // Reset form states
    setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  };

  const handleRemoveRoutinePeriod = (storyId: string, periodId: string) => {
    const currentStories = userPreferences?.stories || [];
    const updated = currentStories.map((s) => {
      if (s.id === storyId) {
        return {
          ...s,
          routines: s.routines.filter((r) => r.id !== periodId)
        };
      }
      return s;
    });
    updateStories(updated);
  };

  const toggleDaySelection = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <aside className="w-[320px] lg:w-[380px] h-full flex flex-col bg-[#121212] border-l border-[#282828] text-white font-sans select-none shrink-0 overflow-hidden transition-all duration-300 animate-slide-in-right">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2 text-[#1ed760]">
          <Sparkles size={18} className="animate-pulse" />
          <h3 className="font-bold text-[16px] tracking-tight">Horizon AI Engine</h3>
        </div>
        <button
          onClick={toggleHorizon}
          className="p-1 text-[#b3b3b3] hover:text-white hover:bg-[#1f1f1f] rounded-full transition cursor-pointer"
        >
          <X size={20} />
        </button>
      </div>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar flex flex-col gap-6">
        
        {/* Exploration Dials Section */}
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-[13px] font-bold text-[#b3b3b3] uppercase tracking-wider mb-1">
              Exploration Budget
            </h4>
            <p className="text-[11px] text-[#7c7c7c] leading-snug">
              Calibrate how adventurous the AI recommender should be right now.
            </p>
          </div>

          {/* Dial 1: Discovery Appetite */}
          <div className="flex flex-col gap-2 p-4.5 rounded-xl bg-[#181818] border border-white/5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-white">Discovery Appetite</span>
              <span className="text-[12px] font-extrabold text-[#1ed760]">{appetite}%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={appetite}
              onChange={(e) => handleDialChange("appetite", parseInt(e.target.value))}
              onMouseUp={handleDialMouseUp}
              onTouchEnd={handleDialMouseUp}
              className="w-full h-1.5 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#1ed760]"
            />

            <div className="flex justify-between text-[10px] text-[#7c7c7c] font-semibold mt-1">
              <span>Comfort Zone (Familiar)</span>
              <span>New Horizons (Curious)</span>
            </div>
            <p className="text-[10px] text-[#b3b3b3] mt-2 leading-relaxed opacity-80">
              {appetite < 35 && "Playing familiar tracks you love, keeping matches close to home."}
              {appetite >= 35 && appetite <= 70 && "A healthy blend of songs you know and fresh new findings."}
              {appetite > 70 && "Pushing you out of your comfort zone with artists and tracks you haven't liked yet."}
            </p>
          </div>

          {/* Dial 2: Sonic Breadth */}
          <div className="flex flex-col gap-2 p-4.5 rounded-xl bg-[#181818] border border-white/5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-white">Sonic Breadth</span>
              <span className="text-[12px] font-extrabold text-[#1ed760]">{breadth}%</span>
            </div>
            
            <input
              type="range"
              min="0"
              max="100"
              value={breadth}
              onChange={(e) => handleDialChange("breadth", parseInt(e.target.value))}
              onMouseUp={handleDialMouseUp}
              onTouchEnd={handleDialMouseUp}
              className="w-full h-1.5 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#1ed760]"
            />

            <div className="flex justify-between text-[10px] text-[#7c7c7c] font-semibold mt-1">
              <span>Sonic Niche (Depth)</span>
              <span>Eclectic Range (Width)</span>
            </div>
            <p className="text-[10px] text-[#b3b3b3] mt-2 leading-relaxed opacity-80">
              {breadth < 35 && "Sticking strictly to your favorite genres, languages, and styles."}
              {breadth >= 35 && breadth <= 70 && "Introducing neighboring genres and blending musical vibes."}
              {breadth > 70 && "Adventurous breadth: combining diverse world music, unexpected genres, and tempos."}
            </p>
          </div>
        </div>

        {/* Hyper-Personalization Stories Section */}
        <div className="flex flex-col gap-4 border-t border-white/5 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[13px] font-bold text-[#b3b3b3] uppercase tracking-wider mb-1">
                Context Stories
              </h4>
              <p className="text-[11px] text-[#7c7c7c] leading-snug">
                Add multiple stories to describe your routines for hyper-personalization.
              </p>
            </div>
            <button
              onClick={() => setAddingStory(!addingStory)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#181818] text-white border border-white/10 hover:border-white transition cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Inline Add Story Form */}
          {addingStory && (
            <form onSubmit={handleAddStory} className="flex flex-col gap-3.5 p-4 rounded-xl bg-[#1f1f1f] border border-[#1ed760]/20 animate-slide-down">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold text-[#b3b3b3]">Describe your story/context</span>
                <textarea
                  placeholder="E.g., Cracking Stanford finance case studies, morning run at the track, or dinner party with friends..."
                  value={newStoryText}
                  onChange={(e) => setNewStoryText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-[#121212] border border-transparent focus:border-[#1ed760]/30 outline-none text-[12px] text-white placeholder-white/20 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Routine toggle inside creation card */}
              <div className="flex items-center justify-between bg-[#121212]/50 p-2.5 rounded-lg border border-white/5">
                <div className="flex flex-col">
                  <span className="text-[12px] font-bold text-white">Enable Routine Schedule</span>
                  <span className="text-[9px] text-[#7c7c7c]">Trigger automatically based on time & day</span>
                </div>
                <button
                  type="button"
                  onClick={() => setNewStoryRoutineActive(!newStoryRoutineActive)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition duration-200 cursor-pointer ${
                    newStoryRoutineActive ? "bg-[#1ed760]" : "bg-[#3e3e3e]"
                  }`}
                >
                  <div className={`h-3.5 w-3.5 rounded-full bg-black shadow transition duration-200 transform ${
                    newStoryRoutineActive ? "translate-x-3.5" : "translate-x-0"
                  }`} />
                </button>
              </div>

              {/* Routines builder within creation card */}
              {newStoryRoutineActive && (
                <div className="flex flex-col gap-3 border-t border-white/5 pt-3">
                  {/* Current routines slots list */}
                  {newStoryRoutines.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-[#b3b3b3] uppercase tracking-wider">Scheduled Slots</span>
                      {newStoryRoutines.map((period) => (
                        <div key={period.id} className="flex items-center justify-between bg-[#121212] p-2 rounded-lg border border-white/5 text-[11px]">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 text-white font-semibold">
                              <Clock size={11} className="text-[#1ed760]" />
                              <span>{period.startTime} - {period.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[#b3b3b3]">
                              <Calendar size={11} />
                              <span>{period.days.join(", ")}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNewStoryRoutines(prev => prev.filter(r => r.id !== period.id))}
                            className="p-1 text-[#b3b3b3] hover:text-red-400 transition"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add period workspace */}
                  <div className="flex flex-col gap-2.5 bg-[#121212]/30 p-2.5 rounded-lg border border-white/5">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[#b3b3b3]">Start Time</span>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="bg-[#121212] border border-white/10 p-1 rounded text-white outline-none focus:border-[#1ed760]/30"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[#b3b3b3]">End Time</span>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="bg-[#121212] border border-white/10 p-1 rounded text-white outline-none focus:border-[#1ed760]/30"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-[#b3b3b3]">Select Days</span>
                      <div className="flex flex-wrap gap-1">
                        {daysOfWeek.map((day) => {
                          const isSel = selectedDays.includes(day);
                          return (
                            <button
                              type="button"
                              key={day}
                              onClick={() => toggleDaySelection(day)}
                              className={`h-5 w-7 text-[8px] font-bold rounded transition flex items-center justify-center ${
                                isSel 
                                  ? "bg-[#1ed760] text-black font-extrabold" 
                                  : "bg-[#121212] text-[#b3b3b3] border border-white/5"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (selectedDays.length === 0) return;
                        const newPeriod: RoutineTimePeriod = {
                          id: `period-${Date.now()}`,
                          startTime,
                          endTime,
                          days: [...selectedDays]
                        };
                        setNewStoryRoutines(prev => [...prev, newPeriod]);
                        setSelectedDays(["Mon", "Tue", "Wed", "Thu", "Fri"]);
                      }}
                      disabled={selectedDays.length === 0}
                      className="w-full py-1 bg-white/10 text-white text-[11px] font-bold rounded hover:bg-white/15 transition cursor-pointer"
                    >
                      + Add Time Period
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-white/5 pt-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setAddingStory(false);
                    setNewStoryText("");
                    setNewStoryRoutineActive(false);
                    setNewStoryRoutines([]);
                  }}
                  className="rounded-full px-3 py-1.5 text-[11px] font-bold text-[#b3b3b3] hover:text-white border border-transparent transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#1ed760] text-black px-4.5 py-1.5 text-[11px] font-bold hover:scale-104 transition cursor-pointer"
                >
                  Add Story
                </button>
              </div>
            </form>
          )}

          {/* Stories List */}
          <div className="flex flex-col gap-3">
            {(!userPreferences?.stories || userPreferences.stories.length === 0) ? (
              <div className="text-center py-6 text-[#7c7c7c] border border-dashed border-white/5 rounded-xl">
                <p className="text-[12px]">No stories added yet.</p>
                <p className="text-[10px] mt-1">Describe what you do to personalize Spotify's recommendations.</p>
              </div>
            ) : (
              userPreferences.stories.map((story) => (
                <div 
                  key={story.id} 
                  className={`flex flex-col rounded-xl bg-[#181818] border border-white/5 shadow-md overflow-hidden transition-all duration-300 ${
                    story.active ? "border-[#1ed760]/20" : ""
                  }`}
                >
                  {/* Card Header Info */}
                  <div className="p-4 flex gap-3 justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-white leading-snug">
                        {story.text}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-1 text-[#b3b3b3] hover:text-red-400 rounded transition cursor-pointer shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Settings Control Section */}
                  <div className="bg-[#151515] px-4 py-2.5 flex items-center justify-between border-t border-white/5">
                    {/* Story active toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#b3b3b3]">Activate</span>
                      <button
                        onClick={() => handleToggleStoryActive(story.id)}
                        className={`w-8 h-4.5 rounded-full p-0.5 transition duration-200 cursor-pointer ${
                          story.active ? "bg-[#1ed760]" : "bg-[#3e3e3e]"
                        }`}
                      >
                        <div className={`h-3.5 w-3.5 rounded-full bg-black shadow transition duration-200 transform ${
                          story.active ? "translate-x-3.5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Routine scheduler toggle */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#b3b3b3]">Routine</span>
                      <button
                        onClick={() => handleToggleStoryRoutine(story.id)}
                        className={`w-8 h-4.5 rounded-full p-0.5 transition duration-200 cursor-pointer ${
                          story.routineActive ? "bg-[#1ed760]" : "bg-[#3e3e3e]"
                        }`}
                      >
                        <div className={`h-3.5 w-3.5 rounded-full bg-black shadow transition duration-200 transform ${
                          story.routineActive ? "translate-x-3.5" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Routine Schedule Details */}
                  {story.routineActive && (
                    <div className="bg-[#131313] p-4 border-t border-white/5 flex flex-col gap-3">
                      {/* Existing Routine Periods */}
                      {story.routines && story.routines.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-[#7c7c7c] uppercase tracking-wider">Schedule Periods</span>
                          {story.routines.map((routine) => (
                            <div key={routine.id} className="flex items-center justify-between bg-black/30 p-2 rounded-lg border border-white/5 text-[11px]">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 text-white font-semibold">
                                  <Clock size={11} className="text-[#1ed760]" />
                                  <span>{routine.startTime} - {routine.endTime}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[#b3b3b3]">
                                  <Calendar size={11} />
                                  <span>{routine.days.join(", ")}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveRoutinePeriod(story.id, routine.id)}
                                className="p-1 text-[#b3b3b3] hover:text-red-400 transition"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Routine Period Form Toggle button */}
                      {activeStoryRoutineId !== story.id ? (
                        <button
                          onClick={() => setActiveStoryRoutineId(story.id)}
                          className="flex items-center justify-center gap-1 py-1.5 border border-dashed border-white/10 hover:border-white text-white text-[11px] font-bold rounded-lg transition"
                        >
                          <Plus size={12} /> Add time period
                        </button>
                      ) : (
                        <div className="flex flex-col gap-3 bg-[#181818] p-3 rounded-lg border border-[#1ed760]/10 animate-slide-up">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-white">New Time Period</span>
                            <button onClick={() => setActiveStoryRoutineId(null)} className="text-[#7c7c7c] hover:text-white"><X size={14} /></button>
                          </div>
                          
                          {/* Time fields */}
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-[#b3b3b3]">Start Time</span>
                              <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="bg-[#121212] border border-white/10 p-1.5 rounded text-white outline-none focus:border-[#1ed760]/30"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-[#b3b3b3]">End Time</span>
                              <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="bg-[#121212] border border-white/10 p-1.5 rounded text-white outline-none focus:border-[#1ed760]/30"
                              />
                            </div>
                          </div>

                          {/* Day checkboxes (Green bubble letters) */}
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-[#b3b3b3]">Select Days</span>
                            <div className="flex flex-wrap gap-1.5">
                              {daysOfWeek.map((day) => {
                                const isSel = selectedDays.includes(day);
                                return (
                                  <button
                                    type="button"
                                    key={day}
                                    onClick={() => toggleDaySelection(day)}
                                    className={`h-6 w-8 text-[9px] font-black rounded transition flex items-center justify-center ${
                                      isSel 
                                        ? "bg-[#1ed760] text-black font-extrabold" 
                                        : "bg-[#121212] text-[#b3b3b3] border border-white/5 hover:border-[#7c7c7c]"
                                    }`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Submit period */}
                          <button
                            type="button"
                            onClick={() => {
                              handleAddRoutinePeriod(story.id);
                              setActiveStoryRoutineId(null);
                            }}
                            disabled={selectedDays.length === 0}
                            className="w-full py-1.5 bg-[#1ed760] disabled:bg-[#1db954]/50 disabled:opacity-50 text-black text-[11px] font-bold rounded transition hover:scale-101 active:scale-99 cursor-pointer"
                          >
                            Add Period
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </aside>
  );
}
