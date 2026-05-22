import { Component, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
    if (__DEV__) {
      console.error('[RootErrorBoundary]', error);
    }
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Uygulama hatası</Text>
        <Text style={styles.message}>
          {this.state.error.message || 'Bilinmeyen bir hata oluştu.'}
        </Text>
        <Pressable
          onPress={() => this.setState({ error: null })}
          accessibilityRole="button"
          accessibilityLabel="Tekrar dene"
          style={styles.button}>
          <Text style={styles.buttonText}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface[900],
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  message: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.accent.DEFAULT,
    borderRadius: radius.input,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#062b14',
    fontWeight: '700',
  },
});
