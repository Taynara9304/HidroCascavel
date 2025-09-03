import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import CarosselInicial from './secoes/CarosselInicial';
import Apresentacao from './secoes/Apresentacao';
const App = () => {
  const { width } = useWindowDimensions();
  const contentWidth = width < 800 ? width : width * 0.6;

  return (
    <ScrollView>
      <View style={styles.containerApp}>
        <View style={[styles.contentContainer, { width: contentWidth }]}>
          <CarosselInicial containerWidth={contentWidth} />
          <Apresentacao />
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
    margin: 0,
  },
  contentContainer: {
    alignItems: 'center',
    margin: 0,
  }
});

export default App;
