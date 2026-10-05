import React, { useState } from 'react';
import {
  Settings,
  User,
  Globe,
  Database,
  Download,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Bell,
  Lock,
  Cloud,
  CheckCircle2,
  FileJson,
  Key,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Palette,
} from 'lucide-react';
import { UserProfile, Language, ThemeMode } from '../types';
import { StorageService } from '../services/storageService';
import { SupabaseService } from '../services/supabase';
import { ThemeService, ACCENT_THEMES, ColorAccent } from '../services/themeService';
import { SupabaseSetupGuideModal } from '../components/modals/SupabaseSetupGuideModal';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  onResetData: () => void;
  onWipeData: () => void;
  onOpenAuth: () => void;
  onSignOut?: () => void;
  onNavigate?: (tab: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  lang,
  setLang,
  theme,
  setTheme,
  onResetData,
  onWipeData,
  onOpenAuth,
  onSignOut,
  onNavigate,
}) => {
  const currentSupabase = SupabaseService.getConfig();
  const [supabaseConfig, setSupabaseConfig] = useState(currentSupabase);
  const [sbSaved, setSbSaved] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [accent, setAccent] = useState<ColorAccent>(ThemeService.getColorAccent());

  const handleSelectAccent = (newAccent: ColorAccent) => {
    setAccent(newAccent);
    ThemeService.setColorAccent(newAccent);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    SupabaseService.saveConfig({
      url: supabaseConfig.url.trim(),
      anonKey: supabaseConfig.anonKey.trim(),
    });
    setSbSaved(true);
    setTimeout(() => setSbSaved(false), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = StorageService.exportFullData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrifarm_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 text-xs font-bold rounded-full mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>System & Preferences</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
          Application Settings
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
          Manage your farmer profile, display theme, regional language, and cloud data synchronization.
        </p>
      </div>

      {exportNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center space-x-2 text-emerald-900 dark:text-emerald-300 text-xs font-bold animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Complete farm archive exported to JSON successfully!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center justify-center font-bold text-lg">
                {user.name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100">
                {user.name}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">{user.email}</p>
              <div className="flex items-center space-x-2 text-[11px] text-stone-400 mt-0.5">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{user.farmerType}</span>
                <span>• {user.district}, {user.country}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onNavigate && (
              <button
                onClick={() => onNavigate('profile')}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                View Full Profile
              </button>
            )}
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold transition-colors"
            >
              Switch Account
            </button>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 rounded-xl text-xs font-bold transition-colors border border-rose-200 dark:border-rose-900"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* THEME & APPEARANCE (Light, Dark, System) */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100 flex items-center space-x-2">
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Display & Theme Appearance</span>
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          Choose a visual theme. Dark mode provides high contrast and reduced eye strain during nighttime farm inspections and field scouting.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            {
              id: 'light' as ThemeMode,
              title: 'Light Theme',
              desc: 'Clean paper & emerald tones for daylight use',
              icon: Sun,
              previewBg: 'bg-stone-100 border-stone-300 text-stone-900',
            },
            {
              id: 'dark' as ThemeMode,
              title: 'Dark Theme',
              desc: 'Deep OLED contrast for night & field scouting',
              icon: Moon,
              previewBg: 'bg-stone-950 border-stone-800 text-stone-100',
            },
            {
              id: 'system' as ThemeMode,
              title: 'System Default',
              desc: 'Automatically matches your device OS theme',
              icon: Monitor,
              previewBg: 'bg-gradient-to-r from-stone-100 to-stone-900 border-stone-400 text-stone-800',
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTheme(item.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/60 text-stone-800 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-white dark:bg-stone-800 shadow-2xs text-stone-700 dark:text-stone-300">
                    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
                  )}
                </div>
                <div className="text-sm font-heading font-bold">{item.title}</div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 font-normal mt-0.5 leading-snug">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AGRICULTURAL COLOR PALETTES / THEMES */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Farm Theme Colors & Visual Accents</span>
          </h3>
          <span className="text-xs px-2.5 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-600 dark:text-stone-300 font-bold capitalize">
            Active: {accent}
          </span>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          Personalize the look of AgriFarm Uganda with natural agricultural color palettes inspired by crops, soils, and sunlight.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {ACCENT_THEMES.map((opt) => {
            const isSelected = accent === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectAccent(opt.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex items-start space-x-3 ${
                  isSelected
                    ? 'border-stone-900 dark:border-white bg-stone-50 dark:bg-stone-800/80 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-white shadow-sm font-bold text-xs"
                  style={{ backgroundColor: opt.dotColor }}
                >
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-heading font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between">
                    <span>{opt.name}</span>
                    {isSelected && (
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-600 dark:text-emerald-400">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 leading-snug line-clamp-2 mt-0.5">
                    {opt.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language Preferences */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-3">
        <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100 flex items-center space-x-2">
          <Globe className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Regional Language Configuration</span>
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          Select your preferred interface language. The agricultural taxonomy and diagnosis instructions adapt to regional dialects.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { code: 'en', title: 'English', desc: 'Official Agricultural Standard' },
            { code: 'lg', title: 'Luganda', desc: 'Central & Lake Victoria Region' },
            { code: 'sw', title: 'Kiswahili', desc: 'East & Central Africa Community' },
          ].map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code as Language)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                lang === l.code
                  ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20'
                  : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-300'
              }`}
            >
              <div className="text-sm font-heading font-bold">{l.title}</div>
              <div className="text-[10px] text-stone-400 font-normal mt-0.5">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Supabase Cloud & PostgreSQL Database Bridge */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Supabase Cloud PostgreSQL & Storage Synchronization</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
              By default, Agrifarm Uganda operates offline-first with resilient local browser persistence. Connect your Supabase project (URL & Anon API Key) for real-time cloud multi-user profiles, Row Level Security, and image storage.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="px-3.5 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Supabase Setup & SQL Guide</span>
          </button>
        </div>

        <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={supabaseConfig.url}
                onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                placeholder="https://xxxxxxxxxxxx.supabase.co"
                className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                type="text"
                value={supabaseConfig.anonKey}
                onChange={(e) => setSupabaseConfig({ ...supabaseConfig, anonKey: e.target.value })}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
            >
              Save Supabase Configuration
            </button>
            {sbSaved && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Supabase configuration saved & connected!</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Data Backup & Privacy */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
        <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100 flex items-center space-x-2">
          <Database className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Data Portability & Farm Records Backup</span>
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          You own your agricultural data. Download your complete farm dossier including crop records, activities, field boundaries, and AI plant scans as a standardized JSON backup.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleDownloadBackup}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Farm Backup (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to default initial state?')) {
                onResetData();
              }
            }}
            className="flex items-center space-x-2 px-4 py-2.5 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset to Sample Data</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to wipe all local farm records? This cannot be undone.')) {
                onWipeData();
              }
            }}
            className="flex items-center space-x-2 px-4 py-2.5 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs rounded-xl transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Wipe All Local Data</span>
          </button>
        </div>
      </div>

      {/* Privacy Policy Disclosure */}
      <div className="p-5 bg-stone-50 dark:bg-stone-900/60 rounded-3xl border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 space-y-2 leading-relaxed">
        <div className="flex items-center space-x-2 font-bold text-stone-800 dark:text-stone-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          <span>Agricultural Privacy & Multimodal AI Disclosure</span>
        </div>
        <p>
          Uploaded plant photographs are transmitted securely to Google Gemini Multimodal Vision API strictly for agricultural diagnosis. Agrifarm Uganda does not sell or distribute personal farmer records to third-party advertisers. All diagnostic findings are saved locally or to your authenticated Supabase PostgreSQL cloud database.
        </p>
      </div>

      {/* Supabase Setup Guide Modal */}
      <SupabaseSetupGuideModal
        isOpen={guideOpen}
        onClose={() => setGuideOpen(false)}
      />
    </div>
  );
};
