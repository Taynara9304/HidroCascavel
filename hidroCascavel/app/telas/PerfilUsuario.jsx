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
  Alert
} from "react-native";
import ondaTopo from "../assets/ondaTopo.png";
import Input from "../componentes/Input";
import LocationPicker from "../componentes/LocationPicker";
import { useAuth } from "../contexts/authContext";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import Toast from 'react-native-toast-message';

const PerfilUsuario = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const contentWidth = width < 800 ? width : width * 0.6;
    const { user, buscarDadosUsuario } = useAuth();

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    
    // Estados para os dados do usuário
    const [dadosUsuario, setDadosUsuario] = useState({
        email: "",
        nome: "",
        sobrenome: "",
        telefone: "",
        coordenadas: null,
        endereco: {
            rua: "",
            numero: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
            complemento: "",
            referencia: ""
        }
    });

    // Estados separados para edição
    const [email, setEmail] = useState("");
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [coordenadas, setCoordenadas] = useState(null);
    const [endereco, setEndereco] = useState({
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        complemento: "",
        referencia: ""
    });

    const [errors, setErrors] = useState({});

    // Carregar dados do usuário
    const carregarDadosUsuario = async () => {
        if (!user?.uid) return;
        
        setLoading(true);
        try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setDadosUsuario(userData);
                
                // Preencher estados de edição
                setEmail(userData.email || "");
                setNome(userData.nome || "");
                setSobrenome(userData.sobrenome || "");
                setTelefone(userData.telefone || "");
                setCoordenadas(userData.coordenadas || null);
                setEndereco(userData.endereco || {
                    rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "", complemento: "", referencia: ""
                });
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível carregar os dados do usuário.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDadosUsuario();
    }, [user]);

    const handleLocationSelect = (coordenadasSelecionadas) => {
        setCoordenadas(coordenadasSelecionadas);
        if (errors.coordenadas) {
            setErrors(prev => ({ ...prev, coordenadas: '' }));
        }
    };

    const handleAddressSelect = (enderecoSelecionado) => {
        setEndereco(prev => ({
            ...prev,
            rua: enderecoSelecionado.rua || prev.rua,
            bairro: enderecoSelecionado.bairro || prev.bairro,
            cidade: enderecoSelecionado.cidade || prev.cidade,
            estado: enderecoSelecionado.estado || prev.estado,
            cep: enderecoSelecionado.cep || prev.cep
        }));
    };

    const validateFields = () => {
        const newErrors = {};

        if (!email) newErrors.email = 'E-mail é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';

        if (!nome) newErrors.nome = 'Nome é obrigatório';
        if (!sobrenome) newErrors.sobrenome = 'Sobrenome é obrigatório';
        if (!telefone) newErrors.telefone = 'Telefone é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSalvarEdicao = async () => {
        if (!validateFields()) {
            Toast.show({
                type: 'error',
                text1: 'Atenção',
                text2: 'Por favor, corrija os erros no formulário.'
            });
            return;
        }

        setUpdating(true);

        try {
            const userDocRef = doc(db, 'users', user.uid);
            
            // Criar objeto apenas com os campos que foram alterados
            const camposAtualizados = {};
            
            if (email !== dadosUsuario.email) camposAtualizados.email = email;
            if (nome !== dadosUsuario.nome) camposAtualizados.nome = nome;
            if (sobrenome !== dadosUsuario.sobrenome) camposAtualizados.sobrenome = sobrenome;
            if (telefone !== dadosUsuario.telefone) camposAtualizados.telefone = telefone;
            if (JSON.stringify(coordenadas) !== JSON.stringify(dadosUsuario.coordenadas)) {
                camposAtualizados.coordenadas = coordenadas;
            }
            
            // Verificar se algum campo do endereço foi alterado
            const enderecoAlterado = {};
            Object.keys(endereco).forEach(key => {
                if (endereco[key] !== (dadosUsuario.endereco?.[key] || '')) {
                    enderecoAlterado[key] = endereco[key];
                }
            });
            
            if (Object.keys(enderecoAlterado).length > 0) {
                camposAtualizados.endereco = {
                    ...dadosUsuario.endereco,
                    ...enderecoAlterado
                };
            }

            // Atualizar apenas se houver campos modificados
            if (Object.keys(camposAtualizados).length > 0) {
                await updateDoc(userDocRef, camposAtualizados);
                
                // Atualizar dados locais
                const dadosAtualizados = { ...dadosUsuario, ...camposAtualizados };
                setDadosUsuario(dadosAtualizados);
                
                Toast.show({
                    type: 'success',
                    text1: 'Sucesso',
                    text2: 'Dados atualizados com sucesso!'
                });
                
                setEditMode(false);
            } else {
                Toast.show({
                    type: 'info',
                    text1: 'Info',
                    text2: 'Nenhuma alteração foi feita.'
                });
            }

        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível atualizar os dados. Tente novamente.'
            });
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelarEdicao = () => {
        // Reverter para os dados originais
        setEmail(dadosUsuario.email || "");
        setNome(dadosUsuario.nome || "");
        setSobrenome(dadosUsuario.sobrenome || "");
        setTelefone(dadosUsuario.telefone || "");
        setCoordenadas(dadosUsuario.coordenadas || null);
        setEndereco(dadosUsuario.endereco || {
            rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "", complemento: "", referencia: ""
        });
        setErrors({});
        setEditMode(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2685BF" />
                <Text style={styles.loadingText}>Carregando dados...</Text>
            </View>
        );
    }

    return(
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <View style={[styles.content, { width: contentWidth }]}>
                    {/* Header com botão de editar */}
                    <View style={styles.header}>
                        <Text style={styles.tituloPrincipal}>Dados Pessoais</Text>
                        <TouchableOpacity 
                            style={styles.botaoEditar}
                            onPress={() => setEditMode(!editMode)}
                        >
                            <Text style={styles.textoBotaoEditar}>
                                {editMode ? 'Cancelar' : 'Editar'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.containerDivisao}>
                        <Text style={styles.titulo}>Informações básicas</Text>
                        <View style={styles.linhaAzul} />
                    </View>

                    <View style={styles.inputContainer}>
                        <Input
                            label="E-mail"
                            value={editMode ? email : dadosUsuario.email}
                            onChangeText={setEmail}
                            placeholder="Digite seu e-mail"
                            keyboardType="email-address"
                            style={styles.input}
                            editable={editMode}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Input
                            label="Nome"
                            value={editMode ? nome : dadosUsuario.nome}
                            onChangeText={setNome}
                            placeholder="Digite seu nome"
                            style={styles.input}
                            editable={editMode}
                        />
                        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Input
                            label="Sobrenome"
                            value={editMode ? sobrenome : dadosUsuario.sobrenome}
                            onChangeText={setSobrenome}
                            placeholder="Digite seu sobrenome"
                            style={styles.input}
                            editable={editMode}
                        />
                        {errors.sobrenome && <Text style={styles.errorText}>{errors.sobrenome}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Input
                            label="Telefone"
                            value={editMode ? telefone : dadosUsuario.telefone}
                            onChangeText={setTelefone}
                            placeholder="Digite seu telefone"
                            keyboardType="phone-pad"
                            style={styles.input}
                            editable={editMode}
                        />
                        {errors.telefone && <Text style={styles.errorText}>{errors.telefone}</Text>}
                    </View>

                    <View style={styles.containerDivisao}>
                        <Text style={styles.titulo}>Endereço</Text>
                        <View style={styles.linhaAzul} />
                    </View>

                    {editMode && (
                        <View style={styles.mapContainer}>
                            <LocationPicker 
                                onLocationSelect={handleLocationSelect}
                                onAddressSelect={handleAddressSelect}
                                initialLocation={dadosUsuario.coordenadas}
                            />
                            {errors.coordenadas && <Text style={styles.errorText}>{errors.coordenadas}</Text>}
                        </View>
                    )}

                    <View style={styles.containerEndereco}>
                        <Input
                            label="Rua"
                            value={editMode ? endereco.rua : dadosUsuario.endereco?.rua}
                            onChangeText={(text) => setEndereco({...endereco, rua: text})}
                            placeholder="Nome da rua"
                            style={styles.inputEndereco}
                            editable={editMode}
                        />

                        <Input
                            label="Número"
                            value={editMode ? endereco.numero : dadosUsuario.endereco?.numero}
                            onChangeText={(text) => setEndereco({...endereco, numero: text})}
                            placeholder="Número"
                            keyboardType="numeric"
                            style={styles.inputEndereco}
                            editable={editMode}
                        />

                        <Input
                            label="Bairro"
                            value={editMode ? endereco.bairro : dadosUsuario.endereco?.bairro}
                            onChangeText={(text) => setEndereco({...endereco, bairro: text})}
                            placeholder="Bairro"
                            style={styles.inputEndereco}
                            editable={editMode}
                        />

                        <Input
                            label="Cidade"
                            value={editMode ? endereco.cidade : dadosUsuario.endereco?.cidade}
                            onChangeText={(text) => setEndereco({...endereco, cidade: text})}
                            placeholder="Cidade"
                            style={styles.inputEndereco}
                            editable={editMode}
                        />

                        <Input
                            label="Estado"
                            value={editMode ? endereco.estado : dadosUsuario.endereco?.estado}
                            onChangeText={(text) => setEndereco({...endereco, estado: text})}
                            placeholder="Estado"
                            style={styles.inputEndereco}
                            editable={editMode}
                        />

                        <Input
                            label="CEP"
                            value={editMode ? endereco.cep : dadosUsuario.endereco?.cep}
                            onChangeText={(text) => setEndereco({...endereco, cep: text})}
                            placeholder="Digite seu CEP"
                            keyboardType="numeric"
                            style={styles.inputEndereco}
                            editable={editMode}
                        />

                        <Input
                            label="Complemento"
                            value={editMode ? endereco.complemento : dadosUsuario.endereco?.complemento}
                            onChangeText={(text) => setEndereco({...endereco, complemento: text})}
                            placeholder="Complemento (opcional)"
                            style={styles.inputEndereco}
                            editable={editMode}
                        />

                        <Input
                            label="Referência"
                            value={editMode ? endereco.referencia : dadosUsuario.endereco?.referencia}
                            onChangeText={(text) => setEndereco({...endereco, referencia: text})}
                            placeholder="Ponto de referência"
                            style={styles.inputEndereco}
                            editable={editMode}
                        />
                    </View>

                    {editMode && (
                        <View style={styles.botoesContainer}>
                            <TouchableOpacity 
                                style={[styles.botao, styles.botaoCancelar]}
                                onPress={handleCancelarEdicao}
                                disabled={updating}
                            >
                                <Text style={styles.textoBotao}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.botao, updating && styles.botaoDisabled]}
                                onPress={handleSalvarEdicao}
                                disabled={updating}
                            >
                                {updating ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.textoBotao}>Salvar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    content: {
        alignItems: "center",
        paddingBottom: 30,
    },
    tituloPrincipal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2685BF',
    },
    botaoEditar: {
        backgroundColor: '#2685BF',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 6,
    },
    textoBotaoEditar: {
        color: '#fff',
        fontWeight: 'bold',
    },
    inputContainer: {
        width: Platform.OS === 'web' ? "80%" : "90%",
        marginBottom: 15,
    },
    input: {
        width: '100%',
    },
    botao: {
        backgroundColor: "#2685BF",
        paddingVertical: 12,
        borderRadius: 8,
        width: Platform.OS === 'web' ? "40%" : "45%",
        alignItems: "center",
    },
    botaoCancelar: {
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
    botoesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: Platform.OS === 'web' ? "80%" : "90%",
        marginTop: 20,
    },
    containerEndereco: {
        width: Platform.OS === 'web' ? '80%' : '90%',
        marginTop: 10,
    },
    inputEndereco: {
        width: '100%',
        marginBottom: 10,
    },
    containerDivisao: {
        display: 'flex',
        width: Platform.OS === 'web' ? '80%' : '90%',
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    titulo: {
        fontSize: 14,
        color: '#2196F3',
        width: Platform.OS === 'web' ? '20%' : '30%',
        minWidth: 100,
    },
    linhaAzul: {
        height: 2,
        backgroundColor: '#2196F3',
        flex: 1,
    },
    mapContainer: {
        width: Platform.OS === 'web' ? '80%' : '90%',
        marginBottom: 15,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 10,
        color: '#2685BF',
    },
});

export default PerfilUsuario;