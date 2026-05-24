import { useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Screen } from "@/src/components/ui/Screen";
import { Header } from "@/src/components/ui/Header";
import { Button } from "@/src/components/ui/Button";
import { BackButton } from "@/src/components/ui/BackButton";
import { useToast } from "@/src/components/ui/Toast";
import { LeagueForm } from "@/src/features/leagues/LeagueForm";
import {
  leagueSchema,
  type LeagueFormValues,
} from "@/src/features/leagues/schemas";
import { useCreateLeague } from "@/src/features/leagues/hooks";
import { useTeams } from "@/src/features/teams/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

export default function NewLeagueScreen() {
  const teamsQ = useTeams({ per_page: 200 });
  const teams = useMemo(() => teamsQ.data?.data ?? [], [teamsQ.data]);
  const toast = useToast();
  const createMutation = useCreateLeague();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LeagueFormValues>({
    resolver: zodResolver(leagueSchema),
    defaultValues: { name: "", season: "", description: "", team_ids: [] },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const league = await createMutation.mutateAsync({
        ...values,
        description: values.description?.trim() ? values.description : null,
      });
      toast.show("Lig oluşturuldu", "success");
      router.replace(`/(app)/leagues/${league.id}` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, "Lig oluşturulamadı");
      setServerError(msg);
      toast.show(msg, "error");
    }
  });

  return (
    <Screen scroll>
      <BackButton fallback="/(app)/leagues" />
      <Header eyebrow="YENİ LİG" title="Lig Oluştur" />
      {teamsQ.isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : (
        <>
          <LeagueForm control={control} teams={teams} />
          {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
          <Button
            title="Ligi Oluştur"
            accessibilityLabel="Ligi oluştur"
            onPress={onSubmit}
            loading={isSubmitting || createMutation.isPending}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { paddingVertical: 48, alignItems: "center" },
  error: { color: colors.danger, marginBottom: 12 },
});
