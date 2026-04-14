import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, Dumbbell } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/auth';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        console.log('ERREUR LOGIN:', error.message);
        Alert.alert('Erreur de connexion', error.message === 'Invalid login credentials'
          ? 'Email ou mot de passe incorrect'
          : error.message);
      } else {
        console.log('LOGIN OK - session devrait se mettre à jour');
      }
    }

    setLoading(false);
  };

  return (
    <LinearGradient colors={[Colors.black, Colors.gray]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Logo / Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Dumbbell size={48} color={Colors.gold} strokeWidth={2} />
            </View>
            <Text style={styles.appName}>MK FORM</Text>
            <Text style={styles.tagline}>Votre coaching personnalisé</Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {isLogin ? 'Connexion' : 'Créer un compte'}
            </Text>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Mail size={20} color={Colors.grayText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={Colors.grayText}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Mot de passe */}
            <View style={styles.inputContainer}>
              <Lock size={20} color={Colors.grayText} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={Colors.grayText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color={Colors.grayText} />
                ) : (
                  <Eye size={20} color={Colors.grayText} />
                )}
              </TouchableOpacity>
            </View>

            {/* Confirmer mot de passe (inscription) */}
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Lock size={20} color={Colors.grayText} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor={Colors.grayText}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Bouton principal */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={loading}>
              <LinearGradient
                colors={[Colors.gold, '#D4A843']}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                {loading ? (
                  <ActivityIndicator color={Colors.black} />
                ) : (
                  <Text style={styles.submitText}>
                    {isLogin ? 'Se connecter' : "S'inscrire"}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Mot de passe oublié */}
            {isLogin && (
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            )}

            {/* Switch login/signup */}
            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                {isLogin ? "Pas encore de compte ?" : 'Déjà un compte ?'}
              </Text>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.switchLink}>
                  {isLogin ? "S'inscrire" : 'Se connecter'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 14,
    color: Colors.grayText,
    marginTop: 8,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 16,
    height: '100%',
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  submitText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotText: {
    color: Colors.grayText,
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  switchText: {
    color: Colors.grayText,
    fontSize: 14,
  },
  switchLink: {
    color: Colors.gold,
    fontSize: 14,
    fontWeight: '600',
  },
});