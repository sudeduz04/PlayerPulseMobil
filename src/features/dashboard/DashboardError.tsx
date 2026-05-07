import { Text, View } from 'react-native';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { extractErrorMessage } from '@/src/api/client';
import { colors } from '@/src/theme/tokens';

interface Props {
  error: unknown;
  onRetry?: () => void;
}

export function DashboardError({ error, onRetry }: Props) {
  return (
    <Card>
      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <Text style={{ color: colors.danger, fontSize: 14, fontWeight: '600', marginBottom: 6 }}>
          Veri yüklenemedi
        </Text>
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 13,
            textAlign: 'center',
            lineHeight: 18,
          }}>
          {extractErrorMessage(error, 'Sunucuya ulaşılamadı.')}
        </Text>
        {onRetry ? (
          <Button title="Tekrar Dene" variant="secondary" style={{ marginTop: 12 }} onPress={onRetry} />
        ) : null}
      </View>
    </Card>
  );
}
