import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RideScreen from './RideScreen';
import ServicesScreen from './ServicesScreen';
import ProfileScreen from './ProfileScreen';
import BottomNavBar from '../ui/BottomNavBar';

const MainAppContainer = () => {
  const [currentScreen, setCurrentScreen] = useState('ride');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'ride':
        return <RideScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <RideScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View className="flex-1">
        {renderScreen()}
        <BottomNavBar 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
        />
      </View>
    </SafeAreaProvider>
  );
};

export default MainAppContainer;