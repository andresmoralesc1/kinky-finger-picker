import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ModeSelectionScreen from '../ModeSelectionScreen';
import { GameMode } from '../../types';

describe('ModeSelectionScreen', () => {
  const mockOnSelectMode = jest.fn();
  const mockOnQuickPlay = jest.fn();
  const mockOnOpenSettings = jest.fn();
  const mockOnOpenStats = jest.fn();
  const mockOnOpenAchievements = jest.fn();
  const mockOnOpenDailyChallenges = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the title', () => {
    const { getByText } = render(
      <ModeSelectionScreen onSelectMode={mockOnSelectMode} />
    );

    expect(getByText('Kinky Finger Picker')).toBeTruthy();
  });

  it('should render all three game mode buttons', () => {
    const { getByText } = render(
      <ModeSelectionScreen onSelectMode={mockOnSelectMode} />
    );

    expect(getByText('Hetero')).toBeTruthy();
    expect(getByText('Gay')).toBeTruthy();
    expect(getByText('Lesbian')).toBeTruthy();
  });

  it('should call onSelectMode with "hetero" when Hetero button is pressed', () => {
    const { getByText } = render(
      <ModeSelectionScreen onSelectMode={mockOnSelectMode} />
    );

    fireEvent.press(getByText('Hetero'));

    expect(mockOnSelectMode).toHaveBeenCalledWith('hetero');
    expect(mockOnSelectMode).toHaveBeenCalledTimes(1);
  });

  it('should call onSelectMode with "gay" when Gay button is pressed', () => {
    const { getByText } = render(
      <ModeSelectionScreen onSelectMode={mockOnSelectMode} />
    );

    fireEvent.press(getByText('Gay'));

    expect(mockOnSelectMode).toHaveBeenCalledWith('gay');
  });

  it('should call onSelectMode with "lesbian" when Lesbian button is pressed', () => {
    const { getByText } = render(
      <ModeSelectionScreen onSelectMode={mockOnSelectMode} />
    );

    fireEvent.press(getByText('Lesbian'));

    expect(mockOnSelectMode).toHaveBeenCalledWith('lesbian');
  });

  it('should render Quick Play button when onQuickPlay is provided', () => {
    const { getByText } = render(
      <ModeSelectionScreen
        onSelectMode={mockOnSelectMode}
        onQuickPlay={mockOnQuickPlay}
      />
    );

    expect(getByText('QUICK PLAY')).toBeTruthy();
    expect(getByText('Hetero • Mild')).toBeTruthy();
  });

  it('should call onQuickPlay when Quick Play button is pressed', () => {
    const { getByText } = render(
      <ModeSelectionScreen
        onSelectMode={mockOnSelectMode}
        onQuickPlay={mockOnQuickPlay}
      />
    );

    fireEvent.press(getByText('QUICK PLAY'));

    expect(mockOnQuickPlay).toHaveBeenCalledTimes(1);
  });

  it('should not render Quick Play button when onQuickPlay is not provided', () => {
    const { queryByText } = render(
      <ModeSelectionScreen onSelectMode={mockOnSelectMode} />
    );

    expect(queryByText('QUICK PLAY')).toBeNull();
  });

  it('should render settings icon button when onOpenSettings is provided', () => {
    const { getByText } = render(
      <ModeSelectionScreen
        onSelectMode={mockOnSelectMode}
        onOpenSettings={mockOnOpenSettings}
      />
    );

    expect(getByText('⚙️')).toBeTruthy();
  });

  it('should call onOpenSettings when settings button is pressed', () => {
    const { getByText } = render(
      <ModeSelectionScreen
        onSelectMode={mockOnSelectMode}
        onOpenSettings={mockOnOpenSettings}
      />
    );

    fireEvent.press(getByText('⚙️'));

    expect(mockOnOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('should render stats icon button when onOpenStats is provided', () => {
    const { getByText } = render(
      <ModeSelectionScreen
        onSelectMode={mockOnSelectMode}
        onOpenStats={mockOnOpenStats}
      />
    );

    expect(getByText('📊')).toBeTruthy();
  });

  it('should render achievements icon button when onOpenAchievements is provided', () => {
    const { getByText } = render(
      <ModeSelectionScreen
        onSelectMode={mockOnSelectMode}
        onOpenAchievements={mockOnOpenAchievements}
      />
    );

    expect(getByText('🏆')).toBeTruthy();
  });

  it('should render daily challenges icon button when onOpenDailyChallenges is provided', () => {
    const { getByText } = render(
      <ModeSelectionScreen
        onSelectMode={mockOnSelectMode}
        onOpenDailyChallenges={mockOnOpenDailyChallenges}
      />
    );

    expect(getByText('🎯')).toBeTruthy();
  });

  it('should render all optional buttons when all handlers are provided', () => {
    const { getByText } = render(
      <ModeSelectionScreen
        onSelectMode={mockOnSelectMode}
        onQuickPlay={mockOnQuickPlay}
        onOpenSettings={mockOnOpenSettings}
        onOpenStats={mockOnOpenStats}
        onOpenAchievements={mockOnOpenAchievements}
        onOpenDailyChallenges={mockOnOpenDailyChallenges}
      />
    );

    expect(getByText('QUICK PLAY')).toBeTruthy();
    expect(getByText('⚙️')).toBeTruthy();
    expect(getByText('📊')).toBeTruthy();
    expect(getByText('🏆')).toBeTruthy();
    expect(getByText('🎯')).toBeTruthy();
  });

  it('should have proper accessibility labels on mode buttons', () => {
    const { getByLabelText } = render(
      <ModeSelectionScreen onSelectMode={mockOnSelectMode} />
    );

    expect(getByLabelText('Hetero mode')).toBeTruthy();
    expect(getByLabelText('Gay mode')).toBeTruthy();
    expect(getByLabelText('Lesbian mode')).toBeTruthy();
  });

  it('should have proper accessibility label on Quick Play button', () => {
    const { getByLabelText } = render(
      <ModeSelectionScreen
        onSelectMode={mockOnSelectMode}
        onQuickPlay={mockOnQuickPlay}
      />
    );

    expect(getByLabelText('Quick Play')).toBeTruthy();
  });
});
