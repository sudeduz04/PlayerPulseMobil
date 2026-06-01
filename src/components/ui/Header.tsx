import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { navigateBack } from '@/src/lib/navigation';
import { colors, radius } from '@/src/theme/tokens';

interface HeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  backFallback?: string;
  /** Force-hide the drawer menu button. Defaults to always show. */
  showMenu?: boolean;
}

export function Header({
  eyebrow,
  title,
  subtitle,
  trailing,
  backFallback,
  showMenu = true,
}: HeaderProps) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {showMenu ? (
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            accessibilityRole="button"
            accessibilityLabel="Menüyü aç"
            style={styles.iconButton}>
            <Ionicons name="menu" size={22} color={colors.text.primary} />
          </Pressable>
        ) : null}
        {backFallback ? (
          <Pressable
            onPress={() => navigateBack(backFallback)}
            accessibilityRole="button"
            accessibilityLabel="Geri"
            style={styles.iconButton}>
            <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface[800],
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  titleBlock: {
    flex: 1,
  },
  eyebrow: {
    color: colors.accent.DEFAULT,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: 4,
  },
});
