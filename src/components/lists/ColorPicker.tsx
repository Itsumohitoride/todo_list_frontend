import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/colors';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#5293CC',
  '#399EF7',
  '#5B82A3',
  '#65CF71',
  '#576978',
  '#45494D',
  '#F7393C',
  '#FF9500',
  '#AF52DE',
  '#5AC8FA',
  '#FFCC00',
  '#FF2D55',
];

export default function ColorPicker({
  selectedColor,
  onSelectColor,
  colors = DEFAULT_COLORS,
}: ColorPickerProps) {
  return (
    <View style={styles.container}>
      {colors.map((color) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorCircle,
            { backgroundColor: color },
            selectedColor === color && styles.selectedCircle,
          ]}
          onPress={() => onSelectColor(color)}
          activeOpacity={0.7}>
          {selectedColor === color && (
            <View style={styles.checkMark}>
              <View style={styles.checkMarkInner} />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  colorCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedCircle: {
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  checkMark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMarkInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
