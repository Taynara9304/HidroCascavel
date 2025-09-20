// components/MapPicker.jsx
import React from 'react';
import { Platform } from 'react-native';
import WebMap from './WebMap';
import MobileMap from './MobileMap';

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  // Para web, use WebMap com Leaflet
  if (Platform.OS === 'web') {
    return (
      <WebMap 
        onLocationSelect={onLocationSelect} 
        initialLocation={initialLocation}
      />
    );
  }

  // Para mobile, use MobileMap com WebView
  return (
    <MobileMap 
      onLocationSelect={onLocationSelect} 
      initialLocation={initialLocation}
    />
  );
};

export default MapPicker;