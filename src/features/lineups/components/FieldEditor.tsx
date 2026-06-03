import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import { colors, radius } from '@/src/theme/tokens';
import type { Player } from '@/src/api/types';
import type { FormationSlot } from '@/src/lib/formations';

export interface SlotSelection {
  player_id: number;
  position_id: number;
}

interface FieldEditorProps {
  slots: FormationSlot[];
  selections: Record<string, SlotSelection>;
  roster: Player[];
  activeSlotKey?: string | null;
  onSlotPress: (slotKey: string) => void;
}

const LINE_OPACITY = 0.25;
const CHIP_SIZE = 64;
const CHIP_HALF = CHIP_SIZE / 2;

function FieldEditorBase({
  slots,
  selections,
  roster,
  activeSlotKey,
  onSlotPress,
}: FieldEditorProps) {
  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 130"
        style={StyleSheet.absoluteFill}
        preserveAspectRatio="xMidYMid meet">
        <Rect
          x={1}
          y={1}
          width={98}
          height={128}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={LINE_OPACITY}
          strokeWidth={0.6}
        />
        <Line
          x1={1}
          y1={65}
          x2={99}
          y2={65}
          stroke="#ffffff"
          strokeOpacity={LINE_OPACITY}
          strokeWidth={0.4}
        />
        <Circle
          cx={50}
          cy={65}
          r={10}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={LINE_OPACITY}
          strokeWidth={0.4}
        />
        <Circle cx={50} cy={65} r={0.6} fill="#ffffff" fillOpacity={LINE_OPACITY} />
        <Rect
          x={30}
          y={1}
          width={40}
          height={10}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={LINE_OPACITY}
          strokeWidth={0.4}
        />
        <Rect
          x={30}
          y={119}
          width={40}
          height={10}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={LINE_OPACITY}
          strokeWidth={0.4}
        />
      </Svg>

      {slots.map((slot) => {
        const selection = selections[slot.slot_key];
        const player = selection
          ? roster.find((p) => p.id === selection.player_id)
          : undefined;
        const isActive = activeSlotKey === slot.slot_key;
        return (
          <Pressable
            key={slot.slot_key}
            onPress={() => onSlotPress(slot.slot_key)}
            accessibilityRole="button"
            accessibilityLabel={`Slot ${slot.slot_key}${
              player ? ` — ${player.first_name} ${player.last_name}` : ' boş'
            }`}
            style={[
              styles.chip,
              player ? styles.chipFilled : styles.chipEmpty,
              isActive ? styles.chipActive : null,
              {
                left: `${slot.field_x}%`,
                top: `${(slot.field_y * 130) / 100 / 1.3}%`,
              },
            ]}>
            <Text style={styles.slotKey}>{slot.slot_key}</Text>
            {player ? (
              <>
                <Text style={styles.jersey}>#{player.jersey_number}</Text>
                <Text style={styles.lastName} numberOfLines={1}>
                  {player.last_name}
                </Text>
              </>
            ) : (
              <Text style={styles.plus}>+</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export const FieldEditor = memo(FieldEditorBase);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0b3d1f',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    aspectRatio: 3 / 4,
    width: '100%',
    overflow: 'hidden',
    padding: 4,
  },
  chip: {
    position: 'absolute',
    width: CHIP_SIZE,
    minHeight: CHIP_SIZE,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -CHIP_HALF }, { translateY: -CHIP_HALF }],
    borderWidth: 2,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  chipFilled: {
    backgroundColor: '#0b0b0b',
    borderColor: colors.accent.DEFAULT,
  },
  chipEmpty: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.4)',
    borderStyle: 'dashed',
  },
  chipActive: {
    borderColor: '#ffd166',
  },
  slotKey: {
    color: colors.accent.DEFAULT,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  jersey: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  lastName: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 1,
    maxWidth: CHIP_SIZE - 8,
    textAlign: 'center',
  },
  plus: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 20,
    fontWeight: '300',
    marginTop: 2,
    lineHeight: 22,
  },
});
