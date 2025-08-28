import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CarrosselInicial from './secoes/CarosselInicial';
import NavBar from './componentes/NavBar';

const App = () => {
  return (
    <View style={styles.container}>
      <CarrosselInicial />
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '60%',
    margin: 'auto',
  }
});

export default App;