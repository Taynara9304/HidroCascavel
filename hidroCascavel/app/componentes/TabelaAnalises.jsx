// componentes/TabelaAnalises.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const TabelaAnalises = ({ analyses, onEdit, onDelete, sortField, sortDirection, onSort }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular dados paginados
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAnalyses = analyses.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(analyses.length / itemsPerPage);

  const HeaderCell = ({ title, field, sortable = false }) => (
    <View style={[styles.cell, styles.mediumCell]}>
      {sortable ? (
        <TouchableOpacity onPress={() => onSort(field)} style={styles.sortButton}>
          <Text style={styles.headerText}>
            {title}
            {sortField === field && (
              <Text>{sortDirection === 'asc' ? ' ↑' : ' ↓'}</Text>
            )}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.headerText}>{title}</Text>
      )}
    </View>
  );

  const getResultadoColor = (resultado) => {
    switch (resultado?.toLowerCase()) {
      case 'aprovada':
        return '#4CAF50';
      case 'reprovada':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.cell, styles.smallCell]}>
        <Text style={styles.cellText}>{item.id}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>{item.pocoNome}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>{item.proprietario}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>{item.analista}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>
          {new Date(item.dataAnalise).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={[styles.cellText, { color: getResultadoColor(item.resultado) }]}>
          {item.resultado}
        </Text>
      </View>
      <View style={[styles.cell, styles.mediumCell, styles.actionsCell]}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(item)}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Calcular altura aproximada da tabela
  const tableHeight = 120 + (paginatedAnalyses.length * 50); // Header + rows

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Análises</Text>
      
      {/* Container da tabela com altura fixa baseada no conteúdo */}
      <View style={[styles.tableWrapper, { minHeight: Math.max(tableHeight, 200) }]}>
        {/* Cabeçalho */}
        <View style={styles.tableHeader}>
          <View style={[styles.cell, styles.smallCell]}>
            <Text style={styles.headerText}>ID</Text>
          </View>
          <View style={[styles.cell, styles.mediumCell]}>
            <Text style={styles.headerText}>Poço</Text>
          </View>
          <HeaderCell title="Proprietário" field="proprietario" sortable={true} />
          <View style={[styles.cell, styles.mediumCell]}>
            <Text style={styles.headerText}>Analista</Text>
          </View>
          <HeaderCell title="Data Análise" field="dataAnalise" sortable={true} />
          <View style={[styles.cell, styles.mediumCell]}>
            <Text style={styles.headerText}>Resultado</Text>
          </View>
          <View style={[styles.cell, styles.mediumCell]}>
            <Text style={styles.headerText}>Ações</Text>
          </View>
        </View>

        {/* Lista de dados - sem altura fixa, vai crescer conforme conteúdo */}
        <View style={styles.tableBody}>
          {paginatedAnalyses.map((item) => (
            <View key={item.id.toString()}>
              {renderItem({ item })}
            </View>
          ))}
        </View>
      </View>

      {/* Paginação */}
      <View style={styles.pagination}>
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
          onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageButtonText}>{'<'}</Text>
        </TouchableOpacity>
        
        <Text style={styles.pageInfo}>
          Página {currentPage} de {totalPages}
        </Text>
        
        <TouchableOpacity 
          style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
          onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  tableWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    minHeight: 40,
  },
  tableBody: {
    // O conteúdo vai crescer naturalmente
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    minHeight: 50,
  },
  cell: {
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCell: {
    flex: 0.8,
  },
  mediumCell: {
    flex: 1.2,
  },
  largeCell: {
    flex: 2,
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 4,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  sortButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
    marginHorizontal: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pageInfo: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});

export default TabelaAnalises;