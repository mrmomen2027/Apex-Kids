import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, RotateCcw, Languages, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Mission, StoryLine } from '../types/curriculum';
import { speakEnglish, stopSpeech, pauseSpeech, resumeSpeech, playSoundEffect } from '../utils/audioUtils';

interface StorySectionProps {
  mission: Mission;
  onStoryCompleted?: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ mission, onStoryCompleted }) => {
  const { story } = mission;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number>(-1);
  const [showArabic, setShowArabic] = useState(true);

  const activeLineRef = useRef<number>(-1);
  const isPlayingRef = useRef<boolean>(false);

  // Sync ref with state
  useEffect(() => {
    activeLineRef.current = currentLineIndex;
  }, [currentLineIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Clean up speech when leaving component or mission changes
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [mission.id]);

  const readLineSequence = (index: number) => {
    if (index >= story.lines.length) {
      // Completed story!
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentLineIndex(-1);
      setHighlightedWordIndex(-1);
      playSoundEffect('fanfare');
      playSoundEffect('star');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onStoryCompleted?.();
      return;
    }

    setCurrentLineIndex(index);
    setHighlightedWordIndex(0);

    const line = story.lines[index];
    const words = line.text.split(' ');

    speakEnglish(line.text, {
      rate: 0.82,
      pitch: 1.15,
      onBoundary: (charIndex) => {
        // Find which word matches charIndex
        let count = 0;
        for (let i = 0; i < words.length; i++) {
          if (charIndex >= count && charIndex < count + words[i].length + 1) {
            setHighlightedWordIndex(i);
            break;
          }
          count += words[i].length + 1;
        }
      },
      onEnd: () => {
        // Read next line after a gentle pause
        if (isPlayingRef.current) {
          setTimeout(() => {
            if (isPlayingRef.current) {
              readLineSequence(index + 1);
            }
          }, 600);
        }
      },
      onError: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
    });
  };

  const handlePlayStory = () => {
    playSoundEffect('pop');
    setIsPlaying(true);
    setIsPaused(false);
    readLineSequence(0);
  };

  const handlePauseResume = () => {
    playSoundEffect('click');
    if (isPaused) {
      resumeSpeech();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      pauseSpeech();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStopStory = () => {
    playSoundEffect('click');
    stopSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentLineIndex(-1);
    setHighlightedWordIndex(-1);
  };

  const handleReadLineOnly = (index: number) => {
    playSoundEffect('pop');
    stopSpeech();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentLineIndex(index);
    setHighlightedWordIndex(0);

    const line = story.lines[index];
    const words = line.text.split(' ');

    speakEnglish(line.text, {
      rate: 0.82,
      pitch: 1.15,
      onBoundary: (charIndex) => {
        let count = 0;
        for (let i = 0; i < words.length; i++) {
          if (charIndex >= count && charIndex < count + words[i].length + 1) {
            setHighlightedWordIndex(i);
            break;
          }
          count += words[i].length + 1;
        }
      },
      onEnd: () => {
        setHighlightedWordIndex(-1);
      },
    });
  };

  // Helper to render scene illustration header
  const getSceneArtwork = () => {
    switch (story.sceneIllustration) {
      case 'family':
        return {
          bg: 'from-amber-100 via-rose-100 to-sky-100',
          elements: ['👨 Dad', '👩 Mom', '👧 Tasneem', '👦 Aser', '👧 Mariam', '🐱 Bondok'],
          sceneTitle: 'Tasneem’s Loving Family House 🏡',
        };
      case 'colors':
        return {
          bg: 'from-pink-100 via-yellow-100 to-sky-100',
          elements: ['☀️ Yellow Sun', '🔴 Red Ball', '🔵 Blue Kite', '🟢 Green Box', '🐈‍⬛ Bondok'],
          sceneTitle: 'A Sunny Day with Colors & Toys 🎈',
        };
      case 'body':
        return {
          bg: 'from-emerald-100 via-teal-100 to-sky-100',
          elements: ['🪑 Table', '🐱 Bondok Under Table', '👀 Tasneem Looking', '🐾 4 Legs'],
          sceneTitle: 'Looking for Bondok the Cat! 🔍',
        };
      case 'park':
        return {
          bg: 'from-green-100 via-emerald-100 to-cyan-100',
          elements: ['🌳 Big Tree', '🦆 Lake & Duck', '🐰 Hopping Rabbit', '🐟 Swimming Fish'],
          sceneTitle: 'Sunny Day at the Green Park 🌳',
        };
      case 'counting':
        return {
          bg: 'from-indigo-100 via-sky-100 to-teal-100',
          elements: ['1️⃣ Bird', '2️⃣ Ducks', '3️⃣ Fish', '4️⃣ Rabbits', '5️⃣ Trees', '😴 Bondok ZZZ'],
          sceneTitle: 'Counting Animals in the Forest! 🔢',
        };
      case 'breakfast':
        return {
          bg: 'from-teal-100 via-amber-100 to-orange-100',
          elements: ['🥛 Milk', '🍞 Bread', '🥚 Egg', '🍎 Apple', '🍌 Banana', '🐟 Yummy Fish'],
          sceneTitle: 'Delicious Breakfast Table 🍳',
        };
      case 'shop':
        return {
          bg: 'from-orange-100 via-amber-100 to-pink-100',
          elements: ['🏪 Toy Shop', '👜 Blue Bag', '⚽ 2 Red Balls', '🧸 Rabbit Toy', '🐱 Bondok In Bag!'],
          sceneTitle: 'At the Happy Toy Shop 🛍️',
        };
      case 'healthy':
        return {
          bg: 'from-lime-100 via-emerald-100 to-cyan-100',
          elements: ['🍎 Fresh Apple', '🍌 Sweet Banana', '🍊 Juicy Orange', '💧 Pure Water', '🥗 Healthy'],
          sceneTitle: 'Healthy Lunch Time 🥗',
        };
      case 'school':
        return {
          bg: 'from-blue-100 via-indigo-100 to-purple-100',
          elements: ['🏫 School', '🎒 New Bag', '📚 Colorful Book', '🖊️ Blue Pen', '👨‍🏫 Mr. Momen'],
          sceneTitle: 'A New Day at School 🏫',
        };
      default:
        return {
          bg: 'from-purple-100 via-pink-100 to-sky-100',
          elements: ['🎉 Party', '🐱 Bondok', '🌟 Stars', '👨‍👩‍👧‍👦 Friends'],
          sceneTitle: 'APEX English Story Adventure 📖',
        };
    }
  };

  const sceneArt = getSceneArtwork();

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-3xl p-4 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black mb-2">
            <span>🚀 MISSION {mission.missionNumber}</span>
            <span>•</span>
            <span>SECTION 3: STORY & KARAOKE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow-sm">
            {story.title} 📖
          </h2>
          <p className="text-sky-100 text-sm font-medium mt-1">
            {story.arabicTitle} • {story.tagline}
          </p>
        </div>

        {/* Translation Toggle */}
        <button
          onClick={() => {
            setShowArabic(!showArabic);
            playSoundEffect('click');
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-xs font-black transition-all"
        >
          <Languages className="w-4 h-4" />
          <span>{showArabic ? 'Hide Arabic' : 'Show Arabic'}</span>
        </button>
      </div>

      {/* Storybook Container */}
      <div className="bg-white rounded-3xl shadow-xl border-4 border-sky-200 overflow-hidden">
        {/* Story Illustration Scene (as in the booklet) */}
        <div className={`p-6 sm:p-8 bg-gradient-to-b ${sceneArt.bg} border-b-4 border-sky-100 relative`}>
          <div className="flex items-center justify-between mb-3">
            <span className="bg-white/80 backdrop-blur-sm text-sky-800 text-xs font-black px-3 py-1 rounded-full shadow-xs">
              🖼️ Scene Illustration • Mission {mission.missionNumber}
            </span>
            <span className="text-xs font-bold text-slate-600">
              {sceneArt.sceneTitle}
            </span>
          </div>

          {/* Kid-friendly Character Scene Collage */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4 sm:py-6">
            {sceneArt.elements.map((el, i) => (
              <div
                key={i}
                className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-md border-2 border-white/80 font-black text-slate-800 text-sm sm:text-base flex items-center gap-2 transform hover:scale-105 transition-transform"
              >
                <span>{el}</span>
              </div>
            ))}
          </div>

          {/* Floating Mascot Dialogue Bubble */}
          <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-lg border-2 border-amber-300 max-w-sm mx-auto flex items-center gap-3">
            <span className="text-3xl animate-bounce-slow">🐱</span>
            <div className="text-left text-xs font-bold text-slate-700">
              <span className="font-extrabold text-amber-800 block">Bondok says:</span>
              "Listen to the story and follow the highlighted yellow words!"
            </div>
          </div>
        </div>

        {/* Playback Audio Controls Bar */}
        <div className="p-4 bg-sky-50 border-b-2 border-sky-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                onClick={handlePlayStory}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Play Full Story 🎧</span>
              </button>
            ) : (
              <button
                onClick={handlePauseResume}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </button>
            )}

            {isPaused && (
              <button
                onClick={handlePauseResume}
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-black text-xs shadow-md transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume</span>
              </button>
            )}

            {(isPlaying || isPaused || currentLineIndex >= 0) && (
              <button
                onClick={handleStopStory}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-2xl font-black text-xs transition-all"
                title="Stop reading"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
            <span>🔊 Clear English audio for 4-5 years</span>
            {isPlaying && (
              <span className="flex items-center gap-1 text-emerald-600 font-black animate-pulse">
                <Volume2 className="w-4 h-4" />
                <span>Reading aloud...</span>
              </span>
            )}
          </div>
        </div>

        {/* English Story Lines with Word-by-Word Karaoke */}
        <div className="p-4 sm:p-8 space-y-3 sm:space-y-4">
          {story.lines.map((line, lineIdx) => {
            const isCurrentLine = currentLineIndex === lineIdx;
            const words = line.text.split(' ');

            return (
              <div
                key={line.id}
                onClick={() => handleReadLineOnly(lineIdx)}
                className={`group cursor-pointer rounded-2xl p-3.5 sm:p-4 transition-all duration-200 border-2 flex items-start justify-between gap-3 ${
                  isCurrentLine
                    ? 'bg-amber-50 border-amber-400 shadow-md ring-4 ring-amber-200 scale-101'
                    : 'bg-slate-50/70 hover:bg-sky-50/60 border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isCurrentLine
                        ? 'bg-amber-500 text-white shadow-sm animate-bounce-slow'
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}
                  >
                    {lineIdx + 1}
                  </div>

                  <div className="text-left font-sans">
                    {/* Speaker name if present */}
                    {line.speaker && (
                      <span className="text-[11px] font-black uppercase text-indigo-600 block mb-0.5 tracking-wider">
                        {line.speaker}:
                      </span>
                    )}

                    {/* Words with individual karaoke highlighting */}
                    <div className="text-lg sm:text-2xl font-bold leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
                      {words.map((word, wordIdx) => {
                        const isWordActive = isCurrentLine && highlightedWordIndex === wordIdx;

                        return (
                          <span
                            key={wordIdx}
                            className={`rounded-lg px-1 transition-colors duration-150 ${
                              isWordActive
                                ? 'bg-amber-300 text-slate-900 shadow-sm scale-110 font-black'
                                : isCurrentLine
                                ? 'text-slate-900 font-extrabold'
                                : 'text-slate-700'
                            }`}
                          >
                            {word}
                          </span>
                        );
                      })}
                    </div>

                    {/* Arabic Translation */}
                    {showArabic && (
                      <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
                        {line.arabic}
                      </p>
                    )}
                  </div>
                </div>

                {/* Individual line listen button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadLineOnly(lineIdx);
                  }}
                  className={`p-2 rounded-xl text-xs font-black transition-all shrink-0 ${
                    isCurrentLine
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-white hover:bg-sky-500 text-slate-400 hover:text-white border border-slate-200'
                  }`}
                  title="Listen to this line"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
