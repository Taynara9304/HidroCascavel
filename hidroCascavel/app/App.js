// App.js atualizado
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './contexts/authContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './services/toastConfig';
import Loading from './componentes/Loading';

import TelaInicial from './telas/TelaInicial';
import Login from './telas/Login';
import Cadastro from './telas/Cadastro';
import TipoCadastro from './telas/TipoCadastro';
import CadastrarAnalista from './telas/CadastroAnalista'; // Adicione estas importações
import CadastrarAdm from './telas/CadastroAdm'; // Adicione estas importações
import AuthStack from './navigation/AuthStack';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading message="Verificando autenticação..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      ) : (
        <>
          <Stack.Screen name="TelaInicial" component={TelaInicial} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="TipoCadastro" component={TipoCadastro} />
          <Stack.Screen name="CadastrarAnalista" component={CadastrarAnalista} />
          <Stack.Screen name="CadastrarAdm" component={CadastrarAdm} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;