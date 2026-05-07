import { Text, View } from 'react-native';
import { Screen } from '@/src/components/ui/Screen';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { DashboardHeader } from '@/src/features/dashboard/DashboardHeader';
import { useAuthStore } from '@/src/store/auth';
import { colors } from '@/src/theme/tokens';

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

export default function PlayerDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <Screen scroll>
      <DashboardHeader />

      <Card style={{ marginBottom: 12 }}>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 12,
            fontWeight: '600',
            letterSpacing: 1.2,
            marginBottom: 10,
            textTransform: 'uppercase',
          }}>
          Profil Bilgileri
        </Text>
        {user ? (
          <View>
            <InfoRow label="Ad Soyad" value={`${user.name} ${user.surname}`} />
            <InfoRow label="E-posta" value={user.email} />
            <InfoRow label="Telefon" value={user.phone ?? '—'} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
              <Text style={{ color: colors.text.secondary, fontSize: 13 }}>Hesap Durumu</Text>
              <Text
                style={{
                  color: user.status ? colors.accent.DEFAULT : colors.text.muted,
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                {user.status ? 'Aktif' : 'Pasif'}
              </Text>
            </View>
          </View>
        ) : null}
      </Card>

      <Card>
        <EmptyState
          title="Performans verileri yakında"
          description={
            'Antrenman skorların, maç istatistiklerin ve gelişim raporların hazır olduğunda burada listelenecek.'
          }
        />
      </Card>
    </Screen>
  );
}
