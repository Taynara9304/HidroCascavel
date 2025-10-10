// componentes/TabelaVisitas.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const TabelaVisitas = ({ visits, onEdit, onDelete, sortField, sortDirection, onSort }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Garantir que visits seja um array
  const safeVisits = Array.isArray(visits) ? visits : [];
  
  // Calcular dados paginados
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVisits = safeVisits.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(safeVisits.length / itemsPerPage);

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

  const getSituacaoColor = (situacao) => {
    switch (situacao?.toLowerCase()) {
      case 'concluida':
        return '#4CAF50';
      case 'pendente':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const getSituacaoText = (situacao) => {
    switch (situacao?.toLowerCase()) {
      case 'concluida':
        return 'Concluída';
      case 'pendente':
        return 'Pendente';
      default:
        return situacao;
    }
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const renderItem = (item) => (
    <View style={styles.tableRow} key={item.id}>
      <View style={[styles.cell, styles.smallCell]}>
        <Text style={styles.cellText}>{item.id}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>{item.pocoNome || 'N/A'}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>{item.localizacao || 'N/A'}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>{item.proprietario || 'N/A'}</Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={styles.cellText}>
          {formatDateTime(item.dataVisita)}
        </Text>
      </View>
      <View style={[styles.cell, styles.mediumCell]}>
        <Text style={[styles.cellText, { color: getSituacaoColor(item.situacao) }]}>
          {getSituacaoText(item.situacao)}
        </Text>
      </View>
      <View style={[styles.cell, styles.mediumCell, styles.actionsCell]}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit && onEdit(item)}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete && onDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Calcular altura aproximada da tabela
  const tableHeight = 120 + (paginatedVisits.length * 50);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Visitas</Text>
      
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
          <View style={[styles.cell, styles.mediumCell]}>
            <Text style={styles.headerText}>Localização</Text>
          </View>
          <HeaderCell title="Propriedade" field="proprietario" sortable={true} />
          <HeaderCell title="Data da Visita" field="dataVisita" sortable={true} />
          <View style={[styles.cell, styles.mediumCell]}>
            <Text style={styles.headerText}>Situação</Text>
          </View>
          <View style={[styles.cell, styles.mediumCell]}>
            <Text style={styles.headerText}>Ações</Text>
          </View>
        </View>

        {/* Lista de dados */}
        <View style={styles.tableBody}>
          {paginatedVisits.length > 0 ? (
            paginatedVisits.map((item) => renderItem(item))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhuma visita encontrada</Text>
            </View>
          )}
        </View>
      </View>

      {/* Paginação - só mostra se tiver mais de uma página */}
      {totalPages > 1 && (
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
      )}
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
    minHeight: 100,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
    minHeight: 50,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
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

export default TabelaVisitas;