// navigation/ProprietarioStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeProprietario from '../telas/HomeProprietario';
import MeusDados from '../telas/MeusDados';
import MinhasVisitas from '../telas/MinhasVisitas';

const Stack = createNativeStackNavigator();

const ProprietarioStack = () => {
  const isWeb = typeof window !== 'undefined' && window.document;
  
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeProprietario" component={HomeProprietario} />
      <Stack.Screen 
        name="MeusDados" 
        component={MeusDados}
        options={{ 
          headerShown: isWeb,
          title: "Meus Dados" 
        }}
      />
      <Stack.Screen 
        name="MinhasVisitas" 
        component={MinhasVisitas}
        options={{ 
          headerShown: isWeb,
          title: "Minhas Visitas" 
        }}
      />
    </Stack.Navigator>
  );
};

export default ProprietarioStack;