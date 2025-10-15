// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeAdm from '../telas/HomeAdm';
import GerenciarUsuarios from '../telas/GerenciarUsuarios';
import GerenciarAnalises from '../telas/GerenciarAnalises';
import GerenciarVisitas from '../telas/GerenciarVisitas';
import GerenciarPocos from '../telas/GerenciarPocos';
import PerfilUsuario from '../componentes/PerfilUsuario';
import GerenciarRelatorios from '../telas/GerenciarRelatorios';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  // Detecta se está no ambiente web
  const isWeb = typeof window !== 'undefined' && window.document;
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        // Configuração padrão: header oculto
        headerShown: false,
        // Configurações que serão usadas quando headerShown for true
        headerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* HomeAdm SEM header */}
      <Stack.Screen 
        name="HomeAdm" 
        component={HomeAdm}
      />
      
      {/* Demais telas COM header apenas na web */}
      <Stack.Screen 
        name="GerenciarUsuarios" 
        component={GerenciarUsuarios}
        options={{ 
          headerShown: isWeb,
          title: "Gerenciar Usuários" 
        }}
      />
      <Stack.Screen 
        name="GerenciarAnalises" 
        component={GerenciarAnalises}
        options={{ 
          headerShown: isWeb,
          title: "Gerenciar Análises" 
        }}
      />
      <Stack.Screen 
        name="GerenciarVisitas" 
        component={GerenciarVisitas}
        options={{ 
          headerShown: isWeb,
          title: "Gerenciar Visitas" 
        }}
      />
      <Stack.Screen 
        name="GerenciarPocos" 
        component={GerenciarPocos}
        options={{ 
          headerShown: isWeb,
          title: "Gerenciar Poços" 
        }}
      />
      <Stack.Screen 
        name="PerfilUsuario" 
        component={PerfilUsuario}
        options={{ 
          headerShown: isWeb,
          title: "Meu perfil"
        }}
      />
      <Stack.Screen 
        name="GerenciarRelatorios" 
        component={GerenciarRelatorios}
        options={{ title: 'Gerenciar Relatórios' }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;