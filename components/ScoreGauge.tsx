import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
}

export function ScoreGauge({ score, maxScore = 100 }: ScoreGaugeProps) {
  const percentage = (score / maxScore) * 100;

  const getBarColor = () => {
    if (percentage <= 30) return '#10b981';
    if (percentage <= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getTextColor = () => {
    if (percentage <= 30) return styles.greenText;
    if (percentage <= 60) return styles.orangeText;
    return styles.redText;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Scam Score</Text>
        <Text style={[styles.score, getTextColor()]}>
          {score}/{maxScore}
        </Text>
      </View>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            { width: `${percentage}%`, backgroundColor: getBarColor() },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#374151',
    fontWeight: '600',
  },
  score: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  greenText: {
    color: '#15803d',
  },
  orangeText: {
    color: '#c2410c',
  },
  redText: {
    color: '#dc2626',
  },
  barContainer: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
});
