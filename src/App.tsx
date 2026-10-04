import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Farm,
  Field,
  Crop,
  PlantScan,
  FarmActivity,
  SmartAlert,
  SensorReading,
  WeatherData,
  Language,
  ThemeMode,
} from './types';
import { StorageService } from './services/storageService';
import { ApiService } from './services/apiService';
import { SupabaseService } from './services/supabase';
import { ThemeService } from './services/themeService';
import { NotificationService } from './services/notificationService';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { AuthModal } from './components/modals/AuthModal';
import { SupabaseSetupGuideModal } from './components/modals/SupabaseSetupGuideModal';
import { NotificationToast } from './components/common/NotificationToast';

// Views
import { DashboardView } from './views/DashboardView';
import { ScannerView } from './views/ScannerView';
import { AssistantView } from './views/AssistantView';
import { CropsView } from './views/CropsView';
import { FarmFieldsView } from './views/FarmFieldsView';
import { MonitoringView } from './views/MonitoringView';
import { ActivitiesView } from './views/ActivitiesView';
import { ScanHistoryView } from './views/ScanHistoryView';
import { AlertsView } from './views/AlertsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { AdminView } from './views/AdminView';
import { LandingPageView } from './views/LandingPageView';
import { ProfileView } from './views/ProfileView';
import { ResearchCompendiumView } from './views/ResearchCompendiumView';

export default function App() {
  // Global Application State backed by resilient local storage and Cloud Firestore
  const [user, setUser] = useState<UserProfile>(StorageService.getUser());
  const [farm, setFarm] = useState<Farm>(StorageService.getFarm());
  const [fields, setFields] = useState<Field[]>(StorageService.getFields());
  const [crops, setCrops] = useState<Crop[]>(StorageService.getCrops());
  const [scans, setScans] = useState<PlantScan[]>(StorageService.getScans());
  const [activities, setActivities] = useState<FarmActivity[]>(StorageService.getActivities());
  const [alerts, setAlerts] = useState<SmartAlert[]>(StorageService.getAlerts());
  const [sensors, setSensors] = useState<SensorReading[]>(StorageService.getSensors());

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedScanForDetail, setSelectedScanForDetail] = useState<PlantScan | null>(null);

  // AI Chat consultation transfer context
  const [assistantInitialContext, setAssistantInitialContext] = useState<{
    prompt?: string;
    image?: string;
  }>({});

  // Language & Theme State
  const [lang, setLang] = useState<Language>(user.preferredLanguage || 'en');
  const [theme, setTheme] = useState<ThemeMode>(ThemeService.getTheme());

  // Real-time Notification Toast
  const [toastAlert, setToastAlert] = useState<SmartAlert | null>(null);

  // Network Connectivity
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Auth & Setup Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Weather state
  const [weather, setWeather] = useState<WeatherData>({
    source: 'Regional Agro-Forecast Service',
    district: farm.district,
    temperature: 26.4,
    feelsLike: 27.2,
    humidity: 72,
    precipitation: 0.0,
    precipitationProbability: 25,
    windSpeed: 8.5,
    forecast: [
      { date: 'Today', maxTemp: 28, minTemp: 19, rainProb: 25, rainSum: 0.5 },
      { date: 'Tomorrow', maxTemp: 27, minTemp: 18, rainProb: 40, rainSum: 2.1 },
      { date: 'Day 3', maxTemp: 26, minTemp: 18, rainProb: 65, rainSum: 9.4 },
      { date: 'Day 4', maxTemp: 25, minTemp: 19, rainProb: 75, rainSum: 14.2 },
      { date: 'Day 5', maxTemp: 28, minTemp: 18, rainProb: 20, rainSum: 0.0 },
    ],
    agriculturalAlerts: [
      'Good conditions for field scouting and early morning transplanting.',
      'Rain predicted in 48-72 hours. Check drainage furrows.',
    ],
    soilMoistureEst: 58,
  });

  // Listen to Theme changes
  useEffect(() => {
    return ThemeService.subscribe((newTheme) => {
      setTheme(newTheme);
    });
  }, []);

  // Listen to Supabase Auth state for real multi-user sync
  useEffect(() => {
    const unsubscribe = SupabaseService.onAuthStateChange(async (sbUser) => {
      if (sbUser) {
        try {
          // Fetch user profile from Supabase
          const profile = await SupabaseService.getProfile(sbUser.id);
          if (profile) {
            setUser(profile);
            setLang(profile.preferredLanguage);
            StorageService.saveUser(profile);
          } else {
            // Newly registered or OAuth user without profile doc yet
            const newProfile: UserProfile = {
              id: sbUser.id,
              name: (sbUser.user_metadata as any)?.full_name || user.name || 'Farmer',
              email: sbUser.email || user.email,
              avatarUrl: (sbUser.user_metadata as any)?.avatar_url || user.avatarUrl,
              country: user.country || 'Uganda',
              district: user.district || '',
              preferredLanguage: user.preferredLanguage || 'en',
              farmName: user.farmName || '',
              farmerType: user.farmerType || 'Smallholder Farmer',
              role: 'farmer',
              createdAt: new Date().toISOString(),
            };
            setUser(newProfile);
            await SupabaseService.saveProfile(newProfile);
            StorageService.saveUser(newProfile);

            // If farmName or district not yet completed, prompt the user to complete their profile
            if (!newProfile.farmName || !newProfile.district) {
              setCurrentTab('profile');
            }
          }

          // Fetch user-isolated farm records from Supabase
          const userFarms = await SupabaseService.getFarms(sbUser.id);
          if (userFarms && userFarms.length > 0) {
            setFarm(userFarms[0]);
            StorageService.saveFarm(userFarms[0]);
          }

          const [userCrops, userScans, userActs, userAlts] = await Promise.all([
            SupabaseService.getCrops(sbUser.id),
            SupabaseService.getPlantScans(sbUser.id),
            SupabaseService.getFarmActivities(sbUser.id),
            SupabaseService.getNotifications(sbUser.id),
          ]);

          if (userCrops && userCrops.length > 0) setCrops(userCrops);
          if (userScans && userScans.length > 0) setScans(userScans);
          if (userActs && userActs.length > 0) setActivities(userActs);
          if (userAlts && userAlts.length > 0) setAlerts(userAlts);
        } catch (err) {
          console.warn('Could not sync user records from Supabase:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Setup network listener and fetch live weather
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Fetch live weather based on farm coordinates
    ApiService.getWeather(farm.coordinates.lat, farm.coordinates.lon, farm.district)
      .then((data) => setWeather(data))
      .catch((e) => console.warn('Could not load live weather:', e));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [farm.coordinates.lat, farm.coordinates.lon, farm.district]);

  // Handlers for data updates (synced locally and to Supabase)
  const handleUpdateUser = async (updated: UserProfile) => {
    setUser(updated);
    setLang(updated.preferredLanguage);
    StorageService.saveUser(updated);
    if (SupabaseService.isConfigured()) {
      await SupabaseService.saveProfile(updated);
    }
  };

  const handleUpdateFarm = async (updated: Farm) => {
    setFarm(updated);
    StorageService.saveFarm(updated);
    if (SupabaseService.isConfigured()) {
      await SupabaseService.saveFarm({ ...updated, userId: user.id }, user.id);
    }
  };

  const handleAddField = async (field: Field) => {
    StorageService.addField(field);
    setFields(StorageService.getFields());
  };

  const handleDeleteField = (id: string) => {
    StorageService.deleteField(id);
    setFields(StorageService.getFields());
  };

  const handleAddCrop = async (crop: Crop) => {
    StorageService.addCrop(crop);
    setCrops(StorageService.getCrops());
    if (SupabaseService.isConfigured()) {
      await SupabaseService.saveCrop(crop, user.id);
    }
  };

  const handleUpdateCrop = async (crop: Crop) => {
    StorageService.updateCrop(crop);
    setCrops(StorageService.getCrops());
    if (SupabaseService.isConfigured()) {
      await SupabaseService.saveCrop(crop, user.id);
    }
  };

  const handleSaveScan = async (scan: PlantScan) => {
    StorageService.addScan(scan);
    setScans(StorageService.getScans());
    setCrops(StorageService.getCrops());
    if (SupabaseService.isConfigured()) {
      await SupabaseService.savePlantScan(scan, user.id);
    }

    // Trigger smart alert and notification if severe
    if (scan.analysis.severity === 'High' || scan.analysis.severity === 'Critical') {
      const newAlert: SmartAlert = {
        id: 'alt_' + Date.now(),
        farmId: farm.id,
        type: 'Warning',
        category: 'disease',
        title: `Pest/Disease Alert: ${scan.analysis.possibleIssue}`,
        message: `High severity issue flagged on ${scan.cropName}. Review recommended next steps in the diagnostic report.`,
        date: new Date().toISOString(),
        isRead: false,
        relatedCropId: scan.cropId,
      };
      StorageService.addAlert(newAlert);
      setAlerts(StorageService.getAlerts());
      setToastAlert(newAlert);

      // Dispatch Web push notification and chime
      NotificationService.sendNotification(newAlert.title, {
        body: newAlert.message,
        severity: 'warning',
      });

      if (SupabaseService.isConfigured()) {
        await SupabaseService.saveNotification(newAlert, user.id);
      }
    }
  };

  const handleAddActivity = async (activity: FarmActivity) => {
    StorageService.addActivity(activity);
    setActivities(StorageService.getActivities());
    if (SupabaseService.isConfigured()) {
      await SupabaseService.saveFarmActivity(activity, user.id);
    }
  };

  const handleMarkAlertRead = (id: string) => {
    StorageService.markAlertRead(id);
    setAlerts(StorageService.getAlerts());
  };

  const handleClearAlert = (id: string) => {
    StorageService.clearAlert(id);
    setAlerts(StorageService.getAlerts());
  };

  const handleMarkAllAlertsRead = () => {
    const updated = alerts.map((a) => ({ ...a, isRead: true }));
    setAlerts(updated);
    StorageService.saveAlerts(updated);
  };

  const handleClearAllAlerts = () => {
    setAlerts([]);
    StorageService.saveAlerts([]);
  };

  const handleTriggerTestAlert = () => {
    const testAlert: SmartAlert = {
      id: 'alt_test_' + Date.now(),
      farmId: farm.id,
      type: 'Warning',
      category: 'disease',
      title: '🚨 Field Alert: High Fungal Spore Activity Detected',
      message: 'Warm humid conditions detected in North Greenhouse Block. High risk of Tomato Late Blight. Inspect lower leaf surfaces and apply protective bio-fungicide.',
      date: new Date().toISOString(),
      isRead: false,
    };
    StorageService.addAlert(testAlert);
    setAlerts(StorageService.getAlerts());
    setToastAlert(testAlert);

    // Send browser notification and chime
    NotificationService.sendNotification(testAlert.title, {
      body: testAlert.message,
      severity: 'warning',
    });
  };

  const handleUpdateSensor = (updated: SensorReading) => {
    const next = sensors.map((s) => (s.id === updated.id ? updated : s));
    setSensors(next);
    StorageService.saveSensors(next);
  };

  const handleResetData = () => {
    StorageService.resetToSampleData();
    setUser(StorageService.getUser());
    setFarm(StorageService.getFarm());
    setFields(StorageService.getFields());
    setCrops(StorageService.getCrops());
    setScans(StorageService.getScans());
    setActivities(StorageService.getActivities());
    setAlerts(StorageService.getAlerts());
    setSensors(StorageService.getSensors());
  };

  const handleWipeData = () => {
    StorageService.wipeAllData();
    window.location.reload();
  };

  // Navigating to scanner with a specific crop selected
  const handleScanForCrop = (cropName: string) => {
    setSelectedScanForDetail(null);
    setCurrentTab('scan');
  };

  // Selecting a scan from dashboard or history to inspect
  const handleSelectScan = (scan: PlantScan) => {
    setSelectedScanForDetail(scan);
    setCurrentTab('scan');
  };

  // Bridge from Scanner to Agrifarm AI
  const handleConsultAI = (context: { cropName: string; issue: string; imageBase64?: string }) => {
    setAssistantInitialContext({
      prompt: `I just scanned a ${context.cropName} plant and the AI diagnosed it as "${context.issue}". Can you provide an in-depth biological management plan and tell me how often I should inspect the plot?`,
      image: context.imageBase64,
    });
    setCurrentTab('assistant');
  };

  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      {/* Desktop Sidebar (hidden on mobile, visible on md and up) */}
      <div className="hidden md:block">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            if (tab === 'scan') setSelectedScanForDetail(null);
            setCurrentTab(tab);
          }}
          user={user}
          farm={farm}
          unreadAlertsCount={unreadAlertsCount}
          onOpenAuth={() => setIsAuthOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
          lang={lang}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            if (tab === 'scan' && currentTab !== 'scan') {
              setSelectedScanForDetail(null);
            }
            setCurrentTab(tab);
          }}
          user={user}
          farm={farm}
          isOnline={isOnline}
          unreadAlertsCount={unreadAlertsCount}
          onOpenAuth={() => setIsAuthOpen(true)}
          lang={lang}
          setLang={(newLang) => {
            setLang(newLang);
            handleUpdateUser({ ...user, preferredLanguage: newLang });
          }}
          theme={theme}
          onToggleTheme={() => ThemeService.toggleTheme()}
        />

        {/* Main Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {currentTab === 'landing' && (
            <LandingPageView
              onScanNow={() => {
                setSelectedScanForDetail(null);
                setCurrentTab('scan');
              }}
              onGetStarted={() => setCurrentTab('dashboard')}
              onExploreFeatures={() => {
                const el = document.getElementById('features-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {currentTab === 'dashboard' && (
            <DashboardView
              user={user}
              farm={farm}
              crops={crops}
              fields={fields}
              scans={scans}
              activities={activities}
              alerts={alerts}
              weather={weather}
              onNavigate={(tab) => {
                if (tab === 'scan') setSelectedScanForDetail(null);
                setCurrentTab(tab);
              }}
              onSelectScan={handleSelectScan}
              onSelectCropForScan={(cropName) => handleScanForCrop(cropName)}
              lang={lang}
            />
          )}

        {currentTab === 'profile' && (
          <ProfileView
            user={user}
            farm={farm}
            fields={fields}
            crops={crops}
            scans={scans}
            onUpdateUser={handleUpdateUser}
            onUpdateFarm={handleUpdateFarm}
            lang={lang}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'scan' && (
          <ScannerView
            crops={crops}
            fields={fields}
            onSaveScan={handleSaveScan}
            onConsultAI={handleConsultAI}
            lang={lang}
            initialScan={selectedScanForDetail}
          />
        )}

        {currentTab === 'crops' && (
          <CropsView
            crops={crops}
            fields={fields}
            onAddCrop={handleAddCrop}
            onUpdateCrop={handleUpdateCrop}
            onScanForCrop={handleScanForCrop}
            lang={lang}
          />
        )}

        {currentTab === 'research' && (
          <ResearchCompendiumView
            onScanForCrop={handleScanForCrop}
            onAddCropFromCompendium={handleAddCrop}
            onConsultAI={(context) => {
              setAssistantInitialContext({
                prompt: `Can you give me an expert agronomic and disease management plan for ${context.cropName}? Context: ${context.issue}`,
              });
              setCurrentTab('assistant');
            }}
            lang={lang}
          />
        )}

        {currentTab === 'fields' && (
          <FarmFieldsView
            farm={farm}
            fields={fields}
            onUpdateFarm={handleUpdateFarm}
            onAddField={handleAddField}
            onDeleteField={handleDeleteField}
            lang={lang}
          />
        )}

        {currentTab === 'assistant' && (
          <AssistantView
            farm={farm}
            crops={crops}
            lang={lang}
            initialPrompt={assistantInitialContext.prompt}
            initialImage={assistantInitialContext.image}
          />
        )}

        {currentTab === 'monitoring' && (
          <MonitoringView
            sensors={sensors}
            onUpdateSensor={handleUpdateSensor}
            lang={lang}
          />
        )}

        {currentTab === 'activities' && (
          <ActivitiesView
            activities={activities}
            crops={crops}
            fields={fields}
            onAddActivity={handleAddActivity}
            lang={lang}
          />
        )}

        {currentTab === 'history' && (
          <ScanHistoryView
            scans={scans}
            onSelectScan={handleSelectScan}
            lang={lang}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            alerts={alerts}
            onMarkRead={handleMarkAlertRead}
            onClearAlert={handleClearAlert}
            onMarkAllRead={handleMarkAllAlertsRead}
            onClearAll={handleClearAllAlerts}
            onTriggerTestAlert={handleTriggerTestAlert}
            lang={lang}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView
            farm={farm}
            fields={fields}
            crops={crops}
            scans={scans}
            activities={activities}
            sensors={sensors}
            lang={lang}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            user={user}
            onUpdateUser={handleUpdateUser}
            lang={lang}
            setLang={setLang}
            theme={theme}
            setTheme={(t) => ThemeService.setTheme(t)}
            onResetData={handleResetData}
            onWipeData={handleWipeData}
            onOpenAuth={() => setIsAuthOpen(true)}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            user={user}
            onUpdateRole={(newRole) => handleUpdateUser({ ...user, role: newRole })}
          />
        )}
        </main>
      </div>

      {/* Real-Time Alert Notification Toast */}
      <NotificationToast
        alert={toastAlert}
        onDismiss={() => setToastAlert(null)}
        onView={() => {
          setToastAlert(null);
          setCurrentTab('alerts');
        }}
      />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'scan') setSelectedScanForDetail(null);
          setCurrentTab(tab);
        }}
        unreadAlertsCount={unreadAlertsCount}
        lang={lang}
        theme={theme}
        onToggleTheme={() => ThemeService.toggleTheme()}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Profile & Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onOpenGuide={() => {
          setIsAuthOpen(false);
          setIsGuideOpen(true);
        }}
      />

      {/* Supabase Setup Guide Modal */}
      <SupabaseSetupGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
