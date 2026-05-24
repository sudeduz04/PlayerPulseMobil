import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
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
import { useLeague, useUpdateLeague } from "@/src/features/leagues/hooks";
import { useTeams } from "@/src/features/teams/hooks";
import { extractErrorMessage } from "@/src/api/client";
import { colors } from "@/src/theme/tokens";

export default function EditLeagueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const leagueId = Number(id);
  const leagueQ = useLeague(Number.isFinite(leagueId) ? leagueId : undefined);
  const teamsQ = useTeams({ per_page: 200 });
  const teams = useMemo(() => teamsQ.data?.data ?? [], [teamsQ.data]);
  const updateMutation = useUpdateLeague();
  const toast = useToast();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LeagueFormValues>({
    resolver: zodResolver(leagueSchema),
    defaultValues: { name: "", season: "", description: "", team_ids: [] },
  });

  useEffect(() => {
    if (leagueQ.data) {
      reset({
        name: leagueQ.data.name,
        season: leagueQ.data.season,
        description: leagueQ.data.description ?? "",
        team_ids:
          leagueQ.data.team_ids ?? leagueQ.data.teams?.map((t) => t.id) ?? [],
      });
    }
  }, [leagueQ.data, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await updateMutation.mutateAsync({
        id: leagueId,
        input: {
          ...values,
          description: values.description?.trim() ? values.description : null,
        },
      });
      toast.show("Lig güncellendi", "success");
      router.replace(`/(app)/leagues/${leagueId}` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, "Güncellenemedi");
      setServerError(msg);
      toast.show(msg, "error");
    }
  });

  const isLoading = leagueQ.isLoading || teamsQ.isLoading;

  return (
    <Screen scroll>
      <BackButton fallback={`/(app)/leagues/${leagueId}`} />
      <Header eyebrow="DÜZENLE" title="Ligi Düzenle" />
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : (
        <>
          <LeagueForm control={control} teams={teams} />
          {serverError ? <Text style={styles.error}>{serverError}</Text> : null}
          <Button
            title="Değişiklikleri Kaydet"
            accessibilityLabel="Değişiklikleri kaydet"
            onPress={onSubmit}
            loading={isSubmitting || updateMutation.isPending}
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
