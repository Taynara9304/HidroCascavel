import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { DataTable } from 'react-native-paper';

const TabelaVisitas = () => {
  // Dados de exemplo para as tabelas
  const [proximasVisitas, setProximasVisitas] = useState([
    {
      id: '1',
      data: '15/01/2024',
      poco: 'PO-001',
      analista: 'Carlos Silva',
      resultado: 'Pendente'
    },
    {
      id: '2',
      data: '18/01/2024',
      poco: 'PO-005',
      analista: 'Ana Santos',
      resultado: 'Pendente'
    },
    {
      id: '3',
      data: '22/01/2024',
      poco: 'PO-012',
      analista: 'Roberto Alves',
      resultado: 'Pendente'
    },
  ]);

  const [visitasRecentes, setVisitasRecentes] = useState([
    {
      id: '101',
      data: '05/01/2024',
      poco: 'PO-007',
      solicitante: 'Maria Oliveira',
      status: 'Concluído'
    },
    {
      id: '102',
      data: '02/01/2024',
      poco: 'PO-003',
      solicitante: 'João Mendes',
      status: 'Concluído'
    },
    {
      id: '103',
      data: '28/12/2023',
      poco: 'PO-009',
      solicitante: 'Pedro Costa',
      status: 'Concluído'
    },
  ]);

  // Função para ações (exemplo)
  const handleAcao = (id, tipo) => {
    console.log(`Ação ${tipo} na visita ${id}`);
    // Aqui você implementaria a lógica real
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1e88e5" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sistema de Visitas</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Tabela de Próximas Visitas */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Próximas Visitas</Text>
          <DataTable style={styles.dataTable}>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>Data</DataTable.Title>
              <DataTable.Title>Poço</DataTable.Title>
              <DataTable.Title>Analista</DataTable.Title>
              <DataTable.Title>Resultado</DataTable.Title>
              <DataTable.Title>Ações</DataTable.Title>
            </DataTable.Header>

            {proximasVisitas.map((visita) => (
              <DataTable.Row key={visita.id}>
                <DataTable.Cell>{visita.data}</DataTable.Cell>
                <DataTable.Cell>{visita.poco}</DataTable.Cell>
                <DataTable.Cell>{visita.analista}</DataTable.Cell>
                <DataTable.Cell>
                  <Text style={[
                    styles.statusText, 
                    visita.resultado === 'Pendente' ? styles.pendente : styles.concluido
                  ]}>
                    {visita.resultado}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.editButton]}
                      onPress={() => handleAcao(visita.id, 'editar')}
                    >
                      <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleAcao(visita.id, 'excluir')}
                    >
                      <Text style={styles.actionText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>

        {/* Tabela de Visitas Recentes */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Visitas Recentes</Text>
          <DataTable style={styles.dataTable}>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>Data</DataTable.Title>
              <DataTable.Title>Poço</DataTable.Title>
              <DataTable.Title>Solicitante</DataTable.Title>
              <DataTable.Title>Status</DataTable.Title>
              <DataTable.Title>Ações</DataTable.Title>
            </DataTable.Header>

            {visitasRecentes.map((visita) => (
              <DataTable.Row key={visita.id}>
                <DataTable.Cell>{visita.data}</DataTable.Cell>
                <DataTable.Cell>{visita.poco}</DataTable.Cell>
                <DataTable.Cell>{visita.solicitante}</DataTable.Cell>
                <DataTable.Cell>
                  <Text style={[
                    styles.statusText, 
                    visita.status === 'Concluído' ? styles.concluido : styles.pendente
                  ]}>
                    {visita.status}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.viewButton]}
                      onPress={() => handleAcao(visita.id, 'visualizar')}
                    >
                      <Text style={styles.actionText}>Visualizar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.actionButton, styles.reportButton]}
                      onPress={() => handleAcao(visita.id, 'relatorio')}
                    >
                      <Text style={styles.actionText}>Relatório</Text>
                    </TouchableOpacity>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1e88e5',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dataTable: {
    borderRadius: 8,
  },
  tableHeader: {
    backgroundColor: '#e3f2fd',
  },
  statusText: {
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    textAlign: 'center',
  },
  pendente: {
    backgroundColor: '#ffecb3',
    color: '#f57c00',
  },
  concluido: {
    backgroundColor: '#c8e6c9',
    color: '#388e3c',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#2196f3',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  viewButton: {
    backgroundColor: '#4caf50',
  },
  reportButton: {
    backgroundColor: '#ff9800',
  },
});

export default TabelaVisitas;