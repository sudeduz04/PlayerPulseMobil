import { Component, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, radius } from '@/src/theme/tokens';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class RootErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('[RootErrorBoundary]', error);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.surface[900],
          padding: 20,
          justifyContent: 'center',
        }}>
        <Text style={{ color: colors.danger, fontSize: 18, fontWeight: '700', marginBottom: 10 }}>
          Uygulama hatasi
        </Text>
        <Text style={{ color: colors.text.secondary, fontSize: 14, lineHeight: 20, marginBottom: 16 }}>
          {this.state.error.message || 'Bilinmeyen bir hata oluştu.'}
        </Text>
        <Pressable
          onPress={() => this.setState({ error: null })}
          style={{
            backgroundColor: colors.accent.DEFAULT,
            borderRadius: radius.input,
            paddingVertical: 14,
            alignItems: 'center',
          }}>
          <Text style={{ color: '#062b14', fontWeight: '700' }}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }
}
