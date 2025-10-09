import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapaWebPocos from './MapaWebPocos';
import MapaMobilePocos from './MapaMobilePocos';

const MapaUniversalPocos = ({ markers = [], onLocationSelected }) => {
  console.log('Plataforma:', Platform.OS);
  console.log('Número de marcadores:', markers.length);

  // Adicione esta função para lidar com cliques no mapa
  const handleMapClick = (event) => {
    if (onLocationSelected) {
      // Para Web - você precisará adaptar conforme seu componente de mapa
      const { lat, lng } = event.latlng || event;
      onLocationSelected({ latitude: lat, longitude: lng });
    }
  };

  return (
   <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <MapaWebPocos 
          markers={markers} 
          onLocationSelected={handleMapClick}
        />
      ) : (
        <MapaMobilePocos 
          markers={markers} 
          onLocationSelected={handleMapClick}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10,
  },
});

export default MapaUniversalPocos;