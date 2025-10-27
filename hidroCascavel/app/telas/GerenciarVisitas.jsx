// screens/GerenciarVisitas.js - VERSÃO FINAL CORRIGIDA
import React from 'react';
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import TabelaVisitas from '../componentes/TabelaVisitas';
import VisitasContainer from '../componentes/VisitasContainer'; // ✅ Use VisitasContainer
import useVisitas from '../hooks/useTabelaVisitas';
import { useAuth } from '../contexts/authContext'; // ✅ Adicione isso

const GerenciarVisitas = () => {
  const { userData } = useAuth(); // ✅ Adicione para debug
  const {
    visits,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort,
    addVisit,
    editVisit,
    deleteVisit,
  } = useVisitas();

  console.log('🎯 GerenciarVisitas: Estado do hook -', { 
    visitsCount: visits?.length, 
    loading, 
    error,
    sortField,
    sortDirection
  });

  // ✅ Adicione debug do tipo de usuário
  console.log('🎯 GerenciarVisitas: Tipo de usuário atual:', userData?.tipoUsuario);

  const handleAdicionarVisita = async (novaVisita) => {
    try {
      console.log('🎯 GerenciarVisitas: Recebendo nova visita', novaVisita);
      await addVisit(novaVisita);
      Alert.alert('Sucesso', 'Visita cadastrada com sucesso!');
    } catch (error) {
      console.error('❌ GerenciarVisitas: Erro no addVisit:', error);
      Alert.alert('Erro', `Não foi possível cadastrar a visita: ${error.message}`);
    }
  };

  const handleDeleteVisit = async (visitId) => {
    try {
      await deleteVisit(visitId);
      Alert.alert('Sucesso', 'Visita deletada com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar visita:', error);
      Alert.alert('Erro', 'Não foi possível deletar a visita.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2685BF" />
        <Text style={styles.loadingText}>Carregando visitas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <Text style={styles.errorSubtext}>Verifique a conexão com o Firebase</Text>
      </View>
    );
  }

  // screens/GerenciarVisitas.js - VERSÃO ATUALIZADA
// ... imports e código anterior ...

return (
  <View style={styles.container}>
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* ✅ Adicione debug info se necessário */}
      
      {/* ✅ Use VisitasContainer passando TODAS as props */}
      <VisitasContainer 
        onAdicionarVisita={handleAdicionarVisita}
        visits={visits}
        loading={loading}
        error={error}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
        editVisit={editVisit}
        deleteVisit={handleDeleteVisit}
        onSolicitarAlteracao={(visitId, motivo) => {
          // ✅ Implementar função de solicitação de alteração
          console.log('Solicitar alteração:', visitId, motivo);
          Alert.alert('Solicitação Enviada', 'Sua solicitação foi enviada para o administrador');
        }}
      />
    </ScrollView>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  debugContainer: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2685BF',
  },
  debugText: {
    fontSize: 12,
    color: '#2685BF',
    fontWeight: 'bold',
  },
  debugSubtext: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default GerenciarVisitas;