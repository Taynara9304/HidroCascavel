import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../services/firebaseConfig';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Salvar dados do usuário no AsyncStorage
  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  };

  // Limpar dados do usuário
  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao limpar dados do usuário:', error);
    }
  };

  // Carregar dados do usuário do AsyncStorage
  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setIsAuthenticated(true);
        return parsedUserData;
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      return null;
    }
  };

  // Buscar dados do usuário no Firestore
  const buscarDadosUsuario = async (firebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = { 
          ...userDocSnap.data(), 
          uid: firebaseUser.uid,
          email: firebaseUser.email 
        };

        await saveUserData(userData);
        return userData;
      } else {
        // Se não encontrou no Firestore, cria um objeto básico
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          nome: firebaseUser.displayName || 'Usuário',
          dataCriacao: new Date().toISOString()
        };
        
        await saveUserData(userData);
        return userData;
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw error;
    }
  };

  // Fazer logout
  const logout = async () => {
    try {
      await auth.signOut();
      await clearUserData();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      
      if (firebaseUser) {
        try {
          await buscarDadosUsuario(firebaseUser);
        } catch (error) {
          console.error('Erro ao processar usuário autenticado:', error);
          await clearUserData();
        }
      } else {
        await clearUserData();
      }
      
      setIsLoading(false);
    });

    // Carregar dados salvos enquanto verifica a autenticação do Firebase
    loadUserData().finally(() => {
      // Garante que o loading para após um tempo máximo
      setTimeout(() => setIsLoading(false), 2000);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    saveUserData,
    clearUserData,
    buscarDadosUsuario,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};