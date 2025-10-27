import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import Toast from 'react-native-toast-message';
import logo from '../assets/logoHidroCascavel.png';

const NavBar = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);

  const isMobile = width <= 800;

  // Função para deslogar - CORRIGIDA
  const handleDeslogar = async () => {
    try {
      console.log('Iniciando logout...');
      
      await signOut(auth);
      console.log('Usuário deslogado com sucesso');
      
      Toast.show({
        type: 'success',
        text1: 'Logout realizado',
        text2: 'Você saiu da sua conta'
      });

      // ✅ NAVEGAÇÃO CORRIGIDA - Use navigate em vez de reset
      navigation.navigate("TelaInicial");
      
    } catch (error) {
      console.error('Erro ao deslogar:', error);
      
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível fazer logout'
      });
    }
  };

  // Função para navegar para o perfil
  const handlePerfilPress = () => {
    setMenuOpen(false);
    navigation.navigate("PerfilUsuario");
  };

  return (
    <View
      style={[
        styles.navBar,
        isMobile ? styles.mobileNav : styles.desktopNav,
      ]}
    >
      {isMobile ? (
        <>
          {/* Ícone menu mobile */}
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <MaterialIcons name="menu" size={30} color="#fff" />
          </TouchableOpacity>

          {menuOpen && (
            <View style={styles.sideMenu}>
              <TouchableOpacity 
                style={styles.navItem}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("Sobre");
                }}
              >
                <Text style={styles.navText}>Sobre</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.navItem}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("Servicos");
                }}
              >
                <Text style={styles.navText}>Serviços</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.navItem}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("EducacaoAmbiental");
                }}
              >
                <Text style={styles.navText}>Educação Ambiental</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.navItem}
                onPress={() => {
                  setMenuOpen(false);
                  navigation.navigate("Contato");
                }}
              >
                <Text style={styles.navText}>Contato</Text>
              </TouchableOpacity>

              {/* Botão Perfil no mobile */}
              <TouchableOpacity 
                style={[styles.navItem, styles.perfilButton]}
                onPress={handlePerfilPress}
              >
                <MaterialIcons name="person" size={20} color="#fff" />
                <Text style={styles.perfilText}>Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navItem, styles.loginButton]}
                onPress={() => {
                  setMenuOpen(false);
                  handleDeslogar();
                }}
              >
                <MaterialIcons name="logout" size={20} color="#fff" />
                <Text style={styles.loginText}>Sair</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.navRow}>
          <Image source={logo} style={styles.logo} /> 

          <View style={styles.navItemsContainer}>
            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => navigation.navigate("Sobre")}
            >
              <Text style={styles.navText}>Sobre</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => navigation.navigate("Servicos")}
            >
              <Text style={styles.navText}>Serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => navigation.navigate("EducacaoAmbiental")}
            >
              <Text style={styles.navText}>Educação Ambiental</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.navItem}
              onPress={() => navigation.navigate("Contato")}
            >
              <Text style={styles.navText}>Contato</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightButtons}>
            {/* Botão Perfil para Desktop */}
            <TouchableOpacity 
              style={[styles.navItem, styles.perfilButton]}
              onPress={handlePerfilPress}
            >
              <MaterialIcons name="person" size={24} color="#fff" />
              <Text style={styles.perfilText}>Perfil</Text>
            </TouchableOpacity>

            {/* Botão Sair para Desktop */}
            <TouchableOpacity
              style={[styles.navItem, styles.loginButton]}
              onPress={handleDeslogar}
            >
              <MaterialIcons name="logout" size={24} color="#fff" />
              <Text style={styles.loginText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  navBar: {
    marginTop: 20,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    position: "absolute",
    top: 0,
    width: "95%",
    backgroundColor: "#2685BF",
    zIndex: 1000,
    alignSelf: "center",
    borderRadius: 10,
  },
  logo: {
    width: 80,
    height: 80,
  },
  mobileNav: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  desktopNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navRow: {
    left: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  navItemsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  sideMenu: {
    position: "absolute",
    top: 60,
    left: 0,
    width: "70%",
    backgroundColor: "#3D9DD9",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    zIndex: 1001,
    borderRadius: 8,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  navText: {
    fontSize: 16,
    color: "#fff",
  },
  perfilButton: {
    backgroundColor: "#1a6fa3",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perfilText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  loginButton: {
    backgroundColor: "#d32f2f",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
});