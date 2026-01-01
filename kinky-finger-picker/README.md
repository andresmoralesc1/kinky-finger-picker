# Kinky Finger Picker 🌶️

A multiplayer party game that combines random finger selection with truth-or-dare style challenges, now with ADVANCED features! Perfect for breaking the ice and heating things up at parties!

## 🎉 What's New - Phase 1 UX/UI Overhaul Complete!

### 🚀 NEW! Quick Start Features
- **🚀 Quick Play Button** - Jump straight into the game with one tap! (Defaults to Hetero + Mild)
- **🎓 Learning by Doing Onboarding** - Play a real 30-second round instead of reading boring tutorials
- **📱 Social Sharing** - Share epic moments with beautiful screenshot cards featuring stats & branding

### ✨ Enhanced Micro-Interactions
- **💫 Ripple Effects** - Touch feedback with expanding ripples at every finger placement
- **🎯 Roulette Animation** - Suspenseful player cycling before final selection reveal
- **✨ Bounce Animations** - Tactile bounce effects on UI elements
- **🌟 Glow Effects** - Pulsing glow on important buttons and indicators
- **🎪 Pulsing Circles** - Animated pulses while waiting for countdown

### ✨ Core Gameplay Enhancements
- **🎵 Sound System** - Sound effects for all interactions + background music support
- **✨ Advanced Animations** - Confetti, spotlight effects, smooth transitions
- **⏱️ Dare Timer** - Configurable countdown timer adds pressure and excitement
- **🚫 Skip/Pass System** - Limited skips per player (3 by default, configurable)
- **📊 Real-time Statistics** - Track who's selected most, completion rates, and more
- **🎭 Question Categories** - Classic, Romantic, Party, and NSFW categories

### 🎨 Screens & Features
- **📖 Interactive Onboarding** - First-time users play a real round to learn
- **⚙️ Settings Menu** - Full customization:
  - Sound & music toggles
  - Haptic feedback control
  - Skip limit configuration
  - Timer duration settings
  - Category selection
  - Anti-repetition mode
- **📈 Statistics Dashboard** - View:
  - Total rounds played
  - Player rankings
  - Level distribution
  - Category distribution
  - Most selected player (MVP)
- **✏️ Custom Questions** - Create, manage, and delete your own questions/dares

### 🎮 Gameplay Improvements
- **Anti-Repetition System** - Avoid asking the same questions
- **Player History Tracking** - See who's been selected how many times
- **Skip Penalties** - Limited skips prevent abuse
- **Level Progression** - Change intensity mid-game
- **60+ Questions** - Expanded from 30 to 60+ questions across all categories

## Features

### Game Modes
- **Hetero Mode** 🔥 - Split screen layout (♀️ left | ♂️ right)
- **Gay Mode** 🌈 - Full screen mode
- **Lesbian Mode** 💖 - Full screen mode

### Intensity Levels
- **Mild 🌶️** - Flirty & playful
- **Spicy 🌶️🌶️** - Getting hot
- **Extreme 🌶️🌶️🌶️** - No limits! (18+)

### Question Categories
- **Classic** - General party questions
- **Romantic** - For couples and romantics
- **Party** - Wild party dares
- **NSFW** - Explicit adult content
- **Custom** - Your own creations!

## How to Play

### 🚀 Fastest Start: Quick Play
1. **Tap "🚀 QUICK PLAY"** on home screen
2. **Start playing immediately!** (Hetero + Mild mode)
3. No menus, no choices - just instant fun!

### 🎓 First Time Experience
1. **Interactive Onboarding** - Play a real 30-second round to learn
   - Touch the screen → See countdown → Get selected → Answer question
   - Learning by doing - no boring text tutorials!
2. **Home Screen** appears with Quick Play, Mode Selection, Settings, and Stats
3. **Choose your path**:
   - Quick Play for instant action
   - Or customize with Mode + Intensity selection

### 🎮 Full Setup (If You Want to Customize)
1. **Select Mode** - Hetero 🔥, Gay 🌈, or Lesbian 💖
2. **Pick Intensity** - Mild 🌶️, Spicy 🌶️🌶️, or Extreme 🌶️🌶️🌶️
3. **Configure Settings** (optional) - Adjust sound, timer, categories, etc.
4. **Start Playing!**

### 🎯 Gameplay Loop
1. All players place **one finger** on the screen
   - **Ripple effects** appear at each touch point
   - Colorful circles indicate player positions
2. **3-second countdown** with haptic feedback and bounce animation
3. **Roulette animation** cycles through players (building suspense!)
4. One player is **randomly selected** with spotlight + confetti
5. Selected player sees their **question/dare** with color-coded card
6. **Optional**: Start the timer for added pressure
7. **Complete** the dare or **Skip** (limited - 3 skips default)
8. **Share** your moment with friends via screenshot
9. Stats auto-update - see MVP, rankings, distribution
10. **Next round** - repeat!

### 💡 Pro Tips
- 🚀 Use **Quick Play** to skip all menus and start instantly
- 📱 **Share epic moments** - tap the share button on question screen
- 💡 Enable **anti-repetition mode** to avoid duplicate questions
- ⚙️ Adjust **skip limits** based on group comfort (0-10)
- ⏱️ Configure **timer duration** for perfect pressure (15-300s)
- 📊 Check **stats** to see who's the unluckiest player (MVP)
- ✏️ Add **custom questions** for personalized experiences
- 🎨 Watch the **roulette animation** build suspense before reveals
- 🌟 Notice the **glow effects** on level indicators - tap to change mid-game

## Installation & Setup

### Prerequisites
- Node.js 16+ installed
- Expo Go app on your phone (iOS or Android)

### Quick Start

```bash
# Navigate to project directory
cd kinky-finger-picker

# Install dependencies (if not done)
npm install

# Start development server
npm start
```

### Running the App

**Option 1: On Your Phone (Recommended)**
1. Run `npm start`
2. Scan QR code with:
   - **iOS**: Camera app → Opens in Expo Go
   - **Android**: Expo Go app → Scan QR
3. Game loads on your device!

**Option 2: Simulators**
```bash
# iOS Simulator (Mac only)
npm run ios

# Android Emulator
npm run android

# Web Browser (limited touch support)
npm run web
```

## Tech Stack

- **React Native + Expo** - Cross-platform framework
- **TypeScript** - Type safety
- **expo-av** - Audio support
- **expo-haptics** - Vibration feedback
- **expo-linear-gradient** - Beautiful gradients
- **expo-sharing** - Social sharing functionality
- **react-native-view-shot** - Screenshot capture for sharing
- **react-native-gesture-handler** - Multi-touch detection
- **react-native-reanimated** - Smooth animations
- **@react-native-async-storage** - Data persistence

## Project Structure

```
kinky-finger-picker/
├── src/
│   ├── components/
│   │   ├── ConfettiEffect.tsx          # Confetti animation
│   │   ├── SpotlightEffect.tsx         # Winner spotlight
│   │   ├── PulsingCircle.tsx           # Pulsing finger indicators
│   │   ├── RippleEffect.tsx            # NEW! Touch ripple animation
│   │   ├── BounceAnimation.tsx         # NEW! Bounce effect wrapper
│   │   ├── GlowEffect.tsx              # NEW! Pulsing glow wrapper
│   │   ├── RouletteAnimation.tsx       # NEW! Player selection roulette
│   │   └── ShareCard.tsx               # NEW! Social sharing screenshot
│   ├── screens/
│   │   ├── InteractiveOnboardingScreen.tsx  # NEW! Learning by doing tutorial
│   │   ├── ModeSelectionScreen.tsx          # Game mode + Quick Play
│   │   ├── LevelSelectionScreen.tsx         # Intensity selection
│   │   ├── ImprovedGameScreen.tsx           # NEW! Enhanced finger picker
│   │   ├── ImprovedQuestionScreen.tsx       # Question/dare with sharing
│   │   ├── SettingsScreen.tsx               # Full settings menu
│   │   ├── StatsScreen.tsx                  # Statistics dashboard
│   │   └── CustomQuestionsScreen.tsx        # Manage custom questions
│   ├── data/
│   │   └── questions.ts                # 60+ questions database
│   ├── types/
│   │   └── index.ts                    # TypeScript types
│   └── utils/
│       ├── colors.ts                   # Color palette
│       ├── sounds.ts                   # Sound manager
│       └── storage.ts                  # AsyncStorage service
├── App.tsx                             # Main app orchestrator
└── package.json
```

## Customization Guide

### Add Your Own Questions

1. **Via App**: Tap ⚙️ → "Manage Custom Questions"
2. **Via Code**: Edit `/src/data/questions.ts`:

```typescript
{
  id: 'my_custom_1',
  text: 'Your question or dare here',
  level: 'mild' | 'spicy' | 'extreme',
  type: 'question' | 'dare',
  category: 'custom'
}
```

### Customize Settings

Access ⚙️ Settings to configure:
- **Audio**: Sound effects, music, haptics
- **Gameplay**: Skip limits (0-10), timer duration (15-300s)
- **Categories**: Enable/disable question categories
- **Advanced**: Anti-repetition, tutorial reset

### Change Visual Theme

Edit `/src/utils/colors.ts`:
```typescript
export const PLAYER_COLORS = [
  '#FF006E',  // Your custom colors
  '#YOUR_COLOR_HERE',
];
```

### Adjust Animations

Modify animation components in `/src/components/`:
- `ConfettiEffect.tsx` - Particle count, colors, duration
- `SpotlightEffect.tsx` - Spotlight size, opacity
- `PulsingCircle.tsx` - Pulse speed, scale
- **NEW!** `RippleEffect.tsx` - Ripple expansion speed, opacity fade
- **NEW!** `BounceAnimation.tsx` - Bounce scale, duration
- **NEW!** `GlowEffect.tsx` - Glow intensity, pulse speed
- **NEW!** `RouletteAnimation.tsx` - Roulette speed, iterations count

## 📱 Social Sharing

Share your epic game moments with friends! The app now includes a beautiful screenshot sharing system.

### How to Share
1. After a player is selected and sees their question/dare
2. Tap the **"📱 Share"** button on the question screen
3. A screenshot is automatically captured with:
   - Player color and number
   - Current intensity level (Mild/Spicy/Extreme)
   - Question/dare text
   - "Kinky Finger Picker" branding
   - Clean, shareable design
4. Choose where to share: Instagram, Twitter, WhatsApp, Messages, etc.

### What Gets Shared
The ShareCard component creates a beautifully formatted screenshot featuring:
- **Player Info** - "Player 1" with their assigned color
- **Level Badge** - Visual indicator of intensity level
- **Question/Dare** - The actual challenge
- **Branding** - App name and tagline at the bottom
- **Clean Design** - Black background with vibrant accents

### Privacy Note
Screenshots are generated locally on your device and shared through your phone's native sharing menu. No data is sent to external servers.

## Statistics Explained

### Session Overview
- **Total Rounds** - Questions/dares completed this session
- **Players** - Number of unique players detected

### Intensity Levels
- Bar chart showing distribution: Mild / Spicy / Extreme

### Categories
- Breakdown of question types played

### Player Rankings
- **👑 Most Selected** - Unluckiest player
- **Completed vs Skipped** - Performance metrics
- **Color-coded** - Easy player identification

## Publishing

### To Expo
```bash
npx expo login
npx expo publish
```

### To App Stores
```bash
# Install EAS CLI
npm install -g eas-cli

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## FAQ

**Q: Can I disable the timer?**
A: Yes! Just don't press "Start Timer" or set duration to max in settings.

**Q: What if all questions are used?**
A: System auto-resets when all questions in current level/category are exhausted.

**Q: Can I export my custom questions?**
A: Currently stored locally. Export feature coming in v2.0!

**Q: Is there a single-player mode?**
A: Minimum 2 fingers required. Play solo by using both hands!

**Q: Can I add images to questions?**
A: Not yet, but it's on the roadmap!

## Roadmap

### ✅ Phase 1: Quick Start & Micro-Interactions (COMPLETED!)
- [x] **Interactive Onboarding** - Learning by doing
- [x] **Quick Play Button** - Instant game start
- [x] **Social Sharing** - Screenshot-based sharing
- [x] **Micro-Interactions** - Ripple, bounce, glow effects
- [x] **Roulette Animation** - Suspenseful player selection

### 📋 Phase 2: Engagement & Gamification (Planned)
- [ ] **Achievements System** - Unlock badges for milestones
  - "First Blood", "Party Animal", "Dare Devil", etc.
  - Visual achievement cards
  - Progress tracking
- [ ] **Daily Challenges** - Special limited-time dares
  - Rotating daily content
  - Bonus points for completion
- [ ] **Visual Themes** - Customizable color schemes
  - Neon, Pastel, Dark Mode variants
  - Theme unlocks via achievements

### 🚀 Phase 3: Polish & Accessibility (Future)
- [ ] **Player Profiles** - Save player names & stats
- [ ] **Accessibility Features** - Color-blind modes, larger text
- [ ] **Sound Effects Variety** - More diverse audio feedback
- [ ] **Haptic Patterns** - Rich vibration feedback

### 🔮 Beyond v2.0
- [ ] Background music track selection
- [ ] Image support for custom questions
- [ ] Export/Import question packs
- [ ] Multiplayer over WiFi
- [ ] Drinking game integration mode
- [ ] Video dare recording & sharing
- [ ] AR mode with face tracking

## Warnings

⚠️ **18+ ADULT CONTENT**
- Contains explicit sexual content in higher levels
- Intended for consenting adults only
- Not suitable for minors
- Play responsibly and respect boundaries

## License

MIT - Feel free to fork, modify, and use for your parties!

## Credits

Created with ❤️ for unforgettable parties

**Technologies**:
- React Native & Expo
- Claude Sonnet 4.5 (AI Assistant)

## Support

Found a bug? Want a feature?
- Open an issue on GitHub
- DM @neuralflow on social media

---

## Remember: Consent is Sexy!

This is a game designed for fun between consenting adults. Always:
- ✅ Respect boundaries
- ✅ Allow skips without judgment
- ✅ Keep it fun for everyone
- ✅ Stop if anyone is uncomfortable

**Have fun and play safe! 🎉🌶️**
