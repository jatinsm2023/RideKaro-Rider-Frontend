import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WhereToGoInput from './WhereToGoInput';
import InitialMap from './InitialMap';
import * as Location from 'expo-location';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { API_BASE_URL } from '@env';

function Ride({ onOpenLocationPicker, onLocationReady, pickupLocation: propPickupLocation, dropLocation: propDropLocation, onRideBooked }) {
  const { rider } = useAuth();
  const [destination, setDestination] = useState('');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickupLocation, setPickupLocation] = useState(propPickupLocation || null);
  const [dropLocation, setDropLocation] = useState(propDropLocation || null);
  const [isBooking, setIsBooking] = useState(false);
  const [currentRide, setCurrentRide] = useState(null);

  // Update local state when props change
  useEffect(() => {
    if (propPickupLocation) {
      setPickupLocation(propPickupLocation);
    }
  }, [propPickupLocation]);

  useEffect(() => {
    if (propDropLocation) {
      setDropLocation(propDropLocation);
    }
  }, [propDropLocation]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const current = {
          lat: Number(loc.coords.latitude),
          lan: Number(loc.coords.longitude),
          loc: 'Your Current Location',
        };
        if (!propPickupLocation) {
          setPickupLocation(current);
        }
        onLocationReady?.(current);
      } catch (_) {}
    })();
  }, [onLocationReady, propPickupLocation]);

  // Check for active rides
  useEffect(() => {
    if (rider?.id) {
      checkActiveRides();
    }
  }, [rider]);

  const checkActiveRides = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/v0/rides/rider/${rider.id}`);
      const activeRide = response.data.rides.find(ride => 
        ['pending', 'accepted', 'in_progress'].includes(ride.status)
      );
      setCurrentRide(activeRide);
    } catch (error) {
      console.error('Error checking active rides:', error);
    }
  };

  const calculateDistance = (pickup, drop) => {
    // Simple distance calculation (Haversine formula)
    const R = 6371; // Earth's radius in kilometers
    const dLat = (drop.lat - pickup.lat) * Math.PI / 180;
    const dLon = (drop.lan - pickup.lan) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pickup.lat * Math.PI / 180) * Math.cos(drop.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateFare = (distance) => {
    // Simple fare calculation: base fare + per km rate
    const baseFare = 50;
    const perKmRate = 15;
    return Math.round(baseFare + (distance * perKmRate));
  };

  const handleBookRide = async () => {
    if (!pickupLocation || !dropLocation) {
      Alert.alert('Error', 'Please select both pickup and drop locations');
      return;
    }

    if (!rider?.id) {
      Alert.alert('Error', 'Please login to book a ride');
      return;
    }

    try {
      setIsBooking(true);

      const distance = calculateDistance(pickupLocation, dropLocation);
      const fare = calculateFare(distance);
      const estimatedTime = Math.round(distance * 3); // Rough estimate: 3 minutes per km

      const rideData = {
        rider_id: rider.id,
        pickup_location: {
          latitude: pickupLocation.lat,
          longitude: pickupLocation.lan,
          address: pickupLocation.loc
        },
        drop_location: {
          latitude: dropLocation.lat,
          longitude: dropLocation.lan,
          address: dropLocation.loc
        },
        fare,
        distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
        estimated_time: estimatedTime
      };

      const response = await axios.post(`${API_BASE_URL}/v0/rides/create`, rideData);
      
      if (response.status === 201) {
        setCurrentRide(response.data.ride);
        onRideBooked?.(response.data.ride._id || response.data.ride.id); // Notify parent component
        Toast.show({
          type: 'success',
          text1: 'Ride Booked!',
          text2: 'Looking for nearby drivers...'
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      Toast.show({
        type: 'error',
        text1: 'Booking Failed',
        text2: error.response?.data?.message || 'Please try again'
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelRide = async () => {
    Alert.alert(
      'Cancel Ride',
      'Are you sure you want to cancel this ride?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.put(`${API_BASE_URL}/v0/rides/status/${currentRide._id || currentRide.id}`, {
                status: 'cancelled'
              });
              setCurrentRide(null);
              Toast.show({
                type: 'info',
                text1: 'Ride Cancelled',
                text2: 'Your ride has been cancelled'
              });
            } catch (error) {
              console.error('Cancel error:', error);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to cancel ride'
              });
            }
          }
        }
      ]
    );
  };

  const renderRideStatus = () => {
    if (!currentRide) return null;

    return (
      <View className="bg-blue-50 p-4 m-4 rounded-lg border border-blue-200">
        <Text className="text-lg font-bold text-blue-800 mb-2">
          {currentRide.status === 'pending' && 'Looking for Driver...'}
          {currentRide.status === 'accepted' && 'Driver Found!'}
          {currentRide.status === 'in_progress' && 'Ride in Progress'}
        </Text>
        
        <View className="mb-3">
          <Text className="text-sm text-gray-600">From: {currentRide.pickup_location.address}</Text>
          <Text className="text-sm text-gray-600">To: {currentRide.drop_location.address}</Text>
          <Text className="text-sm text-gray-600">Fare: ₹{currentRide.fare}</Text>
          <Text className="text-sm text-gray-600">Distance: {currentRide.distance} km</Text>
        </View>

        {currentRide.driver_id && (
          <View className="bg-white p-3 rounded-lg mb-3">
            <Text className="font-semibold text-gray-800">Driver Details:</Text>
            <Text className="text-gray-600">Name: {currentRide.driver_id.name}</Text>
            <Text className="text-gray-600">Phone: {currentRide.driver_phone}</Text>
            {currentRide.driver_id.vehicle_type && (
              <Text className="text-gray-600">
                Vehicle: {currentRide.driver_id.vehicle_type.vehicle_modal} ({currentRide.driver_id.vehicle_type.plate_number})
              </Text>
            )}
          </View>
        )}

        {currentRide.status === 'pending' && (
          <TouchableOpacity
            className="bg-red-500 p-3 rounded-lg"
            onPress={handleCancelRide}
          >
            <Text className="text-white text-center font-bold">Cancel Ride</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold text-[var(--secondary)] mb-4">Book a Ride</Text>
          
          {renderRideStatus()}
          
          {!currentRide && (
            <>
              <WhereToGoInput
                value={destination}
                onChange={setDestination}
                onPress={() => onOpenLocationPicker({ pickupLocation, dropLocation })}
              />

              {pickupLocation && dropLocation && (
                <View className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <Text className="font-semibold mb-2">Trip Summary:</Text>
                  <Text className="text-sm text-gray-600 mb-1">From: {pickupLocation.loc}</Text>
                  <Text className="text-sm text-gray-600 mb-1">To: {dropLocation.loc}</Text>
                  <Text className="text-sm text-gray-600 mb-1">
                    Distance: {Math.round(calculateDistance(pickupLocation, dropLocation) * 100) / 100} km
                  </Text>
                  <Text className="text-sm text-gray-600 mb-3">
                    Estimated Fare: ₹{calculateFare(calculateDistance(pickupLocation, dropLocation))}
                  </Text>
                  
                  <TouchableOpacity
                    className="bg-blue-500 p-4 rounded-lg"
                    onPress={handleBookRide}
                    disabled={isBooking}
                  >
                    {isBooking ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white text-center font-bold text-lg">Book Ride</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              <View className="mt-2">
                <InitialMap height={560} />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Ride;