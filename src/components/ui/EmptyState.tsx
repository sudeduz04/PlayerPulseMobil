import { Text, View } from 'react-native';
import { colors } from '@/src/theme/tokens';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
      }}>
      {icon ? <View style={{ marginBottom: 12 }}>{icon}</View> : null}
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
        }}>
        {title}
      </Text>
      {description ? (
        <Text
          style={{
            color: colors.text.secondary,
            fontSize: 13,
            textAlign: 'center',
            marginTop: 6,
            lineHeight: 18,
          }}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <EmptyState
      title="Bir şeyler ters gitti"
      description={message ?? 'Sunucuya ulaşılamadı, bağlantını kontrol et.'}
    />
  );
}
