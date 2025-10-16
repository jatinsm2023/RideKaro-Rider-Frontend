import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthScreen from './components/Pages/AuthScreen';
import Dashboard from './components/Pages/Dashboard';
import MainAppContainer from 'components/Pages/MainAppContainer';
import { useAuth } from './contexts/AuthContext';

export default function Main() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (isAuthenticated) {
    return (
      <SafeAreaView className="flex-1">
        {/* <Dashboard /> */}
        <MainAppContainer/>
      </SafeAreaView>
    );
  }



  return (
    <SafeAreaView className="flex-1">
      <AuthScreen/>
    </SafeAreaView>
  );
}