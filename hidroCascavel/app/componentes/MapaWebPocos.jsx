import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapaWebPocos = ({ markers = [] }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

    const loadLeaflet = () => {
      if (window.L) {
        initMap();
        return;
      }

      // Carregar CSS do Leaflet
      const leafletCss = document.createElement('link');
      leafletCss.rel = 'stylesheet';
      leafletCss.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
      document.head.appendChild(leafletCss);

      // Carregar JS do Leaflet
      const leafletJs = document.createElement('script');
      leafletJs.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      leafletJs.onload = () => {
        setTimeout(initMap, 100);
      };
      document.head.appendChild(leafletJs);
    };

    const initMap = () => {
      if (!window.L || !mapRef.current) return;

      try {
        // Calcular centro baseado nos marcadores
        const centerLat = markers.length > 0 ? markers[0].latitude : -23.5505;
        const centerLng = markers.length > 0 ? markers[0].longitude : -46.6333;
        
        const map = window.L.map(mapRef.current).setView([centerLat, centerLng], 13);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Adicionar marcadores
        markers.forEach(marker => {
          const customIcon = window.L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${getColorByStatus(marker.status)}; 
                           width: 20px; height: 20px; border-radius: 50%; 
                           border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });

          window.L.marker([marker.latitude, marker.longitude], { icon: customIcon })
            .addTo(map)
            .bindPopup(`
              <div style="padding: 12px; min-width: 250px;">
                <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${marker.titulo}</h3>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${marker.endereco}</p>
                <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">Data: ${marker.data}</p>
                <p style="margin: 0; color: ${getColorByStatus(marker.status)}; font-weight: bold; font-size: 14px;">
                  Status: ${marker.status}
                </p>
              </div>
            `);
        });

        // Ajustar view para mostrar todos os marcadores
        if (markers.length > 0) {
          const group = new window.L.featureGroup(
            markers.map(m => window.L.marker([m.latitude, m.longitude]))
          );
          map.fitBounds(group.getBounds().pad(0.1));
        }

        setMapLoaded(true);
      } catch (error) {
        console.error('Erro ao inicializar mapa:', error);
      }
    };

    loadLeaflet();

    return () => {
      if (window.L && mapRef.current) {
        const mapElement = mapRef.current;
        if (mapElement._leaflet_id) {
          window.L.map(mapElement).remove();
        }
      }
    };
  }, [markers]);

  if (markers.length === 0) {
    return (
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Nenhum poço cadastrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '10px',
          minHeight: '400px'
        }}
      />
      {!mapLoaded && (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Carregando mapa...</Text>
        </View>
      )}
    </View>
  );
};

const getColorByStatus = (status) => {
  switch (status) {
    case 'Agendado': return '#2196F3';
    case 'Pendente': return '#FF9800';
    case 'Concluído': return '#4CAF50';
    default: return '#2685BF';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 400,
    position: 'relative',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    height: 400,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default MapaWebPocos;