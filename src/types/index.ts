export type Language = 'en' | 'lg' | 'sw';
export type ThemeMode = 'light' | 'dark' | 'system';

export type FarmerType =
  | 'Smallholder Farmer'
  | 'Commercial Farmer'
  | 'Greenhouse Operator'
  | 'Agricultural Student'
  | 'Agronomist / Extension Officer'
  | 'Smart Farm Manager';

export type FarmType =
  | 'Crop farming'
  | 'Livestock'
  | 'Poultry'
  | 'Fish farming'
  | 'Mixed farming'
  | 'Greenhouse farming'
  | 'Smart farming';

export type SoilType =
  | 'Loam'
  | 'Clay'
  | 'Sandy Loam'
  | 'Silt Loam'
  | 'Black Cotton'
  | 'Peat / Organic';

export type IrrigationMethod =
  | 'Drip Irrigation'
  | 'Sprinkler'
  | 'Furrow / Flood'
  | 'Rainfed'
  | 'Solar Smart Drip'
  | 'Manual Hose / Watering Can';

export type GrowthStage =
  | 'Germination / Seedling'
  | 'Vegetative Growth'
  | 'Flowering / Budding'
  | 'Fruit / Grain Filling'
  | 'Maturity / Ready to Harvest';

export type CropHealthStatus =
  | 'Healthy'
  | 'Attention Needed'
  | 'Disease Detected'
  | 'Pest Infestation'
  | 'Nutrient Deficiency'
  | 'Environmental Stress';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  country: string;
  district: string;
  preferredLanguage: Language;
  farmName: string;
  farmerType: FarmerType;
  role: 'farmer' | 'admin';
  createdAt: string;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  location: string;
  district: string;
  sizeHectares: number;
  farmType: FarmType;
  description: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  createdAt: string;
}

export interface Field {
  id: string;
  farmId: string;
  name: string;
  sizeHectares: number;
  currentCropId?: string;
  cropName: string;
  plantingDate: string;
  expectedHarvest: string;
  soilType: SoilType;
  irrigationMethod: IrrigationMethod;
  notes: string;
  status: 'active' | 'fallow' | 'preparing';
}

export interface Crop {
  id: string;
  farmId: string;
  fieldId: string;
  fieldName: string;
  name: string;
  variety: string;
  plantingDate: string;
  growthStage: GrowthStage;
  expectedHarvestDate: string;
  currentHealth: CropHealthStatus;
  notes: string;
  photoUrl?: string;
  scansCount: number;
}

export interface KnowledgeCitation {
  organization: string; // e.g. "FAO", "CABI Plantwise", "NARO Uganda", "CGIAR / IITA", "USDA"
  title: string;
  url?: string;
  snippet?: string;
  year?: string;
}

export interface PlantScanAnalysis {
  crop: string;
  cropScientificName?: string;
  healthStatus: CropHealthStatus;
  possibleIssue: string;
  confidence: number;
  severity: SeverityLevel;
  observedSymptoms: string[];
  possibleCauses: string[];
  otherPossibilities: string[];
  recommendedNextSteps: string[];
  nextSteps?: string[];
  prevention: string[];
  preventionAdvice?: string[];
  whenToSeekHelp?: string;
  organicManagement?: string[];
  chemicalManagement?: string[];
  additionalInfoNeeded?: string;
  imageQualityFeedback?: string;
  sources?: (KnowledgeCitation | string)[];
  disclaimer: string;
}

export interface PlantScan {
  id: string;
  farmId: string;
  userId?: string;
  fieldId?: string;
  fieldName?: string;
  cropId?: string;
  cropName: string;
  cropVariety?: string;
  date: string;
  createdAt?: string;
  imageUrl?: string;
  secondaryImages?: string[];
  images: Array<{
    url: string;
    label: string; // e.g. "Whole plant", "Affected leaf", "Close-up", "Underside", "Pest"
  }>;
  location: string;
  symptomsReported: string;
  analysis: PlantScanAnalysis;
  farmerNotes: string;
  resolved: boolean;
  status?: string;
}

export type ActivityType =
  | 'Planting'
  | 'Irrigation'
  | 'Fertilizing'
  | 'Weeding'
  | 'Pest observation'
  | 'Disease observation'
  | 'Harvest'
  | 'Soil preparation'
  | 'Spraying'
  | 'Other';

export interface FarmActivity {
  id: string;
  farmId: string;
  fieldId?: string;
  fieldName?: string;
  cropId?: string;
  cropName?: string;
  date: string;
  activityType: ActivityType;
  type?: string;
  title: string;
  notes: string;
  cost?: number;
  quantityOrCost?: string;
  photoUrl?: string;
}

export type AlertType = 'Information' | 'Warning' | 'Attention';

export interface SmartAlert {
  id: string;
  farmId: string;
  type: AlertType;
  category: 'disease' | 'pest' | 'soil' | 'weather' | 'sensor' | 'task';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  relatedCropId?: string;
  actionUrl?: string;
}

export interface SensorReading {
  id: string;
  sensorId: string;
  deviceName: string;
  type: 'soil_moisture' | 'temperature' | 'humidity' | 'rainfall' | 'tank_level' | 'light_level' | 'ph';
  label: string;
  value: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
  minOptimal: number;
  maxOptimal: number;
  timestamp: string;
  isDemo: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachedImage?: {
    preview: string;
    base64: string;
    mimeType: string;
  };
}

export interface WeatherData {
  source: string;
  district: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    rainProb: number;
    rainSum: number;
  }>;
  agriculturalAlerts: string[];
  soilMoistureEst: number;
}

// Agricultural Knowledge System Types
export type KnowledgeType = 'disease' | 'pest' | 'nutrient_deficiency';
export type VerificationStatus = 'Verified' | 'Pending review' | 'Needs update' | 'Archived';

export interface KnowledgeItem {
  id: string;
  type: KnowledgeType;
  name: string;
  scientificName?: string;
  cropsAffected: string[];
  symptoms: string[];
  causesOrBiology: string;
  transmissionOrLifeCycle?: string;
  favorableConditions: string;
  prevention: string[];
  management: string[];
  organicControls?: string[];
  chemicalControls?: string[];
  sources: KnowledgeCitation[];
  geographicRelevance: string; // e.g. "East Africa / Uganda", "Tropical & Subtropical", "Global"
  verificationStatus: VerificationStatus;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type CropCategory =
  | 'Cereals & Grains'
  | 'Legumes & Pulses'
  | 'Roots & Tubers'
  | 'Cash & Plantation'
  | 'Vegetables & Horticultural'
  | 'Fruits & Orchards';

export interface CompendiumCrop {
  id: string;
  name: string;
  scientificName: string;
  localNames: {
    en: string;
    lg: string;
    sw: string;
  };
  category: CropCategory;
  description: {
    en: string;
    lg: string;
    sw: string;
  };
  soilRequirements: {
    pH: string;
    soilType: string;
    drainage: string;
  };
  climateRequirements: {
    tempRange: string;
    rainfall: string;
    altitude: string;
  };
  agronomicSpecs: {
    spacing: string;
    seedRate: string;
    maturityDays: string;
    expectedYield: string;
  };
  fertilizerPlan: {
    basal: string;
    topDressing: string;
    organicCompost: string;
  };
  commonPests: string[];
  commonDiseases: string[];
  harvestingGuidelines: string;
  researchCitations: string[];
  imageUrl: string;
}

export interface CompendiumPest {
  id: string;
  name: string;
  scientificName: string;
  localNames: {
    en: string;
    lg: string;
    sw: string;
  };
  targetCrops: string[];
  identificationMarks: string;
  symptomsAndDamage: string[];
  lifeCycleSummary: string;
  economicThreshold: string;
  culturalControls: string[];
  biologicalControls: string[];
  chemicalControls: string[];
  monitoringGuidance: string;
  imageUrl: string;
  researchSources: string[];
}

export interface CompendiumDisease {
  id: string;
  name: string;
  scientificName: string;
  pathogenType: 'Fungus' | 'Bacteria' | 'Virus' | 'Oomycete' | 'Nematode' | 'Physiological';
  localNames: {
    en: string;
    lg: string;
    sw: string;
  };
  targetCrops: string[];
  symptoms: string[];
  transmissionAndVectors: string;
  triggerConditions: string;
  culturalManagement: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  resistantVarieties?: string[];
  imageUrl: string;
  researchSources: string[];
}

