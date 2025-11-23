import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, Bot, User } from 'lucide-react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hi! I'm your Fraud Prevention Assistant. Ask me anything about:\n\n• Identifying job scams\n• Recognizing deepfakes\n• Online fraud prevention\n• Digital security tips\n\nHow can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const prompt = `You are a helpful fraud prevention assistant specializing in online fraud, job scams, deepfakes, and digital security. 
      
User question: ${userMessage.text}

Provide a clear, concise, and helpful response. Keep it friendly and informative. If the question is not related to fraud prevention or security, politely redirect the conversation back to these topics.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botText = response.text();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#6366f1', '#8b5cf6']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.botIcon}>
            <Bot color="white" size={28} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Fraud Prevention Assistant</Text>
            <Text style={styles.headerSubtitle}>
              Ask me about online safety
            </Text>
          </View>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === 'user'
                  ? styles.userBubble
                  : styles.botBubble,
              ]}
            >
              <View style={styles.messageHeader}>
                {message.sender === 'bot' ? (
                  <View style={styles.botAvatar}>
                    <Bot color="#6366f1" size={16} />
                  </View>
                ) : (
                  <View style={styles.userAvatar}>
                    <User color="white" size={16} />
                  </View>
                )}
                <Text style={styles.senderName}>
                  {message.sender === 'user' ? 'You' : 'Assistant'}
                </Text>
              </View>
              <Text
                style={[
                  styles.messageText,
                  message.sender === 'user'
                    ? styles.userText
                    : styles.botText,
                ]}
              >
                {message.text}
              </Text>
            </View>
          ))}
          {loading && (
            <View style={[styles.messageBubble, styles.botBubble]}>
              <View style={styles.messageHeader}>
                <View style={styles.botAvatar}>
                  <Bot color="#6366f1" size={16} />
                </View>
                <Text style={styles.senderName}>Assistant</Text>
              </View>
              <View style={styles.loadingDots}>
                <ActivityIndicator color="#6366f1" size="small" />
                <Text style={styles.loadingText}>Thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask about fraud prevention..."
              placeholderTextColor="#9ca3af"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              editable={!loading}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || loading) && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || loading}
            >
              <Send
                color={!inputText.trim() || loading ? '#9ca3af' : 'white'}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    marginBottom: 16,
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  botAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#111827',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#6b7280',
    fontSize: 14,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f3f4f6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
});
