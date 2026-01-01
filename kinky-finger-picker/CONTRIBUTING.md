# Contributing to Kinky Finger Picker 🌶️

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Kinky Finger Picker. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Code of Conduct

This project and everyone participating in it is governed by respect and inclusivity. By participating, you are expected to uphold this code. Please report unacceptable behavior to the repository maintainers.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report:**
- Check the existing issues to see if the problem has already been reported
- Collect information about the bug (steps to reproduce, error messages, screenshots)

**How Do I Submit A Good Bug Report?**

Bugs are tracked as GitHub issues. Create an issue and provide the following information:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed** and **explain which behavior you expected**
- **Include screenshots or GIFs** if possible
- **Specify your environment:**
  - Device (iOS/Android)
  - OS version
  - Expo version
  - Node version

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion:**
- Check if the enhancement has already been suggested
- Determine if your idea fits with the scope and aims of the project

**How Do I Submit A Good Enhancement Suggestion?**

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide:

- **Use a clear and descriptive title**
- **Provide a step-by-step description** of the suggested enhancement
- **Provide specific examples** to demonstrate the steps
- **Describe the current behavior** and **explain the behavior you'd like to see**
- **Explain why this enhancement would be useful**

### Your First Code Contribution

Unsure where to begin? You can start by looking through these `beginner` and `help-wanted` issues:

- **Beginner issues** - issues which should only require a few lines of code
- **Help wanted issues** - issues which should be a bit more involved

### Pull Requests

**Development Process:**

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Make your changes:**
   - Follow the existing code style
   - Add comments where necessary
   - Update documentation if needed
4. **Test your changes:**
   ```bash
   npm start
   # Test on actual device using Expo Go
   ```
5. **Run TypeScript checks:**
   ```bash
   npx tsc --noEmit
   ```
6. **Commit your changes:**
   - Use clear commit messages
   - Follow conventional commits format if possible
   ```
   feat: add new achievement "Speed Demon"
   fix: resolve touch detection issue on Android
   docs: update README with new features
   ```
7. **Push to your fork** and **submit a pull request**

**Pull Request Guidelines:**

- **Title:** Clear and descriptive
- **Description:**
  - What changes did you make?
  - Why did you make these changes?
  - Related issue number (if applicable)
- **Testing:** Describe how you tested your changes
- **Screenshots:** Include before/after screenshots for UI changes

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Style Guide

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable names
- Add type annotations where necessary
- Avoid `any` types when possible

### Component Guidelines

- **File naming:** PascalCase for components (`MyComponent.tsx`)
- **Props:** Define interfaces for component props
- **Hooks:** Follow React hooks best practices
- **Comments:** Add JSDoc comments for complex functions

Example:
```typescript
interface MyComponentProps {
  title: string;
  onPress: () => void;
}

/**
 * MyComponent - Brief description
 * @param props - Component props
 */
export default function MyComponent({ title, onPress }: MyComponentProps) {
  // Implementation
}
```

### Code Organization

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── utils/          # Utility functions
├── data/           # Static data
└── types/          # TypeScript type definitions
```

## Questions Database

When adding new questions/dares:

- Follow the existing question structure
- Assign appropriate intensity level (mild/spicy/extreme)
- Assign correct category (classic/romantic/party/nsfw/custom)
- Ensure questions are inclusive and respect boundaries
- Avoid questions that could cause harm or discomfort

## Testing

- Test on both iOS and Android devices when possible
- Test with different screen sizes
- Test multi-touch interactions with 2-5 fingers
- Verify animations perform smoothly
- Check that sounds and haptics work correctly

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for new functions
- Update type definitions in `src/types/index.ts`
- Document new features in commit messages

## Achievements System

When adding new achievements:

1. Add to `src/utils/achievements.ts`:
   ```typescript
   {
     id: 'my_achievement',
     title: 'Achievement Title',
     description: 'Clear description',
     category: 'milestone', // or specialty/collection/challenge
     rarity: 'common', // or rare/epic/legendary
     icon: '🎯', // Appropriate emoji
     requirement: 10, // Required value
     xpReward: 100,
   }
   ```

2. Add tracking logic in `src/utils/achievements.ts` in `checkAchievements()`

3. Test that achievement unlocks correctly

## Community

- Be respectful and inclusive
- Help newcomers
- Provide constructive feedback
- Celebrate contributions

## Recognition

Contributors will be:
- Listed in the README (if significant contribution)
- Mentioned in release notes
- Credited in commit messages

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Kinky Finger Picker! 🎉🌶️

For questions, feel free to open a discussion or contact the maintainers.
