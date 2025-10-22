import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ServiceCard = ({ title, description, icon, color }) => (
  <TouchableOpacity className={`p-4 rounded-lg mb-4 border border-gray-200`}>
    <View className="flex-row items-center">
      <View className={`h-12 w-12 ${color} rounded-full mr-3 items-center justify-center`}>
        <Text className="text-xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-lg">{title}</Text>
        <Text className="text-[var(--muted-foreground)]">{description}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const Services = () => {
  const services = [
    {
      title: 'Toto Ride',
      description: 'Book a toto instantly.',
      icon: '🚗',
      color: 'bg-[var(--primary)]'
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold text-[var(--secondary)] mb-4">Our Services</Text>
          
          <Text className="text-[var(--foreground)] mb-6">
            Explore our range of services designed to make your travel experience better.
          </Text>
          
          <View>
            {services.map((service, index) => (
              <ServiceCard 
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                color={service.color}
              />
            ))}
          </View>
          
          {/* Promotions Section */} 
          {/* <View className="mt-6">
            <Text className="text-xl font-bold mb-4">Special Offers</Text>
            <View className="bg-[var(--muted)] p-4 rounded-lg">
              <Text className="text-[var(--secondary)] font-bold text-lg mb-2">20% OFF Your First Ride</Text>
              <Text className="text-[var(--foreground)] mb-2">Use code: FIRSTRIDE</Text>
              <TouchableOpacity className="bg-[var(--secondary)] p-2 rounded w-24">
                <Text className="text-white text-center">Claim Now</Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Services;