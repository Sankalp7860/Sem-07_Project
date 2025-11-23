import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { analyzeJobPosting, JobFraudResult } from '@/lib/openai';
import { Button } from '@/components/Button';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react-native';

export default function JobCheckScreen() {
  const router = useRouter();
  const [jobText, setJobText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<JobFraudResult | null>(null);

  const analyzeJob = async () => {
    if (!jobText.trim()) {
      Alert.alert('No Text', 'Please enter a job posting to analyze.');
      return;
    }

    setAnalyzing(true);
    try {
      const analysisResult = await analyzeJobPosting(jobText);
      setResult(analysisResult);
    } catch (error: any) {
      Alert.alert('Analysis Failed', error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const getResultColor = (resultType: string) => {
    switch (resultType) {
      case 'Safe':
        return styles.safeText;
      case 'Possibly Fake':
        return styles.warningText;
      case 'Likely Fake':
        return styles.dangerText;
      default:
        return styles.neutralText;
    }
  };

  const getResultBg = (resultType: string) => {
    switch (resultType) {
      case 'Safe':
        return styles.safeBg;
      case 'Possibly Fake':
        return styles.warningBg;
      case 'Likely Fake':
        return styles.dangerBg;
      default:
        return styles.neutralBg;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.flex}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Job Fraud Detection</Text>
          </View>
          <Text style={styles.headerSubtitle}>
            Analyze job postings for potential scams
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Job Posting Text</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Paste the job posting here..."
              placeholderTextColor="#9ca3af"
              value={jobText}
              onChangeText={setJobText}
              multiline
              textAlignVertical="top"
            />
          </View>

          <Button
            title="Analyze Job Posting"
            onPress={analyzeJob}
            loading={analyzing}
            style={styles.analyzeButton}
          />

          {result && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Analysis Results</Text>

              <View style={[styles.resultBadge, getResultBg(result.result)]}>
                <View style={styles.badgeContent}>
                  {result.result === 'Safe' ? (
                    <CheckCircle color="#16a34a" size={28} />
                  ) : (
                    <AlertTriangle
                      color={
                        result.result === 'Likely Fake'
                          ? '#dc2626'
                          : '#f59e0b'
                      }
                      size={28}
                    />
                  )}
                  <Text
                    style={[
                      styles.resultText,
                      getResultColor(result.result),
                    ]}
                  >
                    {result.result}
                  </Text>
                </View>
              </View>

              <ScoreGauge score={result.scamScore} />

              {result.redFlags.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Red Flags</Text>
                  <View style={styles.flagsList}>
                    {result.redFlags.map((flag, index) => (
                      <View
                        key={index}
                        style={styles.flagItem}
                      >
                        <AlertTriangle color="#dc2626" size={20} />
                        <Text style={styles.flagText}>{flag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {result.recommendations.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Recommendations</Text>
                  <View style={styles.recsList}>
                    {result.recommendations.map((rec, index) => (
                      <View
                        key={index}
                        style={styles.recItem}
                      >
                        <CheckCircle color="#2563eb" size={20} />
                        <Text style={styles.recText}>{rec}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.explanationBox}>
                <Text style={styles.explanationLabel}>
                  Detailed Explanation
                </Text>
                <Text style={styles.explanationText}>
                  {result.explanation}
                </Text>
              </View>
            </View>
          )}
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
    backgroundColor: '#7c3aed',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#e9d5ff',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  inputCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 200,
    textAlignVertical: 'top',
    color: '#111827',
  },
  analyzeButton: {
    marginBottom: 24,
    backgroundColor: '#7c3aed',
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  resultBadge: {
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 24,
  },
  safeBg: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  warningBg: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  dangerBg: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  neutralBg: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  safeText: {
    color: '#16a34a',
  },
  warningText: {
    color: '#c2410c',
  },
  dangerText: {
    color: '#dc2626',
  },
  neutralText: {
    color: '#374151',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  flagsList: {
    gap: 12,
  },
  flagItem: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    color: '#dc2626',
    marginLeft: 12,
    flex: 1,
  },
  recsList: {
    gap: 12,
  },
  recItem: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recText: {
    color: '#1e40af',
    marginLeft: 12,
    flex: 1,
  },
  explanationBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  explanationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  explanationText: {
    color: '#4b5563',
    lineHeight: 24,
  },
});
