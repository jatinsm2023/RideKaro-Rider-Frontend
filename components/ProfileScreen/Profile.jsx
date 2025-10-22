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

const Profile = ({ onOpenUserInfo, onOpenVehicleInfo, onOpenOldRides }) => {
  const { rider, logout } = useAuth();

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
        <View className="p-4">
          <Text className="text-2xl font-bold text-[var(--secondary)] mb-4">Profile</Text>
          <View className="h-px bg-gray-200" />
        </View>
    
        {/* Profile Options */}
        <View className="bg-white">
          <ProfileOption
            icon="👤"
            title="User Information"
            subtitle="View name, phone, email"
            onPress={onOpenUserInfo}
          />
          <ProfileOption
            icon="🚗"
            title="Your Rides"
            subtitle="View your ride history"
            onPress={onOpenOldRides}
          />
          <ProfileOption
            icon="🚪"
            title="Log Out"
            subtitle="Sign out of your account"
            onPress={handleLogout}
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

export default Profile;