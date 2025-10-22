import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationInputs from 'components/RideScreen/LocationInputs';

function LocationPicker({ onBack, location, pickupLocation, dropLocation, setPickupLocation, setDropLocation }) {
  const [activeField, setActiveField] = useState('pickup');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (location && typeof location.lat === 'number' && typeof location.lan === 'number') {
      setPickupLocation({
        lat: location.lat,
        lan: location.lan,
        loc: location.loc || 'Your Current Location',
      });
      setActiveField('drop');
    }
  }, [location]);

  const coordTextToNumbers = (text) => {
    const m = (text || '').trim().match(
      /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/
    );
    if (!m) return null;
    return { lat: Number(m[1]), lan: Number(m[2]) };
  };

  useEffect(() => {
    const query = activeField === 'pickup' ? (pickupLocation?.loc || '') : (dropLocation?.loc || '');
    if (!query || query.length < 2 || coordTextToNumbers(query)) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: query,
          format: 'json',
          addressdetails: '1',
          limit: '8',
          countrycodes: 'in',
        });
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
          headers: { 'Accept-Language': 'en', 'User-Agent': 'ridekaro-app/1.0' },
          signal: controller.signal,
        });
        const json = await res.json();
        const normalized = json.map((item) => ({
          id: item.place_id,
          title: item.display_name.split(',')[0],
          subtitle: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
        }));
        setSuggestions(normalized);
      } catch (_) {}
    }, 400);
    return () => { controller.abort(); clearTimeout(timer); };
  }, [pickupLocation, dropLocation, activeField]);

  const applySuggestion = (s) => {
    const locStr = s.subtitle;
    const next = { lat: s.lat, lan: s.lon, loc: locStr };
    if (activeField === 'pickup') setPickupLocation(next);
    else setDropLocation(next);
  };

  const onChangePickup = (text) => {
    setActiveField('pickup');
    const nums = coordTextToNumbers(text);
    setPickupLocation((prev) => ({
      lat: nums?.lat ?? prev?.lat ?? 0,
      lan: nums?.lan ?? prev?.lan ?? 0,
      loc: text,
    }));
  };

  const onChangeDrop = (text) => {
    setActiveField('drop');
    const nums = coordTextToNumbers(text);
    setDropLocation((prev) => ({
      lat: nums?.lat ?? prev?.lat ?? 0,
      lan: nums?.lan ?? prev?.lan ?? 0,
      loc: text,
    }));
  };

  const handleConfirm = () => {
    if (pickupLocation && dropLocation) {
      onBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <Pressable onPress={onBack} className="mr-3">
          <Text className="text-2xl">←</Text>
        </Pressable>
        <Text className="text-xl font-semibold">Pickup & Drop</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="rounded-lg mb-3">
            <LocationInputs
              pickup={pickupLocation?.loc || ''}
              onChangePickup={onChangePickup}
              drop={dropLocation?.loc || ''}
              onChangeDrop={onChangeDrop}
            />
          </View>

          {pickupLocation && dropLocation && (
            <TouchableOpacity
              className="bg-blue-500 p-4 rounded-lg mb-4"
              onPress={handleConfirm}
            >
              <Text className="text-white text-center font-bold">Confirm Locations</Text>
            </TouchableOpacity>
          )}

          <Text className="text-base font-semibold mb-2">Suggestions</Text>
          <View className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
            {suggestions.map((s) => (
              <Pressable key={s.id} onPress={() => applySuggestion(s)} className="p-3 bg-white">
                <View className="flex-row items-center">
                  <View className="h-9 w-9 rounded-full bg-[var(--secondary)] items-center justify-center mr-3">
                    <Text className="text-white">📍</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium">{s.title}</Text>
                    <Text className="text-xs text-gray-500" numberOfLines={1}>
                      {`${s.lat.toFixed(6)}, ${s.lon.toFixed(6)}`}
                    </Text>
                  </View>
                  <Pressable onPress={() => {}}>
                    <Text>♡</Text>
                  </Pressable>
                </View>
              </Pressable>
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationPicker;