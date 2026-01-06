# 🚀 Deployment Guide - Kinky Finger Picker

Complete guide to deploy your app to Expo, iOS App Store, and Google Play Store.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Expo Publish](#expo-publish)
- [iOS App Store](#ios-app-store)
- [Google Play Store](#google-play-store)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ [Expo Account](https://expo.dev/) - Free tier works
- ✅ [Apple Developer Program](https://developer.apple.com/) - $99/year (for iOS)
- ✅ [Google Play Console](https://play.google.com/console) - $25 one-time (for Android)

### Required Tools
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login
```

---

## Environment Setup

### 1. Configure EAS Project

```bash
# Navigate to project directory
cd kinky-finger-picker

# Initialize EAS (if not done)
eas init

# This will:
# - Create an Expo project (if needed)
# - Add projectId to app.json
```

### 2. Update app.json

Replace `your-project-id-here` in `app.json` with your actual Expo project ID:

```json
"extra": {
  "eas": {
    "projectId": "abc123-your-real-id"
  }
}
```

### 3. Environment Variables (Optional)

Create `.env` file for sensitive data:
```bash
# .env (DO NOT COMMIT)
EXPO_PUBLIC_API_KEY=your-api-key
EXPO_PUBLIC_ANALYTICS_ID=your-analytics-id
```

---

## Expo Publish

### Quick Publish (OTA Updates)

```bash
# Publish update to all users
eas update --branch production --message "Bug fixes and improvements"

# Publish to specific channel
eas update --branch preview --message "Testing new feature"
```

### Build Preview

```bash
# Build preview APK for testing
eas build --platform android --profile preview

# Build for iOS simulator
eas build --platform ios --profile preview
```

---

## iOS App Store

### Step 1: Apple Developer Setup

1. **Create App ID**
   - Go to [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list)
   - Click `+` → App IDs
   - Bundle ID: `com.neuralflow.kinkyfingerpicker`
   - Capabilities: None needed for this app

2. **Create App in App Store Connect**
   - Go to [App Store Connect](https://appstoreconnect.apple.com/)
   - My Apps → `+` → New App
   - Platform: iOS
   - Name: Kinky Finger Picker
   - Bundle ID: Select the one created above
   - SKU: `kinkyfingerpicker001`

### Step 2: Update eas.json

Edit `eas.json` → `submit.production.ios`:

```json
"ios": {
  "appleId": "your-apple-id@email.com",
  "ascAppId": "your-app-store-connect-app-id",
  "appleTeamId": "your-apple-team-id"
}
```

**Find your IDs:**
- **ascAppId**: App Store Connect → App Information → Apple ID
- **appleTeamId**: [Developer Portal](https://developer.apple.com/account/#/membership) → Membership

### Step 3: Prepare App Store Assets

Required screenshots (use simulator or device):
- 6.7" Display (iPhone 14 Pro Max): 1290x2796
- 6.5" Display (iPhone 11 Pro Max): 1242x2688
- 5.5" Display (iPhone 8 Plus): 1242x2208

Required metadata:
- **Age Rating**: 17+ (Mature Content)
- **Category**: Games → Party
- **Privacy Policy URL**: Required for adult content apps
- **Description**: See template below

### Step 4: Build & Submit

```bash
# Build for production
eas build --platform ios --profile production

# Wait for build to complete (15-30 mins)
# EAS will provide download link

# Auto-submit to App Store
eas submit --platform ios --latest

# Or manually upload the .ipa to App Store Connect
```

### Step 5: App Store Review

1. Complete all metadata in App Store Connect
2. Upload screenshots
3. Add privacy policy
4. Submit for review
5. **Important**: In review notes, explain:
   - App is for adults 18+
   - Content warnings are displayed
   - Users can skip inappropriate content

**Review time**: 1-3 days typically

---

## Google Play Store

### Step 1: Google Play Console Setup

1. **Create Application**
   - Go to [Google Play Console](https://play.google.com/console)
   - Create app → Fill in details
   - App name: Kinky Finger Picker
   - Default language: English
   - App type: Game
   - Category: Party

2. **Content Rating Questionnaire**
   - Answer all questions honestly
   - Sexual content: YES (due to adult questions)
   - Expected rating: Mature 17+

### Step 2: Create Service Account

Required for automated submission:

```bash
# Follow EAS guide to create service account:
# https://docs.expo.dev/submit/android/

# Download JSON key file
# Save as: kinky-finger-picker-play-store.json
```

### Step 3: Update eas.json

```json
"android": {
  "serviceAccountKeyPath": "./kinky-finger-picker-play-store.json",
  "track": "internal"  // or "alpha", "beta", "production"
}
```

**⚠️ IMPORTANT:** Add to `.gitignore`:
```
*.json
!package.json
!app.json
!eas.json
```

### Step 4: Prepare Store Assets

Required graphics:
- **Icon**: 512x512 PNG
- **Feature Graphic**: 1024x500 PNG
- **Screenshots**: At least 2 (phone + tablet)
  - Phone: 1080x1920 minimum
  - Tablet: 1920x1200 minimum

### Step 5: Build & Submit

```bash
# Build AAB for production
eas build --platform android --profile production

# Auto-submit to Play Store (internal track)
eas submit --platform android --latest

# Or manually upload to Play Console
```

### Step 6: Release Tracks

1. **Internal Testing** (up to 100 testers)
   ```bash
   eas submit --platform android --track internal
   ```

2. **Closed Testing** (Alpha/Beta)
   ```bash
   eas submit --platform android --track alpha
   ```

3. **Production Release**
   ```bash
   eas submit --platform android --track production
   ```

**Review time**: Few hours to 1 day

---

## App Store Listing Templates

### Description Template

```
🎉 Kinky Finger Picker - The Ultimate Party Game

ABOUT
A multiplayer party game that combines random finger selection with truth-or-dare style challenges. Perfect for breaking the ice and adding excitement to your gatherings!

⚠️ 18+ ADULT CONTENT WARNING
This app contains explicit content intended for consenting adults only.

FEATURES
✨ Multiple game modes (Hetero, Gay, Lesbian)
🌶️ 3 intensity levels (Mild, Spicy, Extreme)
🎯 Smart player selection with physics-based random picker
⏱️ Optional dare timers for added pressure
📊 Track stats and see who's the unluckiest player
🎨 6 stunning visual themes to unlock
🏆 Achievement system with rewards
📱 Share epic moments with friends
🎵 Immersive sound effects and animations

PLAY RESPONSIBLY
• Respect all participants' boundaries
• Allow players to skip uncomfortable dares
• Keep it fun and consensual for everyone
• Stop immediately if anyone feels uncomfortable

PRIVACY
• No data collection
• Everything stays on your device
• No account required
• Play offline

Download now and make your next party unforgettable! 🎊
```

### Keywords (iOS)

```
party game, truth or dare, drinking game, adult game, party, multiplayer, dare, challenge, friends, ice breaker
```

### Short Description (Android - 80 chars)

```
Ultimate party game with truth-or-dare challenges. 18+ Adult content.
```

---

## Troubleshooting

### Common Issues

#### "Bundle Identifier Already Exists"
```bash
# Change in app.json
"bundleIdentifier": "com.neuralflow.kinkyfingerpicker.unique"
```

#### "Build Failed - Out of Memory"
```bash
# Use larger build instance in eas.json
"ios": {
  "resourceClass": "m-large"  // instead of m-medium
}
```

#### "App Store Rejection - Adult Content"
- Ensure age rating is 17+
- Add prominent content warning in screenshots
- Explain clearly in review notes
- Consider adding parental gate

#### "Play Store Suspended"
- Ensure content rating questionnaire is accurate
- Add age verification screen
- Include privacy policy
- Follow [Google's Adult Content Policy](https://support.google.com/googleplay/android-developer/answer/9878810)

### Testing Builds Locally

```bash
# iOS Simulator
eas build --platform ios --profile preview
# Download .tar.gz, extract, drag to simulator

# Android Device
eas build --platform android --profile preview
# Download .apk, install on device
```

### Update App After Release

```bash
# For OTA updates (JavaScript changes only)
eas update --branch production

# For native changes (new build required)
eas build --platform all --profile production
eas submit --platform all --latest
```

---

## Maintenance

### Version Bumping

Before each release:

```json
// app.json
"version": "1.0.1",  // User-facing version
"ios": {
  "buildNumber": "2"  // Increment for each iOS build
},
"android": {
  "versionCode": 2  // Increment for each Android build
}
```

### Monitoring

```bash
# Check build status
eas build:list

# View submissions
eas submit:list

# Check update deployments
eas update:list
```

---

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://play.google.com/about/developer-content-policy/)
- [Expo Forums](https://forums.expo.dev/)

---

## Support

Having issues? Check:
1. [GitHub Issues](https://github.com/andresmoralesc1/kinky-finger-picker/issues)
2. [Expo Forums](https://forums.expo.dev/)
3. [Discord Community](https://discord.gg/expo)

---

**Good luck with your deployment! 🚀**

Remember: Always test thoroughly before submitting to stores!
