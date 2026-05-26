import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/src/store/auth';
import { AppDrawerContent } from '@/src/components/navigation/AppDrawerContent';
import { colors } from '@/src/theme/tokens';

export default function AppLayout() {
  const { token, user } = useAuthStore();

  if (!token || !user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <AppDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.surface[900] },
          drawerStyle: {
            backgroundColor: colors.surface[900],
            width: 280,
          },
        }}
      />
    </GestureHandlerRootView>
  );
}
