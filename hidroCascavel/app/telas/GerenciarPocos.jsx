// GerenciarPocos.js - VERSÃO CORRIGIDA
import React from 'react';
import { View, Alert, ScrollView } from 'react-native';
import TabelaPocos from '../componentes/TabelaPocos';
import AddPocos from '../componentes/AddPocos';
import useWells from '../hooks/useTabelaPocos';

const GerenciarPocos = () => {
  const {
    wells,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort,
    addWell,
    editWell,
    deleteWell,
  } = useWells();

  console.log('📊 GerenciarPocos: wells =', wells);
  console.log('📊 GerenciarPocos: loading =', loading);
  console.log('📊 GerenciarPocos: error =', error);

  const handleAdicionarPoco = async (novoPoco) => {
    try {
      console.log('🎯 GerenciarPocos: Recebendo novo poço', novoPoco);
      console.log('🎯 GerenciarPocos: Chamando addWell...');
      
      await addWell(novoPoco);
      
      console.log('✅ GerenciarPocos: addWell concluído com sucesso!');
      Alert.alert('Sucesso', 'Poço cadastrado com sucesso!');
    } catch (error) {
      console.error('❌ GerenciarPocos: Erro no addWell:', error);
      console.error('❌ GerenciarPocos: Mensagem completa:', error.message);
      Alert.alert('Erro', `Não foi possível cadastrar o poço: ${error.message}`);
    }
  };

  const handleDeleteWell = async (wellId) => {
    try {
      await deleteWell(wellId);
      Alert.alert('Sucesso', 'Poço deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar poço:', error);
      Alert.alert('Erro', 'Não foi possível deletar o poço.');
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <TabelaPocos
        wells={wells}
        onEdit={editWell}
        onDelete={handleDeleteWell}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      
      <AddPocos onAdicionarPoco={handleAdicionarPoco} />
    </ScrollView>
  );
};

export default GerenciarPocos;