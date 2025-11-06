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
  ScrollView,
  Alert
} from 'react-native';
import { collection, query, where, orderBy, onSnapshot, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/authContext';
import { useNavigation } from '@react-navigation/native';

const NotificacoesProprietario = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterStatus, setFilterStatus] = useState('todos');
  const { user, userData } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (user) {
      loadNotifications();
      checkAllNotifications(); // DEBUG
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [notifications, filterStatus]);

  // FUNÇÃO DE DEBUG - Ver todas as notificações
  const checkAllNotifications = async () => {
    try {
      const notificationsRef = collection(db, 'notifications');
      const snapshot = await getDocs(notificationsRef);
      
      console.log('🔍 TODAS AS NOTIFICAÇÕES NA COLEÇÃO:');
      let userNotificationsCount = 0;
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log('Notificação:', {
          id: doc.id,
          idDoUsuario: data.idDoUsuario,
          usuarioLogado: user?.uid,
          tipo: data.tipoNotificacao,
          status: data.status,
          titulo: data.titulo,
          match: data.idDoUsuario === user?.uid ? '✅' : '❌'
        });
        
        if (data.idDoUsuario === user?.uid) {
          userNotificationsCount++;
        }
      });
      
      console.log(`📊 Notificações do usuário atual: ${userNotificationsCount}`);
    } catch (error) {
      console.error('Erro ao verificar notificações:', error);
    }
  };

  const loadNotifications = () => {
    setLoading(true);
    
    try {
      console.log('👤 Carregando notificações para usuário:', user?.uid);
      
      // ✅ QUERY CORRIGIDA - campo correto e ordenação
      const q = query(
        collection(db, 'notifications'),
        where('idDoUsuario', '==', user?.uid),
        orderBy('dataSolicitacao', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notificationsList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('📨 Notificação encontrada:', {
            id: doc.id,
            tipo: data.tipoNotificacao,
            status: data.status,
            usuario: data.idDoUsuario,
            titulo: data.titulo
          });
          notificationsList.push({ id: doc.id, ...data });
        });
        
        console.log(`✅ Total de notificações carregadas: ${notificationsList.length}`);
        setNotifications(notificationsList);
        setLoading(false);
        setRefreshing(false);
      }, (error) => {
        console.error("❌ Erro ao carregar notificações: ", error);
        setLoading(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("❌ Erro: ", error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ FUNÇÃO DE TESTE - Criar notificação de teste
  const testarNotificacao = async () => {
    try {
      const notificacaoTeste = {
        idDoUsuario: user.uid,
        tipoNotificacao: 'teste',
        titulo: 'Teste de Notificação ✅',
        mensagem: 'Se você está vendo isso, as notificações estão funcionando corretamente!',
        dataSolicitacao: Timestamp.now(),
        status: 'concluida',
        statusAvaliacao: 'pendente'
      };

      await addDoc(collection(db, 'notifications'), notificacaoTeste);
      Alert.alert('Sucesso', 'Notificação de teste criada! Atualize a lista.');
      console.log('✅ Notificação de teste criada para:', user.uid);
    } catch (error) {
      console.error('❌ Erro no teste:', error);
      Alert.alert('Erro', `Falha no teste: ${error.message}`);
    }
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    if (filterStatus !== 'todos') {
      filtered = filtered.filter(n => n.status === filterStatus);
    }

    setFilteredNotifications(filtered);
  };

  const renderFilterButtons = () => {
    const statuses = ['todos', 'pendente', 'aceita', 'recusada', 'editada', 'concluida'];
    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filtrar por status:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statuses.map(status => (
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
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* BOTÃO DE TESTE - TEMPORÁRIO */}
        <TouchableOpacity style={styles.testButton} onPress={testarNotificacao}>
          <Text style={styles.testButtonText}>🧪 Testar Notificações</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'aceita': return 'Agendada';
      case 'recusada': return 'Recusada';
      case 'editada': return 'Reagendada';
      case 'concluida': return 'Concluída';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return '#FFA500';
      case 'aceita': return '#34A853';
      case 'recusada': return '#F44336';
      case 'editada': return '#2685BF';
      case 'concluida': return '#757575';
      default: return '#757575';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'visita': return '📅';
      case 'cadastro': return '📝';
      case 'edicao': return '✏️';
      case 'analise_concluida': return '📊';
      case 'teste': return '🧪';
      default: return '🔔';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return timestamp.toDate().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const formatVisitDate = (visitDateStr) => {
    if (!visitDateStr) return 'N/A';
    try {
      const date = new Date(visitDateStr);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const viewNotificationDetails = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };
  
  const handleAvaliarServico = (notificacao) => {
    setModalVisible(false);
    
    navigation.navigate('DeixarAvaliacao', { 
      notificationId: notificacao.id,
      analiseId: notificacao.idDaAnalise,
      pocoId: notificacao.idDoPoco
    });
  };

  const renderNotificationItem = ({ item }) => {
    const statusColor = getStatusColor(item.status);
    
    return (
      <TouchableOpacity 
        style={styles.notificationCard} 
        onPress={() => viewNotificationDetails(item)}
      >
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationIcon}>{getTypeIcon(item.tipoNotificacao)}</Text>
          <Text style={styles.notificationTitle} numberOfLines={1}>{item.titulo}</Text>
          <Text style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>{item.mensagem}</Text>
        <Text style={styles.notificationDate}>{formatDate(item.dataSolicitacao)}</Text>
      </TouchableOpacity>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  // Debug temporário
  useEffect(() => {
    console.log('🔔 Notificações atualizadas:', {
      total: notifications.length,
      filtradas: filteredNotifications.length,
      items: notifications.map(n => ({
        id: n.id,
        tipo: n.tipoNotificacao,
        status: n.status,
        titulo: n.titulo
      }))
    });
  }, [notifications, filteredNotifications]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2685BF" />
        <Text>Carregando notificações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            <Text style={styles.emptyText}>Nenhuma notificação encontrada.</Text>
            <Text style={styles.emptySubText}>
              {filterStatus !== 'todos' ? 'Tente um filtro diferente.' : 'Você está em dia!'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalhes da Notificação</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedNotification && (
              <ScrollView style={styles.modalContent}>
                <Text style={styles.modalNotificationTitle}>
                  {getTypeIcon(selectedNotification.tipoNotificacao)}{' '}
                  {selectedNotification.titulo}
                </Text>
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[styles.detailValue, { color: getStatusColor(selectedNotification.status) }]}>
                    {getStatusText(selectedNotification.status)}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Mensagem:</Text>
                  <Text style={styles.detailValue}>{selectedNotification.mensagem}</Text>
                </View>
                
                {selectedNotification.dadosVisita && (
                  <>
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Data da Visita:</Text>
                      <Text style={styles.detailValue}>
                        {formatVisitDate(selectedNotification.dadosVisita.dataVisita)}
                      </Text>
                    </View>
                    {selectedNotification.dadosVisita.confirmada === false && (
                      <Text style={[styles.detailValue, styles.rejectionReason]}>
                        O analista não pôde confirmar esta data.
                      </Text>
                    )}
                  </>
                )}

                {selectedNotification.motivoRejeicao && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Motivo da Rejeição:</Text>
                    <Text style={[styles.detailValue, styles.rejectionReason]}>
                      {selectedNotification.motivoRejeicao}
                    </Text>
                  </View>
                )}
                
                {/* BOTÃO DE AVALIAÇÃO */}
                {selectedNotification.tipoNotificacao === 'analise_concluida' && 
                 selectedNotification.statusAvaliacao === 'pendente' && (
                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.evaluateButton]}
                      onPress={() => handleAvaliarServico(selectedNotification)}
                    >
                      <Text style={styles.modalButtonText}>📊 Avaliar Serviço</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {selectedNotification.tipoNotificacao === 'analise_concluida' && 
                 selectedNotification.statusAvaliacao === 'concluida' && (
                  <View style={styles.detailSection}>
                    <Text style={[styles.detailValue, styles.confirmedText, {textAlign: 'center'}]}>
                      ✅ Você já avaliou este serviço. Obrigado!
                    </Text>
                  </View>
                )}
                
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Data:</Text>
                  <Text style={styles.detailValue}>{formatDate(selectedNotification.dataSolicitacao)}</Text>
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
    backgroundColor: '#f4f7f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  statusBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#888',
  },
  modalContent: {
    padding: 16,
  },
  modalNotificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
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
    backgroundColor: '#757575',
  },
  evaluateButton: {
    backgroundColor: '#FFA500',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  filterContainer: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#2685BF',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#444',
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: 'bold',
  },
  testButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default NotificacoesProprietario;