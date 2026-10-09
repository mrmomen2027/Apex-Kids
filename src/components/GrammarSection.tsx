import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, Award, ArrowRight, Lightbulb, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Mission } from '../types/curriculum';
import { TEACHER_INFO } from '../data/curriculumData';
import { speakEnglish, playSoundEffect } from '../utils/audioUtils';

interface GrammarSectionProps {
  mission: Mission;
  onStarEarned?: () => void;
}

export const GrammarSection: React.FC<GrammarSectionProps> = ({ mission, onStarEarned }) => {
  const { grammar } = mission;
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [solvedPractice, setSolvedPractice] = useState<string[]>([]);

  const handleSelectPracticeOption = (practiceId: string, option: string, correctAnswer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [practiceId]: option }));

    if (option === correctAnswer) {
      playSoundEffect('fanfare');
      playSoundEffect('star');
      if (!solvedPractice.includes(practiceId)) {
        setSolvedPractice(prev => [...prev, practiceId]);
        onStarEarned?.();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
      speakEnglish(`Correct! Great job!`, { rate: 0.9 });
    } else {
      playSoundEffect('tryAgain');
      speakEnglish(`Try again! You can do it!`, { rate: 0.9 });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-3xl p-4 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black mb-2">
            <span>🚀 MISSION {mission.missionNumber}</span>
            <span>•</span>
            <span>SECTION 2: GRAMMAR RULE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow-sm">
            Let's Fun! {grammar.title} ✨
          </h2>
          <p className="text-emerald-100 text-sm font-medium mt-1">
            {grammar.arabicTitle}
          </p>
        </div>

        <button
          onClick={() => {
            playSoundEffect('pop');
            speakEnglish(`${grammar.title}. ${grammar.explanation}`);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <Volume2 className="w-5 h-5 text-emerald-600 animate-pulse" />
          <span>Explain to Me 🎧</span>
        </button>
      </div>

      {/* Notebook Sheet Layout (as in the booklet) */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-4 border-emerald-200 relative overflow-hidden">
        {/* Notebook Spiral Binding visual decoration */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-dashed border-emerald-100">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-400 inline-block" />
            <span className="w-4 h-4 rounded-full bg-amber-400 inline-block" />
            <span className="w-4 h-4 rounded-full bg-rose-400 inline-block" />
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">
              APEX Smart Workbook • Lesson Page
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold text-amber-800">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{TEACHER_INFO.name}</span>
          </div>
        </div>

        {/* Formula Box */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-3 border-emerald-300 rounded-3xl p-4 sm:p-6 mb-6 text-center">
          <span className="inline-block bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            The Golden Rule 🌟
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-wide font-sans mb-2">
            {grammar.formula}
          </h3>
          <p className="text-sm sm:text-base font-bold text-emerald-800 max-w-2xl mx-auto leading-relaxed">
            {grammar.explanation}
          </p>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-2 bg-white/70 py-1.5 px-4 rounded-2xl inline-block">
            💡 {grammar.arabicExplanation}
          </p>
        </div>

        {/* Visual Cards Grid (child-friendly booklet illustrations) */}
        <div>
          <h4 className="text-base sm:text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
            <span>🖼️ Illustrated Visual Examples (رسومات وأمثلة توضيحية):</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {grammar.visualCards.map((card, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-4 border-2 transition-all duration-200 flex flex-col items-center text-center hover:scale-102 hover:shadow-lg ${card.color}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-xs flex items-center justify-center text-4xl mb-3">
                  <span>{card.emoji}</span>
                </div>
                <h5 className="font-black text-slate-800 text-base mb-1">
                  {card.label}
                </h5>
                <p className="text-xs font-bold text-slate-500 mb-2">
                  {card.arabicLabel}
                </p>
                <p className="text-xs sm:text-sm font-black text-slate-800 bg-white/90 px-3 py-1.5 rounded-2xl shadow-xs mb-3 font-sans">
                  "{card.sentence}"
                </p>

                <button
                  onClick={() => {
                    playSoundEffect('pop');
                    speakEnglish(card.sentence);
                  }}
                  className="mt-auto flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-black shadow-xs transition-all hover:scale-105"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Listen</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Practice Exercise */}
        <div className="bg-sky-50/70 border-2 border-sky-200 rounded-3xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🎯</span>
            <div>
              <h4 className="font-black text-slate-800 text-base sm:text-lg">
                Quick Interactive Practice / تدريب سريع وممتع:
              </h4>
              <p className="text-xs text-slate-500 font-bold">
                Tap the right answer to complete the sentence!
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {grammar.practice.map((item) => {
              const selected = selectedAnswers[item.id];
              const isCorrect = selected === item.correctAnswer;
              const isSolved = solvedPractice.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-3 sm:p-4 border-2 transition-all flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm ${
                    isSolved ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <div className="text-left font-sans">
                      <span className="text-xs text-slate-400 font-bold block">{item.prompt}</span>
                      <span className="text-base sm:text-lg font-black text-slate-800">
                        {item.prefix && `${item.prefix} `}
                        <span className="inline-block px-3 py-0.5 mx-1 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 font-bold min-w-[60px] text-center">
                          {selected || '___'}
                        </span>
                        {item.suffix && ` ${item.suffix}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {item.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelectPracticeOption(item.id, opt, item.correctAnswer)}
                        className={`px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-black transition-all ${
                          selected === opt
                            ? opt === item.correctAnswer
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'bg-rose-500 text-white shadow-md'
                            : 'bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 border border-slate-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}

                    {isSolved && (
                      <span className="text-emerald-500 font-black text-xs flex items-center gap-1 pl-2">
                        <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
