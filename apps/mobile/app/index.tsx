import { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to dashboard after 2 seconds
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo-yellow.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d29', // Exact dark navy from design
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 200,
  },
});
