// componentes/PocosContainer.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/authContext';
import AddPocosProprietario from './AddPocosProprietario';
import AddPocosAnalista from './AddPocosAnalista';
import AddPocosAdmin from './AddPocosAdmin';

const PocosContainer = ({ onAdicionarPoco }) => {
  const { userData, loading } = useAuth();

  console.log('PocosContainer: userData completo:', userData);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2685BF" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </View>
    );
  }

  const userType = userData?.tipoUsuario || 'proprietario';
  
  console.log('PocosContainer: Tipo de usuário detectado:', userType);

  const renderFormByUserType = () => {
    switch (userType) {
      case 'administrador':
        console.log('Renderizando formulário do ADMIN para poços');
        return <AddPocosAdmin onAdicionarPoco={onAdicionarPoco} />;
      
      case 'analista':
        console.log('Renderizando formulário do ANALISTA para poços');
        return <AddPocosAnalista onAdicionarPoco={onAdicionarPoco} />;
      
      case 'proprietario':
      default:
        console.log('Renderizando formulário do PROPRIETÁRIO para poços');
        return <AddPocosProprietario onAdicionarPoco={onAdicionarPoco} />;
    }
  };

  return (
    <View style={styles.container}>
      {renderFormByUserType()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default PocosContainer;