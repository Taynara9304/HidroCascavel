// components/UniversalMap.jsx
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Linking } from 'react-native';

const UniversalMap = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  const handleManualLocation = () => {
    // Abrir Google Maps ou outro app de mapa para o usuário obter coordenadas
    const url = `https://www.google.com/maps?q=${initialLocation.latitude},${initialLocation.longitude}`;
    
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url).catch(err => {
        Alert.alert('Erro', 'Não foi possível abrir o aplicativo de mapas');
      });
    }
  };

  const focusOnCurrentLocation = () => {
    if (Platform.OS === 'web') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const location = { latitude, longitude };
            setSelectedLocation(location);
            onLocationSelect(location);
          },
          (error) => {
            alert('Não foi possível obter sua localização: ' + error.message);
          }
        );
      } else {
        alert('Geolocalização não é suportada neste navegador.');
      }
    } else {
      // No React Native, pedir para o usuário usar o botão de manual
      Alert.alert(
        'Localização',
        'Use o botão "Obter Coordenadas" para abrir o aplicativo de mapas e obter suas coordenadas.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.placeholderText}>🌍 Mapa</Text>
        <Text style={styles.placeholderSubtext}>
          Toque no botão abaixo para selecionar sua localização
        </Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={focusOnCurrentLocation}
        >
          <Text style={styles.buttonText}>Usar Minha Localização Atual</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.locationButton, styles.manualButton]}
          onPress={handleManualLocation}
        >
          <Text style={styles.buttonText}>Obter Coordenadas no Mapa</Text>
        </TouchableOpacity>
      </View>

      {selectedLocation && (
        <View style={styles.coordinatesContainer}>
          <Text style={styles.coordinatesText}>
            Latitude: {selectedLocation.latitude.toFixed(6)}
          </Text>
          <Text style={styles.coordinatesText}>
            Longitude: {selectedLocation.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bbdefb',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#546e7a',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    flexWrap: 'wrap',
  },
  locationButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    minWidth: '48%',
    alignItems: 'center',
    marginBottom: 10,
  },
  manualButton: {
    backgroundColor: '#ff9800',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  coordinatesContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});

export default UniversalMap;