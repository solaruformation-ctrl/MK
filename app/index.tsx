import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/auth';

export default function Index() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (session) {
      // User connecté → aller à l'app
      router.replace('/(tabs)');
    } else {
      // Pas connecté → aller au login
      router.replace('/login');
    }
  }, [session, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.gold} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
  },
});