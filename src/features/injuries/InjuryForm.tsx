import { Controller, type Control } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { SelectPills } from "@/src/components/ui/SelectPills";
import { TextField } from "@/src/components/ui/TextField";
import type { InjuryFormValues } from "./schemas";

interface Props {
  control: Control<InjuryFormValues>;
}

const SEVERITY_OPTIONS = [
  { value: "minor" as const, label: "Hafif" },
  { value: "moderate" as const, label: "Orta" },
  { value: "severe" as const, label: "Ağır" },
];

const STATUS_OPTIONS = [
  { value: "open" as const, label: "Aktif" },
  { value: "recovering" as const, label: "İyileşiyor" },
  { value: "closed" as const, label: "Kapandı" },
];

export function InjuryForm({ control }: Props) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.col}>
          <TextField
            control={control}
            name="injury_date"
            label="Sakatlanma Tarihi"
            placeholder="YYYY-AA-GG"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.col}>
          <TextField
            control={control}
            name="recovery_date"
            label="İyileşme Tarihi (opsiyonel)"
            placeholder="YYYY-AA-GG"
            autoCapitalize="none"
          />
        </View>
      </View>
      <TextField
        control={control}
        name="body_part"
        label="Bölge"
        placeholder="Örn: Sol diz"
      />
      <TextField
        control={control}
        name="description"
        label="Açıklama"
        multiline
        numberOfLines={2}
      />
      <Controller
        control={control}
        name="severity"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPills
            label="Şiddet"
            options={SEVERITY_OPTIONS}
            value={value ?? undefined}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="status"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPills
            label="Durum"
            options={STATUS_OPTIONS}
            value={value ?? undefined}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />
      <TextField
        control={control}
        name="notes"
        label="Notlar"
        multiline
        numberOfLines={3}
        placeholder="Opsiyonel not"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  col: { flex: 1 },
});
