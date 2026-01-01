import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Achievement, UserProgress } from '../types';
import { getRarityColor, getRarityGlow, getXpForNextLevel } from '../utils/achievements';
import { soundManager } from '../utils/sounds';
import GlowEffect from '../components/GlowEffect';

const { width } = Dimensions.get('window');

interface Props {
  userProgress: UserProgress;
  onBack: () => void;
}

export default function AchievementsScreen({ userProgress, onBack }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', emoji: '🏆' },
    { id: 'milestone', name: 'Milestone', emoji: '🎯' },
    { id: 'specialty', name: 'Specialty', emoji: '⭐' },
    { id: 'collection', name: 'Collection', emoji: '📦' },
    { id: 'challenge', name: 'Challenge', emoji: '⚔️' },
  ];

  const filteredAchievements = userProgress.achievements.filter(
    achievement => selectedCategory === 'all' || achievement.category === selectedCategory
  );

  const unlockedCount = userProgress.achievements.filter(a => a.unlocked).length;
  const totalCount = userProgress.achievements.length;
  const nextLevelXp = getXpForNextLevel(userProgress.level);
  const currentLevelXp = userProgress.level > 1 ? getXpForNextLevel(userProgress.level - 1) : 0;
  const xpProgress = ((userProgress.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8338EC', '#3A86FF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Achievements</Text>

        <View style={styles.headerStats}>
          <Text style={styles.headerStatsText}>
            {unlockedCount}/{totalCount}
          </Text>
        </View>
      </LinearGradient>

      {/* Level & XP Section */}
      <View style={styles.levelSection}>
        <View style={styles.levelInfo}>
          <Text style={styles.levelLabel}>Level {userProgress.level}</Text>
          <Text style={styles.xpText}>
            {userProgress.xp} / {nextLevelXp} XP
          </Text>
        </View>

        {/* XP Progress Bar */}
        <View style={styles.xpBarContainer}>
          <View style={[styles.xpBarFill, { width: `${Math.min(xpProgress, 100)}%` }]} />
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilters}
        contentContainerStyle={styles.categoryFiltersContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => {
              setSelectedCategory(category.id);
              soundManager.playSound('tap');
            }}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Achievements Grid */}
      <ScrollView style={styles.achievementsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.achievementsGrid}>
          {filteredAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </View>

        {filteredAchievements.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No achievements in this category yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

interface AchievementCardProps {
  achievement: Achievement;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const rarityColor = getRarityColor(achievement.rarity);
  const progressPercent = Math.min((achievement.progress / achievement.requirement) * 100, 100);

  return (
    <View
      style={[
        styles.achievementCard,
        !achievement.unlocked && styles.achievementCardLocked,
        achievement.unlocked && { borderColor: rarityColor },
      ]}
    >
      {achievement.unlocked && (
        <View style={[styles.rarityGlow, { backgroundColor: getRarityGlow(achievement.rarity) }]} />
      )}

      {/* Icon */}
      <View style={styles.achievementIcon}>
        <Text
          style={[
            styles.achievementEmoji,
            !achievement.unlocked && styles.achievementEmojiLocked,
          ]}
        >
          {achievement.icon}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.achievementInfo}>
        <Text
          style={[
            styles.achievementTitle,
            !achievement.unlocked && styles.achievementTitleLocked,
            achievement.unlocked && { color: rarityColor },
          ]}
        >
          {achievement.title}
        </Text>
        <Text
          style={[
            styles.achievementDescription,
            !achievement.unlocked && styles.achievementDescriptionLocked,
          ]}
        >
          {achievement.description}
        </Text>

        {/* Progress Bar */}
        {!achievement.unlocked && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {achievement.progress}/{achievement.requirement}
            </Text>
          </View>
        )}

        {/* Unlocked Badge */}
        {achievement.unlocked && (
          <View style={styles.unlockedBadge}>
            <Text style={styles.unlockedText}>+{achievement.xpReward} XP</Text>
            <Text style={[styles.rarityText, { color: rarityColor }]}>
              {achievement.rarity.toUpperCase()}
            </Text>
          </View>
        )}
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerStats: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  headerStatsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  levelSection: {
    padding: 20,
    backgroundColor: '#111',
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  xpText: {
    fontSize: 14,
    color: '#aaa',
  },
  xpBarContainer: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#06FFA5',
    borderRadius: 4,
  },
  categoryFilters: {
    maxHeight: 70,
    backgroundColor: '#0a0a0a',
  },
  categoryFiltersContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#8338EC',
    borderColor: '#8338EC',
  },
  categoryEmoji: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  achievementsContainer: {
    flex: 1,
  },
  achievementsGrid: {
    padding: 20,
    gap: 15,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#333',
    marginBottom: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  achievementCardLocked: {
    opacity: 0.6,
  },
  rarityGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  achievementIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementEmoji: {
    fontSize: 36,
  },
  achievementEmojiLocked: {
    opacity: 0.3,
  },
  achievementInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#888',
  },
  achievementDescription: {
    fontSize: 13,
    color: '#bbb',
    marginBottom: 8,
  },
  achievementDescriptionLocked: {
    color: '#666',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#06FFA5',
  },
  progressText: {
    fontSize: 11,
    color: '#888',
    textAlign: 'right',
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  unlockedText: {
    fontSize: 12,
    color: '#06FFA5',
    fontWeight: '600',
  },
  rarityText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});
