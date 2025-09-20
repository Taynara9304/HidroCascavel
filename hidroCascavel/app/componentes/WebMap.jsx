// components/WebMap.jsx
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const WebMap = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    // Carregar o Leaflet CSS e JS dinamicamente
    const loadLeaflet = () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      // Verificar se Leaflet já está carregado
      if (window.L) {
        initMap();
        return;
      }

      // Carregar CSS do Leaflet
      const leafletCss = document.createElement('link');
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      leafletCss.integrity = 'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
      leafletCss.crossOrigin = '';
      document.head.appendChild(leafletCss);

      // Carregar JS do Leaflet
      const leafletJs = document.createElement('script');
      leafletJs.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      leafletJs.integrity = 'sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==';
      leafletJs.crossOrigin = '';
      leafletJs.onload = initMap;
      document.head.appendChild(leafletJs);
    };

    const initMap = () => {
      if (!window.L || !mapContainerRef.current) return;

      const mapInstance = window.L.map(mapContainerRef.current).setView(
        [initialLocation.latitude, initialLocation.longitude],
        initialLocation.zoom || 10
      );

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance);

      // Adicionar marcador inicial
      const markerInstance = window.L.marker([
        initialLocation.latitude,
        initialLocation.longitude
      ]).addTo(mapInstance);

      // Evento de clique no mapa
      mapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        const newLocation = { latitude: lat, longitude: lng };
        
        // Mover marcador
        markerInstance.setLatLng([lat, lng]);
        
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation);
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const focusOnCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada neste navegador.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { latitude, longitude };
        
        if (map && marker) {
          map.setView([latitude, longitude], 15);
          marker.setLatLng([latitude, longitude]);
        }
        
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation);
      },
      (error) => {
        alert('Não foi possível obter sua localização: ' + error.message);
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer} ref={mapContainerRef} />
      
      <TouchableOpacity 
        style={styles.currentLocationButton}
        onPress={focusOnCurrentLocation}
      >
        <Text style={styles.currentLocationText}>📍</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
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
});

export default WebMap;