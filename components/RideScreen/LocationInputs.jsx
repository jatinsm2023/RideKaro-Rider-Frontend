import React from 'react';
import { View, Text, TextInput } from 'react-native';

const LocationInputs = ({ pickup, onChangePickup, drop, onChangeDrop, onFocusPickup, onFocusDrop }) => {
  return (
    <View className="mb-6 gap-2">
      {/* Pickup Input with Icon */}
      <View className="flex-row items-center border border-gray-300 rounded-lg bg-white px-3">
        <Text className="text-green-600 mr-2">📍</Text>
        <TextInput
          placeholder="Enter pickup location"
          value={pickup}
          onChangeText={onChangePickup}
          onFocus={onFocusPickup}
          className="flex-1 py-3 text-[var(--foreground)]"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>

      {/* Drop Input with Icon */}
      <View className="flex-row items-center border border-gray-300 rounded-lg bg-white px-3">
        <Text className="text-red-600 mr-2">📍</Text>
        <TextInput
          placeholder="Enter drop location"
          value={drop}
          onChangeText={onChangeDrop}
          onFocus={onFocusDrop}
          className="flex-1 py-3 text-[var(--foreground)]"
          autoCapitalize="none"
          returnKeyType="done"
        />
      </View>
    </View>
  );
};

export default LocationInputs;