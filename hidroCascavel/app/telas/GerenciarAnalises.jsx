// telas/GerenciarAnalises.jsx - VERSÃO COM DEBUG E FALLBACKS
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/authContext';
import TabelaAnalises from '../componentes/TabelaAnalises';

const GerenciarAnalises = ({ navigation }) => {
  const [analises, setAnalises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, userType } = useAuth();

  console.log('🔍 GerenciarAnalises - Estado inicial:', {
    user: user?.uid,
    userType,
    loadingAuth: loading
  });

  useEffect(() => {
    console.log('🔄 useEffect disparado - user:', user?.uid, 'userType:', userType);
    
    if (user && userType !== undefined) {
      carregarAnalises();
    } else if (user && userType === undefined) {
      console.log('⚠️ userType é undefined, mas user existe. Tentando carregar análises...');
      carregarAnalises();
    }
  }, [user, userType]);

  const carregarAnalises = async () => {
    try {
      setLoading(true);
      
      console.log('📥 Iniciando carregamento de análises...', {
        uid: user?.uid,
        userType: userType,
        timestamp: new Date().toISOString()
      });

      if (!user) {
        console.log('❌ Usuário não autenticado - parando carregamento');
        setLoading(false);
        return;
      }

      let q;

      // ✅ VERIFICAÇÃO ROBUSTA DO TIPO DE USUÁRIO
      const tipoUsuarioFinal = userType || 'admin'; // Fallback para admin se undefined
      
      console.log('🎯 Tipo de usuário para consulta:', tipoUsuarioFinal);

      if (tipoUsuarioFinal === 'proprietario') {
        // PROPRIETÁRIO: vê apenas suas próprias análises
        q = query(
          collection(db, 'analysis'),
          where('idProprietario', '==', user.uid),
          orderBy('dataCriacao', 'desc')
        );
        console.log('👤 Consulta: análises do proprietário', user.uid);
      
      } else {
        // ANALISTA, ADMIN OU FALLBACK: veem todas as análises
        q = query(
          collection(db, 'analysis'),
          orderBy('dataCriacao', 'desc')
        );
        console.log('👥 Consulta: TODAS as análises');
      }

      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const analisesList = [];
          console.log('📊 Snapshot recebido - documentos:', querySnapshot.size);
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            analisesList.push({
              id: doc.id,
              ...data
            });
          });
          
          console.log('✅ Análises processadas:', analisesList.length);
          if (analisesList.length > 0) {
            console.log('📋 Primeira análise:', {
              id: analisesList[0].id,
              pocoNome: analisesList[0].pocoNome,
              resultado: analisesList[0].resultado,
              status: analisesList[0].status
            });
          }
          
          setAnalises(analisesList);
          setLoading(false);
          setRefreshing(false);
        }, 
        (error) => {
          console.error('❌ Erro no snapshot:', error);
          console.error('❌ Detalhes do erro:', error.message);
          Alert.alert('Erro', 'Não foi possível carregar as análises: ' + error.message);
          setLoading(false);
          setRefreshing(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error('❌ Erro ao carregar análises:', error);
      console.error('❌ Stack trace:', error.stack);
      Alert.alert('Erro', 'Não foi possível carregar as análises');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    console.log('🔄 Refresh manual acionado');
    setRefreshing(true);
    carregarAnalises();
  };

  const navegarParaNovaSolicitacao = () => {
    navigation.navigate('NovaSolicitacao');
  };

  const navegarParaNotificacoes = () => {
    navigation.navigate('NotificacoesAnalista');
  };

  // ✅ Função para obter título baseado no tipo de usuário
  const getTitulo = () => {
    const tipo = userType || 'admin'; // Fallback
    switch (tipo) {
      case 'proprietario':
        return 'Minhas Análises';
      case 'analista':
        return 'Todas as Análises';
      case 'admin':
        return 'Gerenciar Análises';
      default:
        return 'Análises';
    }
  };

  // ✅ Função para obter texto informativo baseado no tipo de usuário
  const getInfoText = () => {
    const tipo = userType || 'admin'; // Fallback
    
    if (loading) {
      return 'Carregando informações...';
    }

    switch (tipo) {
      case 'proprietario':
        return `• Aqui estão todas as análises dos seus poços\n• Total de ${analises.length} análise${analises.length !== 1 ? 's' : ''} encontrada${analises.length !== 1 ? 's' : ''}\n• As análises aprovadas aparecem automaticamente`;
      case 'analista':
        return `• Aqui estão todas as análises do sistema\n• Total de ${analises.length} análise${analises.length !== 1 ? 's' : ''} encontrada${analises.length !== 1 ? 's' : ''}\n• Você pode visualizar e editar todas as análises`;
      case 'admin':
        return `• Gerenciamento completo de todas as análises\n• Total de ${analises.length} análise${analises.length !== 1 ? 's' : ''} encontrada${analises.length !== 1 ? 's' : ''}\n• Controle total sobre aprovações e status`;
      default:
        return `• Modo administrativo\n• Total de ${analises.length} análise${analises.length !== 1 ? 's' : ''} encontrada${analises.length !== 1 ? 's' : ''}`;
    }
  };

  // ✅ Função para verificar se deve mostrar botão de nova solicitação
  const deveMostrarNovaSolicitacao = () => {
    const tipo = userType || 'admin';
    return tipo === 'proprietario' || tipo === 'analista';
  };

  console.log('🎨 Renderizando GerenciarAnalises:', {
    userType,
    analisesCount: analises.length,
    loading
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2685BF" />
        <Text style={styles.loadingText}>Carregando análises...</Text>
        <Text style={styles.loadingSubText}>
          {user ? `Usuário: ${user.uid}` : 'Aguardando autenticação...'}
        </Text>
        <Text style={styles.loadingSubText}>
          Tipo: {userType || 'carregando...'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#2685BF']}
        />
      }
    >
      <Text style={styles.title}>{getTitulo()}</Text>
      
      {/* Badge do tipo de usuário */}
      <View style={styles.userTypeBadge}>
        <Text style={styles.userTypeText}>
          {userType === 'proprietario' ? '👤 Proprietário' : 
           userType === 'analista' ? '🔬 Analista' : 
           userType === 'admin' ? '⚙️ Administrador' : '⚙️ Administrador'}
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Informações</Text>
        <Text style={styles.infoText}>
          {getInfoText()}
        </Text>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{analises.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {analises.filter(a => 
              a.resultado === 'Aprovada' || a.resultado === 'aprovada'
            ).length}
          </Text>
          <Text style={styles.statLabel}>Aprovadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {analises.filter(a => 
              a.resultado === 'Reprovada' || a.resultado === 'reprovada'
            ).length}
          </Text>
          <Text style={styles.statLabel}>Reprovadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {analises.filter(a => 
              !a.resultado || 
              (a.resultado !== 'Aprovada' && 
               a.resultado !== 'aprovada' && 
               a.resultado !== 'Reprovada' && 
               a.resultado !== 'reprovada')
            ).length}
          </Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
      </View>

      {/* Botões de Ação - Condicionais por tipo de usuário */}
      <View style={styles.actionsContainer}>
        {deveMostrarNovaSolicitacao() && (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={navegarParaNovaSolicitacao}
          >
            <Text style={styles.primaryButtonText}>
              {userType === 'proprietario' ? '+ Nova Solicitação' : '+ Nova Análise'}
            </Text>
          </TouchableOpacity>
        )}
        
        {(userType === 'analista' || userType === 'admin' || !userType) && (
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={navegarParaNotificacoes}
          >
            <Text style={styles.secondaryButtonText}>🔔 Notificações</Text>
          </TouchableOpacity>
        )}
      </View>


      {/* Tabela de Análises */}
      {analises.length > 0 ? (
        <TabelaAnalises 
          analises={analises} 
          readOnly={userType === 'proprietario'} // Proprietários só podem visualizar
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {userType === 'proprietario' 
              ? 'Nenhuma análise dos seus poços encontrada' 
              : 'Nenhuma análise encontrada no sistema'
            }
          </Text>
          <Text style={styles.emptySubText}>
            {userType === 'proprietario'
              ? 'Suas análises aprovadas aparecerão aqui automaticamente'
              : 'As análises aparecerão aqui quando forem cadastradas no sistema'
            }
          </Text>
          
          {/* Botão para forçar recarregamento */}
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={onRefresh}
          >
            <Text style={styles.emptyButtonText}>🔄 Tentar Novamente</Text>
          </TouchableOpacity>
          
          {deveMostrarNovaSolicitacao() && (
            <TouchableOpacity 
              style={[styles.emptyButton, { marginTop: 8 }]}
              onPress={navegarParaNovaSolicitacao}
            >
              <Text style={styles.emptyButtonText}>
                {userType === 'proprietario' 
                  ? 'Solicitar Primeira Análise' 
                  : 'Criar Primeira Análise'
                }
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2685BF',
    textAlign: 'center',
  },
  userTypeBadge: {
    alignSelf: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  userTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2685BF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingSubText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2685BF',
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2685BF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 70,
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2685BF',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: '#2685BF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugContainer: {
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 4,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  debugText: {
    fontSize: 10,
    color: '#856404',
    fontFamily: 'monospace',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#2685BF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default GerenciarAnalises;