// navigation/AuthStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeAdm from '../telas/HomeAdm';
import GerenciarUsuarios from '../telas/GerenciarUsuarios';
import GerenciarAnalises from '../telas/GerenciarAnalises';
import GerenciarVisitas from '../telas/GerenciarVisitas';
import GerenciarPocos from '../telas/GerenciarPocos';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeAdm" component={HomeAdm} />
      <Stack.Screen name="GerenciarUsuarios" component={GerenciarUsuarios} />
      <Stack.Screen name="GerenciarAnalises" component={GerenciarAnalises} />
      <Stack.Screen name="GerenciarVisitas" component={GerenciarVisitas} />
      <Stack.Screen name="GerenciarPocos" component={GerenciarPocos} />
    </Stack.Navigator>
  );
};

export default AuthStack;