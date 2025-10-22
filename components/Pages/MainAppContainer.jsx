import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RideScreen from './RideScreen';
import ServicesScreen from './ServicesScreen';
import ProfileScreen from './ProfileScreen';
import BottomNavBar from '../ui/BottomNavBar';
import LocationPicker from 'components/RideScreen/LocationPicker';
import ProfileDetails from 'components/ProfileScreen/ProfileDetails';
import OldRidesScreen from './OldRidesScreen';
import ActiveRide from 'components/RideScreen/ActiveRide';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '@env';

const MainAppContainer = () => {
  const { rider } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('ride');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [activeRideId, setActiveRideId] = useState(null);
  const [detailsType, setDetailsType] = useState('user');

  // Check for active rides on mount and periodically
  useEffect(() => {
    if (rider?.id) {
      checkForActiveRide();
      const interval = setInterval(checkForActiveRide, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [rider]);

  const checkForActiveRide = async () => {
    if (!rider?.id) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/v0/rides/rider/${rider.id}`);
      const activeRide = response.data.rides.find(ride => 
        ['pending', 'accepted', 'in_progress'].includes(ride.status)
      );
      
      if (activeRide) {
        setActiveRideId(activeRide._id);
      } else {
        setActiveRideId(null);
      }
    } catch (error) {
      console.error('Error checking for active rides:', error);
    }
  };

  const handleRideBooked = (rideId) => {
    setActiveRideId(rideId);
  };

  const handleRideComplete = () => {
    setActiveRideId(null);
    setPickupLocation(null);
    setDropLocation(null);
  };

  const handleOpenUserInfo = () => {
    setDetailsType('user');
    setCurrentScreen('profileDetails');
  };

  const handleOpenVehicleInfo = () => {
    setDetailsType('vehicle');
    setCurrentScreen('profileDetails');
  };

  const handleOpenOldRides = () => {
    setCurrentScreen('oldRides');
  };

  const handleOpenLocationPicker = (locationData) => {
    if (locationData) {
      setPickupLocation(locationData.pickupLocation);
      setDropLocation(locationData.dropLocation);
    }
    setCurrentScreen('locationPicker');
  };

  const renderScreen = () => {
    // Show active ride if exists
    if (activeRideId) {
      return (
        <ActiveRide 
          rideId={activeRideId} 
          onRideComplete={handleRideComplete}
        />
      );
    }

    switch (currentScreen) {
      case 'ride':
        return (
          <RideScreen
            onOpenLocationPicker={handleOpenLocationPicker}
            onLocationReady={setCurrentLocation}
            pickupLocation={pickupLocation}
            dropLocation={dropLocation}
            onRideBooked={handleRideBooked}
          />
        );
      case 'locationPicker':
        return (
          <LocationPicker 
            location={currentLocation} 
            onBack={() => setCurrentScreen('ride')}
            pickupLocation={pickupLocation}
            dropLocation={dropLocation}
            setPickupLocation={setPickupLocation}
            setDropLocation={setDropLocation}
          />
        );
      case 'services':
        return <ServicesScreen />;
      case 'profile':
        return (
          <ProfileScreen 
            onOpenUserInfo={handleOpenUserInfo}
            onOpenVehicleInfo={handleOpenVehicleInfo}
            onOpenOldRides={handleOpenOldRides}
          />
        );
      case 'profileDetails':
        return (
          <ProfileDetails 
            onBack={() => setCurrentScreen('profile')} 
            screenType={detailsType}
          />
        );
      case 'oldRides':
        return <OldRidesScreen onBack={() => setCurrentScreen('profile')} />;
      default:
        return (
          <RideScreen
            onOpenLocationPicker={handleOpenLocationPicker}
            onLocationReady={setCurrentLocation}
            pickupLocation={pickupLocation}
            dropLocation={dropLocation}
            onRideBooked={handleRideBooked}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <View className="flex-1">
        {renderScreen()}
        {currentScreen !== 'locationPicker' && currentScreen !== 'profileDetails' && currentScreen !== 'oldRides' && !activeRideId && (
          <BottomNavBar 
            currentScreen={currentScreen} 
            onNavigate={setCurrentScreen} 
          />
        )}
      </View>
    </SafeAreaProvider>
  );
};

export default MainAppContainer;