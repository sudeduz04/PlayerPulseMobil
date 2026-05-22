import { Controller, type Control } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { NumberField } from '@/src/components/ui/NumberField';
import { SelectPills } from '@/src/components/ui/SelectPills';
import { TextField } from '@/src/components/ui/TextField';
import { POSITIONS } from '@/src/lib/positions';
import type { Team } from '@/src/api/types';
import type { PlayerFormValues } from './schemas';

interface PlayerFormProps {
  control: Control<PlayerFormValues>;
  teams: Team[];
}

const FOOT_OPTIONS = [
  { value: 'left' as const, label: 'Sol' },
  { value: 'right' as const, label: 'Sağ' },
  { value: 'both' as const, label: 'Çift' },
];

const STATUS_OPTIONS = [
  { value: 'active' as const, label: 'Aktif' },
  { value: 'injured' as const, label: 'Sakat' },
  { value: 'inactive' as const, label: 'Pasif' },
];

export function PlayerForm({ control, teams }: PlayerFormProps) {
  return (
    <View>
      <Controller
        control={control}
        name="team_id"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPills
            label="Takım"
            scroll
            options={teams.map((t) => ({ value: t.id, label: t.name }))}
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="position_id"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPills
            label="Pozisyon"
            scroll
            options={POSITIONS.map((p) => ({ value: p.id, label: p.code }))}
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />

      <View style={styles.row}>
        <View style={styles.col}>
          <TextField control={control} name="first_name" label="Ad" />
        </View>
        <View style={styles.col}>
          <TextField control={control} name="last_name" label="Soyad" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <TextField
            control={control}
            name="birth_date"
            label="Doğum Tarihi"
            placeholder="YYYY-AA-GG"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.col}>
          <NumberField
            control={control}
            name="jersey_number"
            label="Forma No"
            placeholder="1-99"
            integer
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.col}>
          <NumberField control={control} name="height" label="Boy (cm)" nullable />
        </View>
        <View style={styles.col}>
          <NumberField control={control} name="weight" label="Kilo (kg)" nullable />
        </View>
      </View>

      <Controller
        control={control}
        name="dominant_foot"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPills
            label="Dominant Ayak"
            options={FOOT_OPTIONS}
            value={value}
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
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />

      <TextField
        control={control}
        name="nationality"
        label="Milliyet (opsiyonel)"
        placeholder="Örn: Türkiye"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  col: {
    flex: 1,
  },
});
