import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const BottomNavBar = ({ currentScreen, onNavigate }) => {
  return (
    <View className="flex-row bg-white border-t border-gray-200 pt-2 pb-6">
      <TouchableOpacity 
        className="flex-1 items-center"
        onPress={() => onNavigate('ride')}
      >
        <Text className="text-2xl">🚗</Text>
        <Text className={`text-xs ${currentScreen === 'ride' ? 'text-[var(--secondary)] font-bold' : 'text-gray-500'}`}>
          Ride
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="flex-1 items-center"
        onPress={() => onNavigate('services')}
      >
        <Text className="text-2xl">🛠️</Text>
        <Text className={`text-xs ${currentScreen === 'services' ? 'text-[var(--secondary)] font-bold' : 'text-gray-500'}`}>
          Services
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="flex-1 items-center"
        onPress={() => onNavigate('profile')}
      >
        <Text className="text-2xl">👤</Text>
        <Text className={`text-xs ${currentScreen === 'profile' ? 'text-[var(--secondary)] font-bold' : 'text-gray-500'}`}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavBar;