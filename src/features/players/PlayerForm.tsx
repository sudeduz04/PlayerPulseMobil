import { Controller } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

import { TextField } from '@/src/components/ui/TextField';
import { SelectPills } from '@/src/components/ui/SelectPills';
import { POSITIONS } from '@/src/lib/positions';
import { colors, radius } from '@/src/theme/tokens';
import type { Team } from '@/src/api/types';

interface PlayerFormProps {
  // Loose typing — see TextField rationale (RHF v7 three-generic Control).
  control: any;
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

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <TextField control={control} name="first_name" label="Ad" />
        </View>
        <View style={{ flex: 1 }}>
          <TextField control={control} name="last_name" label="Soyad" />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <TextField
            control={control}
            name="birth_date"
            label="Doğum Tarihi"
            placeholder="YYYY-AA-GG"
            autoCapitalize="none"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Controller
            control={control}
            name="jersey_number"
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
              <View style={{ marginBottom: 14 }}>
                <Text
                  style={{
                    color: colors.text.secondary,
                    fontSize: 13,
                    marginBottom: 6,
                    fontWeight: '500',
                  }}>
                  Forma No
                </Text>
                <TextInput
                  value={value !== undefined && value !== null ? String(value) : ''}
                  onChangeText={(t) => {
                    const cleaned = t.replace(/[^0-9]/g, '');
                    onChange(cleaned ? Number(cleaned) : undefined);
                  }}
                  onBlur={onBlur}
                  keyboardType="number-pad"
                  placeholder="1-99"
                  placeholderTextColor={colors.text.muted}
                  style={{
                    backgroundColor: colors.surface[800],
                    borderColor: error ? colors.danger : colors.border,
                    borderWidth: 1,
                    borderRadius: radius.input,
                    color: colors.text.primary,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                  }}
                />
                {error?.message ? (
                  <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
                    {error.message}
                  </Text>
                ) : null}
              </View>
            )}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <NumericField control={control} name="height" label="Boy (cm)" />
        </View>
        <View style={{ flex: 1 }}>
          <NumericField control={control} name="weight" label="Kilo (kg)" />
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

function NumericField({
  control,
  name,
  label,
}: {
  control: any;
  name: string;
  label: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View style={{ marginBottom: 14 }}>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 13,
              marginBottom: 6,
              fontWeight: '500',
            }}>
            {label}
          </Text>
          <TextInput
            value={value !== undefined && value !== null ? String(value) : ''}
            onChangeText={(t) => {
              const cleaned = t.replace(/[^0-9.]/g, '');
              onChange(cleaned ? Number(cleaned) : undefined);
            }}
            onBlur={onBlur}
            keyboardType="decimal-pad"
            placeholderTextColor={colors.text.muted}
            style={{
              backgroundColor: colors.surface[800],
              borderColor: error ? colors.danger : colors.border,
              borderWidth: 1,
              borderRadius: radius.input,
              color: colors.text.primary,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
            }}
          />
          {error?.message ? (
            <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
              {error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
