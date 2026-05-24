import { StyleSheet, View } from "react-native";
import type { Control } from "react-hook-form";
import { NumberField } from "@/src/components/ui/NumberField";
import { TextField } from "@/src/components/ui/TextField";
import type { MeasurementFormValues } from "./schemas";

interface Props {
  control: Control<MeasurementFormValues>;
}

export function MeasurementForm({ control }: Props) {
  return (
    <View>
      <TextField
        control={control}
        name="measurement_date"
        label="Ölçüm Tarihi"
        placeholder="YYYY-AA-GG"
        autoCapitalize="none"
      />
      <View style={styles.row}>
        <View style={styles.col}>
          <NumberField
            control={control}
            name="height"
            label="Boy (cm)"
            nullable
          />
        </View>
        <View style={styles.col}>
          <NumberField
            control={control}
            name="weight"
            label="Kilo (kg)"
            nullable
          />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <NumberField
            control={control}
            name="body_fat"
            label="Yağ %"
            nullable
          />
        </View>
        <View style={styles.col}>
          <NumberField
            control={control}
            name="resting_heart_rate"
            label="İstirahat Nabız"
            integer
            nullable
          />
        </View>
      </View>
      <NumberField control={control} name="vo2_max" label="VO2 Max" nullable />
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
