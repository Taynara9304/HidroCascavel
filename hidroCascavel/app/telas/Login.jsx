import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import ondaTopo from "../assets/ondaTopo.png";
import ondaBaixo from "../assets/ondaBaixo.png";
import Input from "../componentes/Input";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { AuthProvider, useAuth } from '../contexts/authContext';
import Toast from 'react-native-toast-message';
import LogoHidroCvel from '../assets/logoHidroCascavel.png';

const Login = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const contentWidth = width < 800 ? width : width * 0.6;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { buscarDadosUsuario } = useAuth();

  const validateFields = () => {
    const newErrors = {};

    if (!email) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';

    if (!senha) newErrors.senha = 'Senha é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      Toast.show({
        type: 'error',
        text1: 'Atenção',
        text2: 'Por favor, preencha todos os campos corretamente.'
      });
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const userFirebase = userCredential.user;

      // Busca e salva os dados do usuário usando o contexto
      await buscarDadosUsuario(userFirebase);

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Login realizado com sucesso!'
      });

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
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }

      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>

        <View style={styles.containerLeft}>
          <Image source={LogoHidroCvel} style={styles.LogoHidroCvel}></Image>
        </View>

        <View style={styles.containerRight}>
          {/* Onda do topo */}
          <View style={[styles.topContainer, { width: contentWidth }]}>
            <Image
              source={ondaTopo}
              style={[styles.ondaTopo, { width: contentWidth }]}
              resizeMode="cover"
            />
            <Text style={styles.titleSobreImagem}>Olá, vamos fazer login!</Text>
          </View>

          {/* Conteúdo principal */}
          <View style={[styles.content, { width: contentWidth }]}>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Input
                  label="E-mail"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Digite seu e-mail"
                  keyboardType="email-address"
                  style={{ width: "100%" }}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Input
                  label="Senha"
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Digite sua senha"
                  secureTextEntry
                  style={{ width: "100%" }}
                />
                {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
              </View>

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
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.textoBotao}>Entrar</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Onda de baixo */}
            <View style={styles.bottomContainer}>
              <Image
                source={ondaBaixo}
                style={[styles.ondaBaixo, { width: contentWidth }]}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  containerLeft: {
    backgroundColor: "#2685BF",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  containerRight: {
    flex: 1,
  },
  LogoHidroCvel: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  topContainer: {
    position: "relative",
    alignItems: "center",
  },
  ondaTopo: {
    width: "100%",
        height: 125,
  },
  
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  inputContainer: {
    width: "80%",
    marginBottom: 20,
  },
  bottomContainer: {
    width: "100%",
  },
  ondaBaixo: {
    width: "100%",
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});

export default Login;