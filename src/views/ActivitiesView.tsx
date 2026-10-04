import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Filter,
  Calendar,
  Sprout,
  X,
  Droplets,
  Scissors,
  Bug,
  AlertTriangle,
  ShoppingBag,
  Shovel,
} from 'lucide-react';
import { FarmActivity, ActivityType, Crop, Field, Language } from '../types';

interface ActivitiesViewProps {
  activities: FarmActivity[];
  crops: Crop[];
  fields: Field[];
  onAddActivity: (activity: FarmActivity) => void;
  lang: Language;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  activities,
  crops,
  fields,
  onAddActivity,
  lang,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('Irrigation');
  const [cropId, setCropId] = useState(crops[0]?.id || '');
  const [fieldId, setFieldId] = useState(fields[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [quantityOrCost, setQuantityOrCost] = useState('');

  const filtered = activities.filter((a) => {
    return filterType === 'all' || a.activityType === filterType;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedCrop = crops.find((c) => c.id === cropId);
    const selectedField = fields.find((f) => f.id === fieldId);

    const newActivity: FarmActivity = {
      id: 'act_' + Date.now(),
      farmId: 'farm_01',
      fieldId: selectedField?.id,
      fieldName: selectedField?.name,
      cropId: selectedCrop?.id,
      cropName: selectedCrop?.name,
      date,
      activityType,
      title: title.trim(),
      notes,
      quantityOrCost,
    };

    onAddActivity(newActivity);
    setIsModalOpen(false);
    setTitle('');
    setNotes('');
    setQuantityOrCost('');
  };

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'Irrigation':
        return <Droplets className="w-4 h-4 text-blue-600" />;
      case 'Spraying':
      case 'Pest observation':
        return <Bug className="w-4 h-4 text-amber-600" />;
      case 'Disease observation':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'Harvest':
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case 'Weeding':
        return <Scissors className="w-4 h-4 text-purple-600" />;
      case 'Soil preparation':
        return <Shovel className="w-4 h-4 text-stone-600" />;
      default:
        return <Sprout className="w-4 h-4 text-emerald-700" />;
    }
  };

  const getLocalizedType = (type: string) => {
    if (lang === 'lg') {
      if (type === 'Irrigation') return 'Okufukirira';
      if (type === 'Fertilizing') return 'Kuteekamu Ebigimusa';
      if (type === 'Weeding') return 'Okukabala';
      if (type === 'Spraying') return 'Okufuuyira';
      if (type === 'Disease observation') return 'Okulaba Endwadde';
      if (type === 'Pest observation') return 'Okulaba Ebiwuka';
      if (type === 'Harvest') return 'Amakungula';
      if (type === 'Planting') return 'Okusiga';
      return type;
    }
    if (lang === 'sw') {
      if (type === 'Irrigation') return 'Umwagiliaji';
      if (type === 'Fertilizing') return 'Kuweka Mbolea';
      if (type === 'Weeding') return 'Palizi ya Magugu';
      if (type === 'Spraying') return 'Kupulizia Dawa';
      if (type === 'Disease observation') return 'Uchunguzi wa Magonjwa';
      if (type === 'Pest observation') return 'Uchunguzi wa Wadudu';
      if (type === 'Harvest') return 'Mavuno';
      if (type === 'Planting') return 'Kupanda';
      return type;
    }
    return type;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full mb-1 border border-emerald-200 dark:border-emerald-800">
            <Activity className="w-3.5 h-3.5" />
            <span>
              {lang === 'lg'
                ? 'Ebiwandiiko by’Emirimu gya Ffaamu'
                : lang === 'sw'
                ? 'Daftari la Shughuli za Shamba'
                : 'Digital Operations Journal'}
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
            {lang === 'lg'
              ? 'Emirimu Egikolebwa ku Ffaamu'
              : lang === 'sw'
              ? 'Kumbukumbu za Shughuli za Shamba'
              : 'Farm Activity Tracker'}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
            {lang === 'lg'
              ? 'Kuuma ebiwandiiko byonna eby’okufuuyira, okugimusa, amakungula n’okukola ku ffaamu.'
              : lang === 'sw'
              ? 'Weka kumbukumbu za shughuli za pembejeo, mbolea, umwagiliaji, na kazi zote za shambani.'
              : 'Maintain chronological farm records for input traceability, labor tracking, and compliance.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'lg' ? 'Wandiika Omulimu Omupya' : lang === 'sw' ? 'Weka Shughuli Mpya' : 'Log New Activity'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-3 bg-white dark:bg-stone-900 p-3.5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs">
        <Filter className="w-4 h-4 text-stone-400" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-1.5 text-xs border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white dark:bg-stone-800 font-medium text-stone-700 dark:text-stone-300"
        >
          <option value="all">
            {lang === 'lg' ? `Emirimu Gyonna (${activities.length})` : lang === 'sw' ? `Shughuli Zote (${activities.length})` : `All Activities (${activities.length})`}
          </option>
          <option value="Irrigation">{lang === 'lg' ? 'Okufukirira' : lang === 'sw' ? 'Umwagiliaji' : 'Irrigation'}</option>
          <option value="Fertilizing">{lang === 'lg' ? 'Kuteekamu Ebigimusa' : lang === 'sw' ? 'Kuweka Mbolea' : 'Fertilizing'}</option>
          <option value="Weeding">{lang === 'lg' ? 'Okukabala' : lang === 'sw' ? 'Palizi ya Magugu' : 'Weeding'}</option>
          <option value="Spraying">{lang === 'lg' ? 'Okufuuyira' : lang === 'sw' ? 'Kupulizia Dawa' : 'Spraying'}</option>
          <option value="Disease observation">{lang === 'lg' ? 'Okulaba Endwadde' : lang === 'sw' ? 'Uchunguzi wa Magonjwa' : 'Disease Observation'}</option>
          <option value="Pest observation">{lang === 'lg' ? 'Okulaba Ebiwuka' : lang === 'sw' ? 'Uchunguzi wa Wadudu' : 'Pest Observation'}</option>
          <option value="Harvest">{lang === 'lg' ? 'Amakungula' : lang === 'sw' ? 'Mavuno' : 'Harvest'}</option>
          <option value="Planting">{lang === 'lg' ? 'Okusiga' : lang === 'sw' ? 'Kupanda' : 'Planting'}</option>
        </select>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3">
        {filtered.map((act) => (
          <div
            key={act.id}
            className="bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-xs flex items-start space-x-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
          >
            <div className="w-10 h-10 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
              {getActivityIcon(act.activityType)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
                    {act.title}
                  </h3>
                  <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-bold rounded">
                    {getLocalizedType(act.activityType)}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-stone-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{act.date}</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">{act.notes}</p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-stone-500 dark:text-stone-400">
                {act.cropName && (
                  <span className="flex items-center space-x-1 text-emerald-800 dark:text-emerald-300 font-semibold">
                    <Sprout className="w-3 h-3" />
                    <span>{act.cropName}</span>
                  </span>
                )}
                {act.fieldName && <span>• {lang === 'lg' ? 'Ennimiro' : lang === 'sw' ? 'Kitalu' : 'Field'}: {act.fieldName}</span>}
                {act.quantityOrCost && (
                  <span className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded text-stone-600 dark:text-stone-300 font-mono text-[10px]">
                    {act.quantityOrCost}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200 dark:border-stone-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 mb-4">
              <h3 className="font-heading font-bold text-base text-stone-900 dark:text-stone-100">
                {lang === 'lg' ? 'Wandiika Omulimu gwa Ffaamu' : lang === 'sw' ? 'Weka Shughuli ya Shamba' : 'Log Farm Activity'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  {lang === 'lg' ? 'Omutwe gw’Omulimu *' : lang === 'sw' ? 'Kichwa cha Shughuli *' : 'Activity Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Applied Drip Fertigation & Trellised Row 4"
                  className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    {lang === 'lg' ? 'Ekika ky’Omulimu' : lang === 'sw' ? 'Aina ya Shughuli' : 'Activity Type'}
                  </label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as ActivityType)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    <option value="Planting">{lang === 'lg' ? 'Okusiga' : lang === 'sw' ? 'Kupanda' : 'Planting'}</option>
                    <option value="Irrigation">{lang === 'lg' ? 'Okufukirira' : lang === 'sw' ? 'Umwagiliaji' : 'Irrigation'}</option>
                    <option value="Fertilizing">{lang === 'lg' ? 'Kuteekamu Ebigimusa' : lang === 'sw' ? 'Kuweka Mbolea' : 'Fertilizing'}</option>
                    <option value="Weeding">{lang === 'lg' ? 'Okukabala' : lang === 'sw' ? 'Palizi ya Magugu' : 'Weeding'}</option>
                    <option value="Pest observation">{lang === 'lg' ? 'Okulaba Ebiwuka' : lang === 'sw' ? 'Uchunguzi wa Wadudu' : 'Pest Observation'}</option>
                    <option value="Disease observation">{lang === 'lg' ? 'Okulaba Endwadde' : lang === 'sw' ? 'Uchunguzi wa Magonjwa' : 'Disease Observation'}</option>
                    <option value="Harvest">{lang === 'lg' ? 'Amakungula' : lang === 'sw' ? 'Mavuno' : 'Harvest'}</option>
                    <option value="Soil preparation">{lang === 'lg' ? 'Okutegeka Ettaka' : lang === 'sw' ? 'Kutayarisha Udongo' : 'Soil Preparation'}</option>
                    <option value="Spraying">{lang === 'lg' ? 'Okufuuyira' : lang === 'sw' ? 'Kupulizia Dawa' : 'Spraying'}</option>
                    <option value="Other">{lang === 'lg' ? 'Ebirala' : lang === 'sw' ? 'Nyingine' : 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    {lang === 'lg' ? 'Olunaku' : lang === 'sw' ? 'Tarehe' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    {lang === 'lg' ? 'Ekirime Ekikwatibwako' : lang === 'sw' ? 'Zao Linalohusika' : 'Associated Crop'}
                  </label>
                  <select
                    value={cropId}
                    onChange={(e) => setCropId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.variety})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                    {lang === 'lg' ? 'Ennimiro / Kibanja' : lang === 'sw' ? 'Eneo la Kitalu' : 'Field Location'}
                  </label>
                  <select
                    value={fieldId}
                    onChange={(e) => setFieldId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium"
                  >
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  {lang === 'lg' ? 'Ebikozeseddwa / Obunene / Ensimbi' : lang === 'sw' ? 'Pembejeo / Kiwango / Gharama' : 'Inputs / Quantity / Cost'}
                </label>
                <input
                  type="text"
                  value={quantityOrCost}
                  onChange={(e) => setQuantityOrCost(e.target.value)}
                  placeholder="e.g. 500g Calcium Nitrate / 15,000 UGX"
                  className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1">
                  {lang === 'lg' ? 'Ebiwandiiko ebirala' : lang === 'sw' ? 'Maelezo ya Ziada' : 'Detailed Operational Notes'}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record observations, weather during application, nozzle used, dosage..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20"
              >
                {lang === 'lg' ? 'Kuuma Omulimu Guno' : lang === 'sw' ? 'Hifadhi Kumbukumbu Hii' : 'Save Activity Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
