import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .maybeSingle();

      setTimeout(() => {
        if (profile?.onboarding_completed) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }, 3500);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setTimeout(() => {
        router.replace('/onboarding');
      }, 3500);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=800' }}
        style={styles.backgroundImage}
        resizeMode="cover"
        onLoad={() => setImageLoaded(true)}>
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}>
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}>
            <View style={styles.logoContainer}>
              <View style={styles.logoBox}>
                <Text style={styles.logoTextMK}>MK</Text>
                <Text style={styles.logoTextForm}>FORM</Text>
              </View>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.mainText}>LIBÈRE</Text>
              <Text style={styles.mainText}>TON</Text>
              <Text style={styles.mainText}>POTENTIEL</Text>
            </View>

            <View style={styles.goButton}>
              <Text style={styles.goButtonText}>GO</Text>
            </View>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 100,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  logoBox: {
    width: 140,
    height: 140,
    borderWidth: 3,
    borderColor: '#D4AF37',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  logoTextMK: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  logoTextForm: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainText: {
    fontSize: 72,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    lineHeight: 80,
    textTransform: 'uppercase',
  },
  goButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  goButtonText: {
    fontSize: 52,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: 1,
  },
});
