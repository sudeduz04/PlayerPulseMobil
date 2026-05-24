import { memo, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { PressableCard } from "@/src/components/ui/Card";
import { Chip } from "@/src/components/ui/StatusBadge";
import { colors } from "@/src/theme/tokens";
import type { Role, User } from "@/src/api/types";

const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Süper Admin",
  manager: "Yönetici",
  coach: "Antrenör",
  player: "Oyuncu",
};

interface Props {
  user: User;
}

function UserListItemBase({ user }: Props) {
  const onPress = useCallback(() => {
    router.push(`/(app)/users/${user.id}` as never);
  }, [user.id]);

  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={`${user.name} ${user.surname}`}
    >
      <Text style={styles.title}>
        {user.name} {user.surname}
      </Text>
      <Text style={styles.meta}>{user.email}</Text>
      <View style={styles.chips}>
        <Chip label={ROLE_LABEL[user.role]} tone="accent" />
        <Chip
          label={user.status ? "Aktif" : "Pasif"}
          tone={user.status ? "accent" : "neutral"}
        />
      </View>
    </PressableCard>
  );
}

export const UserListItem = memo(UserListItemBase);

const styles = StyleSheet.create({
  title: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 4,
  },
  chips: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
});
