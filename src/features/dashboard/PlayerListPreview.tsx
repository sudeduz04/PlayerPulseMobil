import { Text, View } from 'react-native';
import type { Player } from '@/src/api/types';
import { Card } from '@/src/components/ui/Card';
import { StatusBadge } from '@/src/components/ui/StatusBadge';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { colors } from '@/src/theme/tokens';

interface Props {
  players: Player[];
  title?: string;
}

export function PlayerListPreview({ players, title = 'Son Eklenen Oyuncular' }: Props) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 12,
          fontWeight: '600',
          letterSpacing: 1.2,
          marginBottom: 10,
          textTransform: 'uppercase',
        }}>
        {title}
      </Text>
      {players.length === 0 ? (
        <Card>
          <EmptyState
            title="Henüz oyuncu yok"
            description="Takıma oyuncu eklendiğinde burada görünecek."
          />
        </Card>
      ) : (
        <Card padding={0}>
          {players.map((p, i) => (
            <View
              key={p.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 14,
                borderBottomWidth: i < players.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.accent.soft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}>
                <Text style={{ color: colors.accent.DEFAULT, fontWeight: '700' }}>
                  {p.jersey_number}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text.primary, fontSize: 14, fontWeight: '600' }}>
                  {p.first_name} {p.last_name}
                </Text>
                <Text style={{ color: colors.text.secondary, fontSize: 12, marginTop: 2 }}>
                  {p.position?.name ?? '—'} · {p.team?.name ?? 'Takımsız'}
                </Text>
              </View>
              <StatusBadge status={p.status} />
            </View>
          ))}
        </Card>
      )}
    </View>
  );
}
