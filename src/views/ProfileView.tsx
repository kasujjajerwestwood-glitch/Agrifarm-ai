import React, { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Sprout,
  ShieldCheck,
  Calendar,
  Camera,
  Edit3,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Key,
  Layers,
  Activity,
  History,
  AlertTriangle,
  Upload,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';
import { UserProfile, FarmerType, Language, Farm, Crop, Field, PlantScan } from '../types';
import { SupabaseService } from '../services/supabase';

interface ProfileViewProps {
  user: UserProfile;
  farm: Farm;
  fields: Field[];
  crops: Crop[];
  scans: PlantScan[];
  onUpdateUser: (updated: UserProfile) => void;
  onUpdateFarm: (updated: Farm) => void;
  lang: Language;
  onOpenAuth: () => void;
  onNavigate: (tab: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  farm,
  fields,
  crops,
  scans,
  onUpdateUser,
  onUpdateFarm,
  lang,
  onOpenAuth,
  onNavigate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber || '',
    country: user.country || 'Uganda',
    district: user.district || 'Wakiso',
    preferredLanguage: user.preferredLanguage || 'en',
    farmerType: user.farmerType || 'Smallholder Farmer',
    farmName: user.farmName || farm.name || 'My Agro Farm',
    avatarUrl: user.avatarUrl || '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const isEmailVerified = Boolean(user.email && user.email.includes('@'));

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSupabaseActive = SupabaseService.isConfigured();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setFormData((prev) => ({ ...prev, avatarUrl: dataUrl }));

      try {
        if (isSupabaseActive && user.id) {
          const downloadUrl = await SupabaseService.uploadImage(
            'profile-images',
            `${user.id}_avatar.jpg`,
            dataUrl
          );
          setFormData((prev) => ({ ...prev, avatarUrl: downloadUrl }));
        }
      } catch (err) {
        console.warn('Could not upload avatar to Supabase storage:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      const updatedUser: UserProfile = {
        ...user,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim() || undefined,
        country: formData.country.trim(),
        district: formData.district.trim(),
        preferredLanguage: formData.preferredLanguage as Language,
        farmerType: formData.farmerType as FarmerType,
        farmName: formData.farmName.trim(),
        avatarUrl: formData.avatarUrl,
      };

      // Save locally
      onUpdateUser(updatedUser);

      // Also update farm name and district if changed
      if (formData.farmName !== farm.name || formData.district !== farm.district) {
        onUpdateFarm({
          ...farm,
          name: formData.farmName.trim(),
          district: formData.district.trim(),
        });
      }

      // Sync to Supabase PostgreSQL if connected
      if (isSupabaseActive) {
        await SupabaseService.saveProfile(updatedUser);
      }

      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (isSupabaseActive) {
        await SupabaseService.resetPassword(user.email);
        setSuccessMsg(`Password reset instructions sent to ${user.email}`);
      } else {
        setSuccessMsg(`Password reset link sent (Local Mode) to ${user.email}`);
      }
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to trigger password reset.');
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await SupabaseService.signOut();
      window.location.reload();
    }
  };

  // Determine profile completion percentage
  const requiredFields = [
    Boolean(user.name),
    Boolean(user.email),
    Boolean(user.country),
    Boolean(user.district),
    Boolean(user.farmName),
    Boolean(user.farmerType),
  ];
  const completionPercent = Math.round(
    (requiredFields.filter(Boolean).length / requiredFields.length) * 100
  );

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full mb-1 border border-emerald-200 dark:border-emerald-800">
            <User className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>Farmer Dossier & Account</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
            Farmer Profile
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            Manage your personal agricultural credentials, farm identity, and secure cloud credentials.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onOpenAuth}
            className="px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Switch Account
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl flex items-center space-x-2 text-emerald-900 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-2xl flex items-center space-x-2 text-rose-900 dark:text-rose-300 text-xs font-bold animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-700 dark:text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Profile Completion Callout */}
      {completionPercent < 100 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-300 text-xs">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="font-bold">Complete your agricultural profile ({completionPercent}%)</p>
              <p className="text-amber-700 dark:text-amber-400/90 text-[11px]">
                Providing your specific district and farming type allows Agrifarm AI to deliver tailored disease warnings and agronomic tips.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0"
          >
            Complete Now
          </button>
        </div>
      )}

      {/* Profile Hero Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs overflow-hidden">
        {/* Banner pattern */}
        <div className="h-32 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-600 relative p-6 flex items-end">
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <span className="px-2.5 py-1 bg-black/30 backdrop-blur-md text-white text-[11px] font-semibold rounded-full flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{user.role === 'admin' ? 'Farm Administrator' : 'Verified Farmer'}</span>
            </span>
            <span className="px-2.5 py-1 bg-black/30 backdrop-blur-md text-white text-[11px] font-semibold rounded-full">
              ID: {user.id ? user.id.slice(0, 10) : 'usr_local'}
            </span>
          </div>
        </div>

        {/* User Avatar & Identity Header */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
            <div className="flex items-end space-x-4">
              <div className="relative group">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={user.name}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-stone-900 shadow-md bg-stone-100 dark:bg-stone-800"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 ring-4 ring-white dark:ring-stone-900 shadow-md flex items-center justify-center font-extrabold text-3xl">
                    {user.name.charAt(0)}
                  </div>
                )}

                {/* Change photo button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-1.5 bg-stone-900 hover:bg-emerald-700 text-white rounded-xl shadow-md transition-colors"
                  title="Upload profile photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-stone-900 dark:text-stone-100 leading-tight">
                  {user.name}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-500 dark:text-stone-400">
                  <span className="font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    {user.farmerType}
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{user.district}, {user.country}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-stone-400 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Joined {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric', day: 'numeric' })}</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
            <div
              onClick={() => onNavigate('fields')}
              className="p-3 bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-2xl border border-stone-200/80 dark:border-stone-800 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs mb-1">
                <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Fields</span>
              </div>
              <div className="font-heading font-bold text-lg text-stone-900 dark:text-stone-100">
                {fields.length} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">Plots</span>
              </div>
            </div>

            <div
              onClick={() => onNavigate('crops')}
              className="p-3 bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-2xl border border-stone-200/80 dark:border-stone-800 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs mb-1">
                <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Crops</span>
              </div>
              <div className="font-heading font-bold text-lg text-stone-900 dark:text-stone-100">
                {crops.length} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">Varieties</span>
              </div>
            </div>

            <div
              onClick={() => onNavigate('history')}
              className="p-3 bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-2xl border border-stone-200/80 dark:border-stone-800 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs mb-1">
                <History className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>AI Scans</span>
              </div>
              <div className="font-heading font-bold text-lg text-stone-900 dark:text-stone-100">
                {scans.length} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">Analyses</span>
              </div>
            </div>

            <div
              onClick={() => onNavigate('fields')}
              className="p-3 bg-stone-50 dark:bg-stone-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 rounded-2xl border border-stone-200/80 dark:border-stone-800 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2 text-stone-500 dark:text-stone-400 text-xs mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Total Acreage</span>
              </div>
              <div className="font-heading font-bold text-lg text-stone-900 dark:text-stone-100">
                {farm.sizeHectares} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">Hectares</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details or Edit Form */}
      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal & Farm Credentials */}
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>Personal & Agricultural Details</span>
            </h3>

            <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">Full Name</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{user.name}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">Email Address</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{user.email}</span>
                  {isEmailVerified ? (
                    <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded text-[10px] font-bold flex items-center space-x-1 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                      Unverified
                    </span>
                  )}
                </div>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">Phone Number</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{user.phoneNumber || 'Not provided'}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">Farm Holding Name</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{user.farmName}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">Farmer Category</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{user.farmerType}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">Country & District</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{user.district}, {user.country}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">Interface Language</span>
                <span className="font-semibold uppercase text-stone-800 dark:text-stone-200">{user.preferredLanguage}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-stone-500 dark:text-stone-400">Account Created</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Account Security, Session & Privacy */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs space-y-4">
              <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Account Security & Data Isolation</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-start space-x-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-stone-800 dark:text-stone-200">PII Zero-Trust Partitioning</div>
                    <div className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5 leading-relaxed">
                      Your phone number, email, and farm locations are stored under <code className="bg-stone-200/70 dark:bg-stone-800 px-1 py-0.5 rounded font-mono text-[10px]">users/{'{userId}'}</code>. Other users cannot query or inspect your records.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-start space-x-3">
                  <Key className="w-4 h-4 text-stone-700 dark:text-stone-300 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-stone-800 dark:text-stone-200">Authentication State</div>
                    <div className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
                      {isSupabaseActive ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          Connected via Supabase PostgreSQL & Auth ({user.email})
                        </span>
                      ) : (
                        <span className="text-stone-600 dark:text-stone-400">Local Browser Session (Offline-first Mode)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">

                <button
                  onClick={handlePasswordReset}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Send Password Reset Email</span>
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Profile Form */
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200/90 dark:border-stone-800 shadow-xs">
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div>
              <h3 className="font-heading font-extrabold text-lg text-stone-900 dark:text-stone-100">
                Update Farmer Credentials
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Keep your agricultural and contact details up-to-date for accurate weather models and diagnostics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Kasujja Jerwestwood"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="farmer@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="+256 700 000 000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Farm Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Kavumba Eco Agriventures"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Country <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Uganda, Kenya, Tanzania, Rwanda"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  District / County <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. Wakiso, Mukono, Nakuru, Arusha"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Farmer Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.farmerType}
                  onChange={(e) => setFormData({ ...formData, farmerType: e.target.value as FarmerType })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Smallholder Farmer">Smallholder Farmer</option>
                  <option value="Commercial Farmer">Commercial Farmer</option>
                  <option value="Greenhouse Operator">Greenhouse Operator</option>
                  <option value="Agricultural Student">Agricultural Student</option>
                  <option value="Agronomist / Extension Officer">Agronomist / Extension Officer</option>
                  <option value="Smart Farm Manager">Smart Farm Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  Preferred Language
                </label>
                <select
                  value={formData.preferredLanguage}
                  onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as Language })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="en">English (Official Agricultural Standard)</option>
                  <option value="lg">Luganda (Central Region)</option>
                  <option value="sw">Kiswahili (East African Community)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
