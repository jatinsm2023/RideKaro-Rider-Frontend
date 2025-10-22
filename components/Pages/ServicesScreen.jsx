import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Services from 'components/ServicesScreen/Services';
import {  ScrollView } from 'react-native';



const ServicesScreen = () => {

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView className="flex-1">
        <Services />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServicesScreen;