import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  Sun,
  Target,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
  Smartphone,
  Eye,
} from 'lucide-react';
import { Language } from '../../types';

interface CameraPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionGranted: () => void;
  lang?: Language;
}

export const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({
  isOpen,
  onClose,
  onPermissionGranted,
  lang = 'en',
}) => {
  const [requesting, setRequesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    setRequesting(true);
    setErrorMessage(null);

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error(
          'Your browser does not support direct camera capture. You can still upload plant photos from your gallery.'
        );
      }

      // Request camera stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      // Stop stream immediately after permission check
      stream.getTracks().forEach((track) => track.stop());

      setStatus('granted');
      localStorage.setItem('agrifarm_camera_permission', 'granted');

      setTimeout(() => {
        onPermissionGranted();
        onClose();
      }, 700);
    } catch (err: any) {
      console.warn('Camera permission request result:', err);
      setStatus('denied');
      localStorage.setItem('agrifarm_camera_permission', 'denied');
      setErrorMessage(
        err?.message?.includes('Permission denied') || err?.name === 'NotAllowedError'
          ? 'Camera access was blocked by your browser. You can click the lock or camera icon in your address bar to allow it, or choose photos from your gallery.'
          : err?.message || 'Unable to start camera stream. You can still upload photos from your device storage.'
      );
    } finally {
      setRequesting(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('agrifarm_camera_permission', 'dismissed');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-5">
        {/* Subtle decorative background glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Close */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold">
            <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {lang === 'lg' ? 'Kamera y’Ebirime' : lang === 'sw' ? 'Ruhusa ya Kamera' : 'Plant Health Scanner'}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plantix-Inspired Visual Guidance Graphic */}
        <div className="relative mx-auto w-32 h-32 rounded-3xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-green-400 p-1 shadow-xl shadow-emerald-900/30 flex items-center justify-center">
          <div className="w-full h-full bg-stone-900 rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden">
            {/* Viewfinder crosshairs */}
            <div className="absolute inset-3 border border-dashed border-emerald-400/50 rounded-xl pointer-events-none" />
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />

            {/* Scanning beam animation */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse top-1/2 -translate-y-1/2" />

            <Camera className="w-10 h-10 text-emerald-300 relative z-10" />
            <span className="text-[10px] font-bold text-emerald-200 tracking-wider uppercase mt-1">
              Focus & Scan
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center space-y-1.5">
          <h3 className="font-heading font-extrabold text-xl text-stone-900 dark:text-stone-100">
            {lang === 'lg'
              ? 'Lekera Kamera Okukebera Ebirime'
              : lang === 'sw'
              ? 'Ruhusu Kamera Kukagua Mazao'
              : 'Enable Camera for Plant Health Diagnostics'}
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
            {lang === 'lg'
              ? 'Agrifarm AI yeetaaga kamera okukwata ebifaananyi by’ebikoola, ebiwuka n’endwadde ku ffaamu yo.'
              : lang === 'sw'
              ? 'Agrifarm AI inahitaji idhini ya kamera ili kupiga picha majani yaliyoathirika na kugundua magonjwa mara moja.'
              : 'Agrifarm AI needs camera access so you can photograph affected leaves, stems, and pests for instant AI diagnosis in the field.'}
          </p>
        </div>

        {/* 3 Practical Photography Tips (Like Plantix visual tips) */}
        <div className="bg-stone-50 dark:bg-stone-950 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>
              {lang === 'lg'
                ? 'Amagezi g’okukwata ebifaananyi ebirungi:'
                : lang === 'sw'
                ? 'Mbinu za picha safi na sahihi:'
                : 'Tips for accurate diagnosis:'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
            <div className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 flex items-start space-x-2">
              <Sun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
                  {lang === 'lg' ? 'Omusana Omutuufu' : lang === 'sw' ? 'Mwanga wa Jua' : 'Good Sunlight'}
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                  Avoid harsh dark shadows.
                </div>
              </div>
            </div>

            <div className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 flex items-start space-x-2">
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
                  {lang === 'lg' ? 'Kumpi 15-20cm' : lang === 'sw' ? 'Karibu 15-20cm' : '15-20cm Away'}
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                  Center on affected leaf spots.
                </div>
              </div>
            </div>

            <div className="p-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200/80 dark:border-stone-800 flex items-start space-x-2">
              <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
                  {lang === 'lg' ? 'Gguma Oteere' : lang === 'sw' ? 'Shikilia Imara' : 'Steady Focus'}
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                  Keep still for crisp leaf veins.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback messages */}
        {status === 'granted' && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">Camera access granted! Launching plant scanner...</span>
          </div>
        )}

        {status === 'denied' && errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 text-xs rounded-xl flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleRequestPermission}
            disabled={requesting || status === 'granted'}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            <span>
              {requesting
                ? 'Requesting Camera...'
                : status === 'granted'
                ? 'Camera Ready!'
                : 'Allow Camera Access'}
            </span>
          </button>

          <button
            onClick={handleSkip}
            className="w-full py-2.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-semibold transition-colors"
          >
            I'll Enable It Later · Choose from Gallery
          </button>
        </div>

        <div className="flex items-center justify-center space-x-1.5 text-[10px] text-stone-400 dark:text-stone-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Photos are analyzed securely for crop health without sharing personal data.</span>
        </div>
      </div>
    </div>
  );
};
