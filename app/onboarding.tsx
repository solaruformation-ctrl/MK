import { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Check, Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

const { width, height } = Dimensions.get('window');

type Question = {
  id: number;
  text: string;
  type: 'welcome' | 'single' | 'multiple' | 'number' | 'scale' | 'text';
  options?: string[];
  field?: string;
  placeholder?: string;
};

const questions: Question[] = [
  {
    id: 0,
    text: "Bienvenue dans l'aventure ! 🚀\n\nAvant de t'accompagner dans ta transformation, nous allons configurer ton profil pour créer un programme 100% personnalisé.\n\nCela prend moins de 2 minutes !",
    type: 'welcome',
  },
  {
    id: 1,
    text: "Commençons simple : quel âge as-tu ?",
    type: 'number',
    field: 'age',
    placeholder: 'Ton âge',
  },
  {
    id: 2,
    text: "Comment te définis-tu ?",
    type: 'single',
    field: 'gender',
    options: ['Homme', 'Femme', 'Autre'],
  },
  {
    id: 3,
    text: "À quel moment de la journée as-tu le plus d'énergie ?",
    type: 'single',
    field: 'biorhythm',
    options: ['Matin', 'Après-midi', 'Soir'],
  },
  {
    id: 4,
    text: "Sur une échelle de 1 à 5, comment évalues-tu ton niveau d'énergie général ?",
    type: 'scale',
    field: 'energy_level',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 5,
    text: "Comment décrirais-tu ton niveau actuel ?",
    type: 'single',
    field: 'activity_level',
    options: ['Débutant', 'Intermédiaire', 'Confirmé'],
  },
  {
    id: 6,
    text: "Combien de fois par semaine t'entraînes-tu actuellement ?",
    type: 'scale',
    field: 'weekly_frequency',
    options: ['1', '2', '3', '4', '5', '6', '7+'],
  },
  {
    id: 7,
    text: "Où préfères-tu t'entraîner ?",
    type: 'single',
    field: 'practice_location',
    options: ['Salle', 'Maison', 'Extérieur', 'Coach', 'Collectif'],
  },
  {
    id: 8,
    text: "Quels sont tes objectifs ? (tu peux en choisir plusieurs)",
    type: 'multiple',
    field: 'goals',
    options: [
      'Perte de poids',
      'Prise de muscle',
      'Remise en forme',
      'Cardio',
      'Mental / Motivation',
      'Bien-être global',
      'Réduction du stress',
    ],
  },
  {
    id: 9,
    text: "Tu t'entraînes plutôt...",
    type: 'single',
    field: 'training_environment',
    options: ['À la maison', 'En salle'],
  },
  {
    id: 10,
    text: "Quel matériel as-tu à disposition ? (choix multiples)",
    type: 'multiple',
    field: 'available_equipment',
    options: ['Haltères', 'Barre', 'Corde', 'Poids du corps', 'Machines', 'Aucun'],
  },
  {
    id: 11,
    text: "Sur une échelle de 1 à 5, quel est ton niveau de stress actuel ?",
    type: 'scale',
    field: 'stress_level',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 12,
    text: "Qu'est-ce qui te motive le plus ? (choix multiples)",
    type: 'multiple',
    field: 'main_motivations',
    options: ['Santé', 'Esthétique', 'Performance', 'Bien-être mental', 'Confiance en soi'],
  },
  {
    id: 13,
    text: "Quels sont tes principaux freins ? (choix multiples)",
    type: 'multiple',
    field: 'main_obstacles',
    options: ['Manque de temps', 'Motivation', 'Fatigue', 'Connaissances', 'Discipline'],
  },
  {
    id: 14,
    text: "Comment décrirais-tu ton mode de vie ?",
    type: 'single',
    field: 'lifestyle_mode',
    options: ['Actif', 'Modéré', 'Sédentaire'],
  },
  {
    id: 15,
    text: "Quels sont tes objectifs nutritionnels ? (choix multiples)",
    type: 'multiple',
    field: 'nutrition_goals',
    options: ['Perte de poids', 'Prise de masse', 'Maintien', 'Rééquilibrage', 'Performance'],
  },
  {
    id: 16,
    text: "Comment évalues-tu la qualité de ton sommeil ? (1 à 5)",
    type: 'scale',
    field: 'sleep_quality',
    options: ['1', '2', '3', '4', '5'],
  },
  {
    id: 17,
    text: "As-tu des restrictions alimentaires ou allergies ? (optionnel)",
    type: 'text',
    field: 'restrictions_allergies',
    placeholder: 'Ex: Lactose, Gluten...',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [visibleQuestions, setVisibleQuestions] = useState<number[]>([0]);

  const bubbleAnimations = useRef<{ [key: number]: Animated.Value }>(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: new Animated.Value(0) }), {})
  ).current;

  useEffect(() => {
    if (visibleQuestions.includes(currentQuestion)) {
      Animated.spring(bubbleAnimations[currentQuestion], {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [visibleQuestions, currentQuestion]);

  const handleAnswer = (field: string | undefined, value: any) => {
    if (!field) {
      nextQuestion();
      return;
    }

    const question = questions[currentQuestion];

    if (question.type === 'multiple') {
      const currentValues = answers[field] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: any) => v !== value)
        : [...currentValues, value];
      setAnswers({ ...answers, [field]: newValues });
    } else {
      setAnswers({ ...answers, [field]: value });
      setTimeout(() => nextQuestion(), 300);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      setVisibleQuestions([...visibleQuestions, nextQ]);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      const profileData: any = { ...answers };

      if (answers.weekly_frequency === '7+') {
        profileData.weekly_frequency = 7;
      } else if (answers.weekly_frequency) {
        profileData.weekly_frequency = parseInt(answers.weekly_frequency);
      }

      ['age', 'energy_level', 'stress_level', 'sleep_quality'].forEach(field => {
        if (answers[field]) {
          profileData[field] = parseInt(answers[field]);
        }
      });

      await supabase.from('user_profiles').insert({
        ...profileData,
        onboarding_completed: true,
      });

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const renderBubble = (question: Question, index: number) => {
    const isVisible = visibleQuestions.includes(index);
    if (!isVisible) return null;

    const animation = bubbleAnimations[question.id];
    const isActive = currentQuestion === index;

    return (
      <Animated.View
        key={question.id}
        style={[
          styles.bubbleContainer,
          {
            opacity: animation,
            transform: [
              {
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{question.text}</Text>
        </View>

        {isActive && question.type !== 'welcome' && (
          <Animated.View
            style={[
              styles.answersContainer,
              {
                opacity: animation,
              },
            ]}>
            {renderAnswerInput(question)}
          </Animated.View>
        )}

        {isActive && question.type === 'welcome' && (
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => nextQuestion()}
            activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.gold, Colors.goldDark]}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text style={styles.startButtonText}>C'est parti !</Text>
              <Sparkles size={20} color={Colors.black} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {isActive && question.type === 'multiple' && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => nextQuestion()}
            activeOpacity={0.8}>
            <Text style={styles.continueButtonText}>Continuer</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  };

  const renderAnswerInput = (question: Question) => {
    const currentValue = answers[question.field!];

    switch (question.type) {
      case 'single':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  currentValue === option && styles.optionButtonSelected,
                ]}
                onPress={() => handleAnswer(question.field, option)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.optionText,
                    currentValue === option && styles.optionTextSelected,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'multiple':
        const selectedValues = currentValue || [];
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    isSelected && styles.optionButtonSelected,
                  ]}
                  onPress={() => handleAnswer(question.field, option)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}>
                    {option}
                  </Text>
                  {isSelected && (
                    <Check size={18} color={Colors.black} strokeWidth={2.5} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        );

      case 'scale':
        return (
          <View style={styles.scaleContainer}>
            {question.options?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.scaleButton,
                  currentValue === option && styles.scaleButtonSelected,
                ]}
                onPress={() => handleAnswer(question.field, option)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.scaleText,
                    currentValue === option && styles.scaleTextSelected,
                  ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'number':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={question.placeholder}
              placeholderTextColor={Colors.grayText}
              keyboardType="numeric"
              value={currentValue?.toString() || ''}
              onChangeText={(text) => setAnswers({ ...answers, [question.field!]: text })}
              autoFocus
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => nextQuestion()}
              disabled={!currentValue}
              activeOpacity={0.7}>
              <LinearGradient
                colors={currentValue ? [Colors.gold, Colors.goldDark] : [Colors.grayLight, Colors.grayLight]}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text style={styles.submitButtonText}>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );

      case 'text':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, styles.textInput]}
              placeholder={question.placeholder}
              placeholderTextColor={Colors.grayText}
              value={currentValue || ''}
              onChangeText={(text) => setAnswers({ ...answers, [question.field!]: text })}
              multiline
              autoFocus
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => nextQuestion()}
              activeOpacity={0.7}>
              <LinearGradient
                colors={[Colors.gold, Colors.goldDark]}
                style={styles.submitButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}>
                <Text style={styles.submitButtonText}>OK</Text>
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>
      <LinearGradient
        colors={[Colors.black, Colors.gray]}
        style={styles.gradient}>

        <View style={styles.header}>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <LinearGradient
                colors={[Colors.gold, Colors.goldDark]}
                style={[
                  styles.progressBarFill,
                  { width: `${(currentQuestion / (questions.length - 1)) * 100}%` },
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={styles.progressText}>
              {currentQuestion} / {questions.length - 1}
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {questions.map((question, index) => renderBubble(question, index))}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  progressBarBackground: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.grayLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gold,
    minWidth: 60,
    textAlign: 'right',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  bubbleContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  bubble: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    padding: 20,
    maxWidth: width * 0.85,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleText: {
    fontSize: 17,
    lineHeight: 26,
    color: Colors.white,
    fontWeight: '600',
  },
  answersContainer: {
    marginTop: 15,
    width: '100%',
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonSelected: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  optionTextSelected: {
    color: Colors.black,
  },
  scaleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  scaleButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.grayLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scaleButtonSelected: {
    backgroundColor: Colors.gold,
    borderColor: Colors.gold,
  },
  scaleText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.white,
  },
  scaleTextSelected: {
    color: Colors.black,
  },
  inputContainer: {
    gap: 12,
  },
  input: {
    backgroundColor: Colors.grayLight,
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: Colors.white,
    fontWeight: '600',
    borderWidth: 2,
    borderColor: Colors.gold + '30',
  },
  textInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.black,
  },
  startButton: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  startButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.black,
  },
  continueButton: {
    marginTop: 15,
    backgroundColor: Colors.gold,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    alignSelf: 'flex-start',
    minWidth: 150,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.black,
  },
  bottomSpacer: {
    height: 100,
  },
});
