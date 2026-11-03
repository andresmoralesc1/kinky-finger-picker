import { Audio } from 'expo-av';

class SoundManager {
  private sounds: { [key: string]: Audio.Sound | null } = {
    tap: null,
    countdown: null,
    winner: null,
    levelUp: null,
    levelDown: null,
    skip: null,
    complete: null,
  };

  private backgroundMusic: Audio.Sound | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;

  async init() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
    }
  }

  setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled && this.backgroundMusic) {
      this.backgroundMusic.pauseAsync();
    } else if (enabled && this.backgroundMusic) {
      this.backgroundMusic.playAsync();
    }
  }

  private sharedAudioCtx: any = null;

  private getAudioContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!this.sharedAudioCtx || this.sharedAudioCtx.state === 'closed') {
      this.sharedAudioCtx = new AudioCtx();
    }
    if (this.sharedAudioCtx.state === 'suspended') {
      this.sharedAudioCtx.resume().catch(() => {});
    }
    return this.sharedAudioCtx;
  }

  // Enhanced synthesized SFX for sensual tension, roulette sizzle, and victory chords
  async playSound(soundName: keyof typeof this.sounds | 'heartbeat' | 'shot' | 'tick' | 'roulette') {
    if (!this.soundEnabled) return;

    try {
      const context = this.getAudioContext();
      if (!context) return;

      const now = context.currentTime;

      if (soundName === 'heartbeat') {
        // Double-beat low frequency thump (Lub-dub)
        const osc1 = context.createOscillator();
        const gain1 = context.createGain();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(65, now);
        osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        gain1.gain.setValueAtTime(0.4, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc1.connect(gain1);
        gain1.connect(context.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);

        // Secondary beat
        const osc2 = context.createOscillator();
        const gain2 = context.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(55, now + 0.15);
        osc2.frequency.exponentialRampToValueAtTime(30, now + 0.28);
        gain2.gain.setValueAtTime(0.3, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
        osc2.connect(gain2);
        gain2.connect(context.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.28);
        return;
      }

      if (soundName === 'shot') {
        // Dramatic low buzz + descending slide for punishment
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(context.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        return;
      }

      if (soundName === 'winner') {
        // Harmonious victory chord (Major triad with shimmer)
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        freqs.forEach((freq, idx) => {
          const osc = context.createOscillator();
          const gain = context.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.2, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + idx * 0.05);
          osc.connect(gain);
          gain.connect(context.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + 0.55 + idx * 0.05);
        });
        return;
      }

      // Default frequencies
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      const frequencies: { [key: string]: number } = {
        tap: 880,
        countdown: 520,
        levelUp: 1100,
        levelDown: 440,
        skip: 320,
        complete: 1200,
        tick: 700,
        roulette: 960,
      };

      const duration = soundName === 'complete' ? 0.25 : soundName === 'countdown' ? 0.15 : 0.08;
      oscillator.frequency.value = frequencies[soundName] || 500;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.25, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      // Silently fail - not critical
    }
  }

  async playBackgroundMusic() {
    // Placeholder for background music
    // In production, load from assets
  }

  async stopBackgroundMusic() {
    if (this.backgroundMusic) {
      await this.backgroundMusic.stopAsync();
      await this.backgroundMusic.unloadAsync();
      this.backgroundMusic = null;
    }
  }

  async cleanup() {
    await this.stopBackgroundMusic();
    for (const key in this.sounds) {
      if (this.sounds[key]) {
        await this.sounds[key]!.unloadAsync();
        this.sounds[key] = null;
      }
    }
  }
}

export const soundManager = new SoundManager();
