import { Text, View } from 'react-native';
import { Card } from '@/src/components/ui/Card';
import { colors } from '@/src/theme/tokens';

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'accent' | 'danger';
}

export function StatCard({ label, value, hint, tone = 'default' }: StatCardProps) {
  const valueColor =
    tone === 'accent'
      ? colors.accent.DEFAULT
      : tone === 'danger'
        ? colors.danger
        : colors.text.primary;
  return (
    <Card style={{ flex: 1 }}>
      <Text style={{ color: colors.text.secondary, fontSize: 12, fontWeight: '500' }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ color: valueColor, fontSize: 28, fontWeight: '700', marginTop: 6 }}>
        {value}
      </Text>
      {hint ? (
        <Text style={{ color: colors.text.muted, fontSize: 12, marginTop: 4 }}>{hint}</Text>
      ) : null}
    </Card>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>{children}</View>;
}
