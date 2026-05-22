import { Controller, type Control } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { NumberField } from '@/src/components/ui/NumberField';
import { SelectPills } from '@/src/components/ui/SelectPills';
import { TextField } from '@/src/components/ui/TextField';
import type { Team } from '@/src/api/types';
import type { TrainingFormValues } from './schemas';

interface Props {
  control: Control<TrainingFormValues>;
  teams: Team[];
}

const TYPE_OPTIONS = [
  { value: 'technical', label: 'Teknik' },
  { value: 'tactical', label: 'Taktik' },
  { value: 'physical', label: 'Fiziksel' },
  { value: 'mental', label: 'Mental' },
  { value: 'match_prep', label: 'Maç hazırlığı' },
  { value: 'recovery', label: 'Toparlanma' },
];

export function TrainingForm({ control, teams }: Props) {
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
      <TextField control={control} name="title" label="Başlık" placeholder="Antrenman başlığı" />
      <TextField
        control={control}
        name="training_date"
        label="Tarih"
        placeholder="YYYY-AA-GG"
        autoCapitalize="none"
      />
      <View style={styles.row}>
        <View style={styles.col}>
          <TextField control={control} name="start_time" label="Başlangıç" placeholder="18:00" />
        </View>
        <View style={styles.col}>
          <TextField control={control} name="end_time" label="Bitiş" placeholder="19:30" />
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <NumberField control={control} name="duration" label="Süre (dk)" integer />
        </View>
        <View style={styles.col}>
          <TextField control={control} name="location" label="Lokasyon" />
        </View>
      </View>
      <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPills
            label="Tip"
            scroll
            options={TYPE_OPTIONS}
            value={value ?? undefined}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />
      <TextField
        control={control}
        name="description"
        label="Açıklama"
        multiline
        numberOfLines={3}
        placeholder="Opsiyonel not"
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
