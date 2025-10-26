// navigation/ProprietarioStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeProprietario from '../telas/HomeProprietario';
import MeusDados from '../telas/MeusDados';
import MinhasVisitas from '../telas/MinhasVisitas';
import PerfilUsuario from '../telas/PerfilUsuario';

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

      <Stack.Screen 
        name="PerfilUsuario" 
        component={PerfilUsuario}
        options={{ 
          headerShown: isWeb,
          title: "Meu Perfil" 
        }}
      />
    </Stack.Navigator>
  );
};

export default ProprietarioStack;