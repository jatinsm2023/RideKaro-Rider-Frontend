import React from 'react';
import {  ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ride from 'components/RideScreen/Ride';

function RideScreen({ onOpenLocationPicker, onLocationReady, pickupLocation, dropLocation, onRideBooked }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView className="flex-1">
        <Ride 
          onOpenLocationPicker={onOpenLocationPicker} 
          onLocationReady={onLocationReady}
          pickupLocation={pickupLocation}
          dropLocation={dropLocation}
          onRideBooked={onRideBooked}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default RideScreen;