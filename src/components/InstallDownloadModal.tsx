import React, { useState } from 'react';
import { Download, Smartphone, Monitor, Share2, Copy, Check, X, QrCode, Sparkles, ExternalLink, MessageCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { TEACHER_INFO } from '../data/curriculumData';
import { playSoundEffect } from '../utils/audioUtils';

interface InstallDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallDownloadModal: React.FC<InstallDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'share' | 'offline'>('install');

  if (!isOpen) return null;

  const DEV_APP_URL = 'https://ais-dev-3srt3gxadn2wresjbriq7s-694832343874.europe-west2.run.app';
  const SHARED_APP_URL = 'https://ais-pre-3srt3gxadn2wresjbriq7s-694832343874.europe-west2.run.app';

  // Get current active URL or dev URL
  const currentUrl = (typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost') && window.location.origin.startsWith('http'))
    ? window.location.origin
    : DEV_APP_URL;

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      playSoundEffect('star');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleCopyLink = () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(currentUrl)
          .then(() => {
            setCopied(true);
            playSoundEffect('star');
            setTimeout(() => setCopied(false), 2500);
          })
          .catch(() => {
            fallbackCopyText(currentUrl);
          });
      } else {
        fallbackCopyText(currentUrl);
      }
    } catch {
      fallbackCopyText(currentUrl);
    }
  };

  const handleInstallClick = async () => {
    playSoundEffect('pop');
    await install();
  };

  const shareText = `منصة APEX التفاعلية لتعليم اللغة الإنجليزية للأطفال (4-5 سنوات) - إعداد ${TEACHER_INFO.name} (${TEACHER_INFO.phone}):\n${currentUrl}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-sky-300 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 p-5 text-white text-center relative shrink-0">
          <button
            onClick={() => {
              playSoundEffect('click');
              onClose();
            }}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl mb-2 shadow-inner border border-white/40">
            📲
          </div>
          <h3 className="text-2xl font-black tracking-wide drop-shadow-sm">
            تحميل وتثبيت تطبيق APEX 🚀
          </h3>
          <p className="text-sky-100 text-xs sm:text-sm font-medium mt-1">
            خطوات بسيطة لتشغيل التطبيق على الهاتف أو الكمبيوتر كأنه تطبيق أصلي!
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 gap-1 shrink-0">
          <button
            onClick={() => {
              setActiveTab('install');
              playSoundEffect('click');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'install'
                ? 'bg-white text-sky-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-4 h-4 text-sky-500" />
            <span>طريقة التثبيت</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('share');
              playSoundEffect('click');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'share'
                ? 'bg-white text-sky-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-4 h-4 text-purple-500" />
            <span>مشاركة للطلاب</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('offline');
              playSoundEffect('click');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'offline'
                ? 'bg-white text-sky-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-500" />
            <span>رمز QR سريع</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-right">
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* Direct Install Button if supported */}
              {isInstallable && (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-center">
                  <p className="font-extrabold text-emerald-900 text-sm mb-2">
                    متصفحك يدعم التثبيت الفوري بضغطة واحدة! 🎉
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-base shadow-lg shadow-emerald-200 hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>اضغط هنا لتثبيت التطبيق الآن</span>
                  </button>
                </div>
              )}

              {isInstalled && (
                <div className="bg-sky-50 border border-sky-300 text-sky-900 p-3 rounded-2xl text-center font-bold text-sm">
                  ✅ التطبيق مثبت بالفعل ويعمل كبرنامج منفصل على جهازك!
                </div>
              )}

              {/* Instructions by Device */}
              <div className="space-y-3">
                {/* Android Section */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="text-right flex-1">
                    <h4 className="font-black text-slate-800 text-sm">
                      📱 لهواتف أندرويد (Android / Samsung / Xiaomi):
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      1. افتح الرابط في متصفح <strong>Google Chrome</strong>.<br />
                      2. اضغط على الثلاث نقاط <strong>(⋮)</strong> بأعلى المتصفح.<br />
                      3. اختر <strong>"تثبيت التطبيق" (Install App)</strong> أو <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home screen)</strong>.<br />
                      4. سيظهر أيقونة صاروخ APEX فوراً على شاشة هاتفك مثل أي تطبيق!
                    </p>
                  </div>
                </div>

                {/* iPhone / iPad Section */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="text-right flex-1">
                    <h4 className="font-black text-slate-800 text-sm">
                      🍏 لهواتف آيفون وآيباد (iPhone / iPad):
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      1. افتح الرابط في متصفح <strong>Safari</strong>.<br />
                      2. اضغط على زر المشاركة <strong>(Share / مربع به سهم لأعلى ⎋)</strong> بالأسفل.<br />
                      3. مرر للأسفل واختر <strong>"إضافة إلى الشاشة الرئيسية" (Add to Home Screen ➕)</strong>.<br />
                      4. اضغط <strong>"إضافة" (Add)</strong> بالأعلى لتجد التطبيق على شاشتك.
                    </p>
                  </div>
                </div>

                {/* PC / Laptop Section */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div className="text-right flex-1">
                    <h4 className="font-black text-slate-800 text-sm">
                      💻 للكمبيوتر واللابتوب (Windows / Mac):
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      1. افتح الموقع في متصفح <strong>Google Chrome</strong> أو <strong>Microsoft Edge</strong>.<br />
                      2. ستجد أيقونة تثبيت صغيرة <strong>(كمبيوتر بسهم 📥)</strong> في شريط العنوان بالأعلى.<br />
                      3. اضغط عليها واختر <strong>"Install / تثبيت"</strong> وسيفتح في نافذة مستقلة وسريعة!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
                <h4 className="font-black text-amber-900 text-base mt-1">
                  أرسل الرابط لأولياء الأمور والطلاب
                </h4>
                <p className="text-xs text-amber-700 mt-1">
                  يمكنهم فتح الرابط وتثبيته فوراً على هواتفهم بدون متجر تطبيقات!
                </p>
              </div>

              {/* Copy URL Box */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  🔗 الرابط المباشر للتطبيق:
                </label>
                <div className="bg-slate-100 p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                  </button>
                  <span className="text-xs text-slate-600 font-mono truncate max-w-[240px] text-left ltr select-all" dir="ltr">
                    {currentUrl}
                  </span>
                </div>
              </div>

              {/* Note on Not Found / Share Button */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-right text-xs">
                <p className="font-extrabold text-amber-900 mb-1">
                  💡 ملحوظة هامة إذا ظهرت رسالة Not Found:
                </p>
                <p className="text-amber-800 leading-relaxed">
                  إذا فتحت رابط المشاركة العام وظهرت رسالة Not Found، كل ما عليك هو الضغط على زر <strong>Share (مشاركة)</strong> في أعلى يمين شاشة منصة Google AI Studio لتفعيل الرابط العام ليفتح عند جميع الطلاب بدون أي مشاكل!
                </p>
              </div>

              {/* WhatsApp Share Button */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>إرسال عبر الواتساب لأولياء الأمور</span>
              </a>
            </div>
          )}

          {activeTab === 'offline' && (
            <div className="text-center space-y-4">
              <p className="text-xs font-bold text-slate-600">
                امسح الرمز بكاميرا الهاتف ليفتح التطبيق مباشرة:
              </p>
              <div className="bg-slate-50 p-4 rounded-3xl border-2 border-slate-200 inline-block shadow-sm">
                <img
                  src={qrUrl}
                  alt="APEX App QR Code"
                  className="w-44 h-44 mx-auto rounded-xl"
                />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                يعمل على جميع كاميرات الهواتف الذكية الحديثة
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="text-right text-[11px] text-slate-500 font-bold">
            <span>إعداد: {TEACHER_INFO.name}</span>
            <span className="mx-1">•</span>
            <span>{TEACHER_INFO.phone}</span>
          </div>
          <button
            onClick={() => {
              playSoundEffect('click');
              onClose();
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
