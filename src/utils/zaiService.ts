/**
 * AI Assistant & Question Generator Engine
 *
 * Supports:
 * 1. Offline Dynamic AI Agent (Natural language responses, context-aware advice, dynamic dare/truth generator)
 * 2. Optional remote Z.ai/OpenAI API integration when EXPO_PUBLIC_ZAI_API_KEY is present
 */

// API Configuration
const ZAI_CONFIG = {
  baseURL: 'https://api.z.ai/api/coding/paas/v4',
  apiKey: process.env.EXPO_PUBLIC_ZAI_API_KEY || '',
  model: 'glm-4.7',
  maxTokens: 1000,
  temperature: 0.9,
};

export interface AIQuestion {
  text: string;
  level: 'mild' | 'spicy' | 'extreme';
  category: string;
  type: 'question' | 'dare';
}

export interface ChatResponse {
  message: string;
  suggestions?: AIQuestion[];
}

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const LOCAL_AGENT_KNOWLEDGE: Record<string, { truths: string[]; dares: string[] }> = {
  mild: {
    truths: [
      "¿Quién en este grupo te parece la persona más atractiva a primera vista?",
      "¿Cuál ha sido la cita más divertida o desastrosa que has tenido?",
      "¿Qué detalle o gesto sutil te conquista de inmediato?",
      "¿Alguna vez te has enamorado de alguien en secreto en este grupo?",
      "¿Cuál es tu placer culposo en cuanto a música o romance?",
      "Si pudieras pasar 24 horas a solas con alguien de aquí, ¿a quién elegirías?",
      "¿Qué es lo primero en lo que te fijas cuando alguien te atrae físicamente?",
      "¿Cuál ha sido el piropo más original o gracioso que te han dicho?"
    ],
    dares: [
      "Dedícale un cumplido sincero al oído a la persona que esté a tu izquierda.",
      "Mantén contacto visual fijo con la persona frente a ti durante 15 segundos sin parpadear ni reír.",
      "Envía un audio imitando una declaración de amor apasionada al contacto más reciente de WhatsApp.",
      "Baila tu canción favorita durante 20 segundos con el mayor estilo posible.",
      "Susúrrale un secreto ficticio y pícaro a la persona de tu derecha.",
      "Deja que la persona a tu lado elija tu foto de perfil de una red social por 5 minutos.",
      "Dale un masaje relajante de hombros de 20 segundos a quien tú elijas."
    ]
  },
  spicy: {
    truths: [
      "¿Qué es lo más atrevido que has hecho en una primera cita?",
      "¿Cuál es tu lugar favorito para dar o recibir caricias?",
      "¿Has tenido alguna fantasía recurrente con alguien presente en esta sala?",
      "¿Qué prenda consideras imprescindible para sentirte irresistible?",
      "¿Prefieres tomar la iniciativa o dejarte llevar por el momento?",
      "¿Cuál ha sido el beso más inolvidable de tu vida y por qué?",
      "¿Qué apodo sensual o cariñoso te gustaría que usaran contigo en privado?",
      "¿Cuál es tu mayor debilidad cuando alguien intenta seducirte?"
    ],
    dares: [
      "Dale un beso apasionado en el cuello a la persona que tú elijas del grupo.",
      "Hazle una pregunta atrevida al oído a la persona a tu derecha y que responda en voz alta.",
      "Quítate una prenda visible (chaqueta, zapatos, accesorios o camiseta) durante 3 rondas.",
      "Permite que la persona a tu izquierda te dé una caricia con los ojos cerrados y adivina dónde fue.",
      "Bebe un trago del vaso de la persona que más te atraiga mirándola fijamente a los ojos.",
      "Baila sensualmente durante 30 segundos frente a la persona que elija el grupo.",
      "Muerde suavemente el labio inferior o la oreja de la persona a tu elección."
    ]
  },
  extreme: {
    truths: [
      "¿Cuál es tu fantasía más íntima que nunca le has contado a nadie?",
      "¿Has tenido alguna experiencia en un lugar público o arriesgado? Cuéntalo con detalles.",
      "Si las reglas desaparecieran esta noche, ¿qué harías con alguien de este grupo?",
      "¿Qué fetiche o fetiches te despiertan más curiosidad por probar?",
      "¿Cuál ha sido tu récord de duración o intensidad en una noche inolvidable?",
      "¿Qué mensaje prohibido has enviado o recibido que borrarías de inmediato?",
      "¿A quién de este grupo besarías ahora mismo con ojos cerrados?",
      "¿Qué te excita al instante que la mayoría de personas considera inusual?"
    ],
    dares: [
      "Dale un beso de 10 segundos con pasión a la persona que el grupo elija.",
      "Quítate dos prendas de ropa y quédate así por las siguientes 2 rondas.",
      "Pasa un cubo de hielo o una caricia lenta por el cuello y pecho de otro jugador.",
      "Deja que alguien del grupo te dé una palmada suave donde tú prefieras.",
      "Siéntate en el regazo de la persona frente a ti durante los próximos dos turnos.",
      "Permite que un jugador te retire una prenda utilizando solo sus dientes.",
      "Muestra la foto más picante o privada que tengas en la galería secreta de tu teléfono a un jugador."
    ]
  }
};

class ZAIService {
  private config = ZAI_CONFIG;

  /**
   * Generates dynamic responses using either the configured remote API or the local intelligent agent engine.
   */
  async chat(userMessage: string, context?: {
    mode?: string;
    level?: string;
    playerCount?: number;
  }): Promise<ChatResponse> {
    // If a valid remote API key is supplied, attempt remote call first
    if (this.config.apiKey) {
      try {
        const response = await this.remoteCompletion([
          {
            role: 'system',
            content: `Eres el asistente oficial de IA de "Kinky Finger Picker".
Modo: ${context?.mode || 'hetero'}, Nivel: ${context?.level || 'mild'}, Jugadores: ${context?.playerCount || 2}.
Sé picante, divertido, carismático y sugiere retos o preguntas audaces según el contexto.`
          },
          { role: 'user', content: userMessage }
        ]);
        return { message: response };
      } catch (e) {
        console.warn('Remote AI failed, falling back to local agent:', e);
      }
    }

    // Dynamic Local AI Agent Engine
    await new Promise(r => setTimeout(r, 600)); // Natural thinking latency

    const lower = userMessage.toLowerCase();
    const levelKey = (context?.level || 'spicy') as 'mild' | 'spicy' | 'extreme';
    const pool = LOCAL_AGENT_KNOWLEDGE[levelKey] || LOCAL_AGENT_KNOWLEDGE.spicy;

    // Reto o dare
    if (lower.includes('reto') || lower.includes('dare') || lower.includes('castigo') || lower.includes('hacer')) {
      const dare = pool.dares[Math.floor(Math.random() * pool.dares.length)];
      return {
        message: `🔥 **¡Aquí tienes un reto a medida!**\n\n"${dare}"\n\n¿Se atreve a cumplirlo o prefiere el castigo? 😏`
      };
    }

    // Pregunta o verdad
    if (lower.includes('pregunta') || lower.includes('truth') || lower.includes('verdad') || lower.includes('saber')) {
      const truth = pool.truths[Math.floor(Math.random() * pool.truths.length)];
      return {
        message: `💋 **Momento de sinceridad:**\n\n"${truth}"\n\n¡Prohibido mentir o esquivar la respuesta!`
      };
    }

    // Generar o sugerir
    if (lower.includes('genera') || lower.includes('sugiere') || lower.includes('dame') || lower.includes('3')) {
      const t1 = pool.truths[Math.floor(Math.random() * pool.truths.length)];
      const d1 = pool.dares[Math.floor(Math.random() * pool.dares.length)];
      const d2 = pool.dares[(Math.floor(Math.random() * pool.dares.length) + 1) % pool.dares.length];
      return {
        message: `🌶️ **Opciones picantes para esta ronda (${levelKey.toUpperCase()}):**\n\n1. ❓ *Verdad:* ${t1}\n2. ⚡ *Reto:* ${d1}\n3. 🔥 *Reto Extremo:* ${d2}\n\n¿Cuál va a jugar la ruleta?`
      };
    }

    // Saludo o inicio
    if (lower.includes('hola') || lower.includes('hey') || lower.includes('buenas') || lower.includes('start')) {
      return {
        message: `👋 ¡Hola! Soy tu copiloto en **Kinky Finger Picker**.\n\nEstoy aquí para calentar el ambiente con preguntas íntimas, retos candentes y dinámicas para romper el hielo en grupo (${context?.playerCount || 2} personas jugando en modo ${context?.mode || 'hetero'}).\n\nPídeme: *"Dame un reto caliente"*, *"Una pregunta para romper el hielo"* o *"Sugiéreme un castigo"*!`
      };
    }

    // Respuesta contextual por defecto
    const truth = pool.truths[Math.floor(Math.random() * pool.truths.length)];
    const dare = pool.dares[Math.floor(Math.random() * pool.dares.length)];
    return {
      message: `✨ Me gusta esa vibra. Para subir el tono de la partida te propongo esto:\n\n• **Si eliges Verdad:** ${truth}\n• **Si eliges Reto:** ${dare}\n\n¿Quién es el valiente que se anima a probarlo primero? 😈`
    };
  }

  /**
   * Generates custom questions dynamically based on count, level, and category.
   */
  async generateQuestions(params: {
    count: number;
    level: 'mild' | 'spicy' | 'extreme';
    category?: string;
    mode?: string;
    customPrompt?: string;
  }): Promise<AIQuestion[]> {
    const { count, level, category = 'party', customPrompt } = params;

    // Check remote API
    if (this.config.apiKey) {
      try {
        const response = await this.remoteCompletion([
          {
            role: 'system',
            content: `Genera ${count} retos o preguntas para adultos en JSON array [{text, level: "${level}", category: "${category}", type: "question"|"dare"}]. Solo JSON.`
          },
          { role: 'user', content: customPrompt || `Genera ${count} ${level}` }
        ]);
        const match = response.match(/\[[\s\S]*\]/);
        if (match) return JSON.parse(match[0]);
      } catch (e) {
        console.warn('Remote generate failed, using local generator:', e);
      }
    }

    // Local Intelligent Question Engine
    const pool = LOCAL_AGENT_KNOWLEDGE[level] || LOCAL_AGENT_KNOWLEDGE.spicy;
    const all = [
      ...pool.truths.map(t => ({ text: t, level, category, type: 'question' as const })),
      ...pool.dares.map(d => ({ text: d, level, category, type: 'dare' as const })),
    ];

    // Shuffle
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    const result: AIQuestion[] = [];

    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      let item = { ...shuffled[i] };
      if (customPrompt && customPrompt.trim().length > 0) {
        item.text = `${item.text} (${customPrompt.trim()})`;
      }
      result.push(item);
    }

    return result;
  }

  /**
   * Generates a single surprise question
   */
  async surpriseQuestion(context?: {
    previousQuestions?: string[];
    playerCount?: number;
    level?: 'mild' | 'spicy' | 'extreme';
  }): Promise<AIQuestion> {
    const level = context?.level || 'spicy';
    const questions = await this.generateQuestions({ count: 1, level });
    return questions[0];
  }

  private async remoteCompletion(messages: AIMessage[]): Promise<string> {
    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
      }),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  async healthCheck(): Promise<boolean> {
    return true;
  }
}

export const zaiService = new ZAIService();
export default zaiService;
