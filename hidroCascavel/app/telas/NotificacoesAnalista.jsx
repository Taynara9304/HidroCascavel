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

const NotificacoesAnalista = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('todos');
  const { user } = useAuth();

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
      console.log('📥 Carregando notificações do analista:', user?.uid);
      
      const q = query(
        collection(db, 'notifications_analista'),
        where('userId', '==', user?.uid),
        orderBy('dataCriacao', 'desc')
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
        
        console.log('✅ Notificações do analista carregadas:', notificationsList.length);
        setNotifications(notificationsList);
        setLoading(false);
        setRefreshing(false);
      }, (error) => {
        console.error('❌ Erro no snapshot:', error);
        setLoading(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Erro ao carregar notificações:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    if (filterStatus !== 'todos') {
      filtered = filtered.filter(notification => notification.status === filterStatus);
    }

    setFilteredNotifications(filtered);
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filtrar por status:</Text>
      <View style={styles.filterButtons}>
        {['todos', 'nao_lida', 'lida'].map(status => (
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
               status === 'nao_lida' ? 'Não lidas' : 'Lidas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'nao_lida': return '#FFA500';
      case 'lida': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'nao_lida': return 'Não lida';
      case 'lida': return 'Lida';
      default: return status;
    }
  };

  const getTypeIcon = (tipo) => {
    switch (tipo) {
      case 'analise_aprovada': return '✅';
      case 'analise_rejeitada': return '❌';
      case 'visita_aprovada': return '📅';
      case 'visita_rejeitada': return '❌';
      default: return '🔔';
    }
  };

  const getActionDetails = (notification) => {
    if (notification.tipo === 'analise_aprovada') {
      return { 
        text: 'Sua análise foi aprovada!', 
        color: '#4CAF50',
        details: notification.dadosAnalise ? `Poço: ${notification.dadosAnalise.pocoNome}` : 'Análise publicada no sistema'
      };
    }
    
    if (notification.tipo === 'analise_rejeitada') {
      return { 
        text: 'Análise rejeitada', 
        color: '#F44336',
        details: 'Entre em contato com o administrador para mais informações'
      };
    }

    if (notification.tipo === 'visita_aprovada') {
      return { 
        text: 'Visita aprovada!', 
        color: '#4CAF50',
        details: notification.dadosVisita ? `Poço: ${notification.dadosVisita.pocoNome}` : 'Visita registrada no sistema'
      };
    }
    
    if (notification.tipo === 'visita_rejeitada') {
      return { 
        text: 'Visita rejeitada', 
        color: '#F44336',
        details: notification.dadosVisita?.motivoRejeicao ? `Motivo: ${notification.dadosVisita.motivoRejeicao}` : 'Consulte o administrador'
      };
    }
    
    return { text: 'Notificação do sistema', color: '#757575' };
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
          item.status === 'lida' && styles.readNotification,
          { borderLeftColor: actionDetails.color }
        ]}
        onPress={() => viewNotificationDetails(item)}
      >
        <View style={styles.notificationHeader}>
          <Text style={styles.typeIcon}>
            {getTypeIcon(item.tipo)}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusBadgeText}>
              {getStatusText(item.status)}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{item.titulo}</Text>
        <Text style={styles.message}>{item.mensagem}</Text>
        
        {/* Dados da análise */}
        {item.dadosAnalise && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>Poço: {item.dadosAnalise.pocoNome}</Text>
            {item.dadosAnalise.dataAnalise && (
              <Text style={styles.dataText}>
                Data: {formatDate(item.dadosAnalise.dataAnalise)}
              </Text>
            )}
          </View>
        )}

        {/* Dados da visita */}
        {item.dadosVisita && (
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>Poço: {item.dadosVisita.pocoNome}</Text>
            {item.dadosVisita.visitaId && (
              <Text style={styles.dataText}>
                ID Visita: {item.dadosVisita.visitaId}
              </Text>
            )}
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
          Recebido em: {formatDate(item.dataCriacao)}
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
        <ActivityIndicator size="large" color="#2685BF" />
        <Text>Carregando notificações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Notificações</Text>
      <Text style={styles.subHeader}>
        Acompanhe o status das suas análises
      </Text>
      
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
            {!loading && (
              <Text style={styles.emptySubText}>
                Você receberá notificações quando suas análises forem processadas pelo administrador
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
                  <Text style={styles.modalTitle}>Detalhes da Notificação</Text>
                  <View style={[styles.modalStatusBadge, { backgroundColor: getStatusColor(selectedNotification.status) }]}>
                    <Text style={styles.modalStatusText}>
                      {getStatusText(selectedNotification.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Tipo</Text>
                  <Text style={styles.detailValue}>
                    {getTypeIcon(selectedNotification.tipo)} {
                      selectedNotification.tipo === 'analise_aprovada' ? 'Análise Aprovada' : 
                      selectedNotification.tipo === 'analise_rejeitada' ? 'Análise Rejeitada' :
                      selectedNotification.tipo === 'visita_aprovada' ? 'Visita Aprovada' :
                      selectedNotification.tipo === 'visita_rejeitada' ? 'Visita Rejeitada' : 'Notificação'
                    }
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

                {/* Dados da análise */}
                {selectedNotification.dadosAnalise && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Informações da Análise</Text>
                    <View style={styles.dataGrid}>
                      <View style={styles.dataItem}>
                        <Text style={styles.dataLabel}>Poço</Text>
                        <Text style={styles.dataValue}>{selectedNotification.dadosAnalise.pocoNome}</Text>
                      </View>
                      {selectedNotification.dadosAnalise.dataAnalise && (
                        <View style={styles.dataItem}>
                          <Text style={styles.dataLabel}>Data da Análise</Text>
                          <Text style={styles.dataValue}>
                            {formatDate(selectedNotification.dadosAnalise.dataAnalise)}
                          </Text>
                        </View>
                      )}
                      {selectedNotification.dadosAnalise.analiseId && (
                        <View style={styles.dataItem}>
                          <Text style={styles.dataLabel}>ID da Análise</Text>
                          <Text style={styles.dataValue}>{selectedNotification.dadosAnalise.analiseId}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Dados da visita */}
                {selectedNotification.dadosVisita && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Informações da Visita</Text>
                    <View style={styles.dataGrid}>
                      <View style={styles.dataItem}>
                        <Text style={styles.dataLabel}>Poço</Text>
                        <Text style={styles.dataValue}>{selectedNotification.dadosVisita.pocoNome}</Text>
                      </View>
                      {selectedNotification.dadosVisita.visitaId && (
                        <View style={styles.dataItem}>
                          <Text style={styles.dataLabel}>ID da Visita</Text>
                          <Text style={styles.dataValue}>{selectedNotification.dadosVisita.visitaId}</Text>
                        </View>
                      )}
                      {selectedNotification.dadosVisita.motivoRejeicao && (
                        <View style={styles.dataItem}>
                          <Text style={styles.dataLabel}>Motivo da Rejeição</Text>
                          <Text style={[styles.dataValue, { color: '#F44336' }]}>
                            {selectedNotification.dadosVisita.motivoRejeicao}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Data de Recebimento</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedNotification.dataCriacao)}
                  </Text>
                </View>

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
  filterContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: '#2685BF',
    borderColor: '#2685BF',
  },
  filterButtonText: {
    fontSize: 12,
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
  readNotification: {
    opacity: 0.7,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIcon: {
    fontSize: 20,
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
    lineHeight: 20,
  },
  dataContainer: {
    backgroundColor: '#e8f4fd',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2685BF',
  },
  dataText: {
    fontSize: 12,
    color: '#2685BF',
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
  dataGrid: {
    gap: 8,
  },
  dataItem: {
    backgroundColor: '#e8f4fd',
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#2685BF',
  },
  dataLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2685BF',
  },
  dataValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    backgroundColor: '#2685BF',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default NotificacoesAnalista;