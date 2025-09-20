// components/MobileMap.jsx
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Linking, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

const MobileMap = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const webViewRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
    } catch (error) {
      console.log('Erro ao verificar permissão:', error);
    }
  };

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <style>
        body { margin: 0; padding: 0; }
        #map { width: 100%; height: 100vh; }
        .leaflet-container { background: #f8f9fa; }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script>
        let map, marker;
        const initialLocation = { 
            lat: ${initialLocation.latitude}, 
            lng: ${initialLocation.longitude} 
        };

        function initMap() {
            map = L.map('map').setView([initialLocation.lat, initialLocation.lng], 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            marker = L.marker([initialLocation.lat, initialLocation.lng], {
                draggable: true
            }).addTo(map);

            // Evento de clique no mapa
            map.on('click', function(e) {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'locationSelected',
                    latitude: lat,
                    longitude: lng
                }));
            });

            // Evento de arrastar marcador
            marker.on('dragend', function(e) {
                const { lat, lng } = marker.getLatLng();
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'locationSelected',
                    latitude: lat,
                    longitude: lng
                }));
            });

            // Configurações para mobile
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
            map.dragging.enable();

            // Notificar que o mapa está carregado
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapLoaded'
            }));
        }

        function setMapLocation(lat, lng) {
            if (map && marker) {
                map.setView([lat, lng], 15);
                marker.setLatLng([lat, lng]);
            }
        }

        // Inicializar o mapa quando a página carregar
        document.addEventListener('DOMContentLoaded', initMap);
    </script>
</body>
</html>
`;

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'locationSelected') {
        const location = { latitude: data.latitude, longitude: data.longitude };
        setSelectedLocation(location);
        onLocationSelect(location);
      }
      
      if (data.type === 'mapLoaded') {
        setMapLoaded(true);
      }
    } catch (error) {
      console.log('Erro ao processar mensagem:', error);
    }
  };

  const focusOnCurrentLocation = async () => {
    try {
      if (!hasLocationPermission) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setHasLocationPermission(status === 'granted');
        
        if (status !== 'granted') {
          Alert.alert(
            'Permissão necessária',
            'Precisamos da permissão de localização para encontrar sua posição.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Abrir Configurações', onPress: () => Linking.openSettings() }
            ]
          );
          return;
        }
      }

      Alert.alert(
        'Buscando localização',
        'Procurando sua posição atual...',
        [{ text: 'OK' }],
        { cancelable: false }
      );

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000,
      });

      const { latitude, longitude } = location.coords;
      const newLocation = { latitude, longitude };
      
      setSelectedLocation(newLocation);
      onLocationSelect(newLocation);

      // Mover o mapa para a localização atual
      if (webViewRef.current && mapLoaded) {
        webViewRef.current.injectJavaScript(`
          setMapLocation(${latitude}, ${longitude});
          true;
        `);
      }

      Alert.alert(
        'Localização encontrada!',
        `Sua localização atual foi definida no mapa.`,
        [{ text: 'OK' }]
      );

    } catch (error) {
      console.error('Erro ao obter localização:', error);
      Alert.alert('Erro', 'Não foi possível obter sua localização');
    }
  };

  const openInMapsApp = () => {
    const url = Platform.select({
      ios: `maps://?q=${selectedLocation.latitude},${selectedLocation.longitude}`,
      android: `geo://${selectedLocation.latitude},${selectedLocation.longitude}?q=${selectedLocation.latitude},${selectedLocation.longitude}`
    });

    Linking.openURL(url).catch(() => {
      const webUrl = `https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}`;
      Linking.openURL(webUrl);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        Toque no mapa para selecionar sua localização
      </Text>
      
      <View style={styles.mapContainer}>
        <WebView
          ref={webViewRef}
          style={styles.webview}
          source={{ html: htmlContent }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          automaticallyAdjustContentInsets={false}
        />
        
        <TouchableOpacity 
          style={styles.currentLocationButton}
          onPress={focusOnCurrentLocation}
          disabled={!mapLoaded}
        >
          <Text style={styles.currentLocationText}>📍</Text>
        </TouchableOpacity>
      </View>

      {selectedLocation && (
        <View style={styles.infoContainer}>
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>
              📍 Latitude: {selectedLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.coordinatesText}>
              📍 Longitude: {selectedLocation.longitude.toFixed(6)}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.mapsButton}
            onPress={openInMapsApp}
          >
            <Text style={styles.mapsButtonText}>🗺️ Abrir no App de Mapas</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  instructionText: {
    textAlign: 'center',
    padding: 12,
    backgroundColor: '#2685BF',
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    borderRadius: 8,
  },
  mapContainer: {
    height: 400,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#2685BF',
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentLocationText: {
    fontSize: 20,
  },
  infoContainer: {
    marginTop: 15,
    gap: 10,
  },
  coordinatesContainer: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  coordinatesText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: '500',
    marginBottom: 5,
  },
  mapsButton: {
    backgroundColor: '#ff9800',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  mapsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MobileMap;