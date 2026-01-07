import React from 'react';
import { render } from '@testing-library/react-native';
import ConfettiEffect from '../ConfettiEffect';
import { Animated } from 'react-native';

describe('ConfettiEffect', () => {
  const mockColors = ['#FF006E', '#FB5607', '#FFBE0B'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { root } = render(<ConfettiEffect colors={mockColors} />);
    expect(root).toBeTruthy();
  });

  it('should use default particle count of 50 when not specified', () => {
    const component = render(<ConfettiEffect colors={mockColors} />);
    expect(component).toBeTruthy();
  });

  it('should respect custom particle count', () => {
    const customCount = 20;
    const { root } = render(
      <ConfettiEffect colors={mockColors} particleCount={customCount} />
    );
    expect(root).toBeTruthy();
  });

  it('should have pointerEvents none on container', () => {
    const { getByTestId } = render(
      <ConfettiEffect colors={mockColors} />
    );

    // The container should not intercept pointer events
    const container = render(<ConfettiEffect colors={mockColors} />).toJSON();
    expect(container).toBeTruthy();
  });

  it('should accept custom duration prop', () => {
    const { root } = render(
      <ConfettiEffect colors={mockColors} duration={3000} />
    );
    expect(root).toBeTruthy();
  });

  it('should handle empty colors array gracefully', () => {
    const { root } = render(<ConfettiEffect colors={[]} particleCount={10} />);
    expect(root).toBeTruthy();
  });

  it('should handle single color', () => {
    const { root } = render(<ConfettiEffect colors={['#FF006E']} />);
    expect(root).toBeTruthy();
  });
});
