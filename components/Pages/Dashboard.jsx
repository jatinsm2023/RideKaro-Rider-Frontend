import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const showToast = (type, title, message) => {
    Toast.show({
      type: type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 1000,
    });
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear stored tokens
              await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
              await logout();
              showToast('success', 'Logged Out', 'You have been logged out successfully');
            } catch (error) {
              console.error('Logout error:', error);
              showToast('error', 'Logout Failed', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-gray-50">
      <View className="bg-white rounded-2xl p-8 shadow-lg w-full max-w-sm">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-5">
          Welcome to Ride Karo! 🚗
        </Text>
        
        <View className="bg-blue-50 rounded-lg p-4 mb-6">
          <Text className="text-xl font-semibold text-gray-700 mb-2 text-center">
            Hello, {user?.name || 'User'}! 👋
          </Text>
          <Text className="text-gray-600 text-center">
            {user?.email}
          </Text>
        </View>
        
        <TouchableOpacity 
          className="bg-red-500 rounded-lg p-4 items-center"
          onPress={handleLogout}
        >
          <Text className="text-white text-base font-semibold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;