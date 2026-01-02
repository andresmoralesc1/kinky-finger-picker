import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { GameStats } from '../types';

interface Props {
  stats: GameStats;
  onBack: () => void;
}

export default function StatsScreen({ stats, onBack }: Props) {
  const mostSelectedPlayer = stats.currentSession.reduce((prev, current) =>
    prev.timesSelected > current.timesSelected ? prev : current
  , stats.currentSession[0]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Statistics</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalRounds}</Text>
              <Text style={styles.statLabel}>Total Rounds</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalPlayers}</Text>
              <Text style={styles.statLabel}>Players</Text>
            </View>
          </View>
        </View>

        {/* Level Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Intensity Levels Played</Text>
          <View style={styles.barContainer}>
            <View style={styles.barRow}>
              <Text style={styles.barLabel}>🌶️ Mild</Text>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(stats.levelDistribution.mild / Math.max(stats.totalRounds, 1)) * 100}%`,
                      backgroundColor: '#06FFA5',
                    },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>{stats.levelDistribution.mild}</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>🌶️🌶️ Spicy</Text>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(stats.levelDistribution.spicy / Math.max(stats.totalRounds, 1)) * 100}%`,
                      backgroundColor: '#FB5607',
                    },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>{stats.levelDistribution.spicy}</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>🌶️🌶️🌶️ Extreme</Text>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${(stats.levelDistribution.extreme / Math.max(stats.totalRounds, 1)) * 100}%`,
                      backgroundColor: '#FF006E',
                    },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>{stats.levelDistribution.extreme}</Text>
            </View>
          </View>
        </View>

        {/* Category Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories Played</Text>
          <View style={styles.categoryGrid}>
            {Object.entries(stats.categoryDistribution).map(([category, count]) => (
              <View key={category} style={styles.categoryCard}>
                <Text style={styles.categoryValue}>{count}</Text>
                <Text style={styles.categoryLabel}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Player Stats */}
        {stats.currentSession.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Player Rankings</Text>
            {mostSelectedPlayer && (
              <View style={styles.mvpCard}>
                <Text style={styles.mvpEmoji}>👑</Text>
                <Text style={styles.mvpTitle}>Most Selected</Text>
                <View
                  style={[styles.mvpColor, { backgroundColor: mostSelectedPlayer.color }]}
                />
                <Text style={styles.mvpCount}>
                  {mostSelectedPlayer.timesSelected} times
                </Text>
              </View>
            )}

            {stats.currentSession
              .sort((a, b) => b.timesSelected - a.timesSelected)
              .map((player, index) => (
                <View key={player.playerId} style={styles.playerRow}>
                  <Text style={styles.playerRank}>#{index + 1}</Text>
                  <View
                    style={[styles.playerColor, { backgroundColor: player.color }]}
                  />
                  <View style={styles.playerStats}>
                    <Text style={styles.playerStat}>
                      Selected: {player.timesSelected}
                    </Text>
                    <Text style={styles.playerStat}>
                      Completed: {player.daresCompleted} | Skipped: {player.daresSkipped}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}
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
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF006E',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#BBB',
  },
  barContainer: {
    gap: 15,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  barLabel: {
    width: 90,
    fontSize: 14,
    color: '#fff',
  },
  barBackground: {
    flex: 1,
    height: 25,
    backgroundColor: '#111',
    borderRadius: 12.5,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 12.5,
  },
  barValue: {
    width: 30,
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: '48%',
  },
  categoryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF006E',
    marginBottom: 5,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#BBB',
  },
  mvpCard: {
    backgroundColor: 'rgba(255,0,110,0.1)',
    borderWidth: 2,
    borderColor: '#FF006E',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  mvpEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  mvpTitle: {
    fontSize: 16,
    color: '#BBB',
    marginBottom: 10,
  },
  mvpColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
  },
  mvpCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 15,
  },
  playerRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF006E',
    width: 35,
  },
  playerColor: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  playerStats: {
    flex: 1,
  },
  playerStat: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 3,
  },
});
