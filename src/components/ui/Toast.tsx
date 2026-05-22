import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '@/src/theme/tokens';

export type ToastTone = 'success' | 'error' | 'info';

interface ToastState {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  show: (message: string, tone?: ToastTone) => void;
  hide: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 3500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    Animated.timing(opacity, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => setToast(null));
  }, [opacity]);

  const show = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast({ id: Date.now(), message, tone });
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
      timerRef.current = setTimeout(hide, TOAST_DURATION);
    },
    [opacity, hide]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.wrapper, { top: insets.top + 16, opacity }]}>
          <Pressable
            onPress={hide}
            accessibilityRole="alert"
            accessibilityLabel={toast.message}
            style={[styles.toast, toneStyles[toast.tone]]}>
            <View style={[styles.dot, dotStyles[toast.tone]]} />
            <Text style={styles.message} numberOfLines={3}>
              {toast.message}
            </Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radius.input,
    borderWidth: 1,
    maxWidth: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  message: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});

const toneStyles = StyleSheet.create({
  success: {
    backgroundColor: colors.surface[800],
    borderColor: colors.accent.DEFAULT,
  },
  error: {
    backgroundColor: colors.surface[800],
    borderColor: colors.danger,
  },
  info: {
    backgroundColor: colors.surface[800],
    borderColor: colors.border,
  },
});

const dotStyles = StyleSheet.create({
  success: { backgroundColor: colors.accent.DEFAULT },
  error: { backgroundColor: colors.danger },
  info: { backgroundColor: colors.text.secondary },
});
