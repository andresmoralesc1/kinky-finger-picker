# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) setup for Kinky Finger Picker.

## Overview

Our CI/CD pipeline uses GitHub Actions to automatically test, build, and validate every change to the codebase.

## Workflows

### 1. **CI Workflow** (`ci.yml`)

**Triggers**: Push to `main`/`develop`, Pull Requests to `main`/`develop`

**Jobs**:

#### Lint & TypeCheck
- Runs TypeScript type checking
- Checks for TODO/FIXME comments (warns but doesn't fail)
- Validates code consistency

#### Test Suite
- Runs all Jest tests with coverage
- Uploads coverage to Codecov
- Comments coverage report on PRs
- Requires 65+ tests passing

#### Build Check
- Verifies project structure
- Runs npm audit for vulnerabilities
- Checks package.json integrity

#### Status Check
- Ensures all previous jobs passed
- Provides final approval status

**Requirements to Pass**:
- ✅ TypeScript compiles without errors
- ✅ 65+ tests passing (97%+)
- ✅ No critical npm vulnerabilities
- ✅ Valid project structure

---

### 2. **Expo Build Workflow** (`expo-build.yml`)

**Triggers**: Push/PR to `main` affecting app files, Manual trigger

**Jobs**:

#### Expo Doctor Check
- Runs Expo diagnostics
- Validates Expo configuration
- Checks for compatibility issues

#### Build Preview (PR only)
- Creates development build manifest
- Comments build instructions on PR
- Provides QR code for testing

**Requirements**:
- Valid Expo configuration
- No critical Expo warnings

---

### 3. **Dependency Review** (`dependency-review.yml`)

**Triggers**: PRs affecting `package.json` or `package-lock.json`

**Checks**:
- Reviews new dependencies for security issues
- Fails on high/critical vulnerabilities
- Checks for outdated packages
- Analyzes package sizes

---

### 4. **PR Labeling** (`label-pr.yml`)

**Triggers**: PR opened, synchronized, or reopened

**Actions**:
- Auto-labels PRs based on changed files
- Labels PR size (XS, S, M, L, XL)
- Validates PR title format (conventional commits)

**Expected PR Title Format**:
```
type: description

Examples:
feat: add daily challenges system
fix: resolve touch detection bug
docs: update README with new features
```

---

### 5. **Stale Management** (`stale.yml`)

**Triggers**: Daily at midnight UTC, Manual trigger

**Actions**:
- Marks issues stale after 60 days of inactivity
- Marks PRs stale after 30 days of inactivity
- Closes stale issues after 7 days
- Closes stale PRs after 14 days
- Exempts pinned/security labels

---

### 6. **CodeQL Analysis** (`codeql.yml`)

**Triggers**: Push to `main`, PRs to `main`, Weekly on Mondays

**Checks**:
- Security vulnerabilities scanning
- Code quality analysis
- JavaScript/TypeScript analysis
- Extended security queries

---

## Status Badges

Add these to your README:

```markdown
[![CI](https://github.com/andresmoralesc1/kinky-finger-picker/actions/workflows/ci.yml/badge.svg)](https://github.com/andresmoralesc1/kinky-finger-picker/actions/workflows/ci.yml)
[![CodeQL](https://github.com/andresmoralesc1/kinky-finger-picker/actions/workflows/codeql.yml/badge.svg)](https://github.com/andresmoralesc1/kinky-finger-picker/actions/workflows/codeql.yml)
```

---

## Local Testing Before Push

Before pushing changes, run these commands locally:

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Type check
npm run typecheck

# Check for vulnerabilities
npm audit

# Verify build
npm run android  # or npm run ios
```

---

## Secrets Configuration

The following secrets need to be configured in GitHub repository settings:

### Required Secrets

- `GITHUB_TOKEN` - Automatically provided by GitHub Actions
- `CODECOV_TOKEN` - (Optional) For coverage reporting to Codecov
- `EXPO_TOKEN` - (Optional) For Expo build workflows

### Setting Up Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the secret name and value
4. Click "Add secret"

---

## Troubleshooting

### Tests Failing in CI but Passing Locally

1. Check Node.js version matches CI (v20)
2. Clear npm cache: `npm ci --legacy-peer-deps`
3. Check for environment-specific issues

### Build Failing on Expo Workflow

1. Verify `app.json` is valid
2. Check Expo CLI version compatibility
3. Ensure all Expo dependencies are up to date

### PR Not Auto-Labeled

1. Check `.github/labeler.yml` configuration
2. Verify file paths match changed files
3. Ensure PR hasn't been manually labeled already

---

## Best Practices

1. **Always create feature branches** - Never commit directly to `main`
2. **Write tests for new features** - Maintain 97%+ test coverage
3. **Follow conventional commit format** - Helps with auto-labeling
4. **Keep PRs focused** - Smaller PRs are easier to review
5. **Update documentation** - Keep README and docs in sync
6. **Check CI status before merge** - All checks must pass

---

## Monitoring

### Check Workflow Status

1. Go to repository Actions tab
2. View recent workflow runs
3. Click on any run to see detailed logs
4. Check individual job outputs

### Coverage Reports

- View coverage in PR comments
- Check Codecov dashboard (if configured)
- Local coverage: `npm test -- --coverage`

---

## Future Improvements

Planned CI/CD enhancements:

- [ ] Automatic version bumping
- [ ] Automated releases to Expo
- [ ] Performance benchmarking
- [ ] Visual regression testing
- [ ] Automatic changelog generation
- [ ] Deploy previews for PRs

---

## Questions?

For questions about the CI/CD pipeline:
1. Check existing GitHub Issues
2. Review workflow logs in Actions tab
3. Create a new issue with `ci/cd` label
