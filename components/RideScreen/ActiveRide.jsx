import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Linking , ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ActiveRide = ({ rideId, onRideComplete }) => {
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRideDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/v0/rides/${rideId}`);
      setRide(response.data.ride);
    } catch (error) {
      console.error('Error fetching ride details:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelRide = async () => {
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
              const response = await axios.put(`${API_BASE_URL}/v0/rides/${rideId}/status`, {
                status: 'cancelled'
              });
              
              if (response.status === 200) {
                Alert.alert('Success', 'Ride cancelled successfully');
                setTimeout(() => {
                  onClose();
                }, 3000);
              }
            } catch (error) {
              console.error('Error cancelling ride:', error);
              Alert.alert('Error', 'Failed to cancel ride');
            }
          }
        }
      ]
    );
  };

  const callDriver = () => {
    if (ride?.driver_phone) {
      Linking.openURL(`tel:${ride.driver_phone}`);
    } else {
      Alert.alert('Error', 'Driver phone number not available');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Looking for Driver';
      case 'accepted':
        return 'Driver Assigned';
      case 'in_progress':
        return 'Ride in Progress';
      case 'completed':
        return 'Ride Completed';
      case 'cancelled':
        return 'Ride Cancelled';
      default:
        return status;
    }
  };

  useEffect(() => {
    if (rideId) {
      fetchRideDetails();
      
      // Poll for ride updates every 10 seconds
      const interval = setInterval(fetchRideDetails, 10000);
      
      return () => clearInterval(interval);
    }
  }, [rideId]);

  useEffect(() => {
    if (ride && (ride.status === 'completed' || ride.status === 'cancelled')) {
      setTimeout(() => {
        onRideComplete();
      }, 3000); // Auto-close after 3 seconds
    }
  }, [ride?.status]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg">Loading ride details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!ride) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg">Ride not found</Text>
          <TouchableOpacity
            className="mt-4 bg-[var(--primary)] py-2 px-4 rounded-lg"
            onPress={onRideComplete}
          >
            <Text className="text-white font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-[var(--secondary)]">Your Ride</Text>
            <View className={`px-3 py-1 rounded-full ${getStatusColor(ride.status)}`}>
              <Text className="font-semibold">{getStatusText(ride.status)}</Text>
            </View>
          </View>

          {/* Ride Details */}
          <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
            <Text className="font-bold text-lg mb-3">Trip Details</Text>
            
            <View className="mb-3">
              <View className="flex-row items-center mb-2">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                <Text className="text-gray-700 flex-1">
                  {ride.pickup_location?.address || 'Pickup location'}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-red-500 rounded-full mr-3" />
                <Text className="text-gray-700 flex-1">
                  {ride.drop_location?.address || 'Drop location'}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-gray-600">Distance: {ride.distance?.toFixed(1) || 'N/A'} km</Text>
              <Text className="text-gray-600">Fare: ₹{ride.fare?.toFixed(2) || 'N/A'}</Text>
            </View>
          </View>

          {/* Driver Information */}
          {ride.driver_id && (
            <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
              <Text className="font-bold text-lg mb-3">Driver Information</Text>
              <View className="space-y-2">
                <Text className="text-gray-700">Name: {ride.driver_id.name}</Text>
                <Text className="text-gray-700">Phone: {ride.driver_phone}</Text>
                {/* <Text className="text-gray-700">Vehicle: {ride.driver_id.vehicle_type}</Text> */}
              </View>
              
              <TouchableOpacity
                className="mt-3 bg-green-500 py-2 px-4 rounded-lg"
                onPress={callDriver}
              >
                <Text className="text-white font-bold text-center">Call Driver</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Booking Information */}
          <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
            <Text className="font-bold text-lg mb-3">Booking Information</Text>
            <Text className="text-gray-700">
              Booked: {new Date(ride.booking_time).toLocaleString()}
            </Text>
            {ride.accepted_time && (
              <Text className="text-gray-700">
                Accepted: {new Date(ride.accepted_time).toLocaleString()}
              </Text>
            )}
            {ride.completed_time && (
              <Text className="text-gray-700">
                Completed: {new Date(ride.completed_time).toLocaleString()}
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          {ride.status === 'pending' && (
            <TouchableOpacity
              className="bg-red-500 py-3 px-4 rounded-lg mb-4"
              onPress={cancelRide}
            >
              <Text className="text-white font-bold text-center">Cancel Ride</Text>
            </TouchableOpacity>
          )}

          {(ride.status === 'completed' || ride.status === 'cancelled') && (
            <TouchableOpacity
              className="bg-[var(--secondary)] py-3 px-4 rounded-lg"
              onPress={onRideComplete}
            >
              <Text className="text-white font-bold text-center">Book Another Ride</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ActiveRide;