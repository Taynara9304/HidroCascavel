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
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  where,
  addDoc,
  updateDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/authContext';
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
  const [filterTipo, setFilterTipo] = useState('todos');
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
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

    if (filterStatus !== 'todos') {
      filtradas = filtradas.filter(notificacao => notificacao.status === filterStatus);
    }

    if (filterTipo !== 'todos') {
      filtradas = filtradas.filter(notificacao => notificacao.tipo === filterTipo);
    }

    setFilteredNotifications(filtradas);
  };

  // ✅ FUNÇÃO CORRIGIDA PARA ACEITAR ANÁLISE
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

      const dados = notification.dadosSolicitacao;
      console.log('🔍 Dados da análise:', dados);

      // 🔒 VERIFICAÇÃO DE SEGURANÇA DOS DADOS
      if (!dados || !dados.idProprietario || !dados.idAnalista || !dados.idPoco) {
        console.error('❌ ERRO FATAL: Dados essenciais faltando:', {
          idProprietario: dados?.idProprietario,
          idAnalista: dados?.idAnalista,
          idPoco: dados?.idPoco
        });
        Alert.alert(
          'Erro de Dados', 
          'Não foi possível aceitar. Dados essenciais da solicitação estão incompletos.'
        );
        setCarregandoId(null);
        return;
      }

      // 1. Criar a análise na coleção 'analysis'
      const analiseAprovada = {
        idAnalista: dados.idAnalista,
        analistaNome: dados.analistaNome,
        idProprietario: dados.idProprietario,
        proprietarioNome: dados.proprietarioNome,
        idPoco: dados.idPoco,
        pocoNome: dados.pocoNome,
        pocoLocalizacao: dados.pocoLocalizacao,
        dataColeta: dados.dataColeta,
        dataCriacao: Timestamp.now(),
        dataAprovacao: Timestamp.now(),
        aprovadoPor: user.uid,
        aprovadoPorNome: user.displayName || 'Administrador',
        resultado: dados.resultado,
        parametros: dados.parametros,
        status: 'aprovada'
      };

      const docRef = await addDoc(collection(db, 'analysis'), analiseAprovada);
      console.log('✅ Análise criada com ID:', docRef.id);

      // 2. Atualizar a notificação do Admin para 'aceita'
      await updateDoc(doc(db, 'notifications', notification.id), {
        status: 'aceita',
        dataResolucao: Timestamp.now(),
        resolvidoPor: user.uid
      });

      // 3. Notificar o Analista que foi aceita
      const notificacaoAnalista = {
        tipo: 'analise_aprovada',
        titulo: '✅ Análise Aprovada',
        mensagem: `Sua solicitação de análise para o poço "${dados.pocoNome}" foi aprovada e publicada.`,
        userId: dados.idAnalista,
        status: 'nao_lida',
        dataCriacao: Timestamp.now(),
        dadosAnalise: {
          analiseId: docRef.id,
          pocoNome: dados.pocoNome,
          dataAnalise: Timestamp.now()
        }
      };
      await addDoc(collection(db, 'notifications_analista'), notificacaoAnalista);
      console.log('✅ Notificação enviada para o analista');

      // 4. 🔥 CORREÇÃO CRÍTICA: Criar notificação de AVALIAÇÃO para o Proprietário
      const notificacaoProprietario = {
        idDoUsuario: dados.idProprietario,
        tipoNotificacao: 'analise_concluida',
        titulo: `📊 Análise do Poço "${dados.pocoNome}" Concluída!`,
        mensagem: `A análise do poço "${dados.pocoNome}" foi concluída e está disponível para consulta. Avalie nosso serviço.`,
        idDaAnalise: docRef.id,
        idDoPoco: dados.idPoco,
        dataSolicitacao: Timestamp.now(),
        status: 'concluida',
        statusAvaliacao: 'pendente'
      };
      
      await addDoc(collection(db, 'notifications'), notificacaoProprietario);
      console.log('✅ Notificação de avaliação enviada para o proprietário:', dados.idProprietario);

      Alert.alert('Sucesso', 'Análise aceita e notificações enviadas!');
      await carregarNotificacoes();
      
    } catch (error) {
      console.error('❌ Erro completo ao aceitar análise:', error);
      Alert.alert('Erro', `Não foi possível aceitar a análise: ${error.message}`);
    } finally {
      setCarregandoId(null);
    }
  };

  // ✅ FUNÇÃO PARA REJEITAR ANÁLISE (MODIFICADA)
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
      
      // Trava de segurança para dados de rejeição
      const dados = notificationData.dadosSolicitacao;
      if (!dados || !dados.idAnalista) {
        console.error('❌ ERRO FATAL: Notificação de rejeição sem dados do analista.', dados);
        Alert.alert('Erro de Dados', 'Não foi possível rejeitar. A notificação está corrompida.');
        setCarregandoId(null);
        return;
      }

      // 1. Atualizar a notificação do Admin (esta) para 'rejeitada'
      await updateDoc(doc(db, 'notifications', notificationId), {
        status: 'rejeitada',
        dataResolucao: Timestamp.now(),
        resolvidoPor: user.uid
      });

      // 2. Notificar o Analista que foi rejeitada
      const notificacaoAnalista = {
        tipo: 'analise_rejeitada',
        titulo: '❌ Análise Rejeitada',
        mensagem: `Sua solicitação de análise para o poço ${dados.pocoNome || 'desconhecido'} foi rejeitada.`,
        userId: dados.idAnalista,
        status: 'nao_lida',
        dataCriacao: Timestamp.now(),
        dadosAnalise: {
          pocoNome: dados.pocoNome
        }
      };
      await addDoc(collection(db, 'notifications_analista'), notificacaoAnalista);

      Alert.alert('Sucesso', 'Análise rejeitada!');
      await carregarNotificacoes();
      
    } catch (error) {
      console.error('❌ Erro ao rejeitar análise:', error);
      Alert.alert('Erro', 'Não foi possível rejeitar a análise');
    } finally {
      setCarregandoId(null);
    }
  };

  // ✅ FUNÇÃO: ACEITAR VISITA (Existente)
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

      const dados = notification.dadosVisita;
      
      // Trava de segurança para visitas
      if (!dados || !dados.pocoId || !dados.analistaId) {
         console.error('❌ ERRO FATAL: A notificação de visita não contém dados essenciais.', dados);
        Alert.alert('Erro de Dados', 'Não foi possível aceitar. A notificação de visita está corrompida.');
        setCarregandoId(null);
        return;
      }

      const visitaAprovada = {
        pocoId: dados.pocoId,
        pocoNome: dados.pocoNome,
        pocoLocalizacao: dados.pocoLocalizacao,
        proprietario: dados.proprietario,
        dataVisita: dados.dataVisita,
        situacao: dados.situacao || 'concluida',
        observacoes: dados.observacoes,
        resultado: dados.resultado || '',
        recomendacoes: dados.recomendacoes || '',
        analistaId: dados.analistaId,
        analistaNome: dados.analistaNome,
        tipoUsuario: dados.tipoUsuario,
        userId: dados.userId,
        status: 'aprovada',
        dataAprovacao: new Date().toISOString(),
        aprovadoPor: user.uid,
        aprovadoPorNome: 'Administrador',
        dataCriacao: new Date()
      };

      const docRef = await addDoc(collection(db, 'visits'), visitaAprovada);
      
      await updateDoc(doc(db, 'notifications', notification.id), {
        status: 'aceita',
        dataResolucao: new Date(),
        resolvidoPor: user.uid
      });

      const notificacaoAnalista = {
        tipo: 'visita_aprovada',
        titulo: '✅ Visita Aprovada',
        mensagem: `Sua visita técnica no poço ${dados.pocoNome} foi aprovada.`,
        userId: dados.analistaId,
        status: 'nao_lida',
        dataCriacao: new Date(),
        dadosVisita: {
          visitaId: docRef.id,
          pocoNome: dados.pocoNome
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

  // ✅ FUNÇÃO: REJEITAR VISITA (Existente)
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
      
      const dados = notification.dadosVisita;
      
      // Trava de segurança
      if (!dados || !dados.analistaId) {
        console.error('❌ ERRO FATAL: Notificação de rejeição de visita sem dados do analista.', dados);
        Alert.alert('Erro de Dados', 'Não foi possível rejeitar. A notificação está corrompida.');
        setCarregandoId(null);
        return;
      }

      await updateDoc(doc(db, 'notifications', notification.id), {
        status: 'rejeitada',
        dataResolucao: new Date(),
        resolvidoPor: user.uid,
        motivoRejeicao: motivoRejeicao
      });

      const notificacaoAnalista = {
        tipo: 'visita_rejeitada',
        titulo: '❌ Visita Rejeitada',
        mensagem: `Sua visita técnica no poço ${dados.pocoNome || 'desconhecido'} foi rejeitada. Motivo: ${motivoRejeicao}`,
        userId: dados.analistaId,
        status: 'nao_lida',
        dataCriacao: new Date(),
        dadosVisita: {
          pocoNome: dados.pocoNome,
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
    setMotivoRejeicao('');
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
            : isVisita 
              ? `${item.dadosVisita?.analistaNome || 'Analista'} registrou uma visita técnica no poço ${item.dadosVisita?.pocoNome}`
              : 'Nova solicitação'
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
                  verDetalhes(item);
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
                        disabled={!motivoRejeicao.trim() || carregandoId !== null}
                      >
                        {carregandoId === solicitacaoSelecionada?.id ? (
                          <ActivityIndicator size="small" color="white" />
                        ) : (
                          <Text style={styles.modalBotaoTexto}>Rejeitar Visita</Text>
                        )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f6',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 16,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tipoIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  tipoText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  dataContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginBottom: 8,
  },
  dataText: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  dataLabel: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 12,
    paddingTop: 12,
  },
  botaoDetalhes: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  botaoDetalhesTexto: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 13,
  },
  botaoAceitar: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  botaoAceitarTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  botaoRejeitar: {
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  botaoRejeitarTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 13,
  },
  processadaContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  processadaText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  processadaData: {
    fontSize: 12,
    color: '#777',
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
  filterContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  filterGroup: {
    marginBottom: 8,
  },
  filterSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
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
  modalContainer: {
    flex: 1,
    backgroundColor: isDesktop ? 'rgba(0,0,0,0.5)' : '#f4f7f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  botaoFechar: {
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoFecharTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  motivoSection: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
  },
  motivoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  motivoHelper: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  modalAcoes: {
    marginTop: 16,
  },
  modalBotao: {
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  modalBotaoTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  rejeitarBotao: {
    backgroundColor: '#F44336',
  },
  botaoDesabilitado: {
    backgroundColor: '#ccc',
  },
});

export default NotificacoesAdm;