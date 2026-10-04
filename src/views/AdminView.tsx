import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  Sprout,
  Camera,
  Activity,
  AlertTriangle,
  Server,
  Lock,
  Cpu,
} from 'lucide-react';
import { ApiService } from '../services/apiService';
import { UserProfile } from '../types';

interface AdminViewProps {
  user: UserProfile;
  onUpdateRole: (role: 'farmer' | 'admin') => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ user, onUpdateRole }) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await ApiService.getAdminMetrics();
      setMetrics(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-purple-100 text-purple-900 text-xs font-bold rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>Platform Operations & Agronomic Intelligence</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Administrator Dashboard
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            High-level metrics across registered smallholders, disease outbreaks, and AI model throughput.
          </p>
        </div>

        {/* Role toggle simulator */}
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-2xl border border-stone-200">
          <span className="text-xs font-bold text-stone-600">Simulate Role:</span>
          <button
            onClick={() => onUpdateRole(user.role === 'admin' ? 'farmer' : 'admin')}
            className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors ${
              user.role === 'admin'
                ? 'bg-purple-800 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {user.role === 'admin' ? 'Active: Administrator' : 'Switch to Admin'}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Registered Farmers</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-stone-900">
            {metrics?.totalUsers?.toLocaleString() || '1,420'}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">+18% this month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">Registered Farms</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-stone-900">
            {metrics?.totalFarms?.toLocaleString() || '1,850'}
          </div>
          <span className="text-[11px] text-stone-500">4,320 monitored fields</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">AI Vision Scans</span>
            <Camera className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-stone-900">
            {metrics?.totalScansPerformed?.toLocaleString() || '12,480'}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold">Gemini 3.8 Flash Engine</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider">System Health</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-heading font-extrabold text-emerald-700">
            99.98%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">All endpoints nominal</span>
        </div>
      </div>

      {/* Breakdown grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Reported Pathologies */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-stone-900">
            Regional Disease & Pest Frequency
          </h3>
          <div className="space-y-3">
            {(metrics?.commonIssues || []).map((issue: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-stone-800">{issue.issue}</span>
                  <span className="font-mono text-purple-700 font-bold">{issue.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${issue.percentage * 2}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Monitored Crops */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-heading font-bold text-base text-stone-900">
            Most Scanned Crops & Healthy Rates
          </h3>
          <div className="space-y-3">
            {(metrics?.topCrops || []).map((crop: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 text-xs">
                <div>
                  <span className="font-bold text-stone-900 block">{crop.name}</span>
                  <span className="text-stone-400 text-[11px]">{crop.count.toLocaleString()} registered plots</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-700">{crop.healthyRate}% Healthy</span>
                  <span className="text-stone-400 text-[10px] block">Regional avg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
