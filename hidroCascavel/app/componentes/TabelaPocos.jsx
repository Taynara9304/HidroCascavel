import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const TabelaPocos = ({ wells, onEdit, onDelete, sortField, sortDirection, onSort }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular dados paginados
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWells = wells.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(wells.length / itemsPerPage);

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

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.cell, styles.smallCell]}>
        <Text style={styles.cellText}>{item.id}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>{item.latitude}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>{item.longitude}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>{item.owner}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>
          {new Date(item.lastAnalysis).toLocaleDateString('pt-BR')}
        </Text>
      </View>
      <View style={[styles.cell, styles.largeCell]}>
        <Text style={styles.cellText} numberOfLines={2}>
          {item.observations || '-'}
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Poços</Text>
      
      {/* Cabeçalho */}
      <View style={styles.tableHeader}>
        <View style={[styles.cell, styles.smallCell]}>
          <Text style={styles.headerText}>ID</Text>
        </View>
        <View style={[styles.cell, styles.mediumCell]}>
          <Text style={styles.headerText}>Latitude</Text>
        </View>
        <View style={[styles.cell, styles.mediumCell]}>
          <Text style={styles.headerText}>Longitude</Text>
        </View>
        <HeaderCell title="Proprietário" field="owner" sortable={true} />
        <HeaderCell title="Última Análise" field="lastAnalysis" sortable={true} />
        <View style={[styles.cell, styles.largeCell]}>
          <Text style={styles.headerText}>Observações</Text>
        </View>
        <View style={[styles.cell, styles.mediumCell]}>
          <Text style={styles.headerText}>Ações</Text>
        </View>
      </View>

      {/* Lista de dados */}
      <FlatList
        data={paginatedWells}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        style={styles.flatList}
      />

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
    flex: 1,
    margin: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
    minHeight: 50,
  },
  cell: {
    paddingHorizontal: 4,
    justifyContent: 'center',
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
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#333',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
  },
  sortButton: {
    flex: 1,
    justifyContent: 'center',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 2,
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
    marginTop: 16,
    padding: 16,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageInfo: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#333',
  },
  flatList: {
    minHeight: 200,
  },
});

export default TabelaPocos;