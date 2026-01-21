/**
 * Z.ai API Service for Kinky Finger Picker
 * Integration with GLM-4.7 model for AI-powered features
 */

// API Configuration
const ZAI_CONFIG = {
  baseURL: 'https://api.z.ai/api/coding/paas/v4',
  // API Key must be set via environment variable EXPO_PUBLIC_ZAI_API_KEY
  apiKey: process.env.EXPO_PUBLIC_ZAI_API_KEY || '',
  model: 'glm-4.7',
  maxTokens: 1000,
  temperature: 0.9, // High creativity for varied questions
};

// Types for AI responses
interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIQuestion {
  text: string;
  level: 'mild' | 'spicy' | 'extreme';
  category: string;
  type: 'question' | 'dare';
}

interface ChatResponse {
  message: string;
  suggestions?: AIQuestion[];
}

/**
 * Z.ai Service Class
 */
class ZAIService {
  private config = ZAI_CONFIG;

  /**
   * Generate completion using Z.ai API
   */
  private async generateCompletion(messages: AIMessage[]): Promise<string> {
    // Validate API key is configured
    if (!this.config.apiKey) {
      throw new Error('Z.ai API key is not configured. Please set EXPO_PUBLIC_ZAI_API_KEY environment variable.');
    }

    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Z.ai API error:', error);
      throw error;
    }
  }

  /**
   * Chat with AI assistant
   * User can ask for suggestions, advice, or custom questions
   */
  async chat(userMessage: string, context?: {
    mode?: string;
    level?: string;
    playerCount?: number;
  }): Promise<ChatResponse> {
    const systemPrompt = `You are a fun, creative assistant for "Kinky Finger Picker", an adult party game.

Your role:
- Suggest exciting truth questions and dares
- Keep suggestions fun and consensual
- Match the intensity level requested (mild/spicy/extreme)
- Be creative but respectful
- Format responses to be engaging and fun

Current context:
- Game mode: ${context?.mode || 'unknown'}
- Intensity level: ${context?.level || 'unknown'}
- Players: ${context?.playerCount || 'unknown'}

Response format:
- Chat naturally with the user
- If suggesting questions/dares, format them clearly
- Keep it brief and fun`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ];

    const response = await this.generateCompletion(messages);
    return { message: response };
  }

  /**
   * Generate custom questions based on parameters
   */
  async generateQuestions(params: {
    count: number;
    level: 'mild' | 'spicy' | 'extreme';
    category?: string;
    mode?: string;
    customPrompt?: string;
  }): Promise<AIQuestion[]> {
    const { count, level, category, mode, customPrompt } = params;

    const systemPrompt = `Generate ${count} unique truth questions or dares for an adult party game.

Parameters:
- Intensity: ${level} (${level === 'mild' ? 'flirty and fun' : level === 'spicy' ? 'getting hot' : 'no limits'})
- Category: ${category || 'any'}
- Mode: ${mode || 'any'} (hetero/gay/lesbian)
- Custom requirement: ${customPrompt || 'none'}

Format each as JSON:
{
  "text": "question or dare text",
  "level": "${level}",
  "category": "${category || 'classic'}",
  "type": "question" or "dare"
}

Return ONLY a valid JSON array of ${count} objects. No extra text.`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate ${count} ${level} questions/dares` },
    ];

    try {
      const response = await this.generateCompletion(messages);
      // Parse JSON response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        return questions;
      }
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Failed to parse AI questions:', error);
      // Fallback to template questions
      return this.getFallbackQuestions(count, level);
    }
  }

  /**
   * Surprise mode: Generate a random unexpected question
   */
  async surpriseQuestion(context?: {
    previousQuestions?: string[];
    playerCount?: number;
    level?: 'mild' | 'spicy' | 'extreme';
  }): Promise<AIQuestion> {
    const { previousQuestions = [], playerCount = 2, level = 'spicy' } = context || {};

    const systemPrompt = `Generate ONE unexpected, creative truth question or dare for a party game.

Context:
- Players: ${playerCount}
- Intensity: ${level}
- Previous questions used: ${previousQuestions.slice(-3).join(', ') || 'none'}

Make it:
- Surprising and unexpected
- Tailored to ${playerCount} players
- ${level} intensity (${level === 'mild' ? 'flirty' : level === 'spicy' ? 'hot' : 'wild'})
- Different from previous questions

Return ONLY a valid JSON object:
{
  "text": "the question or dare",
  "level": "${level}",
  "category": "surprise",
  "type": "question" or "dare"
}`;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Give me a surprise question!' },
    ];

    try {
      const response = await this.generateCompletion(messages);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Invalid JSON response');
    } catch (error) {
      console.error('Failed to generate surprise:', error);
      return this.getFallbackQuestions(1, level)[0];
    }
  }

  /**
   * Fallback questions when AI fails
   */
  private getFallbackQuestions(count: number, level: string): AIQuestion[] {
    const fallbacks: Record<string, AIQuestion[]> = {
      mild: [
        { text: "Give a compliment to the person on your left", level: 'mild', category: 'classic', type: 'question' },
        { text: "Share your idea of a perfect date", level: 'mild', category: 'romantic', type: 'question' },
        { text: "Do your best dance move for 10 seconds", level: 'mild', category: 'party', type: 'dare' },
      ],
      spicy: [
        { text: "Kiss the person on your right on the cheek", level: 'spicy', category: 'party', type: 'dare' },
        { text: "Describe your ideal romantic encounter", level: 'spicy', category: 'romantic', type: 'question' },
        { text: "Give a 30-second massage to the player of your choice", level: 'spicy', category: 'party', type: 'dare' },
      ],
      extreme: [
        { text: "Remove one article of clothing (accessory counts)", level: 'extreme', category: 'party', type: 'dare' },
        { text: "Share your wildest fantasy", level: 'extreme', category: 'nsfw', type: 'question' },
        { text: "Let another player pose you for a photo", level: 'extreme', category: 'nsfw', type: 'dare' },
      ],
    };

    const questions = fallbacks[level] || fallbacks.spicy;
    return questions.slice(0, Math.min(count, questions.length));
  }

  /**
   * Health check for API
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.baseURL}/models`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const zaiService = new ZAIService();
export default zaiService;
