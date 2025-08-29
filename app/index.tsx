import { Redirect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function IndexPage() {
  const { user, isLoading, checkAuthStatus } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   checkAuthStatus();
  // }, []);

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (user) {
  //       router.replace('/(app)/dashboard');
  //     } else {
  //       router.replace('/(auth)/login');
  //     }
  //   }
  // }, [user, isLoading, router]);

  return (
    <Redirect href="/(tabs)/home" />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    marginTop: 16,
    fontWeight: '500',
  },
});