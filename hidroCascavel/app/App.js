// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './contexts/authContext'; // Adicione esta importação

import TelaInicial from './telas/TelaInicial';
import Login from './telas/Login';
import Cadastro from './telas/Cadastro';
import HomeAdm from './telas/HomeAdm';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider> {/* Agora esta linha funcionará */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="/" component={TelaInicial} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="HomeAdm" component={HomeAdm} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;