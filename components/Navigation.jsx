import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthScreen from './Pages/AuthScreen';
import MainAppContainer from './Pages/MainAppContainer';

const Stack = createStackNavigator();

export const Navigation = () => {
  const { rider, isLoading } = useAuth();

  // Show loading screen while checking for stored credentials
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {rider ? (
          // Rider is signed in
          <Stack.Screen name="Main" component={MainAppContainer} />
        ) : (
          // Rider is not signed in
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;