// AuthScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '@env';

const AuthScreen = ({ navigation }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  // Shared fields
  const [name, setName] = useState(''); // only used for signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // only used for signup
  const [confirmPassword, setConfirmPassword] = useState(''); // signup only

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const showToast = (type, title, message) => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'top',
      visibilityTime: 1500,
      autoHide: true,
    });
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('error', 'Validation Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Login attempt:', {
        API_BASE_URL,
        email,
        password: '***',
      });

      const response = await axios.post(`${API_BASE_URL}/v0/rider/login`, {
        email,
        password,
      });

      console.log('✅ Login successful:', response.data);

      // Store tokens and rider data
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      await AsyncStorage.setItem('rider', JSON.stringify(response.data.rider));

      // Use auth context to store rider data
      await login(response.data.rider, {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });

      showToast('success', 'Login Successful', 'Welcome back!');

      // Navigate to app's main screen - change 'Home' to your actual route if different
      if (navigation?.replace) {
        navigation.replace('Home');
      } else if (navigation?.navigate) {
        navigation.navigate('Home');
      } else {
        console.log('No navigation provided — logged in.');
      }
    } catch (error) {
      console.error('💥 Login error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Login failed';
        showToast('error', 'Login Failed', errorMessage);
      } else if (error.request) {
        showToast('error', 'Network Error', 'Please check your internet connection');
      } else {
        showToast('error', 'Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword || !phone) {
      showToast('error', 'Validation Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      showToast('error', 'Validation Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      showToast('error', 'Validation Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 SignUp attempt:', {
        API_BASE_URL,
        name,
        email,
        password: '***',
        phone,
      });

      const response = await axios.post(`${API_BASE_URL}/v0/rider/create`, {
        name,
        email,
        password,
        phone_number: phone,
      });

      console.log('✅ SignUp successful:', response.data);

      showToast('success', 'SignUp Successful', 'Account created! Please login.');

      // Clear the signup form and switch to login
      resetForm();
      setIsSignUp(false);
    } catch (error) {
      console.error('💥 SignUp error:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'SignUp failed';
        showToast('error', 'SignUp Failed', errorMessage);
      } else if (error.request) {
        showToast('error', 'Network Error', 'Please check your internet connection');
      } else {
        showToast('error', 'Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
        <View className="px-4">
          <Text className="text-4xl font-bold text-center text-gray-800 mb-3">Ride Karo</Text>

          {isSignUp ? (
            <Text className="text-lg text-center text-gray-600 mb-8">Create your account</Text>
          ) : (
            <Text className="text-lg text-center text-gray-600 mb-8">Welcome back! Please login</Text>
          )}

          {isSignUp && (
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-700 mb-2">Full Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          )}

          {isSignUp && (
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-700 mb-2">Phone Number</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
                placeholder="Enter your phone number"
                value={phone}
                onChangeText={setPhone}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-2">Password</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {isSignUp && (
            <View className="mb-8">
              <Text className="text-base font-semibold text-gray-700 mb-2">Confirm Password</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          )}

          <TouchableOpacity
            className={`rounded-lg p-4 items-center mb-4 ${loading ? 'bg-[var(--secondary)]' : 'bg-[var(--secondary)]'}`}
            onPress={isSignUp ? handleSignUp : handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">
                {isSignUp ? 'Create Account' : 'Login'}
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-2">
            <Text className="text-sm text-gray-600 mr-2">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Reset fields when switching
                resetForm();
                setIsSignUp(!isSignUp);
              }}
            >
              <Text className="text-sm font-semibold text-[var(--secondary)]">
                {isSignUp ? 'Login' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Toast />
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
