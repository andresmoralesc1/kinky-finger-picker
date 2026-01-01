import { Question, IntensityLevel, QuestionCategory } from '../types';

export const questions: Question[] = [
  // MILD LEVEL - CLASSIC
  {
    id: 'mild_classic_1',
    text: 'Tell the group about your first kiss',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_2',
    text: 'Give a compliment to the person on your right',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'mild_classic_3',
    text: 'What is your biggest turn-on?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_4',
    text: 'Whisper something flirty to the person on your left',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'mild_classic_5',
    text: 'What was your most embarrassing romantic moment?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_6',
    text: 'Make eye contact with someone for 10 seconds without laughing',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'mild_classic_7',
    text: 'Describe your ideal date night',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_8',
    text: 'Give someone a 5-second shoulder massage',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },
  {
    id: 'mild_classic_9',
    text: 'What physical feature do you notice first in someone?',
    level: 'mild',
    type: 'question',
    category: 'classic'
  },
  {
    id: 'mild_classic_10',
    text: 'Blow a kiss to the person across from you',
    level: 'mild',
    type: 'dare',
    category: 'classic'
  },

  // MILD LEVEL - ROMANTIC
  {
    id: 'mild_romantic_1',
    text: 'What song reminds you of your first love?',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_2',
    text: 'Tell someone here what you find attractive about them',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_3',
    text: 'What is the most romantic thing someone has done for you?',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_4',
    text: 'Hold hands with someone for the next round',
    level: 'mild',
    type: 'dare',
    category: 'romantic'
  },
  {
    id: 'mild_romantic_5',
    text: 'Describe your perfect romantic evening',
    level: 'mild',
    type: 'question',
    category: 'romantic'
  },

  // MILD LEVEL - PARTY
  {
    id: 'mild_party_1',
    text: 'Do your best sexy dance move',
    level: 'mild',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'mild_party_2',
    text: 'What is the wildest party you have been to?',
    level: 'mild',
    type: 'question',
    category: 'party'
  },
  {
    id: 'mild_party_3',
    text: 'Tell a flirty joke to the group',
    level: 'mild',
    type: 'dare',
    category: 'party'
  },
  {
    id: 'mild_party_4',
    text: 'Have you ever made out at a party? Tell the story',
    level: 'mild',
    type: 'question',
    category: 'party'
  },
  {
    id: 'mild_party_5',
    text: 'Wink at everyone in the group',
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
