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

  const formatted = rawText
    .replace(/a\s+\{target\}/gi, targetVocative)
    .replace(/de\s+\{target\}/gi, target.gender === 'female' ? 'de ella' : target.gender === 'male' ? 'de él' : 'de tu pareja')
    .replace(/con\s+\{target\}/gi, target.gender === 'female' ? 'con ella' : target.gender === 'male' ? 'con él' : 'con tu pareja')
    .replace(/hacia\s+\{target\}/gi, target.gender === 'female' ? 'hacia ella' : target.gender === 'male' ? 'hacia él' : 'hacia tu pareja')
    .replace(/para\s+\{target\}/gi, target.gender === 'female' ? 'para ella' : target.gender === 'male' ? 'para él' : 'para tu pareja')
    .replace(/\{target\}/gi, targetVocative)
    .replace(/\{target_pronoun\}/gi, targetPronoun)
    .replace(/the person on your right/gi, targetVocative)
    .replace(/the person on your left/gi, targetVocative)
    .replace(/the person across from you/gi, targetVocative)
    .replace(/someone in the group/gi, targetVocative)
    .replace(/someone here/gi, targetVocative)
    .replace(/someone/gi, targetVocative);

  return formatted.replace(/\ba a\b/gi, 'a');
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
    text: 'Dile a {target} un cumplido honesto sobre su sonrisa, su mirada o su estilo.',
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

  // SPICY LEVEL - CLASSIC (Hot, Sensual & Direct Interaction)
  {
    id: 'spicy_classic_1',
    text: 'Dale a {target} un beso suave en el cuello o en la comisura de los labios.',
    level: 'spicy',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'spicy_classic_2',
    text: '¿Cuál es tu posición íntima favorita y por qué te enciende tanto?',
    level: 'spicy',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'spicy_classic_3',
    text: 'Quítate una prenda de vestir (a tu elección o a elección de {target}).',
    level: 'spicy',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'spicy_classic_4',
    text: 'Describe el momento más apasionado o candente que has vivido recientemente.',
    level: 'spicy',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'spicy_classic_5',
    text: 'Hazle a {target} un masaje sensual de hombros o espalda durante 30 segundos.',
    level: 'spicy',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'spicy_classic_6',
    text: '¿Cuál es tu fantasía erótica más recurrente que aún no has cumplido?',
    level: 'spicy',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'spicy_classic_7',
    text: 'Siéntate en las piernas de {target} durante toda la siguiente ronda.',
    level: 'spicy',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'spicy_classic_8',
    text: '¿Alguna vez has tenido una aventura de una noche o romance prohibido? Cuenta la anécdota.',
    level: 'spicy',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'spicy_classic_9',
    text: 'Acércate al oído de {target} y dale un mordisquito suave en el lóbulo de la oreja.',
    level: 'spicy',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'spicy_classic_10',
    text: '¿Qué es lo más kinky o atrevido que has hecho en la intimidad?',
    level: 'spicy',
    type: 'question',
    category: 'classic'
  },

  // SPICY LEVEL - ROMANTIC
  {
    id: 'spicy_romantic_1',
    text: 'Dale a {target} un beso en los labios de al menos 3 segundos.',
    level: 'spicy',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_2',
    text: '¿Qué es lo más sexy o provocador que te han susurrado al oído en la cama?',
    level: 'spicy',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_3',
    text: 'Dale a {target} un abrazo apretado y apasionado cuerpo a cuerpo durante 10 segundos.',
    level: 'spicy',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_4',
    text: 'Describe cómo sería la manera infalible en la que te gustaría ser seducido/a hoy.',
    level: 'spicy',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_5',
    text: 'Pasa tus dedos lentamente por el brazo y cuello de {target} mirándole fijamente a los ojos.',
    level: 'spicy',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_6',
    text: '¿Qué parte del cuerpo de {target} te parece más atractiva y provocativa?',
    level: 'spicy',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_7',
    text: 'Acaricia suavemente el rostro y labios de {target} con ambas manos durante 10 segundos.',
    level: 'spicy',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_8',
    text: 'Confiesa con sinceridad qué pensamiento atrevido se te cruzó por la mente al ver a {target} hoy.',
    level: 'spicy',
    type: 'question',
    category: 'romantic'
  },

  // SPICY LEVEL - PARTY
  {
    id: 'spicy_party_1',
    text: 'Báilale de forma sensual y provocativa a {target} durante 20 segundos.',
    level: 'spicy',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'spicy_party_2',
    text: '¿Cuál es tu táctica secreta para ligar cuando alguien te atrae de verdad?',
    level: 'spicy',
    type: 'question',
    category: 'party'
  },
  {
    id: 'spicy_party_3',
    text: 'Dale de probar un trago o bebida a {target} de la manera más sensual posible.',
    level: 'spicy',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'spicy_party_4',
    text: '¿Alguna vez te has liado con alguien nada más conocerlo/a en una fiesta? Cuenta cómo fue.',
    level: 'spicy',
    type: 'question',
    category: 'party'
  },
  {
    id: 'spicy_party_5',
    text: 'Susúrrale al oído a {target} tu fantasía más picante con voz muy seductora.',
    level: 'spicy',
    type: 'dare',
    category: 'party'
  },

  // SPICY LEVEL - NSFW
  {
    id: 'spicy_nsfw_1',
    text: '¿Cuál es tu zona erógena favorita o dónde más te enciende que te toquen?',
    level: 'spicy',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'spicy_nsfw_2',
    text: 'Describe en detalle qué aroma, actitud o gesto te excita de inmediato.',
    level: 'spicy',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'spicy_nsfw_3',
    text: '¿Tienes fotos íntimas o has hecho sexting con alguien? ¿Alguna experiencia loca?',
    level: 'spicy',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'spicy_nsfw_4',
    text: '¿Qué práctica traviesa o fetiche te gustaría experimentar en la intimidad?',
    level: 'spicy',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'spicy_nsfw_5',
    text: 'Puntúa tus habilidades en la intimidad del 1 al 10 y dinos por qué te das esa nota.',
    level: 'spicy',
    type: 'question',
    category: 'nsfw'
  },

  // EXTREME LEVEL - CLASSIC (Explicit, Wild & Daring 18+)
  {
    id: 'extreme_classic_1',
    text: 'Describe con lujo de detalles qué te gustaría hacer a solas en una habitación con {target}.',
    level: 'extreme',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'extreme_classic_2',
    text: 'Quítate dos prendas frente a {target} sin titubear.',
    level: 'extreme',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'extreme_classic_3',
    text: 'Hazle un baile erótico (lap dance) a {target} durante 30 segundos.',
    level: 'extreme',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'extreme_classic_4',
    text: '¿Cuál es tu secreto más oscuro, perverso o inconfesable en la cama?',
    level: 'extreme',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'extreme_classic_5',
    text: 'Dale a {target} un beso apasionado de lengua durante 10 segundos.',
    level: 'extreme',
    type: 'dare',
    category: 'classic'
  },

  // EXTREME LEVEL - PARTY
  {
    id: 'extreme_party_1',
    text: 'Haz un striptease sensual y divertido frente a {target} al ritmo que elijan.',
    level: 'extreme',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'extreme_party_2',
    text: '¿Has tenido relaciones en algún lugar público o arriesgado? ¿Dónde fue exactamente?',
    level: 'extreme',
    type: 'question',
    category: 'party'
  },
  {
    id: 'extreme_party_3',
    text: 'Tómate un shot o trago directamente del cuerpo o cuello de {target}.',
    level: 'extreme',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'extreme_party_4',
    text: '¿Cuál ha sido la situación más extrema o insólita donde te pillaron o casi te pillan en el acto?',
    level: 'extreme',
    type: 'question',
    category: 'party'
  },
  {
    id: 'extreme_party_5',
    text: 'Demuestra con mímica seductora cuál es tu movimiento estrella en la cama.',
    level: 'extreme',
    type: 'dare',
    category: 'party'
  },

  // EXTREME LEVEL - NSFW
  {
    id: 'extreme_nsfw_1',
    text: '¿Alguna vez has hecho o fantaseado con un trío o fiesta privada para adultos? Cuenta los detalles.',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_2',
    text: '¿Cuál es el récord de veces que has tenido acción en un solo día o noche?',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_3',
    text: 'Deja que {target} te deje una marca de beso o mordisquito en el cuello donde prefiera.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_4',
    text: 'Describe cómo fue tu último encuentro íntimo con todos los detalles candentes.',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_5',
    text: 'Confiesa tu fetiche más salvaje o prohibido que jamás le has contado a nadie.',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_6',
    text: '¿Has probado juegos de rol (disfraces, sumisión o dominación)? Cuéntanos qué tal fue.',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_7',
    text: '¿Qué es lo más extremo o sin límites que estarías dispuesto/a a experimentar hoy?',
    level: 'extreme',
    type: 'question',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_8',
    text: 'Deja que {target} pase sus manos libremente por tu cuerpo (sobre la ropa) por 15 segundos.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_9',
    text: 'Bésale lentamente el abdomen o el cuello a {target} durante 15 segundos.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw'
  },
  {
    id: 'extreme_nsfw_10',
    text: 'Bésense intensamente con {target} durante 30 segundos sin detenerse.',
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
