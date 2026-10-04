import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Bug,
  Sprout,
  Activity,
  Layers,
  ChevronRight,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { KnowledgeItem, KnowledgeType } from '../types';
import { initialKnowledgeBase, searchKnowledge } from '../data/agriculturalKnowledge';

interface KnowledgeViewProps {
  onAskAIAboutItem?: (item: KnowledgeItem) => void;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({ onAskAIAboutItem }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(initialKnowledgeBase[0] || null);

  const results = searchKnowledge(searchQuery, selectedCrop, selectedCategory);

  const cropsList = ['Tomato', 'Maize', 'Banana', 'Coffee', 'Potato', 'Cassava', 'Pepper'];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Reputable Agricultural Repositories</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 tracking-tight">
            Agricultural Knowledge Database
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm">
            Curated pathogen, entomology, and soil nutrition science grounded in FAO, CABI Plantwise, CGIAR, and NARO Uganda research.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-stone-600 bg-white px-3.5 py-2 rounded-xl border border-stone-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Peer-Reviewed Agricultural Records</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/90 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by symptom, common name, pathogen (e.g., 'early blight', 'fall armyworm', 'potassium')..."
            className="w-full pl-11 pr-4 py-3 text-sm border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-stone-400 font-bold uppercase text-[10px] mr-1 flex items-center">
            <Filter className="w-3 h-3 mr-1" /> Category:
          </span>
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'disease', label: 'Diseases' },
            { id: 'pest', label: 'Insect Pests' },
            { id: 'nutrient_deficiency', label: 'Nutrient Deficiencies' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <div className="ml-auto flex items-center space-x-2">
            <span className="text-stone-400 font-bold uppercase text-[10px]">Crop:</span>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-stone-200 rounded-xl bg-white focus:outline-none"
            >
              <option value="all">All Crops</option>
              {cropsList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Search Results list, Right = Detailed Knowledge Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Results List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-stone-500 px-1">
            Found {results.length} scientific record{results.length !== 1 ? 's' : ''}
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {results.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          item.type === 'disease'
                            ? 'bg-rose-100 text-rose-800'
                            : item.type === 'pest'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.type.replace('_', ' ')}
                      </span>
                      <h3 className="font-heading font-bold text-sm text-stone-900 mt-1">
                        {item.name}
                      </h3>
                      {item.scientificName && (
                        <p className="text-[11px] text-stone-500 italic">
                          {item.scientificName}
                        </p>
                      )}
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-emerald-700 translate-x-1' : 'text-stone-300'
                      }`}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.cropsAffected.slice(0, 3).map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {results.length === 0 && (
              <div className="p-8 bg-white rounded-3xl border border-dashed border-stone-300 text-center text-stone-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                <p className="text-xs font-semibold">No knowledge items match your search.</p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Try searching for general terms like "Tomato", "Maize", or "Blight".
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Item Dossier */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in">
              {/* Header */}
              <div className="border-b border-stone-100 pb-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      selectedItem.type === 'disease'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedItem.type === 'pest'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedItem.type.replace('_', ' ')}
                  </span>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedItem.verificationStatus}</span>
                    </span>
                  </div>
                </div>

                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-stone-900">
                  {selectedItem.name}
                </h2>
                {selectedItem.scientificName && (
                  <p className="text-xs sm:text-sm text-stone-500 italic mt-0.5">
                    Scientific Name: {selectedItem.scientificName}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-1.5 mt-3">
                  <span className="text-xs font-bold text-stone-400 mr-1">Host Crops:</span>
                  {selectedItem.cropsAffected.map((crop, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold rounded-lg text-xs"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Observed Symptoms */}
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-900 mb-2">
                  Characteristic Diagnostic Symptoms
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                  {selectedItem.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Causes & Favorable Conditions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                  <span className="font-bold text-stone-900 block uppercase tracking-wider text-[10px]">
                    Etiology & Biology
                  </span>
                  <p className="text-stone-700 leading-relaxed">{selectedItem.causesOrBiology}</p>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-1">
                  <span className="font-bold text-stone-900 block uppercase tracking-wider text-[10px]">
                    Favorable Environmental Factors
                  </span>
                  <p className="text-stone-700 leading-relaxed">{selectedItem.favorableConditions}</p>
                </div>
              </div>

              {/* Management & IPM */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-900">
                  Integrated Pest & Disease Management
                </h4>

                <div className="space-y-2">
                  {selectedItem.management.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-2 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-950"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>

                {selectedItem.organicControls && (
                  <div className="p-3.5 bg-teal-50/70 border border-teal-100 rounded-2xl text-xs space-y-1">
                    <span className="font-bold text-teal-900 block">🌿 Biological & Organic Control:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-teal-800">
                      {selectedItem.organicControls.map((org, i) => (
                        <li key={i}>{org}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* SOURCES & REFERENCES PANEL (Requirement #11) */}
              <div className="p-4 sm:p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center space-x-2 text-stone-900 font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Verified Sources & Scientific References</span>
                </div>

                <div className="space-y-2.5">
                  {selectedItem.sources.map((src, i) => (
                    <div
                      key={i}
                      className="p-3 bg-white rounded-xl border border-stone-200/90 text-xs space-y-1 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-emerald-900">{src.organization}</span>
                        {src.year && <span className="text-[10px] text-stone-400 font-mono">Published {src.year}</span>}
                      </div>
                      <p className="text-stone-800 font-medium">{src.title}</p>
                      {src.snippet && <p className="text-[11px] text-stone-500 italic">"{src.snippet}"</p>}
                      {src.url && (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 hover:underline pt-0.5"
                        >
                          <span>Open Datasheet / Resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Geographic relevance */}
              <div className="text-[11px] text-stone-400 flex items-center justify-between pt-2 border-t border-stone-100">
                <span>Geographic Focus: {selectedItem.geographicRelevance}</span>
                <span>Last Reviewed: {new Date(selectedItem.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white rounded-3xl border border-dashed border-stone-300 text-center text-stone-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-stone-300" />
              <p className="text-sm font-bold text-stone-700">Select an item from the left</p>
              <p className="text-xs text-stone-500 mt-1">
                View detailed symptoms, pathogen biology, and official FAO/CABI references.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
