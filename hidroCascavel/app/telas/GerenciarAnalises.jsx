// screens/GerenciarAnalises.js
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import TabelaAnalises from '../componentes/TabelaAnalises';
import AddAnalises from '../componentes/AddAnalises';
import useAnalyses from '../hooks/useTabelaAnalises';

const GerenciarAnalises = () => {
  const {
    analyses,
    pocos,
    proprietarios,
    analistas,
    sortField,
    sortDirection,
    handleSort,
    addAnalysis,
    editAnalysis,
    deleteAnalysis,
  } = useAnalyses();

  const handleAdicionarAnalise = (novaAnalise) => {
    console.log('GerenciarAnalises: Recebendo nova análise', novaAnalise);
    addAnalysis(novaAnalise);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.tableSection}>
          <TabelaAnalises
            analyses={analyses}
            onEdit={(analysis) => {
              console.log('Editar análise:', analysis);
            }}
            onDelete={deleteAnalysis}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </View>
        
        <View style={styles.formSection}>
          <AddAnalises 
            onAdicionarAnalise={handleAdicionarAnalise}
            pocos={pocos}
            proprietarios={proprietarios}
            analistas={analistas}
          />
        </View>
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
  },
  tableSection: {
    marginBottom: 8, // Espaço mínimo entre tabela e formulário
  },
  formSection: {
    flex: 1,
  },
});

export default GerenciarAnalises;