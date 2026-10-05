import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity,
  Droplets,
  ShieldCheck,
} from 'lucide-react';
import { Farm, Field, Crop, PlantScan, FarmActivity, SensorReading, Language } from '../types';

interface ReportsViewProps {
  farm: Farm;
  fields: Field[];
  crops: Crop[];
  scans: PlantScan[];
  activities: FarmActivity[];
  sensors: SensorReading[];
  lang: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  farm,
  fields,
  crops,
  scans,
  activities,
  sensors,
  lang,
}) => {
  const [reportType, setReportType] = useState<
    'summary' | 'health' | 'disease' | 'activity' | 'sensors'
  >('summary');

  const handlePrint = () => {
    window.print();
  };

  const healthyCount = crops.filter((c) => c.currentHealth === 'Healthy').length;
  const diseaseScans = scans.filter((s) => s.analysis.healthStatus.includes('Disease') || s.analysis.healthStatus.includes('Pest'));

  return (
    <div className="space-y-6 pb-16">
      {/* Header (hidden in print) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Farm Records & Compliance</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Agricultural Reports
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Generate printable audit logs, disease timelines, and farm activity summaries.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Report Selector Pills (no-print) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none no-print">
        {[
          { id: 'summary', label: 'Farm Summary Dossier' },
          { id: 'health', label: 'Crop Health Audit' },
          { id: 'disease', label: 'Pathology & Pest Log' },
          { id: 'activity', label: 'Field Activities Log' },
          { id: 'sensors', label: 'Soil & Sensor Telemetry' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              reportType === tab.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* PRINTABLE DOCUMENT CONTAINER */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm print:p-0 print:border-none print:shadow-none space-y-8">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b-2 border-stone-800 pb-5">
          <div>
            <div className="flex items-center space-x-2 text-emerald-800 font-heading font-extrabold text-xl sm:text-2xl tracking-tight">
              <Sprout className="w-6 h-6 text-emerald-600" />
              <span>AGRIFARM UGANDA</span>
              <span className="text-base">🇺🇬</span>
            </div>
            <p className="text-xs text-stone-500 font-medium mt-0.5">
              Official Agricultural Technical & Diagnostic Report
            </p>
          </div>

          <div className="text-right text-xs text-stone-600 space-y-0.5">
            <div className="font-bold text-stone-900">{farm.name}</div>
            <div>{farm.location}, {farm.district}</div>
            <div className="text-stone-400">Date Generated: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Report: Farm Summary */}
        {reportType === 'summary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-stone-50 rounded-2xl">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">Total Estate Size</span>
                <div className="text-xl font-heading font-extrabold text-stone-900">{farm.sizeHectares} ha</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">Registered Fields</span>
                <div className="text-xl font-heading font-extrabold text-stone-900">{fields.length} Blocks</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">Active Crops</span>
                <div className="text-xl font-heading font-extrabold text-emerald-700">{crops.length} ({healthyCount} Healthy)</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">AI Plant Scans</span>
                <div className="text-xl font-heading font-extrabold text-stone-900">{scans.length} Scans</div>
              </div>
            </div>

            {/* Field breakdown table */}
            <div>
              <h3 className="font-heading font-bold text-base text-stone-900 mb-3">
                Field Inventory & Soil Specifications
              </h3>
              <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Field Name</th>
                    <th className="p-3">Size (ha)</th>
                    <th className="p-3">Crop Variety</th>
                    <th className="p-3">Soil Classification</th>
                    <th className="p-3">Irrigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {fields.map((f) => (
                    <tr key={f.id} className="hover:bg-stone-50">
                      <td className="p-3 font-bold text-stone-900">{f.name}</td>
                      <td className="p-3">{f.sizeHectares}</td>
                      <td className="p-3">{f.cropName}</td>
                      <td className="p-3">{f.soilType}</td>
                      <td className="p-3 font-semibold text-emerald-800">{f.irrigationMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report: Crop Health Audit */}
        {reportType === 'health' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-base text-stone-900">
              Crop Health & Stage Audit
            </h3>
            <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Crop</th>
                  <th className="p-3">Variety</th>
                  <th className="p-3">Growth Stage</th>
                  <th className="p-3">Health Status</th>
                  <th className="p-3">Target Harvest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {crops.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3 font-bold text-stone-900">{c.name}</td>
                    <td className="p-3 text-stone-600">{c.variety}</td>
                    <td className="p-3">{c.growthStage}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        c.currentHealth === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {c.currentHealth}
                      </span>
                    </td>
                    <td className="p-3 text-stone-600">{c.expectedHarvestDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report: Pathology & Pest Log */}
        {reportType === 'disease' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-base text-stone-900">
              Plant Pathology & Pest Scan History
            </h3>
            <div className="space-y-3">
              {scans.map((s) => (
                <div key={s.id} className="p-4 border border-stone-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-800 text-sm">{s.cropName} — {s.analysis.possibleIssue}</span>
                    <span className="text-stone-400">{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-stone-600">
                    <strong>Observed Symptoms:</strong> {s.analysis.observedSymptoms.join('; ')}
                  </div>
                  <div className="text-xs text-stone-600">
                    <strong>Recommended Actions:</strong> {s.analysis.recommendedNextSteps.join('; ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Report: Activities Log */}
        {reportType === 'activity' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-base text-stone-900">
              Chronological Field Operations & Input Applications
            </h3>
            <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Activity</th>
                  <th className="p-3">Crop / Field</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Inputs / Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {activities.map((a) => (
                  <tr key={a.id}>
                    <td className="p-3 font-mono">{a.date}</td>
                    <td className="p-3 font-bold text-stone-900">{a.activityType}</td>
                    <td className="p-3">{a.cropName} ({a.fieldName})</td>
                    <td className="p-3 text-stone-600">{a.notes}</td>
                    <td className="p-3 font-mono text-stone-500">{a.quantityOrCost || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Report: Sensor Readings */}
        {reportType === 'sensors' && (
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-base text-stone-900">
              IoT Environmental Sensor Telemetry Log
            </h3>
            <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
              <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Sensor Node</th>
                  <th className="p-3">Parameter</th>
                  <th className="p-3">Current Reading</th>
                  <th className="p-3">Target Range</th>
                  <th className="p-3">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {sensors.map((s) => (
                  <tr key={s.id}>
                    <td className="p-3 font-mono">{s.sensorId}</td>
                    <td className="p-3 font-bold">{s.label}</td>
                    <td className="p-3 font-heading font-extrabold text-sm">{s.value} {s.unit}</td>
                    <td className="p-3 text-stone-500">{s.minOptimal} - {s.maxOptimal} {s.unit}</td>
                    <td className="p-3 font-bold text-emerald-700 uppercase text-[10px]">{s.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Official Document Footer */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-3">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified by AgriFarm Uganda Decision-Support Engine</span>
          </div>
          <div>Page 1 of 1 • System Build 2026</div>
        </div>
      </div>
    </div>
  );
};
