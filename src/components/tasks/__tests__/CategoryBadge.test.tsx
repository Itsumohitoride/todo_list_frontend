import React from 'react';
import { render } from '@testing-library/react-native';
import CategoryBadge from '../CategoryBadge';

describe('CategoryBadge', () => {
  it('should not render for FEATURED task type', () => {
    const { container } = render(<CategoryBadge type="FEATURED" />);
    expect(container.children.length).toBe(0);
  });

  it('should render for IMPORTANT task type', () => {
    const { getByText } = render(<CategoryBadge type="IMPORTANT" />);
    expect(getByText('Importante')).toBeTruthy();
  });

  it('should render for TODAY task type', () => {
    const { getByText } = render(<CategoryBadge type="TODAY" />);
    expect(getByText('Urgente')).toBeTruthy();
  });

  it('should apply correct color for IMPORTANT', () => {
    const { getByText } = render(<CategoryBadge type="IMPORTANT" />);
    const badge = getByText('Importante').parent;

    // Check that the badge has the danger color
    expect(badge?.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });

  it('should apply correct color for TODAY', () => {
    const { getByText } = render(<CategoryBadge type="TODAY" />);
    const badge = getByText('Urgente').parent;

    // Check that the badge has the orange color
    expect(badge?.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });
});
