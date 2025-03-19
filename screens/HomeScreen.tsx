import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  History: { expenses: Expense[] };
  Category: { 
    categories: Category[];
    onAddCategory: (category: Category) => void;
    onDeleteCategory: (id: string) => void;
  };
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

type Expense = {
  id: string;
  amount: string;
  description: string;
  category: string;
  date: string;
};

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

const defaultCategories: Category[] = [
  { id: '1', name: 'Food', color: '#FF6B6B', icon: 'fastfood' },
  { id: '2', name: 'Transport', color: '#4ECDC4', icon: 'directions-car' },
  { id: '3', name: 'Shopping', color: '#45B7D1', icon: 'shopping-bag' },
  { id: '4', name: 'Bills', color: '#96CEB4', icon: 'home' },
  { id: '5', name: 'Other', color: '#FFD93D', icon: 'more-horiz' },
];

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategories[0].name);
  const [totalExpense, setTotalExpense] = useState(0);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);  const addExpense = () => {
    if (!amount || !description) return;
    
    if (editingExpense) {
      // Update existing expense
      const updatedExpenses = expenses.map(exp => {
        if (exp.id === editingExpense.id) {
          setTotalExpense(prev => prev - Number(exp.amount) + Number(amount));
          return {
            ...exp,
            amount,
            description,
            category: selectedCategory,
          };
        }
        return exp;
      });
      setExpenses(updatedExpenses);
      setEditingExpense(null);
    } else {
      // Add new expense
      const newExpense: Expense = {
        id: Date.now().toString(),
        amount,
        description,
        category: selectedCategory,
        date: new Date().toLocaleDateString(),
      };
      setExpenses([newExpense, ...expenses]);
      setTotalExpense(prev => prev + Number(amount));
    }
    
    setAmount('');
    setDescription('');
  };

  const editExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount);
    setDescription(expense.description);
    setSelectedCategory(expense.category);
  };

  const addCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
  };

  const deleteExpense = (expense: Expense) => {
    setExpenses(expenses.filter(e => e.id !== expense.id));
    setTotalExpense(prev => prev - Number(expense.amount));
  };  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#FFD93D';
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : 'more-horiz';
  };

  return (
    <SafeAreaView style={styles.container}>      <View style={styles.header}>
        <Text style={styles.title}>Expense Tracker</Text>
        <Text style={styles.totalAmount}>Total: ${totalExpense.toFixed(2)}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('History', { expenses })}
          >
            <MaterialIcons name="history" size={24} color="#6C63FF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('Category', { 
              categories,
              onAddCategory: addCategory,
              onDeleteCategory: deleteCategory,
            })}
          >
            <MaterialIcons name="category" size={24} color="#6C63FF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.categoryContainer}>
        <FlatList          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item.name && styles.selectedCategory,
                { backgroundColor: item.color }
              ]}
              onPress={() => setSelectedCategory(item.name)}
            >
              <MaterialIcons name={item.icon} size={20} color="#fff" style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>      <TouchableOpacity style={styles.addButton} onPress={addExpense}>
        <Text style={styles.addButtonText}>
          {editingExpense ? 'Update Expense' : 'Add Expense'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={expenses}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View style={styles.expenseInfo}>
              <Text style={styles.expenseAmount}>${item.amount}</Text>
              <Text style={styles.expenseDescription}>{item.description}</Text>
              <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(item.category) }]}>
                <Text style={styles.categoryTagText}>{item.category}</Text>
              </View>
              <Text style={styles.expenseDate}>{item.date}</Text>
            </View>            <View style={styles.expenseActions}>
              <Pressable 
                style={styles.actionButton}
                onPress={() => editExpense(item)}
              >
                <MaterialIcons name="edit" size={24} color="#6C63FF" />
              </Pressable>
              <Pressable 
                style={styles.actionButton}
                onPress={() => deleteExpense(item)}
              >
                <MaterialIcons name="delete" size={24} color="#FF6B6B" />
              </Pressable>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategory: {
    transform: [{ scale: 1.1 }],
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#6C63FF',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  expenseItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  expenseDescription: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 5,
  },
  categoryTagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  expenseDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  deleteButton: {
    padding: 10,
  },
});