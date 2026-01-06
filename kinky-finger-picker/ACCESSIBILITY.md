# Accessibility Guide

This document describes the accessibility features implemented in Kinky Finger Picker.

## Overview

The app implements WCAG 2.1 Level AA accessibility standards, ensuring usability for users with:
- **Visual impairments** (screen readers, color blindness)
- **Motor impairments** (larger touch targets, reduced motion)
- **Cognitive impairments** (clear labels, consistent navigation)

---

## Features Implemented

### 1. Screen Reader Support

**Components:**
- `AccessibleTouchable` - Enhanced TouchableOpacity with full accessibility props
- All buttons have descriptive `accessibilityLabel` and `accessibilityHint`

**Usage:**
```tsx
import AccessibleTouchable from '../components/AccessibleTouchable';

<AccessibleTouchable
  accessibilityLabel="Quick Play button"
  accessibilityHint="Start a game immediately with default settings"
  onPress={handleQuickPlay}
  announceOnPress="Starting game in Quick Play mode"
>
  <Text>Quick Play</Text>
</AccessibleTouchable>
```

**Utility Functions:**
```ts
// Announce to screen reader
AccessibilityService.announce('Player 1 has been selected!');

// Check if screen reader is enabled
const enabled = AccessibilityService.isScreenReaderEnabled();
```

---

### 2. Color Blindness Support

**Features:**
- High contrast colors (4.5:1 minimum ratio)
- Alternative color schemes for different types of color blindness
- Pattern/texture differentiation in addition to color

**Color Schemes:**
```ts
import { ColorBlindness } from '../utils/accessibility';

// Get accessible colors for protanopia
const colors = ColorBlindness.getAccessibleColors('#FF006E');
// Returns: { normal: '#FF006E', protanopia: '#D4A017', ... }

// Check contrast ratio
const hasGoodContrast = ColorBlindness.hasGoodContrast('#FFFFFF', '#000000');
// Returns: true (21:1 ratio)
```

**Supported Types:**
- **Protanopia** (red-blind) - 1% of males
- **Deuteranopia** (green-blind) - 1% of males
- **Tritanopia** (blue-blind) - 0.01% of population

---

### 3. Accessible Labels

All interactive elements have:
- **accessibilityLabel** - Describes what the element is
- **accessibilityHint** - Describes what happens when activated
- **accessibilityRole** - Defines the element type (button, link, etc.)

**Label Generator:**
```ts
import { generateAccessibilityLabel } from '../utils/accessibility';

const label = generateAccessibilityLabel('quickPlay');
// Returns: "Quick Play button. Start a game immediately with default settings..."
```

---

### 4. Touch Target Sizes

All interactive elements meet minimum touch target size:
- **Minimum:** 44x44 points (iOS) / 48x48 dp (Android)
- **Recommended:** 56x56 for primary actions

---

### 5. Keyboard Navigation

- Tab order follows visual flow
- Focus indicators visible
- Skip links for long lists

---

## Hooks

### useAccessibility

Hook to access accessibility features:

```tsx
import { useAccessibility } from '../hooks/useAccessibility';

function MyComponent() {
  const { isScreenReaderEnabled, announce } = useAccessibility();

  const handleAction = () => {
    announce('Action completed successfully');
  };

  return (
    <View>
      {isScreenReaderEnabled && <ExtraContextInfo />}
    </View>
  );
}
```

---

## Testing Accessibility

### iOS

1. Enable VoiceOver:
   - Settings → Accessibility → VoiceOver → On
   - Triple-click home/side button to toggle

2. Test navigation:
   - Swipe right: Next element
   - Swipe left: Previous element
   - Double tap: Activate element

### Android

1. Enable TalkBack:
   - Settings → Accessibility → TalkBack → On
   - Volume keys to toggle

2. Test navigation:
   - Swipe right: Next element
   - Swipe left: Previous element
   - Double tap: Activate element

---

## Best Practices

### DO:
✅ Provide descriptive labels for all interactive elements
✅ Use semantic HTML/components
✅ Ensure 4.5:1 contrast ratio minimum
✅ Make touch targets at least 44x44
✅ Test with actual screen readers
✅ Announce dynamic content changes

### DON'T:
❌ Use color alone to convey information
❌ Create touch targets smaller than 44x44
❌ Nest interactive elements
❌ Use vague labels like "Click here"
❌ Disable accessibility features
❌ Rely on emojis alone for meaning

---

## Examples

### Accessible Button

```tsx
<AccessibleTouchable
  accessibilityRole="button"
  accessibilityLabel="Start game in Hetero mode"
  accessibilityHint="Double tap to begin playing with split screen layout"
  onPress={startGame}
  style={styles.button}
>
  <Text>Hetero Mode</Text>
</AccessibleTouchable>
```

### Accessible Form

```tsx
<View accessible={true} accessibilityLabel="Game settings form">
  <Text accessibilityRole="header">Settings</Text>

  <AccessibleTouchable
    accessibilityLabel="Sound effects toggle, currently enabled"
    accessibilityHint="Double tap to toggle sound effects"
    onPress={toggleSound}
  >
    <Text>Sound: {soundEnabled ? 'On' : 'Off'}</Text>
  </AccessibleTouchable>
</View>
```

### Accessible List

```tsx
<FlatList
  data={questions}
  accessible={true}
  accessibilityLabel={`${questions.length} questions available`}
  renderItem={({ item, index }) => (
    <AccessibleTouchable
      accessibilityLabel={`Question ${index + 1}: ${item.text}`}
      accessibilityHint="Double tap to select this question"
      onPress={() => selectQuestion(item)}
    >
      <Text>{item.text}</Text>
    </AccessibleTouchable>
  )}
/>
```

---

## Resources

- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [iOS Accessibility](https://developer.apple.com/accessibility/)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)

---

## Accessibility Checklist

Before release, ensure:

- [ ] All images have alt text
- [ ] All buttons have labels and hints
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Touch targets are 44x44 minimum
- [ ] Screen reader tested on iOS
- [ ] Screen reader tested on Android
- [ ] Keyboard navigation works
- [ ] Forms have clear labels
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Success messages are announced
