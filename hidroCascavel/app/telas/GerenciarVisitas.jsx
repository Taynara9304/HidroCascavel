// screens/GerenciarVisitas.js
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import TabelaVisitas from '../componentes/TabelaVisitas';
import AddVisitas from '../componentes/AddVisitas';
import useVisitas from '../hooks/useTabelaVisitas';

const GerenciarVisitas = () => {
  const {
    visits,
    sortField,
    sortDirection,
    handleSort,
    addVisit,
    editVisit,
    deleteVisit,
  } = useVisitas();

  const handleAdicionarVisita = (novaVisita) => {
    console.log('GerenciarVisitas: Recebendo nova visita', novaVisita);
    addVisit(novaVisita);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <TabelaVisitas
          visits={visits}
          onEdit={(visit) => {
            console.log('Editar visita:', visit);
          }}
          onDelete={deleteVisit}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
        
        <AddVisitas 
          onAdicionarVisita={handleAdicionarVisita}
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
});

export default GerenciarVisitas;