import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './contexts/authContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './services/toastConfig';

import TelaInicial from './telas/TelaInicial';
import Login from './telas/Login';
import Cadastro from './telas/Cadastro';
import HomeAdm from './telas/HomeAdm';
import GerenciarUsuarios from './telas/GerenciarUsuarios';
import GerenciarAnalises from './telas/GerenciarAnalises';
import GerenciarVisitas from './telas/GerenciarVisitas';
import GerenciarPocos from './telas/GerenciarPocos';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="/" component={TelaInicial} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="HomeAdm" component={HomeAdm} />
          <Stack.Screen name="GerenciarUsuarios" component={GerenciarUsuarios} />
          <Stack.Screen name="GerenciarAnalises" component={GerenciarAnalises} />
          <Stack.Screen name="GerenciarVisitas" component={GerenciarVisitas} />
          <Stack.Screen name="GerenciarPocos" component={GerenciarPocos} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </AuthProvider>
  );
}

export default App;
