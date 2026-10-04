import React from 'react';
import {
  Sprout,
  Camera,
  Layers,
  Sparkles,
  BookOpen,
  Cpu,
  AlertTriangle,
  Activity,
  History,
  FileText,
  Settings,
  ShieldCheck,
  ChevronRight,
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  LogOut,
  MapPin,
} from 'lucide-react';
import { UserProfile, Farm, Language } from '../../types';
import { t } from '../../services/i18n';
import { SupabaseService } from '../../services/supabase';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  farm: Farm;
  unreadAlertsCount: number;
  onOpenAuth: () => void;
  onOpenGuide: () => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  farm,
  unreadAlertsCount,
  onOpenAuth,
  onOpenGuide,
  lang,
}) => {
  const isSupabaseConnected = SupabaseService.isConfigured();

  const navItems = [
    { id: 'dashboard', label: t(lang, 'dashboard'), icon: Layers },
    { id: 'crops', label: t(lang, 'myCrops'), icon: Sprout },
    {
      id: 'research',
      label:
        lang === 'lg'
          ? 'Okunoonyereza n’Ebirime'
          : lang === 'sw'
          ? 'Kanzidata ya Mazao na Wadudu'
          : 'Disease & Pest Library',
      icon: BookOpen,
    },
    { id: 'assistant', label: 'Agrifarm AI', icon: Sparkles },
    { id: 'fields', label: t(lang, 'fields'), icon: Layers },
    { id: 'activities', label: t(lang, 'activities'), icon: Activity },
    { id: 'history', label: t(lang, 'scanHistory'), icon: History },
    { id: 'monitoring', label: t(lang, 'monitoring'), icon: Cpu },
    { id: 'alerts', label: t(lang, 'alerts'), icon: AlertTriangle, badge: unreadAlertsCount },
    { id: 'reports', label: t(lang, 'reports'), icon: FileText },
    { id: 'settings', label: t(lang, 'settings'), icon: Settings },
  ];

  if (user.role === 'admin') {
    navItems.push({ id: 'admin', label: t(lang, 'adminDashboard'), icon: ShieldCheck });
  }

  return (
    <aside className="w-72 shrink-0 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between h-screen sticky top-0 overflow-y-auto scrollbar-none z-30">
      {/* Top Section */}
      <div className="p-5 space-y-5">
        {/* Brand Header */}
        <div
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setCurrentTab('dashboard')}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-800 via-emerald-700 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-heading font-extrabold text-xl tracking-tight text-stone-900 dark:text-stone-100">
                AGRIFARM <span className="text-emerald-700 dark:text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-none mt-1">
              Smart Farming · Healthier Crops
            </p>
          </div>
        </div>

        {/* HERO SCAN PLANT ACTION BUTTON */}
        <button
          onClick={() => setCurrentTab('scan')}
          className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center space-x-2.5 transition-all shadow-md active:scale-98 ${
            currentTab === 'scan'
              ? 'bg-emerald-800 text-white ring-2 ring-emerald-500 shadow-emerald-900/30'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-700/25 hover:shadow-lg'
          }`}
        >
          <Camera className="w-5 h-5 text-emerald-100 animate-pulse" />
          <span>{lang === 'lg' ? '🌱 KUBA EKIRIME' : lang === 'sw' ? '🌱 PIMA ZAO LAKO' : '🌱 SCAN YOUR PLANT'}</span>
        </button>

        {/* Primary Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold border-l-4 border-emerald-600 dark:border-emerald-400 pl-3'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Farm Chip, Supabase Status & User Profile */}
      <div className="p-4 border-t border-stone-200 dark:border-stone-800 space-y-3 bg-stone-50/60 dark:bg-stone-900/60">
        {/* Active Farm Chip */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs">
          <div className="flex items-center space-x-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <div className="truncate">
              <div className="font-bold text-stone-800 dark:text-stone-200 truncate">{farm.name}</div>
              <div className="text-[10px] text-stone-400 truncate">{farm.district} · {farm.sizeHectares} ha</div>
            </div>
          </div>
          <button
            onClick={() => setCurrentTab('fields')}
            className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline shrink-0 ml-1"
          >
            Manage
          </button>
        </div>

        {/* Supabase Status Pill */}
        <button
          onClick={onOpenGuide}
          className={`w-full px-3 py-2 rounded-xl text-[11px] font-medium border flex items-center justify-between transition-colors ${
            isSupabaseConnected
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
          }`}
          title="Click to view Supabase setup & database status"
        >
          <div className="flex items-center space-x-1.5">
            <Database className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold truncate">
              {isSupabaseConnected ? 'Supabase Connected' : 'Supabase Setup Pending'}
            </span>
          </div>
          <span className="text-[10px] underline font-bold shrink-0">
            {isSupabaseConnected ? 'Settings' : 'Setup'}
          </span>
        </button>

        {/* User Profile Bar */}
        <div
          onClick={() => setCurrentTab('profile')}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-stone-800 cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-2.5 truncate">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=150'}
              alt={user.name}
              className="w-9 h-9 rounded-xl object-cover border border-emerald-600/30 shrink-0"
            />
            <div className="truncate text-xs">
              <div className="font-bold text-stone-900 dark:text-stone-100 truncate">{user.name}</div>
              <div className="text-[10px] text-stone-400 capitalize truncate">{user.farmerType || 'Farmer'}</div>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
};
