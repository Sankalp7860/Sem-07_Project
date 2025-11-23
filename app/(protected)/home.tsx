import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/Button';
import { Shield, Camera, Briefcase, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.flex}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>TruthGuard</Text>
              <Text style={styles.headerSubtitle}>{user?.email || 'User'}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <LogOut color="white" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.headerTagline}>
            <Shield color="white" size={32} />
            <Text style={styles.headerText}>AI-Powered Fraud Detection</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Detection Tools</Text>
          <Text style={styles.sectionSubtitle}>
            Choose a tool to analyze and detect fraud
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/(protected)/deepfake')}
            style={styles.cardButton}
          >
            <View style={styles.cardIcon}>
              <View style={styles.iconBox1}>
                <Camera color="#6366f1" size={32} />
              </View>
              <View style={styles.cardTextContent}>
                <Text style={styles.cardTitle}>Deepfake Detection</Text>
                <Text style={styles.cardDescription}>
                  Analyze images and videos for AI-generated content
                </Text>
              </View>
            </View>
            <View style={styles.cardBadge1}>
              <Text style={styles.badgeText1}>Powered by Reality Defender</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(protected)/jobcheck')}
            style={styles.cardButton}
          >
            <View style={styles.cardIcon}>
              <View style={styles.iconBox2}>
                <Briefcase color="#8b5cf6" size={32} />
              </View>
              <View style={styles.cardTextContent}>
                <Text style={styles.cardTitle}>Job Fraud Detection</Text>
                <Text style={styles.cardDescription}>
                  Check job postings for signs of scams and fraud
                </Text>
              </View>
            </View>
            <View style={styles.cardBadge2}>
              <Text style={styles.badgeText2}>Powered by Google Gemini</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Stay Protected</Text>
            <Text style={styles.infoText}>
              Use our AI-powered tools to verify content authenticity and
              protect yourself from online fraud and deception.
            </Text>
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#c7d2fe',
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 12,
  },
  headerTagline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#4b5563',
    marginBottom: 24,
  },
  cardButton: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  cardIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox1: {
    backgroundColor: '#e0e7ff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
  },
  iconBox2: {
    backgroundColor: '#ede9fe',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
  },
  cardTextContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },
  cardBadge1: {
    backgroundColor: '#e0e7ff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardBadge2: {
    backgroundColor: '#ede9fe',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  badgeText1: {
    color: '#4338ca',
    fontWeight: '500',
    fontSize: 13,
  },
  badgeText2: {
    color: '#6d28d9',
    fontWeight: '500',
    fontSize: 13,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  infoText: {
    color: '#4b5563',
    lineHeight: 24,
  },
});
