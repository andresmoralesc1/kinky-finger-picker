import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme, ThemeName, THEMES, isThemeUnlocked } from '../utils/themes';
import { UserProgress } from '../types';
import { soundManager } from '../utils/sounds';
import GlowEffect from '../components/GlowEffect';

const { width } = Dimensions.get('window');

interface Props {
  currentTheme: ThemeName;
  userProgress: UserProgress;
  onSelectTheme: (theme: ThemeName) => void;
  onBack: () => void;
}

export default function ThemesScreen({
  currentTheme,
  userProgress,
  onSelectTheme,
  onBack,
}: Props) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>(currentTheme);

  const handleSelectTheme = (themeName: ThemeName) => {
    const theme = THEMES[themeName];
    const unlocked = isThemeUnlocked(theme, userProgress);

    if (!unlocked) {
      soundManager.playSound('error');
      return;
    }

    soundManager.playSound('select');
    setSelectedTheme(themeName);
    onSelectTheme(themeName);
  };

  const renderThemeCard = (theme: Theme) => {
    const unlocked = isThemeUnlocked(theme, userProgress);
    const isSelected = selectedTheme === theme.id;

    return (
      <TouchableOpacity
        key={theme.id}
        onPress={() => handleSelectTheme(theme.id)}
        activeOpacity={0.8}
        disabled={!unlocked}
      >
        <View
          style={[
            styles.themeCard,
            isSelected && styles.selectedCard,
            !unlocked && styles.lockedCard,
          ]}
        >
          {isSelected && (
            <GlowEffect color={theme.colors.primary}>
              <View style={styles.cardContent} />
            </GlowEffect>
          )}

          <LinearGradient
            colors={[theme.colors.gradients.primary[0], theme.colors.gradients.primary[1]]}
            style={styles.themePreview}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.themeEmoji}>{theme.emoji}</Text>
          </LinearGradient>

          <View style={styles.themeInfo}>
            <Text style={[styles.themeName, !unlocked && styles.lockedText]}>
              {theme.name}
            </Text>

            {unlocked ? (
              <View style={styles.colorPalette}>
                {theme.colors.playerColors.slice(0, 4).map((color, index) => (
                  <View
                    key={index}
                    style={[styles.colorDot, { backgroundColor: color }]}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.lockInfo}>
                <Text style={styles.lockIcon}>🔒</Text>
                <Text style={styles.lockText}>
                  {getUnlockText(theme.unlockRequirement)}
                </Text>
              </View>
            )}
          </View>

          {isSelected && (
            <View style={styles.selectedBadge}>
              <Text style={styles.selectedText}>✓ Active</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getUnlockText = (requirement: Theme['unlockRequirement']): string => {
    switch (requirement.type) {
      case 'level':
        return `Reach Level ${requirement.value}`;
      case 'achievement':
        return `Unlock achievement`;
      case 'rounds':
        return `Play ${requirement.value} rounds`;
      default:
        return 'Locked';
    }
  };

  const unlockedCount = Object.values(THEMES).filter(theme =>
    isThemeUnlocked(theme, userProgress)
  ).length;
  const totalCount = Object.keys(THEMES).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8338EC', '#3A86FF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🎨 Visual Themes</Text>
        <Text style={styles.headerSubtitle}>
          {unlockedCount}/{totalCount} Unlocked
        </Text>
      </LinearGradient>

      {/* Themes Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.themesGrid}>
          {Object.values(THEMES).map(theme => renderThemeCard(theme))}
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About Themes</Text>
          <Text style={styles.infoText}>
            • Themes change the entire visual style of the app
          </Text>
          <Text style={styles.infoText}>
            • Unlock themes by leveling up and earning achievements
          </Text>
          <Text style={styles.infoText}>
            • Each theme has unique colors and gradients
          </Text>
          <Text style={styles.infoText}>
            • Your selected theme is saved automatically
          </Text>
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
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF99',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  themeCard: {
    width: (width - 60) / 2,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#333',
  },
  selectedCard: {
    borderColor: '#8338EC',
    backgroundColor: '#2A2A3A',
  },
  lockedCard: {
    opacity: 0.6,
  },
  cardContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  themePreview: {
    width: '100%',
    height: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  themeEmoji: {
    fontSize: 48,
  },
  themeInfo: {
    alignItems: 'center',
  },
  themeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  lockedText: {
    color: '#888',
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  lockInfo: {
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  lockText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#06FFA5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  },
  infoSection: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 6,
    lineHeight: 20,
  },
});
