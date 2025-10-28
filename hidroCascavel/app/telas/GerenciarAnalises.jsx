// telas/GerenciarAnalises.jsx - VERSÃO CORRIGIDA
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
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      carregarAnalises();
    }
  }, [user]);

  const carregarAnalises = async () => {
    try {
      setLoading(true);
      console.log('🔍 GerenciarAnalises - Carregando análises para:', user.uid);
      
      if (!user) {
        console.log('❌ Usuário não autenticado');
        return;
      }

      // ✅ CORREÇÃO: Buscar análises onde o analistaId é o usuário logado
      const q = query(
        collection(db, 'analysis'),
        where('idAnalista', '==', user.uid),
        orderBy('dataCriacao', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const analisesList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          analisesList.push({
            id: doc.id,
            ...data
          });
        });
        
        console.log('✅ Análises carregadas:', analisesList.length);
        console.log('📋 Primeira análise:', analisesList[0]);
        
        setAnalises(analisesList);
        setLoading(false);
        setRefreshing(false);
      }, (error) => {
        console.error('❌ Erro no snapshot:', error);
        setLoading(false);
        setRefreshing(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('❌ Erro ao carregar análises:', error);
      Alert.alert('Erro', 'Não foi possível carregar as análises');
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarAnalises();
  };

  const navegarParaNovaSolicitacao = () => {
    navigation.navigate('NovaSolicitacao');
  };

  const navegarParaNotificacoes = () => {
    navigation.navigate('NotificacoesAnalista');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2685BF" />
        <Text>Carregando análises...</Text>
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
      <Text style={styles.title}>Minhas Análises</Text>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Suas Análises</Text>
        <Text style={styles.infoText}>
          • Aqui estão todas as análises que você cadastrou{'\n'}
          • As análises aprovadas pelo admin aparecem automaticamente{'\n'}
          • Use o botão abaixo para solicitar nova análise
        </Text>
      </View>

      {/* Estatísticas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{analises.length}</Text>
          <Text style={styles.statLabel}>Total de Análises</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {analises.filter(a => a.resultado === 'Aprovada').length}
          </Text>
          <Text style={styles.statLabel}>Aprovadas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {analises.filter(a => a.resultado === 'Reprovada').length}
          </Text>
          <Text style={styles.statLabel}>Reprovadas</Text>
        </View>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={navegarParaNovaSolicitacao}
        >
          <Text style={styles.primaryButtonText}>+ Nova Solicitação</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={navegarParaNotificacoes}
        >
          <Text style={styles.secondaryButtonText}>🔔 Notificações</Text>
        </TouchableOpacity>
      </View>

      {/* Tabela de Análises */}
      {analises.length > 0 ? (
        <TabelaAnalises analises={analises} />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhuma análise encontrada</Text>
          <Text style={styles.emptySubText}>
            Suas análises aprovadas aparecerão aqui automaticamente
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={navegarParaNovaSolicitacao}
          >
            <Text style={styles.emptyButtonText}>Solicitar Primeira Análise</Text>
          </TouchableOpacity>
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
    marginBottom: 16,
    color: '#2685BF',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2685BF',
  },
  statLabel: {
    fontSize: 12,
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
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#2685BF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default GerenciarAnalises;