import React, { useState } from 'react';
import {
  Sprout,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Camera,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Globe,
  Database,
  Layers,
} from 'lucide-react';
import { UserProfile, FarmerType, Language } from '../types';
import { SupabaseService } from '../services/supabase';
import { t } from '../services/i18n';
import { UGANDA_DISTRICTS } from '../data/mockInitialData';

interface WelcomeAuthViewProps {
  onAuthenticated: (user: UserProfile) => void;
  onContinueAsGuest: () => void;
  lang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenSupabaseGuide: () => void;
}

export const WelcomeAuthView: React.FC<WelcomeAuthViewProps> = ({
  onAuthenticated,
  onContinueAsGuest,
  lang,
  onSelectLang,
  onOpenSupabaseGuide,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [district, setDistrict] = useState('Wakiso');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [farmerType, setFarmerType] = useState<FarmerType>('Smallholder Farmer');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const isSupabaseConfigured = SupabaseService.isConfigured();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const { user: sbUser } = await SupabaseService.signIn(email.trim(), password);
        if (sbUser) {
          const profile = await SupabaseService.getProfile(sbUser.id);
          const finalProfile: UserProfile = profile || {
            id: sbUser.id,
            name: fullName || email.split('@')[0],
            email: sbUser.email || email,
            district,
            country: 'Uganda',
            preferredLanguage: lang,
            farmerType,
            farmName: `${district} Farm`,
            role: 'farmer',
            createdAt: new Date().toISOString(),
          };
          setSuccessMsg('Signed in successfully! Loading your farm dashboard...');
          setTimeout(() => onAuthenticated(finalProfile), 600);
        }
      } else {
        // Local mode login
        const demoUser: UserProfile = {
          id: 'user_local_' + Date.now(),
          name: fullName || (email ? email.split('@')[0] : 'Farmer John'),
          email: email || 'farmer@agrifarm.ai',
          district,
          country: 'Uganda',
          preferredLanguage: lang,
          farmerType,
          farmName: `${district} Agro-Holding`,
          role: 'farmer',
          createdAt: new Date().toISOString(),
        };
        setSuccessMsg('Welcome! Starting session in local offline-first mode...');
        setTimeout(() => onAuthenticated(demoUser), 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured) {
        const cleanEmail = email.trim().toLowerCase();
        const cleanName = fullName.trim() || 'Farmer';

        const signUpResult = await SupabaseService.signUp(
          cleanEmail,
          password,
          cleanName,
          {
            phoneNumber: phoneNumber.trim(),
            district: district.trim(),
            farmerType,
            farmName: `${district.trim()} Farm`,
          }
        );

        const sbUser = signUpResult.user;
        const sbSession = signUpResult.session;

        if (sbUser) {
          const newProfile: UserProfile = {
            id: sbUser.id,
            name: cleanName,
            email: sbUser.email || cleanEmail,
            phoneNumber: phoneNumber.trim() || undefined,
            district: district.trim(),
            country: 'Uganda',
            preferredLanguage: lang,
            farmerType,
            farmName: `${district.trim()} Farm`,
            role: 'farmer',
            createdAt: new Date().toISOString(),
          };

          if (sbSession) {
            setSuccessMsg('Account created successfully! Loading your farm dashboard...');
            setTimeout(() => onAuthenticated(newProfile), 600);
          } else {
            setSuccessMsg(
              'Account registered! If confirmation is enabled in Supabase, check your inbox. You can now sign in.'
            );
            setMode('signin');
          }
        }
      } else {
        const newProfile: UserProfile = {
          id: 'user_local_' + Date.now(),
          name: fullName.trim() || 'Farmer',
          email: email.trim(),
          phoneNumber,
          district,
          country: 'Uganda',
          preferredLanguage: lang,
          farmerType,
          farmName: `${district} Farm`,
          role: 'farmer',
          createdAt: new Date().toISOString(),
        };
        setSuccessMsg('Account created locally. Welcome to AgriFarm Uganda!');
        setTimeout(() => onAuthenticated(newProfile), 600);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-950 to-emerald-950 text-white flex flex-col justify-between p-4 sm:p-8 font-sans">
      {/* Top Bar: Language & Supabase indicator */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        {/* Language selector chips */}
        <div className="flex items-center space-x-1 p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-xs">
          <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1.5" />
          <button
            onClick={() => onSelectLang('en')}
            className={`px-2 py-0.5 rounded-xl font-bold transition-colors ${
              lang === 'en' ? 'bg-emerald-500 text-stone-950' : 'text-stone-300 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => onSelectLang('lg')}
            className={`px-2 py-0.5 rounded-xl font-bold transition-colors ${
              lang === 'lg' ? 'bg-emerald-500 text-stone-950' : 'text-stone-300 hover:text-white'
            }`}
          >
            LG
          </button>
          <button
            onClick={() => onSelectLang('sw')}
            className={`px-2 py-0.5 rounded-xl font-bold transition-colors ${
              lang === 'sw' ? 'bg-emerald-500 text-stone-950' : 'text-stone-300 hover:text-white'
            }`}
          >
            SW
          </button>
        </div>

        {/* Supabase status badge */}
        <button
          onClick={onOpenSupabaseGuide}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
            isSupabaseConfigured
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/80 border-amber-500/40 text-amber-300 hover:bg-amber-900/80'
          }`}
        >
          <Database className="w-3 h-3" />
          <span>{isSupabaseConfigured ? 'Supabase Active' : 'Supabase Setup'}</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="max-w-md w-full mx-auto my-auto py-6">
        <div className="bg-stone-900/90 backdrop-blur-xl border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Brand Presentation */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-green-400 flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-900/50">
              <Sprout className="w-9 h-9" />
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-white pt-2 flex items-center justify-center space-x-2">
              <span>AGRIFARM <span className="text-emerald-400">UGANDA</span></span>
              <span className="text-xl">🇺🇬</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 max-w-xs mx-auto leading-relaxed">
              {lang === 'lg'
                ? 'Okulima Okwamagezi mu Uganda · Ebirime Ebiramu'
                : lang === 'sw'
                ? 'Kilimo Mahiri cha Uganda · Mazao Yenye Afya'
                : 'Smart Farming for Uganda · Better Decisions · Healthier Crops'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-stone-950 rounded-2xl border border-stone-800">
            <button
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'signin'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {lang === 'lg' ? 'Yingira (Sign In)' : lang === 'sw' ? 'Ingia (Sign In)' : 'Sign In'}
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {lang === 'lg'
                ? 'Wandiise Ffaamu (Register)'
                : lang === 'sw'
                ? 'Jisajili (Register)'
                : 'New Account'}
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-2xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs rounded-2xl flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Forms */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                  Email Address
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('kasujjajerwestwood@gmail.com');
                    setPassword('agrifarm2026');
                  }}
                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold transition-colors underline"
                >
                  Quick fill demo credentials
                </button>
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agrifarm.ai"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 text-white text-xs rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotNotice(!showForgotNotice)}
                    className="text-[11px] text-emerald-400 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 text-white text-xs rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {showForgotNotice && (
                <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-[11px] text-stone-300">
                  Password reset links are sent via Supabase Auth. Enter your email above and contact your administrator or check spam.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Signing in...' : 'Sign In to My Farm'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                  Full Name / Farmer Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mukasa David"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 text-white text-xs rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mukasa@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 text-white text-xs rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+256 700 000000"
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-white text-xs rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                    District / Region 🇺🇬
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-950 border border-stone-800 text-white text-xs rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {UGANDA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-950 border border-stone-800 text-white text-xs rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Creating Account...' : 'Register Farmer Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo / Guest Farmer Option */}
          <div className="pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full py-3 px-4 rounded-2xl bg-stone-950 hover:bg-stone-800 text-stone-300 font-semibold text-xs border border-stone-800 transition-colors flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Continue as Guest Farmer (Quick Demo Mode)</span>
            </button>
            <p className="text-[10px] text-stone-500 text-center mt-2">
              Explore plant scanning, crops, and AI diagnostics without creating an account.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-stone-500 pb-2">
        AgriFarm Uganda · Powered by Gemini Vision & Supabase PostgreSQL · Supporting Ugandan Farmers 🇺🇬
      </div>
    </div>
  );
};
