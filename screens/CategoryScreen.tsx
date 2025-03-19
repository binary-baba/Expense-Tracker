import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Category: {
    categories: Category[];
    onAddCategory: (category: Category) => void;
    onDeleteCategory: (id: string) => void;
  };
};

type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Category'>;

const ICONS = [
  'shopping-bag', 'fastfood', 'directions-car', 'home', 'movie', 'fitness-center',
  'medical-services', 'pets', 'school', 'work', 'sports-esports', 'more-horiz'
];

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFD93D', '#FF8066',
  '#6C63FF', '#FF4081', '#7C4DFF', '#64B5F6', '#81C784', '#FFB74D'
];

export const CategoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { categories, onAddCategory, onDeleteCategory } = route.params;
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      color: selectedColor,
      icon: selectedIcon,
    };

    onAddCategory(newCategory);
    setNewCategoryName('');
    Alert.alert('Success', 'Category added successfully');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage Categories</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Category Name"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholderTextColor="#666"
        />
      </View>

      <Text style={styles.sectionTitle}>Select Color</Text>
      <FlatList
        data={COLORS}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.colorList}
        renderItem={({ item: color }) => (
          <TouchableOpacity
            style={[styles.colorItem, { backgroundColor: color }, 
              selectedColor === color && styles.selectedItem]}
            onPress={() => setSelectedColor(color)}
          />
        )}
        keyExtractor={(item) => item}
      />

      <Text style={styles.sectionTitle}>Select Icon</Text>
      <FlatList
        data={ICONS}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.iconList}
        renderItem={({ item: icon }) => (
          <TouchableOpacity
            style={[styles.iconItem, selectedIcon === icon && styles.selectedItem]}
            onPress={() => setSelectedIcon(icon)}
          >
            <MaterialIcons name={icon} size={24} color="#333" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
        <Text style={styles.addButtonText}>Add Category</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Existing Categories</Text>
      <FlatList
        data={categories}
        style={styles.categoryList}
        renderItem={({ item }) => (
          <View style={[styles.categoryItem, { backgroundColor: item.color }]}>
            <MaterialIcons name={item.icon} size={24} color="#fff" />
            <Text style={styles.categoryName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDeleteCategory(item.id)}
            >
              <MaterialIcons name="delete" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  colorList: {
    marginBottom: 20,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  iconList: {
    marginBottom: 20,
  },
  iconItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
  addButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryName: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  deleteButton: {
    padding: 5,
  },
});