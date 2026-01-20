import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IntensityLevel, Question } from '../types';
import { zaiService } from '../utils/zaiService';
import { soundManager } from '../utils/sounds';
import { EnhancedLoadingSpinner, DotsLoading } from '../components/EnhancedLoadingSpinner';
import AccessibleTouchable from '../components/AccessibleTouchable';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface Props {
  level?: IntensityLevel;
  mode?: string;
  playerCount?: number;
  onAddQuestion?: (question: Question) => void;
  onBack: () => void;
}

/**
 * Enhanced AI Chat Screen with improved loading states and animations
 *
 * Features:
 * - DotsLoading for typing indicator
 * - AccessibleTouchable for all buttons
 * - Smooth animations for messages
 * - Better visual feedback
 */
export default function AIChatScreen({
  level = 'mild',
  mode = 'hetero',
  playerCount = 2,
  onAddQuestion,
  onBack,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: '🎲 Hey! I\'m your Kinky Finger Picker AI assistant!\n\nI can help you:\n• Suggest fun questions & dares\n• Generate custom content\n• Give advice for your party\n\nWhat would you like?',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    soundManager.playSound('tap');

    try {
      const response = await zaiService.chat(inputText, { level, mode, playerCount });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.message,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      soundManager.playSound('countdown');
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: '😅 Sorry, I\'m having trouble connecting. Try again!',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomQuestions = async () => {
    setInputText(`Generate 3 ${level} questions for ${playerCount} players`);
    setTimeout(() => sendMessage(), 100);
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
        <Text style={styles.headerTitle}>🤖 AI Assistant</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <Animated.View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === 'user' ? styles.userText : styles.assistantText,
              ]}
            >
              {message.text}
            </Text>
          </Animated.View>
        ))}

        {/* Enhanced Loading Indicator */}
        {isLoading && (
          <View style={[styles.messageBubble, styles.assistantBubble]}>
            <DotsLoading
              message="Thinking..."
              dotCount={3}
              dotSize={8}
              color="#FF006E"
              showBackground={false}
            />
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <AccessibleTouchable
          style={styles.quickActionButton}
          onPress={generateRandomQuestions}
          accessibilityLabel="Generate random questions"
          accessibilityHint="Automatically generate 3 random questions"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={['#FF006E', '#8338EC'] as const}
            style={styles.quickActionGradient}
          >
            <Text style={styles.quickActionText}>🎲 Generate Questions</Text>
          </LinearGradient>
        </AccessibleTouchable>
      </View>

      {/* Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me anything..."
            placeholderTextColor="#666"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            <LinearGradient
              colors={['#FF006E', '#8338EC'] as const}
              style={styles.sendButtonGradient}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF006E',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#fff',
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  quickActionButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickActionGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 15,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 20,
    overflow: 'hidden',
    width: 70,
    height: 40,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
