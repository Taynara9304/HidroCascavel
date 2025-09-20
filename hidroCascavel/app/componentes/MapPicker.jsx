// components/MapPicker.jsx
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Platform, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

// Componente específico para Web
const WebMapComponent = ({ onLocationSelect, initialLocation }) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      try {
        // Verificar se a mensagem é do nosso iframe
        if (event.origin !== window.location.origin) return;
        
        const data = JSON.parse(event.data);
        if (data.type === 'locationSelected') {
          onLocationSelect({
            latitude: data.latitude,
            longitude: data.longitude
          });
        }
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLocationSelect]);

  const iframeHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapa</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100%; }
        .loading { 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%); 
            text-align: center; 
            color: #666; 
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <div id="loading" class="loading">Carregando mapa...</div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script>
        let map, marker;
        const initialCoords = [${initialLocation.latitude}, ${initialLocation.longitude}];

        function initMap() {
            console.log('Iniciando mapa...');
            document.getElementById('loading').style.display = 'none';
            
            map = L.map('map').setView(initialCoords, 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            marker = L.marker(initialCoords, {
                draggable: true
            }).addTo(map);

            map.on('click', function(e) {
                updateMarkerPosition(e.latlng);
            });

            marker.on('dragend', function(e) {
                updateMarkerPosition(e.target.getLatLng());
            });

            // Adicionar controle de localização
            L.control.locate({
                position: 'topright'
            }).addTo(map);

            // Sinalizar que o mapa está pronto
            window.parent.postMessage(JSON.stringify({
                type: 'mapReady'
            }), '*');
        }

        function updateMarkerPosition(coords) {
            marker.setLatLng(coords);
            window.parent.postMessage(JSON.stringify({
                type: 'locationSelected',
                latitude: coords.lat,
                longitude: coords.lng
            }), '*');
        }

        function useCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const coords = [position.coords.latitude, position.coords.longitude];
                        map.setView(coords, 15);
                        updateMarkerPosition({ lat: coords[0], lng: coords[1] });
                    },
                    function(error) {
                        console.error('Erro de geolocalização:', error);
                    }
                );
            }
        }

        // Inicializar quando o Leaflet carregar
        if (typeof L !== 'undefined') {
            initMap();
        } else {
            console.error('Leaflet não carregou');
        }

        // Fallback para caso o Leaflet demore
        setTimeout(() => {
            if (typeof L === 'undefined') {
                document.getElementById('loading').innerHTML = 'Erro ao carregar o mapa. Recarregue a página.';
            }
        }, 5000);
    </script>
</body>
</html>
  `;

  const handleGetCurrentLocation = () => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify({
        type: 'useCurrentLocation'
      }), '*');
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <iframe
            ref={iframeRef}
            srcDoc={iframeHTML}
            style={styles.iframe}
            onLoad={() => setIframeLoaded(true)}
            allow="geolocation"
          />
          {!iframeLoaded && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#2685BF" />
              <Text style={styles.loadingText}>Carregando mapa...</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={handleGetCurrentLocation}
        >
          <Text style={styles.locationButtonText}>📍 Usar Minha Localização</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

// Componente para Mobile (Android/iOS)
const MobileMapComponent = ({ onLocationSelect, initialLocation }) => {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  const mobileHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mapa</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100%; }
        .loading { 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%); 
            text-align: center; 
            color: #666; 
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <div id="loading" class="loading">Carregando mapa...</div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script>
        let map, marker;
        const initialCoords = [${initialLocation.latitude}, ${initialLocation.longitude}];

        function initMap() {
            document.getElementById('loading').style.display = 'none';
            
            map = L.map('map').setView(initialCoords, 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            marker = L.marker(initialCoords, {
                draggable: true
            }).addTo(map);

            map.on('click', function(e) {
                updateMarkerPosition(e.latlng);
            });

            marker.on('dragend', function(e) {
                updateMarkerPosition(e.target.getLatLng());
            });

            // Adicionar controle de localização
            L.control.locate({
                position: 'topright'
            }).addTo(map);
        }

        function updateMarkerPosition(coords) {
            marker.setLatLng(coords);
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'locationSelected',
                    latitude: coords.lat,
                    longitude: coords.lng
                }));
            }
        }

        function useCurrentLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        const coords = [position.coords.latitude, position.coords.longitude];
                        map.setView(coords, 15);
                        updateMarkerPosition({ lat: coords[0], lng: coords[1] });
                    },
                    function(error) {
                        console.error('Erro de geolocalização:', error);
                    }
                );
            }
        }

        window.onload = initMap;

        setTimeout(() => {
            if (typeof L === 'undefined') {
                document.getElementById('loading').innerHTML = 'Erro ao carregar o mapa';
            }
        }, 5000);
    </script>
</body>
</html>
  `;

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'locationSelected') {
        onLocationSelect({
          latitude: data.latitude,
          longitude: data.longitude
        });
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  };

  const handleGetCurrentLocation = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(`
        if (typeof useCurrentLocation === 'function') {
          useCurrentLocation();
        }
      `);
    }
  };

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: mobileHTML }}
            style={styles.webview}
            onLoadEnd={() => setLoading(false)}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2685BF" />
                <Text style={styles.loadingText}>Carregando mapa...</Text>
              </View>
            )}
          />
          
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#2685BF" />
              <Text style={styles.loadingText}>Carregando mapa...</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={handleGetCurrentLocation}
        >
          <Text style={styles.locationButtonText}>📍 Usar Minha Localização</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

// Componente principal
const MapPicker = ({ onLocationSelect, initialLocation }) => {
  return (
    <View style={styles.wrapper}>
      {Platform.OS === 'web' ? (
        <WebMapComponent 
          onLocationSelect={onLocationSelect} 
          initialLocation={initialLocation} 
        />
      ) : (
        <MobileMapComponent 
          onLocationSelect={onLocationSelect} 
          initialLocation={initialLocation} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  container: {
    width: '100%',
  },
  mapContainer: {
    height: 300,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  locationButton: {
    marginTop: 10,
    backgroundColor: '#2685BF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  locationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapPicker;