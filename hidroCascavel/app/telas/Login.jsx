import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import ondaTopo from "../assets/ondaTopo.png";
import ondaBaixo from "../assets/ondaBaixo.png";
import Input from "../componentes/Input";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useAuth } from '../contexts/authContext';

const Login = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const contentWidth = width < 800 ? width : width * 0.6;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { buscarDadosUsuario } = useAuth();

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'PREENCHA TODOS OS CAMPOS');
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const userFirebase = userCredential.user;

      // Busca e salva os dados do usuário usando o contexto
      await buscarDadosUsuario(userFirebase);

      // Redireciona para a HomeAdm após login bem-sucedido
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeAdm" }],
      });

    } catch (error) {
      console.error(error);
      let errorMessage = 'Erro ao fazer login';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
              onPress={() => {
                navigation.navigate("Cadastro");
              }}
            >
              <Text style={styles.loginText}>Não tem conta? Cadastre-se!</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.botao, isLoading && styles.botaoDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.textoBotao}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <Image
          source={ondaBaixo}
          style={[styles.ondaBaixo, { width: contentWidth }]}
          resizeMode="contain"
        />
      </View>
    </TouchableWithoutFeedback>
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
    marginTop: -35,
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
  botaoDisabled: {
    backgroundColor: "#ccc",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    color: "#2685BF",
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default Login;