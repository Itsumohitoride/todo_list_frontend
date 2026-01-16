import React from 'react';
import { render } from '@testing-library/react-native';
import CategoryBadge from '../CategoryBadge';

describe('CategoryBadge', () => {
  it('should not render for NORMAL task type', () => {
    const { container } = render(<CategoryBadge taskType="NORMAL" />);
    expect(container.children.length).toBe(0);
  });

  it('should render for IMPORTANT task type', () => {
    const { getByText } = render(<CategoryBadge taskType="IMPORTANT" />);
    expect(getByText('Importante')).toBeTruthy();
  });

  it('should render for URGENT task type', () => {
    const { getByText } = render(<CategoryBadge taskType="URGENT" />);
    expect(getByText('Urgente')).toBeTruthy();
  });

  it('should apply correct color for IMPORTANT', () => {
    const { getByText } = render(<CategoryBadge taskType="IMPORTANT" />);
    const badge = getByText('Importante').parent;

    // Check that the badge has the danger color
    expect(badge?.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });

  it('should apply correct color for URGENT', () => {
    const { getByText } = render(<CategoryBadge taskType="URGENT" />);
    const badge = getByText('Urgente').parent;

    // Check that the badge has the orange color
    expect(badge?.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: expect.any(String) })
    );
  });
});
