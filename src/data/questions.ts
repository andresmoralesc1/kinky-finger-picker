import { Question, IntensityLevel, QuestionCategory, Player } from '../types';

export function formatQuestionForPair(
  rawText: string,
  actor: Player,
  target?: Player | null
): string {
  if (!target) return rawText;

  const targetVocative =
    target.gender === 'female'
      ? 'a ella'
      : target.gender === 'male'
      ? 'a él'
      : 'a tu pareja';

  const targetPronoun =
    target.gender === 'female'
      ? 'ella'
      : target.gender === 'male'
      ? 'él'
      : 'tu pareja';

  return rawText
    .replace(/\{target\}/gi, targetVocative)
    .replace(/\{target_pronoun\}/gi, targetPronoun)
    .replace(/the person on your right/gi, targetVocative)
    .replace(/the person on your left/gi, targetVocative)
    .replace(/the person across from you/gi, targetVocative)
    .replace(/someone in the group/gi, targetVocative)
    .replace(/someone here/gi, targetVocative)
    .replace(/someone/gi, targetVocative);
}

export const questions: Question[] = [
  // MILD LEVEL - CLASSIC (100% Mild, Flirty & Icebreakers between Pair)
  {
    id: 'mild_classic_1',
    text: '¿Cuál fue tu primera impresión sincera de {target} al verle hoy?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_2',
    text: 'Dile {target} un cumplido honesto sobre su sonrisa, su mirada o su estilo.',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'mild_classic_3',
    text: '¿Qué detalle sutil o gesto coqueto te hace sonreír al instante?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_4',
    text: 'Mírense fijamente a los ojos con {target} durante 10 segundos sin reírse.',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'mild_classic_5',
    text: '¿Cuál ha sido la cita más divertida o inesperada que has tenido?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_6',
    text: 'Susúrrale al oído a {target} una frase divertida o juguetona.',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'mild_classic_7',
    text: '¿Cómo describirías tu cita ideal perfecta para romper el hielo?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_8',
    text: 'Haz reír a {target} en menos de 15 segundos sin tocarlo/a.',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'mild_classic_9',
    text: '¿Qué es lo primero en lo que te fijas cuando alguien te parece interesante?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_10',
    text: 'Dedícale un guiño coqueto a {target} seguido de tu mejor pose divertida.',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },

  // MILD LEVEL - ROMANTIC
  {
    id: 'mild_romantic_1',
    text: '¿Qué canción romántica o balada te hace pensar en un momento especial?',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_2',
    text: 'Dile a {target} 2 cosas que te parezcan atractivas o agradables de su forma de ser.',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_3',
    text: '¿Cuál es el detalle romántico más lindo o considerado que han tenido contigo?',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_4',
    text: 'Tómense de las manos con {target} durante 15 segundos mientras se miran y sonríen.',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_5',
    text: '¿Prefieres una cena tranquila a la luz de las velas o un paseo bajo las estrellas?',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_6',
    text: 'Adivina qué tipo de música le gusta escuchar a {target} y que confirme si acertaste.',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_7',
    text: '¿Crees en la química instantánea al conocer a alguien? Comparte tu opinión con {target}.',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_8',
    text: 'Dale a {target} un abrazo cálido y cariñoso de 5 segundos.',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_9',
    text: '¿Cuál es la película romántica o comedia que nunca te cansas de ver?',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_10',
    text: 'Dedícale a {target} una frase poética o un piropo improvisado con mucha elegancia.',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },

  // MILD LEVEL - PARTY
  {
    id: 'mild_party_1',
    text: 'Hagan un choque de manos creativo o un saludo secreto de película con {target}.',
    level: 'mild',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'mild_party_2',
    text: '¿Cuál ha sido la anécdota más divertida que te ha pasado en una fiesta?',
    level: 'mild',
    type: 'question',
    category: 'party'
  },
  {
    id: 'mild_party_3',
    text: 'Bailen lento juntos 15 segundos con {target} al ritmo de música imaginaria.',
    level: 'mild',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'mild_party_4',
    text: 'Si tú y {target} tuvieran que escapar de una fiesta aburrida, ¿a dónde propondrías ir?',
    level: 'mild',
    type: 'question',
    category: 'party'
  },
  {
    id: 'mild_party_5',
    text: 'Lanza un beso al aire con estilo hacia {target}.',
    level: 'mild',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'mild_party_6',
    text: '¿Qué trago, cóctel o bebida pedirías para invitarle a {target}?',
    level: 'mild',
    type: 'question',
    category: 'party'
  },
  {
    id: 'mild_party_7',
    text: 'Jueguen una ronda rápida de pulso de pulgares (thumb war) con {target}.',
    level: 'mild',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'mild_party_8',
    text: '¿Cuál es el juego de fiesta o ronda de preguntas que más te gusta jugar?',
    level: 'mild',
    type: 'question',
    category: 'party'
  },
  {
    id: 'mild_party_9',
    text: 'Imita cómo caminaría o posaría {target} en una alfombra roja.',
    level: 'mild',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'mild_party_10',
    text: 'Chóquenle las palmas y dense un choque de puños con sonido explosivo.',
    level: 'mild',
    type: 'dare',
    category: 'party'
  },

  // SPICY LEVEL - CLASSIC
  {
    id: 'spicy_classic_1',
    text: 'Kiss someone in the group on the cheek',
    level: 'spicy',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'spicy_classic_2',
    text: 'What is your favorite position?',
    level: 'spicy',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'spicy_classic_3',
    text: 'Take off one piece of clothing',
    level: 'spicy',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'spicy_classic_4',
    text: 'Describe your last intimate moment (no names)',
    level: 'spicy',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'spicy_classic_5',
    text: 'Give someone a sensual 30-second massage',
    level: 'spicy',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'spicy_classic_6',
    text: 'What is your wildest fantasy?',
    level: 'spicy',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'spicy_classic_7',
    text: 'Sit on someone\'s lap for the next round',
    level: 'spicy',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'spicy_classic_8',
    text: 'Have you ever had a one-night stand? Tell the story',
    level: 'spicy',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'spicy_classic_9',
    text: 'Kiss the neck of the person next to you',
    level: 'spicy',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'spicy_classic_10',
    text: 'What is the kinkiest thing you have done?',
    level: 'spicy',
    type: 'question',
    category: 'classic'
  },

  // SPICY LEVEL - ROMANTIC
  {
    id: 'spicy_romantic_1',
    text: 'Kiss someone on the lips (quick peck)',
    level: 'spicy',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_2',
    text: 'What is the sexiest thing a partner has said to you?',
    level: 'spicy',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_3',
    text: 'Give someone a passionate hug for 10 seconds',
    level: 'spicy',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_4',
    text: 'Describe your ideal way to be seduced',
    level: 'spicy',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_5',
    text: 'Trace your finger along someone\'s arm slowly',
    level: 'spicy',
    type: 'dare',
    category: 'romantic'
  },

  // SPICY LEVEL - PARTY
  {
    id: 'spicy_party_1',
    text: 'Do a sexy dance for 20 seconds',
    level: 'spicy',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'spicy_party_2',
    text: 'What is your go-to move to seduce someone?',
    level: 'spicy',
    type: 'question',
    category: 'party'
  },
  {
    id: 'spicy_party_3',
    text: 'Let someone feed you something sensually',
    level: 'spicy',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'spicy_party_4',
    text: 'Have you ever hooked up with someone you just met?',
    level: 'spicy',
    type: 'question',
    category: 'party'
  },
  {
    id: 'spicy_party_5',
    text: 'Whisper something dirty to someone',
    level: 'spicy',
    type: 'dare',
    category: 'party'
  },

  // SPICY LEVEL - NSFW
  {
    id: 'spicy_nsfw_1',
    text: 'What is your favorite way to be touched?',
    level: 'spicy',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'spicy_nsfw_2',
    text: 'Describe your biggest turn-on in detail',
    level: 'spicy',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'spicy_nsfw_3',
    text: 'Have you ever sent explicit photos? Any regrets?',
    level: 'spicy',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'spicy_nsfw_4',
    text: 'What is something you want to try in bed?',
    level: 'spicy',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'spicy_nsfw_5',
    text: 'Rate your bedroom skills from 1-10 and explain why',
    level: 'spicy',
    type: 'question',
    category: 'nsfw'
  },

  // EXTREME LEVEL - CLASSIC
  {
    id: 'extreme_classic_1',
    text: 'Describe in detail what you would do to someone here',
    level: 'extreme',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'extreme_classic_2',
    text: 'Remove two pieces of clothing',
    level: 'extreme',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'extreme_classic_3',
    text: 'Give someone a sensual lap dance for 30 seconds',
    level: 'extreme',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'extreme_classic_4',
    text: 'What is your dirtiest secret?',
    level: 'extreme',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'extreme_classic_5',
    text: 'Kiss someone passionately for 10 seconds',
    level: 'extreme',
    type: 'dare',
    category: 'classic'
  },

  // EXTREME LEVEL - PARTY
  {
    id: 'extreme_party_1',
    text: 'Do a striptease dance (underwear minimum)',
    level: 'extreme',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'extreme_party_2',
    text: 'Have you ever had sex in public? Where?',
    level: 'extreme',
    type: 'question',
    category: 'party'
  },
  {
    id: 'extreme_party_3',
    text: 'Let someone give you a body shot',
    level: 'extreme',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'extreme_party_4',
    text: 'What is the craziest place you have had sex?',
    level: 'extreme',
    type: 'question',
    category: 'party'
  },
  {
    id: 'extreme_party_5',
    text: 'Demonstrate your best bedroom move',
    level: 'extreme',
    type: 'dare',
    category: 'party'
  },

  // EXTREME LEVEL - NSFW
  {
    id: 'extreme_nsfw_1',
    text: 'Have you ever been to a sex club or swingers party? Details!',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_2',
    text: 'What is the most people you have been with at once?',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_3',
    text: 'Let someone give you a hickey wherever they want',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_4',
    text: 'Describe your last sexual encounter in detail',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_5',
    text: 'What is your deepest, darkest fantasy?',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_6',
    text: 'Have you ever tried role play? What was the scenario?',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_7',
    text: 'What is the kinkiest thing you want to try?',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_8',
    text: 'Confess your most taboo turn-on',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_9',
    text: 'Let someone touch you anywhere (over clothes)',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_10',
    text: 'Make out with someone for 30 seconds',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw'
  },
];

export const getQuestionsByLevel = (level: IntensityLevel, categories?: QuestionCategory[]): Question[] => {
  let filtered = questions.filter(q => q.level === level);
  if (categories && categories.length > 0) {
    filtered = filtered.filter(q => categories.includes(q.category));
  }
  return filtered;
};

export const getRandomQuestion = (
  level: IntensityLevel,
  categories?: QuestionCategory[],
  usedQuestionIds?: string[]
): Question => {
  let levelQuestions = getQuestionsByLevel(level, categories);

  // Filter out used questions if provided
  if (usedQuestionIds && usedQuestionIds.length > 0) {
    const unused = levelQuestions.filter(q => !usedQuestionIds.includes(q.id));
    if (unused.length > 0) {
      levelQuestions = unused;
    }
    // If all questions used, reset and use all
  }

  const randomIndex = Math.floor(Math.random() * levelQuestions.length);
  return levelQuestions[randomIndex];
};

export const getQuestionsByCategory = (category: QuestionCategory): Question[] => {
  return questions.filter(q => q.category === category);
};
