import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

const ProfileOption = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity 
    className="flex-row items-center p-4 border-b border-gray-100"
    onPress={onPress}
  >
    <Text className="text-xl mr-3">{icon}</Text>
    <View className="flex-1">
      <Text className="font-semibold">{title}</Text>
      {subtitle && <Text className="text-[var(--muted-foreground)] text-sm">{subtitle}</Text>}
    </View>
    <Text className="text-gray-400">›</Text>
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView className="flex-1">
        {/* Profile Header */}
        <View className="bg-[var(--secondary)] p-6 items-center">
          <View className="h-24 w-24 bg-white rounded-full items-center justify-center mb-3">
            <Text className="text-4xl">👤</Text>
          </View>
          <Text className="text-white text-xl font-bold">{user?.name || 'User Name'}</Text>
          <Text className="text-white opacity-80">{user?.email || 'user@example.com'}</Text>
        </View>
        
        {/* Profile Options */}
        <View className="bg-white">
          <ProfileOption 
            icon="🚗" 
            title="Your Rides" 
            subtitle="View your ride history"
            onPress={() => {}}
          />
          <ProfileOption 
            icon="💳" 
            title="Payment Methods" 
            subtitle="Manage your payment options"
            onPress={() => {}}
          />
          <ProfileOption 
            icon="🎁" 
            title="Promotions" 
            subtitle="View available offers and discounts"
            onPress={() => {}}
          />
          <ProfileOption 
            icon="⭐" 
            title="Rate & Review" 
            subtitle="Rate your previous rides"
            onPress={() => {}}
          />
          <ProfileOption 
            icon="🔔" 
            title="Notifications" 
            subtitle="Manage your notification preferences"
            onPress={() => {}}
          />
          <ProfileOption 
            icon="⚙️" 
            title="Settings" 
            subtitle="App settings and preferences"
            onPress={() => {}}
          />
          <ProfileOption 
            icon="❓" 
            title="Help & Support" 
            subtitle="Get help with your account"
            onPress={() => {}}
          />
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          className="m-6 p-4 bg-[var(--error)] rounded-lg"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-bold">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;