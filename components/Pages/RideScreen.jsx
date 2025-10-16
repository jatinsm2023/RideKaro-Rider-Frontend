import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RideScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold text-[var(--secondary)] mb-4">Book a Ride</Text>
          
          {/* Pickup Location Input */}
          <View className="bg-[var(--muted)] p-4 rounded-lg mb-3">
            <Text className="text-sm text-[var(--muted-foreground)] mb-1">PICKUP</Text>
            <Text className="text-[var(--foreground)]">Current Location</Text>
          </View>
          
          {/* Destination Input */}
          <View className="bg-[var(--muted)] p-4 rounded-lg mb-6">
            <Text className="text-sm text-[var(--muted-foreground)] mb-1">DESTINATION</Text>
            <Text className="text-[var(--foreground)]">Where to?</Text>
          </View>
          
          {/* Ride Options */}
          <Text className="text-lg font-semibold mb-3">Choose a ride</Text>
          
          <View className="space-y-3">
            {/* Economy Option */}
            <View className="flex-row items-center p-3 border border-gray-200 rounded-lg">
              <View className="h-12 w-12 bg-[var(--secondary)] rounded-full mr-3 items-center justify-center">
                <Text>🚗</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold">Economy</Text>
                <Text className="text-sm text-[var(--primary)]">Affordable rides for everyday</Text>
              </View>
              <Text className="font-bold">₹149</Text>
            </View>
            
            {/* Premium Option */}
            <View className="flex-row items-center p-3 border border-gray-200 rounded-lg">
              <View className="h-12 w-12 bg-[var(--secondary)] rounded-full mr-3 items-center justify-center">
                <Text>🚙</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold">Premium</Text>
                <Text className="text-sm">Comfortable rides with top drivers</Text>
              </View>
              <Text className="font-bold">₹249</Text>
            </View>
            
            {/* Luxury Option */}
            <View className="flex-row items-center p-3 border border-gray-200 rounded-lg">
              <View className="h-12 w-12 bg-[var(--secondary)] rounded-full mr-3 items-center justify-center">
                <Text>🚘</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold">Luxury</Text>
                <Text className="text-sm">Premium cars with top-rated drivers</Text>
              </View>
              <Text className="font-bold">₹399</Text>
            </View>
          </View>
          
          {/* Book Now Button */}
          <View className="mt-6 bg-[var(--secondary)] p-4 rounded-lg">
            <Text className="text-white text-center font-bold text-lg">Book Now</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RideScreen;