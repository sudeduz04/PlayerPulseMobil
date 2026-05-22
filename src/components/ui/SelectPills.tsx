import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "@/src/theme/tokens";

export interface PillOption<T> {
  value: T;
  label: string;
}

interface Props<T> {
  label: string;
  options: PillOption<T>[];
  value: T | undefined;
  onChange: (v: T) => void;
  error?: string;
  scroll?: boolean;
}

export function SelectPills<T extends string | number>({
  label,
  options,
  value,
  onChange,
  error,
  scroll = false,
}: Props<T>) {
  const pills = options.map((opt) => {
    const active = value === opt.value;
    return (
      <Pressable
        key={String(opt.value)}
        onPress={() => onChange(opt.value)}
        accessibilityRole="button"
        accessibilityLabel={opt.label}
        accessibilityState={{ selected: active }}
        style={[styles.pill, active ? styles.pillActive : styles.pillInactive]}
      >
        <Text
          style={[
            styles.pillText,
            active ? styles.pillTextActive : styles.pillTextInactive,
          ]}
        >
          {opt.label}
        </Text>
      </Pressable>
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {scroll ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollRow}
        >
          {pills}
        </ScrollView>
      ) : (
        <View style={styles.wrapRow}>{pills}</View>
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "500",
  },
  scrollRow: {
    gap: 8,
  },
  wrapRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  pillActive: {
    borderColor: colors.accent.DEFAULT,
    backgroundColor: colors.accent.soft,
  },
  pillInactive: {
    borderColor: colors.border,
    backgroundColor: colors.surface[800],
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
  },
  pillTextActive: {
    color: colors.accent.DEFAULT,
  },
  pillTextInactive: {
    color: colors.text.secondary,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});
