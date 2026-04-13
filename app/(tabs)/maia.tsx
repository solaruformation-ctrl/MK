import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Sparkles } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Bonjour ! Je suis Maïa, votre coach personnel IA. Comment puis-je vous aider aujourd'hui ?",
    isUser: false,
    timestamp: new Date(),
  },
];

export default function MaiaScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('programme') || input.includes('entraînement')) {
      return "Excellent ! Basé sur vos objectifs, je recommande un programme HIIT 3 fois par semaine combiné avec du renforcement musculaire. Voulez-vous que je vous crée un planning personnalisé ?";
    }
    if (input.includes('nutrition') || input.includes('manger')) {
      return "Pour optimiser vos résultats, privilégiez les protéines maigres, les légumes et les glucides complexes. Souhaitez-vous un plan nutritionnel adapté à vos entraînements ?";
    }
    if (input.includes('motivé') || input.includes('motivation')) {
      return "Votre progression est impressionnante ! Vous avez déjà accompli 85% de vos objectifs ce mois-ci. Continuez comme ça, champion ! 💪";
    }
    if (input.includes('repos') || input.includes('récupération')) {
      return "La récupération est cruciale ! Je vous conseille une journée de repos active demain avec du yoga ou de la marche légère. Votre corps vous remerciera.";
    }

    return "C'est une excellente question ! Je suis là pour vous accompagner dans votre parcours fitness. N'hésitez pas à me demander des conseils sur l'entraînement, la nutrition ou la récupération.";
  };

  const quickQuestions = [
    "Programme personnalisé",
    "Conseils nutrition",
    "Motivation du jour",
    "Repos et récupération",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}>
      <LinearGradient
        colors={[Colors.black, Colors.gray]}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.aiIcon}>
            <Sparkles size={28} color={Colors.gold} strokeWidth={2.5} />
          </View>
          <View>
            <Text style={styles.title}>Maïa</Text>
            <Text style={styles.subtitle}>Votre coach IA</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.isUser ? styles.userBubble : styles.aiBubble,
            ]}>
            {!message.isUser && (
              <View style={styles.aiAvatar}>
                <Sparkles size={16} color={Colors.gold} strokeWidth={2.5} />
              </View>
            )}
            <View style={[
              styles.messageContent,
              message.isUser ? styles.userContent : styles.aiContent,
            ]}>
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userText : styles.aiText,
              ]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {messages.length === 1 && (
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>Questions rapides :</Text>
            {quickQuestions.map((question, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleQuickQuestion(question)}
                activeOpacity={0.7}>
                <View style={styles.quickQuestionChip}>
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Posez votre question..."
            placeholderTextColor={Colors.grayText}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={sendMessage}
            activeOpacity={0.7}
            style={[
              styles.sendButton,
              inputText.trim() === '' && styles.sendButtonDisabled,
            ]}
            disabled={inputText.trim() === ''}>
            <LinearGradient
              colors={inputText.trim() !== '' ? [Colors.gold, Colors.goldDark] : [Colors.grayLight, Colors.grayLight]}
              style={styles.sendButtonGradient}>
              <Send
                size={20}
                color={inputText.trim() !== '' ? Colors.black : Colors.grayText}
                strokeWidth={2.5}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  aiIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.gold,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gold,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageBubble: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  aiBubble: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gold + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.gold,
  },
  messageContent: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userContent: {
    backgroundColor: Colors.gold,
    borderBottomRightRadius: 4,
  },
  aiContent: {
    backgroundColor: Colors.grayLight,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 21,
  },
  userText: {
    color: Colors.black,
    fontWeight: '600',
  },
  aiText: {
    color: Colors.white,
  },
  quickQuestionsContainer: {
    marginTop: 20,
  },
  quickQuestionsTitle: {
    fontSize: 14,
    color: Colors.grayText,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickQuestionChip: {
    backgroundColor: Colors.grayLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  quickQuestionText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    padding: 15,
    backgroundColor: Colors.black,
    borderTopWidth: 1,
    borderTopColor: Colors.gold + '30',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.grayLight,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
  },
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: 15,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
