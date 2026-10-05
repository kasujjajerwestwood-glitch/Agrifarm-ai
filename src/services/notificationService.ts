// Notification Service for Web Push, Audio Chimes, and In-App Alerts

class NotificationServiceImpl {
  private soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('agrifarm_sound_enabled');
      this.soundEnabled = savedSound !== null ? savedSound === 'true' : true;
    }
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return 'denied';
    }
  }

  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrifarm_sound_enabled', String(enabled));
    }
  }

  // Play pleasant, synthetic Web Audio chime without external MP3 dependencies
  playAlertChime(severity: 'warning' | 'info' | 'success' = 'info'): void {
    if (!this.soundEnabled || typeof window === 'undefined') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (severity === 'warning') {
        // High urgency two-tone alert
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(880, now + 0.2); // A5

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (severity === 'success') {
        // Upward harmonious chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else {
        // Soft informative ping
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.12); // A5

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (err) {
      // Audio autoplay policy might restrict if no prior interaction
      console.debug('Web audio chime prevented by browser:', err);
    }
  }

  // Trigger tactile vibration on mobile devices
  triggerHaptic(pattern: number[] = [100, 50, 100]): void {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Vibration not allowed or supported
      }
    }
  }

  // Send Browser Push / System Notification
  sendNotification(
    title: string,
    options?: {
      body?: string;
      icon?: string;
      tag?: string;
      severity?: 'warning' | 'info' | 'success';
    }
  ): boolean {
    const severity = options?.severity || 'info';

    // Play chime and haptic feedback
    this.playAlertChime(severity);
    if (severity === 'warning') {
      this.triggerHaptic([200, 100, 200]);
    } else {
      this.triggerHaptic([80]);
    }

    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        body: options?.body || 'AgriFarm Uganda Advisory update',
        icon: options?.icon || 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/sprout.svg',
        tag: options?.tag || 'agrifarm-uganda-alert',
      });
      return true;
    } catch (err) {
      console.warn('Could not display system notification:', err);
      return false;
    }
  }
}

export const NotificationService = new NotificationServiceImpl();
