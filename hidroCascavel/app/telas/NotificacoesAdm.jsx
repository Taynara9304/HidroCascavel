// telas/NotificacoesAdm.js - VERSÃO COMPLETA COM ANÁLISES E VISITAS
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
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/authContext';
import { AdminNotifications } from '../services/notificacaoService';
import DetalhesSolicitacaoAnalise from '../componentes/DetalhesSolicitacaoAnalise';
import DetalhesSolicitacaoVisita from '../componentes/DetalhesSolicitacaoVisita';

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

const NotificacoesAdm = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [carregandoId, setCarregandoId] = useState(null);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterTipo, setFilterTipo] = useState('todos'); // ✅ NOVO FILTRO POR TIPO
  const [motivoRejeicao, setMotivoRejeicao] = useState(''); // ✅ PARA VISITAS
  const { user } = useAuth();

  useEffect(() => {
    carregarNotificacoes();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [notifications, filterStatus, filterTipo]);

  const carregarNotificacoes = async () => {
    try {
      setLoading(true);
      console.log('📥 Carregando todas as notificações...');
      
      // ✅ BUSCAR TODAS AS NOTIFICAÇÕES PENDENTES (ANÁLISES E VISITAS)
      const q = query(
        collection(db, 'notifications'),
        where('status', '==', 'pendente'),
        orderBy('dataCriacao', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notificacoesList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          notificacoesList.push({
            id: doc.id,
            ...data
          });
        });
        
        console.log('✅ Notificações carregadas:', notificacoesList.length);
        console.log('📋 Tipos de notificações:', notificacoesList.map(n => n.tipo));
        
        setNotifications(notificacoesList);
        setLoading(false);
        setRefreshing(false);
      }, (error) => {
        console.error('❌ Erro ao carregar notificações:', error);
        setLoading(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Erro geral:', error);
      setLoading(false);
      setRefreshing(false);
      Alert.alert('Erro', 'Não foi possível carregar as notificações');
    }
  };

  const aplicarFiltros = () => {
    let filtradas = [...notifications];

    // Filtro por status
    if (filterStatus !== 'todos') {
      filtradas = filtradas.filter(notificacao => notificacao.status === filterStatus);
    }

    // ✅ NOVO: Filtro por tipo
    if (filterTipo !== 'todos') {
      filtradas = filtradas.filter(notificacao => notificacao.tipo === filterTipo);
    }

    setFilteredNotifications(filtradas);
  };

  // ✅ FUNÇÃO PARA ACEITAR ANÁLISE
  const handleAceitarAnalise = async (notification) => {
    if (carregandoId) {
      console.log('⏳ Já existe uma operação em andamento...');
      return;
    }

    try {
      setCarregandoId(notification.id);
      console.log('📋 Aceitando análise:', notification.id);
      
      if (notification.status !== 'pendente') {
        Alert.alert('Aviso', 'Esta solicitação já foi processada.');
        setCarregandoId(null);
        await carregarNotificacoes();
        return;
      }

      console.log('🔍 Dados da análise:', notification.dadosSolicitacao);
      
      await AdminNotifications.aceitarSolicitacaoAnalise(
        notification.id, 
        notification
      );
      
      Alert.alert('Sucesso', 'Análise aceita e cadastrada!');
      await carregarNotificacoes();
      
    } catch (error) {
      console.error('❌ Erro ao aceitar análise:', error);
      Alert.alert('Erro', `Não foi possível aceitar: ${error.message}`);
    } finally {
      setCarregandoId(null);
    }
  };

  // ✅ FUNÇÃO PARA REJEITAR ANÁLISE
  const handleRejeitarAnalise = async (notificationId, notificationData) => {
    if (carregandoId) {
      console.log('⏳ Já existe uma operação em andamento...');
      return;
    }

    try {
      setCarregandoId(notificationId);
      
      if (notificationData.status !== 'pendente') {
        Alert.alert('Aviso', 'Esta solicitação já foi processada.');
        setCarregandoId(null);
        await carregarNotificacoes();
        return;
      }

      await AdminNotifications.rejeitarSolicitacaoAnalise(notificationId, notificationData);
      
      Alert.alert('Sucesso', 'Análise rejeitada!');
      await carregarNotificacoes();
      
    } catch (error) {
      console.error('❌ Erro ao rejeitar análise:', error);
      Alert.alert('Erro', 'Não foi possível rejeitar a análise');
    } finally {
      setCarregandoId(null);
    }
  };

  // ✅ NOVA FUNÇÃO: ACEITAR VISITA
  const handleAceitarVisita = async (notification) => {
    if (carregandoId) {
      console.log('⏳ Já existe uma operação em andamento...');
      return;
    }

    try {
      setCarregandoId(notification.id);
      console.log('📋 Aceitando visita:', notification.id);
      
      if (notification.status !== 'pendente') {
        Alert.alert('Aviso', 'Esta solicitação já foi processada.');
        setCarregandoId(null);
        await carregarNotificacoes();
        return;
      }

      console.log('🔍 Dados da visita:', notification.dadosVisita);

      // 1. Adicionar visita na coleção principal
      const visitaAprovada = {
        pocoId: notification.dadosVisita.pocoId,
        pocoNome: notification.dadosVisita.pocoNome,
        pocoLocalizacao: notification.dadosVisita.pocoLocalizacao,
        proprietario: notification.dadosVisita.proprietario,
        dataVisita: notification.dadosVisita.dataVisita,
        situacao: notification.dadosVisita.situacao || 'concluida',
        observacoes: notification.dadosVisita.observacoes,
        resultado: notification.dadosVisita.resultado || '',
        recomendacoes: notification.dadosVisita.recomendacoes || '',
        analistaId: notification.dadosVisita.analistaId,
        analistaNome: notification.dadosVisita.analistaNome,
        tipoUsuario: notification.dadosVisita.tipoUsuario,
        userId: notification.dadosVisita.userId,
        status: 'aprovada',
        dataAprovacao: new Date().toISOString(),
        aprovadoPor: user.uid,
        aprovadoPorNome: 'Administrador',
        dataCriacao: new Date()
      };

      const docRef = await addDoc(collection(db, 'visits'), visitaAprovada);
      
      // 2. Atualizar notificação
      await updateDoc(doc(db, 'notifications', notification.id), {
        status: 'aceita',
        dataResolucao: new Date(),
        resolvidoPor: user.uid
      });

      // 3. Notificar analista
      const notificacaoAnalista = {
        tipo: 'visita_aprovada',
        titulo: '✅ Visita Aprovada',
        mensagem: `Sua visita técnica no poço ${notification.dadosVisita.pocoNome} foi aprovada.`,
        userId: notification.dadosVisita.analistaId,
        status: 'nao_lida',
        dataCriacao: new Date(),
        dadosVisita: {
          visitaId: docRef.id,
          pocoNome: notification.dadosVisita.pocoNome
        }
      };

      await addDoc(collection(db, 'notifications_analista'), notificacaoAnalista);

      Alert.alert('Sucesso', 'Visita aprovada com sucesso!');
      await carregarNotificacoes();
      
    } catch (error) {
      console.error('❌ Erro ao aceitar visita:', error);
      Alert.alert('Erro', `Não foi possível aceitar a visita: ${error.message}`);
    } finally {
      setCarregandoId(null);
    }
  };

  // ✅ NOVA FUNÇÃO: REJEITAR VISITA
  const handleRejeitarVisita = async (notification) => {
    if (carregandoId) {
      console.log('⏳ Já existe uma operação em andamento...');
      return;
    }

    if (!motivoRejeicao.trim()) {
      Alert.alert('Atenção', 'Por favor, informe o motivo da rejeição.');
      return;
    }

    try {
      setCarregandoId(notification.id);
      
      if (notification.status !== 'pendente') {
        Alert.alert('Aviso', 'Esta solicitação já foi processada.');
        setCarregandoId(null);
        await carregarNotificacoes();
        return;
      }

      // 1. Atualizar notificação
      await updateDoc(doc(db, 'notifications', notification.id), {
        status: 'rejeitada',
        dataResolucao: new Date(),
        resolvidoPor: user.uid,
        motivoRejeicao: motivoRejeicao
      });

      // 2. Notificar analista
      const notificacaoAnalista = {
        tipo: 'visita_rejeitada',
        titulo: '❌ Visita Rejeitada',
        mensagem: `Sua visita técnica no poço ${notification.dadosVisita.pocoNome} foi rejeitada. Motivo: ${motivoRejeicao}`,
        userId: notification.dadosVisita.analistaId,
        status: 'nao_lida',
        dataCriacao: new Date(),
        dadosVisita: {
          pocoNome: notification.dadosVisita.pocoNome,
          motivoRejeicao: motivoRejeicao
        }
      };

      await addDoc(collection(db, 'notifications_analista'), notificacaoAnalista);

      Alert.alert('Sucesso', 'Visita rejeitada com sucesso!');
      setModalVisivel(false);
      setMotivoRejeicao('');
      await carregarNotificacoes();
      
    } catch (error) {
      console.error('❌ Erro ao rejeitar visita:', error);
      Alert.alert('Erro', `Não foi possível rejeitar a visita: ${error.message}`);
    } finally {
      setCarregandoId(null);
    }
  };

  const verDetalhes = (solicitacao) => {
    console.log('🔍 Detalhes da solicitação:', solicitacao);
    setSolicitacaoSelecionada(solicitacao);
    setModalVisivel(true);
    setMotivoRejeicao(''); // Limpar motivo ao abrir
  };

  const getTipoInfo = (tipo) => {
    switch (tipo) {
      case 'solicitacao_cadastro_analise':
        return { icon: '🔬', text: 'Análise', color: '#2685BF' };
      case 'solicitacao_cadastro_visita':
        return { icon: '📋', text: 'Visita Técnica', color: '#4CAF50' };
      default:
        return { icon: '📄', text: 'Solicitação', color: '#757575' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return '#FFA500';
      case 'aceita': return '#4CAF50';
      case 'rejeitada': return '#F44336';
      default: return '#757575';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não disponível';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarNotificacoes();
  };

  const renderNotificationItem = ({ item }) => {
    const tipoInfo = getTipoInfo(item.tipo);
    const isAnalise = item.tipo === 'solicitacao_cadastro_analise';
    const isVisita = item.tipo === 'solicitacao_cadastro_visita';

    return (
      <View style={[
        styles.notificationCard,
        { borderLeftColor: tipoInfo.color }
      ]}>
        <View style={styles.notificationHeader}>
          <View style={styles.tipoContainer}>
            <Text style={styles.tipoIcon}>{tipoInfo.icon}</Text>
            <Text style={styles.tipoText}>{tipoInfo.text}</Text>
          </View>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status === 'pendente' ? 'Pendente' : 
             item.status === 'aceita' ? 'Aceita' : 'Rejeitada'}
          </Text>
        </View>

        <Text style={styles.title}>
          {isAnalise ? 'Nova Análise Solicitada' : 
           isVisita ? 'Nova Visita Técnica' : 'Nova Solicitação'}
        </Text>
        
        <Text style={styles.message}>
          {isAnalise 
            ? `${item.dadosSolicitacao?.analistaNome || 'Analista'} solicitou cadastro de análise para o poço ${item.dadosSolicitacao?.pocoNome}`
            : `${item.dadosVisita?.analistaNome || 'Analista'} registrou uma visita técnica no poço ${item.dadosVisita?.pocoNome}`
          }
        </Text>
        
        <View style={styles.dataContainer}>
          {isAnalise && (
            <>
              <Text style={styles.dataText}>
                <Text style={styles.dataLabel}>Poço:</Text> {item.dadosSolicitacao?.pocoNome}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataLabel}>Analista:</Text> {item.dadosSolicitacao?.analistaNome}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataLabel}>Resultado:</Text> {item.dadosSolicitacao?.resultado}
              </Text>
            </>
          )}
          {isVisita && (
            <>
              <Text style={styles.dataText}>
                <Text style={styles.dataLabel}>Poço:</Text> {item.dadosVisita?.pocoNome}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataLabel}>Analista:</Text> {item.dadosVisita?.analistaNome}
              </Text>
              <Text style={styles.dataText}>
                <Text style={styles.dataLabel}>Data:</Text> {formatDate(item.dadosVisita?.dataVisita)}
              </Text>
            </>
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
              onPress={() => isAnalise ? handleAceitarAnalise(item) : handleAceitarVisita(item)}
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
              onPress={() => {
                if (isAnalise) {
                  handleRejeitarAnalise(item.id, item);
                } else {
                  verDetalhes(item); // Para visitas, abrir modal para informar motivo
                }
              }}
              disabled={carregandoId !== null}
            >
              <Text style={styles.botaoRejeitarTexto}>❌ Rejeitar</Text>
            </TouchableOpacity>
          </View>
        )}

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
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Filtrar por:</Text>
      
      {/* Filtro por Status */}
      <View style={styles.filterGroup}>
        <Text style={styles.filterSubtitle}>Status:</Text>
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

      {/* ✅ NOVO: Filtro por Tipo */}
      <View style={styles.filterGroup}>
        <Text style={styles.filterSubtitle}>Tipo:</Text>
        <View style={styles.filterButtons}>
          {['todos', 'solicitacao_cadastro_analise', 'solicitacao_cadastro_visita'].map(tipo => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.filterButton,
                filterTipo === tipo && styles.filterButtonActive
              ]}
              onPress={() => setFilterTipo(tipo)}
            >
              <Text style={[
                styles.filterButtonText,
                filterTipo === tipo && styles.filterButtonTextActive
              ]}>
                {tipo === 'todos' ? 'Todos' : 
                 tipo === 'solicitacao_cadastro_analise' ? 'Análises' : 'Visitas'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
      <Text style={styles.subHeader}>Solicitações de Análises e Visitas Técnicas</Text>
      
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
              {filterStatus !== 'todos' || filterTipo !== 'todos' 
                ? `Nenhuma notificação com os filtros selecionados` 
                : 'Todas as solicitações foram processadas'}
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
            <Text style={styles.modalTitulo}>
              {solicitacaoSelecionada?.tipo === 'solicitacao_cadastro_analise' 
                ? 'Detalhes da Análise' 
                : 'Detalhes da Visita'}
            </Text>
            <TouchableOpacity 
              style={styles.botaoFechar}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.botaoFecharTexto}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            {solicitacaoSelecionada?.tipo === 'solicitacao_cadastro_analise' ? (
              <DetalhesSolicitacaoAnalise solicitacao={solicitacaoSelecionada} />
            ) : (
              <>
                <DetalhesSolicitacaoVisita solicitacao={solicitacaoSelecionada} />
                
                {/* Campo para motivo de rejeição (apenas para visitas) */}
                {solicitacaoSelecionada?.status === 'pendente' && (
                  <View style={styles.motivoSection}>
                    <Text style={styles.motivoLabel}>Motivo da Rejeição *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={motivoRejeicao}
                      onChangeText={setMotivoRejeicao}
                      placeholder="Informe o motivo da rejeição..."
                      multiline={true}
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                    <Text style={styles.motivoHelper}>
                      * Obrigatório apenas para rejeição
                    </Text>
                    
                    <View style={styles.modalAcoes}>
                      <TouchableOpacity 
                        style={[
                          styles.modalBotao, 
                          styles.rejeitarBotao,
                          !motivoRejeicao.trim() && styles.botaoDesabilitado
                        ]}
                        onPress={() => handleRejeitarVisita(solicitacaoSelecionada)}
                        disabled={!motivoRejeicao.trim()}
                      >
                        <Text style={styles.modalBotaoTexto}>❌ Rejeitar Visita</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.modalBotao, styles.aceitarBotao]}
                        onPress={() => handleAceitarVisita(solicitacaoSelecionada)}
                      >
                        <Text style={styles.modalBotaoTexto}>✅ Aceitar Visita</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

// ✅ ADICIONE ESTES IMPORTS NO TOPO DO ARQUIVO
import { addDoc, updateDoc, doc } from 'firebase/firestore';

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
  filterGroup: {
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filterSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#666',
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
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipoIcon: {
    fontSize: 16,
  },
  tipoText: {
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
    lineHeight: 20,
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
  motivoSection: {
    padding: 16,
    backgroundColor: '#fff3cd',
    margin: 16,
    borderRadius: 8,
  },
  motivoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ffc107',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
  motivoHelper: {
    fontSize: 12,
    color: '#856404',
    marginTop: 4,
    fontStyle: 'italic',
  },
  modalAcoes: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalBotao: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  aceitarBotao: {
    backgroundColor: '#28a745',
  },
  rejeitarBotao: {
    backgroundColor: '#dc3545',
  },
  botaoDesabilitado: {
    backgroundColor: '#ccc',
  },
  modalBotaoTexto: {
    color: 'white',
    fontWeight: '500',
  },
});

export default NotificacoesAdm;