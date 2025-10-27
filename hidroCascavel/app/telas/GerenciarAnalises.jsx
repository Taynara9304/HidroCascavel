// telas/GerenciarAnalises.js - VERSÃO COMPLETA COM TODOS ATRIBUTOS
import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  Text, 
  Modal,
  TouchableOpacity 
} from 'react-native';
import TabelaAnalises from '../componentes/TabelaAnalises';
import AnalisesContainer from '../componentes/AnalisesContainer';
import useAnalyses from '../hooks/useTabelaAnalises';

const GerenciarAnalises = () => {
  const {
    analyses,
    pocos,
    analistas,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort,
    addAnalysis,
    deleteAnalysis,
    approveAnalysis,
    rejectAnalysis,
  } = useAnalyses();

  // Estados para o modal
  const [modalVisible, setModalVisible] = useState(false);
  const [analiseSelecionada, setAnaliseSelecionada] = useState(null);

  const handleAdicionarAnalise = async (novaAnalise) => {
    try {
      await addAnalysis(novaAnalise);
      Alert.alert('Sucesso', 'Análise cadastrada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', `Não foi possível cadastrar a análise: ${error.message}`);
    }
  };

  // Função para visualizar análise
  const handleVisualizarAnalise = (analysis) => {
    console.log('👁️ GerenciarAnalises: Abrindo modal para análise:', analysis?.id);
    
    if (!analysis) {
      Alert.alert('Erro', 'Análise não encontrada');
      return;
    }

    setAnaliseSelecionada(analysis);
    setModalVisible(true);
  };

  // Função para fechar modal
  const fecharModal = () => {
    setModalVisible(false);
    setAnaliseSelecionada(null);
  };

  // Função para formatar data
  const formatarData = (timestamp) => {
    try {
      if (!timestamp) return 'N/A';
      if (timestamp.toDate) return timestamp.toDate().toLocaleDateString('pt-BR');
      return new Date(timestamp).toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  // ✅ FUNÇÃO PARA FORMATAR GEOPOINT
  const formatarGeopoint = (geopoint) => {
    try {
      if (!geopoint) return 'N/A';
      if (geopoint.latitude && geopoint.longitude) {
        return `${geopoint.latitude.toFixed(4)}° ${geopoint.latitude < 0 ? 'S' : 'N'}, ${geopoint.longitude.toFixed(4)}° ${geopoint.longitude < 0 ? 'W' : 'E'}`;
      }
      return 'Localização não disponível';
    } catch {
      return 'Erro ao formatar localização';
    }
  };

  // ✅ FUNÇÃO PARA FORMATAR VALORES NUMÉRICOS
  const formatarValor = (valor, unidade = '') => {
    if (valor === null || valor === undefined) return 'N/A';
    if (valor === 0) return `0 ${unidade}`.trim();
    return `${valor} ${unidade}`.trim();
  };

  const handleDeleteAnalysis = async (analysisId) => {
    try {
      await deleteAnalysis(analysisId);
      Alert.alert('Sucesso', 'Análise deletada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível deletar a análise: ' + error.message);
    }
  };

  const handleApproveAnalysis = async (analysisId) => {
    try {
      await approveAnalysis(analysisId);
      Alert.alert('Sucesso', 'Análise aprovada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível aprovar a análise: ' + error.message);
    }
  };

  const handleRejectAnalysis = async (analysisId) => {
    Alert.prompt(
      'Motivo da Rejeição',
      'Informe o motivo para rejeitar esta análise:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: (motivo) => {
            if (motivo && motivo.trim()) {
              rejectAnalysis(analysisId, motivo.trim());
              Alert.alert('Sucesso', 'Análise rejeitada com sucesso!');
            }
          }
        }
      ],
      'plain-text'
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2685BF" />
        <Text style={styles.loadingText}>Carregando análises...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <Text style={styles.errorSubtext}>Verifique a conexão com o Firebase</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* MODAL PARA DETALHES COMPLETOS */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              📊 Análise Completa de Água
            </Text>
            
            {analiseSelecionada && (
              <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={true}>
                {/* ✅ SEÇÃO: INFORMAÇÕES GERAIS */}
                <Text style={styles.modalSectionTitle}>📋 INFORMAÇÕES GERAIS</Text>
                
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Poço</Text>
                    <Text style={styles.infoValue}>{analiseSelecionada.nomePoco || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Proprietário</Text>
                    <Text style={styles.infoValue}>{analiseSelecionada.nomeProprietario || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Analista</Text>
                    <Text style={styles.infoValue}>{analiseSelecionada.nomeAnalista || 'N/A'}</Text>
                  </View>
                  
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Data da Análise</Text>
                    <Text style={styles.infoValue}>{formatarData(analiseSelecionada.dataAnalise)}</Text>
                  </View>
                  
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Resultado</Text>
                    <Text style={[
                      styles.infoValue, 
                      analiseSelecionada.resultado === 'Aprovada' ? styles.statusAprovado : styles.statusReprovado
                    ]}>
                      {analiseSelecionada.resultado || 'N/A'}
                    </Text>
                  </View>
                  
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Localização</Text>
                    <Text style={styles.infoValue}>{formatarGeopoint(analiseSelecionada.localizacaoPoco)}</Text>
                  </View>
                </View>

                {/* ✅ SEÇÃO: PARÂMETROS FÍSICO-QUÍMICOS */}
                <Text style={styles.modalSectionTitle}>🔬 PARÂMETROS FÍSICO-QUÍMICOS</Text>
                
                <View style={styles.parametrosGrid}>
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>pH</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.ph)}</Text>
                    <Text style={styles.parametroUnidade}>Unidade</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>Turbidez</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.turbidez)}</Text>
                    <Text style={styles.parametroUnidade}>NTU</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>Cor</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.cor)}</Text>
                    <Text style={styles.parametroUnidade}>UPC</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>Temperatura da Amostra</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.temperaturaAmostra)}</Text>
                    <Text style={styles.parametroUnidade}>°C</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>Temperatura do Ar</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.temperaturaAr)}</Text>
                    <Text style={styles.parametroUnidade}>°C</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>Condutividade Elétrica</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.condutividadeEletrica)}</Text>
                    <Text style={styles.parametroUnidade}>μS/cm</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>SDT</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.sdt)}</Text>
                    <Text style={styles.parametroUnidade}>mg/L</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>SST</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.sst)}</Text>
                    <Text style={styles.parametroUnidade}>mg/L</Text>
                  </View>
                </View>

                {/* ✅ SEÇÃO: PARÂMETROS QUÍMICOS */}
                <Text style={styles.modalSectionTitle}>🧪 PARÂMETROS QUÍMICOS</Text>
                
                <View style={styles.parametrosGrid}>
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>Alcalinidade</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.alcalinidade)}</Text>
                    <Text style={styles.parametroUnidade}>mg/L</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>Acidez</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.acidez)}</Text>
                    <Text style={styles.parametroUnidade}>mg/L</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>Cloro Total</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.cloroTotal)}</Text>
                    <Text style={styles.parametroUnidade}>mg/L</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>Cloro Livre</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.cloroLivre)}</Text>
                    <Text style={styles.parametroUnidade}>mg/L</Text>
                  </View>
                </View>

                {/* ✅ SEÇÃO: PARÂMETROS MICROBIOLÓGICOS */}
                <Text style={styles.modalSectionTitle}>🦠 PARÂMETROS MICROBIOLÓGICOS</Text>
                
                <View style={styles.parametrosGrid}>
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>Coliformes Totais</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.coliformesTotais)}</Text>
                    <Text style={styles.parametroUnidade}>UFC/100mL</Text>
                  </View>
                  
                  <View style={styles.parametroCard}>
                    <Text style={styles.parametroLabel}>E. coli</Text>
                    <Text style={styles.parametroValue}>{formatarValor(analiseSelecionada.Ecoli || analiseSelecionada.ecoli)}</Text>
                    <Text style={styles.parametroUnidade}>UFC/100mL</Text>
                  </View>
                </View>

                {/* ✅ MOTIVO DA REJEIÇÃO (se houver) */}
                {analiseSelecionada.motivoRejeicao && (
                  <>
                    <Text style={styles.modalSectionTitle}>❌ MOTIVO DA REJEIÇÃO</Text>
                    <View style={styles.motivoRejeicaoCard}>
                      <Text style={styles.motivoRejeicaoText}>
                        {analiseSelecionada.motivoRejeicao}
                      </Text>
                    </View>
                  </>
                )}
              </ScrollView>
            )}
            
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={fecharModal}
            >
              <Text style={styles.modalCloseText}>Fechar Detalhes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.tableSection}>
          <TabelaAnalises
            analyses={analyses}
            onEdit={handleVisualizarAnalise}
            onDelete={handleDeleteAnalysis}
            onApprove={handleApproveAnalysis}
            onReject={handleRejectAnalysis}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        </View>
        
        <View style={styles.formSection}>
          <AnalisesContainer 
            onAdicionarAnalise={handleAdicionarAnalise}
            pocos={pocos}
            analistas={analistas}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  tableSection: {
    marginBottom: 8,
  },
  formSection: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  // ESTILOS DO MODAL - VERSÃO COMPLETA
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '95%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2685BF',
  },
  modalScrollView: {
    maxHeight: '80%',
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C5530',
    marginTop: 20,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#E8F5E8',
  },
  // Grid de Informações Gerais
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    width: '48%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  infoValueSmall: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  statusAprovado: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  statusReprovado: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  // Grid de Parâmetros
  parametrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  parametroCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  parametroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
    marginBottom: 4,
  },
  parametroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
  },
  parametroUnidade: {
    fontSize: 10,
    color: '#6C757D',
    textAlign: 'center',
    marginTop: 2,
  },
  // Motivo da Rejeição
  motivoRejeicaoCard: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    marginBottom: 16,
  },
  motivoRejeicaoText: {
    fontSize: 14,
    color: '#C62828',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  // Botão Fechar
  modalCloseButton: {
    backgroundColor: '#2685BF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GerenciarAnalises;