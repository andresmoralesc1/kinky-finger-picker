import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IntensityLevel, QuestionCategory, Question } from '../types';
import { zaiService } from '../utils/zaiService';
import { soundManager } from '../utils/sounds';
import { EnhancedLoadingSpinner, ProgressLoading } from '../components/EnhancedLoadingSpinner';
import AccessibleTouchable from '../components/AccessibleTouchable';

const CATEGORIES: { value: QuestionCategory; label: string; emoji: string }[] = [
  { value: 'classic', label: 'Classic', emoji: '🎲' },
  { value: 'romantic', label: 'Romantic', emoji: '💕' },
  { value: 'party', label: 'Party', emoji: '🎉' },
  { value: 'nsfw', label: 'NSFW', emoji: '🔥' },
  { value: 'custom', label: 'Custom', emoji: '✨' },
];

const LEVELS: { value: IntensityLevel; label: string; emoji: string; color: string }[] = [
  { value: 'mild', label: 'Mild', emoji: '🌶️', color: '#06FFA5' },
  { value: 'spicy', label: 'Spicy', emoji: '🌶️🌶️', color: '#FB5607' },
  { value: 'extreme', label: 'Extreme', emoji: '🌶️🌶️🌶️', color: '#FF006E' },
];

interface Props {
  onBack: () => void;
  onAddQuestions: (questions: Question[]) => void;
}

/**
 * Enhanced AI Question Generator Screen with improved UI and loading states
 *
 * Features:
 * - ProgressLoading for generation progress
 * - AccessibleTouchable for all buttons
 * - Smooth animations
 * - Better visual feedback
 */
export default function AIQuestionGeneratorScreen({ onBack, onAddQuestions }: Props) {
  const [selectedLevel, setSelectedLevel] = useState<IntensityLevel>('mild');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('classic');
  const [count, setCount] = useState(3);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const generateQuestions = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    soundManager.playSound('tap');

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 0.1, 0.9));
    }, 200);

    try {
      const questions = await zaiService.generateQuestions({
        count,
        level: selectedLevel,
        category: selectedCategory,
        customPrompt: customPrompt || undefined,
      });

      clearInterval(progressInterval);
      setGenerationProgress(1);

      const formattedQuestions: Question[] = questions.map((q, index) => ({
        id: `ai_${Date.now()}_${index}`,
        text: q.text,
        level: q.level,
        type: q.type,
        category: q.category as QuestionCategory,
        isCustom: true,
      }));

      setGeneratedQuestions(formattedQuestions);
      soundManager.playSound('countdown');
    } catch (error) {
      clearInterval(progressInterval);
      setGenerationProgress(0);
      Alert.alert('Error', 'Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 500);
    }
  };

  const addAllToGame = () => {
    if (generatedQuestions.length > 0) {
      onAddQuestions(generatedQuestions);
      soundManager.playSound('tap');
      Alert.alert('Success!', `${generatedQuestions.length} questions added to your game.`);
      setGeneratedQuestions([]);
    }
  };

  const addSingleQuestion = (question: Question) => {
    onAddQuestions([question]);
    soundManager.playSound('tap');
    setGeneratedQuestions(prev => prev.filter(q => q.id !== question.id));
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        <AccessibleTouchable
          style={styles.backButton}
          onPress={onBack}
          accessibilityLabel="Go back"
          accessibilityHint="Return to main menu"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </AccessibleTouchable>
        <Text style={styles.headerTitle}>🤖 AI Generator</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Level Selection */}
        <Text style={styles.sectionTitle}>Intensity Level</Text>
        <View style={styles.optionsRow}>
          {LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.optionButton,
                selectedLevel === level.value && { borderColor: level.color },
              ]}
              onPress={() => setSelectedLevel(level.value)}
            >
              <Text style={styles.optionEmoji}>{level.emoji}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  selectedLevel === level.value && { color: level.color },
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Selection */}
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.optionsRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                styles.optionButton,
                selectedCategory === cat.value && styles.optionButtonSelected,
              ]}
              onPress={() => setSelectedCategory(cat.value)}
            >
              <Text style={styles.optionEmoji}>{cat.emoji}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  selectedCategory === cat.value && styles.optionLabelSelected,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Count */}
        <Text style={styles.sectionTitle}>Number of Questions</Text>
        <View style={styles.countContainer}>
          {[1, 3, 5, 10].map((num) => (
            <TouchableOpacity
              key={num}
              style={[
                styles.countButton,
                count === num && styles.countButtonSelected,
              ]}
              onPress={() => setCount(num)}
            >
              <Text
                style={[
                  styles.countText,
                  count === num && styles.countTextSelected,
                ]}
              >
                {num}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Prompt */}
        <Text style={styles.sectionTitle}>Custom Instructions (Optional)</Text>
        <Text style={styles.hint}>
          Add specific requirements for your questions...
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.input}>{customPrompt || 'Enter custom prompt...'}</Text>
        </View>

        {/* Generate Button */}
        <View style={styles.generateContainer}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateQuestions}
            disabled={isGenerating}
          >
            <LinearGradient
              colors={['#FF006E', '#8338EC'] as const}
              style={styles.generateButtonGradient}
            >
              {isGenerating ? (
                <Text style={styles.generateButtonText}>Generating...</Text>
              ) : (
                <Text style={styles.generateButtonText}>🎲 Generate Questions</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Progress Loading Overlay */}
          {isGenerating && generationProgress > 0 && (
            <ProgressLoading
              progress={generationProgress}
              message={`Creating ${count} ${selectedLevel} questions...`}
              color="#FF006E"
              showPercentage={true}
            />
          )}
        </View>

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <>
            <View style={styles.generatedHeader}>
              <Text style={styles.generatedTitle}>
                Generated Questions ({generatedQuestions.length})
              </Text>
              <TouchableOpacity style={styles.addAllButton} onPress={addAllToGame}>
                <Text style={styles.addAllButtonText}>Add All</Text>
              </TouchableOpacity>
            </View>

            {generatedQuestions.map((question) => (
              <View key={question.id} style={styles.questionCard}>
                <Text style={styles.questionText}>{question.text}</Text>
                <View style={styles.questionMeta}>
                  <Text style={styles.questionTag}>
                    {question.level} • {question.category}
                  </Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => addSingleQuestion(question)}
                  >
                    <Text style={styles.addButtonText}>+ Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </Animated.View>
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
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  hint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
    padding: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: '#FF006E',
    backgroundColor: 'rgba(255,0,110,0.1)',
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  optionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionLabelSelected: {
    color: '#FF006E',
  },
  countContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  countButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countButtonSelected: {
    borderColor: '#FF006E',
    backgroundColor: 'rgba(255,0,110,0.2)',
  },
  countText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  countTextSelected: {
    color: '#FF006E',
  },
  inputContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    minHeight: 80,
    justifyContent: 'center',
  },
  input: {
    color: '#fff',
    fontSize: 15,
  },
  generateContainer: {
    position: 'relative',
  },
  generateButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 30,
    height: 60,
  },
  generateButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  generatedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  generatedTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addAllButton: {
    backgroundColor: '#FF006E',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  addAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  questionCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  questionText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionTag: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  addButton: {
    backgroundColor: '#FF006E',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
