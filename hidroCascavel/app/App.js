import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CarrosselInicial from './components/CarosselInicial';

export default function App() {
  return (
    <View style={styles.container}>
      <CarrosselInicial />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '50%',
    backgroundColor: '#ffcbdb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
