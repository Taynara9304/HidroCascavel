import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Platform,
  TextInput,
  Modal,
  FlatList
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Calendario from "../componentes/CalendarioRelatorio";
import ondaTopo from "../assets/ondaTopo.png";
import { useAuth } from "../contexts/authContext";
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import Toast from 'react-native-toast-message';

const GerenciarRelatorios = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const contentWidth = width < 800 ? width : width * 0.8;
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
    
    // Estados para modais de seleção
    const [modalTipoRelatorio, setModalTipoRelatorio] = useState(false);
    const [modalOrdenacao, setModalOrdenacao] = useState(false);
    const [modalCalendarioInicio, setModalCalendarioInicio] = useState(false);
    const [modalCalendarioFim, setModalCalendarioFim] = useState(false);
    
    // Estados para os filtros
    const [filtros, setFiltros] = useState({
        tipoRelatorio: "analises",
        periodo: "personalizado",
        dataInicio: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        dataFim: new Date(),
        parametros: [],
        status: "todos",
        ordenacao: "data_desc"
    });

    // Estados para controles de UI
    const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);

    // Função para voltar para a home
    const voltarParaHome = () => {
        navigation.navigate('HomeAdm'); // Altere 'Home' para o nome da sua tela inicial
    };

    // Lista de parâmetros disponíveis
    const parametrosDisponiveis = [
        { id: 'ph', nome: 'pH', categoria: 'quimico' },
        { id: 'turbidez', nome: 'Turbidez', categoria: 'fisico' },
        { id: 'cloro', nome: 'Cloro Residual', categoria: 'quimico' },
        { id: 'condutividade', nome: 'Condutividade', categoria: 'fisico' },
        { id: 'temperatura', nome: 'Temperatura', categoria: 'fisico' },
        { id: 'oxigenio', nome: 'Oxigênio Dissolvido', categoria: 'quimico' },
        { id: 'coliformes', nome: 'Coliformes Totais', categoria: 'biologico' },
        { id: 'solidos', nome: 'Sólidos Totais', categoria: 'fisico' },
        { id: 'alcalinidade', nome: 'Alcalinidade', categoria: 'quimico' },
        { id: 'dureza', nome: 'Dureza', categoria: 'quimico' }
    ];

    // Opções de período pré-definido
    const opcoesPeriodo = [
        { value: '7dias', label: 'Últimos 7 dias' },
        { value: '15dias', label: 'Últimos 15 dias' },
        { value: '30dias', label: 'Últimos 30 dias' },
        { value: '3meses', label: 'Últimos 3 meses' },
        { value: '6meses', label: 'Últimos 6 meses' },
        { value: 'personalizado', label: 'Período Personalizado' }
    ];

    // Tipos de relatório
    const tiposRelatorio = [
        { value: 'analises', label: 'Relatório de Análises' },
        { value: 'tendencias', label: 'Análise de Tendências' },
        { value: 'conformidade', label: 'Relatório de Conformidade' },
        { value: 'comparativo', label: 'Relatório Comparativo' },
        { value: 'customizado', label: 'Relatório Customizado' }
    ];

    // Opções de ordenação
    const opcoesOrdenacao = [
        { value: 'data_desc', label: 'Data (Mais Recente)' },
        { value: 'data_asc', label: 'Data (Mais Antiga)' },
        { value: 'parametro_asc', label: 'Parâmetro (A-Z)' },
        { value: 'parametro_desc', label: 'Parâmetro (Z-A)' }
    ];

    // Função para selecionar tipo de relatório
    const selecionarTipoRelatorio = (value) => {
        setFiltros(prev => ({ ...prev, tipoRelatorio: value }));
        setModalTipoRelatorio(false);
    };

    // Função para selecionar ordenação
    const selecionarOrdenacao = (value) => {
        setFiltros(prev => ({ ...prev, ordenacao: value }));
        setModalOrdenacao(false);
    };

    // Função para selecionar data de início
    const selecionarDataInicio = (data) => {
        setFiltros(prev => ({ ...prev, dataInicio: data }));
        setModalCalendarioInicio(false);
    };

    // Função para selecionar data de fim
    const selecionarDataFim = (data) => {
        setFiltros(prev => ({ ...prev, dataFim: data }));
        setModalCalendarioFim(false);
    };

    // Função para aplicar período pré-definido
    const aplicarPeriodoPredefinido = (periodo) => {
        const hoje = new Date();
        let dataInicio = new Date();

        switch (periodo) {
            case '7dias':
                dataInicio.setDate(hoje.getDate() - 7);
                break;
            case '15dias':
                dataInicio.setDate(hoje.getDate() - 15);
                break;
            case '30dias':
                dataInicio.setDate(hoje.getDate() - 30);
                break;
            case '3meses':
                dataInicio.setMonth(hoje.getMonth() - 3);
                break;
            case '6meses':
                dataInicio.setMonth(hoje.getMonth() - 6);
                break;
            default:
                return;
        }

        setFiltros(prev => ({
            ...prev,
            periodo: periodo,
            dataInicio: dataInicio,
            dataFim: hoje
        }));
    };

    // Função para alternar parâmetro selecionado
    const toggleParametro = (parametroId) => {
        setFiltros(prev => {
            const parametros = [...prev.parametros];
            const index = parametros.indexOf(parametroId);
            
            if (index > -1) {
                parametros.splice(index, 1);
            } else {
                parametros.push(parametroId);
            }
            
            return { ...prev, parametros };
        });
    };

    // Função para selecionar/desselecionar todos os parâmetros de uma categoria
    const toggleCategoria = (categoria) => {
        const parametrosCategoria = parametrosDisponiveis
            .filter(p => p.categoria === categoria)
            .map(p => p.id);

        setFiltros(prev => {
            const todosSelecionados = parametrosCategoria.every(param => 
                prev.parametros.includes(param)
            );

            const novosParametros = todosSelecionados 
                ? prev.parametros.filter(param => !parametrosCategoria.includes(param))
                : [...new Set([...prev.parametros, ...parametrosCategoria])];

            return { ...prev, parametros: novosParametros };
        });
    };

    // Função para validar filtros antes de gerar relatório
    const validarFiltros = () => {
        if (filtros.dataInicio > filtros.dataFim) {
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Data de início não pode ser maior que data de fim'
            });
            return false;
        }

        if (filtros.parametros.length === 0 && filtros.tipoRelatorio !== 'tendencias') {
            Toast.show({
                type: 'error',
                text1: 'Atenção',
                text2: 'Selecione pelo menos um parâmetro para o relatório'
            });
            return false;
        }

        return true;
    };

    // Função para gerar relatório
    const gerarRelatorio = async () => {
        if (!validarFiltros()) return;

        setGerandoRelatorio(true);

        try {
            // Simular geração de relatório
            await new Promise(resolve => setTimeout(resolve, 2000));

            const relatorioData = {
                tipo: filtros.tipoRelatorio,
                periodo: {
                    inicio: filtros.dataInicio,
                    fim: filtros.dataFim
                },
                parametros: filtros.parametros,
                usuario: user.uid,
                dataGeracao: new Date()
            };

            console.log('Relatório gerado:', relatorioData);

            Toast.show({
                type: 'success',
                text1: 'Relatório Gerado',
                text2: 'Seu relatório foi gerado com sucesso!'
            });

        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível gerar o relatório'
            });
        } finally {
            setGerandoRelatorio(false);
        }
    };

    // Função para limpar todos os filtros
    const limparFiltros = () => {
        setFiltros({
            tipoRelatorio: "analises",
            periodo: "personalizado",
            dataInicio: new Date(new Date().setMonth(new Date().getMonth() - 1)),
            dataFim: new Date(),
            parametros: [],
            status: "todos",
            ordenacao: "data_desc"
        });
    };

    // Formatar data para exibição
    const formatarData = (data) => {
        return data.toLocaleDateString('pt-BR');
    };

    // Obter label do tipo de relatório selecionado
    const getTipoRelatorioLabel = () => {
        return tiposRelatorio.find(t => t.value === filtros.tipoRelatorio)?.label || 'Selecione';
    };

    // Obter label da ordenação selecionada
    const getOrdenacaoLabel = () => {
        return opcoesOrdenacao.find(o => o.value === filtros.ordenacao)?.label || 'Selecione';
    };

    // Componente CalendarioModal
    const CalendarioModal = ({ onDateSelect, onClose, selectedDate }) => {
        const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
        
        const handleDayPress = (date) => {
            console.log('Data selecionada no modal:', date);
            onDateSelect(date);
        };

        const handleMonthChange = (newDate) => {
            setCurrentDate(newDate);
        };

        return (
            <View style={styles.calendarioModalContent}>
                <View style={styles.calendarioHeader}>
                    <Text style={styles.calendarioTitle}>Selecionar Data</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>
                <Calendario 
                    currentDate={currentDate}
                    onDateSelect={handleDayPress}
                    showHeader={true}
                    selectedDate={selectedDate}
                />
            </View>
        );
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>

                <View style={[styles.content, { width: contentWidth }]}>
                    {/* Card Principal de Filtros */}
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Configurar Relatório</Text>
                        
                        {/* Tipo de Relatório */}
                        <View style={styles.filtroGroup}>
                            <Text style={styles.filtroLabel}>Tipo de Relatório</Text>
                            <TouchableOpacity 
                                style={styles.selectButton}
                                onPress={() => setModalTipoRelatorio(true)}
                            >
                                <Text style={styles.selectButtonText}>
                                    {getTipoRelatorioLabel()}
                                </Text>
                                <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Período */}
                        <View style={styles.filtroGroup}>
                            <Text style={styles.filtroLabel}>Período</Text>
                            
                            {/* Períodos Pré-definidos */}
                            <View style={styles.periodoButtons}>
                                {opcoesPeriodo.map(opcao => (
                                    <TouchableOpacity
                                        key={opcao.value}
                                        style={[
                                            styles.periodoButton,
                                            filtros.periodo === opcao.value && styles.periodoButtonActive
                                        ]}
                                        onPress={() => aplicarPeriodoPredefinido(opcao.value)}
                                    >
                                        <Text style={[
                                            styles.periodoButtonText,
                                            filtros.periodo === opcao.value && styles.periodoButtonTextActive
                                        ]}>
                                            {opcao.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Datas Personalizadas */}
                            {filtros.periodo === 'personalizado' && (
                                <View style={styles.datesContainer}>
                                    <View style={styles.dateInputContainer}>
                                        <Text style={styles.dateLabel}>Data Início</Text>
                                        <TouchableOpacity 
                                            style={styles.dateInput}
                                            onPress={() => setModalCalendarioInicio(true)}
                                        >
                                            <Text>{formatarData(filtros.dataInicio)}</Text>
                                            <MaterialIcons name="calendar-today" size={20} color="#666" />
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.dateInputContainer}>
                                        <Text style={styles.dateLabel}>Data Fim</Text>
                                        <TouchableOpacity 
                                            style={styles.dateInput}
                                            onPress={() => setModalCalendarioFim(true)}
                                        >
                                            <Text>{formatarData(filtros.dataFim)}</Text>
                                            <MaterialIcons name="calendar-today" size={20} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Botão para expandir filtros avançados */}
                        <TouchableOpacity 
                            style={styles.expandButton}
                            onPress={() => setFiltrosExpandidos(!filtrosExpandidos)}
                        >
                            <Text style={styles.expandButtonText}>
                                {filtrosExpandidos ? 'Ocultar' : 'Mostrar'} Filtros Avançados
                            </Text>
                            <MaterialIcons 
                                name={filtrosExpandidos ? "expand-less" : "expand-more"} 
                                size={20} 
                                color="#2685BF" 
                            />
                        </TouchableOpacity>

                        {/* Filtros Avançados */}
                        {filtrosExpandidos && (
                            <View style={styles.filtrosAvancados}>
                                {/* Parâmetros */}
                                <View style={styles.filtroGroup}>
                                    <Text style={styles.filtroLabel}>Parâmetros de Análise</Text>
                                    
                                    {/* Categorias */}
                                    {['quimico', 'fisico', 'biologico'].map(categoria => (
                                        <View key={categoria} style={styles.categoriaGroup}>
                                            <TouchableOpacity 
                                                style={styles.categoriaHeader}
                                                onPress={() => toggleCategoria(categoria)}
                                            >
                                                <Text style={styles.categoriaTitle}>
                                                    {categoria === 'quimico' ? 'Parâmetros Químicos' : 
                                                     categoria === 'fisico' ? 'Parâmetros Físicos' : 
                                                     'Parâmetros Biológicos'}
                                                </Text>
                                                <MaterialIcons 
                                                    name="check-box" 
                                                    size={20} 
                                                    color="#2685BF" 
                                                />
                                            </TouchableOpacity>
                                            
                                            <View style={styles.parametrosGrid}>
                                                {parametrosDisponiveis
                                                    .filter(p => p.categoria === categoria)
                                                    .map(parametro => (
                                                        <TouchableOpacity
                                                            key={parametro.id}
                                                            style={[
                                                                styles.parametroButton,
                                                                filtros.parametros.includes(parametro.id) && styles.parametroButtonActive
                                                            ]}
                                                            onPress={() => toggleParametro(parametro.id)}
                                                        >
                                                            <Text style={[
                                                                styles.parametroButtonText,
                                                                filtros.parametros.includes(parametro.id) && styles.parametroButtonTextActive
                                                            ]}>
                                                                {parametro.nome}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                            </View>
                                        </View>
                                    ))}
                                </View>

                                {/* Ordenação */}
                                <View style={styles.filtroGroup}>
                                    <Text style={styles.filtroLabel}>Ordenar por</Text>
                                    <TouchableOpacity 
                                        style={styles.selectButton}
                                        onPress={() => setModalOrdenacao(true)}
                                    >
                                        <Text style={styles.selectButtonText}>
                                            {getOrdenacaoLabel()}
                                        </Text>
                                        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Botões de Ação */}
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity 
                                style={[styles.botao, styles.botaoSecundario]}
                                onPress={limparFiltros}
                                disabled={gerandoRelatorio}
                            >
                                <Text style={styles.textoBotaoSecundario}>Limpar Filtros</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.botao, styles.botaoPrimario, gerandoRelatorio && styles.botaoDisabled]}
                                onPress={gerarRelatorio}
                                disabled={gerandoRelatorio}
                            >
                                {gerandoRelatorio ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <>
                                        <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
                                        <Text style={styles.textoBotao}>Gerar Relatório</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Resumo do Relatório */}
                    <View style={styles.resumoCard}>
                        <Text style={styles.resumoTitle}>Resumo do Relatório</Text>
                        <View style={styles.resumoContent}>
                            <View style={styles.resumoItem}>
                                <Text style={styles.resumoLabel}>Tipo:</Text>
                                <Text style={styles.resumoValue}>
                                    {getTipoRelatorioLabel()}
                                </Text>
                            </View>
                            <View style={styles.resumoItem}>
                                <Text style={styles.resumoLabel}>Período:</Text>
                                <Text style={styles.resumoValue}>
                                    {formatarData(filtros.dataInicio)} - {formatarData(filtros.dataFim)}
                                </Text>
                            </View>
                            <View style={styles.resumoItem}>
                                <Text style={styles.resumoLabel}>Parâmetros:</Text>
                                <Text style={styles.resumoValue}>
                                    {filtros.parametros.length} selecionados
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Modal para Tipo de Relatório */}
            <Modal
                visible={modalTipoRelatorio}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalTipoRelatorio(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Selecionar Tipo de Relatório</Text>
                        <FlatList
                            data={tiposRelatorio}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        filtros.tipoRelatorio === item.value && styles.modalItemSelected
                                    ]}
                                    onPress={() => selecionarTipoRelatorio(item.value)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        filtros.tipoRelatorio === item.value && styles.modalItemTextSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setModalTipoRelatorio(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal para Ordenação */}
            <Modal
                visible={modalOrdenacao}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalOrdenacao(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ordenar por</Text>
                        <FlatList
                            data={opcoesOrdenacao}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.modalItem,
                                        filtros.ordenacao === item.value && styles.modalItemSelected
                                    ]}
                                    onPress={() => selecionarOrdenacao(item.value)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        filtros.ordenacao === item.value && styles.modalItemTextSelected
                                    ]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setModalOrdenacao(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal para Calendário - Data Início */}
            <Modal
                visible={modalCalendarioInicio}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalCalendarioInicio(false)}
            >
                <View style={styles.modalOverlay}>
                    <CalendarioModal 
                        onDateSelect={selecionarDataInicio}
                        onClose={() => setModalCalendarioInicio(false)}
                        selectedDate={filtros.dataInicio}
                    />
                </View>
            </Modal>

            {/* Modal para Calendário - Data Fim */}
            <Modal
                visible={modalCalendarioFim}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalCalendarioFim(false)}
            >
                <View style={styles.modalOverlay}>
                    <CalendarioModal 
                        onDateSelect={selecionarDataFim}
                        onClose={() => setModalCalendarioFim(false)}
                        selectedDate={filtros.dataFim}
                    />
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
    backButtonText: {
        color: '#2685BF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    topContainer: {
        position: "relative",
        alignItems: "center",
        marginBottom: 10,
    },
    image: {
        alignSelf: "center",
        marginTop: -35,
    },
    titleSobreImagem: {
        position: "absolute",
        top: "20%",
        left: "20%",
        transform: [{ translateX: -100 }, { translateY: -10 }],
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    content: {
        alignItems: "center",
        paddingBottom: 30,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2685BF',
        marginBottom: 20,
    },
    filtroGroup: {
        marginBottom: 20,
    },
    filtroLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    selectButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
    },
    selectButtonText: {
        fontSize: 16,
        color: '#333',
    },
    periodoButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 15,
    },
    periodoButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    periodoButtonActive: {
        backgroundColor: '#2685BF',
        borderColor: '#2685BF',
    },
    periodoButtonText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    periodoButtonTextActive: {
        color: '#fff',
    },
    datesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    dateInputContainer: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    dateInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#f0f7ff',
        borderRadius: 8,
        marginBottom: 15,
    },
    expandButtonText: {
        color: '#2685BF',
        fontWeight: '600',
        marginRight: 8,
    },
    filtrosAvancados: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    categoriaGroup: {
        marginBottom: 15,
    },
    categoriaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    categoriaTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    parametrosGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
    },
    parametroButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    parametroButtonActive: {
        backgroundColor: '#2685BF',
        borderColor: '#2685BF',
    },
    parametroButtonText: {
        fontSize: 12,
        color: '#666',
    },
    parametroButtonTextActive: {
        color: '#fff',
    },
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 15,
        marginTop: 20,
    },
    botao: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    botaoPrimario: {
        backgroundColor: "#2685BF",
    },
    botaoSecundario: {
        backgroundColor: "#6c757d",
    },
    botaoDisabled: {
        backgroundColor: "#99cde0",
    },
    textoBotao: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    textoBotaoSecundario: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    resumoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resumoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2685BF',
        marginBottom: 15,
    },
    resumoContent: {
        gap: 8,
    },
    resumoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resumoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    resumoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '80%',
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#2685BF',
    },
    modalItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemSelected: {
        backgroundColor: '#e6f3ff',
    },
    modalItemText: {
        fontSize: 16,
        color: '#333',
    },
    modalItemTextSelected: {
        color: '#2685BF',
        fontWeight: 'bold',
    },
    modalCloseButton: {
        marginTop: 15,
        padding: 12,
        backgroundColor: '#2685BF',
        borderRadius: 8,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    calendarioModalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    calendarioHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    calendarioTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2685BF',
    },
    closeButton: {
        padding: 5,
    },
});

export default GerenciarRelatorios;