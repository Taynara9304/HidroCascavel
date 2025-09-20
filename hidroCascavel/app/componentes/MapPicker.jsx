// components/MapPicker.jsx
import React from 'react';
import { Platform } from 'react-native';
import WebMap from './WebMap';
import MobileMap from './MobileMap';

// Coordenadas do IFPR Cascavel
const IFPR_CASCAVEL = {
  latitude: -24.943611,  // 24°56'37.0"S
  longitude: -53.495806  // 53°29'44.9"W
};


const MapPicker = ({ onLocationSelect, onAddressSelect, initialLocation = IFPR_CASCAVEL }) => {
  if (Platform.OS === 'web') {
    return (
      <WebMap 
        onLocationSelect={onLocationSelect} 
        onAddressSelect={onAddressSelect}
        initialLocation={initialLocation}
      />
    );
  }

  return (
    <MobileMap 
      onLocationSelect={onLocationSelect} 
      onAddressSelect={onAddressSelect}
      initialLocation={initialLocation}
    />
  );
};

export default MapPicker;