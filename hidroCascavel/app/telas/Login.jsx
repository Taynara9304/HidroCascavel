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
  let { width } = useWindowDimensions();
  const isCellPhone = width < 800; // Define se é celular/tablet menor

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { buscarDadosUsuario } = useAuth();

  const validateFields = () => {
    // ... (restante da função validateFields permanece o mesmo)
    const newErrors = {};

    if (!email) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';

    if (!senha) newErrors.senha = 'Senha é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // ... (restante da função handleLogin permanece o mesmo)
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

      await buscarDadosUsuario(userFirebase);

      Toast.show({
        type: 'success',
        text1: 'Sucesso',
        text2: 'Login realizado com sucesso!'
      });

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
      <View style={[styles.container, isCellPhone && styles.containerCellPhone]}>

      {!isCellPhone && (
        <View style={styles.containerLeft}>
          <Image source={LogoHidroCvel} style={styles.LogoHidroCvel}></Image>
        </View>
      )}

      <View style={[styles.containerRight, isCellPhone && styles.containerRightCellPhone]}>
          <View style={[styles.topContainer]}>
            <Image
              source={ondaTopo}
              // 💡 Estilo condicional para a onda do topo
              style={[styles.ondaTopo, isCellPhone && styles.ondaTopoCellPhone]}
              resizeMode="cover"
            />
            {/* 💡 Estilo condicional para o título */}
            <Text style={[styles.titleSobreImagem, isCellPhone && styles.titleSobreImagemCellPhone]}>OLÁ, VAMOS FAZER LOGIN!</Text>
          </View>

          {/* Conteúdo principal */}
          <View style={[styles.content]}>
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
                // 💡 Estilo condicional para a onda de baixo
                style={[styles.ondaBaixo, isCellPhone && styles.ondaBaixoCellPhone]}
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
  // ... (Estilos container, containerLeft, containerRight e Logo permanecem os mesmos)
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  containerCellPhone: {
    flexDirection: "column",
  },
  containerLeft: {
    backgroundColor: "#2685BF",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  containerRight: {
    flex: 1,
    width: "60%"
  },
  containerRightCellPhone: {
    width: "100%",
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
  
  // ESTILOS PADRÃO (DESKTOP)
  ondaTopo: {
    width: "100%",
    height: 140, // Altura maior para desktop
  },
  titleSobreImagem: {
    marginTop: 100, // Margem maior para desktop
    fontSize: 25, // Fonte maior para desktop
    color: "#2685BF",
  },
  ondaBaixo: {
    width: "100%",
    height: 140, // Defina uma altura padrão (opcional, mas bom para controle)
  },
  
  // NOVOS ESTILOS PARA CELULAR (MENORES)
  ondaTopoCellPhone: {
    height: 100, // Altura reduzida para celular
  },
  titleSobreImagemCellPhone: {
    marginTop: 70, // Margem reduzida para celular
    fontSize: 20, // Fonte reduzida para celular
  },
  ondaBaixoCellPhone: {
    height: 100, // Altura reduzida para celular
  },
  
  // ... (Restante dos estilos permanecem os mesmos)
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
    justifyContent: "flex-end"
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