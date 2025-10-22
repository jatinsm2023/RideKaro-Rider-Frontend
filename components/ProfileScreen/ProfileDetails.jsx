import React from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

const ProfileDetails = ({ onBack }) => {
  const { rider } = useAuth();
  const name = rider?.name || '';
  const email = rider?.email || '';
  const phone = rider?.phone_number || rider?.phone || '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Pressable onPress={onBack} className="mr-3">
          <Text className="text-2xl">←</Text>
        </Pressable>
        <Text className="text-xl font-semibold">Profile Details</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-2">Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
              value={name}
              editable={false}
            />
          </View>

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-2">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
              value={phone}
              editable={false}
            />
          </View>

          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-700 mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-4 text-base bg-gray-50"
              value={email}
              editable={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetails;