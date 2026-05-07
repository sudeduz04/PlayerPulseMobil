import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { Button } from '@/src/components/ui/Button';
import { DashboardError } from '@/src/features/dashboard/DashboardError';
import { usePlayer, useDeletePlayer } from '@/src/features/players/hooks';
import { useAuthStore } from '@/src/store/auth';
import { canWritePlayers } from '@/src/lib/permissions';
import { positionLabel } from '@/src/lib/positions';
import { extractErrorMessage } from '@/src/api/client';
import { formatDate } from '@/src/lib/format';
import { navigateBack } from '@/src/lib/navigation';
import { colors, radius } from '@/src/theme/tokens';

const FOOT_LABEL: Record<'left' | 'right' | 'both', string> = {
  left: 'Sol',
  right: 'Sağ',
  both: 'Çift',
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    }}>
    <Text style={{ color: colors.text.secondary, fontSize: 13 }}>{label}</Text>
    <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}>{value}</Text>
  </View>
);

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const playerId = Number(id);
  const role = useAuthStore((s) => s.user?.role);

  const playerQ = usePlayer(Number.isFinite(playerId) ? playerId : undefined);
  const deleteMutation = useDeletePlayer();

  const onDelete = () => {
    Alert.alert('Oyuncuyu sil?', 'Bu işlem geri alınamaz.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync(playerId);
            router.replace('/(app)/players' as never);
          } catch (e) {
            Alert.alert('Silinemedi', extractErrorMessage(e));
          }
        },
      },
    ]);
  };

  return (
    <Screen
      scroll
      refreshing={playerQ.isFetching}
      onRefresh={playerQ.refetch}>
      <View style={{ flexDirection: 'row', marginBottom: 12 }}>
        <Pressable
          onPress={() => navigateBack('/(app)/players')}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: radius.pill,
            backgroundColor: colors.surface[800],
            borderWidth: 1,
            borderColor: colors.border,
          }}>
          <Text style={{ color: colors.text.secondary, fontSize: 13, fontWeight: '600' }}>
            ← Geri
          </Text>
        </Pressable>
      </View>

      {playerQ.isLoading ? (
        <View style={{ paddingVertical: 48, alignItems: 'center' }}>
          <ActivityIndicator color={colors.accent.DEFAULT} />
        </View>
      ) : playerQ.error || !playerQ.data ? (
        <DashboardError
          error={playerQ.error ?? new Error('Oyuncu bulunamadı')}
          onRetry={playerQ.refetch}
        />
      ) : (
        <>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: colors.accent.soft,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: colors.accent.DEFAULT, fontWeight: '700', fontSize: 22 }}>
                {playerQ.data.jersey_number}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.accent.DEFAULT,
                  fontSize: 11,
                  fontWeight: '700',
                  letterSpacing: 1.5,
                }}>
                OYUNCU PROFİLİ
              </Text>
              <Text
                style={{
                  color: colors.text.primary,
                  fontSize: 22,
                  fontWeight: '700',
                  marginTop: 4,
                }}>
                {playerQ.data.first_name} {playerQ.data.last_name}
              </Text>
              <View style={{ marginTop: 6 }}>
                <StatusBadge status={playerQ.data.status} />
              </View>
            </View>
          </View>

          <Card style={{ marginBottom: 12 }}>
            <Text
              style={{
                color: colors.text.secondary,
                fontSize: 12,
                fontWeight: '600',
                letterSpacing: 1.2,
                marginBottom: 6,
                textTransform: 'uppercase',
              }}>
              Genel
            </Text>
            <InfoRow label="Pozisyon" value={positionLabel(playerQ.data.position_id)} />
            <InfoRow label="Takım" value={playerQ.data.team?.name ?? '—'} />
            <InfoRow label="Doğum Tarihi" value={formatDate(playerQ.data.birth_date)} />
            <InfoRow label="Forma No" value={String(playerQ.data.jersey_number)} />
            <InfoRow label="Dominant Ayak" value={FOOT_LABEL[playerQ.data.dominant_foot]} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}>
              <Text style={{ color: colors.text.secondary, fontSize: 13 }}>Milliyet</Text>
              <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}>
                {playerQ.data.nationality ?? '—'}
              </Text>
            </View>
          </Card>

          {playerQ.data.height || playerQ.data.weight ? (
            <Card style={{ marginBottom: 12 }}>
              <Text
                style={{
                  color: colors.text.secondary,
                  fontSize: 12,
                  fontWeight: '600',
                  letterSpacing: 1.2,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                }}>
                Fiziksel
              </Text>
              {playerQ.data.height ? (
                <InfoRow label="Boy" value={`${playerQ.data.height} cm`} />
              ) : null}
              {playerQ.data.weight ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 10,
                  }}>
                  <Text style={{ color: colors.text.secondary, fontSize: 13 }}>Kilo</Text>
                  <Text
                    style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}>
                    {playerQ.data.weight} kg
                  </Text>
                </View>
              ) : null}
            </Card>
          ) : null}

          {canWritePlayers(role) ? (
            <View style={{ gap: 10 }}>
              <Button
                title="Düzenle"
                variant="secondary"
                onPress={() =>
                  router.push(`/(app)/players/${playerQ.data!.id}/edit` as never)
                }
              />
              <Button
                title="Oyuncuyu Sil"
                variant="danger"
                onPress={onDelete}
                loading={deleteMutation.isPending}
              />
            </View>
          ) : null}
        </>
      )}
    </Screen>
  );
}
