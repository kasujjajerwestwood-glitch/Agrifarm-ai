import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  MapPin,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  Phone,
  ArrowRight,
  LogOut,
  HelpCircle,
  ExternalLink,
  Key,
  Copy,
  AlertTriangle,
  Database,
} from 'lucide-react';
import { UserProfile, FarmerType, Language } from '../../types';
import { SupabaseService } from '../../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onOpenGuide?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onOpenGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register' | 'forgot'>('signin');
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(user.name);
  const [district, setDistrict] = useState(user.district);
  const [country, setCountry] = useState(user.country || 'Uganda');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [farmName, setFarmName] = useState(user.farmName);
  const [farmerType, setFarmerType] = useState<FarmerType>(user.farmerType);

  const [authError, setAuthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSupabaseActive = SupabaseService.isConfigured();

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      if (isSupabaseActive) {
        const { user: authUser } = await SupabaseService.signIn(email, password);
        if (authUser) {
          // Fetch user profile from Supabase
          const profile = await SupabaseService.getProfile(authUser.id);
          if (profile) {
            onUpdateUser(profile);
          } else {
            onUpdateUser({
              ...user,
              id: authUser.id,
              email: authUser.email || email,
              name: fullName || user.name,
            });
          }
          setSuccessMsg('Successfully signed in via Supabase!');
          setTimeout(() => onClose(), 800);
        }
      } else {
        // Local mode fallback
        onUpdateUser({
          ...user,
          email,
          name: fullName || user.name,
        });
        setSuccessMsg('Signed in (Local Offline-First Session)');
        setTimeout(() => onClose(), 800);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Failed to sign in. Verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      if (isSupabaseActive) {
        const { user: authUser } = await SupabaseService.signUp(email, password, fullName);
        if (authUser) {
          const newProfile: UserProfile = {
            id: authUser.id,
            name: fullName.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim() || undefined,
            country: country.trim(),
            district: district.trim(),
            preferredLanguage: user.preferredLanguage || 'en',
            farmerType,
            farmName: farmName.trim(),
            role: 'farmer',
            createdAt: new Date().toISOString(),
          };

          await SupabaseService.saveProfile(newProfile);
          onUpdateUser(newProfile);
          setSuccessMsg('Registration successful! Profile created in Supabase.');
          setTimeout(() => onClose(), 1000);
        }
      } else {
        // Local session mode
        const newProfile: UserProfile = {
          ...user,
          id: 'usr_' + Date.now(),
          name: fullName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim() || undefined,
          country: country.trim(),
          district: district.trim(),
          farmName: farmName.trim(),
          farmerType,
        };
        onUpdateUser(newProfile);
        setSuccessMsg('Account created locally. Connect Supabase in Settings to sync across devices.');
        setTimeout(() => onClose(), 1000);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);

    try {
      if (isSupabaseActive) {
        await SupabaseService.resetPassword(email);
        setSuccessMsg('Password reset instructions sent to your email.');
      } else {
        setSuccessMsg('Password reset simulation: local account reset ready.');
      }
      setTimeout(() => setActiveTab('signin'), 3000);
    } catch (err: any) {
      setAuthError(err.message || 'Could not send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-lg rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-lg text-stone-900 dark:text-stone-100">
                AGRIFARM <span className="text-emerald-700 dark:text-emerald-400">AI</span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Farmer Authentication & Data Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 p-1">
          <button
            onClick={() => { setActiveTab('signin'); setAuthError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'signin'
                ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setAuthError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'register'
                ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => { setActiveTab('forgot'); setAuthError(null); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'forgot'
                ? 'bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            Reset
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Supabase status banner */}
          <div
            className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
              isSupabaseActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 shrink-0" />
              <span>
                {isSupabaseActive
                  ? 'Connected to Supabase PostgreSQL & Auth'
                  : 'Operating in Local Offline-First Mode'}
              </span>
            </div>
            {onOpenGuide && !isSupabaseActive && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="font-bold underline shrink-0 hover:no-underline"
              >
                Setup Supabase
              </button>
            )}
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-2xl text-xs text-rose-900 dark:text-rose-300 font-bold flex items-center space-x-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-900 dark:text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Agrifarm AI'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Full Farmer Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Kasujja Jerwestwood"
                    className="w-full pl-10 pr-3.5 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    Farm Name
                  </label>
                  <input
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="e.g. Kavumba Smart Agri-Hub"
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    District / Region
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Wakiso"
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Farmer Classification
                </label>
                <select
                  value={farmerType}
                  onChange={(e) => setFarmerType(e.target.value as FarmerType)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Smallholder Farmer">Smallholder Farmer</option>
                  <option value="Commercial Farmer">Commercial Farmer</option>
                  <option value="Greenhouse Operator">Greenhouse Operator</option>
                  <option value="Agricultural Student">Agricultural Student</option>
                  <option value="Agronomist / Extension Officer">Agronomist / Extension Officer</option>
                  <option value="Smart Farm Manager">Smart Farm Manager</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2 mt-2"
              >
                <span>{loading ? 'Creating Account...' : 'Register & Create Profile'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 text-white dark:text-stone-900 font-bold text-sm rounded-xl transition-all"
              >
                {loading ? 'Sending Instructions...' : 'Send Password Reset Email'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
