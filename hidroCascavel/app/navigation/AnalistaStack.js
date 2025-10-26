// navigation/AnalistaStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeAnalista from '../telas/HomeAnalista';
import MinhasSolicitacoes from '../telas/MinhasSolicitacoes';
import NovaSolicitacao from '../telas/NovaSolicitacao';

const Stack = createNativeStackNavigator();

const AnalistaStack = () => {
  const isWeb = typeof window !== 'undefined' && window.document;
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeAnalista" component={HomeAnalista} />
      <Stack.Screen 
        name="MinhasSolicitacoes" 
        component={MinhasSolicitacoes}
        options={{ 
          headerShown: isWeb,
          title: "Minhas Solicitações" 
        }}
      />
      <Stack.Screen 
        name="NovaSolicitacao" 
        component={NovaSolicitacao}
        options={{ 
          headerShown: isWeb,
          title: "Nova Solicitação" 
        }}
      />
    </Stack.Navigator>
  );
};

export default AnalistaStack;