import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Profile from 'components/ProfileScreen/Profile';


const ProfileScreen = ({ onOpenUserInfo, onOpenVehicleInfo, onOpenOldRides }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView className="flex-1">
        <Profile 
          onOpenUserInfo={onOpenUserInfo}
          onOpenVehicleInfo={onOpenVehicleInfo}
          onOpenOldRides={onOpenOldRides}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;