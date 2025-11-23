import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ResultCardProps {
  title: string;
  value: string | number;
  variant?: 'success' | 'warning' | 'danger' | 'neutral';
}

export function ResultCard({
  title,
  value,
  variant = 'neutral',
}: ResultCardProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'success':
        return styles.success;
      case 'warning':
        return styles.warning;
      case 'danger':
        return styles.danger;
      default:
        return styles.neutral;
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'success':
        return styles.successText;
      case 'warning':
        return styles.warningText;
      case 'danger':
        return styles.dangerText;
      default:
        return styles.neutralText;
    }
  };

  return (
    <View style={[styles.card, getVariantStyle()]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, getTextColor()]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  success: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  warning: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },
  danger: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  neutral: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  title: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  successText: {
    color: '#15803d',
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
});
