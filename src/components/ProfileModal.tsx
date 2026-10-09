import React, { useState } from 'react';
import { Star, Trophy, Award, X, Sparkles, Lock, CheckCircle, Printer, ArrowRight, BookOpen, LogOut } from 'lucide-react';
import { StudentProfile, Mission } from '../types/curriculum';
import { TEACHER_INFO } from '../data/curriculumData';
import { playSoundEffect } from '../utils/audioUtils';
import { CertificateModal } from './CertificateModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile | null;
  missions: Mission[];
  onEditProfile: () => void;
  onResetProgress: () => void;
  onLogout: () => void;
  onOpenDownload: () => void;
  onSelectMission?: (missionId: number) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  missions,
  onEditProfile,
  onResetProgress,
  onLogout,
  onOpenDownload,
  onSelectMission,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates'>('overview');
  const [selectedCertificateMission, setSelectedCertificateMission] = useState<Mission | null>(null);

  if (!isOpen || !profile) return null;

  // Calculate unlocked certificates
  const missionStatuses = missions.map(mission => {
    const totalActivities = mission.activities.length;
    const completedCount = mission.activities.filter(act =>
      profile.completedActivities.includes(act.id)
    ).length;
    const isCompleted = totalActivities > 0 && completedCount === totalActivities;

    return {
      mission,
      totalActivities,
      completedCount,
      isCompleted,
    };
  });

  const unlockedCount = missionStatuses.filter(m => m.isCompleted).length;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-5 text-center text-white relative shrink-0">
            <button
              onClick={() => {
                playSoundEffect('click');
                onClose();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl mb-2 shadow-inner border-2 border-white/40">
              {profile.avatar}
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-wide drop-shadow-sm">
              {profile.name} ⭐
            </h3>
            <p className="text-amber-100 text-xs font-bold font-mono">
              {profile.email}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 gap-1 shrink-0">
            <button
              onClick={() => {
                setActiveTab('overview');
                playSoundEffect('click');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📊 نظرة عامة (Overview)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('certificates');
                playSoundEffect('click');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 relative ${
                activeTab === 'certificates'
                  ? 'bg-white text-amber-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>الشهادات (Certificates)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                unlockedCount > 0 ? 'bg-amber-500 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
              }`}>
                {unlockedCount}/{missions.length}
              </span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 overflow-y-auto space-y-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* 3 Main Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
                      <Star className="w-5 h-5 fill-amber-400" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-amber-900 block font-sans">
                      {profile.stars}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700">Stars ⭐</span>
                  </div>

                  <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-purple-500 mb-0.5">
                      <Trophy className="w-5 h-5 fill-purple-100" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-purple-900 block font-sans">
                      {profile.completedWords.length}
                    </span>
                    <span className="text-[11px] font-bold text-purple-700">Words ✏️</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('certificates');
                      playSoundEffect('pop');
                    }}
                    className="bg-gradient-to-br from-amber-100 to-yellow-100 hover:from-amber-200 hover:to-yellow-200 border-2 border-amber-300 rounded-2xl p-3 text-center transition-transform hover:scale-102 active:scale-98"
                  >
                    <div className="flex items-center justify-center gap-1 text-amber-600 mb-0.5">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-amber-950 block font-sans">
                      {unlockedCount}
                    </span>
                    <span className="text-[11px] font-black text-amber-800">Awards 📜</span>
                  </button>
                </div>

                {/* Certificates Teaser Banner */}
                <div
                  onClick={() => {
                    setActiveTab('certificates');
                    playSoundEffect('pop');
                  }}
                  className="cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl p-4 shadow-md flex items-center justify-between gap-3 hover:scale-101 active:scale-99 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎖️</span>
                    <div className="text-right">
                      <p className="font-black text-sm">
                        {unlockedCount > 0
                          ? `لديك ${unlockedCount} شهادة تفوق جاهزة للطباعة! 📜`
                          : 'قسم شهادات التفوق والتميز الرسمي 🎓'}
                      </p>
                      <p className="text-amber-100 text-xs mt-0.5">
                        اضغط هنا لعرض الشهادات وطباعتها باسم الطالب وتوقيع المعلم
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/90 shrink-0" />
                </div>

                {/* Teacher Mentorship Note */}
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400 text-white flex items-center justify-center text-xl shrink-0">
                    👨‍🏫
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-extrabold text-slate-800">Teacher: {TEACHER_INFO.name}</p>
                    <p className="text-slate-500 font-bold">Contact: {TEACHER_INFO.phone}</p>
                  </div>
                </div>

                {/* Download App on Phone / PC */}
                <button
                  onClick={() => {
                    playSoundEffect('pop');
                    onClose();
                    onOpenDownload();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>📲</span>
                  <span>تحميل وتثبيت التطبيق على الجهاز</span>
                </button>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        playSoundEffect('click');
                        onEditProfile();
                      }}
                      className="flex-1 py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold text-xs shadow-md transition-all text-center"
                    >
                      Edit Profile / تعديل البيانات
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Reset progress and stars? هل تريد تصفير النقاط والشهادات؟')) {
                          onResetProgress();
                        }
                      }}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-500 rounded-2xl font-bold text-xs transition-all"
                      title="Reset progress"
                    >
                      Reset / تصفير
                    </button>
                  </div>

                  {/* Sign Out / Switch Student Button */}
                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد تسجيل الخروج وتبديل الطالب؟ (Log Out / Switch Student)')) {
                        playSoundEffect('pop');
                        onLogout();
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 hover:text-rose-800 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-xs"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>تسجيل الخروج / تبديل الطالب (Sign Out)</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="space-y-3.5">
                {/* Certificates Description Banner */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-3.5 text-right">
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl mt-0.5">📜</span>
                    <div>
                      <h4 className="font-black text-slate-800 text-xs sm:text-sm">
                        شهادات التقدير والتميز الرسمية (Printable Awards)
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                        عندما يُكمل الطفل جميع تمارين وأنشطة أي <strong>Mission</strong>، يتم فتح شهادة تقدير معتمدة وفورية باسمه وتوقيع <strong>{TEACHER_INFO.name}</strong>، جاهزة للطباعة والاحتفاظ بها كـ PDF! 🖨️
                      </p>
                    </div>
                  </div>
                </div>

                {/* List of Missions with Certificate Status */}
                <div className="space-y-2.5">
                  {missionStatuses.map(({ mission, totalActivities, completedCount, isCompleted }) => {
                    const percentage = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0;

                    return (
                      <div
                        key={mission.id}
                        className={`rounded-2xl p-3.5 border-2 transition-all text-right flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCompleted
                            ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50/80 border-amber-300 shadow-sm'
                            : 'bg-slate-50/80 border-slate-200 opacity-90'
                        }`}
                      >
                        {/* Mission Info */}
                        <div className="flex items-start sm:items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm border ${
                            isCompleted
                              ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 border-amber-200 text-white'
                              : 'bg-slate-200/80 border-slate-300 text-slate-400'
                          }`}>
                            {mission.badgeEmoji}
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-1.5 justify-end sm:justify-start">
                              <span className="text-xs font-black text-slate-900 font-sans">
                                Mission {mission.missionNumber}: {mission.title}
                              </span>
                              {isCompleted && (
                                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>مكتمل</span>
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] font-bold text-slate-600 mt-0.5">
                              {mission.arabicTitle}
                            </p>

                            {/* Progress info */}
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="w-24 sm:w-28 bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-500 ${
                                    isCompleted ? 'bg-amber-500' : 'bg-sky-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 font-mono">
                                {completedCount}/{totalActivities} تمارين ({percentage}%)
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="shrink-0 flex items-center justify-end">
                          {isCompleted ? (
                            <button
                              onClick={() => {
                                setSelectedCertificateMission(mission);
                                playSoundEffect('star');
                              }}
                              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 rounded-xl text-xs font-black shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>عرض وطباعة الشهادة 📜</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                playSoundEffect('click');
                                onClose();
                                if (onSelectMission) {
                                  onSelectMission(mission.id);
                                }
                              }}
                              className="w-full sm:w-auto px-3.5 py-2 bg-slate-200 hover:bg-sky-100 hover:text-sky-800 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                            >
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                              <span>أكمل تمارين Mission {mission.missionNumber} 🚀</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 shrink-0">
            <span>إشراف وتدريس: {TEACHER_INFO.name}</span>
            <button
              onClick={() => {
                playSoundEffect('click');
                onClose();
              }}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>

      {/* Printable Award Card Modal */}
      {selectedCertificateMission && (
        <CertificateModal
          isOpen={!!selectedCertificateMission}
          onClose={() => setSelectedCertificateMission(null)}
          mission={selectedCertificateMission}
          studentName={profile.name}
          studentAvatar={profile.avatar}
        />
      )}
    </>
  );
};
