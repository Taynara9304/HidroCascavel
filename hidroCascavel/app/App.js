import React from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import TelaInicial from './telas/TelaInicial';

const App = () => {
  const { width } = useWindowDimensions();
  const contentWidth = width < 800 ? width : width * 0.6;

  return (
    <ScrollView>
      <View style={styles.containerApp}>
        <View style={[styles.contentContainer, { width: contentWidth }]}>
          <TelaInicial containerWidth={contentWidth} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerApp: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  contentContainer: {
    alignItems: 'center',
  },
});

export default App;
