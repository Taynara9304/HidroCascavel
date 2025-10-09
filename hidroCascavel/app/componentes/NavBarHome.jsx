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
import logo from '../assets/logoHidrocascavel.png';

const Deslogar = (navigation) => {
  signOut(auth)
    .then(() => {
      console.log('Usuário deslogado com sucesso');
      
      Toast.show({
        type: 'success',
        text1: 'Logout realizado',
        text2: 'Você saiu da sua conta'
      });
      
      navigation.reset({
        index: 0,
        routes: [{ name: "TelaInicial" }],
      });
    })
    .catch((error) => {
      console.error('Erro ao deslogar:', error);
      
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível fazer logout'
      });
    });
};

const NavBar = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [menuOpen, setMenuOpen] = useState(false);

  const isMobile = width <= 800;

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
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Sobre</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Serviços</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Educação Ambiental</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Contato</Text>
              </TouchableOpacity>

              {/* Configurações no mobile */}
              <TouchableOpacity style={[styles.navItem, styles.configButton]}>
                <MaterialIcons name="settings" size={20} color="#fff" />
                <Text style={styles.configText}></Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navItem, styles.loginButton]}
                onPress={() => {
                  setMenuOpen(false);
                  Deslogar(navigation);
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
            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navText}>Sobre</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navText}>Serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navText}>Educação Ambiental</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navText}>Contato</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightButtons}>
            {/* Botão Configurações para Desktop */}
            <TouchableOpacity style={[styles.navItem, styles.configButton]}>
              <MaterialIcons name="settings" size={30} color="#fff" />
              <Text style={styles.configText}></Text>
            </TouchableOpacity>

            {/* Botão Sair para Desktop */}
            <TouchableOpacity
              style={[styles.navItem, styles.loginButton]}
              onPress={() => Deslogar(navigation)}
            >
              <MaterialIcons name="logout" size={30} color="#fff" />
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
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 6,
  },
  navText: {
    fontSize: 16,
    color: "#fff",
  },
  configButton: {
    backgroundColor: "#1a6fa3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    left:2,
    top: 1
  },
  configText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  loginButton: {
    marginLeft: 12,
    backgroundColor: "#1a6fa3",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    top: 1
  },
  loginText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});