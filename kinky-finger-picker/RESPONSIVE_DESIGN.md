# Responsive Design Guide

This document explains the responsive design system implemented in Kinky Finger Picker.

## Overview

The app adapts to different:
- **Device sizes:** Phone, Tablet, Desktop
- **Orientations:** Portrait, Landscape
- **Screen densities:** 1x, 2x, 3x

---

## Breakpoints

```typescript
BREAKPOINTS = {
  PHONE_SMALL: 320,   // iPhone SE
  PHONE: 375,         // iPhone 11 Pro (base reference)
  PHONE_LARGE: 414,   // iPhone 11 Pro Max
  TABLET_SMALL: 600,  // Small tablets
  TABLET: 768,        // iPad
  TABLET_LARGE: 1024, // iPad Pro
  DESKTOP: 1280,      // Desktop/large displays
}
```

---

## Device Types

### Phone (< 600pt)
- Single column layout
- Full-width buttons
- Compact spacing
- Portrait-optimized

### Tablet (600pt - 1280pt)
- 2-3 column layouts
- Larger touch targets
- Increased spacing
- Works in both orientations

### Desktop (> 1280pt)
- Multi-column layouts
- Max-width containers
- Grid-based design
- Keyboard shortcuts

---

## Responsive Utilities

### 1. Responsive Hook

```tsx
import { useResponsive } from '../hooks/useResponsive';

function MyComponent() {
  const {
    deviceType,      // 'phone' | 'tablet' | 'desktop'
    orientation,     // 'portrait' | 'landscape'
    isTablet,        // boolean
    isLandscape,     // boolean
    wp,              // Width percentage
    hp,              // Height percentage
    fontSize,        // Responsive font size
  } = useResponsive();

  return (
    <View style={{ padding: isTablet ? 40 : 20 }}>
      <Text style={{ fontSize: fontSize(16) }}>
        Hello from {deviceType}
      </Text>
    </View>
  );
}
```

### 2. Responsive Container

```tsx
import ResponsiveContainer from '../components/ResponsiveContainer';

<ResponsiveContainer
  maxWidth={800}
  centered
  phoneStyle={{ padding: 16 }}
  tabletStyle={{ padding: 40 }}
  landscapeStyle={{ flexDirection: 'row' }}
>
  <Content />
</ResponsiveContainer>
```

### 3. Responsive Styles

```tsx
import { createResponsiveStyle } from '../utils/responsive';

const styles = StyleSheet.create({
  button: createResponsiveStyle(
    // Phone
    {
      height: 56,
      paddingHorizontal: 16,
      fontSize: 16,
    },
    // Tablet
    {
      height: 64,
      paddingHorizontal: 24,
      fontSize: 18,
    },
    // Desktop
    {
      height: 72,
      paddingHorizontal: 32,
      fontSize: 20,
    }
  ),
});
```

---

## Scaling Functions

### Width Percentage (wp)

Scale based on screen width relative to iPhone 11 Pro (375pt):

```tsx
// On iPhone 11 Pro (375pt):
wp(100) // Returns 100

// On iPad (768pt):
wp(100) // Returns ~205

// Usage:
<View style={{ width: wp(200) }} />
```

### Height Percentage (hp)

Scale based on screen height relative to iPhone 11 Pro (812pt):

```tsx
// Usage:
<View style={{ height: hp(400) }} />
```

### Font Size

Automatically scales fonts based on device:

```tsx
const { fontSize } = useResponsive();

// Phone: 16
// Tablet: ~24
// Desktop: ~32
<Text style={{ fontSize: fontSize(16) }}>
  Scaled text
</Text>
```

---

## Orientation Handling

### Detect Orientation

```tsx
const { orientation, isLandscape } = useResponsive();

if (isLandscape) {
  // Show landscape layout
}
```

### Landscape Layouts

```tsx
<ResponsiveContainer
  portraitStyle={{
    flexDirection: 'column',
  }}
  landscapeStyle={{
    flexDirection: 'row',
    justifyContent: 'space-between',
  }}
>
  <Content />
</ResponsiveContainer>
```

---

## Grid Layouts

### Dynamic Columns

```tsx
import { Responsive } from '../utils/responsive';

const columns = Responsive.getColumns();
// Phone: 1
// Tablet portrait: 2
// Tablet landscape: 3
// Desktop: 4

<FlatList
  data={items}
  numColumns={columns}
  key={columns} // Important: re-render when columns change
  renderItem={renderItem}
/>
```

---

## Button Sizes

### Responsive Buttons

```tsx
import { getButtonSize } from '../utils/responsive';

const buttonSize = getButtonSize();
// Phone: { height: 56, minWidth: 120, padding: 16 }
// Tablet: { height: 64, minWidth: 160, padding: 24 }
// Desktop: { height: 72, minWidth: 200, padding: 32 }

<TouchableOpacity style={{
  height: buttonSize.height,
  minWidth: buttonSize.minWidth,
  padding: buttonSize.padding,
}}>
  <Text>Button</Text>
</TouchableOpacity>
```

---

## Safe Areas

### Handle Notches & Navigation Bars

```tsx
import { Responsive } from '../utils/responsive';

const insets = Responsive.getSafeAreaInsets();
// { top: 44, bottom: 34, left: 0, right: 0 }

<View style={{
  paddingTop: insets.top,
  paddingBottom: insets.bottom,
}}>
  <Content />
</View>
```

---

## Examples

### Example 1: Responsive Card Grid

```tsx
function CardGrid() {
  const { isTablet, wp } = useResponsive();
  const columns = isTablet ? 3 : 1;
  const cardWidth = isTablet ? wp(30) : wp(90);

  return (
    <FlatList
      data={items}
      numColumns={columns}
      renderItem={() => (
        <View style={{ width: cardWidth }}>
          <Card />
        </View>
      )}
    />
  );
}
```

### Example 2: Adaptive Navigation

```tsx
function Navigation() {
  const { isTablet, isLandscape } = useResponsive();

  if (isTablet || isLandscape) {
    return <HorizontalNav />; // Show tabs
  }

  return <VerticalNav />; // Show menu
}
```

### Example 3: Modal Sizing

```tsx
function ResponsiveModal() {
  const { isTablet, wp, hp } = useResponsive();

  return (
    <Modal>
      <View style={{
        width: isTablet ? wp(60) : wp(90),
        height: isTablet ? hp(70) : hp(80),
      }}>
        <Content />
      </View>
    </Modal>
  );
}
```

---

## Testing Different Sizes

### iOS Simulator
- iPhone SE (320x568)
- iPhone 11 Pro (375x812)
- iPhone 11 Pro Max (414x896)
- iPad (768x1024)
- iPad Pro 12.9" (1024x1366)

### Android Emulator
- Nexus 5 (360x640)
- Pixel 4 (411x869)
- Nexus 9 (768x1024)
- Pixel C (900x1280)

### Expo
```bash
# Test on device
npm start
# Scan QR code

# Test in browser (limited)
npm run web
# Resize browser window to test breakpoints
```

---

## Best Practices

### DO:
✅ Use `wp`/`hp` for consistent scaling
✅ Test on multiple device sizes
✅ Handle orientation changes
✅ Use `getColumns()` for grids
✅ Implement safe area insets
✅ Test landscape mode

### DON'T:
❌ Hardcode pixel values
❌ Ignore tablet layouts
❌ Forget landscape orientation
❌ Use fixed heights for content
❌ Assume screen size
❌ Ignore safe areas

---

## Responsive Checklist

Before release:

- [ ] Tested on iPhone SE (small phone)
- [ ] Tested on iPhone 11 Pro (standard phone)
- [ ] Tested on iPhone 11 Pro Max (large phone)
- [ ] Tested on iPad (standard tablet)
- [ ] Tested on iPad Pro (large tablet)
- [ ] Landscape mode works on all devices
- [ ] Portrait mode works on all devices
- [ ] Text is readable on all sizes
- [ ] Buttons are tappable on all sizes
- [ ] Images scale correctly
- [ ] Spacing is appropriate
- [ ] No content cutoff
- [ ] Safe areas respected
