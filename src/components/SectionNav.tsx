import React from 'react';
import { PenTool, BookOpen, Sparkles, Gamepad2 } from 'lucide-react';
import { playSoundEffect } from '../utils/audioUtils';
import { Mission } from '../types/curriculum';

export type SectionType = 'words' | 'grammar' | 'story' | 'activities';

interface SectionNavProps {
  currentSection: SectionType;
  onSelectSection: (section: SectionType) => void;
  mission: Mission;
}

export const SectionNav: React.FC<SectionNavProps> = ({
  currentSection,
  onSelectSection,
  mission,
}) => {
  const sections: {
    id: SectionType;
    label: string;
    arabicLabel: string;
    icon: React.ReactNode;
    color: string;
    activeBg: string;
    border: string;
  }[] = [
    {
      id: 'words',
      label: 'Words & Tracing',
      arabicLabel: 'الكلمات والتتبع',
      icon: <PenTool className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'text-amber-600',
      activeBg: 'bg-amber-500 text-white shadow-amber-200',
      border: 'border-amber-400',
    },
    {
      id: 'grammar',
      label: 'Grammar Rule',
      arabicLabel: 'القاعدة والشرح',
      icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-500 text-white shadow-emerald-200',
      border: 'border-emerald-400',
    },
    {
      id: 'story',
      label: 'Story Time',
      arabicLabel: 'القصة والاستماع',
      icon: <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'text-sky-600',
      activeBg: 'bg-sky-500 text-white shadow-sky-200',
      border: 'border-sky-400',
    },
    {
      id: 'activities',
      label: 'Fun Activities',
      arabicLabel: 'الألعاب والأنشطة',
      icon: <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />,
      color: 'text-purple-600',
      activeBg: 'bg-purple-500 text-white shadow-purple-200',
      border: 'border-purple-400',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 my-4">
      {/* Cute Mission Banner Badge */}
      <div className="flex items-center justify-between bg-white rounded-3xl p-3 sm:p-4 mb-4 border-2 border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-md">
            {mission.badgeEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
                MISSION {mission.missionNumber}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                {mission.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-bold mt-0.5">
              {mission.arabicTitle} • <span className="text-sky-600">{mission.subtitle}</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-sky-50 px-3 py-1.5 rounded-2xl border border-sky-200 text-sky-800 text-xs font-extrabold">
          <span>🌟 4-5 Years</span>
        </div>
      </div>

      {/* 4 Big Bouncy Section Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {sections.map(sec => {
          const isActive = currentSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => {
                playSoundEffect('click');
                onSelectSection(sec.id);
              }}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl font-extrabold transition-all duration-200 border-3 text-center transform ${
                isActive
                  ? `${sec.activeBg} border-white shadow-xl scale-105 ring-4 ring-offset-2 ring-sky-300`
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300 shadow-sm hover:scale-102'
              }`}
            >
              <div
                className={`p-2 rounded-2xl mb-1.5 transition-transform ${
                  isActive ? 'bg-white/20 scale-110' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {sec.icon}
              </div>

              <span className="text-sm sm:text-base leading-tight font-black">
                {sec.label}
              </span>
              <span
                className={`text-[11px] sm:text-xs font-bold mt-0.5 ${
                  isActive ? 'text-white/90' : 'text-slate-400'
                }`}
              >
                {sec.arabicLabel}
              </span>

              {/* Mission indicator badge inside each tab as requested */}
              <div
                className={`mt-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/30 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                Mission {mission.missionNumber}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
