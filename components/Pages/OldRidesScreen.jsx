import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '@env';

const RideCard = ({ ride }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
      <View className="flex-row justify-between items-start mb-3">
        <Text className="font-bold text-lg">₹{ride.fare}</Text>
        <Text className={`font-semibold ${getStatusColor(ride.status)}`}>
          {getStatusText(ride.status)}
        </Text>
      </View>
      
      <View className="mb-3">
        <View className="flex-row items-center mb-2">
          <Text className="text-green-600 mr-2">📍</Text>
          <Text className="text-sm text-gray-600 flex-1">{ride.pickup_location.address}</Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-red-600 mr-2">🏁</Text>
          <Text className="text-sm text-gray-600 flex-1">{ride.drop_location.address}</Text>
        </View>
      </View>

      <View className="flex-row justify-between text-xs text-gray-500">
        <Text>{ride.distance} km</Text>
        <Text>{ride.estimated_time} min</Text>
        <Text>{formatDate(ride.booking_time)}</Text>
      </View>

      {ride.driver_id && (
        <View className="mt-3 pt-3 border-t border-gray-100">
          <Text className="text-sm text-gray-600">
            Driver: {ride.driver_id.name} • {ride.driver_phone}
          </Text>
        </View>
      )}
    </View>
  );
};

const OldRidesScreen = ({ onBack }) => {
  const { rider } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    if (!rider?.id) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/v0/rides/rider/${rider.id}`);
      const completedRides = response.data.rides.filter(ride => 
        ['completed', 'cancelled'].includes(ride.status)
      );
      setRides(completedRides);
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRides();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity onPress={onBack} className="mr-3">
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-[var(--secondary)]">Ride History</Text>
          </View>
          <View className="h-px bg-gray-200 mb-4" />
          
          {loading ? (
            <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
              <Text className="text-center text-gray-500">Loading rides...</Text>
            </View>
          ) : rides.length === 0 ? (
            <View className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
              <Text className="font-bold text-lg">No ride history</Text>
              <Text className="text-gray-500">Your completed rides will appear here</Text>
            </View>
          ) : (
            rides.map((ride) => (
              <RideCard key={ride._id} ride={ride} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OldRidesScreen;