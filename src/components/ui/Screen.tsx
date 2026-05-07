import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  View,
  type ScrollViewProps,
  type ViewProps,
} from 'react-native';
import { SafeAreaView, type SafeAreaViewProps } from 'react-native-safe-area-context';
import { colors, spacing } from '@/src/theme/tokens';

interface ScreenProps extends Omit<ViewProps, 'style'> {
  scroll?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  edges?: SafeAreaViewProps['edges'];
  padded?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function Screen({
  scroll = false,
  contentContainerStyle,
  edges,
  padded = true,
  refreshing,
  onRefresh,
  children,
  ...rest
}: ScreenProps) {
  const padding = padded ? spacing.screen : 0;
  return (
    <SafeAreaView
      edges={edges ?? ['top', 'left', 'right']}
      style={{ flex: 1, backgroundColor: colors.surface[900] }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[{ padding, flexGrow: 1 }, contentContainerStyle]}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={!!refreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.accent.DEFAULT}
                  colors={[colors.accent.DEFAULT]}
                />
              ) : undefined
            }
            {...(rest as ScrollViewProps)}>
            {children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1, padding }} {...rest}>
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
