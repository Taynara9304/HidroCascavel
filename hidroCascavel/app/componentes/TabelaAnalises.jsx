// componentes/TabelaAnalises.js - VERSÃO CORRIGIDA
import React, { useState, useMemo, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth * 0.2;
const CARD_MARGIN = 8;

const TabelaAnalises = ({ 
  analyses = [], 
  onEdit, 
  onDelete, 
  onApprove,
  onReject,
  sortField, 
  sortDirection, 
  onSort 
}) => {
  const [busca, setBusca] = useState('');
  const [filtroResultado, setFiltroResultado] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const flatListRef = useRef(null);

  console.log('📊 TabelaAnalises: analyses recebido =', analyses.length);
  console.log('🔍 TabelaAnalises: Funções disponíveis:', {
    onEdit: typeof onEdit,
    onDelete: typeof onDelete,
    onApprove: typeof onApprove,
    onReject: typeof onReject
  });

  const resultadosUnicos = useMemo(() => {
    const resultados = analyses.map(analysis => analysis.resultado).filter(Boolean);
    return [...new Set(resultados)];
  }, [analyses]);

  const statusUnicos = useMemo(() => {
    const status = analyses.map(analysis => analysis.status).filter(Boolean);
    return [...new Set(status)];
  }, [analyses]);

  const analisesFiltradas = useMemo(() => {
    const filtradas = analyses.filter(analysis => {
      const matchBusca = 
        analysis.nomePoco?.toLowerCase().includes(busca.toLowerCase()) ||
        analysis.nomeProprietario?.toLowerCase().includes(busca.toLowerCase()) ||
        analysis.nomeAnalista?.toLowerCase().includes(busca.toLowerCase());
      
      const matchFiltroResultado = 
        filtroResultado === 'todos' || 
        analysis.resultado === filtroResultado;
      
      const matchFiltroStatus = 
        filtroStatus === 'todos' || 
        analysis.status === filtroStatus;
      
      return matchBusca && matchFiltroResultado && matchFiltroStatus;
    });
    
    setPaginaAtual(0);
    return filtradas;
  }, [analyses, busca, filtroResultado, filtroStatus]);

  const formatarData = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString('pt-BR');
      }
      return new Date(timestamp).toLocaleDateString('pt-BR');
    } catch (error) {
      return 'Data inválida';
    }
  };

  const irParaPagina = (pagina) => {
    setPaginaAtual(pagina);
    flatListRef.current?.scrollToIndex({ index: pagina, animated: true });
  };

  // ✅ CORRIGIDO: Função de visualizar
  const handleVisualizar = (analysis) => {
    console.log('👁️ Visualizando análise:', analysis.id);
    
    const detalhes = `
📊 **ANÁLISE DETALHADA**

**Poço:** ${analysis.nomePoco || 'N/A'}
**Proprietário:** ${analysis.nomeProprietario || 'N/A'}
**Analista:** ${analysis.nomeAnalista || 'N/A'}
**Data da Análise:** ${formatarData(analysis.dataAnalise)}
**Resultado:** ${analysis.resultado || 'N/A'}
**Status:** ${getStatusTexto(analysis.status, analysis.resultado)}

🔬 **PARÂMETROS FÍSICO-QUÍMICOS:**
• pH: ${analysis.ph || 'N/A'}
• Turbidez: ${analysis.turbidez || 'N/A'} NTU
• Cor: ${analysis.cor || 'N/A'} UPC
• Temperatura da Amostra: ${analysis.temperaturaAmostra || 'N/A'}°C
• Temperatura do Ar: ${analysis.temperaturaAr || 'N/A'}°C
• Condutividade Elétrica: ${analysis.condutividadeEletrica || 'N/A'} μS/cm
• SDT: ${analysis.sdt || 'N/A'} mg/L
• SST: ${analysis.sst || 'N/A'} mg/L

🧪 **PARÂMETROS QUÍMICOS:**
• Alcalinidade: ${analysis.alcalinidade || 'N/A'} mg/L
• Acidez: ${analysis.acidez || 'N/A'} mg/L
• Cloro Total: ${analysis.cloroTotal || 'N/A'} mg/L
• Cloro Livre: ${analysis.cloroLivre || 'N/A'} mg/L

🦠 **PARÂMETROS MICROBIOLÓGICOS:**
• Coliformes Totais: ${analysis.coliformesTotais || 'N/A'} UFC/100mL
• E. coli: ${analysis.Ecoli || analysis.ecoli || 'N/A'} UFC/100mL

${analysis.motivoRejeicao ? `**Motivo da Rejeição:** ${analysis.motivoRejeicao}` : ''}
    `.trim();

    Alert.alert('Detalhes da Análise', detalhes, [
      { text: 'Fechar', style: 'cancel' },
      analysis.status === 'pendente_aprovacao' && {
        text: 'Aprovar', 
        onPress: () => handleAprovar(analysis),
        style: 'default'
      },
      analysis.status === 'pendente_aprovacao' && {
        text: 'Rejeitar', 
        onPress: () => handleRejeitar(analysis),
        style: 'destructive'
      }
    ].filter(Boolean));
  };

  // ✅ CORRIGIDO: Função de deletar
  const handleDeletar = (analysis) => {
    console.log('🗑️ Tentando deletar análise:', analysis.id);
    if (!onDelete) {
      console.error('❌ onDelete não está definido');
      Alert.alert('Erro', 'Função de exclusão não disponível');
      return;
    }

    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a análise do poço "${analysis.nomePoco}"?\n\nEsta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => onDelete(analysis.id)
        }
      ]
    );
  };

  // ✅ CORRIGIDO: Função de aprovar
  const handleAprovar = (analysis) => {
    console.log('✅ Tentando aprovar análise:', analysis.id);
    if (!onApprove) {
      console.error('❌ onApprove não está definido');
      Alert.alert('Erro', 'Função de aprovação não disponível');
      return;
    }
    
    Alert.alert(
      'Aprovar Análise',
      `Deseja aprovar a análise do poço "${analysis.nomePoco}"?\n\nApós a aprovação, a análise ficará visível para todos os usuários.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Aprovar', 
          style: 'default',
          onPress: () => onApprove(analysis.id)
        }
      ]
    );
  };

  // ✅ CORRIGIDO: Função de rejeitar
  const handleRejeitar = (analysis) => {
    console.log('❌ Tentando rejeitar análise:', analysis.id);
    if (!onReject) {
      console.error('❌ onReject não está definido');
      Alert.alert('Erro', 'Função de rejeição não disponível');
      return;
    }
    
    Alert.alert(
      'Rejeitar Análise',
      `Deseja rejeitar a análise do poço "${analysis.nomePoco}"?\n\nSerá necessário informar o motivo da rejeição.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Rejeitar', 
          style: 'destructive',
          onPress: () => {
            Alert.prompt(
              'Motivo da Rejeição',
              'Informe o motivo para rejeitar esta análise:',
              [
                { text: 'Cancelar', style: 'cancel' },
                { 
                  text: 'Confirmar', 
                  onPress: (motivo) => onReject(analysis.id, motivo || 'Motivo não informado')
                }
              ],
              'plain-text'
            );
          }
        }
      ]
    );
  };

  const getStatusColor = (status, resultado) => {
    if (status === 'pendente_aprovacao') return '#FFA500';
    if (resultado === 'Aprovada') return '#4CAF50';
    if (resultado === 'Reprovada') return '#F44336';
    return '#666';
  };

  const getStatusTexto = (status, resultado) => {
    if (status === 'pendente_aprovacao') return 'Pendente';
    if (resultado === 'Aprovada') return 'Aprovada';
    if (resultado === 'Reprovada') return 'Reprovada';
    return status || 'N/A';
  };

  const renderItem = ({ item: analysis }) => (
    <View style={styles.card}>
      {/* Cabeçalho Compacto */}
      <View style={styles.cardHeader}>
        <Text style={styles.pocoNome} numberOfLines={1}>
          {analysis.nomePoco || 'Poço não informado'}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(analysis.status, analysis.resultado) }
        ]}>
          <Text style={styles.statusTexto}>
            {getStatusTexto(analysis.status, analysis.resultado)}
          </Text>
        </View>
      </View>
      
      {/* Informações da Análise */}
      <View style={styles.cardInfo}>
        <Text style={styles.infoLabel}>👤 Proprietário:</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {analysis.nomeProprietario || 'N/A'}
        </Text>
      </View>
      
      <View style={styles.cardInfo}>
        <Text style={styles.infoLabel}>🔬 Analista:</Text>
        <Text style={styles.infoValue} numberOfLines={1}>
          {analysis.nomeAnalista || 'N/A'}
        </Text>
      </View>
      
      <View style={styles.cardInfo}>
        <Text style={styles.infoLabel}>📅 Data:</Text>
        <Text style={styles.infoValue}>
          {formatarData(analysis.dataAnalise)}
        </Text>
      </View>
      
      {/* Parâmetros Principais */}
      <View style={styles.parametrosContainer}>
        <View style={styles.parametro}>
          <Text style={styles.parametroLabel}>pH</Text>
          <Text style={styles.parametroValue}>
            {analysis.ph || analysis.ph === 0 ? analysis.ph : 'N/A'}
          </Text>
        </View>
        <View style={styles.parametro}>
          <Text style={styles.parametroLabel}>Turbidez</Text>
          <Text style={styles.parametroValue}>
            {analysis.turbidez || analysis.turbidez === 0 ? analysis.turbidez : 'N/A'}
          </Text>
        </View>
        <View style={styles.parametro}>
          <Text style={styles.parametroLabel}>Cloro</Text>
          <Text style={styles.parametroValue}>
            {analysis.cloroLivre || analysis.cloroLivre === 0 ? analysis.cloroLivre : 'N/A'}
          </Text>
        </View>
      </View>
      
      {/* Ações Condicionais */}
      <View style={styles.cardAcoes}>
        <TouchableOpacity 
          style={styles.botaoDetalhes}
          onPress={() => {
            console.log('🟡 BOTÃO DETALHES: Clicado, chamando onEdit...');
            onEdit(analysis); // ✅ DEVE passar o objeto analysis COMPLETO
          }}
        >
          <Text style={styles.botaoTexto}>👁️ Detalhes</Text>
        </TouchableOpacity>
        
        {analysis.status === 'pendente_aprovacao' && (
          <>
            <TouchableOpacity 
              style={styles.botaoAprovar}
              onPress={() => handleAprovar(analysis)}
            >
              <Text style={styles.botaoTexto}>✅ Aprovar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.botaoRejeitar}
              onPress={() => handleRejeitar(analysis)}
            >
              <Text style={styles.botaoTexto}>❌ Rejeitar</Text>
            </TouchableOpacity>
          </>
        )}
        
        <TouchableOpacity 
          style={styles.botaoDeletar}
          onPress={() => onDelete(analysis.id)} // ✅ Deve chamar onDelete com o ID
        >
          <Text style={styles.botaoTexto}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.titulo}>
          Análises de Água ({analisesFiltradas.length})
        </Text>
        
        {/* Barra de Busca e Filtros */}
        <View style={styles.barraBuscaContainer}>
          <View style={styles.buscaInputContainer}>
            <TextInput
              style={styles.buscaInput}
              placeholder="🔍 Buscar por poço, proprietário ou analista..."
              value={busca}
              onChangeText={setBusca}
            />
            {busca.length > 0 && (
              <TouchableOpacity 
                style={styles.limparBusca}
                onPress={() => setBusca('')}
              >
                <Text style={styles.limparBuscaTexto}>×</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.botaoFiltros}
            onPress={() => setMostrarFiltros(true)}
          >
            <Text style={styles.botaoFiltrosTexto}>⚙️</Text>
            {(filtroResultado !== 'todos' || filtroStatus !== 'todos') && (
              <View style={styles.filtroAtivo} />
            )}
          </TouchableOpacity>
        </View>

        {/* Ordenação Rápida */}
        <View style={styles.ordenacaoContainer}>
          <Text style={styles.ordenacaoTitulo}>Ordenar:</Text>
          <TouchableOpacity 
            style={[
              styles.ordenacaoBotao,
              sortField === 'nomePoco' && styles.ordenacaoBotaoAtivo
            ]}
            onPress={() => onSort('nomePoco')}
          >
            <Text style={styles.ordenacaoBotaoTexto}>
              Poço {sortField === 'nomePoco' && (sortDirection === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.ordenacaoBotao,
              sortField === 'dataAnalise' && styles.ordenacaoBotaoAtivo
            ]}
            onPress={() => onSort('dataAnalise')}
          >
            <Text style={styles.ordenacaoBotaoTexto}>
              Data {sortField === 'dataAnalise' && (sortDirection === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.ordenacaoBotao,
              sortField === 'resultado' && styles.ordenacaoBotaoAtivo
            ]}
            onPress={() => onSort('resultado')}
          >
            <Text style={styles.ordenacaoBotaoTexto}>
              Resultado {sortField === 'resultado' && (sortDirection === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Grid Horizontal de Cards */}
        {analisesFiltradas.length > 0 ? (
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={analisesFiltradas}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
              snapToAlignment="center"
              decelerationRate="fast"
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_MARGIN * 2)
                );
                setPaginaAtual(newIndex);
              }}
              contentContainerStyle={styles.carouselContent}
            />
            
            {/* Indicadores de Página */}
            {analisesFiltradas.length > 1 && (
              <View style={styles.paginacaoContainer}>
                <Text style={styles.paginacaoTexto}>
                  {paginaAtual + 1} de {analisesFiltradas.length}
                </Text>
                <View style={styles.paginacaoPontos}>
                  {analisesFiltradas.map((_, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => irParaPagina(index)}
                    >
                      <View
                        style={[
                          styles.ponto,
                          index === paginaAtual && styles.pontoAtivo
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.semDadosContainer}>
            <Text style={styles.semDados}>
              {busca || filtroResultado !== 'todos' || filtroStatus !== 'todos' 
                ? '🔍 Nenhuma análise encontrada' 
                : '📊 Nenhuma análise cadastrada'
              }
            </Text>
            {(busca || filtroResultado !== 'todos' || filtroStatus !== 'todos') && (
              <TouchableOpacity 
                style={styles.limparFiltros}
                onPress={() => {
                  setBusca('');
                  setFiltroResultado('todos');
                  setFiltroStatus('todos');
                }}
              >
                <Text style={styles.limparFiltrosTexto}>Limpar filtros</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Modal de Filtros */}
        <Modal
          visible={mostrarFiltros}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitulo}>Filtros de Análises</Text>
              
              <Text style={styles.filtroLabel}>Resultado:</Text>
              <ScrollView style={styles.filtroLista}>
                <TouchableOpacity 
                  style={[
                    styles.filtroItem,
                    filtroResultado === 'todos' && styles.filtroItemAtivo
                  ]}
                  onPress={() => setFiltroResultado('todos')}
                >
                  <Text style={styles.filtroItemTexto}>Todos os resultados</Text>
                </TouchableOpacity>
                
                {resultadosUnicos.map(resultado => (
                  <TouchableOpacity 
                    key={resultado}
                    style={[
                      styles.filtroItem,
                      filtroResultado === resultado && styles.filtroItemAtivo
                    ]}
                    onPress={() => setFiltroResultado(resultado)}
                  >
                    <Text style={styles.filtroItemTexto}>{resultado}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.filtroLabel}>Status:</Text>
              <ScrollView style={styles.filtroLista}>
                <TouchableOpacity 
                  style={[
                    styles.filtroItem,
                    filtroStatus === 'todos' && styles.filtroItemAtivo
                  ]}
                  onPress={() => setFiltroStatus('todos')}
                >
                  <Text style={styles.filtroItemTexto}>Todos os status</Text>
                </TouchableOpacity>
                
                {statusUnicos.map(status => (
                  <TouchableOpacity 
                    key={status}
                    style={[
                      styles.filtroItem,
                      filtroStatus === status && styles.filtroItemAtivo
                    ]}
                    onPress={() => setFiltroStatus(status)}
                  >
                    <Text style={styles.filtroItemTexto}>
                      {status === 'pendente_aprovacao' ? 'Pendente' : 
                       status === 'ativa' ? 'Ativa' : 
                       status === 'rejeitada' ? 'Rejeitada' : status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <View style={styles.modalAcoes}>
                <TouchableOpacity 
                  style={styles.modalBotao}
                  onPress={() => setMostrarFiltros(false)}
                >
                  <Text style={styles.modalBotaoTexto}>Aplicar Filtros</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2685BF',
    textAlign: 'center',
  },
  barraBuscaContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  buscaInputContainer: {
    flex: 1,
    position: 'relative',
  },
  buscaInput: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  limparBusca: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: '#ccc',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  limparBuscaTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoFiltros: {
    backgroundColor: '#2685BF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minWidth: 50,
  },
  botaoFiltrosTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  filtroAtivo: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  ordenacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  ordenacaoTitulo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  ordenacaoBotao: {
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ordenacaoBotaoAtivo: {
    backgroundColor: '#2685BF',
  },
  ordenacaoBotaoTexto: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  // Carousel e Cards
  carouselContainer: {
    flex: 1,
  },
  carouselContent: {
    paddingHorizontal: CARD_MARGIN,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pocoNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 70,
    alignItems: 'center',
  },
  statusTexto: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    lineHeight: 18,
  },
  parametrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  parametro: {
    alignItems: 'center',
    flex: 1,
  },
  parametroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  parametroValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  cardAcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  botaoDetalhes: {
    backgroundColor: '#17A2B8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  botaoAprovar: {
    backgroundColor: '#28A745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  botaoRejeitar: {
    backgroundColor: '#FFC107',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  botaoDeletar: {
    backgroundColor: '#DC3545',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  botaoTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Paginação
  paginacaoContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  paginacaoTexto: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  paginacaoPontos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  pontoAtivo: {
    backgroundColor: '#2685BF',
    width: 16,
  },
  // Estados vazios
  semDadosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  semDados: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  limparFiltros: {
    backgroundColor: '#2685BF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  limparFiltrosTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2685BF',
  },
  filtroLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filtroLista: {
    maxHeight: 150,
    marginBottom: 16,
  },
  filtroItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filtroItemAtivo: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#2685BF',
  },
  filtroItemTexto: {
    fontSize: 14,
    color: '#333',
  },
  modalAcoes: {
    marginTop: 20,
  },
  modalBotao: {
    backgroundColor: '#2685BF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBotaoTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TabelaAnalises;