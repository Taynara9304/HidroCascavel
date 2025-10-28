// telas/NotificacoesAdm.js - VERSÃO CORRIGIDA
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native';
import { collection, query, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/authContext';
import { AdminNotifications } from '../services/notificacaoService';
import DetalhesSolicitacaoAnalise from '../componentes/DetalhesSolicitacaoAnalise';

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

const NotificacoesAdm = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [carregandoId, setCarregandoId] = useState(null); // ✅ CORREÇÃO: Variável definida
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [filterStatus, setFilterStatus] = useState('todos');
  const { user } = useAuth();

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [notifications, filterStatus]);

  const carregarNotificacoes = async () => {
    try {
      setLoading(true);
      console.log('📥 Carregando notificações...');
      
      const notificacoes = await AdminNotifications.getPendingNotifications();
      console.log('✅ Notificações carregadas:', notificacoes.length);
      
      setNotifications(notificacoes);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('❌ Erro ao carregar notificações:', error);
      setLoading(false);
      setRefreshing(false);
      Alert.alert('Erro', 'Não foi possível carregar as notificações');
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...notifications];

    if (filterStatus !== 'todos') {
      filtradas = filtradas.filter(notificacao => notificacao.status === filterStatus);
    }

    setFilteredNotifications(filtradas);
  };

  // ✅ CORREÇÃO: Função aceitar com validação de duplicação
  const handleAceitar = async (notification) => {
    if (carregandoId) {
      console.log('⏳ Já existe uma operação em andamento...');
      return;
    }

    try {
      setCarregandoId(notification.id);
      console.log('📋 Aceitando notificação:', notification.id);
      
      // ✅ VERIFICAÇÃO CLIENTE: Verificar se já foi processada
      if (notification.status !== 'pendente') {
        Alert.alert('Aviso', 'Esta solicitação já foi processada.');
        setCarregandoId(null);
        await carregarNotificacoes(); // Recarregar para atualizar estado
        return;
      }

      console.log('🔍 Dados da solicitação:', notification.dadosSolicitacao);
      
      await AdminNotifications.aceitarSolicitacaoAnalise(
        notification.id, 
        notification
      );
      
      Alert.alert('Sucesso', 'Solicitação aceita e análise cadastrada!');
      
      // Recarregar notificações para atualizar a lista
      await carregarNotificacoes();
      
    } catch (error) {
      console.error('❌ Erro ao aceitar:', error);
      Alert.alert('Erro', `Não foi possível aceitar: ${error.message}`);
    } finally {
      setCarregandoId(null);
    }
  };

  // ✅ CORREÇÃO: Função rejeitar com validação
  const handleRejeitar = async (notificationId, notificationData) => {
    if (carregandoId) {
      console.log('⏳ Já existe uma operação em andamento...');
      return;
    }

    try {
      setCarregandoId(notificationId);
      
      // ✅ VERIFICAÇÃO CLIENTE
      if (notificationData.status !== 'pendente') {
        Alert.alert('Aviso', 'Esta solicitação já foi processada.');
        setCarregandoId(null);
        await carregarNotificacoes();
        return;
      }

      await AdminNotifications.rejeitarSolicitacaoAnalise(notificationId, notificationData);
      
      Alert.alert('Sucesso', 'Solicitação rejeitada!');
      await carregarNotificacoes();
      
    } catch (error) {
      console.error('❌ Erro ao rejeitar:', error);
      Alert.alert('Erro', 'Não foi possível rejeitar a solicitação');
    } finally {
      setCarregandoId(null);
    }
  };

  const verDetalhes = (solicitacao) => {
    console.log('🔍 Detalhes da solicitação:', solicitacao);
    setSolicitacaoSelecionada(solicitacao);
    setModalVisivel(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return '#FFA500';
      case 'aceita': return '#4CAF50';
      case 'rejeitada': return '#F44336';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aceita': return 'Aceita';
      case 'rejeitada': return 'Rejeitada';
      default: return status;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarNotificacoes();
  };

 const renderNotificationItem = ({ item }) => (
    <View style={[
      styles.notificationCard,
      { borderLeftColor: getStatusColor(item.status) }
    ]}>
      <View style={styles.notificationHeader}>
        <Text style={styles.typeText}>
          📋 Solicitação de Análise
        </Text>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {item.status === 'pendente' ? 'Pendente' : 
           item.status === 'aceita' ? 'Aceita' : 'Rejeitada'}
        </Text>
      </View>

      <Text style={styles.title}>Nova Análise Solicitada</Text>
      <Text style={styles.message}>
        {item.dadosSolicitacao?.analistaNome || 'Analista'} solicitou cadastro de análise para o poço {item.dadosSolicitacao?.pocoNome}
      </Text>
      
      <View style={styles.dataContainer}>
        <Text style={styles.dataText}>
          <Text style={styles.dataLabel}>Poço:</Text> {item.dadosSolicitacao?.pocoNome}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.dataLabel}>Analista:</Text> {item.dadosSolicitacao?.analistaNome}
        </Text>
        <Text style={styles.dataText}>
          <Text style={styles.dataLabel}>Resultado:</Text> {item.dadosSolicitacao?.resultado}
        </Text>
        {item.dadosSolicitacao?.ph && (
          <Text style={styles.dataText}>
            <Text style={styles.dataLabel}>pH:</Text> {item.dadosSolicitacao.ph}
          </Text>
        )}
      </View>
      
      <Text style={styles.timestamp}>
        {formatDate(item.dataCriacao)}
      </Text>

      {item.status === 'pendente' && (
        <View style={styles.acoes}>
          <TouchableOpacity 
            style={styles.botaoDetalhes}
            onPress={() => verDetalhes(item)}
          >
            <Text style={styles.botaoDetalhesTexto}>📋 Detalhes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.botaoAceitar}
            onPress={() => handleAceitar(item)}
            disabled={carregandoId !== null}
          >
            {carregandoId === item.id ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.botaoAceitarTexto}>✅ Aceitar</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.botaoRejeitar}
            onPress={() => handleRejeitar(item.id, item)}
            disabled={carregandoId !== null}
          >
            <Text style={styles.botaoRejeitarTexto}>❌ Rejeitar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ MOSTRAR STATUS SE JÁ PROCESSADA */}
      {item.status !== 'pendente' && (
        <View style={styles.processadaContainer}>
          <Text style={styles.processadaText}>
            {item.status === 'aceita' ? '✅ Processada - Aceita' : '❌ Processada - Rejeitada'}
          </Text>
          {item.dataResolucao && (
            <Text style={styles.processadaData}>
              Em: {formatDate(item.dataResolucao)}
            </Text>
          )}
        </View>
      )}
    </View>
  );


  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filtrar por status:</Text>
      <View style={styles.filterButtons}>
        {['todos', 'pendente', 'aceita', 'rejeitada'].map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filterStatus === status && styles.filterButtonActive
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text style={[
              styles.filterButtonText,
              filterStatus === status && styles.filterButtonTextActive
            ]}>
              {status === 'todos' ? 'Todos' : 
               status === 'pendente' ? 'Pendentes' :
               status === 'aceita' ? 'Aceitas' : 'Rejeitadas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2685BF" />
        <Text>Carregando notificações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Central de Notificações</Text>
      <Text style={styles.subHeader}>Solicitações de Análise dos Analistas</Text>
      
      {/* Filtros */}
      {renderFilterButtons()}
      
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2685BF']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Carregando...' : 'Nenhuma notificação encontrada'}
            </Text>
            <Text style={styles.emptySubText}>
              {filterStatus !== 'todos' ? `Nenhuma notificação com status "${filterStatus}"` : 'Todas as solicitações foram processadas'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Modal de detalhes */}
      <Modal
        visible={modalVisivel}
        animationType="slide"
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>Detalhes da Solicitação</Text>
            <TouchableOpacity 
              style={styles.botaoFechar}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.botaoFecharTexto}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <DetalhesSolicitacaoAnalise 
            solicitacao={solicitacaoSelecionada} 
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#2685BF',
    borderColor: '#2685BF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  notificationCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dataContainer: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  dataText: {
    fontSize: 12,
    color: '#495057',
    marginBottom: 2,
  },
  dataLabel: {
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  botaoDetalhes: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#6c757d',
    borderRadius: 6,
  },
  botaoDetalhesTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  botaoAceitar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#28a745',
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  botaoAceitarTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  botaoRejeitar: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#dc3545',
    borderRadius: 6,
  },
  botaoRejeitarTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#2685BF',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  botaoFechar: {
    padding: 8,
  },
  botaoFecharTexto: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  processadaContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    alignItems: 'center',
  },
  processadaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  processadaData: {
    fontSize: 10,
    color: '#6c757d',
    marginTop: 2,
  },
});

export default NotificacoesAdm;