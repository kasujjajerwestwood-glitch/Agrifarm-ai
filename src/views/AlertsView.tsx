import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Bell,
  Filter,
  Check,
  Trash2,
  Calendar,
  Info,
  AlertCircle,
  Volume2,
  VolumeX,
  Send,
  Plus,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { SmartAlert, AlertType, Language } from '../types';
import { NotificationService } from '../services/notificationService';

interface AlertsViewProps {
  alerts: SmartAlert[];
  onMarkRead: (id: string) => void;
  onClearAlert: (id: string) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
  onTriggerTestAlert?: () => void;
  onNavigateToCrop?: (cropId: string) => void;
  lang: Language;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  onMarkRead,
  onClearAlert,
  onMarkAllRead,
  onClearAll,
  onTriggerTestAlert,
  onNavigateToCrop,
  lang,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    NotificationService.getPermission()
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(NotificationService.isSoundEnabled());
  const [permissionMsg, setPermissionMsg] = useState<string | null>(null);

  useEffect(() => {
    setBrowserPermission(NotificationService.getPermission());
  }, []);

  const handleRequestPermission = async () => {
    const res = await NotificationService.requestPermission();
    setBrowserPermission(res);
    if (res === 'granted') {
      NotificationService.sendNotification('AgriFarm Uganda Notifications Enabled! 🌾', {
        body: 'You will receive real-time crop disease alerts and weather updates.',
        severity: 'success',
      });
      setPermissionMsg('Browser notifications enabled successfully!');
    } else if (res === 'denied') {
      setPermissionMsg('Notifications are blocked by your browser settings. Please allow notifications in site permissions.');
    }
    setTimeout(() => setPermissionMsg(null), 4000);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    NotificationService.setSoundEnabled(next);
    if (next) {
      NotificationService.playAlertChime('info');
    }
  };

  const filtered = alerts.filter((a) => {
    const matchCat = filterCategory === 'all' || a.category === filterCategory;
    const matchType = filterType === 'all' || a.type === filterType;
    return matchCat && matchType;
  });

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-full mb-1 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Farm Intelligence Notifications</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
            Smart Alerts & Advisories
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Automated notifications triggered by AI plant scans, weather changes, and soil moisture sensors.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {onMarkAllRead && unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="px-3.5 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition-colors"
            >
              Mark All as Read
            </button>
          )}

          {onClearAll && alerts.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all alerts?')) onClearAll();
              }}
              className="px-3.5 py-2 border border-stone-200 dark:border-stone-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Notification Controller Card */}
      <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
                  Notification Dispatcher Status
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    browserPermission === 'granted'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : browserPermission === 'denied'
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {browserPermission === 'granted'
                    ? 'Browser Push Active'
                    : browserPermission === 'denied'
                    ? 'Push Blocked in Browser'
                    : 'Push Not Configured'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Ensure browser notifications and sound chimes are enabled so you receive critical pest alerts promptly.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {browserPermission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Enable Browser Alerts</span>
              </button>
            )}

            <button
              onClick={handleToggleSound}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-1.5 ${
                soundEnabled
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                  : 'border-stone-300 dark:border-stone-700 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={soundEnabled ? 'Mute alert sound chimes' : 'Unmute alert sound chimes'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Chimes On' : 'Chimes Muted'}</span>
            </button>

            {onTriggerTestAlert && (
              <button
                onClick={onTriggerTestAlert}
                className="px-3.5 py-2 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Alert Notification</span>
              </button>
            )}
          </div>
        </div>

        {permissionMsg && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-900 dark:text-emerald-300 font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{permissionMsg}</span>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="flex items-center space-x-3">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 text-xs border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-stone-800 font-medium text-stone-700 dark:text-stone-200"
          >
            <option value="all">All Categories</option>
            <option value="disease">Diseases</option>
            <option value="pest">Pests</option>
            <option value="weather">Weather</option>
            <option value="soil">Soil & Irrigation</option>
            <option value="task">Farm Tasks</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-stone-800 font-medium text-stone-700 dark:text-stone-200"
          >
            <option value="all">All Severities</option>
            <option value="Warning">Warning (High Urgency)</option>
            <option value="Attention">Attention (Medium)</option>
            <option value="Information">Information</option>
          </select>
        </div>

        <div className="text-xs font-bold text-stone-600 dark:text-stone-400 px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
          {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''} ({filtered.length} shown)
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`p-5 rounded-3xl border transition-all ${
              !alert.isRead ? 'shadow-xs ring-1 ring-emerald-500/20' : 'opacity-90'
            } ${
              alert.type === 'Warning'
                ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
                : alert.type === 'Attention'
                ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    alert.type === 'Warning'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : alert.type === 'Attention'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {alert.type === 'Warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : alert.type === 'Attention' ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Info className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
                      {alert.title}
                    </h3>
                    {!alert.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed max-w-3xl">
                    {alert.message}
                  </p>
                  <div className="flex items-center space-x-3 text-[11px] text-stone-400 pt-1">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(alert.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                    <span className="uppercase font-mono text-[10px] font-bold text-stone-500 dark:text-stone-400 bg-stone-200/60 dark:bg-stone-800 px-1.5 py-0.5 rounded">
                      {alert.category}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400">
                      Priority: {alert.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {!alert.isRead && (
                  <button
                    onClick={() => onMarkRead(alert.id)}
                    className="p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-bold transition-colors flex items-center space-x-1 shadow-2xs"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="hidden sm:inline">Mark Read</span>
                  </button>
                )}
                <button
                  onClick={() => onClearAlert(alert.id)}
                  className="p-2 rounded-xl text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Dismiss alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-base font-heading font-bold text-stone-800 dark:text-stone-200">No Active Alerts</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
              All farm sectors, weather forecasts, and crop health parameters are within normal healthy ranges.
            </p>
            {onTriggerTestAlert && (
              <button
                onClick={onTriggerTestAlert}
                className="mt-4 px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl transition-colors inline-flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Sample Test Alert</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
