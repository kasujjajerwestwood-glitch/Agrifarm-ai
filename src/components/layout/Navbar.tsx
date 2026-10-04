import React from 'react';
import {
  Sprout,
  Wifi,
  WifiOff,
  Bell,
  Globe,
  User,
  ShieldCheck,
  ChevronDown,
  Camera,
  Layers,
  Sparkles,
  Activity,
  AlertTriangle,
  History,
  FileText,
  Settings,
  Cpu,
  Sun,
  Moon,
  BookOpen,
} from 'lucide-react';
import { UserProfile, Farm, Language, ThemeMode } from '../../types';
import { t } from '../../services/i18n';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  farm: Farm;
  isOnline: boolean;
  unreadAlertsCount: number;
  onOpenAuth: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  farm,
  isOnline,
  unreadAlertsCount,
  onOpenAuth,
  lang,
  setLang,
  theme,
  onToggleTheme,
}) => {
  const [langOpen, setLangOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: t(lang, 'dashboard'), icon: Layers },
    { id: 'scan', label: t(lang, 'scanPlant'), icon: Camera, highlight: true },
    { id: 'crops', label: t(lang, 'myCrops'), icon: Sprout },
    {
      id: 'research',
      label:
        lang === 'lg'
          ? 'Okunoonyereza n’Ebirime'
          : lang === 'sw'
          ? 'Utafiti na Mazao'
          : 'Agronomy Research',
      icon: BookOpen,
    },
    { id: 'fields', label: t(lang, 'fields'), icon: Layers },
    { id: 'assistant', label: t(lang, 'aiAssistant'), icon: Sparkles },
    { id: 'monitoring', label: t(lang, 'monitoring'), icon: Cpu },
    { id: 'alerts', label: t(lang, 'alerts'), icon: AlertTriangle, badge: unreadAlertsCount },
    { id: 'activities', label: t(lang, 'activities'), icon: Activity },
    { id: 'history', label: t(lang, 'scanHistory'), icon: History },
    { id: 'reports', label: t(lang, 'reports'), icon: FileText },
  ];

  const isDark = theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-stone-900 dark:text-stone-100">
                  AGRIFARM <span className="text-emerald-700 dark:text-emerald-400">AI</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Manager
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden md:block leading-none">
                Smart Farming. Better Decisions. Healthier Crops.
              </p>
            </div>
          </div>

          {/* Farm info chip */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-stone-100/80 dark:bg-stone-800/80 rounded-full border border-stone-200 dark:border-stone-700 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-stone-700 dark:text-stone-300">{farm.name}</span>
            <span className="text-stone-400">•</span>
            <span className="text-stone-500 dark:text-stone-400">{farm.district} ({farm.sizeHectares} ha)</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>

            {/* Online / Offline status */}
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                isOnline
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}
              title={isOnline ? 'Connected to AI & Cloud Services' : 'Offline Mode: drafts saved locally'}
            >
              {isOnline ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden sm:inline">{t(lang, 'online')}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t(lang, 'offline')}</span>
                </>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-1 p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="uppercase">{lang}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => { setLang('en'); setLangOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${lang === 'en' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'}`}
                  >
                    <span>English</span>
                    {lang === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>
                  <button
                    onClick={() => { setLang('lg'); setLangOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${lang === 'lg' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'}`}
                  >
                    <span>Luganda</span>
                    {lang === 'lg' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>
                  <button
                    onClick={() => { setLang('sw'); setLangOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between ${lang === 'sw' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700'}`}
                  >
                    <span>Kiswahili</span>
                    {lang === 'sw' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* Alerts Quick Bell */}
            <button
              onClick={() => setCurrentTab('alerts')}
              className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
              title="Farm Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* User Profile / Account */}
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center space-x-2 pl-2 pr-2.5 py-1.5 rounded-xl border transition-colors ${
                currentTab === 'profile'
                  ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold'
                  : 'border-stone-200 dark:border-stone-700 hover:border-emerald-500 hover:bg-emerald-50/50 text-stone-800 dark:text-stone-200'
              }`}
              title="View & Edit Farmer Profile"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/20"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="text-xs font-semibold hidden sm:inline max-w-[110px] truncate">
                {user.name.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-stone-100 dark:border-stone-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  item.highlight
                    ? isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs shadow-emerald-600/20'
                    : isActive
                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.highlight && !isActive ? 'text-emerald-100' : ''}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="ml-auto flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab('settings')}
              className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'settings'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title="Settings & Appearance"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTab('admin')}
              className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                currentTab === 'admin'
                  ? 'bg-purple-900 text-white'
                  : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
              title="Admin Statistics"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
