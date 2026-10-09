import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { Mission } from '../types/curriculum';
import { playSoundEffect } from '../utils/audioUtils';

interface MissionNavProps {
  missions: Mission[];
  selectedMissionId: number;
  onSelectMission: (missionId: number) => void;
  completedMissions?: number[];
}

export const MissionNav: React.FC<MissionNavProps> = ({
  missions,
  selectedMissionId,
  onSelectMission,
  completedMissions = [],
}) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b-2 border-sky-100 py-3 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-slate-700">
            <span className="text-lg">🗺️</span>
            <span>CHOOSE YOUR MISSION / اختر مهمتك:</span>
          </div>
          <span className="text-xs text-sky-600 font-bold bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
            {missions.length} Missions
          </span>
        </div>

        {/* Scrollable Mission Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none snap-x">
          {missions.map(m => {
            const isSelected = m.id === selectedMissionId;
            const isCompleted = completedMissions.includes(m.id);

            return (
              <button
                key={m.id}
                onClick={() => {
                  playSoundEffect('click');
                  onSelectMission(m.id);
                }}
                className={`snap-start shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all duration-200 transform border-2 ${
                  isSelected
                    ? `${m.themeColor.bg} text-white border-white shadow-lg shadow-sky-200 scale-105 ring-4 ring-offset-2 ring-sky-300`
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300 shadow-xs hover:scale-102'
                }`}
              >
                {/* Cute Badge Icon */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-base sm:text-lg shadow-xs ${
                    isSelected ? 'bg-white/20' : 'bg-slate-100'
                  }`}
                >
                  <span>{m.badgeEmoji}</span>
                </div>

                {/* Mission Label */}
                <div className="text-left">
                  <div className="flex items-center gap-1 leading-tight">
                    <span className="uppercase tracking-wider text-[10px] sm:text-xs opacity-90">
                      Mission
                    </span>
                    <span className="font-black text-sm sm:text-base">{m.missionNumber}</span>
                  </div>
                  <span
                    className={`block text-[11px] truncate max-w-[100px] sm:max-w-[120px] font-semibold ${
                      isSelected ? 'text-white/90' : 'text-slate-500'
                    }`}
                  >
                    {m.title}
                  </span>
                </div>

                {/* Star Completed Badge */}
                {isCompleted && (
                  <Star className="w-4 h-4 fill-amber-300 text-amber-400 shrink-0 animate-bounce-slow" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
