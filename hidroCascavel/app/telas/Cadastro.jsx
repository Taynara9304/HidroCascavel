// components/Cadastro.jsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  ActivityIndicator,
  Platform
} from "react-native";
import ondaTopo from "../assets/ondaTopo.png";
import Input from "../componentes/Input";
import LocationPicker from "../componentes/LocationPicker";

const Cadastro = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const contentWidth = width < 800 ? width : width * 0.6;
    const isMobile = Platform.OS !== 'web';

    const [email, setEmail] = useState("");
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
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
    const [loading, setLoading] = useState(false);

    const handleLocationSelect = (coordenadas) => {
      setCoordenadas(coordenadas);
    };

    const handleAddressSelect = (enderecoSelecionado) => {
      // Atualiza apenas os campos que vieram do geocoding
      setEndereco(prev => ({
        ...prev,
        rua: enderecoSelecionado.rua || prev.rua,
        bairro: enderecoSelecionado.bairro || prev.bairro,
        cidade: enderecoSelecionado.cidade || prev.cidade,
        estado: enderecoSelecionado.estado || prev.estado,
        cep: enderecoSelecionado.cep || prev.cep
      }));
    };

    const handleCadastro = async () => {
      if (!coordenadas) {
        Alert.alert('Atenção', 'Por favor, selecione sua localização no mapa.');
        return;
      }

      if (senha !== confirmacao) {
        Alert.alert('Atenção', 'As senhas não coincidem.');
        return;
      }

      setLoading(true);

      try {
        const userData = {
          email,
          nome,
          sobrenome,
          telefone,
          senha,
          coordenadas,
          endereco: {
            ...endereco,
            numero: endereco.numero || '',
            complemento: endereco.complemento || '',
            referencia: endereco.referencia || ''
          }
        };
        
        console.log('Dados para cadastro:', userData);
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.navigate('Login');
      } catch (error) {
        Alert.alert('Erro', 'Ocorreu um erro durante o cadastro. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    return(
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <View style={[styles.topContainer, { width: contentWidth }]}>
                    <Image
                    source={ondaTopo}
                    style={[styles.image, { width: contentWidth }]}
                    resizeMode="contain"
                    />

                    <Text style={styles.titleSobreImagem}>Cadastre-se!</Text>
                </View>

                <View style={[styles.content, { width: contentWidth }]}>
                    <View style={styles.containerDivisao}>
                        <Text style={styles.titulo}>Dados pessoais</Text>
                        <View style={styles.linhaAzul} />
                    </View>

                    <Input
                        label="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Digite seu e-mail"
                        keyboardType="email-address"
                        style={styles.input}
                    />

                    <Input
                        label="Nome"
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite seu nome"
                        style={styles.input}
                    />

                    <Input
                        label="Sobrenome"
                        value={sobrenome}
                        onChangeText={setSobrenome}
                        placeholder="Digite seu sobrenome"
                        style={styles.input}
                    />

                    <Input
                        label="Telefone"
                        value={telefone}
                        onChangeText={setTelefone}
                        placeholder="Digite seu telefone"
                        keyboardType="phone-pad"
                        style={styles.input}
                    />

                    <Input
                        label="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="Digite sua senha"
                        secureTextEntry
                        style={styles.input}
                    />

                    <Input
                        label="Confimação"
                        value={confirmacao}
                        onChangeText={setConfirmacao}
                        placeholder="Confirme sua senha"
                        secureTextEntry
                        style={styles.input}
                    />

                    <View style={styles.containerDivisao}>
                        <Text style={styles.titulo}>Endereço</Text>
                        <View style={styles.linhaAzul} />
                    </View>

                    <View style={styles.mapContainer}>
                      <LocationPicker 
                        onLocationSelect={handleLocationSelect}
                        onAddressSelect={handleAddressSelect}
                      />
                    </View>

                    {/* CONTAINER DE INPUTS DE ENDEREÇO - AGORA VISÍVEL NO MOBILE */}
                    <View style={styles.containerEndereco}>
                        <Input
                            label="Rua"
                            value={endereco.rua}
                            onChangeText={(text) => setEndereco({...endereco, rua: text})}
                            placeholder="Nome da rua"
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Número"
                            value={endereco.numero}
                            onChangeText={(text) => setEndereco({...endereco, numero: text})}
                            placeholder="Número"
                            keyboardType="numeric"
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Bairro"
                            value={endereco.bairro}
                            onChangeText={(text) => setEndereco({...endereco, bairro: text})}
                            placeholder="Bairro"
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Cidade"
                            value={endereco.cidade}
                            onChangeText={(text) => setEndereco({...endereco, cidade: text})}
                            placeholder="Cidade"
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Estado"
                            value={endereco.estado}
                            onChangeText={(text) => setEndereco({...endereco, estado: text})}
                            placeholder="Estado"
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="CEP"
                            value={endereco.cep}
                            onChangeText={(text) => setEndereco({...endereco, cep: text})}
                            placeholder="Digite seu CEP"
                            keyboardType="numeric"
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Complemento"
                            value={endereco.complemento}
                            onChangeText={(text) => setEndereco({...endereco, complemento: text})}
                            placeholder="Complemento (opcional)"
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Referência"
                            value={endereco.referencia}
                            onChangeText={(text) => setEndereco({...endereco, referencia: text})}
                            placeholder="Ponto de referência"
                            style={styles.inputEndereco}
                        />
                    </View>

                    <View style={styles.loginContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("Login");
                            }}
                        >
                            <Text style={styles.loginText}>Já tem conta? Faça login!</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                      style={[styles.botao, loading && styles.botaoDisabled]}
                      onPress={handleCadastro}
                      disabled={loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.textoBotao}>Cadastrar</Text>
                      )}
                    </TouchableOpacity>
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
  input: {
    width: Platform.OS === 'web' ? "80%" : "90%",
    marginBottom: 15,
  },
  botao: {
    marginTop: 20,
    backgroundColor: "#2685BF",
    paddingVertical: 12,
    borderRadius: 8,
    width: Platform.OS === 'web' ? "50%" : "80%",
    alignItems: "center",
  },
  botaoDisabled: {
    backgroundColor: "#99cde0",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  loginContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  loginText: {
    color: '#2685BF',
    textDecorationLine: 'underline',
  },
  mapContainer: {
    width: Platform.OS === 'web' ? '80%' : '90%',
    marginBottom: 15,
  },
});

export default Cadastro;