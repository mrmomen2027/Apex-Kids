import React from 'react';
import { Award, Star, Volume2, VolumeX, Sparkles, UserCheck, Download } from 'lucide-react';
import { StudentProfile } from '../types/curriculum';
import { TEACHER_INFO } from '../data/curriculumData';
import { playSoundEffect } from '../utils/audioUtils';

interface HeaderProps {
  profile: StudentProfile | null;
  onOpenProfile: () => void;
  onOpenDownload: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentMissionNumber: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  onOpenProfile,
  onOpenDownload,
  soundEnabled,
  onToggleSound,
  currentMissionNumber,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-2 border-sky-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Teacher Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => playSoundEffect('star')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-200 transform group-hover:rotate-6 transition-transform">
              <span className="text-xl sm:text-2xl font-black">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-rose-500 to-amber-500 bg-clip-text text-transparent font-sans">
                  APEX
                </span>
                <span className="bg-sky-100 text-sky-700 text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Kids
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 font-bold hidden sm:block">
                English for Champions (4-5 Years)
              </p>
            </div>
          </div>

          {/* Teacher Watermark Pill */}
          <div className="hidden md:flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3 py-1 rounded-2xl text-xs font-bold text-amber-900 shadow-xs">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="font-extrabold">{TEACHER_INFO.name}</span>
            <span className="text-amber-400">•</span>
            <a
              href={`tel:${TEACHER_INFO.phone}`}
              className="text-amber-700 hover:text-amber-900 font-mono tracking-tight"
            >
              {TEACHER_INFO.phone}
            </a>
          </div>
        </div>

        {/* Right Tools: Mission Badge, Download, Sound, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Download / Install App Button */}
          <button
            onClick={() => {
              playSoundEffect('pop');
              onOpenDownload();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl text-xs sm:text-sm font-black shadow-md shadow-emerald-200 hover:scale-105 active:scale-95 transition-all"
            title="تحميل التطبيق على الهاتف أو الكمبيوتر"
          >
            <Download className="w-4 h-4 animate-bounce" />
            <span className="hidden xs:inline">تحميل التطبيق</span>
            <span className="xs:hidden">تحميل</span>
          </button>

          {/* Active Mission Indicator */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl text-xs sm:text-sm font-extrabold shadow-sm">
            <span>🚀</span>
            <span className="hidden sm:inline">Mission</span>
            <span>{currentMissionNumber}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              playSoundEffect('click');
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-sky-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>

          {/* Student Profile Pill */}
          {profile ? (
            <button
              onClick={() => {
                playSoundEffect('click');
                onOpenProfile();
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 border-2 border-amber-300 px-2.5 sm:px-3.5 py-1 rounded-2xl shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <span className="text-xl sm:text-2xl drop-shadow">{profile.avatar}</span>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-extrabold text-slate-800 block leading-tight truncate max-w-[90px]">
                  {profile.name}
                </span>
                <span className="text-[10px] text-amber-700 font-bold flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  {profile.stars} Stars
                </span>
              </div>
              <div className="flex sm:hidden items-center gap-0.5 text-xs font-black text-amber-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{profile.stars}</span>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Teacher Watermark Ribbon */}
      <div className="md:hidden bg-amber-50/90 border-t border-amber-200/80 px-3 py-1 text-center text-[11px] font-bold text-amber-900 flex items-center justify-center gap-2">
        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>{TEACHER_INFO.name}</span>
        <span className="text-amber-400">•</span>
        <a href={`tel:${TEACHER_INFO.phone}`} className="font-mono text-amber-800 font-extrabold">
          📞 {TEACHER_INFO.phone}
        </a>
      </div>
    </header>
  );
};
