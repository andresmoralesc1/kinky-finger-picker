import { Question, IntensityLevel, QuestionCategory, Player, GroupInteractionContext } from '../types';

export function formatQuestionForPair(
  rawText: string,
  actor: Player,
  target?: Player | null
): string {
  if (!target) return rawText;

  const targetVocative = target.name
    ? target.name
    : target.gender === 'female'
    ? 'a ella'
    : target.gender === 'male'
    ? 'a él'
    : 'a tu pareja';

  const targetPronoun = target.name
    ? target.name
    : target.gender === 'female'
    ? 'ella'
    : target.gender === 'male'
    ? 'él'
    : 'tu pareja';

  const formatted = rawText
    .replace(/a\s+\{target\}/gi, target.name ? `a ${target.name}` : targetVocative)
    .replace(/de\s+\{target\}/gi, target.name ? `de ${target.name}` : target.gender === 'female' ? 'de ella' : target.gender === 'male' ? 'de él' : 'de tu pareja')
    .replace(/con\s+\{target\}/gi, target.name ? `con ${target.name}` : target.gender === 'female' ? 'con ella' : target.gender === 'male' ? 'con él' : 'con tu pareja')
    .replace(/hacia\s+\{target\}/gi, target.name ? `hacia ${target.name}` : target.gender === 'female' ? 'hacia ella' : target.gender === 'male' ? 'hacia él' : 'hacia tu pareja')
    .replace(/para\s+\{target\}/gi, target.name ? `para ${target.name}` : target.gender === 'female' ? 'para ella' : target.gender === 'male' ? 'para él' : 'para tu pareja')
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

export function formatQuestionForGroup(
  rawText: string,
  groupContext: GroupInteractionContext
): string {
  let formatted = rawText;

  // Format individual pairs
  groupContext.pairs.forEach((pair, idx) => {
    const pairNum = idx + 1;
    const p1Label = pair.player1.name
      ? pair.player1.name
      : pair.player1.gender === 'female'
      ? 'Ella (♀️)'
      : pair.player1.gender === 'male'
      ? 'Él (♂️)'
      : (pair.player1.id >= 1001 && pair.player1.id <= 1010 ? `Jugador ${pair.player1.id === 1010 ? '0' : pair.player1.id - 1000}` : `Jugador ${pairNum}A`);

    const p2Label = pair.player2.name
      ? pair.player2.name
      : pair.player2.gender === 'female'
      ? 'Ella (♀️)'
      : pair.player2.gender === 'male'
      ? 'Él (♂️)'
      : (pair.player2.id >= 1001 && pair.player2.id <= 1010 ? `Jugador ${pair.player2.id === 1010 ? '0' : pair.player2.id - 1000}` : `Jugador ${pairNum}B`);

    const pairTitle = pair.player1.name && pair.player2.name
      ? `${pair.player1.name} y ${pair.player2.name}`
      : `Pareja ${pairNum}`;

    formatted = formatted
      .replace(new RegExp(`\\{PAREJA_${pairNum}\\}`, 'gi'), pairTitle)
      .replace(new RegExp(`\\{P${pairNum}_J1\\}`, 'gi'), p1Label)
      .replace(new RegExp(`\\{P${pairNum}_J2\\}`, 'gi'), p2Label);
  });

  // Format solo player for all_vs_one / trio_vs_one
  if (groupContext.soloPlayer) {
    const sp = groupContext.soloPlayer;
    const soloLabel = sp.name
      ? sp.name
      : sp.gender === 'female'
      ? 'Ella (♀️)'
      : sp.gender === 'male'
      ? 'Él (♂️)'
      : (sp.id >= 1001 && sp.id <= 1010 ? `Jugador ${sp.id === 1010 ? '0' : sp.id - 1000}` : 'Jugador Elegido');

    formatted = formatted
      .replace(/\{PROTAGONISTA\}/gi, soloLabel)
      .replace(/\{SOLO_PLAYER\}/gi, soloLabel);
  }

  // Format group members / rest of group
  const groupCount = groupContext.groupMembers?.length || (groupContext.totalPlayers - 1);
  const groupLabel = groupCount > 1 ? `los otros ${groupCount} participantes` : 'el resto del grupo';
  formatted = formatted
    .replace(/\{GRUPO\}/gi, groupLabel)
    .replace(/\{RESTO\}/gi, groupLabel);

  // Format single pair protagonist
  if (groupContext.pairs.length > 0) {
    const p1 = groupContext.pairs[0];
    const pairTitle = p1.player1.name && p1.player2.name
      ? `${p1.player1.name} y ${p1.player2.name}`
      : `la Pareja 1`;
    formatted = formatted.replace(/\{PAREJA_ELEGIDA\}/gi, pairTitle);
  }

  // Format cross couples
  if (groupContext.pairs.length >= 2) {
    const jc1 = groupContext.pairs[0].player1;
    const jc2 = groupContext.pairs[1].player2;
    const jc1Label = jc1.name || (jc1.gender === 'female' ? 'Ella (♀️)' : jc1.gender === 'male' ? 'Él (♂️)' : 'Jugador 1');
    const jc2Label = jc2.name || (jc2.gender === 'female' ? 'Ella (♀️)' : jc2.gender === 'male' ? 'Él (♂️)' : 'Jugador 2');
    formatted = formatted
      .replace(/\{JUGADOR_CRUZADO_1\}/gi, jc1Label)
      .replace(/\{JUGADOR_CRUZADO_2\}/gi, jc2Label);
  }

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
  {
    id: 'mild_classic_11',
    text: '¿Qué cualidad o valor hace que alguien pase de gustarte físicamente a atraerte profundamente el alma?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_12',
    text: 'Pon tu mano sobre el pecho de {target} durante 15 segundos y sientan los latidos de su corazón en silencio mirándose a los ojos.',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'mild_classic_13',
    text: 'Si tuviéramos una conversación a las 3 de la mañana sin pantallas ni distracciones, ¿de qué te gustaría hablar con {target}?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_14',
    text: 'Toma las dos manos de {target}, míralo/a a los ojos y dile qué sensación o energía te despierta su presencia en este instante.',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'mild_classic_15',
    text: '¿Cuál ha sido el cumplido más significativo que te han hecho en tu vida y por qué se quedó grabado en ti?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_16',
    text: 'Cuéntale a {target} un recuerdo o sueño de tu vida que casi nadie conozca y que te haga sonreír.',
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
  {
    id: 'mild_romantic_11',
    text: '¿Qué significa para ti \'hacer clic\' con alguien? ¿Sientes que la química se construye o surge de inmediato?',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_12',
    text: 'Acaricia suavemente el dorso de la mano de {target} trazando círculos lentos mientras le dices qué te transmite su mirada.',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_13',
    text: '¿Cuál es tu lenguaje del amor predominante: palabras de afirmación, tiempo de calidad, caricias físicas, detalles o actos de servicio?',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_14',
    text: 'Apoya tu frente suavemente contra la de {target} por 10 segundos con los ojos cerrados respirando al mismo ritmo.',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_15',
    text: '¿Qué pequeño detalle diario hace que te sientas verdaderamente querido/a y valorado/a por alguien?',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_16',
    text: 'Acércate a {target} y susúrrale al oído qué fue lo más encantador que notaste de su risa o actitud hoy.',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_17',
    text: '¿Recuerdas alguna vez en la que una simple mirada te aceleró el pulso? Descríbele esa sensación a {target}.',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_18',
    text: 'Elige una canción imaginaria y baila pegadito/a con {target} durante 20 segundos abrazándole por la cintura o los hombros.',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_19',
    text: '¿Qué es lo más valiente o auténtico que has hecho o te gustaría hacer por amor?',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_20',
    text: 'Miren fijamente a los ojos de {target} durante 20 segundos sin hablar, dejando que solo la mirada exprese lo que sienten en el momento.',
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
  {
    id: 'spicy_romantic_9',
    text: '¿Qué tipo de caricia o beso es el que más rápido te eriza la piel y te hace suspirar?',
    level: 'spicy',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_10',
    text: 'Pasa la yema de tus dedos rozando el cuello de {target} desde la nuca hasta la clavícula muy lentamente.',
    level: 'spicy',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_11',
    text: '¿Qué detalle, actitud o perfume en alguien te resulta inmediatamente magnético e irresistible?',
    level: 'spicy',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_12',
    text: 'Susúrrale al oído a {target} una confesión íntima de lo que te gustaría decirle a solas al despedirse hoy.',
    level: 'spicy',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_13',
    text: '¿Prefieres los besos lentos y tiernos que van subiendo de intensidad o los besos apasionados e inesperados?',
    level: 'spicy',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_14',
    text: 'Tómale el mentón a {target} con delicadeza, acércate a un centímetro de sus labios por 5 segundos y dale un beso dulce en la comisura.',
    level: 'spicy',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_15',
    text: '¿Cuál es tu fantasía romántica más soñada para una velada o escapada de fin de semana con alguien especial?',
    level: 'spicy',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'spicy_romantic_16',
    text: 'Entrelaza tus dedos con los de {target} a la altura del pecho y dile una verdad honesta que te inspire su cercanía.',
    level: 'spicy',
    type: 'dare',
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

// DEDICATED CHALLENGES FOR 4, 6, 8 PLAYERS (COUPLES, QUARTETS & CROSS-COUPLES)
export const groupQuestions: Question[] = [
  // MILD GROUP / COUPLES CHALLENGES (Icebreakers, Complicity & Flirting)
  {
    id: 'group_mild_1',
    text: 'Duelo de miradas: {PAREJA_1} y {PAREJA_2} deben mirarse fijamente a los ojos con sus respectivas parejas durante 30 segundos sin reírse. La primera pareja en reírse debe confesar qué fue lo primero que le atrajo de su compañero/a.',
    level: 'mild',
    type: 'dare',
    category: 'classic',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_mild_2',
    text: 'Cumplidos cruzados: Cada integrante de {PAREJA_1} debe susurrarle al oído un cumplido sincero y coqueto a un integrante de {PAREJA_2}.',
    level: 'mild',
    type: 'dare',
    category: 'romantic',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_mild_3',
    text: '¿Quién conoce mejor a su pareja?: {PAREJA_1} y {PAREJA_2} deben escribir en secreto el placer culposo del otro. Revelen al unísono; la pareja con menos aciertos baila 15 segundos al centro.',
    level: 'mild',
    type: 'question',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_mild_4',
    text: 'Sincronía de baile lento: Todas las parejas se ponen de pie y bailan juntos un ritmo lento y sugerente durante 30 segundos mirándose fijamente.',
    level: 'mild',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_mild_5',
    text: 'Confesión cruzada en cuarteto: {PAREJA_1} formula una pregunta comprometedora a {PAREJA_2}. Si deciden no responder, ambos deben dar un abrazo cálido de 10 segundos al grupo.',
    level: 'mild',
    type: 'question',
    category: 'classic',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_mild_6',
    text: 'El abrazo grupal: Todos los participantes deben unirse en un abrazo grupal apretado durante 15 segundos y decir en voz alta una cualidad que admiran del cuarteto.',
    level: 'mild',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_mild_7',
    text: 'Caricia sincronizada: Los integrantes de {PAREJA_1} deben acariciar suavemente las manos de sus parejas durante 20 segundos mientras las demás parejas califican la ternura.',
    level: 'mild',
    type: 'dare',
    category: 'romantic',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_mild_8',
    text: 'Intercambio visual: Durante 20 segundos, intercambien de pareja con la mirada. Miren fijamente al integrante de la otra pareja con su mirada más seductora.',
    level: 'mild',
    type: 'dare',
    category: 'romantic',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_mild_9',
    text: 'Pregunta cruzada sincera: {P1_J1} le pregunta a alguien de {PAREJA_2}: "¿Qué detalle físico o de actitud te parece más atractivo en una cita?".',
    level: 'mild',
    type: 'question',
    category: 'classic',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_mild_10',
    text: 'Cadena de susurros: En círculo, cada jugador le susurra al oído al compañero de su derecha un deseo inocente y divertido para el resto de la velada.',
    level: 'mild',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
  },

  // SPICY GROUP / COUPLES CHALLENGES (Sensual Tension, Massages & Seduction)
  {
    id: 'group_spicy_1',
    text: 'Masaje cruzado: Un integrante de {PAREJA_1} debe darle un masaje en el cuello y hombros a un integrante de {PAREJA_2} durante 30 segundos, supervisado por todos.',
    level: 'spicy',
    type: 'dare',
    category: 'romantic',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_spicy_2',
    text: 'Beso sincronizado de parejas: {PAREJA_1} y {PAREJA_2} deben darse un beso apasionado de 15 segundos al mismo tiempo. Quien se detenga primero debe confesar un secreto sensual.',
    level: 'spicy',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_spicy_3',
    text: 'Intercambio de roces: Cada persona debe rozar suavemente los labios o la mejilla del integrante de la pareja contraria, sin tocar la boca, sintiendo la respiración por 10 segundos.',
    level: 'spicy',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_spicy_4',
    text: 'Confesión de fantasía en cuarteto: Cada pareja debe pactar en privado y confesar una fantasía atrevida o curiosidad que les gustaría probar en un ambiente de confianza.',
    level: 'spicy',
    type: 'question',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_spicy_5',
    text: 'Susurro caliente cruzado: Un integrante de {PAREJA_1} debe susurrarle al oído a alguien de {PAREJA_2} la frase más sugerente o atrevida que sea capaz de pronunciar sin sonrojarse.',
    level: 'spicy',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_spicy_6',
    text: 'Exploración a ciegas: Un integrante de {PAREJA_1} con los ojos cerrados debe tocar solo las manos y cuello de los demás e intentar adivinar a quién pertenece cada toque.',
    level: 'spicy',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_spicy_7',
    text: 'Trago sensual compartido: {PAREJA_1} y {PAREJA_2} beben un sorbo de trago con los brazos entrelazados de forma cruzada mirando fijamente a sus compañeros.',
    level: 'spicy',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_spicy_8',
    text: 'Mordidita de complicidad: Cada pareja decide quién le da una mordidita suave en el lóbulo de la oreja o el cuello a su respectivo compañero durante 5 segundos.',
    level: 'spicy',
    type: 'dare',
    category: 'romantic',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_spicy_9',
    text: 'Baile sugerente de parejas: {PAREJA_1} le baila de forma seductora y cercana a {PAREJA_2} durante 30 segundos con una canción elegida por el grupo.',
    level: 'spicy',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_spicy_10',
    text: 'Caricia encubierta: Durante toda la siguiente ronda, cada integrante debe mantener una mano sobre el muslo de su pareja o de la pareja asignada por el grupo.',
    level: 'spicy',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },

  // EXTREME GROUP / COUPLES CHALLENGES (No Limits, Deep Kisses & Daring Games)
  {
    id: 'group_extreme_1',
    text: 'Intercambio de besos cruzados: Con el consentimiento unánime del grupo, cada integrante de {PAREJA_1} le da un beso intenso en los labios a un integrante de {PAREJA_2} por 10 segundos.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_extreme_2',
    text: 'Subasta de prendas: Cada pareja debe acordar en 15 segundos cuál de sus dos integrantes se retira una prenda de ropa exterior (chaqueta, calzado, camisa o accesorio).',
    level: 'extreme',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_extreme_3',
    text: 'Cadena íntima de besos: Todos los participantes se sientan en círculo y se dan un beso suave en el cuello o la mejilla al de su derecha en ronda continua.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_extreme_4',
    text: 'Masaje directo sobre la piel: Un integrante de cada pareja debe recibir un masaje de espalda directo sobre la piel durante 40 segundos por parte de su pareja o la pareja contraria.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_extreme_5',
    text: 'Beso apasionado de 30 segundos: Ambas parejas deben entregarse al mismo tiempo a un beso profundo con lengua y manos libres durante 30 segundos ininterrumpidos.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_extreme_6',
    text: 'El recorrido prohibido: Cada persona debe pasar sus manos lentamente por el torso o las piernas del integrante de la otra pareja por 20 segundos.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_extreme_7',
    text: 'Posición favorita revelada: Cada pareja debe describir con absoluto detalle o demostrar por encima de la ropa la postura íntima que más disfrutan juntos.',
    level: 'extreme',
    type: 'question',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_extreme_8',
    text: 'Intercambio de prenda superior: Cada pareja intercambia una prenda superior entre sí o con la pareja opuesta y debe usarla durante las próximas 3 rondas.',
    level: 'extreme',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_extreme_9',
    text: 'Recorrido de labios: Cada pareja debe recorrer con sus labios o un hielo el cuello y pecho de su compañero desde la mandíbula hasta el abdomen por 25 segundos.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  {
    id: 'group_extreme_10',
    text: 'Pacto sin límites: Todo el grupo acuerda una acción atrevida consensuada para celebrar la ronda. Quien se niegue debe quitarse dos prendas de inmediato.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
  },
  // SPECIALIZED MULTI-MODE GROUP CHALLENGES (ALL VS 1, SINGLE PAIR & CROSS COUPLES)
  // MILD - All vs 1
  {
    id: 'group_mild_all_vs_one_1',
    text: '🎯 3 para 1 (Tribunal de preguntas): {PROTAGONISTA} está en el punto de mira. Cada uno de {GRUPO} le hace una pregunta sincera sobre sus gustos o amores, y debe responderlas todas sin dudar.',
    level: 'mild',
    type: 'question',
    category: 'classic',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'all_vs_one',
  },
  {
    id: 'group_mild_all_vs_one_2',
    text: '🎯 3 para 1 (Lluvia de cumplidos): {GRUPO} se turnan para decirle a {PROTAGONISTA} el piropo o cumplido más dulce y sincero sobre su sonrisa o su energía.',
    level: 'mild',
    type: 'dare',
    category: 'romantic',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'all_vs_one',
  },
  // MILD - Single Pair
  {
    id: 'group_mild_single_pair_1',
    text: '👑 Pareja Elegida (Duelo de miradas): {PAREJA_ELEGIDA} son los protagonistas exclusivos. Deben mirarse fijamente a los ojos a 5 cm de distancia por 20 segundos mientras los demás hacen muecas para hacerlos reír.',
    level: 'mild',
    type: 'dare',
    category: 'classic',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'single_pair',
  },
  {
    id: 'group_mild_single_pair_2',
    text: '👑 Pareja Elegida (Complicidad): {PAREJA_ELEGIDA} deben confesar ante el grupo qué apodo cariñoso o gesto especial comparten en privado.',
    level: 'mild',
    type: 'question',
    category: 'romantic',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'single_pair',
  },
  // MILD - Cross Couples
  {
    id: 'group_mild_cross_1',
    text: '🔀 Intercambio Cruzado: {JUGADOR_CRUZADO_1} y {JUGADOR_CRUZADO_2} cruzan miradas y se dicen mutuamente qué detalle o prenda del otro les llamó más la atención hoy.',
    level: 'mild',
    type: 'dare',
    category: 'romantic',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'cross_couples',
  },
  {
    id: 'group_mild_cross_2',
    text: '🔀 Intercambio Cruzado (Saludo coqueto): {JUGADOR_CRUZADO_1} y {JUGADOR_CRUZADO_2} deben inventar en 15 segundos un saludo secreto con manos y abrazo.',
    level: 'mild',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'cross_couples',
  },

  // SPICY - All vs 1
  {
    id: 'group_spicy_all_vs_one_1',
    text: '🎯 3 para 1 (Interrogatorio ardiente): {GRUPO} eligen en consenso una pregunta íntima y comprometedora para {PROTAGONISTA}. Si no responde en 15 segundos, paga castigo/shot.',
    level: 'spicy',
    type: 'question',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'all_vs_one',
  },
  {
    id: 'group_spicy_all_vs_one_2',
    text: '🎯 3 para 1 (Masaje en equipo): {GRUPO} le darán un masaje relajante y tentador a {PROTAGONISTA} durante 30 segundos (hombros, cuello o manos) con los ojos cerrados.',
    level: 'spicy',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'all_vs_one',
  },
  // SPICY - Single Pair
  {
    id: 'group_spicy_single_pair_1',
    text: '👑 Pareja Elegida (Show de beso): {PAREJA_ELEGIDA} deben darse un beso apasionado de 15 segundos al centro del grupo, mientras el resto califica la química del 1 al 10.',
    level: 'spicy',
    type: 'dare',
    category: 'romantic',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'single_pair',
  },
  {
    id: 'group_spicy_single_pair_2',
    text: '👑 Pareja Elegida (Susurro secreto): Un integrante de {PAREJA_ELEGIDA} le susurra una fantasía secreta al otro. El resto del grupo debe adivinar de qué nivel de picardía se trataba.',
    level: 'spicy',
    type: 'question',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'single_pair',
  },
  // SPICY - Cross Couples
  {
    id: 'group_spicy_cross_1',
    text: '🔀 Intercambio Cruzado: {JUGADOR_CRUZADO_1} debe susurrarle al oído a {JUGADOR_CRUZADO_2} la frase más seductora que se le ocurra sin que sus compañeros se pongan celosos.',
    level: 'spicy',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'cross_couples',
  },
  {
    id: 'group_spicy_cross_2',
    text: '🔀 Intercambio Cruzado (Baile de tensión): {JUGADOR_CRUZADO_1} y {JUGADOR_CRUZADO_2} deben bailar 20 segundos pegados mirándose a los ojos bajo la supervisión de sus parejas.',
    level: 'spicy',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'cross_couples',
  },

  // EXTREME - All vs 1
  {
    id: 'group_extreme_all_vs_one_1',
    text: '🎯 3 para 1 (Ronda de caricias a ciegas): {PROTAGONISTA} cierra los ojos por 30 segundos y {GRUPO} le dan caricias suaves en el rostro, cuello o brazos. Debe adivinar quién le dio cada toque.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'all_vs_one',
  },
  {
    id: 'group_extreme_all_vs_one_2',
    text: '🎯 3 para 1 (Juicio grupal): {GRUPO} se reúnen en privado y le imponen un reto atrevido y consensuado a {PROTAGONISTA}. ¡Si se niega, paga doble shot o penitencia!',
    level: 'extreme',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'all_vs_one',
  },
  // EXTREME - Single Pair
  {
    id: 'group_extreme_single_pair_1',
    text: '👑 Pareja Elegida (Beso sin censura): {PAREJA_ELEGIDA} deben demostrarle al grupo su beso más apasionado durante 30 segundos ininterrumpidos con manos libres.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'single_pair',
  },
  {
    id: 'group_extreme_single_pair_2',
    text: '👑 Pareja Elegida (Retiro de prenda): {PAREJA_ELEGIDA} deben quitarse mutuamente una prenda de ropa exterior con los dientes o con una sola mano frente al grupo.',
    level: 'extreme',
    type: 'dare',
    category: 'party',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'single_pair',
  },
  // EXTREME - Cross Couples
  {
    id: 'group_extreme_cross_1',
    text: '🔀 Intercambio Cruzado: Con consentimiento de todos, {JUGADOR_CRUZADO_1} y {JUGADOR_CRUZADO_2} se dan un beso atrevido de 10 segundos ante las miradas de sus parejas.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'cross_couples',
  },
  {
    id: 'group_extreme_cross_2',
    text: '🔀 Intercambio Cruzado (Recorrido prohibido): {JUGADOR_CRUZADO_1} pasa sus manos por el torso o cintura de {JUGADOR_CRUZADO_2} durante 20 segundos sintiendo la respiración del otro.',
    level: 'extreme',
    type: 'dare',
    category: 'nsfw',
    minPlayers: 4,
    groupOnly: true,
    groupMode: 'cross_couples',
  },
];

export const getQuestionsByLevel = (
  level: IntensityLevel,
  categories?: QuestionCategory[],
  isGroup?: boolean,
  groupMode?: 'couples' | 'cross_couples' | 'group' | 'all_vs_one' | 'single_pair' | 'trio_vs_one'
): Question[] => {
  const sourceList = isGroup ? [...groupQuestions, ...questions] : questions;
  let filtered = sourceList.filter(q => q.level === level);

  if (isGroup) {
    if (groupMode) {
      // Prioritize questions matching this exact group mode
      const modeSpecific = filtered.filter(q => q.groupMode === groupMode);
      if (modeSpecific.length > 0) {
        filtered = modeSpecific;
      } else {
        const onlyGroup = filtered.filter(q => q.groupOnly);
        if (onlyGroup.length > 0) {
          filtered = onlyGroup;
        }
      }
    } else {
      // When in group mode, prioritize group-specific challenges
      const onlyGroup = filtered.filter(q => q.groupOnly);
      if (onlyGroup.length > 0) {
        filtered = onlyGroup;
      }
    }
  } else {
    // When playing in normal 2-player mode, exclude groupOnly questions
    filtered = filtered.filter(q => !q.groupOnly);
  }

  if (categories && categories.length > 0) {
    const byCategory = filtered.filter(q => categories.includes(q.category));
    if (byCategory.length > 0) {
      filtered = byCategory;
    }
  }
  return filtered;
};

export const getRandomQuestion = (
  level: IntensityLevel,
  categories?: QuestionCategory[],
  usedQuestionIds?: string[],
  isGroup?: boolean,
  groupMode?: 'couples' | 'cross_couples' | 'group' | 'all_vs_one' | 'single_pair' | 'trio_vs_one'
): Question => {
  let levelQuestions = getQuestionsByLevel(level, categories, isGroup, groupMode);

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
