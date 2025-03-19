import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  History: { expenses: Expense[] };
};

type Expense = {
  id: string;
  amount: string;
  description: string;
  category: string;
  date: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export const HistoryScreen: React.FC<Props> = ({ route }) => {
  const { expenses } = route.params;  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getWeeklyData = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyExpenses = expenses.filter(expense => 
      new Date(expense.date) >= lastWeek
    );

    const dailyTotals = Array(7).fill(0);
    const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    weeklyExpenses.forEach(expense => {
      const date = new Date(expense.date);
      const dayIndex = date.getDay();
      dailyTotals[dayIndex] += Number(expense.amount);
    });

    return {
      labels,
      datasets: [{
        data: dailyTotals
      }]
    };
  };

  const getMonthlyData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTotals = Array(12).fill(0);

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthIndex = date.getMonth();
      monthlyTotals[monthIndex] += Number(expense.amount);
    });

    return {
      labels: monthNames,
      datasets: [{
        data: monthlyTotals
      }]
    };
  };

  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();

  return (
    <SafeAreaView style={styles.container}>      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Expense History</Text>

        {/* Weekly Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>This Week's Total:</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(weeklyData.datasets[0].data.reduce((a, b) => a + b, 0))}
          </Text>
        </View>

        {/* Monthly Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>This Month's Total:</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(monthlyData.datasets[0].data[new Date().getMonth()])}
          </Text>
        </View>
      
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Overview</Text>
        <LineChart
          data={weeklyData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Overview</Text>
        <LineChart
          data={monthlyData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});