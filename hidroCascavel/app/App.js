// App.js - VERSÃO ATUALIZADA COM SAFE AREA
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/authContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './services/toastConfig';
import { ActivityIndicator, View, Text, StatusBar } from 'react-native';
import DeixarAvaliacao from './telas/DeixarAvaliacao';

// Stacks
import ProprietarioStack from './navigation/ProprietarioStack';
import AnalistaStack from './navigation/AnalistaStack';
import AdministradorStack from './navigation/AdminStack';

// Telas de Auth
import TelaInicial from './telas/TelaInicial';
import Login from './telas/Login';
import Cadastro from './telas/Cadastro';
import CadastroAnalista from './telas/CadastroAnalista';
import CadastroAdm from './telas/CadastroAdm';
import TipoUsuario from './telas/TipoUsuario';
import TipoCadastro from './telas/TipoCadastro';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { user, userData, loading } = useAuth();

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2685BF" />
        <Text style={{ marginTop: 10 }}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  let initialRoute = "TelaInicial";

  if (user && userData?.tipoUsuario) {
    switch (userData.tipoUsuario) {
      case 'proprietario':
        initialRoute = "ProprietarioStack";
        break;
      case 'analista':
        initialRoute = "AnalistaStack";
        break;
      case 'administrador':
        initialRoute = "AdministradorStack";
        break;
      default:
        initialRoute = "TelaInicial";
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#046b94ff' }}>
      <StatusBar translucent backgroundColor="transparent" />
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#fff' }
        }}
        initialRouteName={initialRoute} 
      >
        <Stack.Screen name="TelaInicial" component={TelaInicial} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TipoUsuario" component={TipoUsuario} />
        <Stack.Screen name="TipoCadastro" component={TipoCadastro} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="CadastroAnalista" component={CadastroAnalista} />
        <Stack.Screen name="CadastroAdm" component={CadastroAdm} />
        
        <Stack.Screen name="ProprietarioStack" component={ProprietarioStack} />
        <Stack.Screen name="AnalistaStack" component={AnalistaStack} />
        <Stack.Screen name="AdministradorStack" component={AdministradorStack} />
        <Stack.Screen name='DeixarAvaliacao' component={DeixarAvaliacao} />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppContent />
          <Toast config={toastConfig} />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;