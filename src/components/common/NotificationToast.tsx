import React, { useEffect } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { SmartAlert } from '../../types';

interface NotificationToastProps {
  alert: SmartAlert | null;
  onDismiss: () => void;
  onView: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  alert,
  onDismiss,
  onView,
}) => {
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 7000);
    return () => clearTimeout(timer);
  }, [alert, onDismiss]);

  if (!alert) return null;

  const isWarning = alert.type === 'Warning';
  const isAttention = alert.type === 'Attention';

  return (
    <div className="fixed top-18 right-4 sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div
        className={`p-4 rounded-2xl shadow-xl border backdrop-blur-md flex items-start space-x-3.5 ${
          isWarning
            ? 'bg-rose-50/95 dark:bg-rose-950/90 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
            : isAttention
            ? 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100'
            : 'bg-white/95 dark:bg-stone-900/90 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100'
        }`}
      >
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            isWarning
              ? 'bg-rose-600 text-white'
              : isAttention
              ? 'bg-amber-500 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {isWarning ? (
            <AlertTriangle className="w-5 h-5" />
          ) : isAttention ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-heading font-bold text-xs sm:text-sm truncate">
              {alert.title}
            </h4>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 shrink-0">
              {alert.category}
            </span>
          </div>
          <p className="text-xs opacity-90 mt-0.5 line-clamp-2 leading-relaxed">
            {alert.message}
          </p>

          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={onView}
              className="inline-flex items-center space-x-1 text-xs font-bold underline hover:no-underline"
            >
              <span>View in Alerts</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={onDismiss}
              className="text-xs opacity-75 hover:opacity-100"
            >
              Dismiss
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
