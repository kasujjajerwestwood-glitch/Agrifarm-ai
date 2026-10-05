import React from 'react';
import {
  Camera,
  Sparkles,
  Sprout,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  Calendar,
  CloudRain,
  Droplets,
  Thermometer,
  Bell,
  ChevronRight,
  Eye,
  Activity,
  Bug,
  Leaf,
  Layers,
  HeartPulse,
} from 'lucide-react';
import {
  Crop,
  Field,
  PlantScan,
  FarmActivity,
  SmartAlert,
  WeatherData,
  UserProfile,
  Farm,
  Language,
} from '../types';
import { t } from '../services/i18n';

interface DashboardViewProps {
  user: UserProfile;
  farm: Farm;
  crops: Crop[];
  fields: Field[];
  scans: PlantScan[];
  activities: FarmActivity[];
  alerts: SmartAlert[];
  weather: WeatherData;
  onNavigate: (tab: string) => void;
  onSelectScan: (scan: PlantScan) => void;
  onSelectCropForScan?: (cropName: string) => void;
  lang: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  farm,
  crops,
  fields,
  scans,
  activities,
  alerts,
  weather,
  onNavigate,
  onSelectScan,
  onSelectCropForScan,
  lang,
}) => {
  const healthyCrops = crops.filter((c) => c.currentHealth === 'Healthy').length;
  const attentionCrops = crops.filter((c) => c.currentHealth !== 'Healthy').length;
  const unreadAlerts = alerts.filter((a) => !a.isRead);

  // Informational Farm Health Score
  const totalCropsCount = crops.length || 1;
  const healthRatio = healthyCrops / totalCropsCount;
  const healthScore = Math.max(
    40,
    Math.min(98, Math.round(healthRatio * 80 + (attentionCrops === 0 ? 18 : 5)))
  );

  // Extract recently detected issues from scans with problems
  const problemScans = scans
    .filter(
      (s) =>
        s.analysis?.healthStatus &&
        s.analysis.healthStatus !== 'Healthy'
    )
    .slice(0, 3);

  // Today / upcoming farm activities
  const recentTasks = activities.slice(0, 4);

  return (
    <div className="space-y-7 pb-20">
      {/* 1. TOP BAR: Farmer Greeting, Farm Name & Notification Bell */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center space-x-3.5">
          <img
            src={
              user.avatarUrl ||
              'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=160'
            }
            alt={user.name}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-600/30 shadow-xs cursor-pointer shrink-0"
            onClick={() => onNavigate('profile')}
          />
          <div>
            <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 flex items-center space-x-1.5">
              <span>{lang === 'lg' ? 'Osiibye otya,' : lang === 'sw' ? 'Habari yako,' : 'Welcome back,'}</span>
              <span className="font-bold text-stone-800 dark:text-stone-200">{user.name.split(' ')[0]}</span>
            </div>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <span>{farm.name}</span>
              <span className="text-xs font-normal text-stone-400">
                ({farm.district} · {farm.sizeHectares} ha)
              </span>
            </h2>
          </div>
        </div>

        {/* Quick Weather & Notification Pill */}
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <div
            onClick={() => onNavigate('monitoring')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200/80 text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer border border-stone-200 dark:border-stone-700 transition-colors"
            title="View Weather & Soil Monitoring"
          >
            <Thermometer className="w-4 h-4 text-amber-500" />
            <span>{weather.temperature}°C</span>
            <span className="text-stone-400">•</span>
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span>{weather.humidity}%</span>
          </div>

          <button
            onClick={() => onNavigate('alerts')}
            className="relative p-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 border border-stone-200 dark:border-stone-700 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadAlerts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 2. MAIN HERO SECTION: "How are your crops doing today?" + SCAN A PLANT */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-800 text-white p-6 sm:p-8 shadow-xl shadow-emerald-950/15">
        {/* Subtle decorative leaf silhouette */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <Sprout className="w-72 h-72 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>
              {lang === 'lg'
                ? 'Okulondoola Ebirime n’Obulamu'
                : lang === 'sw'
                ? 'Ukaguzi wa Afya ya Mazao Papo Hapo'
                : 'Real-Time Crop Health Scouting'}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-2xl sm:text-4xl tracking-tight leading-tight">
            {lang === 'lg'
              ? 'Ebirime byo biri bitya leero?'
              : lang === 'sw'
              ? 'Mazao yako yanaendeleaje leo?'
              : 'How are your crops doing today?'}
          </h1>

          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-xl">
            {lang === 'lg'
              ? 'Kuba ekifaananyi ku kirime ekirwadde oba ekiriko ebiwuka okufuna amagezi ga AI n’obujjanjabi obutuufu.'
              : lang === 'sw'
              ? 'Piga picha sehemu iliyoathirika ya mmea kupata utambuzi wa AI wa magonjwa, wadudu au upungufu wa virutubisho.'
              : 'Take a clear photograph of an unhealthy leaf, stem, or plant to receive instant AI diagnosis, symptoms breakdown, and practical management steps.'}
          </p>

          {/* PRIMARY HERO BUTTON: 📷 SCAN A PLANT */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate('scan')}
              className="py-4 px-7 bg-white text-emerald-900 hover:bg-emerald-50 active:scale-98 font-heading font-extrabold text-base rounded-2xl shadow-xl shadow-black/15 flex items-center justify-center space-x-3 transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <span className="tracking-wide">
                {lang === 'lg' ? '📷 KUBA EKIRIME' : lang === 'sw' ? '📷 PIMA ZAO LAKO' : '📷 SCAN A PLANT'}
              </span>
            </button>

            {/* SECONDARY ACTIONS */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('assistant')}
                className="flex-1 sm:flex-initial py-3.5 px-4 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" />
                <span>{lang === 'lg' ? 'Buuza AgriFarm' : lang === 'sw' ? 'Uliza AgriFarm' : 'Ask AgriFarm Uganda'}</span>
              </button>

              <button
                onClick={() => onNavigate('crops')}
                className="flex-1 sm:flex-initial py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <Sprout className="w-4 h-4 text-emerald-200" />
                <span>{lang === 'lg' ? 'Ebirime Byange' : lang === 'sw' ? 'Mazao Yangu' : 'My Crops'}</span>
              </button>

              <div
                onClick={() => onNavigate('monitoring')}
                className="hidden lg:flex items-center space-x-2 py-3 px-4 rounded-2xl bg-white/10 text-white text-xs font-semibold cursor-pointer hover:bg-white/15"
                title="Overall Farm Health Score"
              >
                <HeartPulse className="w-4 h-4 text-rose-300" />
                <span>{healthScore}% {lang === 'lg' ? 'Obulamu' : lang === 'sw' ? 'Afya' : 'Farm Health'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. YOUR CROPS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'lg' ? 'Ebirime Byo' : lang === 'sw' ? 'Mazao Yako' : 'Your Crops'}</span>
              <span className="text-xs font-normal text-stone-400">({crops.length})</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'lg'
                ? 'Londoola embeera n’obulamu bwa buli kirime kyo'
                : lang === 'sw'
                ? 'Fuatilia hali ya afya na ukuaji wa kila zao'
                : 'Monitor health status, growth stage, and inspection dates'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('crops')}
            className="flex items-center space-x-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>{lang === 'lg' ? 'Laba Byonna' : lang === 'sw' ? 'Tazama Yote' : 'View All Crops'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {crops.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center mx-auto">
              <Sprout className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100">
              Add your first crop to start monitoring your farm
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
              Register maize, tomatoes, coffee, beans, or any variety to track scans and seasonal care.
            </p>
            <button
              onClick={() => onNavigate('crops')}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Crop</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {crops.map((crop) => {
              const isHealthy = crop.currentHealth === 'Healthy';
              return (
                <div
                  key={crop.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 hover:border-emerald-500/60 dark:hover:border-emerald-600/60 transition-all shadow-xs hover:shadow-md flex flex-col justify-between group"
                >
                  <div className="flex items-start space-x-3.5">
                    <img
                      src={
                        crop.photoUrl ||
                        'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&q=80&w=200'
                      }
                      alt={crop.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-800 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                          {crop.name}
                        </h3>
                      </div>

                      <div className="text-xs text-stone-500 dark:text-stone-400 truncate mt-0.5">
                        {crop.variety ? `${crop.variety} · ` : ''}
                        {crop.fieldName || 'Main Field'}
                      </div>

                      {/* Health Status Indicator */}
                      <div className="flex items-center space-x-1.5 mt-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isHealthy ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                          }`}
                        />
                        <span
                          className={`text-xs font-semibold ${
                            isHealthy
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-amber-700 dark:text-amber-400 font-bold'
                          }`}
                        >
                          {crop.currentHealth}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Meta & Actions */}
                  <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400">
                      {crop.growthStage || 'Vegetative Growth'}
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          if (onSelectCropForScan) onSelectCropForScan(crop.name);
                          onNavigate('scan');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] flex items-center space-x-1 transition-colors"
                        title={`Scan ${crop.name} now`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Scan</span>
                      </button>

                      <button
                        onClick={() => onNavigate('crops')}
                        className="px-2 py-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 text-[11px] font-semibold"
                      >
                        Details &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. RECENT PROBLEMS SECTION (Detected Diseases, Pests, Nutrient Issues) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>{lang === 'lg' ? 'Ebizibu ebizuuliddwa eby’Ebirime' : lang === 'sw' ? 'Matatizo ya Mazao Yaliyogunduliwa' : 'Recent Problems Detected'}</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'lg'
                ? 'Endwadde n’ebiwuka ebyakazuulibwa mu kukebera'
                : lang === 'sw'
                ? 'Magonjwa na wadudu walioripotiwa kwenye uchunguzi wa hivi karibuni'
                : 'Diagnoses from recent scans requiring treatment or agricultural intervention'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('history')}
            className="flex items-center space-x-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>{lang === 'lg' ? 'Ebyafaayo' : lang === 'sw' ? 'Historia Yote' : 'Scan History'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {problemScans.length === 0 ? (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 flex items-center space-x-3 text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">
                {lang === 'lg'
                  ? 'Tewali bulwadde buzuuliddwa ku birime byo!'
                  : lang === 'sw'
                  ? 'Hakuna matatizo ya afya ya mazao yaliyogunduliwa.'
                  : 'No active crop health problems detected.'}
              </span>{' '}
              <span className="opacity-80">
                {lang === 'lg'
                  ? 'Ebirime byo birabika bulungi. Weeyongere okubikebera.'
                  : lang === 'sw'
                  ? 'Mazao yako yana afya nzuri. Endelea kufanya ukaguzi mara kwa mara.'
                  : 'Your recorded scans show healthy crop conditions. Continue routine field scouting!'}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {problemScans.map((scan) => {
              const analysis = scan.analysis!;
              const isHigh = analysis.severity === 'High' || analysis.severity === 'Critical';
              return (
                <div
                  key={scan.id}
                  onClick={() => onSelectScan(scan)}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 hover:border-amber-500 transition-all shadow-xs cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={
                        scan.imageUrl ||
                        scan.images?.[0]?.url ||
                        'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&q=80&w=200'
                      }
                      alt={scan.cropName}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isHigh ? 'bg-rose-600' : 'bg-amber-500'
                          }`}
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                          {scan.cropName}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-sm text-stone-900 dark:text-stone-100 truncate mt-0.5">
                        {analysis.possibleIssue}
                      </h4>
                      <div className="text-[11px] text-stone-400">
                        Confidence: {analysis.confidence}% · {analysis.severity} Severity
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {analysis.recommendedNextSteps?.[0] ||
                      analysis.nextSteps?.[0] ||
                      'Isolate affected plant tissue and review disease management.'}
                  </p>

                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400">
                      {new Date(scan.createdAt || scan.date || Date.now()).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline inline-flex items-center space-x-1">
                      <span>View Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. FARM TASKS & ACTIVITIES SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-stone-900 dark:text-stone-100 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'lg' ? 'Emirimu gya Ffaamu' : lang === 'sw' ? 'Majukumu ya Shamba' : 'Farm Tasks'}</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {lang === 'lg'
                ? 'Okufukirira, ebigimusa, okukuba eddagala n’amakungula'
                : lang === 'sw'
                ? 'Umwagiliaji, mbolea, upuliziaji wa dawa, na uvunaji'
                : 'Irrigation, fertilization, inspection, and seasonal crop care'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('activities')}
            className="flex items-center space-x-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            <span>{lang === 'lg' ? 'Laba Byonna' : lang === 'sw' ? 'Tazama Yote' : 'View All Tasks'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <div className="p-6 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-xs text-stone-500">
            No pending tasks recorded for today. Keep track of watering and feeding schedules.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {recentTasks.map((act) => {
              const currentType = act.activityType || act.type || 'Activity';

              return (
                <div
                  key={act.id}
                  onClick={() => onNavigate('activities')}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-3.5 hover:border-emerald-500 transition-colors shadow-xs cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                      {currentType}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {new Date(act.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate">
                    {act.title}
                  </h4>

                  <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                    {act.notes || `${act.cropName || 'Field'} routine operation`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. BOTTOM BANNER: DISCOVER AGRONOMY RESEARCH & PEST DIRECTORY */}
      <div className="rounded-3xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-heading font-extrabold text-sm sm:text-base text-stone-900 dark:text-stone-100 flex items-center space-x-2">
            <Leaf className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === 'lg'
                ? 'Kanzidata y’Ebyobulimi, Ebisanyi n’Endwadde'
                : lang === 'sw'
                ? 'Maktaba ya Utafiti wa Mazao, Wadudu na Magonjwa'
                : 'Agronomy Research & Pest Identification Compendium'}
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {lang === 'lg'
              ? 'Mapeesa ku mmere y’empeke, ebinyeebwa, ebirime by’emizi, obulwadde, n’engeri y’okutta ebiwuka.'
              : lang === 'sw'
              ? 'Tafiti sayansi ya nafaka, kunde, mizizi, viwango vya wadudu, na mbinu za udhibiti wa asili.'
              : 'Scientific protocols, economic thresholds, biological bio-pesticides, and disease treatments across 20+ crops.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('research')}
          className="px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-bold text-xs hover:bg-stone-800 transition-colors shrink-0 flex items-center justify-center space-x-1.5"
        >
          <span>
            {lang === 'lg'
              ? 'Soma Kanzidata'
              : lang === 'sw'
              ? 'Fungua Maktaba'
              : 'Explore Library'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
