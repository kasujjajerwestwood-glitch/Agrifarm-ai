import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { UserProfile, Farm, Crop, PlantScan, FarmActivity, SmartAlert } from '../types';

interface SupabaseConfig {
  url: string;
  anonKey: string;
}

class SupabaseServiceImpl {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig = {
    url: '',
    anonKey: '',
  };

  constructor() {
    this.init();
  }

  private init() {
    // 1. Check environment variables
    const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
    const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

    // 2. Check local storage overrides (allows interactive configuration in preview)
    let savedConfig: SupabaseConfig | null = null;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agrifarm_supabase_config');
        if (stored) {
          savedConfig = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('Could not read supabase config from localStorage', e);
      }
    }

    const url = (savedConfig?.url || envUrl || '').trim();
    const anonKey = (savedConfig?.anonKey || envKey || '').trim();

    this.config = { url, anonKey };

    if (url && anonKey && url.startsWith('http')) {
      try {
        this.client = createClient(url, anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        });
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
        this.client = null;
      }
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.client && this.config.url && this.config.anonKey);
  }

  public getConfig(): SupabaseConfig {
    return { ...this.config };
  }

  public saveConfig(config: SupabaseConfig) {
    this.config = config;
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrifarm_supabase_config', JSON.stringify(config));
    }
    this.init();
  }

  public getClient(): SupabaseClient | null {
    return this.client;
  }

  public async testConnection(url: string, anonKey: string): Promise<{ success: boolean; message: string }> {
    try {
      const cleanUrl = url.trim();
      const cleanKey = anonKey.trim();
      if (!cleanUrl || !cleanKey) {
        return { success: false, message: 'URL and Anon Key cannot be empty.' };
      }
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        return { success: false, message: 'URL must start with https:// or http://' };
      }

      const tempClient = createClient(cleanUrl, cleanKey);
      const { error } = await tempClient.auth.getSession();
      if (error && !error.message?.includes('session')) {
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Connection to Supabase project confirmed!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Could not reach Supabase endpoint.' };
    }
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  public async signUp(email: string, password: string, fullName: string) {
    if (!this.client) throw new Error('Supabase is not configured.');

    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  }

  public async signIn(email: string, password: string) {
    if (!this.client) throw new Error('Supabase is not configured.');

    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  public async signOut() {
    if (!this.client) return;
    await this.client.auth.signOut();
  }

  public async resetPassword(email: string) {
    if (!this.client) throw new Error('Supabase is not configured.');
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    if (error) throw error;
  }

  public async getCurrentUser(): Promise<User | null> {
    if (!this.client) return null;
    const { data } = await this.client.auth.getUser();
    return data.user;
  }

  public async getSession(): Promise<Session | null> {
    if (!this.client) return null;
    const { data } = await this.client.auth.getSession();
    return data.session;
  }

  public onAuthStateChange(callback: (user: User | null) => void) {
    if (!this.client) return () => {};

    const { data } = this.client.auth.onAuthStateChange((_event, session) => {
      callback(session?.user || null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }

  // ==========================================
  // STORAGE (Images upload)
  // ==========================================

  public async uploadImage(
    bucket: 'plant-images' | 'profile-images' | 'farm-images',
    fileName: string,
    fileOrBase64: File | string
  ): Promise<string> {
    if (!this.client) throw new Error('Supabase is not configured.');

    let blob: Blob;
    let contentType = 'image/jpeg';

    if (typeof fileOrBase64 === 'string') {
      const parts = fileOrBase64.split(';base64,');
      contentType = parts[0]?.replace('data:', '') || 'image/jpeg';
      const byteCharacters = atob(parts[1] || fileOrBase64);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      blob = new Blob(byteArrays, { type: contentType });
    } else {
      blob = fileOrBase64;
      contentType = fileOrBase64.type || 'image/jpeg';
    }

    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '') || 'photo.jpg';
    let userPrefix = 'public';
    try {
      const { data } = await this.client.auth.getUser();
      if (data?.user?.id) {
        userPrefix = data.user.id;
      }
    } catch {
      // ignore
    }
    const path = `${userPrefix}/${Date.now()}_${sanitizedName}`;

    const { error } = await this.client.storage.from(bucket).upload(path, blob, {
      contentType,
      upsert: true,
    });

    if (error) {
      console.warn('Storage upload warning:', error);
      // If bucket doesn't exist or RLS issues, return the original dataUrl if string
      if (typeof fileOrBase64 === 'string') return fileOrBase64;
      throw error;
    }

    const { data: publicData } = this.client.storage.from(bucket).getPublicUrl(path);
    return publicData.publicUrl;
  }

  // ==========================================
  // DATABASE: PROFILES
  // ==========================================

  public async getProfile(userId: string): Promise<UserProfile | null> {
    if (!this.client) return null;

    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phoneNumber: data.phone_number,
      country: data.country || 'Uganda',
      district: data.district || 'Wakiso',
      preferredLanguage: data.preferred_language || 'en',
      farmerType: data.farmer_type || 'Smallholder Farmer',
      farmName: data.town_village || '',
      avatarUrl: data.avatar_url,
      role: data.role || 'farmer',
      createdAt: data.created_at,
    };
  }

  public async saveProfile(profile: UserProfile): Promise<void> {
    if (!this.client) return;

    await this.client.from('profiles').upsert({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone_number: profile.phoneNumber,
      country: profile.country,
      district: profile.district,
      town_village: profile.farmName,
      farmer_type: profile.farmerType,
      preferred_language: profile.preferredLanguage,
      avatar_url: profile.avatarUrl,
      role: profile.role,
      updated_at: new Date().toISOString(),
    });
  }

  // ==========================================
  // DATABASE: FARMS
  // ==========================================

  public async getFarms(userId: string): Promise<Farm[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('farms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((f) => ({
      id: f.id,
      userId: f.user_id,
      name: f.name,
      location: f.location || '',
      district: f.district,
      sizeHectares: Number(f.size_hectares) || 2.0,
      farmType: (f.main_crops as any) || 'Mixed farming',
      description: f.description || '',
      coordinates: {
        lat: Number(f.latitude) || 0.4124,
        lon: Number(f.longitude) || 32.5186,
      },
      createdAt: f.created_at,
    }));
  }

  public async saveFarm(farm: Farm, userId: string): Promise<void> {
    if (!this.client) return;

    await this.client.from('farms').upsert({
      id: farm.id.startsWith('farm_') ? undefined : farm.id,
      user_id: userId,
      name: farm.name,
      location: farm.location,
      district: farm.district,
      size_hectares: farm.sizeHectares,
      main_crops: farm.farmType,
      description: farm.description,
      latitude: farm.coordinates.lat,
      longitude: farm.coordinates.lon,
      updated_at: new Date().toISOString(),
    });
  }

  // ==========================================
  // DATABASE: CROPS
  // ==========================================

  public async getCrops(userId: string): Promise<Crop[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('crops')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((c) => ({
      id: c.id,
      farmId: c.farm_id || 'farm_01',
      fieldId: c.farm_id || 'fld_01',
      fieldName: c.field_name || 'Main Plot',
      name: c.name,
      variety: c.variety || 'Improved Variety',
      plantingDate: c.planting_date,
      expectedHarvestDate: c.expected_harvest_date || c.planting_date,
      growthStage: c.growth_stage || 'Vegetative Growth',
      currentHealth: c.current_health || 'Healthy',
      notes: c.notes || '',
      photoUrl: c.photo_url,
      scansCount: c.scans_count || 0,
    }));
  }

  public async saveCrop(crop: Crop, userId: string): Promise<void> {
    if (!this.client) return;

    await this.client.from('crops').upsert({
      id: crop.id.startsWith('crp_') ? undefined : crop.id,
      user_id: userId,
      farm_id: crop.farmId.startsWith('farm_') ? undefined : crop.farmId,
      field_name: crop.fieldName,
      name: crop.name,
      variety: crop.variety,
      planting_date: crop.plantingDate,
      expected_harvest_date: crop.expectedHarvestDate,
      growth_stage: crop.growthStage,
      current_health: crop.currentHealth,
      notes: crop.notes,
      photo_url: crop.photoUrl,
      scans_count: crop.scansCount,
      updated_at: new Date().toISOString(),
    });
  }

  public async deleteCrop(cropId: string): Promise<void> {
    if (!this.client) return;
    await this.client.from('crops').delete().eq('id', cropId);
  }

  // ==========================================
  // DATABASE: PLANT SCANS
  // ==========================================

  public async getPlantScans(userId: string): Promise<PlantScan[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('plant_scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((s) => ({
      id: s.id,
      farmId: s.farm_id || 'farm_01',
      fieldId: s.field_id,
      fieldName: s.field_name,
      cropId: s.crop_id || 'crp_01',
      cropName: s.crop_name || 'Crop',
      date: s.created_at,
      images: [
        {
          url: s.image_url,
          label: 'Foliar View',
        },
      ],
      location: s.location || '',
      symptomsReported: s.symptoms_observed || '',
      analysis: s.analysis,
      farmerNotes: s.farmer_notes || '',
      resolved: Boolean(s.resolved),
    }));
  }

  public async savePlantScan(scan: PlantScan, userId: string): Promise<void> {
    if (!this.client) return;

    const mainImageUrl = scan.images[0]?.url || '';

    await this.client.from('plant_scans').insert({
      id: scan.id.startsWith('scn_') ? undefined : scan.id,
      user_id: userId,
      crop_id: scan.cropId ? (scan.cropId.startsWith('crp_') ? undefined : scan.cropId) : undefined,
      crop_name: scan.cropName,
      growth_stage: 'Vegetative Growth',
      symptoms_observed: scan.symptomsReported || scan.farmerNotes || '',
      image_url: mainImageUrl,
      analysis: scan.analysis,
      location: scan.location,
      farmer_notes: scan.farmerNotes,
      resolved: scan.resolved,
      created_at: scan.date || new Date().toISOString(),
    });
  }

  public async deletePlantScan(scanId: string): Promise<void> {
    if (!this.client) return;
    await this.client.from('plant_scans').delete().eq('id', scanId);
  }

  // ==========================================
  // DATABASE: FARM ACTIVITIES
  // ==========================================

  public async getFarmActivities(userId: string): Promise<FarmActivity[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('farm_activities')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error || !data) return [];

    return data.map((a) => ({
      id: a.id,
      farmId: a.farm_id || 'farm_01',
      cropId: a.crop_id,
      fieldName: a.field_name || 'Field Plot',
      title: a.title,
      activityType: a.activity_type,
      date: a.date,
      quantityOrCost: a.cost ? String(a.cost) : undefined,
      notes: a.notes || '',
    }));
  }

  public async saveFarmActivity(activity: FarmActivity, userId: string): Promise<void> {
    if (!this.client) return;

    await this.client.from('farm_activities').insert({
      id: activity.id.startsWith('act_') ? undefined : activity.id,
      user_id: userId,
      farm_id: activity.farmId.startsWith('farm_') ? undefined : activity.farmId,
      crop_id: activity.cropId ? (activity.cropId.startsWith('crp_') ? undefined : activity.cropId) : undefined,
      title: activity.title,
      activity_type: activity.activityType,
      date: activity.date,
      cost: activity.quantityOrCost,
      notes: activity.notes,
      created_at: new Date().toISOString(),
    });
  }

  // ==========================================
  // DATABASE: NOTIFICATIONS
  // ==========================================

  public async getNotifications(userId: string): Promise<SmartAlert[]> {
    if (!this.client) return [];

    const { data, error } = await this.client
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map((n) => ({
      id: n.id,
      farmId: 'farm_01',
      type: n.type,
      category: n.category,
      title: n.title,
      message: n.message,
      date: n.created_at,
      isRead: n.is_read,
      relatedCropId: n.related_crop_id,
    }));
  }

  public async saveNotification(alert: SmartAlert, userId: string): Promise<void> {
    if (!this.client) return;

    await this.client.from('notifications').insert({
      id: alert.id.startsWith('alt_') ? undefined : alert.id,
      user_id: userId,
      title: alert.title,
      message: alert.message,
      type: alert.type,
      category: alert.category,
      is_read: alert.isRead,
      related_crop_id: alert.relatedCropId?.startsWith('crp_') ? undefined : alert.relatedCropId,
      created_at: alert.date || new Date().toISOString(),
    });
  }
}

export const SupabaseService = new SupabaseServiceImpl();
