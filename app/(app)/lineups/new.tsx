import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Screen } from '@/src/components/ui/Screen';
import { Header } from '@/src/components/ui/Header';
import { Button } from '@/src/components/ui/Button';
import { BackButton } from '@/src/components/ui/BackButton';
import { Card } from '@/src/components/ui/Card';
import { SelectPills } from '@/src/components/ui/SelectPills';
import { TextField } from '@/src/components/ui/TextField';
import { useToast } from '@/src/components/ui/Toast';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import {
  useCreateLineup,
  useLineupOptions,
} from '@/src/features/lineups/hooks';
import { useMatchRoster } from '@/src/features/matches/hooks';
import { useMyTeamIds } from '@/src/features/auth/useMyTeamIds';
import {
  FORMATION_KEYS,
  buildSlots,
  defaultPositionFor,
} from '@/src/lib/formations';
import { opponentForUser } from '@/src/lib/match';
import { FieldEditor, type SlotSelection } from '@/src/features/lineups/components/FieldEditor';
import { PlayerPickerModal } from '@/src/features/lineups/components/PlayerPickerModal';
import { extractErrorMessage } from '@/src/api/client';
import { colors } from '@/src/theme/tokens';
import { z } from 'zod';

const noteSchema = z.object({
  note: z.string().max(500, 'Not 500 karakteri geçmesin').optional().nullable(),
});
type NoteForm = z.infer<typeof noteSchema>;

export default function NewLineupScreen() {
  const { match_id: matchIdParam } = useLocalSearchParams<{ match_id?: string }>();
  const initialMatchId = matchIdParam ? Number(matchIdParam) : undefined;

  const optionsQ = useLineupOptions(initialMatchId);
  const createMutation = useCreateLineup();
  const toast = useToast();
  const myTeamIds = useMyTeamIds();

  const [matchId, setMatchId] = useState<number | undefined>(initialMatchId);
  const [formation, setFormation] = useState<string>('4-4-2');
  const [selections, setSelections] = useState<Record<string, SlotSelection>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<NoteForm>({
    resolver: zodResolver(noteSchema),
    defaultValues: { note: '' },
  });

  const rosterQ = useMatchRoster(matchId);
  const roster = rosterQ.data ?? [];
  const positions = optionsQ.data?.positions ?? [];
  const matchOptions = useMemo(
    () =>
      (optionsQ.data?.matches ?? []).map((m) => ({
        value: m.id,
        label: opponentForUser(m, myTeamIds),
      })),
    [optionsQ.data?.matches, myTeamIds],
  );
  const formationOptions = useMemo(
    () => FORMATION_KEYS.map((code) => ({ value: code, label: code })),
    [],
  );

  const slots = useMemo(() => buildSlots(formation), [formation]);

  const takenPlayerIds = useMemo(() => {
    const ids = new Set<number>();
    for (const [key, sel] of Object.entries(selections)) {
      if (key === activeSlot) continue;
      if (sel?.player_id) ids.add(sel.player_id);
    }
    return ids;
  }, [selections, activeSlot]);

  const filledCount = Object.values(selections).filter((s) => s?.player_id).length;
  const allFilled = filledCount === slots.length;

  const onMatchChange = (id: number) => {
    setMatchId(id);
    setSelections({});
  };

  const onFormationChange = (value: string) => {
    setFormation(value);
    // Aynı slot_key kalan oyuncuları korumak için temizleme yapmıyoruz —
    // ama yeni formasyonda yer almayan slotlar otomatik gözükmez.
  };

  const onPickPlayer = (player: { id: number; position?: { id: number } | null }) => {
    if (!activeSlot) return;
    const fallbackPositionId =
      defaultPositionFor(activeSlot, positions) ?? player.position?.id ?? null;
    if (!fallbackPositionId) {
      toast.show('Bu oyuncu için pozisyon belirlenemedi.', 'error');
      return;
    }
    setSelections((prev) => ({
      ...prev,
      [activeSlot]: { player_id: player.id, position_id: fallbackPositionId },
    }));
    setActiveSlot(null);
  };

  const onClearSlot = () => {
    if (!activeSlot) return;
    setSelections((prev) => {
      const next = { ...prev };
      delete next[activeSlot];
      return next;
    });
    setActiveSlot(null);
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    if (!matchId) {
      const msg = 'Önce bir maç seç.';
      setSubmitError(msg);
      toast.show(msg, 'error');
      return;
    }
    if (!allFilled) {
      const msg = `Tüm slotları doldur (${filledCount}/${slots.length}).`;
      setSubmitError(msg);
      toast.show(msg, 'error');
      return;
    }

    try {
      const lineup = await createMutation.mutateAsync({
        match_id: matchId,
        formation,
        note: values.note?.trim() ? values.note : null,
        players: slots.map((s) => {
          const sel = selections[s.slot_key];
          return {
            player_id: sel.player_id,
            position_id: sel.position_id,
            slot_key: s.slot_key,
            field_x: s.field_x,
            field_y: s.field_y,
            is_starting: true,
          };
        }),
      });
      toast.show('Kadro kaydedildi', 'success');
      router.replace(`/(app)/lineups/${lineup.id}` as never);
    } catch (e) {
      const msg = extractErrorMessage(e, 'Kadro kaydedilemedi');
      setSubmitError(msg);
      toast.show(msg, 'error');
    }
  });

  return (
    <Screen scroll={false} padded={false}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <BackButton fallback="/(app)/lineups" />
        <Header
          eyebrow="YENİ KADRO"
          title="Manuel Kadro"
          subtitle="Maç + formasyon seç, 11 oyuncuyu yerleştir"
        />

        {optionsQ.isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.accent.DEFAULT} />
          </View>
        ) : optionsQ.error ? (
          <DashboardError error={optionsQ.error} onRetry={optionsQ.refetch} />
        ) : (
          <Card style={styles.card}>
            <SelectPills
              label="Maç"
              scroll
              options={matchOptions}
              value={matchId}
              onChange={onMatchChange}
            />
            <SelectPills
              label="Formasyon"
              scroll
              options={formationOptions}
              value={formation}
              onChange={onFormationChange}
            />
          </Card>
        )}

        {matchId ? (
          rosterQ.isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.accent.DEFAULT} />
            </View>
          ) : rosterQ.error ? (
            <DashboardError error={rosterQ.error} onRetry={rosterQ.refetch} />
          ) : (
            <>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Doluluk</Text>
                <Text
                  style={[
                    styles.progressValue,
                    allFilled ? styles.progressDone : null,
                  ]}>
                  {filledCount} / {slots.length}
                </Text>
              </View>
              <FieldEditor
                slots={slots}
                selections={selections}
                roster={roster}
                activeSlotKey={activeSlot}
                onSlotPress={setActiveSlot}
              />
              <Card style={[styles.card, styles.cardTop]}>
                <Controller
                  control={control}
                  name="note"
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      control={control}
                      name="note"
                      label="Not (opsiyonel)"
                      placeholder="Örn: Sakat oyuncular hariç"
                      multiline
                      numberOfLines={3}
                    />
                  )}
                />
              </Card>
            </>
          )
        ) : (
          <Card style={styles.card}>
            <Text style={styles.muted}>Maç seçince oyuncu kadrosu yüklenir.</Text>
          </Card>
        )}

        {submitError ? <Text style={styles.error}>{submitError}</Text> : null}

        <Button
          title="Kadroyu Kaydet"
          accessibilityLabel="Kadroyu kaydet"
          onPress={onSubmit}
          loading={createMutation.isPending}
          disabled={!matchId || !allFilled}
        />
      </ScrollView>

      <PlayerPickerModal
        visible={!!activeSlot}
        slotKey={activeSlot}
        roster={roster}
        takenPlayerIds={takenPlayerIds}
        onSelect={onPickPlayer}
        onClear={onClearSlot}
        onClose={() => setActiveSlot(null)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 32, gap: 12 },
  loading: { paddingVertical: 48, alignItems: 'center' },
  card: { marginBottom: 4 },
  cardTop: { marginTop: 12 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  progressValue: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  progressDone: {
    color: colors.accent.DEFAULT,
  },
  muted: { color: colors.text.secondary, fontSize: 13 },
  error: { color: colors.danger, fontSize: 13, marginTop: 4 },
});
