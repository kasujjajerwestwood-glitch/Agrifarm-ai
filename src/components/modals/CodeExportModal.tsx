import React, { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Github,
  Database,
  Cloud,
  Layers,
  FileCode,
} from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gitCommands = `# 1. Initialize local repository in your project folder
git init
git add .
git commit -m "feat: complete Agrifarm AI Assistant Manager app"

# 2. Add your GitHub repository remote (replace YOUR_USERNAME and YOUR_REPO)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/agrifarm-ai.git
git push -u origin main
`;

  const envFileContent = `# AGRIFARM AI - ENVIRONMENT VARIABLES
# 1. Google Gemini Multimodal Vision API Key
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# 2. Supabase Backend (PostgreSQL + Auth + Storage)
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"

# 3. Application Port
PORT=3000
`;

  const netlifyConfig = `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-2xl max-h-[92vh] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                VS Code, GitHub & Supabase Sync Guide
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Commands and code configurations to connect with GitHub, VS Code, and Netlify
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
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm">
          {/* Section 1: Git and GitHub push */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                <Github className="w-4 h-4 text-stone-800 dark:text-stone-200" />
                <span>1. Connect and Push to GitHub</span>
              </h4>
              <button
                onClick={() => copyToClipboard(gitCommands, 'git')}
                className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                {copiedKey === 'git' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'git' ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-stone-900 text-stone-100 font-mono text-[11px] rounded-2xl overflow-x-auto border border-stone-800">
              {gitCommands}
            </pre>
          </div>

          {/* Section 2: Environment Variables */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                <FileCode className="w-4 h-4 text-emerald-600" />
                <span>2. Local .env File for Supabase & Gemini</span>
              </h4>
              <button
                onClick={() => copyToClipboard(envFileContent, 'env')}
                className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                {copiedKey === 'env' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'env' ? 'Copied' : 'Copy .env'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-stone-900 text-stone-100 font-mono text-[11px] rounded-2xl overflow-x-auto border border-stone-800">
              {envFileContent}
            </pre>
          </div>

          {/* Section 3: Netlify Deployment Configuration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
                <Cloud className="w-4 h-4 text-blue-500" />
                <span>3. Netlify Configuration (netlify.toml)</span>
              </h4>
              <button
                onClick={() => copyToClipboard(netlifyConfig, 'netlify')}
                className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                {copiedKey === 'netlify' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'netlify' ? 'Copied' : 'Copy netlify.toml'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-stone-900 text-stone-100 font-mono text-[11px] rounded-2xl overflow-x-auto border border-stone-800">
              {netlifyConfig}
            </pre>
          </div>

          {/* Steps summary */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 text-xs space-y-2">
            <div className="font-bold text-stone-900 dark:text-stone-100">
              Quick Setup Checklist in VS Code:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-stone-600 dark:text-stone-300">
              <li>Open the project folder in VS Code (`code .`).</li>
              <li>Run `npm install` in your terminal to install packages.</li>
              <li>Create a `.env` file and paste your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.</li>
              <li>Run `npm run dev` to start the app locally on `localhost:3000`.</li>
              <li>Push to GitHub and connect to Netlify for automatic continuous deployment.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-stone-500 dark:text-stone-400">
            All code files are ready for VS Code & Git.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
