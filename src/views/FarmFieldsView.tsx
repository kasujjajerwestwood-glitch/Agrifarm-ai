import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  Plus,
  Compass,
  Droplets,
  Sprout,
  Edit2,
  CheckCircle2,
  Calendar,
  X,
  FileText,
} from 'lucide-react';
import { Farm, Field, FarmType, SoilType, IrrigationMethod, Language } from '../types';

interface FarmFieldsViewProps {
  farm: Farm;
  fields: Field[];
  onUpdateFarm: (farm: Farm) => void;
  onAddField: (field: Field) => void;
  onDeleteField: (id: string) => void;
  lang: Language;
}

export const FarmFieldsView: React.FC<FarmFieldsViewProps> = ({
  farm,
  fields,
  onUpdateFarm,
  onAddField,
  onDeleteField,
  lang,
}) => {
  const [isEditFarm, setIsEditFarm] = useState(false);
  const [farmName, setFarmName] = useState(farm.name);
  const [location, setLocation] = useState(farm.location);
  const [district, setDistrict] = useState(farm.district);
  const [size, setSize] = useState(farm.sizeHectares);
  const [farmType, setFarmType] = useState<FarmType>(farm.farmType);
  const [description, setDescription] = useState(farm.description);

  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [fieldSize, setFieldSize] = useState(0.8);
  const [cropName, setCropName] = useState('Maize');
  const [plantingDate, setPlantingDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [expectedHarvest, setExpectedHarvest] = useState('2026-12-15');
  const [soilType, setSoilType] = useState<SoilType>('Loam');
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>('Drip Irrigation');
  const [notes, setNotes] = useState('');

  const handleSaveFarm = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFarm({
      ...farm,
      name: farmName,
      location,
      district,
      sizeHectares: Number(size),
      farmType,
      description,
    });
    setIsEditFarm(false);
  };

  const handleCreateField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim()) return;

    const newField: Field = {
      id: 'fld_' + Date.now(),
      farmId: farm.id,
      name: fieldName.trim(),
      sizeHectares: Number(fieldSize),
      cropName: cropName.trim(),
      plantingDate,
      expectedHarvest,
      soilType,
      irrigationMethod,
      notes,
      status: 'active',
    };

    onAddField(newField);
    setIsAddFieldModalOpen(false);
    setFieldName('');
    setNotes('');
  };

  const totalFieldHectares = fields.reduce((sum, f) => sum + f.sizeHectares, 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Farm Overview Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 border border-stone-200/90 dark:border-stone-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-full mb-1 border border-emerald-200 dark:border-emerald-800">
              <Compass className="w-3.5 h-3.5" />
              <span>
                {lang === 'lg'
                  ? 'Ebiwandiiko bya Ffaamu'
                  : lang === 'sw'
                  ? 'Kumbukumbu ya Shamba'
                  : 'Digital Estate Record'}
              </span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 tracking-tight">
              {farm.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                {farm.location}, {farm.district} • GPS: {farm.coordinates.lat.toFixed(4)}°N, {farm.coordinates.lon.toFixed(4)}°E
              </span>
            </p>
          </div>

          <button
            onClick={() => setIsEditFarm(!isEditFarm)}
            className="flex items-center space-x-1.5 px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors self-start"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditFarm ? (lang === 'lg' ? 'Sazaamu' : lang === 'sw' ? 'Ghairi' : 'Cancel Edit') : (lang === 'lg' ? 'Kyusa Ffaamu' : lang === 'sw' ? 'Hariri Shamba' : 'Edit Farm Profile')}</span>
          </button>
        </div>

        {isEditFarm ? (
          <form onSubmit={handleSaveFarm} className="mt-6 pt-5 border-t border-stone-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Farm Name
                </label>
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Location / Route
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Total Size (Hectares)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Farm Production Type
                </label>
                <select
                  value={farmType}
                  onChange={(e) => setFarmType(e.target.value as FarmType)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Crop farming">Crop farming</option>
                  <option value="Livestock">Livestock</option>
                  <option value="Poultry">Poultry</option>
                  <option value="Fish farming">Fish farming</option>
                  <option value="Mixed farming">Mixed farming</option>
                  <option value="Greenhouse farming">Greenhouse farming</option>
                  <option value="Smart farming">Smart farming</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Update Farm Details
            </button>
          </form>
        ) : (
          <div className="mt-5 pt-4 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Total Estate Size
              </span>
              <span className="text-xl font-heading font-extrabold text-stone-900">
                {farm.sizeHectares} ha
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Cultivated Fields
              </span>
              <span className="text-xl font-heading font-extrabold text-emerald-700">
                {fields.length} Blocks
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Field Allocation
              </span>
              <span className="text-xl font-heading font-extrabold text-stone-900">
                {totalFieldHectares.toFixed(1)} / {farm.sizeHectares} ha
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                System Category
              </span>
              <span className="text-sm font-bold text-stone-800 mt-1 block">
                {farm.farmType}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Fields Management Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-xl text-stone-900 dark:text-stone-100">
            {lang === 'lg'
              ? 'Ebibanja n’Ennimiro zo'
              : lang === 'sw'
              ? 'Vitalu na Maeneo ya Shamba'
              : 'Fields & Cultivation Blocks'}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'lg'
              ? 'Ekika ky’ettaka, enkola y’okufukirira amazzi, n’ebiseera eby’okusiga.'
              : lang === 'sw'
              ? 'Aina za udongo, miundombinu ya umwagiliaji, na mzunguko wa upandaji.'
              : 'Soil classification, irrigation infrastructure, and planting cycles.'}
          </p>
        </div>

        <button
          onClick={() => setIsAddFieldModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/20"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'lg' ? 'Gattako Ekibanja' : lang === 'sw' ? 'Ongeza Kitalu' : 'Add New Field'}</span>
        </button>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {fields.map((field) => (
          <div
            key={field.id}
            className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200/90 dark:border-stone-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  {field.sizeHectares} {lang === 'lg' ? 'Hekitaagi' : lang === 'sw' ? 'Hekta' : 'Hectares'}
                </span>
                <h3 className="font-heading font-bold text-lg text-stone-900 dark:text-stone-100 mt-1">
                  {field.name}
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full text-xs font-semibold">
                {field.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 dark:bg-stone-800/60 rounded-2xl text-xs text-stone-600 dark:text-stone-300 border border-stone-100 dark:border-stone-800">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  {lang === 'lg' ? 'Ekirime Ekikiriko' : lang === 'sw' ? 'Zao la Sasa' : 'Current Crop'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{field.cropName}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  {lang === 'lg' ? 'Ekika ky’Ettaka' : lang === 'sw' ? 'Aina ya Udongo' : 'Soil Class'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{field.soilType}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  {lang === 'lg' ? 'Enfukirira' : lang === 'sw' ? 'Umwagiliaji' : 'Irrigation System'}
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-300">{field.irrigationMethod}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">
                  {lang === 'lg' ? 'Lwe Kyasigibwa' : lang === 'sw' ? 'Tarehe ya Kupanda' : 'Planted Date'}
                </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{field.plantingDate}</span>
              </div>
            </div>

            {field.notes && (
              <p className="text-xs text-stone-600 dark:text-stone-400 italic bg-white dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                "{field.notes}"
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-400">
              <span>{lang === 'lg' ? 'Amakungula' : lang === 'sw' ? 'Mavuno' : 'Target Harvest'}: {field.expectedHarvest}</span>
              <button
                onClick={() => onDeleteField(field.id)}
                className="text-stone-400 hover:text-rose-600 text-[11px]"
              >
                {lang === 'lg' ? 'Ggyawo Ekibanja' : lang === 'sw' ? 'Hifadhi / Futa Kitalu' : 'Archive Field'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD FIELD MODAL */}
      {isAddFieldModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-stone-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <h3 className="font-heading font-bold text-base text-stone-900">
                Register New Farm Field
              </h3>
              <button
                onClick={() => setIsAddFieldModalOpen(false)}
                className="p-1 rounded-full bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateField} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Field Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    placeholder="e.g. South Terrace Block"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Area (Hectares)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={fieldSize}
                    onChange={(e) => setFieldSize(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Primary Crop
                </label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g. Robusta Coffee, Maize, Tomato"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Soil Classification
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as SoilType)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="Loam">Loam (Balanced)</option>
                    <option value="Clay">Clay (Heavy / Water retentive)</option>
                    <option value="Sandy Loam">Sandy Loam (Fast draining)</option>
                    <option value="Silt Loam">Silt Loam</option>
                    <option value="Black Cotton">Black Cotton</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Irrigation System
                  </label>
                  <select
                    value={irrigationMethod}
                    onChange={(e) => setIrrigationMethod(e.target.value as IrrigationMethod)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Solar Smart Drip">Solar Smart Drip</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Rainfed">Rainfed</option>
                    <option value="Furrow / Flood">Furrow / Flood</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Planting Date
                  </label>
                  <input
                    type="date"
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Target Harvest
                  </label>
                  <input
                    type="date"
                    value={expectedHarvest}
                    onChange={(e) => setExpectedHarvest(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Field Notes & Infrastructure
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. East slope, terraced contours, solar pump supply line installed..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-emerald-700/20"
                >
                  Save Field Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
