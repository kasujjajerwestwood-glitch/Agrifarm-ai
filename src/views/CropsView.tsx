import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
  Camera,
  X,
  Activity,
} from 'lucide-react';
import { Crop, Field, CropHealthStatus, GrowthStage, Language } from '../types';
import { t } from '../services/i18n';

interface CropsViewProps {
  crops: Crop[];
  fields: Field[];
  onAddCrop: (crop: Crop) => void;
  onUpdateCrop: (crop: Crop) => void;
  onScanForCrop: (cropName: string) => void;
  lang: Language;
}

export const CropsView: React.FC<CropsViewProps> = ({
  crops,
  fields,
  onAddCrop,
  onUpdateCrop,
  onScanForCrop,
  lang,
}) => {
  const [search, setSearch] = useState('');
  const [filterHealth, setFilterHealth] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);

  // New crop form state
  const [newCropName, setNewCropName] = useState('');
  const [newVariety, setNewVariety] = useState('');
  const [newFieldId, setNewFieldId] = useState(fields[0]?.id || '');
  const [newPlantingDate, setNewPlantingDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [newExpectedHarvest, setNewExpectedHarvest] = useState('');
  const [newStage, setNewStage] = useState<GrowthStage>('Vegetative Growth');
  const [newHealth, setNewHealth] = useState<CropHealthStatus>('Healthy');
  const [newNotes, setNewNotes] = useState('');

  const filteredCrops = crops.filter((crop) => {
    const matchesSearch =
      crop.name.toLowerCase().includes(search.toLowerCase()) ||
      crop.variety.toLowerCase().includes(search.toLowerCase()) ||
      crop.fieldName.toLowerCase().includes(search.toLowerCase());
    const matchesHealth =
      filterHealth === 'all' || crop.currentHealth === filterHealth;
    return matchesSearch && matchesHealth;
  });

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName.trim()) return;

    const assignedField = fields.find((f) => f.id === newFieldId);

    const newCrop: Crop = {
      id: 'crp_' + Date.now(),
      farmId: 'farm_01',
      fieldId: newFieldId,
      fieldName: assignedField ? assignedField.name : 'Unassigned',
      name: newCropName.trim(),
      variety: newVariety.trim() || 'Standard Variety',
      plantingDate: newPlantingDate,
      growthStage: newStage,
      expectedHarvestDate: newExpectedHarvest || '2026-12-01',
      currentHealth: newHealth,
      notes: newNotes,
      photoUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
      scansCount: 0,
    };

    onAddCrop(newCrop);
    setIsAddModalOpen(false);
    // Reset form
    setNewCropName('');
    setNewVariety('');
    setNewNotes('');
  };

  const getLocalizedHealth = (health: string) => {
    if (lang === 'lg') {
      if (health === 'Healthy') return 'Galamu Bulungi';
      if (health === 'Attention Needed') return 'Yetaaga Okutunulwamu';
      if (health === 'Disease Detected') return 'Kirwadde';
      if (health === 'Pest Infestation') return 'Ebiwuka Biriikirira';
      return health;
    }
    if (lang === 'sw') {
      if (health === 'Healthy') return 'Nzuri / Yenye Afya';
      if (health === 'Attention Needed') return 'Inahitaji Uangalizi';
      if (health === 'Disease Detected') return 'Kuna Ugonjwa';
      if (health === 'Pest Infestation') return 'Ina Wadudu';
      return health;
    }
    return health;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full mb-1 border border-emerald-200 dark:border-emerald-800">
            <Sprout className="w-3.5 h-3.5" />
            <span>
              {lang === 'lg'
                ? 'Ebirime bya Ffaamu'
                : lang === 'sw'
                ? 'Kwingi za Mazao ya Shamba'
                : 'Digital Crop Portfolio'}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
            {lang === 'lg' ? 'Ebirime Byange' : lang === 'sw' ? 'Mazao Yangu' : 'My Crops'}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            {lang === 'lg'
              ? 'Londoola emitendera gy’ebirime, obulamu, n’ebikubiddwa AI ku buli kibanja.'
              : lang === 'sw'
              ? 'Fuatilia hatua za ukuaji wa mazao, ripoti za afya, na uchunguzi wa AI kwa kila kitalu.'
              : 'Track crop growth stages, health records, and link AI plant scans directly to each field.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'lg' ? 'Gattako Ekirime' : lang === 'sw' ? 'Ongeza Zao Jipya' : 'Add New Crop'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              lang === 'lg'
                ? 'Noonya ekirime ku linnya, ekika oba ennimiro...'
                : lang === 'sw'
                ? 'Tafuta mazao kwa jina, aina, au kitalu...'
                : 'Search crops by name, variety, or field...'
            }
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-stone-400" />
          <select
            value={filterHealth}
            onChange={(e) => setFilterHealth(e.target.value)}
            className="px-3 py-2 text-xs border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white dark:bg-stone-800 font-medium text-stone-700 dark:text-stone-300"
          >
            <option value="all">
              {lang === 'lg' ? 'Embeera Zonna' : lang === 'sw' ? 'Hali Zote za Afya' : 'All Health Statuses'}
            </option>
            <option value="Healthy">
              {lang === 'lg' ? 'Ebiramu Bulungi' : lang === 'sw' ? 'Yenye Afya Nzuri' : 'Healthy Only'}
            </option>
            <option value="Attention Needed">
              {lang === 'lg' ? 'Ebyetaaga Okutunulwamu' : lang === 'sw' ? 'Yanayohitaji Uangalizi' : 'Attention Needed'}
            </option>
            <option value="Disease Detected">
              {lang === 'lg' ? 'Ebirwadde' : lang === 'sw' ? 'Magonjwa Yametambuliwa' : 'Disease Detected'}
            </option>
            <option value="Pest Infestation">
              {lang === 'lg' ? 'Ebiwuka Biriikirira' : lang === 'sw' ? 'Yenye Wadudu Waharibifu' : 'Pest Infestation'}
            </option>
          </select>
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCrops.map((crop) => (
          <div
            key={crop.id}
            onClick={() => setSelectedCrop(crop)}
            className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/90 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-lg hover:border-emerald-400 dark:hover:border-emerald-600 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Photo & Health badge */}
              <div className="relative h-44 overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={
                    crop.photoUrl ||
                    'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`px-3 py-1 text-[11px] font-bold rounded-full shadow-sm text-white ${
                      crop.currentHealth === 'Healthy'
                        ? 'bg-emerald-600'
                        : crop.currentHealth === 'Attention Needed'
                        ? 'bg-yellow-500 text-stone-900'
                        : 'bg-rose-600'
                    }`}
                  >
                    {getLocalizedHealth(crop.currentHealth)}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-[10px] font-bold text-white flex items-center space-x-1">
                  <Camera className="w-3 h-3 text-emerald-300" />
                  <span>
                    {crop.scansCount}{' '}
                    {lang === 'lg' ? 'okukeberebwa' : lang === 'sw' ? 'vipimo' : 'scans logged'}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-extrabold text-lg text-stone-900 dark:text-stone-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {crop.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                      {lang === 'lg' ? 'Ekika' : lang === 'sw' ? 'Aina' : 'Variety'}: {crop.variety}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    {crop.fieldName}
                  </span>
                </div>

                {/* Growth Stage Progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-500 dark:text-stone-400 font-medium">
                      {lang === 'lg' ? 'Omutendera' : lang === 'sw' ? 'Hatua ya Ukuaji' : 'Growth Stage'}:
                    </span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{crop.growthStage}</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{
                        width:
                          crop.growthStage.includes('Seedling')
                            ? '20%'
                            : crop.growthStage.includes('Vegetative')
                            ? '45%'
                            : crop.growthStage.includes('Flowering')
                            ? '70%'
                            : crop.growthStage.includes('Fruit')
                            ? '85%'
                            : '100%',
                      }}
                    ></div>
                  </div>
                </div>

                {/* Key dates */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
                  <div>
                    <span>{lang === 'lg' ? 'Lwe Kyasigibwa' : lang === 'sw' ? 'Tarehe ya Kupanda' : 'Planted'}:</span>
                    <div className="font-bold text-stone-800 dark:text-stone-200">{crop.plantingDate}</div>
                  </div>
                  <div>
                    <span>{lang === 'lg' ? 'Amakungula' : lang === 'sw' ? 'Mavuno Yanayotarajiwa' : 'Est. Harvest'}:</span>
                    <div className="font-bold text-stone-800 dark:text-stone-200">{crop.expectedHarvestDate}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer quick action */}
            <div className="px-5 py-3 bg-stone-50 dark:bg-stone-800/60 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onScanForCrop(crop.name);
                }}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center space-x-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{lang === 'lg' ? 'Kebera Ekirime Kino' : lang === 'sw' ? 'Chunguza Zao Hili' : 'Scan This Crop'}</span>
              </button>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* ADD CROP MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
              <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100">
                {lang === 'lg' ? 'Yongerako Ekirime Ekipya' : lang === 'sw' ? 'Weka Zao Jipya Shambani' : 'Add New Crop Record'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCrop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  {lang === 'lg' ? 'Erinnya ly’Ekirime *' : lang === 'sw' ? 'Jina la Zao *' : 'Crop Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  placeholder="e.g. Tomato, Maize, Cassava, Cabbage, Rice, Sorghum"
                  className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    {lang === 'lg' ? 'Ekika / Cultivar' : lang === 'sw' ? 'Aina ya Mbegu' : 'Variety / Cultivar'}
                  </label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    placeholder="e.g. Anna F1, Longe 5D, NERICA 4"
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    {lang === 'lg' ? 'Ennimiro gy’okisimbidde' : lang === 'sw' ? 'Kitalu Kilichotengwa' : 'Assigned Field'}
                  </label>
                  <select
                    value={newFieldId}
                    onChange={(e) => setNewFieldId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    {lang === 'lg' ? 'Olunaku lw’Okusiga' : lang === 'sw' ? 'Tarehe ya Kupanda' : 'Planting Date'}
                  </label>
                  <input
                    type="date"
                    value={newPlantingDate}
                    onChange={(e) => setNewPlantingDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    {lang === 'lg' ? 'Amakungula g’Osubira' : lang === 'sw' ? 'Tarehe ya Mavuno' : 'Expected Harvest Date'}
                  </label>
                  <input
                    type="date"
                    value={newExpectedHarvest}
                    onChange={(e) => setNewExpectedHarvest(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    {lang === 'lg' ? 'Omutendera gw’Okukula' : lang === 'sw' ? 'Hatua ya Ukuaji' : 'Growth Stage'}
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as GrowthStage)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    <option value="Germination / Seedling">{lang === 'lg' ? 'Akato ennyo' : lang === 'sw' ? 'Miche / Mwanzo' : 'Seedling'}</option>
                    <option value="Vegetative Growth">{lang === 'lg' ? 'Ebikoola Bikula' : lang === 'sw' ? 'Ukuaji wa Majani' : 'Vegetative Growth'}</option>
                    <option value="Flowering / Budding">{lang === 'lg' ? 'Kimulisa' : lang === 'sw' ? 'Kutoa Maua' : 'Flowering / Budding'}</option>
                    <option value="Fruit / Grain Filling">{lang === 'lg' ? 'Bizimba Empeke/Ebibala' : lang === 'sw' ? 'Kujaza Nafaka / Matunda' : 'Fruit / Grain Filling'}</option>
                    <option value="Maturity / Ready to Harvest">{lang === 'lg' ? 'Kyetegese Kusalirwa' : lang === 'sw' ? 'Tayari kwa Mavuno' : 'Ready to Harvest'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    {lang === 'lg' ? 'Embeera y’Obulamu' : lang === 'sw' ? 'Hali ya Sasa' : 'Current Health'}
                  </label>
                  <select
                    value={newHealth}
                    onChange={(e) => setNewHealth(e.target.value as CropHealthStatus)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    <option value="Healthy">{lang === 'lg' ? 'Kiramu Bulungi' : lang === 'sw' ? 'Yenye Afya Nzuri' : 'Healthy'}</option>
                    <option value="Attention Needed">{lang === 'lg' ? 'Kyetaaga Okutunulwamu' : lang === 'sw' ? 'Inahitaji Uangalizi' : 'Attention Needed'}</option>
                    <option value="Disease Detected">{lang === 'lg' ? 'Kiriko Obulwadde' : lang === 'sw' ? 'Kuna Ugonjwa' : 'Disease Detected'}</option>
                    <option value="Pest Infestation">{lang === 'lg' ? 'Kiriko Ebiwuka' : lang === 'sw' ? 'Kuna Wadudu' : 'Pest Infestation'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  {lang === 'lg' ? 'Ebiwandiiko ebirala ku Nimiro' : lang === 'sw' ? 'Maelezo ya Ziada' : 'Field Notes / Soil Prep'}
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Raised beds, drip fertigation, organic compost incorporated..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20"
                >
                  {lang === 'lg' ? 'Kuuma Ekirime Kino' : lang === 'sw' ? 'Hifadhi Taarifa za Zao' : 'Save Crop Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CROP PROFILE DETAIL MODAL (Section 9) */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800 overflow-hidden">
            {/* Modal Header with Hero Image */}
            <div className="relative h-48 sm:h-56 bg-stone-900 overflow-hidden">
              <img
                src={
                  selectedCrop.photoUrl ||
                  'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'
                }
                alt={selectedCrop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button
                onClick={() => setSelectedCrop(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      selectedCrop.currentHealth === 'Healthy'
                        ? 'bg-emerald-600'
                        : selectedCrop.currentHealth === 'Attention Needed'
                        ? 'bg-amber-500 text-stone-900'
                        : 'bg-rose-600'
                    }`}
                  >
                    {getLocalizedHealth(selectedCrop.currentHealth)}
                  </span>
                  <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {selectedCrop.fieldName}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-2xl mt-1">{selectedCrop.name}</h3>
                <p className="text-xs text-stone-300">Cultivar / Variety: {selectedCrop.variety}</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs sm:text-sm">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                  <div className="text-[11px] text-stone-400 font-medium">Planting Date</div>
                  <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {selectedCrop.plantingDate}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                  <div className="text-[11px] text-stone-400 font-medium">Expected Harvest</div>
                  <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {selectedCrop.expectedHarvestDate || 'In Progress'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                  <div className="text-[11px] text-stone-400 font-medium">Growth Stage</div>
                  <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {selectedCrop.growthStage}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800">
                  <div className="text-[11px] text-stone-400 font-medium">Plant Health Scans</div>
                  <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {selectedCrop.scansCount} completed
                  </div>
                </div>
              </div>

              {/* Notes / Field Agronomy */}
              {selectedCrop.notes && (
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Agronomy Notes & Soil Prep
                  </div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                    {selectedCrop.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const cName = selectedCrop.name;
                    setSelectedCrop(null);
                    onScanForCrop(cName);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan {selectedCrop.name}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCrop(null)}
                  className="py-3 px-5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
