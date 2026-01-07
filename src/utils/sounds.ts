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
      console.log('Audio init error:', error);
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

  // For now, we'll use simple beep sounds
  // In production, replace with actual sound files
  async playSound(soundName: keyof typeof this.sounds) {
    if (!this.soundEnabled) return;

    try {
      // Using web audio API for simple tones
      // In production app, load actual sound files from assets
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Different frequencies for different sounds
      const frequencies: { [key: string]: number } = {
        tap: 800,
        countdown: 600,
        winner: 1000,
        levelUp: 1200,
        levelDown: 400,
        skip: 300,
        complete: 1500,
      };

      oscillator.frequency.value = frequencies[soundName] || 500;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.1);
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
