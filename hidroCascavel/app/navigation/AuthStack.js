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
import VoltarHome from '../componentes/VoltarHome'; // Importe seu componente

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  // Detecta se está no ambiente web
  const isWeb = typeof window !== 'undefined' && window.document;
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        // Configuração padrão: header oculto
        headerShown: false,
      }}
    >
      {/* HomeAdm SEM header */}
      <Stack.Screen 
        name="HomeAdm" 
        component={HomeAdm}
      />
      
      {/* Demais telas COM header personalizado apenas na web */}
      <Stack.Screen 
        name="GerenciarUsuarios" 
        component={GerenciarUsuarios}
        options={{ 
          headerShown: isWeb,
          header: (props) => (
            <VoltarHome 
              {...props}
              tela="HomeAdm" 
              titulo="Gerenciar Usuários" 
            />
          )
        }}
      />
      <Stack.Screen 
        name="GerenciarAnalises" 
        component={GerenciarAnalises}
        options={{ 
          headerShown: isWeb,
          header: (props) => (
            <VoltarHome 
              {...props}
              tela="HomeAdm" 
              titulo="Gerenciar Análises" 
            />
          )
        }}
      />
      <Stack.Screen 
        name="GerenciarVisitas" 
        component={GerenciarVisitas}
        options={{ 
          headerShown: isWeb,
          header: (props) => (
            <VoltarHome 
              {...props}
              tela="HomeAdm" 
              titulo="Gerenciar Visitas" 
            />
          )
        }}
      />
      <Stack.Screen 
        name="GerenciarPocos" 
        component={GerenciarPocos}
        options={{ 
          headerShown: isWeb,
          header: (props) => (
            <VoltarHome 
              {...props}
              tela="HomeAdm" 
              titulo="Gerenciar Poços" 
            />
          )
        }}
      />
      <Stack.Screen 
        name="PerfilUsuario" 
        component={PerfilUsuario}
        options={{ 
          headerShown: isWeb,
          header: (props) => (
            <VoltarHome 
              {...props}
              tela="HomeAdm" 
              titulo="Meu Perfil" 
            />
          )
        }}
      />
      <Stack.Screen 
        name="GerenciarRelatorios" 
        component={GerenciarRelatorios}
        options={{ 
          headerShown: isWeb,
          header: (props) => (
            <VoltarHome 
              {...props}
              tela="HomeAdm" 
              titulo="Gerenciar Relatórios" 
            />
          )
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;