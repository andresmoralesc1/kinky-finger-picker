import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { Settings, QuestionCategory } from '../types';

interface Props {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
  onBack: () => void;
  onResetStats: () => void;
  onOpenCustomQuestions?: () => void;
}

export default function SettingsScreen({ settings, onUpdateSettings, onBack, onResetStats, onOpenCustomQuestions }: Props) {
  const toggleSetting = (key: keyof Settings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  const handleResetStats = () => {
    Alert.alert(
      'Restablecer Estadísticas',
      '¿Estás seguro de que deseas restablecer todas las estadísticas? Se borrarán los datos de sesión, pero se mantendrán tus logros y XP. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: onResetStats
        }
      ]
    );
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
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Ajustes</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Efectos de Sonido</Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={() => toggleSetting('soundEnabled')}
              trackColor={{ false: '#333', true: '#E50914' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Música de Fondo</Text>
            <Switch
              value={settings.musicEnabled}
              onValueChange={() => toggleSetting('musicEnabled')}
              trackColor={{ false: '#333', true: '#E50914' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Vibración Háptica</Text>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={() => toggleSetting('hapticEnabled')}
              trackColor={{ false: '#333', true: '#E50914' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Game Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Jugabilidad</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Evitar Repetición</Text>
            <Switch
              value={settings.avoidRepetition}
              onValueChange={() => toggleSetting('avoidRepetition')}
              trackColor={{ false: '#333', true: '#E50914' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Límite de Saltos</Text>
              <Text style={styles.settingSubtext}>Por jugador</Text>
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
              <Text style={styles.settingLabel}>Temporizador</Text>
              <Text style={styles.settingSubtext}>Segundos</Text>
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
          <Text style={styles.sectionTitle}>Categorías de Preguntas</Text>
          <Text style={styles.sectionSubtext}>Selecciona qué categorías incluir en el juego</Text>

          {([
            { id: 'classic' as QuestionCategory, name: 'Clásico', desc: 'Verdades y retos tradicionales' },
            { id: 'romantic' as QuestionCategory, name: 'Romántico', desc: 'Momentos íntimos y sensuales' },
            { id: 'party' as QuestionCategory, name: 'Fiesta', desc: 'Dinámicas grupales divertidas' },
            { id: 'nsfw' as QuestionCategory, name: 'Picante (+18)', desc: 'Solo adultos y retos atrevidos' },
          ]).map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                settings.categories.includes(category.id) && styles.categoryButtonActive,
              ]}
              onPress={() => toggleCategory(category.id)}
            >
              <View style={styles.categoryContent}>
                <Text
                  style={[
                    styles.categoryButtonText,
                    settings.categories.includes(category.id) && styles.categoryButtonTextActive,
                  ]}
                >
                  {category.name}
                </Text>
                <Text
                  style={[
                    styles.categoryDescription,
                    settings.categories.includes(category.id) && styles.categoryDescriptionActive,
                  ]}
                >
                  {category.desc}
                </Text>
              </View>
              {settings.categories.includes(category.id) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Other */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Otros</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleSetting('showTutorial')}
          >
            <Text style={styles.actionButtonText}>Ver Tutorial de Nuevo</Text>
          </TouchableOpacity>

          {onOpenCustomQuestions && (
            <TouchableOpacity
              style={[styles.actionButton, styles.customQuestionsButton]}
              onPress={onOpenCustomQuestions}
            >
              <View style={styles.actionButtonContent}>
                <Text style={styles.actionButtonEmoji}>✏️</Text>
                <View>
                  <Text style={styles.actionButtonText}>Preguntas Personalizadas</Text>
                  <Text style={styles.actionButtonSubtext}>Agrega tus propios retos y preguntas</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleResetStats}
          >
            <Text style={[styles.actionButtonText, styles.dangerButtonText]}>
              Restablecer Estadísticas
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
    color: '#BBB',
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
    color: '#BBB',
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
    backgroundColor: '#E50914',
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
    borderColor: '#E50914',
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
  },
  categoryContent: {
    flex: 1,
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#BBB',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  categoryDescriptionActive: {
    color: '#BBB',
  },
  checkmark: {
    color: '#E50914',
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
  customQuestionsButton: {
    backgroundColor: 'rgba(229, 9, 20, 0.08)',
    borderWidth: 1.5,
    borderColor: '#E50914',
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  actionButtonEmoji: {
    fontSize: 32,
  },
  actionButtonSubtext: {
    fontSize: 12,
    color: '#BBB',
    marginTop: 3,
  },
  dangerButton: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderWidth: 1,
    borderColor: '#E50914',
  },
  dangerButtonText: {
    color: '#E50914',
  },
});
