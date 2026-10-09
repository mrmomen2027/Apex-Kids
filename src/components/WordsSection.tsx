import React, { useState } from 'react';
import { Volume2, Music2, PenTool, CheckCircle, Sparkles, Star } from 'lucide-react';
import { Mission, MissionWord } from '../types/curriculum';
import { TracingCanvas } from './TracingCanvas';
import { speakEnglish, spellWordPhonics, playSoundEffect } from '../utils/audioUtils';

interface WordsSectionProps {
  mission: Mission;
  completedWords: string[];
  onWordCompleted: (wordId: string) => void;
}

export const WordsSection: React.FC<WordsSectionProps> = ({
  mission,
  completedWords,
  onWordCompleted,
}) => {
  const [activeTracingWord, setActiveTracingWord] = useState<MissionWord | null>(
    mission.words[0] || null
  );

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Top Banner with Mission number clearly visible */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black mb-2">
            <span>🚀 MISSION {mission.missionNumber}</span>
            <span>•</span>
            <span>SECTION 1: VOCABULARY & TRACING</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow-sm">
            Let's Trace & Learn 6 Words! ✏️
          </h2>
          <p className="text-amber-100 text-sm font-medium mt-1">
            استمع للنطق الصحيح، وتتبع كتابة الكلمات على السطور الإنجليزية كأنك في المذكرة تماماً!
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 bg-white/95 px-4 py-2.5 rounded-2xl shadow-lg border-2 border-amber-300">
          <Star className="w-6 h-6 fill-amber-400 text-amber-500 animate-spin-slow" />
          <div className="text-left text-xs font-black text-slate-800">
            <span>Progress: </span>
            <span className="text-amber-600 font-extrabold text-sm">
              {mission.words.filter(w => completedWords.includes(w.id)).length} / 6
            </span>
          </div>
        </div>
      </div>

      {/* Tracing Area: Always available and dynamic */}
      {activeTracingWord && (
        <div className="scroll-mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <PenTool className="w-4 h-4 text-sky-500" />
              <span>Interactive Handwriting Tracing Sheet:</span>
            </span>
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              Tracing: {activeTracingWord.word}
            </span>
          </div>
          <TracingCanvas
            word={activeTracingWord}
            onCompleteTrace={(wordId) => {
              onWordCompleted(wordId);
            }}
          />
        </div>
      )}

      {/* 6 Word Cards Grid (as in the booklet) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
            <span>📚 Unit Words Flashcards (كلمات الوحدة الست):</span>
          </h3>
          <span className="text-xs font-bold text-slate-500">Tap card to trace ✏️</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {mission.words.map(w => {
            const isCompleted = completedWords.includes(w.id);
            const isSelected = activeTracingWord?.id === w.id;

            return (
              <div
                key={w.id}
                onClick={() => {
                  playSoundEffect('click');
                  setActiveTracingWord(w);
                }}
                className={`group cursor-pointer rounded-3xl p-4 sm:p-5 transition-all duration-200 border-3 flex flex-col items-center text-center relative overflow-hidden bg-white shadow-md hover:shadow-xl hover:scale-102 active:scale-98 ${
                  isSelected
                    ? 'border-sky-400 ring-4 ring-sky-200 bg-sky-50/50'
                    : 'border-slate-200 hover:border-sky-300'
                }`}
              >
                {/* Mission badge on card */}
                <span className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                  M{mission.missionNumber}
                </span>

                {/* Completed Star Checkmark */}
                {isCompleted && (
                  <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white rounded-full p-1 shadow-md">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </span>
                )}

                {/* Big Vibrant Booklet Illustration */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-5xl sm:text-6xl mb-3 shadow-inner group-hover:scale-110 transition-transform">
                  <span className="drop-shadow-md">{w.emoji}</span>
                </div>

                {/* Word Label */}
                <h4 className="text-xl sm:text-2xl font-black text-slate-800 tracking-wide font-sans mb-0.5">
                  {w.word}
                </h4>
                <p className="text-xs sm:text-sm font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full mb-3">
                  {w.arabic}
                </p>

                {/* Sentence teaser */}
                <p className="text-[11px] text-slate-400 font-medium italic mb-3 line-clamp-1">
                  "{w.exampleSentence}"
                </p>

                {/* Card Action Buttons */}
                <div className="flex items-center gap-1.5 w-full mt-auto">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSoundEffect('pop');
                      speakEnglish(w.word);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 py-2 px-2 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl text-xs font-black shadow-sm transition-all"
                    title="Pronounce word clearly"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSoundEffect('pop');
                      spellWordPhonics(w.phonics, w.word);
                    }}
                    className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-2xl text-xs font-black transition-all"
                    title="Spell letter by letter"
                  >
                    <Music2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSoundEffect('click');
                      setActiveTracingWord(w);
                    }}
                    className={`p-2 rounded-2xl text-xs font-black transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-800'
                    }`}
                    title="Trace on kindergarten lines"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
