import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Settings, QuestionCategory } from '../types';

interface Props {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  onBack: () => void;
  onResetStats: () => void;
}

export default function SettingsScreen({ settings, onUpdateSettings, onBack, onResetStats }: Props) {
  const toggleSetting = (key: keyof Settings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const toggleCategory = (category: QuestionCategory) => {
    const categories = settings.categories.includes(category)
      ? settings.categories.filter(c => c !== category)
      : [...settings.categories, category];

    // Ensure at least one category is selected
    if (categories.length === 0) return;

    onUpdateSettings({
      ...settings,
      categories,
    });
  };

  const updateSkipLimit = (delta: number) => {
    const newLimit = Math.max(0, Math.min(10, settings.skipLimit + delta));
    onUpdateSettings({
      ...settings,
      skipLimit: newLimit,
    });
  };

  const updateTimerDuration = (delta: number) => {
    const newDuration = Math.max(15, Math.min(300, settings.timerDuration + delta));
    onUpdateSettings({
      ...settings,
      timerDuration: newDuration,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={() => toggleSetting('soundEnabled')}
              trackColor={{ false: '#333', true: '#FF006E' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Background Music</Text>
            <Switch
              value={settings.musicEnabled}
              onValueChange={() => toggleSetting('musicEnabled')}
              trackColor={{ false: '#333', true: '#FF006E' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Haptic Feedback</Text>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={() => toggleSetting('hapticEnabled')}
              trackColor={{ false: '#333', true: '#FF006E' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Game Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gameplay</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Avoid Repetition</Text>
            <Switch
              value={settings.avoidRepetition}
              onValueChange={() => toggleSetting('avoidRepetition')}
              trackColor={{ false: '#333', true: '#FF006E' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Skip Limit</Text>
              <Text style={styles.settingSubtext}>Per player</Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => updateSkipLimit(-1)}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{settings.skipLimit}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => updateSkipLimit(1)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Timer Duration</Text>
              <Text style={styles.settingSubtext}>Seconds</Text>
            </View>
            <View style={styles.counter}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => updateTimerDuration(-15)}
              >
                <Text style={styles.counterButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{settings.timerDuration}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => updateTimerDuration(15)}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Question Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Question Categories</Text>
          <Text style={styles.sectionSubtext}>Select which categories to include</Text>

          {(['classic', 'romantic', 'party', 'nsfw'] as QuestionCategory[]).map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                settings.categories.includes(category) && styles.categoryButtonActive,
              ]}
              onPress={() => toggleCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  settings.categories.includes(category) && styles.categoryButtonTextActive,
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
              {settings.categories.includes(category) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Other */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleSetting('showTutorial')}
          >
            <Text style={styles.actionButtonText}>Show Tutorial Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {/* Navigate to custom questions - will be handled by parent */}}
          >
            <Text style={styles.actionButtonText}>Manage Custom Questions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={onResetStats}
          >
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              Reset Statistics
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  sectionSubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
  },
  settingSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  counterButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#FF006E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    borderColor: '#FF006E',
    backgroundColor: 'rgba(255,0,110,0.1)',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#999',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkmark: {
    color: '#FF006E',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: 'rgba(255,0,0,0.1)',
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  dangerButtonText: {
    color: '#ff0000',
  },
});
