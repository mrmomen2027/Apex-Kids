import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, User, Mail, Award, Check } from 'lucide-react';
import { StudentProfile } from '../types/curriculum';
import { playSoundEffect, speakEnglish } from '../utils/audioUtils';

interface RegistrationModalProps {
  isOpen: boolean;
  onSave: (profile: StudentProfile) => void;
  initialProfile?: StudentProfile | null;
  onClose?: () => void;
}

const AVATARS = [
  { id: 'mariam', emoji: '👧', name: 'Mariam', nameAr: 'مريم', badge: 'بنات 🌸', desc: 'الأميرة مريم' },
  { id: 'tasneem', emoji: '🎀', name: 'Tasneem', nameAr: 'تسنيم', badge: 'بنات 💖', desc: 'البطلة تسنيم' },
  { id: 'aser', emoji: '👦', name: 'Aser', nameAr: 'آسر', badge: 'أولاد ⭐', desc: 'البطل آسر' },
  { id: 'omar', emoji: '🦸', name: 'Omar', nameAr: 'عمر', badge: 'أولاد 🚀', desc: 'سوبر عمر' },
  { id: 'lion', emoji: '🦁', name: 'Lion', nameAr: 'الأسد الشجاع', badge: 'للأولاد 🦁', desc: 'شخصية الأولاد' },
  { id: 'butterfly', emoji: '🦋', name: 'Butterfly', nameAr: 'الفراشة الرقيقة', badge: 'للبنات 🦋', desc: 'شخصية البنات' },
];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onSave,
  initialProfile,
  onClose,
}) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [email, setEmail] = useState(initialProfile?.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(initialProfile?.avatar || '👧');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentAvatarInfo = AVATARS.find(a => a.emoji === selectedAvatar) || AVATARS[0];

  const handleSelectAvatar = (av: (typeof AVATARS)[number]) => {
    setSelectedAvatar(av.emoji);
    playSoundEffect('click');
    speakEnglish(av.name, { rate: 0.9 });
    // If name is empty, prefill with character name for convenience
    if (!name.trim()) {
      setName(av.nameAr);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please write your name! / اكتب اسمك يا بطل!');
      playSoundEffect('tryAgain');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please write a valid Gmail address (e.g. name@gmail.com)!');
      playSoundEffect('tryAgain');
      return;
    }

    playSoundEffect('fanfare');
    playSoundEffect('star');
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });

    const profile: StudentProfile = {
      name: name.trim(),
      email: email.trim(),
      avatar: selectedAvatar,
      stars: initialProfile?.stars || 10, // 10 welcome stars!
      completedWords: initialProfile?.completedWords || [],
      completedActivities: initialProfile?.completedActivities || [],
      registeredAt: initialProfile?.registeredAt || new Date().toISOString(),
    };

    speakEnglish(`Welcome to APEX, ${name}! Let's learn English!`, {
      rate: 0.9,
      pitch: 1.2,
    });

    onSave(profile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-400 max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 text-center text-white relative">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl mb-2 shadow-inner border-2 border-white/40 animate-pulse">
            {selectedAvatar}
          </div>
          <div className="inline-flex items-center gap-1.5 bg-white/25 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black text-white mb-2 shadow-sm">
            <span>{currentAvatarInfo.nameAr}</span>
            <span>•</span>
            <span className="font-sans">{currentAvatarInfo.name}</span>
            <span>({currentAvatarInfo.badge})</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wide drop-shadow-sm">
            Welcome to APEX! 🚀
          </h2>
          <p className="text-amber-100 text-xs sm:text-sm font-medium mt-0.5">
            سجل معنا لتبدأ رحلة التعلم الممتعة!
          </p>

          <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <span>Mr. Momen Abass</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-2 rounded-2xl font-bold text-center">
              {error}
            </div>
          )}

          {/* Avatar picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black text-slate-700">
                Choose Your Character / اختر شخصيتك المفضلة:
              </label>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                {currentAvatarInfo.nameAr}
              </span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {AVATARS.map(av => {
                const isSelected = selectedAvatar === av.emoji;
                return (
                  <button
                    type="button"
                    key={av.id}
                    onClick={() => handleSelectAvatar(av)}
                    className={`p-2 rounded-2xl transition-all flex flex-col items-center justify-center border-2 relative group ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 scale-105 shadow-md ring-2 ring-amber-300'
                        : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl sm:text-2xl mb-1 filter drop-shadow-sm group-hover:scale-110 transition-transform">
                      {av.emoji}
                    </span>
                    <span className={`text-[11px] font-extrabold block truncate w-full text-center leading-tight ${
                      isSelected ? 'text-amber-900' : 'text-slate-700'
                    }`}>
                      {av.nameAr}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold block truncate w-full text-center mt-0.5">
                      {av.name}
                    </span>
                    {isSelected && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shadow">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Student's Name / اسم الطالب:
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="مثال: مريم، آسر، تسنيم، عمر..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-amber-400 focus:bg-white rounded-2xl outline-none font-bold text-slate-800 transition-all text-base"
                required
              />
            </div>
          </div>

          {/* Gmail Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google / Gmail Email / البريد الإلكتروني:
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="student@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-amber-400 focus:bg-white rounded-2xl outline-none font-bold text-slate-800 transition-all text-base"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              💡 يبقى تسجيلك محفوظاً دائماً ولن تحتاج للتسجيل مرة أخرى.
            </p>
          </div>

          {/* Gift Bonus */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3">
            <span className="text-3xl animate-bounce">🎁</span>
            <div className="text-left text-xs">
              <p className="font-extrabold text-amber-800">Welcome Gift: +10 Gold Stars! ⭐</p>
              <p className="text-amber-600">هدية تسجيل خاصة من مستر مؤمن عباس!</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-extrabold text-lg shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Start Learning Now! / ابدأ الآن</span>
          </button>

          {initialProfile && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-700 font-bold py-1"
            >
              Cancel / إلغاء
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
