import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import ondaTopo from "../assets/ondaTopo.png";
import ondaBaixo from "../assets/ondaBaixo.png";
import Input from "../componentes/Input";

const Login = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const contentWidth = width < 800 ? width : width * 0.6;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <View style={styles.container}>
      <View style={[styles.topContainer, { width: contentWidth }]}>
        <Image
          source={ondaTopo}
          style={[styles.image, { width: contentWidth }]}
          resizeMode="contain"
        />

        <Text style={styles.titleSobreImagem}>Olá, vamos fazer login!</Text>
      </View>

      <View style={[styles.content, { width: contentWidth }]}>
        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
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

        <View>
            <TouchableOpacity
                style={[]}
                onPress={() => {
                    navigation.navigate("Cadastro");
                }}
            >
                <Text style={styles.loginText}>Não tem conta? Cadastre-se!</Text>
              </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => {
            navigation.navigate("HomeAdm");
          }}
          >
          <Text style={styles.textoBotao}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <Image
          source={ondaBaixo}
          style={[styles.ondaBaixo, { width: contentWidth }]}
          resizeMode="contain"
        />
    </View>
  );
};

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
  ondaBaixo: {
    alignSelf: "center",
    top: 467,
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
});

export default Login;
