import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const InitialMap = ({ height = 220 }) => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setCoords({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (e) {
        setError('Unable to fetch location');
      }
    })();
  }, []);

  if (error) {
    return (
      <View className="bg-[var(--muted)] rounded-lg p-4 border border-gray-200">
        <Text className="text-[var(--muted-foreground)]">{error}</Text>
      </View>
    );
  }

  if (!coords) {
    return (
      <View className="items-center justify-center bg-[var(--muted)] rounded-lg border border-gray-200" style={{ height }}>
        <ActivityIndicator size="small" color="#2563eb" />
        <Text className="mt-2 text-xs text-[var(--muted-foreground)]">Fetching current location...</Text>
      </View>
    );
  }

  const { latitude, longitude } = coords;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
          .leaflet-container { background: #fff; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
          const lat = ${latitude};
          const lng = ${longitude};
          const map = L.map('map', { zoomControl: false }).setView([lat, lng], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
          L.marker([lat, lng]).addTo(map).bindPopup('You are here').openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <View className="rounded-lg overflow-hidden border border-gray-200">
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ height }}
      />
    </View>
  );
};

export default InitialMap;