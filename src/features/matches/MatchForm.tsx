import { Controller } from 'react-hook-form';
import { View } from 'react-native';
import { NumberField } from '@/src/components/ui/NumberField';
import { SelectPills } from '@/src/components/ui/SelectPills';
import { TextField } from '@/src/components/ui/TextField';
import type { Team } from '@/src/api/types';

interface Props {
  control: any;
  teams: Team[];
}

const TYPE_OPTIONS = [
  { value: 'league', label: 'Lig' },
  { value: 'cup', label: 'Kupa' },
  { value: 'friendly', label: 'Hazırlık' },
  { value: 'tournament', label: 'Turnuva' },
];

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Planlandı' },
  { value: 'completed', label: 'Tamamlandı' },
  { value: 'cancelled', label: 'İptal' },
  { value: 'postponed', label: 'Ertelendi' },
];

export function MatchForm({ control, teams }: Props) {
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
      <TextField control={control} name="opponent" label="Rakip" placeholder="Rakip takim" />
      <TextField
        control={control}
        name="match_date"
        label="Maç Tarihi"
        placeholder="YYYY-AA-GG"
        autoCapitalize="none"
      />
      <TextField control={control} name="location" label="Lokasyon" />
      <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPills
            label="Tip"
            options={TYPE_OPTIONS}
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
            scroll
            options={STATUS_OPTIONS}
            value={value}
            onChange={onChange}
            error={error?.message}
          />
        )}
      />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <NumberField control={control} name="goals_for" label="Attığımız" integer nullable />
        </View>
        <View style={{ flex: 1 }}>
          <NumberField control={control} name="goals_against" label="Yediğimiz" integer nullable />
        </View>
      </View>
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
