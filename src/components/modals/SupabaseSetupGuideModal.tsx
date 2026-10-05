import React, { useState } from 'react';
import {
  X,
  Database,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Key,
  Terminal,
  Server,
  Cloud,
  Loader2,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { SupabaseService } from '../../services/supabase';
import { SUPABASE_SCHEMA_SQL } from '../../data/supabaseSchemaSql';

interface SupabaseSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSetupGuideModal: React.FC<SupabaseSetupGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const currentConfig = SupabaseService.getConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [saved, setSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'credentials' | 'sql' | 'instructions'>('credentials');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await SupabaseService.testConnection(url, anonKey);
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'Connection test failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    SupabaseService.saveConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      window.location.reload();
    }, 1200);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const isConnected = SupabaseService.isConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-2xl max-h-[92vh] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                <span>Supabase Backend Assistant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  PostgreSQL
                </span>
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Setup your database, user authentication, and storage buckets
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <div>
                <div className="font-bold text-xs sm:text-sm">
                  {isConnected
                    ? 'Connected to Supabase PostgreSQL Database'
                    : 'Currently Running in Local Offline-First Mode'}
                </div>
                <div className="text-[11px] opacity-80">
                  {isConnected
                    ? 'All farm scans, crops, and farmer profiles sync to your cloud database.'
                    : 'Changes are safely preserved on this device. Connect Supabase to sync across devices.'}
                </div>
              </div>
            </div>

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 text-xs font-bold shadow-xs hover:bg-stone-50 shrink-0"
            >
              <span>Supabase Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center space-x-2 border-b border-stone-200 dark:border-stone-800 pb-2">
            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'credentials'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              1. Project Credentials
            </button>
            <button
              onClick={() => setActiveTab('sql')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'sql'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              2. SQL Migration Script
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'instructions'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              3. Step-by-Step Guide
            </button>
          </div>

          {/* TAB 1: Credentials Form */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      Supabase Project URL
                    </label>
                    <span className="text-[11px] text-stone-400">Settings &rarr; API &rarr; Project URL</span>
                  </div>
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setTestResult(null);
                    }}
                    placeholder="https://your-project-ref.supabase.co"
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      Supabase Anon / Public Key
                    </label>
                    <span className="text-[11px] text-stone-400">Settings &rarr; API &rarr; Project API Keys &rarr; anon public</span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={anonKey}
                    onChange={(e) => {
                      setAnonKey(e.target.value);
                      setTestResult(null);
                    }}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 text-xs font-mono border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>

                {/* Test Result Message */}
                {testResult && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                      testResult.success
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTesting || !url || !anonKey}
                      className="px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
                      <span>{isTesting ? 'Testing Ping...' : 'Test Connection'}</span>
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                    >
                      <Database className="w-4 h-4" />
                      <span>Save Credentials & Reload</span>
                    </button>
                  </div>

                  {saved && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Saved! Reloading app...</span>
                    </span>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: SQL Script */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-emerald-600" />
                    <span>PostgreSQL Database Schema & Row Level Security</span>
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Defines tables for profiles, farms, crops, plant_scans, pests, diseases, activities, and storage buckets.
                  </p>
                </div>

                <button
                  onClick={handleCopySql}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shrink-0 shadow-xs"
                >
                  {copiedSql ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-stone-900 text-stone-100 font-mono text-[11px] rounded-2xl overflow-x-auto max-h-72 border border-stone-800">
                  {SUPABASE_SCHEMA_SQL.slice(0, 1500)}...
                  {"\n\n-- [Click 'Copy SQL Schema' to get the full 360-line script with all RLS policies]"}
                </pre>
              </div>

              <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center space-x-2">
                <span>How to run:</span>
                <a
                  href="https://supabase.com/dashboard/project/_/sql/new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 font-bold underline inline-flex items-center space-x-1"
                >
                  <span>Open Supabase SQL Editor</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span>&rarr; Paste and click <strong>Run</strong></span>
              </div>
            </div>
          )}

          {/* TAB 3: Step-by-Step Instructions */}
          {activeTab === 'instructions' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  1
                </span>
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    Create a Free Project on Supabase
                  </div>
                  <div className="text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-600 underline font-semibold">supabase.com</a> and sign in with GitHub or email. Click <strong>New Project</strong>, select a password and region near you, and wait ~1 minute for deployment.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  2
                </span>
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    Run the SQL Migration in SQL Editor
                  </div>
                  <div className="text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    In your Supabase project, click the <strong>SQL Editor</strong> tab on the left. Click <strong>New Query</strong>, paste the SQL from Tab 2, and press <strong>Run</strong>.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  3
                </span>
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    Copy API Keys to AgriFarm Uganda
                  </div>
                  <div className="text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    Navigate to <strong>Project Settings &rarr; API</strong>. Copy your <strong>Project URL</strong> and <strong>anon public</strong> key, switch back to Tab 1 here, paste them in, and click <strong>Save Credentials</strong>.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  4
                </span>
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    Netlify Deployment & Environment Variables
                  </div>
                  <div className="text-stone-500 dark:text-stone-400 mt-1 leading-relaxed space-y-1">
                    <p>In your Netlify Site dashboard, go to <strong>Site configuration &rarr; Environment variables</strong> and add:</p>
                    <code className="block p-2 bg-stone-900 text-emerald-300 rounded-lg text-[11px] font-mono select-all">
                      VITE_SUPABASE_URL=https://your-project.supabase.co<br/>
                      VITE_SUPABASE_ANON_KEY=your-anon-key-here<br/>
                      GEMINI_API_KEY=your-gemini-key-here
                    </code>
                    <p className="text-[11px] text-stone-400">Trigger a new deploy on Netlify once added to apply the variables.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  5
                </span>
                <div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    VS Code & GitHub Workflow
                  </div>
                  <div className="text-stone-500 dark:text-stone-400 mt-1 leading-relaxed space-y-1">
                    <p>To run or edit in VS Code and push changes to GitHub:</p>
                    <code className="block p-2 bg-stone-900 text-stone-200 rounded-lg text-[11px] font-mono select-all">
                      # In VS Code terminal:<br/>
                      npm install<br/>
                      npm run dev<br/>
                      # To commit & push to GitHub:<br/>
                      git add .<br/>
                      git commit -m "feat: agrifarm mobile polish and supabase"<br/>
                      git push origin main
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-stone-500 dark:text-stone-400">
            Need help? AgriFarm Uganda operates smoothly offline while you complete Supabase setup.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
