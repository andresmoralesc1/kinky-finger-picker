import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Question, IntensityLevel, QuestionCategory } from '../types';

interface Props {
  customQuestions: Question[];
  onAddQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onBack: () => void;
}

export default function CustomQuestionsScreen({ customQuestions, onAddQuestion, onDeleteQuestion, onBack }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<IntensityLevel>('mild');
  const [selectedType, setSelectedType] = useState<'question' | 'dare'>('question');

  const handleAdd = () => {
    if (questionText.trim().length === 0) {
      Alert.alert('Error', 'Please enter a question or dare');
      return;
    }

    const newQuestion: Question = {
      id: `custom_${Date.now()}`,
      text: questionText.trim(),
      level: selectedLevel,
      type: selectedType,
      category: 'custom',
      isCustom: true,
    };

    onAddQuestion(newQuestion);
    setQuestionText('');
    setShowForm(false);
  };

  const handleDelete = (id: string, text: string, type: 'question' | 'dare') => {
    Alert.alert(
      'Delete Question',
      `Are you sure you want to delete this ${type}?\n\n"${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDeleteQuestion(id)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Custom Questions</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your question or dare..."
            placeholderTextColor="#666"
            value={questionText}
            onChangeText={setQuestionText}
            multiline
          />

          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, selectedType === 'question' && styles.typeButtonActive]}
              onPress={() => setSelectedType('question')}
            >
              <Text style={[styles.typeButtonText, selectedType === 'question' && styles.typeButtonTextActive]}>
                Question
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, selectedType === 'dare' && styles.typeButtonActive]}
              onPress={() => setSelectedType('dare')}
            >
              <Text style={[styles.typeButtonText, selectedType === 'dare' && styles.typeButtonTextActive]}>
                Dare
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.levelSelector}>
            {(['mild', 'spicy', 'extreme'] as IntensityLevel[]).map(level => (
              <TouchableOpacity
                key={level}
                style={[styles.levelButton, selectedLevel === level && styles.levelButtonActive]}
                onPress={() => setSelectedLevel(level)}
              >
                <Text style={[styles.levelButtonText, selectedLevel === level && styles.levelButtonTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
            <Text style={styles.submitButtonText}>Add Question</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.listContainer}>
        {customQuestions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No custom questions yet</Text>
            <Text style={styles.emptyStateSubtext}>Tap + to add your own!</Text>
          </View>
        ) : (
          customQuestions.map(question => (
            <View key={question.id} style={styles.questionCard}>
              <View style={styles.questionCardHeader}>
                <Text style={styles.questionCardType}>{question.type === 'dare' ? '💋' : '❓'}</Text>
                <Text style={styles.questionCardLevel}>{question.level}</Text>
                <TouchableOpacity onPress={() => handleDelete(question.id, question.text, question.type)}>
                  <Text style={styles.deleteButton}>🗑️</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.questionCardText}>{question.text}</Text>
            </View>
          ))
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF006E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#111',
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 15,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#222',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#FF006E',
  },
  typeButtonText: {
    color: '#BBB',
    fontSize: 14,
    fontWeight: 'bold',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  levelSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  levelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#222',
    alignItems: 'center',
  },
  levelButtonActive: {
    backgroundColor: '#FB5607',
  },
  levelButtonText: {
    color: '#BBB',
    fontSize: 14,
    fontWeight: 'bold',
  },
  levelButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#FF006E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  emptyStateSubtext: {
    color: '#666',
    fontSize: 14,
  },
  questionCard: {
    backgroundColor: '#111',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  questionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  questionCardType: {
    fontSize: 20,
  },
  questionCardLevel: {
    flex: 1,
    color: '#FF006E',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  deleteButton: {
    fontSize: 20,
  },
  questionCardText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
});
