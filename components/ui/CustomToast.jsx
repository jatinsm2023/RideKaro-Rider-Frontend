// CustomToast.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

const BaseToast = ({ bgColor, icon, text1, text2 }) => (
  <View
    style={{
      flexDirection: 'row',
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      backgroundColor: bgColor,
      marginHorizontal: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
    }}
  >
    <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 10, backgroundColor: 'rgba(255,255,255,0.12)' }}>
      <Text style={{ color: '#fff', fontWeight: '700' }}>{icon}</Text>
    </View>

    <View style={{ flex: 1 }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{text1}</Text>
      {text2 ? <Text style={{ color: '#fff', opacity: 0.9, marginTop: 2 }}>{text2}</Text> : null}
    </View>

    <TouchableOpacity onPress={() => Toast.hide()}>
      <Text style={{ color: '#fff', fontWeight: '700' }}>✕</Text>
    </TouchableOpacity>
  </View>
);

export const toastConfig = {
  success: ({ text1, text2 }) => <BaseToast bgColor="#16a34a" icon="✓" text1={text1} text2={text2} />,
  error: ({ text1, text2 }) => <BaseToast bgColor="#ef4444" icon="!" text1={text1} text2={text2} />,
  info: ({ text1, text2 }) => <BaseToast bgColor="#0ea5e9" icon="i" text1={text1} text2={text2} />,
};

// In App.js you'll render: <Toast config={toastConfig} /> (see next block)
