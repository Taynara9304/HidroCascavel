import { StyleSheet, View, useWindowDimensions } from 'react-native';
import CarosselInicial from './secoes/CarosselInicial';

const App = () => {
  const { width } = useWindowDimensions();
  const contentWidth = width * 0.6;

  return (
    <View style={styles.containerApp}>
      <View style={[styles.contentContainer, { width: contentWidth }]}>
        <CarosselInicial containerWidth={contentWidth} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerApp: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  contentContainer: {
    alignItems: 'center',
  }
});

export default App;