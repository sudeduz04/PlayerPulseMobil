import { memo, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Rect } from "react-native-svg";
import { colors, radius } from "@/src/theme/tokens";
import type { LineupAssignment } from "@/src/api/types";

interface LineupFieldProps {
  assignments: LineupAssignment[];
  onSlotPress?: (slotKey: string) => void;
  highlightSlotKey?: string;
  emptySlots?: { slot_key: string; field_x: number; field_y: number }[];
  ariaLabel?: string;
  /** Optional override to render custom content for a slot (defaults to chip with jersey + last name). */
  renderSlot?: (assignment: LineupAssignment) => ReactNode;
}

const FIELD_LINE_OPACITY = 0.25;

function LineupFieldBase({
  assignments,
  onSlotPress,
  highlightSlotKey,
  emptySlots = [],
  ariaLabel,
  renderSlot,
}: LineupFieldProps) {
  return (
    <View
      style={styles.container}
      accessibilityLabel={ariaLabel ?? "Kadro saha görünümü"}
      accessibilityRole="image"
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 130"
        style={StyleSheet.absoluteFill}
        preserveAspectRatio="xMidYMid meet"
      >
        <Rect
          x={1}
          y={1}
          width={98}
          height={128}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={FIELD_LINE_OPACITY}
          strokeWidth={0.6}
        />
        <Line
          x1={1}
          y1={65}
          x2={99}
          y2={65}
          stroke="#ffffff"
          strokeOpacity={FIELD_LINE_OPACITY}
          strokeWidth={0.4}
        />
        <Circle
          cx={50}
          cy={65}
          r={10}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={FIELD_LINE_OPACITY}
          strokeWidth={0.4}
        />
        <Circle
          cx={50}
          cy={65}
          r={0.6}
          fill="#ffffff"
          fillOpacity={FIELD_LINE_OPACITY}
        />
        {/* Üst kale alanı */}
        <Rect
          x={30}
          y={1}
          width={40}
          height={10}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={FIELD_LINE_OPACITY}
          strokeWidth={0.4}
        />
        <Rect
          x={40}
          y={1}
          width={20}
          height={4}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={FIELD_LINE_OPACITY}
          strokeWidth={0.4}
        />
        {/* Alt kale alanı */}
        <Rect
          x={30}
          y={119}
          width={40}
          height={10}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={FIELD_LINE_OPACITY}
          strokeWidth={0.4}
        />
        <Rect
          x={40}
          y={125}
          width={20}
          height={4}
          fill="none"
          stroke="#ffffff"
          strokeOpacity={FIELD_LINE_OPACITY}
          strokeWidth={0.4}
        />
      </Svg>

      {emptySlots.map((slot) => (
        <Pressable
          key={`empty-${slot.slot_key}`}
          onPress={() => onSlotPress?.(slot.slot_key)}
          accessibilityRole="button"
          accessibilityLabel={`Boş slot ${slot.slot_key}`}
          style={[
            styles.chip,
            {
              left: `${slot.field_x}%`,
              top: `${(slot.field_y * (130 / 100)) / 1.3}%`,
            },
            styles.emptyChip,
            highlightSlotKey === slot.slot_key ? styles.highlight : null,
          ]}
        >
          <Text style={styles.emptyChipText}>{slot.slot_key}</Text>
        </Pressable>
      ))}

      {assignments.map((a) =>
        renderSlot ? (
          <View
            key={`${a.slot_key}-${a.player_id}`}
            style={[
              styles.absolutePos,
              {
                left: `${a.field_x}%`,
                top: `${(a.field_y * (130 / 100)) / 1.3}%`,
              },
            ]}
          >
            {renderSlot(a)}
          </View>
        ) : (
          <Pressable
            key={`${a.slot_key}-${a.player_id}`}
            onPress={() => onSlotPress?.(a.slot_key)}
            accessibilityRole="button"
            accessibilityLabel={
              a.player
                ? `${a.player.first_name} ${a.player.last_name}`
                : a.slot_key
            }
            style={[
              styles.chip,
              styles.filledChip,
              {
                left: `${a.field_x}%`,
                top: `${(a.field_y * (130 / 100)) / 1.3}%`,
              },
              highlightSlotKey === a.slot_key ? styles.highlight : null,
            ]}
          >
            <Text style={styles.jersey}>
              {a.player?.jersey_number ?? a.slot_key}
            </Text>
            {a.player ? (
              <Text style={styles.name} numberOfLines={1}>
                {a.player.last_name}
              </Text>
            ) : null}
          </Pressable>
        ),
      )}
    </View>
  );
}

export const LineupField = memo(LineupFieldBase);

const CHIP_SIZE = 56;
const CHIP_HALF = CHIP_SIZE / 2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0b3d1f",
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    aspectRatio: 3 / 4,
    width: "100%",
    overflow: "hidden",
    padding: 4,
  },
  absolutePos: {
    position: "absolute",
    transform: [{ translateX: -CHIP_HALF }, { translateY: -CHIP_HALF }],
  },
  chip: {
    position: "absolute",
    width: CHIP_SIZE,
    height: CHIP_SIZE,
    borderRadius: CHIP_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -CHIP_HALF }, { translateY: -CHIP_HALF }],
    borderWidth: 2,
  },
  filledChip: {
    backgroundColor: "#0b0b0b",
    borderColor: colors.accent.DEFAULT,
  },
  emptyChip: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.4)",
    borderStyle: "dashed",
  },
  highlight: {
    borderColor: "#ffd166",
  },
  jersey: {
    color: colors.accent.DEFAULT,
    fontSize: 18,
    fontWeight: "800",
  },
  emptyChipText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 10,
    fontWeight: "700",
  },
  name: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "600",
    marginTop: -2,
    maxWidth: CHIP_SIZE - 6,
    textAlign: "center",
  },
});
