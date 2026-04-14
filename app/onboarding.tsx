import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Check, Sparkles, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/auth';

const { width } = Dimensions.get('window');

type Step = {
  id: number;
  title: string;
  subtitle?: string;
  type: 'welcome' | 'single' | 'multiple' | 'number' | 'scale';
  field?: string;
  options?: { label: string; value: string }[];
  unit?: string;
  placeholder?: string;
};

const steps: Step[] = [
  {
    id: 0,
    title: "Bienvenue dans MK Form ! 🚀",
    subtitle: "On va configurer ton programme personnalisé en quelques questions. C'est parti !",
    type: 'welcome',
  },
  {
    id: 1,
    title: "Quel est ton objectif principal ?",
    type: 'single',
    field: 'goals',
    options: [
      { label: '🔥 Perdre du poids', value: 'perte_poids' },
      { label: '💪 Prendre du muscle', value: 'prise_muscle' },
      { label: '🏃 Remise en forme', value: 'remise_forme' },
      { label: '🧘 Bien-être & santé', value: 'bien_etre' },
      { label: '⚡ Performance sportive', value: 'performance' },
    ],
  },
  {
    id: 2,
    title: "Quel est ton niveau ?",
    type: 'single',
    field: 'fitness_level',
    options: [
      { label: '🌱 Débutant — Je commence', value: 'debutant' },
      { label: '🌿 Intermédiaire — Je pratique régulièrement', value: 'intermediaire' },
      { label: '🌳 Confirmé — Je m\'entraîne depuis longtemps', value: 'confirme' },
    ],
  },
  {
    id: 3,
    title: "Combien de séances par semaine ?",
    type: 'scale',
    field: 'weekly_frequency',
    options: [
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6+', value: '6' },
    ],
  },
  {
    id: 4,
    title: "Tu t'entraînes où ?",
    type: 'single',
    field: 'practice_location',
    options: [
      { label: '🏠 À la maison', value: 'maison' },
      { label: '🏋️ En salle', value: 'salle' },
      { label: '🌳 En extérieur', value: 'exterieur' },
      { label: '🔄 Un peu partout', value: 'mixte' },
    ],
  },
  {
    id: 5,
    title: "Quel matériel as-tu ?",
    subtitle: "Sélectionne tout ce que tu as",
    type: 'multiple',
    field: 'available_equipment',
    options: [
      { label: 'Haltères', value: 'halteres' },
      { label: 'Barre & poids', value: 'barre' },
      { label: 'Bandes élastiques', value: 'elastiques' },
      { label: 'Corde à sauter', value: 'corde' },
      { label: 'Machines', value: 'machines' },
      { label: 'Tapis de yoga', value: 'tapis' },
      { label: 'Rien (poids du corps)', value: 'aucun' },
    ],
  },
  {
    id: 6,
    title: "Tu préfères t'entraîner quand ?",
    type: 'single',
    field: 'preferred_time',
    options: [
      { label: '🌅 Le matin', value: 'matin' },
      { label: '☀️ L\'après-midi', value: 'apres-midi' },
      { label: '🌙 Le soir', value: 'soir' },
    ],
  },
  {
    id: 7,
    title: "Dernière étape — ton profil",
    subtitle: "Ces infos aident l'IA à personnaliser ton programme",
    type: 'number',
    field: 'body_info',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateProfile, refreshProfile } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [saving, setSaving] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      callback();
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    });
  };

  const handleSingleSelect = (field: string, value: string) => {
    if (field === 'goals') {
      setAnswers({ ...answers, [field]: [value] });
    } else {
      setAnswers({ ...answers, [field]: value });
    }
    setTimeout(() => goNext(), 300);
  };

  const handleMultiSelect = (field: string, value: string) => {
    const current = answers[field] || [];
    if (value === 'aucun') {
      setAnswers({ ...answers, [field]: ['aucun'] });
      return;
    }
    const filtered = current.filter((v: string) => v !== 'aucun');
    const updated = filtered.includes(value)
      ? filtered.filter((v: string) => v !== value)
      : [...filtered, value];
    setAnswers({ ...answers, [field]: updated });
  };

  const handleScaleSelect = (field: string, value: string) => {
    setAnswers({ ...answers, [field]: parseInt(value) });
    setTimeout(() => goNext(), 300);
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      animateTransition(() => setCurrentStep(currentStep + 1));
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      animateTransition(() => setCurrentStep(currentStep - 1));
    }
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const profileData: any = {
        ...answers,
        onboarding_completed: true,
      };

      if (age) profileData.age = parseInt(age);
      if (heightCm) profileData.height_cm = parseInt(heightCm);
      if (weightKg) profileData.weight_kg = parseFloat(weightKg);

      const { error } = await updateProfile(profileData);

      if (error) {
        console.error('Error saving profile:', error);
        Alert.alert('Erreur', 'Impossible de sauvegarder le profil. Réessaie.');
        setSaving(false);
        return;
      }

      await refreshProfile();
      router.replace('/(tabs)');
    } catch (e) {
      console.error('Error completing onboarding:', e);
      Alert.alert('Erreur', 'Une erreur est survenue. Réessaie.');
      setSaving(false);
    }
  };

  const step = steps[currentStep];
  const progress = currentStep / (steps.length - 1);

  const renderStepContent = () => {
    switch (step.type) {
      case 'welcome':
        return (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeEmoji}>💪</Text>
            <Text style={styles.welcomeTitle}>{step.title}</Text>
            <Text style={styles.welcomeSubtitle}>{step.subtitle}</Text>
            <TouchableOpacity style={styles.startButton} onPress={goNext}>
              <LinearGradient
                colors={[Colors.gold, Colors.goldDark]}
                style={styles.startGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.startText}>C'est parti !</Text>
                <Sparkles size={20} color={Colors.black} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      case 'single':
        return (
          <View style={styles.optionsContainer}>
            {step.options?.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionCard,
                  answers[step.field!] === opt.value && styles.optionCardSelected,
                  (step.field === 'goals' && answers[step.field!]?.[0] === opt.value) && styles.optionCardSelected,
                ]}
                onPress={() => handleSingleSelect(step.field!, opt.value)}>
                <Text style={[
                  styles.optionLabel,
                  (answers[step.field!] === opt.value || answers[step.field!]?.[0] === opt.value) && styles.optionLabelSelected,
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'multiple':
        const selected = answers[step.field!] || [];
        return (
          <View style={styles.optionsContainer}>
            {step.options?.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => handleMultiSelect(step.field!, opt.value)}>
                  <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                  {isSelected && <Check size={20} color={Colors.black} />}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.continueBtn} onPress={goNext}>
              <Text style={styles.continueBtnText}>Continuer</Text>
              <ChevronRight size={20} color={Colors.black} />
            </TouchableOpacity>
          </View>
        );

      case 'scale':
        return (
          <View style={styles.scaleContainer}>
            {step.options?.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.scaleBtn,
                  answers[step.field!] === parseInt(opt.value) && styles.scaleBtnSelected,
                ]}
                onPress={() => handleScaleSelect(step.field!, opt.value)}>
                <Text style={[
                  styles.scaleText,
                  answers[step.field!] === parseInt(opt.value) && styles.scaleTextSelected,
                ]}>
                  {opt.label}
                </Text>
                <Text style={[
                  styles.scaleSubtext,
                  answers[step.field!] === parseInt(opt.value) && styles.scaleTextSelected,
                ]}>
                  {opt.label === '2' ? 'fois' : opt.label === '6+' ? 'fois' : 'fois'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'number':
        return (
          <View style={styles.bodyInfoContainer}>
            <View style={styles.bodyRow}>
              <Text style={styles.bodyLabel}>Âge</Text>
              <TextInput
                style={styles.bodyInput}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="—"
                placeholderTextColor={Colors.grayText}
                maxLength={3}
              />
              <Text style={styles.bodyUnit}>ans</Text>
            </View>
            <View style={styles.bodyRow}>
              <Text style={styles.bodyLabel}>Taille</Text>
              <TextInput
                style={styles.bodyInput}
                value={heightCm}
                onChangeText={setHeightCm}
                keyboardType="numeric"
                placeholder="—"
                placeholderTextColor={Colors.grayText}
                maxLength={3}
              />
              <Text style={styles.bodyUnit}>cm</Text>
            </View>
            <View style={styles.bodyRow}>
              <Text style={styles.bodyLabel}>Poids</Text>
              <TextInput
                style={styles.bodyInput}
                value={weightKg}
                onChangeText={setWeightKg}
                keyboardType="decimal-pad"
                placeholder="—"
                placeholderTextColor={Colors.grayText}
                maxLength={5}
              />
              <Text style={styles.bodyUnit}>kg</Text>
            </View>
            <TouchableOpacity
              style={[styles.finishBtn, saving && styles.finishBtnDisabled]}
              onPress={handleComplete}
              disabled={saving}>
              <LinearGradient
                colors={[Colors.gold, Colors.goldDark]}
                style={styles.finishGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.finishText}>
                  {saving ? 'Création du programme...' : 'Lancer mon programme 🚀'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={[Colors.black, Colors.gray]} style={styles.gradient}>
        {/* Progress bar */}
        <View style={styles.header}>
          {currentStep > 0 && (
            <TouchableOpacity onPress={goBack} style={styles.backBtn}>
              <Text style={styles.backText}>← Retour</Text>
            </TouchableOpacity>
          )}
          <View style={styles.progressBar}>
            <LinearGradient
              colors={[Colors.gold, Colors.goldDark]}
              style={[styles.progressFill, { width: `${progress * 100}%` }]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            />
          </View>
          <Text style={styles.progressText}>{currentStep}/{steps.length - 1}</Text>
        </View>

        {/* Contenu */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Animated.View style={{ opacity: fadeAnim }}>
            {step.type !== 'welcome' && (
              <View style={styles.questionHeader}>
                <Text style={styles.questionTitle}>{step.title}</Text>
                {step.subtitle && (
                  <Text style={styles.questionSubtitle}>{step.subtitle}</Text>
                )}
              </View>
            )}
            {renderStepContent()}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.black },
  gradient: { flex: 1 },
  header: {
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  backBtn: { paddingVertical: 4 },
  backText: { color: Colors.grayText, fontSize: 14, fontWeight: '600' },
  progressBar: {
    flex: 1, height: 6, backgroundColor: Colors.grayLight,
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { color: Colors.gold, fontSize: 14, fontWeight: '700', minWidth: 36, textAlign: 'right' },
  content: { paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 },

  // Welcome
  welcomeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  welcomeEmoji: { fontSize: 64, marginBottom: 24 },
  welcomeTitle: { fontSize: 28, fontWeight: '800', color: Colors.white, textAlign: 'center', marginBottom: 16 },
  welcomeSubtitle: { fontSize: 16, color: Colors.grayText, textAlign: 'center', lineHeight: 24, marginBottom: 40 },
  startButton: { borderRadius: 16, overflow: 'hidden' },
  startGradient: {
    paddingVertical: 18, paddingHorizontal: 40,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  startText: { fontSize: 18, fontWeight: '800', color: Colors.black },

  // Question
  questionHeader: { marginTop: 20, marginBottom: 24 },
  questionTitle: { fontSize: 24, fontWeight: '800', color: Colors.white, lineHeight: 32 },
  questionSubtitle: { fontSize: 14, color: Colors.grayText, marginTop: 8 },

  // Options
  optionsContainer: { gap: 12 },
  optionCard: {
    backgroundColor: Colors.grayLight, borderRadius: 16, padding: 18,
    borderWidth: 2, borderColor: 'transparent',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  optionCardSelected: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  optionLabel: { fontSize: 16, fontWeight: '700', color: Colors.white, flex: 1 },
  optionLabelSelected: { color: Colors.black },

  // Scale
  scaleContainer: { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  scaleBtn: {
    flex: 1, backgroundColor: Colors.grayLight, borderRadius: 16,
    paddingVertical: 24, alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent',
  },
  scaleBtnSelected: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  scaleText: { fontSize: 24, fontWeight: '800', color: Colors.white },
  scaleTextSelected: { color: Colors.black },
  scaleSubtext: { fontSize: 11, color: Colors.grayText, marginTop: 4 },

  // Continue
  continueBtn: {
    backgroundColor: Colors.gold, borderRadius: 16, padding: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 8,
  },
  continueBtnText: { fontSize: 16, fontWeight: '800', color: Colors.black },

  // Body info
  bodyInfoContainer: { gap: 20 },
  bodyRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.grayLight, borderRadius: 16, padding: 18, gap: 16,
  },
  bodyLabel: { fontSize: 16, fontWeight: '700', color: Colors.white, width: 60 },
  bodyInput: {
    flex: 1, fontSize: 28, fontWeight: '800', color: Colors.gold,
    textAlign: 'center', borderBottomWidth: 2, borderBottomColor: Colors.gold + '40',
    paddingBottom: 4,
  },
  bodyUnit: { fontSize: 14, color: Colors.grayText, width: 30 },

  // Finish
  finishBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 16 },
  finishBtnDisabled: { opacity: 0.7 },
  finishGradient: { paddingVertical: 20, alignItems: 'center' },
  finishText: { fontSize: 18, fontWeight: '800', color: Colors.black },
});