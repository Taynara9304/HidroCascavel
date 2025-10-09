import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

const MapaSelecaoSimples = ({ onLocationSelected, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Localização padrão (Cascavel-PR)
  const defaultLocation = { 
    latitude: -24.9555, 
    longitude: -53.4562 
  };

  useEffect(() => {
    // Se veio com uma localização inicial, usar ela
    if (initialLocation && initialLocation.latitude && initialLocation.longitude) {
      setSelectedLocation(initialLocation);
      setHasUserSelected(true);
    } else {
      setSelectedLocation(defaultLocation);
    }

    if (Platform.OS === 'web') {
      loadWebMap();
    }
  }, []);

  const loadWebMap = () => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Verificar se Leaflet já está carregado
    if (window.L) {
      initWebMap();
      return;
    }

    // Carregar CSS do Leaflet
    if (!document.querySelector('link[href*="leaflet"]')) {
      const leafletCss = document.createElement('link');
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      leafletCss.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      leafletCss.crossOrigin = "";
      document.head.appendChild(leafletCss);
    }

    // Carregar JavaScript do Leaflet
    if (!document.querySelector('script[src*="leaflet"]')) {
      const leafletJs = document.createElement('script');
      leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletJs.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      leafletJs.crossOrigin = "";
      leafletJs.onload = () => {
        setTimeout(initWebMap, 100);
      };
      document.head.appendChild(leafletJs);
    } else {
      setTimeout(initWebMap, 100);
    }
  };

  const initWebMap = () => {
    if (!window.L || !mapContainerRef.current) {
      console.log('Leaflet não carregou ou container não existe');
      return;
    }

    try {
      // Limpar mapa existente se houver
      if (mapRef.current) {
        mapRef.current.remove();
      }

      // Criar novo mapa
      const locationToUse = selectedLocation || defaultLocation;
      
      const map = window.L.map(mapContainerRef.current).setView(
        [locationToUse.latitude, locationToUse.longitude],
        13
      );

      // Adicionar tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Adicionar marcador se tiver localização selecionada
      if (selectedLocation) {
        const marker = window.L.marker([selectedLocation.latitude, selectedLocation.longitude], {
          draggable: true
        }).addTo(map);

        marker.on('dragend', function() {
          const { lat, lng } = this.getLatLng();
          handleLocationSelect(lat, lng);
        });

        markerRef.current = marker;
      }

      // Evento de clique no mapa
      map.on('click', function(e) {
        const { lat, lng } = e.latlng;
        handleLocationSelect(lat, lng);

        // Criar ou mover marcador
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          const newMarker = window.L.marker([lat, lng], {
            draggable: true
          }).addTo(map);
          
          newMarker.on('dragend', function() {
            const { lat, lng } = this.getLatLng();
            handleLocationSelect(lat, lng);
          });
          
          markerRef.current = newMarker;
        }
      });

      mapRef.current = map;
      setMapLoaded(true);

      // Redimensionar mapa após um delay
      setTimeout(() => {
        map.invalidateSize();
      }, 300);

    } catch (error) {
      console.error('Erro ao inicializar mapa:', error);
      Alert.alert('Erro', 'Não foi possível carregar o mapa. Tente recarregar a página.');
    }
  };

const handleLocationSelect = (latitude, longitude) => {
  console.log('MapaSelecaoSimples: handleLocationSelect chamado', { latitude, longitude }); // Debug
  
  const newLocation = { latitude, longitude };
  setSelectedLocation(newLocation);
  setHasUserSelected(true);
  
  // Notificar o componente pai
  if (onLocationSelected) {
    console.log('MapaSelecaoSimples: Chamando onLocationSelected', newLocation); // Debug
    onLocationSelected(newLocation);
  } else {
    console.log('MapaSelecaoSimples: onLocationSelected não está definido'); // Debug
  }
};

  const getCurrentLocation = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleLocationSelect(latitude, longitude);
          
          // Mover mapa para a nova localização
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
            if (markerRef.current) {
              markerRef.current.setLatLng([latitude, longitude]);
            } else {
              // Criar marcador se não existir
              const marker = window.L.marker([latitude, longitude], {
                draggable: true
              }).addTo(mapRef.current);
              
              marker.on('dragend', function() {
                const { lat, lng } = this.getLatLng();
                handleLocationSelect(lat, lng);
              });
              
              markerRef.current = marker;
            }
          }
          
          setIsLoading(false);
        },
        (error) => {
          setIsLoading(false);
          let errorMessage = 'Não foi possível obter sua localização';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada. Habilite nas configurações do seu navegador.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível. Verifique se o GPS está ativado.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo limite excedido ao buscar localização.';
              break;
          }
          
          Alert.alert('Erro', errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    } else {
      setIsLoading(false);
      Alert.alert('Erro', 'Geolocalização não é suportada neste navegador.');
    }
  };

  const handleCoordinateChange = (field, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const newLocation = {
        ...selectedLocation,
        [field]: numValue
      };
      
      setSelectedLocation(newLocation);
      setHasUserSelected(true);
      
      // Atualizar mapa
      if (mapRef.current && markerRef.current) {
        markerRef.current.setLatLng([newLocation.latitude, newLocation.longitude]);
        mapRef.current.setView([newLocation.latitude, newLocation.longitude]);
      }
      
      if (onLocationSelected) {
        onLocationSelected(newLocation);
      }
    }
  };

  const renderWebMap = () => (
    <View style={styles.mapContainer}>
      {!mapLoaded && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#2685BF" />
          <Text style={styles.loadingText}>Carregando mapa...</Text>
        </View>
      )}
      <div 
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '10px'
        }}
      />
    </View>
  );

  const renderMobileMap = () => (
    <View style={styles.mobileMapContainer}>
      <View style={styles.mobileMapPlaceholder}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapTitle}>Mapa Interativo</Text>
        <Text style={styles.mapSubtitle}>
          {hasUserSelected ? 'Localização definida' : 'Use os campos abaixo para definir as coordenadas'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>
        {hasUserSelected ? '✅ Localização selecionada' : 'Selecione a localização do poço'}
      </Text>

      {/* Mapa */}
      {Platform.OS === 'web' ? renderWebMap() : renderMobileMap()}

      {/* Coordenadas */}
      <View style={styles.coordinatesSection}>
        <Text style={styles.sectionTitle}>Coordenadas:</Text>
        
        <View style={styles.coordInputs}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Latitude:</Text>
            <input
              type="number"
              step="any"
              value={selectedLocation?.latitude || ''}
              onChange={(e) => handleCoordinateChange('latitude', e.target.value)}
              style={styles.coordInput}
              placeholder="Ex: -24.9555"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Longitude:</Text>
            <input
              type="number"
              step="any"
              value={selectedLocation?.longitude || ''}
              onChange={(e) => handleCoordinateChange('longitude', e.target.value)}
              style={styles.coordInput}
              placeholder="Ex: -53.4562"
            />
          </View>
        </View>
      </View>

      {/* Botão de localização atual */}
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={getCurrentLocation}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text style={styles.buttonText}>📍 Usar Minha Localização Atual</Text>
        )}
      </TouchableOpacity>

      {/* Preview */}
      {hasUserSelected && selectedLocation && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Localização selecionada:</Text>
          <Text style={styles.previewText}>
            Latitude: {selectedLocation.latitude.toFixed(6)}
          </Text>
          <Text style={styles.previewText}>
            Longitude: {selectedLocation.longitude.toFixed(6)}
          </Text>
        </View>
      )}
    </View>
  );
};

// Estilos
const styles = {
  container: {
    flex: 1,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  mapContainer: {
    height: 400,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2685BF',
    position: 'relative',
    marginBottom: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2685BF',
    fontWeight: '500',
  },
  mobileMapContainer: {
    height: 200,
    marginBottom: 16,
  },
  mobileMapPlaceholder: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bbdefb',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  mapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#546e7a',
    textAlign: 'center',
  },
  coordinatesSection: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  coordInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  coordInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    backgroundColor: 'white',
  },
  locationButton: {
    backgroundColor: '#2685BF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  previewSection: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#2e7d32',
    marginBottom: 4,
  },
};

// Para React Native
if (Platform.OS !== 'web') {
  const { StyleSheet } = require('react-native');
  
  styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    instruction: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 16,
      textAlign: 'center',
      color: '#333',
      padding: 12,
      backgroundColor: '#f0f8ff',
      borderRadius: 8,
    },
    mobileMapContainer: {
      height: 200,
      marginBottom: 16,
    },
    mobileMapPlaceholder: {
      flex: 1,
      backgroundColor: '#e3f2fd',
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#bbdefb',
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    mapEmoji: {
      fontSize: 40,
      marginBottom: 8,
    },
    mapTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1976d2',
      marginBottom: 4,
    },
    mapSubtitle: {
      fontSize: 14,
      color: '#546e7a',
      textAlign: 'center',
    },
    coordinatesSection: {
      backgroundColor: '#f8f9fa',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
      color: '#333',
    },
    coordInputs: {
      flexDirection: 'row',
      gap: 12,
    },
    inputGroup: {
      flex: 1,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 6,
      color: '#333',
    },
    locationButton: {
      backgroundColor: '#2685BF',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },
    previewSection: {
      backgroundColor: '#e8f5e8',
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: '#4CAF50',
    },
    previewTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#2e7d32',
      marginBottom: 8,
    },
    previewText: {
      fontSize: 14,
      color: '#2e7d32',
      marginBottom: 4,
    },
  });
}

export default MapaSelecaoSimples;