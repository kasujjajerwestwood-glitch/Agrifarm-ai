import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  Columns,
  Eye,
  Calendar,
  Camera,
  CheckCircle2,
  AlertTriangle,
  X,
  Printer,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { PlantScan, Language } from '../types';

interface ScanHistoryViewProps {
  scans: PlantScan[];
  onSelectScan: (scan: PlantScan) => void;
  lang: Language;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  scans,
  onSelectScan,
  lang,
}) => {
  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareScanA, setCompareScanA] = useState<PlantScan | null>(scans[0] || null);
  const [compareScanB, setCompareScanB] = useState<PlantScan | null>(scans[1] || null);

  const filteredScans = scans.filter((s) => {
    const matchesSearch =
      s.cropName.toLowerCase().includes(search.toLowerCase()) ||
      s.analysis.possibleIssue.toLowerCase().includes(search.toLowerCase());
    const matchesSev =
      filterSeverity === 'all' || s.analysis.severity === filterSeverity;
    return matchesSearch && matchesSev;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Diagnostic Archive</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Scan History & Comparisons
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Review past plant pathology scans and compare recovery progress side-by-side.
          </p>
        </div>

        <button
          onClick={() => setIsCompareMode(!isCompareMode)}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            isCompareMode
              ? 'bg-stone-900 text-white'
              : 'border border-stone-300 text-stone-700 hover:bg-stone-50'
          }`}
        >
          <Columns className="w-4 h-4" />
          <span>{isCompareMode ? 'Exit Comparison' : 'Side-by-Side Comparison'}</span>
        </button>
      </div>

      {/* COMPARISON VIEW */}
      {isCompareMode && (
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <h3 className="font-heading font-bold text-base text-emerald-950 flex items-center space-x-2">
              <Columns className="w-4 h-4 text-emerald-700" />
              <span>Comparative Diagnostic Inspection</span>
            </h3>
            <span className="text-xs text-emerald-800">
              Select two scans to evaluate disease remission or pest progression
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Slot A */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Baseline Scan (Scan A):
              </label>
              <select
                value={compareScanA?.id}
                onChange={(e) =>
                  setCompareScanA(scans.find((s) => s.id === e.target.value) || null)
                }
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white font-medium"
              >
                {scans.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.cropName} - {s.analysis.possibleIssue} ({new Date(s.date).toLocaleDateString()})
                  </option>
                ))}
              </select>

              {compareScanA && (
                <div className="space-y-3 text-xs">
                  <div className="h-44 rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src={compareScanA.images[0]?.url}
                      alt="Scan A"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">
                      {compareScanA.analysis.possibleIssue}
                    </span>
                    <span className="text-stone-500">
                      Confidence: {compareScanA.analysis.confidence}% • Severity:{' '}
                      {compareScanA.analysis.severity}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl text-stone-700">
                    <span className="font-bold block mb-1">Symptoms:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {compareScanA.analysis.observedSymptoms.slice(0, 2).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Slot B */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Follow-up Scan (Scan B):
              </label>
              <select
                value={compareScanB?.id}
                onChange={(e) =>
                  setCompareScanB(scans.find((s) => s.id === e.target.value) || null)
                }
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white font-medium"
              >
                {scans.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.cropName} - {s.analysis.possibleIssue} ({new Date(s.date).toLocaleDateString()})
                  </option>
                ))}
              </select>

              {compareScanB && (
                <div className="space-y-3 text-xs">
                  <div className="h-44 rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src={compareScanB.images[0]?.url}
                      alt="Scan B"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">
                      {compareScanB.analysis.possibleIssue}
                    </span>
                    <span className="text-stone-500">
                      Confidence: {compareScanB.analysis.confidence}% • Severity:{' '}
                      {compareScanB.analysis.severity}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl text-stone-700">
                    <span className="font-bold block mb-1">Symptoms:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {compareScanB.analysis.observedSymptoms.slice(0, 2).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search scans by crop name, issue, or symptoms..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-stone-700"
          >
            <option value="all">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Scans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredScans.map((scan) => (
          <div
            key={scan.id}
            onClick={() => onSelectScan(scan)}
            className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 overflow-hidden bg-stone-100">
                <img
                  src={scan.images[0]?.url}
                  alt={scan.cropName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`px-3 py-1 text-[11px] font-bold rounded-full shadow-sm text-white ${
                      scan.analysis.healthStatus === 'Healthy'
                        ? 'bg-emerald-600'
                        : scan.analysis.severity === 'Critical'
                        ? 'bg-rose-600'
                        : scan.analysis.severity === 'High'
                        ? 'bg-amber-600'
                        : 'bg-yellow-600'
                    }`}
                  >
                    {scan.analysis.healthStatus}
                  </span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-lg text-[10px] font-bold text-white">
                  {scan.analysis.confidence}% Confident
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider">
                  <span>{scan.cropName}</span>
                  <span>{new Date(scan.date).toLocaleDateString()}</span>
                </div>

                <h3 className="font-heading font-extrabold text-base text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {scan.analysis.possibleIssue}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {scan.analysis.observedSymptoms[0]}
                </p>
              </div>
            </div>

            <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
              <span>View Full Diagnosis Report</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
