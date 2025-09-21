import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapaWebPocos from './MapaWebPocos';
import MapaMobilePocos from './MapaMobilePocos';

const MapaUniversalPocos = ({ markers = [] }) => {
  console.log('Plataforma:', Platform.OS);
  console.log('Número de marcadores:', markers.length);

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <MapaWebPocos markers={markers} />
      ) : (
        <MapaMobilePocos markers={markers} />
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