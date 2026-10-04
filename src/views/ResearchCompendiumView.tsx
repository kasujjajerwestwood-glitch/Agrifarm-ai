import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Sprout,
  Bug,
  AlertTriangle,
  Layers,
  Thermometer,
  Droplets,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Filter,
  X,
  Printer,
  Sparkles,
  Camera,
  Plus,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  Language,
  Crop,
  CompendiumCrop,
  CompendiumPest,
  CompendiumDisease,
  CropCategory,
} from '../types';
import {
  COMPENDIUM_CROPS,
  COMPENDIUM_PESTS,
  COMPENDIUM_DISEASES,
} from '../data/agronomyCompendium';
import { t } from '../services/i18n';

interface ResearchCompendiumViewProps {
  onScanForCrop: (cropName: string) => void;
  onAddCropFromCompendium?: (crop: Crop) => void;
  onConsultAI: (context: { cropName: string; issue: string }) => void;
  lang: Language;
}

type TabMode = 'all' | 'cereals' | 'legumes' | 'tubers' | 'cash' | 'horticulture' | 'pests' | 'diseases';

export const ResearchCompendiumView: React.FC<ResearchCompendiumViewProps> = ({
  onScanForCrop,
  onAddCropFromCompendium,
  onConsultAI,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<TabMode>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected item for deep detail modal
  const [selectedCrop, setSelectedCrop] = useState<CompendiumCrop | null>(null);
  const [selectedPest, setSelectedPest] = useState<CompendiumPest | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<CompendiumDisease | null>(null);

  // Success notice when crop added to inventory
  const [addedCropNotice, setAddedCropNotice] = useState<string | null>(null);

  const query = searchQuery.toLowerCase().trim();

  // Filtered crops
  const filteredCrops = useMemo(() => {
    return COMPENDIUM_CROPS.filter((c) => {
      // Tab filter
      if (activeTab === 'cereals' && c.category !== 'Cereals & Grains') return false;
      if (activeTab === 'legumes' && c.category !== 'Legumes & Pulses') return false;
      if (activeTab === 'tubers' && c.category !== 'Roots & Tubers') return false;
      if (activeTab === 'cash' && c.category !== 'Cash & Plantation') return false;
      if (
        activeTab === 'horticulture' &&
        c.category !== 'Vegetables & Horticultural' &&
        c.category !== 'Fruits & Orchards'
      )
        return false;
      if (activeTab === 'pests' || activeTab === 'diseases') return false;

      // Search filter across multilingual names & scientific names
      if (!query) return true;
      return (
        c.name.toLowerCase().includes(query) ||
        c.scientificName.toLowerCase().includes(query) ||
        c.localNames.lg.toLowerCase().includes(query) ||
        c.localNames.sw.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query) ||
        c.commonPests.some((p) => p.toLowerCase().includes(query)) ||
        c.commonDiseases.some((d) => d.toLowerCase().includes(query))
      );
    });
  }, [activeTab, query]);

  // Filtered pests
  const filteredPests = useMemo(() => {
    if (
      activeTab === 'cereals' ||
      activeTab === 'legumes' ||
      activeTab === 'tubers' ||
      activeTab === 'cash' ||
      activeTab === 'horticulture'
    ) {
      return [];
    }

    return COMPENDIUM_PESTS.filter((p) => {
      if (!query) return true;
      return (
        p.name.toLowerCase().includes(query) ||
        p.scientificName.toLowerCase().includes(query) ||
        p.localNames.lg.toLowerCase().includes(query) ||
        p.localNames.sw.toLowerCase().includes(query) ||
        p.targetCrops.some((c) => c.toLowerCase().includes(query))
      );
    });
  }, [activeTab, query]);

  // Filtered diseases
  const filteredDiseases = useMemo(() => {
    if (
      activeTab === 'cereals' ||
      activeTab === 'legumes' ||
      activeTab === 'tubers' ||
      activeTab === 'cash' ||
      activeTab === 'horticulture'
    ) {
      return [];
    }

    return COMPENDIUM_DISEASES.filter((d) => {
      if (!query) return true;
      return (
        d.name.toLowerCase().includes(query) ||
        d.scientificName.toLowerCase().includes(query) ||
        d.localNames.lg.toLowerCase().includes(query) ||
        d.localNames.sw.toLowerCase().includes(query) ||
        d.pathogenType.toLowerCase().includes(query) ||
        d.targetCrops.some((c) => c.toLowerCase().includes(query))
      );
    });
  }, [activeTab, query]);

  const handleAddCropToFarm = (c: CompendiumCrop) => {
    if (!onAddCropFromCompendium) return;
    const today = new Date().toISOString().split('T')[0];
    const harvestDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const newCrop: Crop = {
      id: 'crp_' + Date.now(),
      farmId: 'farm_01',
      fieldId: 'fld_01',
      fieldName: 'Main Field Plot',
      name: c.name,
      variety: 'Improved High-Yield Cultivar',
      plantingDate: today,
      growthStage: 'Vegetative Growth',
      expectedHarvestDate: harvestDate,
      currentHealth: 'Healthy',
      notes: `Imported from Agronomy Research Compendium. Recommended spacing: ${c.agronomicSpecs.spacing}.`,
      photoUrl: c.imageUrl,
      scansCount: 0,
    };

    onAddCropFromCompendium(newCrop);
    setAddedCropNotice(`${c.name} added to your active crops inventory!`);
    setTimeout(() => setAddedCropNotice(null), 3500);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-56 h-56 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-emerald-200 mb-2 border border-white/15">
            <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
            <span>
              {lang === 'lg'
                ? 'Ebyafaayo by’Obulimi, Ebirime, n’Ebirwadde'
                : lang === 'sw'
                ? 'Kanzidata ya Mazao, Wadudu, na Magonjwa ya Kilimo'
                : 'Comprehensive Agronomy & Plant Health Encyclopedia'}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl tracking-tight">
            {lang === 'lg'
              ? 'Okunoonyereza ku Birime, Ebisanyi n’Endwadde'
              : lang === 'sw'
              ? 'Maktaba ya Utafiti wa Mazao, Wadudu na Magonjwa'
              : 'Crop Agronomy & Pest Research Compendium'}
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 leading-relaxed">
            {lang === 'lg'
              ? 'Ebikwata ku mmere ey’empeke, ebinyeebwa, ebirime by’emizi, kasooli, omweceere, n’engeri y’okutta ebiwuka n’okujjanjaba endwadde.'
              : lang === 'sw'
              ? 'Mwongozo kamili wa nafaka, jamii ya kunde, mizizi, mazao ya biashara, udhibiti wa wadudu, na mbinu za kutibu magonjwa kulingana na sayansi.'
              : 'Scientific protocols, soil requirements, fertilizer programs, pest biological thresholds, and disease treatments across all cereals, grains, tubers, and horticultural crops.'}
          </p>

          {/* Live Search Input */}
          <div className="mt-5 relative max-w-xl">
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'lg'
                  ? 'Noonya ekirime, ekisanyi, oba obulwadde (Kasooli, ebiwuka, blight...)'
                  : lang === 'sw'
                  ? 'Tafuta zao, mdudu au ugonjwa (Mahindi, nyanya, viwavi jeshi, ukungu...)'
                  : 'Search crops, grains, cereals, pests, diseases, or symptoms...'
              }
              className="w-full pl-11 pr-10 py-3 bg-white/95 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-500 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-md"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Added notice */}
      {addedCropNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 text-xs font-bold rounded-2xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{addedCropNotice}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: lang === 'lg' ? 'Byonna' : lang === 'sw' ? 'Yote' : 'All Categories', count: COMPENDIUM_CROPS.length + COMPENDIUM_PESTS.length + COMPENDIUM_DISEASES.length },
          { id: 'cereals', label: lang === 'lg' ? 'Emmere y’Empeke (Cereals)' : lang === 'sw' ? 'Nafaka (Cereals & Grains)' : 'Cereals & Grains', count: COMPENDIUM_CROPS.filter(c => c.category === 'Cereals & Grains').length },
          { id: 'legumes', label: lang === 'lg' ? 'Ebijanjaalo & Soya (Legumes)' : lang === 'sw' ? 'Kunde na Maharage (Legumes)' : 'Legumes & Pulses', count: COMPENDIUM_CROPS.filter(c => c.category === 'Legumes & Pulses').length },
          { id: 'tubers', label: lang === 'lg' ? 'Eby’Emizi (Tubers)' : lang === 'sw' ? 'Mizizi (Roots & Tubers)' : 'Roots & Tubers', count: COMPENDIUM_CROPS.filter(c => c.category === 'Roots & Tubers').length },
          { id: 'cash', label: lang === 'lg' ? 'Eby’Ensimbi (Coffee & Cash)' : lang === 'sw' ? 'Mazao ya Biashara (Cash Crops)' : 'Cash & Plantation', count: COMPENDIUM_CROPS.filter(c => c.category === 'Cash & Plantation').length },
          { id: 'horticulture', label: lang === 'lg' ? 'Enva n’Ebibala (Vegetables)' : lang === 'sw' ? 'Mboga na Matunda' : 'Vegetables & Fruits', count: COMPENDIUM_CROPS.filter(c => c.category === 'Vegetables & Horticultural' || c.category === 'Fruits & Orchards').length },
          { id: 'pests', label: lang === 'lg' ? 'Ebiwuka ebirya ebirime (Pests)' : lang === 'sw' ? 'Wadudu Waharibifu (Pests)' : 'Pests Directory', count: COMPENDIUM_PESTS.length },
          { id: 'diseases', label: lang === 'lg' ? 'Endwadde z’Ebirime (Diseases)' : lang === 'sw' ? 'Magonjwa ya Mazao (Diseases)' : 'Diseases Directory', count: COMPENDIUM_DISEASES.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-sm'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-white/20 dark:bg-black/20 text-white dark:text-stone-900'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: CROPS, CEREALS & GRAINS */}
      {filteredCrops.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-lg text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {lang === 'lg'
                  ? 'Ebirime n’Emmere y’Empeke'
                  : lang === 'sw'
                  ? 'Mazao na Nafaka'
                  : 'Crops, Cereals & Grains Compendium'}
              </span>
              <span className="text-xs text-stone-400 font-normal">({filteredCrops.length} entries)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCrops.map((crop) => (
              <div
                key={crop.id}
                onClick={() => setSelectedCrop(crop)}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-xs hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={crop.imageUrl}
                      alt={crop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {crop.category}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-emerald-700/80 backdrop-blur-md rounded-md text-[10px] font-bold text-white">
                      pH: {crop.soilRequirements.pH}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-heading font-extrabold text-base text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {crop.name}
                        </h3>
                        <span className="text-xs font-mono italic text-stone-400 dark:text-stone-500">
                          {crop.scientificName}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                        {crop.localNames.lg} • {crop.localNames.sw}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {lang === 'lg'
                        ? crop.description.lg
                        : lang === 'sw'
                        ? crop.description.sw
                        : crop.description.en}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-stone-600 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Maturity:</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{crop.agronomicSpecs.maturityDays}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">Target Yield:</span>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{crop.agronomicSpecs.expectedYield}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <span>View Agronomy Dossier</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: PESTS DIRECTORY */}
      {filteredPests.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-lg text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Bug className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>
                {lang === 'lg'
                  ? 'Ebiwuka n’Ebisanyi Ebirya Ebirime'
                  : lang === 'sw'
                  ? 'Katalogi ya Wadudu Waharibifu'
                  : 'Major Agricultural Pests Directory'}
              </span>
              <span className="text-xs text-stone-400 font-normal">({filteredPests.length} species)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPests.map((pest) => (
              <div
                key={pest.id}
                onClick={() => setSelectedPest(pest)}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-xs hover:border-rose-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={pest.imageUrl}
                      alt={pest.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-rose-600 text-white shadow-xs">
                        Insect Pest
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-heading font-extrabold text-base text-stone-900 dark:text-stone-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                          {pest.name}
                        </h3>
                        <span className="text-xs font-mono italic text-stone-400">
                          {pest.scientificName}
                        </span>
                      </div>
                      <div className="text-[11px] text-rose-800 dark:text-rose-400 font-medium">
                        {pest.localNames.lg} • {pest.localNames.sw}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {pest.identificationMarks}
                    </p>

                    <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
                      <span className="font-bold text-stone-700 dark:text-stone-300">Host Crops:</span>{' '}
                      {pest.targetCrops.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-rose-50/50 dark:bg-rose-950/30 border-t border-rose-100 dark:border-rose-900/40 flex items-center justify-between text-xs font-bold text-rose-700 dark:text-rose-400">
                  <span>View IPM Control Protocol</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: DISEASES DIRECTORY */}
      {filteredDiseases.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-lg text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>
                {lang === 'lg'
                  ? 'Endwadde z’Ebirime (Pathology)'
                  : lang === 'sw'
                  ? 'Magonjwa ya Mazao (Plant Pathology)'
                  : 'Plant Pathology & Disease Compendium'}
              </span>
              <span className="text-xs text-stone-400 font-normal">({filteredDiseases.length} pathogens)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDiseases.map((dis) => (
              <div
                key={dis.id}
                onClick={() => setSelectedDisease(dis)}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={dis.imageUrl}
                      alt={dis.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-600 text-white shadow-xs">
                        {dis.pathogenType}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-heading font-extrabold text-base text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {dis.name}
                        </h3>
                        <span className="text-xs font-mono italic text-stone-400">
                          {dis.scientificName}
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-800 dark:text-amber-400 font-medium">
                        {dis.localNames.lg} • {dis.localNames.sw}
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {dis.symptoms[0]}
                    </p>

                    <div className="pt-2 text-[11px] text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
                      <span className="font-bold text-stone-700 dark:text-stone-300">Affects:</span>{' '}
                      {dis.targetCrops.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-amber-50/50 dark:bg-amber-950/30 border-t border-amber-100 dark:border-amber-900/40 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                  <span>View Diagnostic & Treatment Plan</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {filteredCrops.length === 0 && filteredPests.length === 0 && filteredDiseases.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 text-stone-400">
          <Info className="w-10 h-10 mx-auto mb-3 text-stone-300 dark:text-stone-600" />
          <h4 className="text-base font-bold text-stone-700 dark:text-stone-300">No matching research records found</h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try a different search keyword (e.g. "Maize", "Cassava", "Armyworm", "Blight", or local names like "Kasooli" / "Mahindi").
          </p>
          <button
            onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
            className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* --- MODAL 1: CROP AGRONOMY DOSSIER --- */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-3xl max-h-[90vh] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-y-auto">
            {/* Modal Header */}
            <div className="relative h-56 bg-stone-900">
              <img
                src={selectedCrop.imageUrl}
                alt={selectedCrop.name}
                className="w-full h-full object-cover opacity-60"
              />
              <button
                onClick={() => setSelectedCrop(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 uppercase">
                  {selectedCrop.category}
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl mt-1">
                  {selectedCrop.name}
                </h2>
                <div className="text-xs text-emerald-200 font-mono">
                  {selectedCrop.scientificName} • Luganda: {selectedCrop.localNames.lg} • Swahili: {selectedCrop.localNames.sw}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800">
                {lang === 'lg'
                  ? selectedCrop.description.lg
                  : lang === 'sw'
                  ? selectedCrop.description.sw
                  : selectedCrop.description.en}
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Soil & pH Range</div>
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">pH {selectedCrop.soilRequirements.pH}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">{selectedCrop.soilRequirements.soilType}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Climate & Temp</div>
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">{selectedCrop.climateRequirements.tempRange}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">{selectedCrop.climateRequirements.rainfall}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Yield Expectation</div>
                  <div className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">{selectedCrop.agronomicSpecs.expectedYield}</div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">Maturity: {selectedCrop.agronomicSpecs.maturityDays}</div>
                </div>
              </div>

              {/* Agronomic Spacing & Fertilizer Regimen */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center space-x-2">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Agronomic Specifications & Nutrition Program</span>
                </h4>

                <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200">Recommended Spacing:</span>{' '}
                    <span className="text-stone-600 dark:text-stone-400">{selectedCrop.agronomicSpecs.spacing}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200">Seed Rate:</span>{' '}
                    <span className="text-stone-600 dark:text-stone-400">{selectedCrop.agronomicSpecs.seedRate}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200">Basal Fertilizer:</span>{' '}
                    <span className="text-stone-600 dark:text-stone-400">{selectedCrop.fertilizerPlan.basal}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200">Top-Dressing:</span>{' '}
                    <span className="text-stone-600 dark:text-stone-400">{selectedCrop.fertilizerPlan.topDressing}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800 dark:text-stone-200">Organic Compost:</span>{' '}
                    <span className="text-stone-600 dark:text-stone-400">{selectedCrop.fertilizerPlan.organicCompost}</span>
                  </div>
                </div>
              </div>

              {/* Associated Pests & Diseases */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
                  <h5 className="font-heading font-bold text-xs text-rose-900 dark:text-rose-300 flex items-center space-x-1.5 mb-2">
                    <Bug className="w-3.5 h-3.5" />
                    <span>Primary Pests of {selectedCrop.name}</span>
                  </h5>
                  <ul className="text-xs space-y-1 text-rose-800 dark:text-rose-300">
                    {selectedCrop.commonPests.map((p, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                  <h5 className="font-heading font-bold text-xs text-amber-900 dark:text-amber-300 flex items-center space-x-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Primary Pathogens & Diseases</span>
                  </h5>
                  <ul className="text-xs space-y-1 text-amber-800 dark:text-amber-300">
                    {selectedCrop.commonDiseases.map((d, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Harvesting & Post-Harvest Handling */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs">
                <h5 className="font-heading font-bold text-xs text-blue-950 dark:text-blue-300 mb-1">
                  Harvesting & Quality Preservation Guidelines
                </h5>
                <p className="text-blue-900 dark:text-blue-300/90 leading-relaxed">
                  {selectedCrop.harvestingGuidelines}
                </p>
              </div>

              {/* Citations */}
              <div className="text-[11px] text-stone-400 border-t border-stone-200 dark:border-stone-800 pt-3">
                <span className="font-bold text-stone-500">Scientific Sources:</span>{' '}
                {selectedCrop.researchCitations.join(' • ')}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const cName = selectedCrop.name;
                      setSelectedCrop(null);
                      onScanForCrop(cName);
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Scan {selectedCrop.name}</span>
                  </button>

                  <button
                    onClick={() => {
                      const cName = selectedCrop.name;
                      setSelectedCrop(null);
                      onConsultAI({
                        cropName: cName,
                        issue: 'Comprehensive field management, organic pest control, and optimal fertilizer regimen',
                      });
                    }}
                    className="flex items-center space-x-1.5 px-4 py-2.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Ask AI Agronomist</span>
                  </button>
                </div>

                {onAddCropFromCompendium && (
                  <button
                    onClick={() => handleAddCropToFarm(selectedCrop)}
                    className="flex items-center space-x-1.5 px-4 py-2.5 border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to My Farm Crops</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: PEST DOSSIER --- */}
      {selectedPest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-3xl max-h-[90vh] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-y-auto">
            <div className="relative h-56 bg-stone-900">
              <img
                src={selectedPest.imageUrl}
                alt={selectedPest.name}
                className="w-full h-full object-cover opacity-60"
              />
              <button
                onClick={() => setSelectedPest(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 uppercase">
                  Insect Pest Dossier
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl mt-1">
                  {selectedPest.name}
                </h2>
                <div className="text-xs text-rose-200 font-mono">
                  {selectedPest.scientificName} • Luganda: {selectedPest.localNames.lg} • Swahili: {selectedPest.localNames.sw}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Identification & Economic Threshold */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">Identification Marks:</span>{' '}
                  <span className="text-stone-600 dark:text-stone-400">{selectedPest.identificationMarks}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">Economic Action Threshold:</span>{' '}
                  <span className="text-rose-700 dark:text-rose-400 font-semibold">{selectedPest.economicThreshold}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">Host Crops:</span>{' '}
                  <span className="text-stone-600 dark:text-stone-400">{selectedPest.targetCrops.join(', ')}</span>
                </div>
              </div>

              {/* Symptoms & Damage Checklist */}
              <div>
                <h4 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100 mb-2">
                  Observed Damage Symptoms
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPest.symptomsAndDamage.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 rounded-xl text-xs text-rose-950 dark:text-rose-300 flex items-start space-x-2"
                    >
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrated Pest Management (IPM) */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
                  Integrated Pest Management (IPM) Strategy
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 rounded-xl">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">Cultural & Preventive Controls:</span>
                    <ul className="list-disc list-inside space-y-1 text-emerald-800 dark:text-emerald-300/90">
                      {selectedPest.culturalControls.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800 rounded-xl">
                    <span className="font-bold text-blue-900 dark:text-blue-300 block mb-1">Biological & Organic Controls:</span>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-300/90">
                      {selectedPest.biologicalControls.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800 rounded-xl">
                    <span className="font-bold text-amber-900 dark:text-amber-300 block mb-1">Targeted Chemical Interventions:</span>
                    <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-300/90">
                      {selectedPest.chemicalControls.map((chem, i) => (
                        <li key={i}>{chem}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-400">Sources: {selectedPest.researchSources.join(' • ')}</span>
                <button
                  onClick={() => {
                    const pName = selectedPest.name;
                    setSelectedPest(null);
                    onConsultAI({
                      cropName: selectedPest.targetCrops[0] || 'Crop',
                      issue: `How do I eradicate ${pName} sustainably on my farm?`,
                    });
                  }}
                  className="px-4 py-2 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Ask AI How to Control This</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: DISEASE DOSSIER --- */}
      {selectedDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 w-full max-w-3xl max-h-[90vh] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-y-auto">
            <div className="relative h-56 bg-stone-900">
              <img
                src={selectedDisease.imageUrl}
                alt={selectedDisease.name}
                className="w-full h-full object-cover opacity-60"
              />
              <button
                onClick={() => setSelectedDisease(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 uppercase">
                  {selectedDisease.pathogenType} Pathology Dossier
                </span>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl mt-1">
                  {selectedDisease.name}
                </h2>
                <div className="text-xs text-amber-200 font-mono">
                  {selectedDisease.scientificName} • Luganda: {selectedDisease.localNames.lg} • Swahili: {selectedDisease.localNames.sw}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Transmission & Trigger conditions */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-2 text-xs">
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">Transmission & Vector:</span>{' '}
                  <span className="text-stone-600 dark:text-stone-400">{selectedDisease.transmissionAndVectors}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">Trigger Weather Conditions:</span>{' '}
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">{selectedDisease.triggerConditions}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-stone-100">Susceptible Crops:</span>{' '}
                  <span className="text-stone-600 dark:text-stone-400">{selectedDisease.targetCrops.join(', ')}</span>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h4 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100 mb-2">
                  Diagnostic Visual Symptoms
                </h4>
                <div className="space-y-1.5">
                  {selectedDisease.symptoms.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-xl text-xs text-amber-950 dark:text-amber-300 flex items-start space-x-2"
                    >
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resistant Varieties if available */}
              {selectedDisease.resistantVarieties && selectedDisease.resistantVarieties.length > 0 && (
                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">
                    Certified Resistant / Tolerant Cultivars:
                  </span>
                  <span className="text-emerald-800 dark:text-emerald-400 font-medium">
                    {selectedDisease.resistantVarieties.join(', ')}
                  </span>
                </div>
              )}

              {/* Management Program */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
                  Treatment & Containment Program
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl">
                    <span className="font-bold text-stone-900 dark:text-stone-200 block mb-1">Cultural Sanitation & Crop Rotation:</span>
                    <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300">
                      {selectedDisease.culturalManagement.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 rounded-xl">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300 block mb-1">Organic Bio-Fungicides & Copper Sprays:</span>
                    <ul className="list-disc list-inside space-y-1 text-emerald-800 dark:text-emerald-300/90">
                      {selectedDisease.organicTreatment.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 rounded-xl">
                    <span className="font-bold text-rose-900 dark:text-rose-300 block mb-1">Targeted Chemical Fungicides / Bactericides:</span>
                    <ul className="list-disc list-inside space-y-1 text-rose-800 dark:text-rose-300/90">
                      {selectedDisease.chemicalTreatment.map((chem, i) => (
                        <li key={i}>{chem}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-400">Sources: {selectedDisease.researchSources.join(' • ')}</span>
                <button
                  onClick={() => {
                    const dName = selectedDisease.name;
                    setSelectedDisease(null);
                    onConsultAI({
                      cropName: selectedDisease.targetCrops[0] || 'Crop',
                      issue: `What is the optimal emergency treatment plan for ${dName}?`,
                    });
                  }}
                  className="px-4 py-2 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Ask AI Agronomist on Treatment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
