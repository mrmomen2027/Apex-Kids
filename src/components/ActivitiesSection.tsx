import React, { useState } from 'react';
import { Sparkles, Trophy, Volume2, RotateCcw, CheckCircle2, Star, Award, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Mission, ActivityQuestion } from '../types/curriculum';
import { speakEnglish, playSoundEffect } from '../utils/audioUtils';

interface ActivitiesSectionProps {
  mission: Mission;
  onStarEarned: (count?: number) => void;
  completedActivities: string[];
  onActivityCompleted: (actId: string) => void;
  onOpenCertificates?: () => void;
}

export const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({
  mission,
  onStarEarned,
  completedActivities,
  onActivityCompleted,
  onOpenCertificates,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'balloons' | 'memory'>('quiz');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Balloon Pop State
  const [poppedBalloons, setPoppedBalloons] = useState<string[]>([]);
  const [targetBalloonWord, setTargetBalloonWord] = useState<string>(
    mission.words[0]?.word || 'happy'
  );

  // Memory Match State
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Generate 6 memory cards (3 pairs: 3 words + 3 emojis)
  const memoryItems = React.useMemo(() => {
    const subset = mission.words.slice(0, 3);
    const cards = [
      ...subset.map(w => ({ id: `w-${w.id}`, matchKey: w.id, text: w.word, isText: true })),
      ...subset.map(w => ({ id: `e-${w.id}`, matchKey: w.id, text: w.emoji, isText: false })),
    ];
    // Shuffle
    return cards.sort(() => 0.5 - Math.random());
  }, [mission.id]);

  const currentQuiz = mission.activities[quizIndex] || mission.activities[0];

  const isMissionActivitiesCompleted =
    mission.activities.length > 0 &&
    mission.activities.every(a => completedActivities.includes(a.id));

  const handleOptionClick = (optionId: string) => {
    if (selectedAnswer !== null) return; // Prevent double taps

    setSelectedAnswer(optionId);
    const correct = optionId === currentQuiz.correctAnswerId;
    setIsAnswerCorrect(correct);

    if (correct) {
      playSoundEffect('fanfare');
      playSoundEffect('star');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
      speakEnglish(currentQuiz.encouragement, { rate: 0.9, pitch: 1.2 });
      onStarEarned(2);
      onActivityCompleted(currentQuiz.id);
    } else {
      playSoundEffect('tryAgain');
      speakEnglish('Try again! You can do it!', { rate: 0.9 });
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    if (quizIndex < mission.activities.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizIndex(0);
    }
  };

  // Balloon pop handler
  const handlePopBalloon = (word: string, balloonKey: string) => {
    if (poppedBalloons.includes(balloonKey)) return;

    playSoundEffect('pop');
    setPoppedBalloons(prev => [...prev, balloonKey]);

    if (word.toLowerCase() === targetBalloonWord.toLowerCase()) {
      playSoundEffect('fanfare');
      playSoundEffect('star');
      confetti({
        particleCount: 40,
        spread: 50,
      });
      speakEnglish(`Super! You popped ${word}!`, { rate: 0.9 });
      onStarEarned(1);
    } else {
      speakEnglish(word, { rate: 0.85 });
    }
  };

  // Memory card click handler
  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index)) return;

    playSoundEffect('click');
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = memoryItems[newFlipped[0]];
      const card2 = memoryItems[newFlipped[1]];

      if (card1.matchKey === card2.matchKey) {
        // Matched!
        setTimeout(() => {
          playSoundEffect('fanfare');
          playSoundEffect('star');
          setMatchedPairs(prev => [...prev, card1.matchKey]);
          setFlippedCards([]);
          onStarEarned(2);

          if (matchedPairs.length + 1 === 3) {
            confetti({
              particleCount: 100,
              spread: 80,
            });
            speakEnglish("Awesome memory champion! You found all pairs!", { rate: 0.9 });
          }
        }, 500);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 rounded-3xl p-4 sm:p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black mb-2">
            <span>🚀 MISSION {mission.missionNumber}</span>
            <span>•</span>
            <span>SECTION 4: FUN GAMES & ACTIVITIES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow-sm">
            Play & Win Gold Stars! ⭐
          </h2>
          <p className="text-purple-100 text-sm font-medium mt-1">
            ألعاب ممتعة ومحفزة للأبطال الصغار لترسيخ ما تعلموه مع مستر مؤمن عباس!
          </p>
        </div>

        {/* Activity sub-game selector */}
        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md p-1.5 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('quiz');
              playSoundEffect('click');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'quiz' ? 'bg-white text-purple-700 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            🎯 Quiz
          </button>
          <button
            onClick={() => {
              setActiveTab('balloons');
              playSoundEffect('click');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'balloons' ? 'bg-white text-purple-700 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            🎈 Balloons
          </button>
          <button
            onClick={() => {
              setActiveTab('memory');
              playSoundEffect('click');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'memory' ? 'bg-white text-purple-700 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            🧩 Memory
          </button>
        </div>
      </div>

      {/* Unlocked Certificate Celebration Banner */}
      {isMissionActivitiesCompleted && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-slate-950 p-4 rounded-3xl shadow-lg border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-right animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl animate-bounce">🎓</span>
            <div>
              <h4 className="font-black text-sm sm:text-base text-slate-900">
                مبروك! أكملت جميع تمارين Mission {mission.missionNumber}! 🎉
              </h4>
              <p className="text-xs text-amber-950 font-bold mt-0.5">
                تم فتح شهادة التقدير الرسمية المعتمدة باسمك وتوقيع مستر مؤمن عباس!
              </p>
            </div>
          </div>
          {onOpenCertificates && (
            <button
              onClick={() => {
                playSoundEffect('star');
                onOpenCertificates();
              }}
              className="px-4 py-2.5 bg-slate-950 hover:bg-slate-800 text-amber-300 rounded-2xl text-xs font-black shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>عرض وطباعة الشهادة 📜</span>
            </button>
          )}
        </div>
      )}

      {/* GAME 1: LISTEN & TAP QUIZ */}
      {activeTab === 'quiz' && currentQuiz && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-purple-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-purple-100">
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-700 text-xs font-black px-3 py-1 rounded-full">
                Challenge {quizIndex + 1} of {mission.activities.length}
              </span>
              <span className="text-xs font-bold text-slate-400">
                Mission {mission.missionNumber}
              </span>
            </div>

            <button
              onClick={() => {
                if (currentQuiz.targetAudioWord) {
                  playSoundEffect('pop');
                  speakEnglish(currentQuiz.targetAudioWord);
                } else {
                  speakEnglish(currentQuiz.instruction);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-black shadow-sm transition-all"
            >
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Hear Sound 🔊</span>
            </button>
          </div>

          {/* Question Prompt */}
          <div className="text-center my-6">
            <h3 className="text-xl sm:text-3xl font-black text-slate-800 tracking-wide font-sans mb-1">
              {currentQuiz.instruction}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-purple-700">
              {currentQuiz.arabicInstruction}
            </p>

            {currentQuiz.targetAudioWord && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    playSoundEffect('pop');
                    speakEnglish(currentQuiz.targetAudioWord || '');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl text-base sm:text-lg font-black shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <Volume2 className="w-6 h-6 animate-bounce" />
                  <span>Tap to Hear Word 🎧</span>
                </button>
              </div>
            )}
          </div>

          {/* Big Tap Options for 4-5yo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
            {currentQuiz.options.map((opt) => {
              const isSelected = selectedAnswer === opt.id;
              const isCorrectOpt = opt.id === currentQuiz.correctAnswerId;

              let btnStyle = 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50';
              if (isSelected) {
                btnStyle = isCorrectOpt
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-xl scale-105'
                  : 'bg-rose-500 text-white border-rose-400 shadow-xl';
              } else if (selectedAnswer !== null && isCorrectOpt) {
                btnStyle = 'bg-emerald-100 text-emerald-800 border-emerald-400';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleOptionClick(opt.id)}
                  disabled={selectedAnswer !== null}
                  className={`p-6 rounded-3xl border-3 transition-all duration-200 flex flex-col items-center justify-center text-center shadow-md transform hover:scale-103 active:scale-98 ${btnStyle}`}
                >
                  <span className="text-6xl sm:text-7xl mb-3 drop-shadow">
                    {opt.emoji}
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-sans tracking-wide">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {selectedAnswer !== null && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 animate-in fade-in zoom-in">
              <div className="flex items-center gap-3">
                <span className="text-4xl">
                  {isAnswerCorrect ? '🌟' : '🤔'}
                </span>
                <div className="text-left">
                  <p className="text-base sm:text-lg font-black text-slate-800">
                    {isAnswerCorrect
                      ? currentQuiz.encouragement
                      : 'Not quite! Try another one!'}
                  </p>
                  <p className="text-xs text-purple-700 font-bold">
                    {isAnswerCorrect ? '+2 Stars Earned! ⭐⭐' : 'Don’t give up, Super Star!'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextQuiz}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm shadow-md hover:scale-105 transition-all w-full sm:w-auto"
              >
                Next Challenge ➔
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME 2: BALLOON POP */}
      {activeTab === 'balloons' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-fuchsia-200 text-center">
          <div className="mb-4">
            <span className="bg-fuchsia-100 text-fuchsia-700 text-xs font-black px-3 py-1 rounded-full uppercase">
              🎈 Balloon Pop Arcade • Mission {mission.missionNumber}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Pop the balloon that says: <span className="text-fuchsia-600 font-sans uppercase underline decoration-fuchsia-300">{targetBalloonWord}</span>
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              اضغط على البالون الصحيح لتسمع صوت الفرقعة وتفوز بنجوم!
            </p>
          </div>

          {/* Target Word Sound Button */}
          <div className="mb-6">
            <button
              onClick={() => {
                playSoundEffect('pop');
                speakEnglish(targetBalloonWord);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-fuchsia-500 hover:bg-fuchsia-600 text-white rounded-2xl font-black text-sm shadow-md hover:scale-105 transition-all"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>Hear Target Word: "{targetBalloonWord}"</span>
            </button>
          </div>

          {/* Balloons Floating Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 my-6 max-w-2xl mx-auto">
            {mission.words.map((w, idx) => {
              const balloonKey = `b-${w.id}-${idx}`;
              const isPopped = poppedBalloons.includes(balloonKey);
              const balloonColors = ['bg-rose-400', 'bg-sky-400', 'bg-amber-400', 'bg-emerald-400', 'bg-purple-400', 'bg-orange-400'];
              const balloonBg = balloonColors[idx % balloonColors.length];

              return (
                <div key={balloonKey} className="flex flex-col items-center">
                  {!isPopped ? (
                    <button
                      onClick={() => handlePopBalloon(w.word, balloonKey)}
                      className={`w-28 h-36 sm:w-32 sm:h-40 ${balloonBg} rounded-[50%] flex flex-col items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer relative animate-bounce-slow`}
                      style={{ animationDelay: `${idx * 0.25}s` }}
                    >
                      <span className="text-2xl sm:text-3xl mb-1">{w.emoji}</span>
                      <span className="font-black text-sm sm:text-base font-sans drop-shadow-md">
                        {w.word}
                      </span>
                      {/* String underneath balloon */}
                      <span className="absolute -bottom-3 left-1/2 w-0.5 h-4 bg-slate-400" />
                    </button>
                  ) : (
                    <div className="w-28 h-36 sm:w-32 sm:h-40 flex flex-col items-center justify-center text-slate-300 font-bold border-2 border-dashed border-slate-200 rounded-3xl animate-in zoom-in duration-200">
                      <span className="text-3xl">💥</span>
                      <span className="text-xs font-black text-slate-400 mt-1">POPPED!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Reset / Next Target */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-fuchsia-100">
            <button
              onClick={() => {
                setPoppedBalloons([]);
                playSoundEffect('click');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Balloons</span>
            </button>

            <button
              onClick={() => {
                const nextWord = mission.words[Math.floor(Math.random() * mission.words.length)]?.word || 'happy';
                setTargetBalloonWord(nextWord);
                playSoundEffect('star');
                speakEnglish(`Find the balloon for: ${nextWord}`);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-2xl text-xs font-black shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>New Word 🎲</span>
            </button>
          </div>
        </div>
      )}

      {/* GAME 3: MEMORY MATCH */}
      {activeTab === 'memory' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-pink-200 text-center">
          <div className="mb-4">
            <span className="bg-pink-100 text-pink-700 text-xs font-black px-3 py-1 rounded-full uppercase">
              🧩 Memory Match • Match Picture to Word
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
              Find the Matching Pairs!
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              المس البطاقات لتكشف عن الصورة والكلمة المتطابقة!
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 my-6 max-w-3xl mx-auto">
            {memoryItems.map((item, index) => {
              const isFlipped = flippedCards.includes(index);
              const isMatched = matchedPairs.includes(item.matchKey);

              return (
                <button
                  key={item.id}
                  onClick={() => handleCardClick(index)}
                  disabled={isFlipped || isMatched}
                  className={`h-28 sm:h-36 rounded-3xl transition-all duration-300 transform font-black flex items-center justify-center p-2 text-center border-3 shadow-md ${
                    isMatched
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-90 scale-95'
                      : isFlipped
                      ? 'bg-white border-sky-400 text-slate-800 scale-105 ring-4 ring-sky-200'
                      : 'bg-gradient-to-tr from-sky-400 to-indigo-500 border-white text-white hover:scale-105'
                  }`}
                >
                  {isFlipped || isMatched ? (
                    <div className="animate-in zoom-in duration-200">
                      {item.isText ? (
                        <span className="text-base sm:text-lg font-black font-sans block">
                          {item.text}
                        </span>
                      ) : (
                        <span className="text-4xl sm:text-5xl block">
                          {item.text}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-3xl sm:text-4xl">⭐</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setFlippedCards([]);
                setMatchedPairs([]);
                playSoundEffect('click');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Shuffle Cards 🔀</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
