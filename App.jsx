import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Main from './main';
import { AuthProvider } from './contexts/AuthContext';
import Toast from 'react-native-toast-message';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Main />
        <Toast />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
