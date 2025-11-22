// componentes/AddPocosAdmin.js
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Dimensions,
  TextInput,
  ActivityIndicator
} from "react-native";
import InputMapa from './InputMapa';
import SelecaoBuscaSeguro from './SelecaoBusca';
import { useAuth } from '../contexts/authContext';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

const AddPocosAdmin = ({ onAdicionarPoco }) => {
    const { user, userData } = useAuth();
    const [localizacao, setLocalizacao] = useState(null);
    const [observacoes, setObservacoes] = useState('');
    const [proprietario, setProprietario] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [carregandoUsuarios, setCarregandoUsuarios] = useState(true);

    // Buscar TODOS os usuários (admin pode ver todos)
    useEffect(() => {
        console.log('📡 AddPocosAdmin: Buscando TODOS os usuários');
        
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, orderBy('nome'));
        
        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const usuariosData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setUsuarios(usuariosData);
                setCarregandoUsuarios(false);
                console.log(`${usuariosData.length} usuários carregados`);
            },
            (error) => {
                console.error('Erro ao carregar usuários:', error);
                Alert.alert('Erro', 'Não foi possível carregar a lista de usuários');
                setCarregandoUsuarios(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleCadastrar = async () => {
        console.log('AddPocosAdmin: Iniciando cadastro direto...');

        if (!localizacao) {
            Alert.alert('Erro', 'Por favor, selecione a localização do poço no mapa.');
            return;
        }

        if (!localizacao.latitude || !localizacao.longitude) {
            Alert.alert('Erro', 'Localização inválida. Selecione novamente no mapa.');
            return;
        }

        if (!proprietario) {
            Alert.alert('Erro', 'Por favor, selecione o proprietário do poço.');
            return;
        }

        try {
            const wellData = {
                localizacao: {
                    latitude: localizacao.latitude,
                    longitude: localizacao.longitude
                },
                nomeProprietario: proprietario.nome,
                observacoes: observacoes.trim(),
                userId: proprietario.id, // ID do proprietário selecionado
                tipoCadastro: 'direto_admin',
                status: 'ativo',
                criadoPor: user.uid,
                dataCriacao: new Date().toISOString()
            };

            console.log('AddPocosAdmin: Dados do poço:', wellData);
            await onAdicionarPoco(wellData);
            
            // Limpar formulário
            setLocalizacao(null);
            setProprietario(null);
            setObservacoes('');
            
            Alert.alert('Sucesso', 'Poço cadastrado com sucesso!');
            
        } catch (error) {
            console.error('AddPocosAdmin: Erro no cadastro:', error);
            Alert.alert('Erro', `Não foi possível cadastrar o poço: ${error.message}`);
        }
    };

    const opcoesUsuarios = usuarios.map(usuario => ({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
        ...usuario
    }));

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}>Cadastrar Poço</Text>
            <Text style={styles.subtitle}>Administrador</Text>

            <View style={styles.formContainer}>

                {/* Input de Localização com Mapa */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Localização do Poço *</Text>
                    <InputMapa
                        value={localizacao}
                        onChange={setLocalizacao}
                        placeholder="Clique para selecionar a localização no mapa"
                    />
                </View>

                {/* Seleção de Proprietário */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Proprietário *</Text>
                    {carregandoUsuarios ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color="#2685BF" />
                            <Text style={styles.loadingText}>Carregando usuários...</Text>
                        </View>
                    ) : (
                        <SelecaoBuscaSeguro
                            value={proprietario}
                            onSelect={setProprietario}
                            options={opcoesUsuarios}
                            placeholder="Selecione o proprietário do poço"
                            searchKeys={['nome', 'email']}
                            displayKey="nome"
                        />
                    )}
                </View>

                {/* Input de Observações */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Observações</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={observacoes}
                        onChangeText={setObservacoes}
                        placeholder="Observações sobre o poço (opcional)"
                        multiline={true}
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>

                {/* Botão de Cadastrar */}
                <TouchableOpacity
                    style={[
                        styles.cadastrarButton,
                        (!localizacao || !proprietario) && styles.buttonDisabled
                    ]}
                    onPress={handleCadastrar}
                    disabled={!localizacao || !proprietario}
                >
                    <Text style={styles.cadastrarButtonText}>CADASTRAR POÇO</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        color: '#2685BF',
        paddingTop: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
        fontStyle: 'italic',
    },
    formContainer: {
        padding: 16,
    },
    inputGroup: {
        gap: 8,
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        minHeight: 50,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
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
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2685BF',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 12,
        color: '#333',
        lineHeight: 18,
    },
    cadastrarButton: {
        backgroundColor: '#2685BF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        minHeight: 50,
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    cadastrarButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddPocosAdmin;