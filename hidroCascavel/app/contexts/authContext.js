// contexts/authContext.js - VERSÃO CORRIGIDA
import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const buscarDadosUsuario = async (userFirebase) => {
    try {
      if (userFirebase) {
        console.log('🔍 Buscando dados do usuário no Firestore:', userFirebase.uid);
        const userDoc = await getDoc(doc(db, 'users', userFirebase.uid));
        
        if (userDoc.exists()) {
          const userDataFromFirestore = userDoc.data();
          console.log('Dados encontrados:', userDataFromFirestore);
          setUserData(userDataFromFirestore);
          return userDataFromFirestore;
        } else {
          console.log('Documento do usuário não encontrado no Firestore');
          setUserData(null);
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setUserData(null);
      return null;
    }
  };

  const atualizarDadosUsuario = async (userFirebase) => {
    const dados = await buscarDadosUsuario(userFirebase);
    return dados;
  };

  useEffect(() => {
    console.log('Iniciando observador de autenticação...');
    
    const unsubscribe = onAuthStateChanged(auth, async (userFirebase) => {
      console.log('Estado de autenticação mudou:', userFirebase ? `Usuário logado: ${userFirebase.uid}` : 'Usuário deslogado');
      
      if (userFirebase) {
        console.log('Definindo usuário no estado...');
        setUser(userFirebase);
        await buscarDadosUsuario(userFirebase);
      } else {
        console.log('Usuário deslogado - limpando estado');
        setUser(null);
        setUserData(null);
      }
      
      if (initializing) {
        setInitializing(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [initializing]);

  const value = {
    user,
    userData,
    loading,
    initializing,
    buscarDadosUsuario: atualizarDadosUsuario, // Exporta a função atualizada
    logout: async () => {
      try {
        await signOut(auth);
        setUser(null);
        setUserData(null);
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    }
  };

  console.log('AuthProvider renderizado - Estado:', { 
    user: user?.uid, 
    userData: userData?.tipoUsuario,
    loading,
    initializing
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};