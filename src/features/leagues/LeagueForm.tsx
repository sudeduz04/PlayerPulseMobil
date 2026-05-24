import { Controller, type Control } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TextField } from "@/src/components/ui/TextField";
import { colors, radius } from "@/src/theme/tokens";
import type { Team } from "@/src/api/types";
import type { LeagueFormValues } from "./schemas";

interface Props {
  control: Control<LeagueFormValues>;
  teams: Team[];
}

export function LeagueForm({ control, teams }: Props) {
  return (
    <View>
      <TextField
        control={control}
        name="name"
        label="Lig Adı"
        placeholder="Örn: Süper Lig"
      />
      <TextField
        control={control}
        name="season"
        label="Sezon"
        placeholder="Örn: 2025-2026"
        autoCapitalize="none"
      />
      <TextField
        control={control}
        name="description"
        label="Açıklama (opsiyonel)"
        multiline
        numberOfLines={3}
      />
      <Controller
        control={control}
        name="team_ids"
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const selected = new Set<number>(value ?? []);
          const toggle = (id: number) => {
            const next = new Set(selected);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            onChange(Array.from(next));
          };
          return (
            <View style={styles.section}>
              <Text style={styles.label}>
                Takımlar ({selected.size} seçili)
              </Text>
              <View style={styles.grid}>
                {teams.map((t) => {
                  const active = selected.has(t.id);
                  return (
                    <Pressable
                      key={t.id}
                      onPress={() => toggle(t.id)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      style={[
                        styles.pill,
                        active ? styles.pillActive : styles.pillInactive,
                      ]}
                    >
                      <Text
                        style={
                          active
                            ? styles.pillTextActive
                            : styles.pillTextInactive
                        }
                      >
                        {t.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {error?.message ? (
                <Text style={styles.error}>{error.message}</Text>
              ) : null}
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 14 },
  label: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "500",
  },
  grid: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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
  pillTextActive: {
    color: colors.accent.DEFAULT,
    fontWeight: "600",
    fontSize: 12,
  },
  pillTextInactive: {
    color: colors.text.secondary,
    fontWeight: "600",
    fontSize: 12,
  },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
});
