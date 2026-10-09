import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, Share2, X, Star, CheckCircle2, Sparkles, MessageCircle, Calendar } from 'lucide-react';
import { Mission } from '../types/curriculum';
import { TEACHER_INFO } from '../data/curriculumData';
import { playSoundEffect, speakEnglish } from '../utils/audioUtils';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
  studentName: string;
  studentAvatar: string;
  completionDate?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  mission,
  studentName,
  studentAvatar,
  completionDate,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      playSoundEffect('fanfare');
      playSoundEffect('star');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });

      // Announce celebration in friendly voice
      speakEnglish(`Congratulations ${studentName}! You earned the Mission ${mission.missionNumber} Certificate!`, {
        rate: 0.88,
        pitch: 1.15,
      });
    }
  }, [isOpen, mission.missionNumber, studentName]);

  if (!isOpen) return null;

  const dateStr = completionDate
    ? new Date(completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const handlePrint = () => {
    playSoundEffect('pop');
    window.print();
  };

  const shareText = `🎉 مبروك للبطل/ة ${studentName}! حصل على شهادة التفوق الرسمية في مادة اللغة الإنجليزية (Mission ${mission.missionNumber}: ${mission.title}) من منصة APEX تحت إشراف ${TEACHER_INFO.name} (${TEACHER_INFO.phone})! 🌟`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="w-full max-w-3xl my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Floating Actions Bar (Hidden on print) */}
        <div className="flex items-center justify-between mb-3 bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-xl print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <div>
              <p className="text-xs sm:text-sm font-black text-amber-300">
                Official APEX Certificate / شهادة تفوق معتمدة
              </p>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Mission {mission.missionNumber} • {mission.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-xl text-xs sm:text-sm font-black shadow-md hover:scale-105 active:scale-95 transition-all"
              title="طباعة الشهادة أو حفظها بصيغة PDF"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>طباعة / حفظ PDF</span>
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
              title="مشاركة الإنجاز على الواتساب"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">واتساب</span>
            </a>

            <button
              onClick={() => {
                playSoundEffect('click');
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div
          ref={certificateRef}
          id="printable-award-card"
          className="relative bg-gradient-to-br from-amber-50 via-white to-amber-50/60 rounded-3xl p-6 sm:p-10 border-8 border-double border-amber-400 shadow-2xl overflow-hidden print:border-8 print:border-amber-500 print:shadow-none print:w-full print:m-0 print:rounded-none"
        >
          {/* Subtle Guilloche/Corner Accents */}
          <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-xl pointer-events-none" />
          <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-xl pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-xl pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-xl pointer-events-none" />

          {/* Watermark in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none">
            <span className="text-[180px] font-black text-amber-950 rotate-[-15deg]">
              APEX
            </span>
          </div>

          {/* Top Brand Banner */}
          <div className="text-center relative z-10 mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white px-4 sm:px-6 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-black shadow-md tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>APEX Kids English Academy</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight font-serif">
              Certificate of Excellence
            </h1>
            <p className="text-xs sm:text-base font-extrabold text-amber-700 mt-0.5">
              شهادة تفوق وإتقان لمرحلة التأسيس واللغة الإنجليزية
            </p>
          </div>

          {/* Ribbon Award Subheading */}
          <div className="text-center relative z-10 my-4 sm:my-6">
            <p className="text-xs sm:text-sm uppercase tracking-widest text-slate-500 font-bold">
              This Certificate is Proudly Awarded to
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              تُمنح هذه الشهادة بكل فخر واعتزاز إلى البطل / البطلة:
            </p>

            {/* Student Name & Avatar */}
            <div className="mt-3 inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-100/80 via-yellow-100/90 to-amber-100/80 border-2 border-amber-300/80 px-6 sm:px-10 py-3 rounded-2xl shadow-inner">
              <span className="text-4xl sm:text-5xl filter drop-shadow">{studentAvatar}</span>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-wide font-serif">
                  {studentName}
                </h2>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-600 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>Star Student of APEX Series</span>
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Description */}
          <div className="text-center relative z-10 max-w-xl mx-auto my-4 text-slate-700 text-xs sm:text-sm leading-relaxed font-medium bg-white/70 backdrop-blur-xs p-4 rounded-2xl border border-amber-200">
            <p className="font-bold">
              For outstanding performance and successful completion of all activities, phonics, grammar rules, and vocabulary in:
            </p>
            <p className="text-base sm:text-lg font-black text-indigo-700 mt-1">
              Mission {mission.missionNumber}: {mission.title}
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-slate-600 mt-0.5">
              ({mission.arabicTitle})
            </p>
            <div className="flex items-center justify-center gap-1.5 mt-2 text-emerald-600 font-black text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% All Interactive Challenges Completed</span>
            </div>
          </div>

          {/* Footer Seals & Teacher Signatures */}
          <div className="relative z-10 pt-4 sm:pt-6 border-t-2 border-dashed border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            {/* Date & Serial */}
            <div className="text-slate-600 text-xs order-2 sm:order-1">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 font-bold">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Date: {dateStr}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                ID: APEX-M{mission.missionNumber}-{Math.abs(studentName.split('').reduce((a, b) => a + b.charCodeAt(0), 1000))}
              </p>
            </div>

            {/* Gold Seal Graphic */}
            <div className="order-1 sm:order-2 flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 text-white p-1 shadow-lg flex items-center justify-center border-2 border-amber-200 animate-pulse">
                <div className="w-full h-full rounded-full border-2 border-dashed border-white/80 flex flex-col items-center justify-center text-center p-1">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow" />
                  <span className="text-[8px] font-black uppercase tracking-tighter">EXCELLENCE</span>
                </div>
              </div>
            </div>

            {/* Teacher Signature */}
            <div className="text-center sm:text-right order-3">
              <div className="font-serif italic text-lg sm:text-xl font-bold text-slate-800 tracking-wider">
                {TEACHER_INFO.name}
              </div>
              <div className="w-36 h-0.5 bg-slate-400 mx-auto sm:ml-auto sm:mr-0 my-1" />
              <p className="text-[11px] font-black text-amber-800">
                {TEACHER_INFO.title}
              </p>
              <p className="text-[10px] text-slate-500 font-mono font-bold">
                📞 {TEACHER_INFO.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
