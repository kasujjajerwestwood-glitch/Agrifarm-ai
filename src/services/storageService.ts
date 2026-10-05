import {
  UserProfile,
  Farm,
  Field,
  Crop,
  PlantScan,
  FarmActivity,
  SmartAlert,
  SensorReading,
} from '../types';
import {
  initialUser,
  initialFarm,
  initialFields,
  initialCrops,
  initialPlantScans,
  initialFarmActivities,
  initialSmartAlerts,
  initialSensorReadings,
} from '../data/mockInitialData';

const KEYS = {
  USER: 'agrifarm_user',
  FARM: 'agrifarm_farm',
  FIELDS: 'agrifarm_fields',
  CROPS: 'agrifarm_crops',
  SCANS: 'agrifarm_scans',
  ACTIVITIES: 'agrifarm_activities',
  ALERTS: 'agrifarm_alerts',
  SENSORS: 'agrifarm_sensors',
  OFFLINE_QUEUE: 'agrifarm_offline_queue',
  SUPABASE_CONFIG: 'agrifarm_supabase_config',
  UNIT_SYSTEM: 'agrifarm_unit_system',
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading key ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving key ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  // User Profile
  getUser(): UserProfile {
    return getItem<UserProfile>(KEYS.USER, initialUser);
  },
  saveUser(user: UserProfile): void {
    setItem(KEYS.USER, user);
  },

  // Farm Info
  getFarm(): Farm {
    return getItem<Farm>(KEYS.FARM, initialFarm);
  },
  saveFarm(farm: Farm): void {
    setItem(KEYS.FARM, farm);
  },

  // Fields
  getFields(): Field[] {
    return getItem<Field[]>(KEYS.FIELDS, initialFields);
  },
  saveFields(fields: Field[]): void {
    setItem(KEYS.FIELDS, fields);
  },
  addField(field: Field): void {
    const fields = this.getFields();
    fields.unshift(field);
    this.saveFields(fields);
  },
  updateField(updated: Field): void {
    const fields = this.getFields().map((f) => (f.id === updated.id ? updated : f));
    this.saveFields(fields);
  },
  deleteField(id: string): void {
    const fields = this.getFields().filter((f) => f.id !== id);
    this.saveFields(fields);
  },

  // Crops
  getCrops(): Crop[] {
    return getItem<Crop[]>(KEYS.CROPS, initialCrops);
  },
  saveCrops(crops: Crop[]): void {
    setItem(KEYS.CROPS, crops);
  },
  addCrop(crop: Crop): void {
    const crops = this.getCrops();
    crops.unshift(crop);
    this.saveCrops(crops);
  },
  updateCrop(updated: Crop): void {
    const crops = this.getCrops().map((c) => (c.id === updated.id ? updated : c));
    this.saveCrops(crops);
  },
  deleteCrop(id: string): void {
    const crops = this.getCrops().filter((c) => c.id !== id);
    this.saveCrops(crops);
  },

  // Plant Scans
  getScans(): PlantScan[] {
    return getItem<PlantScan[]>(KEYS.SCANS, initialPlantScans);
  },
  saveScans(scans: PlantScan[]): void {
    setItem(KEYS.SCANS, scans);
  },
  addScan(scan: PlantScan): void {
    const scans = this.getScans();
    scans.unshift(scan);
    this.saveScans(scans);

    // Increment scan counter on crop if associated
    if (scan.cropId) {
      const crops = this.getCrops().map((c) => {
        if (c.id === scan.cropId) {
          return {
            ...c,
            scansCount: (c.scansCount || 0) + 1,
            currentHealth: scan.analysis.healthStatus,
          };
        }
        return c;
      });
      this.saveCrops(crops);
    }
  },
  deleteScan(id: string): void {
    const scans = this.getScans().filter((s) => s.id !== id);
    this.saveScans(scans);
  },

  // Farm Activities
  getActivities(): FarmActivity[] {
    return getItem<FarmActivity[]>(KEYS.ACTIVITIES, initialFarmActivities);
  },
  saveActivities(activities: FarmActivity[]): void {
    setItem(KEYS.ACTIVITIES, activities);
  },
  addActivity(activity: FarmActivity): void {
    const activities = this.getActivities();
    activities.unshift(activity);
    this.saveActivities(activities);
  },
  deleteActivity(id: string): void {
    const activities = this.getActivities().filter((a) => a.id !== id);
    this.saveActivities(activities);
  },

  // Alerts
  getAlerts(): SmartAlert[] {
    return getItem<SmartAlert[]>(KEYS.ALERTS, initialSmartAlerts);
  },
  saveAlerts(alerts: SmartAlert[]): void {
    setItem(KEYS.ALERTS, alerts);
  },
  markAlertRead(id: string): void {
    const alerts = this.getAlerts().map((a) => (a.id === id ? { ...a, isRead: true } : a));
    this.saveAlerts(alerts);
  },
  addAlert(alert: SmartAlert): void {
    const alerts = this.getAlerts();
    alerts.unshift(alert);
    this.saveAlerts(alerts);
  },
  clearAlert(id: string): void {
    const alerts = this.getAlerts().filter((a) => a.id !== id);
    this.saveAlerts(alerts);
  },

  // Sensor Readings
  getSensors(): SensorReading[] {
    return getItem<SensorReading[]>(KEYS.SENSORS, initialSensorReadings);
  },
  saveSensors(sensors: SensorReading[]): void {
    setItem(KEYS.SENSORS, sensors);
  },

  // Offline Draft Queue
  getOfflineQueue(): any[] {
    return getItem<any[]>(KEYS.OFFLINE_QUEUE, []);
  },
  addToOfflineQueue(item: any): void {
    const q = this.getOfflineQueue();
    q.push({ ...item, queuedAt: new Date().toISOString() });
    setItem(KEYS.OFFLINE_QUEUE, q);
  },
  clearOfflineQueue(): void {
    setItem(KEYS.OFFLINE_QUEUE, []);
  },

  // Cloud & Supabase Config Settings
  getSupabaseConfig(): any {
    return getItem<any>(KEYS.SUPABASE_CONFIG, {
      url: '',
      anonKey: '',
      connected: false,
    });
  },
  saveSupabaseConfig(config: any): void {
    setItem(KEYS.SUPABASE_CONFIG, config);
  },

  // Export full farm data backup
  exportFullData(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      platform: 'AgriFarm Uganda',
      version: '1.0.0',
      user: this.getUser(),
      farm: this.getFarm(),
      fields: this.getFields(),
      crops: this.getCrops(),
      scans: this.getScans(),
      activities: this.getActivities(),
      alerts: this.getAlerts(),
      sensorReadings: this.getSensors(),
    };
    return JSON.stringify(data, null, 2);
  },

  // Reset demo data
  resetToSampleData(): void {
    this.saveUser(initialUser);
    this.saveFarm(initialFarm);
    this.saveFields(initialFields);
    this.saveCrops(initialCrops);
    this.saveScans(initialPlantScans);
    this.saveActivities(initialFarmActivities);
    this.saveAlerts(initialSmartAlerts);
    this.saveSensors(initialSensorReadings);
    this.clearOfflineQueue();
  },

  // Wipe data
  wipeAllData(): void {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
