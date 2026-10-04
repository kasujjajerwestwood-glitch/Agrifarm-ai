import React, { useState } from 'react';
import {
  Layers,
  Sprout,
  Camera,
  Sparkles,
  User,
  Menu,
  X,
  AlertTriangle,
  Activity,
  History,
  FileText,
  Settings,
  Cpu,
  ShieldCheck,
  Sun,
  Moon,
  BookOpen,
  Database,
} from 'lucide-react';
import { Language, ThemeMode } from '../../types';
import { t } from '../../services/i18n';
import { SupabaseService } from '../../services/supabase';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  unreadAlertsCount: number;
  lang: Language;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onOpenGuide?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  setCurrentTab,
  unreadAlertsCount,
  lang,
  theme,
  onToggleTheme,
  onOpenGuide,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSupabaseConnected = SupabaseService.isConfigured();

  // Simple 5-item mobile navigation structure (Plantix-inspired scan-first UX)
  const navItems = [
    {
      id: 'dashboard',
      label: lang === 'lg' ? 'Wano' : lang === 'sw' ? 'Nyumbani' : 'Home',
      icon: Layers,
    },
    {
      id: 'crops',
      label: lang === 'lg' ? 'Ebirime' : lang === 'sw' ? 'Mazao' : 'Crops',
      icon: Sprout,
    },
    {
      id: 'scan',
      label: lang === 'lg' ? 'Kuba' : lang === 'sw' ? 'Pima' : 'Scan',
      icon: Camera,
      isScanHero: true,
    },
    {
      id: 'assistant',
      label: lang === 'lg' ? 'AI' : lang === 'sw' ? 'AI' : 'Agrifarm AI',
      icon: Sparkles,
    },
    {
      id: 'more',
      label: lang === 'lg' ? 'Ebirala' : lang === 'sw' ? 'Zaidi' : 'More',
      icon: Menu,
      isMore: true,
    },
  ];

  const drawerItems = [
    { id: 'profile', label: t(lang, 'profile'), icon: User },
    {
      id: 'research',
      label:
        lang === 'lg'
          ? 'Okunoonyereza n’Ebirime'
          : lang === 'sw'
          ? 'Kanzidata ya Mazao na Wadudu'
          : 'Disease & Pest Library',
      icon: BookOpen,
      badge: 'Library',
    },
    { id: 'fields', label: t(lang, 'fields'), icon: Layers },
    { id: 'activities', label: t(lang, 'activities'), icon: Activity },
    { id: 'history', label: t(lang, 'scanHistory'), icon: History },
    { id: 'alerts', label: t(lang, 'alerts'), icon: AlertTriangle, badge: unreadAlertsCount ? `${unreadAlertsCount}` : undefined },
    { id: 'monitoring', label: t(lang, 'monitoring'), icon: Cpu, badge: 'IoT' },
    { id: 'reports', label: t(lang, 'reports'), icon: FileText },
    { id: 'settings', label: t(lang, 'settings'), icon: Settings },
  ];

  const handleTabClick = (tabId: string, isMore?: boolean) => {
    if (isMore) {
      setDrawerOpen(true);
    } else {
      setCurrentTab(tabId);
      setDrawerOpen(false);
    }
  };

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <>
      {/* Slide-over menu for "More" tools */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setDrawerOpen(false)}
          ></div>
          <div className="relative bg-white dark:bg-stone-900 rounded-t-3xl p-5 shadow-2xl z-10 border-t border-stone-200 dark:border-stone-800 max-h-[82vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-heading font-extrabold text-base text-stone-900 dark:text-stone-100">
                {lang === 'lg'
                  ? 'Ebikozesebwa ku Ffaamu'
                  : lang === 'sw'
                  ? 'Zana za Usimamizi wa Shamba'
                  : 'Farm Management Tools'}
              </h3>

              <div className="flex items-center space-x-2">
                {onToggleTheme && (
                  <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                    title="Toggle Theme"
                  >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
                  </button>
                )}

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Supabase Status Banner inside drawer */}
            <div className="my-3">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  if (onOpenGuide) onOpenGuide();
                }}
                className={`w-full p-3 rounded-2xl border text-xs flex items-center justify-between transition-colors ${
                  isSupabaseConnected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <Database className="w-4 h-4 shrink-0" />
                  <span className="font-bold truncate">
                    {isSupabaseConnected ? 'Supabase PostgreSQL: Active' : 'Supabase Setup: Incomplete'}
                  </span>
                </div>
                <span className="text-[11px] underline font-bold shrink-0">
                  {isSupabaseConnected ? 'View' : 'Complete Setup'}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-2">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`p-3.5 rounded-2xl flex flex-col items-start transition-all relative ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold'
                        : 'bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-100 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-500 dark:text-stone-400'}`} />
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-lg border-t border-stone-200 dark:border-stone-800 md:hidden px-2 pb-safe pt-1">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            if (item.isScanHero) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
                  aria-label="Scan Plant"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 flex items-center justify-center text-white shadow-xl shadow-emerald-700/40 border-4 border-white dark:border-stone-900 transform active:scale-95 transition-transform group-hover:scale-105">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id, item.isMore)}
                className={`flex flex-col items-center justify-center w-14 h-full py-1 transition-all ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 font-medium'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  {item.id === 'more' && unreadAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-600"></span>
                  )}
                </div>
                <span className="text-[10px] mt-1 leading-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
