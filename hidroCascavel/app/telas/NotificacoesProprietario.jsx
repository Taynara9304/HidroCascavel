// telas/NotificacoesProprietario.js - VERSÃO CORRIGIDA
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ScrollView
} from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/authContext';

const NotificacoesProprietario = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('todos');
  const { user, userData } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [notifications, filterStatus]);

  const loadNotifications = () => {
    setLoading(true);
    
    try {
      const q = query(
        collection(db, 'notifications'),
        where('idDoUsuario', '==', user?.uid),
        orderBy('dataSolicitacao', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notificationsList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          notificationsList.push({ 
            id: doc.id, 
            ...data
          });
        });
        setNotifications(notificationsList);
        setLoading(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    // Filtro por status
    if (filterStatus !== 'todos') {
      filtered = filtered.filter(notification => notification.status === filterStatus);
    }

    setFilteredNotifications(filtered);
  };

  // ✅ CORREÇÃO: Adicionar função applyFilters que estava faltando
  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filtrar por status:</Text>
      <View style={styles.filterButtons}>
        {['todos', 'pendente', 'aceita', 'recusada'].map(status => (
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
               status === 'aceita' ? 'Agendadas' : 'Recusadas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return '#FFA500';
      case 'aceita': return '#4CAF50';
      case 'recusada': return '#F44336';
      case 'editada': return '#2196F3';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aceita': return 'Agendada';
      case 'recusada': return 'Recusada';
      case 'editada': return 'Reagendada';
      default: return status;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'visita': return '👁️';
      case 'cadastro': return '📝';
      case 'edicao': return '✏️';
      default: return '🔔';
    }
  };

  const getActionDetails = (notification) => {
    if (notification.status === 'pendente') {
      return { text: 'Aguardando confirmação', color: '#FFA500' };
    }
    
    if (notification.status === 'aceita') {
      return { 
        text: 'Visita agendada', 
        color: '#4CAF50',
        details: notification.visitDate ? `Para ${formatVisitDate(notification.visitDate)}` : 'Entre em contato para detalhes'
      };
    }
    
    if (notification.status === 'recusada') {
      return { 
        text: 'Visita não autorizada', 
        color: '#F44336',
        details: notification.rejectionReason || 'Entre em contato com o administrador'
      };
    }
    
    if (notification.edited) {
      return { 
        text: 'Data ajustada', 
        color: '#2196F3',
        details: 'A data da visita foi reagendada'
      };
    }
    
    return { text: 'Status desconhecido', color: '#757575' };
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('pt-BR') + ' às ' + date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const formatVisitDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  };

  const viewNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const renderNotificationItem = ({ item }) => {
    const actionDetails = getActionDetails(item);
    
    return (
      <TouchableOpacity 
        style={[
          styles.notificationCard,
          item.lido && styles.readNotification,
          { borderLeftColor: actionDetails.color }
        ]}
        onPress={() => viewNotificationDetails(item)}
      >
        <View style={styles.notificationHeader}>
          <Text style={styles.typeText}>
            {getTypeIcon(item.tipoNotificacao)} {item.tipoNotificacao === 'visita' ? 'SOLICITAÇÃO DE VISITA' : item.tipoNotificacao?.toUpperCase()}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: actionDetails.color }]}>
            <Text style={styles.statusBadgeText}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.message}>{item.mensagem}</Text>
        
        {/* Data sugerida para visita */}
        {item.tipoNotificacao === 'visita' && item.visitDate && (
          <View style={styles.visitDateContainer}>
            <Text style={styles.visitDateText}>
              📅 Data sugerida: {formatVisitDate(item.visitDate)}
            </Text>
          </View>
        )}
        
        <View style={styles.actionContainer}>
          <Text style={[styles.actionText, { color: actionDetails.color }]}>
            {actionDetails.text}
          </Text>
          {actionDetails.details && (
            <Text style={styles.actionDetails}>
              {actionDetails.details}
            </Text>
          )}
        </View>
        
        <Text style={styles.timestamp}>
          Solicitado em: {formatDate(item.dataSolicitacao)}
        </Text>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34A853" />
        <Text>Carregando suas solicitações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Solicitações</Text>
      <Text style={styles.subHeader}>
        Acompanhe o status das suas solicitações de visita
      </Text>
      
      {/* ✅ CORREÇÃO: Adicionar filtros */}
      {renderFilterButtons()}
      
      {/* ✅ CORREÇÃO: Usar filteredNotifications em vez de notifications */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#34A853']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? 'Carregando...' : 'Nenhuma solicitação encontrada'}
            </Text>
            {!loading && filterStatus !== 'todos' && (
              <Text style={styles.emptySubText}>
                Tente alterar os filtros
              </Text>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Modal de detalhes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedNotification && (
              <ScrollView>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Detalhes da Solicitação</Text>
                  <View style={[styles.modalStatusBadge, { backgroundColor: getActionDetails(selectedNotification).color }]}>
                    <Text style={styles.modalStatusText}>
                      {getStatusText(selectedNotification.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Tipo de Solicitação</Text>
                  <Text style={styles.detailValue}>
                    {getTypeIcon(selectedNotification.tipoNotificacao)} 
                    {selectedNotification.tipoNotificacao === 'visita' ? 'SOLICITAÇÃO DE VISITA' : selectedNotification.tipoNotificacao?.toUpperCase()}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Título</Text>
                  <Text style={styles.detailValue}>{selectedNotification.titulo}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Mensagem</Text>
                  <Text style={styles.detailValue}>{selectedNotification.mensagem}</Text>
                </View>

                {/* Detalhes da visita */}
                {selectedNotification.tipoNotificacao === 'visita' && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Detalhes da Visita</Text>
                    {selectedNotification.visitDate && (
                      <Text style={styles.detailValue}>
                        📅 Data sugerida: {formatVisitDate(selectedNotification.visitDate)}
                      </Text>
                    )}
                    {selectedNotification.visitDetails && (
                      <Text style={styles.detailValue}>
                        📝 Observações: {selectedNotification.visitDetails}
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Data de Solicitação</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedNotification.dataSolicitacao)}
                  </Text>
                </View>

                {/* Informações de processamento */}
                {selectedNotification.processedAt && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Data de Resposta</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedNotification.processedAt)}
                    </Text>
                  </View>
                )}

                {selectedNotification.rejectionReason && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Motivo da Recusa</Text>
                    <Text style={[styles.detailValue, styles.rejectionReason]}>
                      {selectedNotification.rejectionReason}
                    </Text>
                  </View>
                )}

                {selectedNotification.visitDate && selectedNotification.status === 'aceita' && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>✅ Visita Confirmada</Text>
                    <Text style={[styles.detailValue, styles.confirmedText]}>
                      Sua visita foi agendada para {formatVisitDate(selectedNotification.visitDate)}
                    </Text>
                  </View>
                )}

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.closeButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonText}>Fechar</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
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
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginHorizontal: 20,
    marginBottom: 16,
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
  readNotification: {
    opacity: 0.7,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
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
  visitDateContainer: {
    backgroundColor: '#e8f5e8',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#34A853',
  },
  visitDateText: {
    fontSize: 12,
    color: '#34A853',
    fontWeight: '500',
  },
  actionContainer: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDetails: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  modalStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalStatusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  confirmedText: {
    color: '#34A853',
    fontWeight: '500',
  },
  rejectionReason: {
    color: '#F44336',
    fontStyle: 'italic',
  },
  modalActions: {
    marginTop: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#34A853',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '500',
  },
    filterContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#34A853',
    borderColor: '#34A853',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
});

export default NotificacoesProprietario;