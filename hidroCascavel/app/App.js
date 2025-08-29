import { StyleSheet, View, useWindowDimensions } from 'react-native';
import CarosselInicial from './secoes/CarosselInicial';
import NavBar from './componentes/NavBar';

const App = () => {
  const { width } = useWindowDimensions();
  const contentWidth = width < 800 ? width : width * 0.6;
  return (
    <View style={styles.containerApp}>
      <View style={[styles.contentContainer, { width: contentWidth }]}>
        <CarosselInicial containerWidth={contentWidth} />
        <NavBar />
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
    paddingTop: 0,
  },
  contentContainer: {
    alignItems: 'center',
  }
});

export default App;