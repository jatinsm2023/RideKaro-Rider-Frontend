import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';

const WhereToGoInput = ({ value, onChange, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View className="rounded-lg flex-row items-center border border-gray-300 rounded-lg bg-white px-3">
        <Text className="text-gray-400 mr-2">🔍</Text>
        <TextInput
          placeholder="Where to go?"
          value={value}
          onChangeText={onChange}
          onFocus={onPress}
          className="flex-1 py-3 bg-white text-[var(--foreground)]"
          autoCapitalize="none"
          returnKeyType="search"
          editable={false}
          pointerEvents="none"
        />
      </View>
    </Pressable>
  );
};

export default WhereToGoInput;