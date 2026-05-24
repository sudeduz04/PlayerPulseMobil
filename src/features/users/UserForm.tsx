import { Controller, type Control } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SelectPills } from "@/src/components/ui/SelectPills";
import { TextField } from "@/src/components/ui/TextField";
import { colors } from "@/src/theme/tokens";
import type { UserFormValues } from "./schemas";

interface Props {
  control: Control<UserFormValues>;
  passwordRequired?: boolean;
}

const ROLE_OPTIONS = [
  { value: "super_admin" as const, label: "Süper Admin" },
  { value: "manager" as const, label: "Yönetici" },
  { value: "coach" as const, label: "Antrenör" },
  { value: "player" as const, label: "Oyuncu" },
];

export function UserForm({ control, passwordRequired = false }: Props) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.col}>
          <TextField control={control} name="name" label="Ad" />
        </View>
        <View style={styles.col}>
          <TextField control={control} name="surname" label="Soyad" />
        </View>
      </View>
      <TextField
        control={control}
        name="email"
        label="E-posta"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextField
        control={control}
        name="phone"
        label="Telefon (opsiyonel)"
        keyboardType="phone-pad"
      />
      <Controller
        control={control}
        name="role"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <SelectPills
            label="Rol"
            options={ROLE_OPTIONS}
            value={value}
            onChange={onChange}
            error={error?.message}
            scroll
          />
        )}
      />
      <Controller
        control={control}
        name="status"
        render={({ field: { value, onChange } }) => (
          <View style={styles.toggle}>
            <Text style={styles.toggleLabel}>Durum</Text>
            <View style={styles.toggleRow}>
              <Pressable
                onPress={() => onChange(true)}
                accessibilityRole="button"
                accessibilityState={{ selected: value === true }}
                style={[
                  styles.togglePill,
                  value === true ? styles.toggleActive : styles.toggleInactive,
                ]}
              >
                <Text
                  style={
                    value === true
                      ? styles.toggleTextActive
                      : styles.toggleTextInactive
                  }
                >
                  Aktif
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onChange(false)}
                accessibilityRole="button"
                accessibilityState={{ selected: value === false }}
                style={[
                  styles.togglePill,
                  value === false ? styles.toggleActive : styles.toggleInactive,
                ]}
              >
                <Text
                  style={
                    value === false
                      ? styles.toggleTextActive
                      : styles.toggleTextInactive
                  }
                >
                  Pasif
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <TextField
        control={control}
        name="password"
        label={passwordRequired ? "Şifre" : "Yeni şifre (boş bırak değişmesin)"}
        secureTextEntry
        autoCapitalize="none"
      />
      <TextField
        control={control}
        name="password_confirmation"
        label="Şifre (tekrar)"
        secureTextEntry
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10 },
  col: { flex: 1 },
  toggle: { marginBottom: 14 },
  toggleLabel: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "500",
  },
  toggleRow: { flexDirection: "row", gap: 8 },
  togglePill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  toggleActive: {
    borderColor: colors.accent.DEFAULT,
    backgroundColor: colors.accent.soft,
  },
  toggleInactive: {
    borderColor: colors.border,
    backgroundColor: colors.surface[800],
  },
  toggleTextActive: { color: colors.accent.DEFAULT, fontWeight: "600" },
  toggleTextInactive: { color: colors.text.secondary, fontWeight: "600" },
});
