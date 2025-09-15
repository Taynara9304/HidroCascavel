import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import ondaTopo from "../assets/ondaTopo.png";
import Input from "../componentes/Input";

const Cadastro = () => {
    const { width } = useWindowDimensions();
    const contentWidth = width < 800 ? width : width * 0.6;

    const [email, setEmail] = useState("");
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");

    return(
        <ScrollView>
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
                        style={{ width: "80%" }}
                    />

                    <Input
                        label="Nome"
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite seu nome"
                        secureTextEntry
                        style={{ width: "80%" }}
                    />

                    <Input
                        label="Sobrenome"
                        value={sobrenome}
                        onChangeText={setSobrenome}
                        placeholder="Digite seu sobrenome"
                        secureTextEntry
                        style={{ width: "80%" }}
                    />

                    <Input
                        label="Telefone"
                        value={telefone}
                        onChangeText={setTelefone}
                        placeholder="Digite seu telefone"
                        secureTextEntry
                        style={{ width: "80%" }}
                    />

                    <Input
                        label="Senha"
                        value={senha}
                        onChangeText={setSenha}
                        placeholder="Digite sua senha"
                        secureTextEntry
                        style={{ width: "80%" }}
                    />

                    <Input
                        label="Confimação"
                        value={confirmacao}
                        onChangeText={setConfirmacao}
                        placeholder="Confirme sua senha"
                        secureTextEntry
                        style={{ width: "80%" }}
                    />

                    <View style={styles.containerDivisao}>
                        <Text style={styles.titulo}>Endereço</Text>
                        
                        <View style={styles.linhaAzul} />
                    </View>

                    <View style={styles.containerEndereco}>
                        <Input
                            label="CEP"
                            value={confirmacao}
                            onChangeText={setConfirmacao}
                            placeholder="Digite seu CEP"
                            secureTextEntry
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Número da casa"
                            value={confirmacao}
                            onChangeText={setConfirmacao}
                            placeholder="Digite o número da sua casa"
                            secureTextEntry
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Rua"
                            value={confirmacao}
                            onChangeText={setConfirmacao}
                            placeholder="Digite o nome da sua rua"
                            secureTextEntry
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Bairro"
                            value={confirmacao}
                            onChangeText={setConfirmacao}
                            placeholder="Digite seu bairro"
                            secureTextEntry
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Estado"
                            value={confirmacao}
                            onChangeText={setConfirmacao}
                            placeholder="Digite seu estado"
                            secureTextEntry
                            style={styles.inputEndereco}
                        />

                        <Input
                            label="Cidade"
                            value={confirmacao}
                            onChangeText={setConfirmacao}
                            placeholder="Digite o nome da sua cidade"
                            secureTextEntry
                            style={styles.inputEndereco}
                        />
                    </View>

                    <View>
                        <TouchableOpacity
                            style={[]}
                            onPress={() => {
                                navigation.navigate("Login");
                            }}
                        >
                            <Text style={styles.loginText}>Já tem conta? Faça login!</Text>
                        </TouchableOpacity>
                    </View>


                    <TouchableOpacity style={styles.botao}>
                    <Text style={styles.textoBotao}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  topContainer: {
    position: "relative",
    alignItems: "center",
  },
  image: {
    alignSelf: "center",
    marginTop: -35, // deixa colada no topo
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
  },
  botao: {
    marginTop: 20,
    backgroundColor: "#2685BF",
    paddingVertical: 12,
    borderRadius: 8,
    width: "50%",
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  containerEndereco: {
    flexDirection: 'row',   // coloca os inputs lado a lado
    flexWrap: 'wrap',       // permite quebrar para a próxima linha
    justifyContent: 'space-between', // espaço entre as colunas
    width: '80%',
    marginTop: 10,
  },
  inputEndereco: {
    width: '48%',  // cada input ocupa aproximadamente metade do espaço
    marginBottom: 10, // espaço entre linhas
  },
  containerDivisao: {
    display: 'flex',
    width: '80%',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 18,
    marginBottom: 8,
    color: '#2196F3',
    width: '20%',
  },
  linhaAzul: {
    height: 2,
    backgroundColor: '#2196F3',
    marginBottom: 16,
    width: '80%',
  },
});

export default Cadastro;