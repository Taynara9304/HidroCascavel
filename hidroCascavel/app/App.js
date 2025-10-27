// App.js - VERSÃO CORRIGIDA
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './contexts/authContext';
import Toast from 'react-native-toast-message';
import { toastConfig } from './services/toastConfig';
import { ActivityIndicator, View, Text } from 'react-native';

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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2685BF" />
        <Text style={{ marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  console.log('🎯 Estado atual no AppContent:', { 
    user: user?.uid, 
    userData: userData,
    tipoUsuario: userData?.tipoUsuario 
  });

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // ✅ CORRIGIDO: Telas de auth como children diretos, não como componente AuthStack
        <>
          <Stack.Screen name="TelaInicial" component={TelaInicial} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="TipoUsuario" component={TipoUsuario} />
          <Stack.Screen name="TipoCadastro" component={TipoCadastro} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
          <Stack.Screen name="CadastroAnalista" component={CadastroAnalista} />
          <Stack.Screen name="CadastroAdm" component={CadastroAdm} />
        </>
      ) : userData && userData.tipoUsuario ? (
        // ✅ CORRIGIDO: Usuário LOGADO com dados e tipoUsuario definido
        (() => {
          const tipo = userData.tipoUsuario;
          console.log('🎯 Redirecionando para stack do tipo:', tipo);
          
          switch (tipo) {
            case 'proprietario':
              return <Stack.Screen name="ProprietarioStack" component={ProprietarioStack} />;
            case 'analista':
              return <Stack.Screen name="AnalistaStack" component={AnalistaStack} />;
            case 'administrador':
              return <Stack.Screen name="AdministradorStack" component={AdministradorStack} />;
            default:
              // Fallback para caso o tipo não seja reconhecido
              return (
                <>
                  <Stack.Screen name="TelaInicial" component={TelaInicial} />
                  <Stack.Screen name="Login" component={Login} />
                </>
              );
          }
        })()
      ) : (
        // ✅ CORRIGIDO: Usuário logado mas sem dados ou tipoUsuario indefinido
        <>
          <Stack.Screen name="TelaInicial" component={TelaInicial} />
          <Stack.Screen name="Login" component={Login} />
        </>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  console.log('🚀 App.js executando');
  
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;