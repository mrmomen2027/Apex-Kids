import React from 'react';
import { Phone, MessageCircle, Award, Star } from 'lucide-react';
import { TEACHER_INFO } from '../data/curriculumData';

interface WatermarkBadgeProps {
  variant?: 'floating' | 'header' | 'footer' | 'card';
}

export const WatermarkBadge: React.FC<WatermarkBadgeProps> = ({ variant = 'floating' }) => {
  if (variant === 'floating') {
    return (
      <aside
        aria-label="Teacher Contact and Watermark"
        className="fixed bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md border-2 border-amber-400 rounded-2xl shadow-xl px-3.5 py-2 flex items-center gap-3 transition-transform hover:scale-105"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
          <Award className="w-6 h-6" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm text-slate-800 tracking-tight">
              {TEACHER_INFO.name}
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 font-mono">
            <span>{TEACHER_INFO.phone}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 border-l border-amber-200 pl-2">
          <a
            href={TEACHER_INFO.whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors shadow-sm"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
          <a
            href={`tel:${TEACHER_INFO.phone}`}
            className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors shadow-sm"
            title="Call Mr. Momen Abass"
            aria-label="Call Mr. Momen Abass"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </aside>
    );
  }

  if (variant === 'header') {
    return (
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-bold text-amber-900 shadow-sm">
        <Award className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-extrabold">{TEACHER_INFO.name}</span>
        <span className="text-amber-400">|</span>
        <a
          href={`tel:${TEACHER_INFO.phone}`}
          className="font-mono text-amber-700 hover:text-amber-900 underline decoration-amber-300"
        >
          {TEACHER_INFO.phone}
        </a>
      </div>
    );
  }

  return (
    <footer className="w-full text-center py-6 px-4 bg-white/70 backdrop-blur border-t border-sky-100 mt-12">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-white text-2xl shadow-md">
            🎓
          </div>
          <div className="text-left">
            <h4 className="font-bold text-slate-800 text-base">
              APEX Series by {TEACHER_INFO.name}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              English Learning Excellence for Early Childhood (4-5 Years)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-sky-50 border border-sky-200 px-4 py-2 rounded-2xl text-center">
            <span className="text-xs text-slate-500 block font-medium">Direct Teacher Contact</span>
            <a
              href={`tel:${TEACHER_INFO.phone}`}
              className="text-sky-700 font-bold font-mono text-sm hover:underline"
            >
              📞 {TEACHER_INFO.phone}
            </a>
          </div>
          <a
            href={TEACHER_INFO.whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-md transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
