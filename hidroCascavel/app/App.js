import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import CarrosselInicial from './secoes/CarosselInicial';
import NavBar from './componentes/NavBar';

export default function App() {
  return (
    <View>
      <CarrosselInicial />
      <NavBar />
    </View>
  );
}