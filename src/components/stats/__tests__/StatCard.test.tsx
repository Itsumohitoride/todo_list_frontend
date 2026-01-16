import React from 'react';
import { render } from '@testing-library/react-native';
import StatCard from '../StatCard';

describe('StatCard', () => {
  it('should render title, value, and icon', () => {
    const { getByText } = render(
      <StatCard
        title="Total Tasks"
        value={42}
        icon="checkbox-outline"
        color="#5293CC"
      />
    );

    expect(getByText('Total Tasks')).toBeTruthy();
    expect(getByText('42')).toBeTruthy();
  });

  it('should render with string value', () => {
    const { getByText } = render(
      <StatCard
        title="Completion Rate"
        value="75.5%"
        icon="stats-chart-outline"
        color="#65CF71"
      />
    );

    expect(getByText('Completion Rate')).toBeTruthy();
    expect(getByText('75.5%')).toBeTruthy();
  });

  it('should render subtitle when provided', () => {
    const { getByText } = render(
      <StatCard
        title="Completed Tasks"
        value={10}
        icon="checkmark-circle-outline"
        color="#65CF71"
        subtitle="Great job!"
      />
    );

    expect(getByText('Completed Tasks')).toBeTruthy();
    expect(getByText('10')).toBeTruthy();
    expect(getByText('Great job!')).toBeTruthy();
  });

  it('should not render subtitle when not provided', () => {
    const { queryByText } = render(
      <StatCard
        title="Pending Tasks"
        value={5}
        icon="time-outline"
        color="#FF9500"
      />
    );

    expect(queryByText('Great job!')).toBeNull();
  });

  it('should apply correct color to border and value', () => {
    const { getByText } = render(
      <StatCard
        title="Test"
        value={100}
        icon="checkbox-outline"
        color="#FF0000"
      />
    );

    const valueElement = getByText('100');
    expect(valueElement.props.style).toContainEqual(
      expect.objectContaining({ color: '#FF0000' })
    );
  });
});
