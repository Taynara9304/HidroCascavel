// componentes/TabelaVisitas.js - VERSÃO TABELA ÚLTIMAS 5 VISITAS
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const TabelaVisitas = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar últimas 5 visitas do Firebase
  useEffect(() => {
    const fetchLastVisits = () => {
      setLoading(true);
      
      try {
        const q = query(
          collection(db, 'visits'),
          orderBy('dataVisita', 'desc'),
          limit(5)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const visitsData = [];
          snapshot.forEach((doc) => {
            visitsData.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          console.log('📋 Últimas 5 visitas carregadas:', visitsData.length);
          setVisits(visitsData);
          setLoading(false);
          setRefreshing(false);
        }, (error) => {
          console.error('Erro ao buscar visitas:', error);
          setLoading(false);
          setRefreshing(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('Erro na query:', error);
        setLoading(false);
        setRefreshing(false);
      }
    };

    const unsubscribe = fetchLastVisits();
    return unsubscribe;
  }, []);

  // Função para atualizar os dados
  const onRefresh = () => {
    setRefreshing(true);
    // A atualização é automática pelo onSnapshot
  };

  // Função para formatar data
  const formatarData = (dataString) => {
    if (!dataString) return '--/--/----';
    
    try {
      const data = new Date(dataString);
      return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  // Função para formatar hora
  const formatarHora = (dataString) => {
    if (!dataString) return '--:--';
    
    try {
      const data = new Date(dataString);
      return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '--:--';
    }
  };

  // Função para obter cor do status
  const getCorStatus = (situacao, status) => {
    if (situacao?.toLowerCase() === 'concluida') {
      return '#4CAF50'; // Verde para concluída
    }
    if (status?.toLowerCase() === 'aprovada') {
      return '#2196F3'; // Azul para aprovada
    }
    return '#FF9800'; // Laranja para agendada/pendente
  };

  // Função para obter texto do status
  const getTextoStatus = (situacao, status) => {
    if (situacao?.toLowerCase() === 'concluida') {
      return 'Concluída';
    }
    if (status?.toLowerCase() === 'aprovada') {
      return 'Aprovada';
    }
    return 'Agendada';
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Últimas 5 Visitas</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2685BF" />
          <Text style={styles.loadingText}>Carregando visitas...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Últimas 5 Visitas</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.botaoAtualizar}>
          <Text style={styles.botaoAtualizarTexto}>🔄 Atualizar</Text>
        </TouchableOpacity>
      </View>

      {visits.length > 0 ? (
        <ScrollView 
          style={styles.tabelaContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2685BF']}
            />
          }
        >
          {/* Cabeçalho da Tabela */}
          <View style={styles.linhaCabecalho}>
            <Text style={[styles.celulaCabecalho, styles.celulaPoco]}>Poço</Text>
            <Text style={[styles.celulaCabecalho, styles.celulaProprietario]}>Proprietário</Text>
            <Text style={[styles.celulaCabecalho, styles.celulaData]}>Data</Text>
            <Text style={[styles.celulaCabecalho, styles.celulaHora]}>Hora</Text>
            <Text style={[styles.celulaCabecalho, styles.celulaStatus]}>Status</Text>
            <Text style={[styles.celulaCabecalho, styles.celulaAnalista]}>Analista</Text>
          </View>

          {/* Linhas da Tabela */}
          {visits.map((visit, index) => (
            <View 
              key={visit.id} 
              style={[
                styles.linha,
                index % 2 === 0 ? styles.linhaPar : styles.linhaImpar
              ]}
            >
              {/* Poço */}
              <View style={[styles.celula, styles.celulaPoco]}>
                <Text style={styles.celulaTexto} numberOfLines={2}>
                  {visit.pocoNome || 'N/I'}
                </Text>
              </View>

              {/* Proprietário */}
              <View style={[styles.celula, styles.celulaProprietario]}>
                <Text style={styles.celulaTexto} numberOfLines={2}>
                  {visit.proprietario || 'N/I'}
                </Text>
              </View>

              {/* Data */}
              <View style={[styles.celula, styles.celulaData]}>
                <Text style={styles.celulaTexto}>
                  {formatarData(visit.dataVisita)}
                </Text>
              </View>

              {/* Hora */}
              <View style={[styles.celula, styles.celulaHora]}>
                <Text style={styles.celulaTexto}>
                  {formatarHora(visit.dataVisita)}
                </Text>
              </View>

              {/* Status */}
              <View style={[styles.celula, styles.celulaStatus]}>
                <View 
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getCorStatus(visit.situacao, visit.status) }
                  ]}
                >
                  <Text style={styles.statusTexto}>
                    {getTextoStatus(visit.situacao, visit.status)}
                  </Text>
                </View>
              </View>

              {/* Analista */}
              <View style={[styles.celula, styles.celulaAnalista]}>
                <Text style={styles.celulaTexto} numberOfLines={2}>
                  {visit.analistaNome || 'N/I'}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.semDadosContainer}>
          <Text style={styles.semDados}>📭 Nenhuma visita encontrada</Text>
          <Text style={styles.semDadosSubtexto}>
            As visitas aparecerão aqui automaticamente quando forem cadastradas
          </Text>
        </View>
      )}

      {/* Rodapé com contador */}
      <View style={styles.rodape}>
        <Text style={styles.rodapeTexto}>
          Mostrando {visits.length} visita{visits.length !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2685BF',
  },
  botaoAtualizar: {
    backgroundColor: '#2685BF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  botaoAtualizarTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  tabelaContainer: {
    flex: 1,
  },
  // Cabeçalho da tabela
  linhaCabecalho: {
    flexDirection: 'row',
    backgroundColor: '#2685BF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  celulaCabecalho: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Linhas da tabela
  linha: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 60,
    alignItems: 'center',
  },
  linhaPar: {
    backgroundColor: '#f8f9fa',
  },
  linhaImpar: {
    backgroundColor: '#ffffff',
  },
  // Células
  celula: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  celulaTexto: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Larguras das colunas
  celulaPoco: {
    flex: 1.5, // Poço - maior largura
  },
  celulaProprietario: {
    flex: 1.5, // Proprietário - maior largura
  },
  celulaData: {
    flex: 1, // Data
  },
  celulaHora: {
    flex: 0.8, // Hora
  },
  celulaStatus: {
    flex: 1.2, // Status - espaço para o badge
    alignItems: 'center',
  },
  celulaAnalista: {
    flex: 1.2, // Analista
  },
  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
  },
  statusTexto: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  // Sem dados
  semDadosContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 150,
    paddingVertical: 20,
  },
  semDados: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  semDadosSubtexto: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Rodapé
  rodape: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  rodapeTexto: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default TabelaVisitas;