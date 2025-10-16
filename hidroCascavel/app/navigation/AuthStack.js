// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeAdm from '../telas/HomeAdm';
import HomeAnalista from '../telas/HomeAnalista';
import HomeProprietario from '../telas/HomeProprietario';
import GerenciarUsuarios from '../telas/GerenciarUsuarios';
import GerenciarAnalises from '../telas/GerenciarAnalises';
import GerenciarVisitas from '../telas/GerenciarVisitas';
import GerenciarPocos from '../telas/GerenciarPocos';
import PerfilUsuario from '../telas/PerfilUsuario';
import GerenciarRelatorios from '../telas/GerenciarRelatorios';
import TipoCadastro from '../telas/TipoCadastro';
import VoltarHome from '../componentes/VoltarHome';

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
      <Stack.Screen 
        name="HomeAnalista" 
        component={HomeAnalista}
      />

      <Stack.Screen 
        name="HomeProprietario" 
        component={HomeProprietario}
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
      <Stack.Screen 
        name="TipoCadastro" 
        component={TipoCadastro}
        options={{ 
          headerShown: isWeb,
          header: (props) => (
            <VoltarHome 
              {...props}
              tela="Cadastro" 
              titulo="Tipo usuário" 
            />
          )
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;