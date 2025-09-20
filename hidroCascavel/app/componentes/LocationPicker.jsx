// components/LocationPicker.jsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import UniversalMap from './UniversalMap';
import { getAddressFromCoordinates } from '../services/geocodingService';

const LocationPicker = ({ onLocationSelect, onAddressSelect }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialLocation = {
    latitude: -14.2350,
    longitude: -51.9253,
    zoom: 5
  };

  const handleLocationSelect = async (coordinate) => {
    setSelectedLocation(coordinate);
    setLoading(true);
    
    try {
      // Obter endereço a partir das coordenadas usando API gratuita
      const endereco = await getAddressFromCoordinates(
        coordinate.latitude,
        coordinate.longitude
      );
      
      setAddress(endereco);
      onLocationSelect(coordinate);
      onAddressSelect(endereco);
      
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      Alert.alert('Erro', 'Não foi possível obter o endereço desta localização.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecione sua localização no mapa:</Text>
      <Text style={styles.subLabel}>Toque no mapa para selecionar ou use sua localização atual</Text>
      
      <View style={styles.mapContainer}>
        <UniversalMap 
          onLocationSelect={handleLocationSelect}
          initialLocation={initialLocation}
        />
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={styles.loadingText}>Buscando endereço...</Text>
            </View>
          </View>
        )}
      </View>

      {address && (
        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Localização selecionada:</Text>
          <Text style={styles.addressText}>{address.enderecoCompleto}</Text>
          <Text style={styles.coordinatesText}>
            Coordenadas: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  subLabel: {
    fontSize: 12,
    marginBottom: 10,
    color: '#666',
  },
  mapContainer: {
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  addressContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
  },
  addressLabel: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 5,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 14,
    marginTop: 10,
  },
});

export default LocationPicker;