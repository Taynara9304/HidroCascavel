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

  console.log('🚀 AppContent - Estado:', {
    user: user?.uid,
    userData: userData?.tipoUsuario,
    loading
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2685BF" />
        <Text style={{ marginTop: 10 }}>Carregando...</Text>
      </View>
    );
  }

  console.log('🎯 AppContent - Renderizando navegação:', user ? 'LOGADO' : 'NÃO LOGADO');

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Usuário NÃO logado
        <>
          <Stack.Screen name="TelaInicial" component={TelaInicial} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="TipoUsuario" component={TipoUsuario} />
          <Stack.Screen name="Cadastro" component={Cadastro} />
        </>
      ) : (
        // Usuário LOGADO - Redireciona baseado no tipo
        (() => {
          console.log('🔀 Usuário logado, verificando tipo:', userData?.tipoUsuario);
          
          if (!userData) {
            console.log('⚠️ userData está vazio');
            return <Stack.Screen name="TelaInicial" component={TelaInicial} />;
          }

          const tipo = userData.tipoUsuario;
          console.log('🎯 Tipo de usuário encontrado:', tipo);

          switch (tipo) {
            case 'proprietario':
              console.log('🏠 Navegando para ProprietarioStack');
              return <Stack.Screen name="ProprietarioStack" component={ProprietarioStack} />;
            case 'analista':
              console.log('🔬 Navegando para AnalistaStack');
              return <Stack.Screen name="AnalistaStack" component={AnalistaStack} />;
            case 'administrador':
              console.log('👨‍💼 Navegando para AdministradorStack');
              return <Stack.Screen name="AdministradorStack" component={AdministradorStack} />;
            default:
              console.log('❓ Tipo desconhecido:', tipo);
              return <Stack.Screen name="TelaInicial" component={TelaInicial} />;
          }
        })()
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