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
import { useAuth } from '../contexts/authContext';
import Toast from 'react-native-toast-message';
import logo from '../assets/logoHidroCascavel.png';

const NavBar = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { userData } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  const isMobile = width <= 800;

  // Função para navegar para a tela de notificações correta
  const handleNotificacoesPress = () => {
    setMenuOpen(false);
    
    console.log('🔔 Navegando para notificações. Tipo de usuário:', userData?.tipoUsuario);
    
    // ✅ CORREÇÃO: Navegação SIMPLES - cada stack já tem sua própria tela
    // Não precisa especificar o stack, só o nome da tela dentro do stack atual
    if (userData?.tipoUsuario === 'administrador') {
      navigation.navigate("NotificacoesAdm"); // ✅ Nome EXATO como está no AdminStack
    } else if (userData?.tipoUsuario === 'analista') {
      navigation.navigate("NotificacoesAnalista"); // ✅ Nome EXATO como está no AnalistaStack
    } else if (userData?.tipoUsuario === 'proprietario') {
      navigation.navigate("NotificacoesProprietario"); // ✅ Nome EXATO como está no ProprietarioStack
    } else {
      // Fallback
      navigation.navigate("NotificacoesAnalista");
    }
  };

  // Função para deslogar
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

  // Tooltip component
  const Tooltip = ({ text, visible }) => {
    if (!visible) return null;
    
    return (
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>{text}</Text>
      </View>
    );
  };

  // Botão com ícone e tooltip
  const IconButton = ({ icon, label, onPress, buttonStyle }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <View style={styles.iconButtonContainer}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            buttonStyle,
            isHovered && styles.iconButtonHovered
          ]}
          onPress={onPress}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <MaterialIcons name={icon} size={24} color="#fff" />
        </TouchableOpacity>
        <Tooltip text={label} visible={isHovered} />
      </View>
    );
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

              {/* Botões com ícones no mobile */}
              <View style={styles.mobileIconButtons}>
                <TouchableOpacity 
                  style={[styles.mobileIconButton, styles.notificacoesButton]}
                  onPress={handleNotificacoesPress}
                >
                  <MaterialIcons name="notifications" size={20} color="#fff" />
                  <Text style={styles.mobileIconText}>Notificações</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.mobileIconButton, styles.perfilButton]}
                  onPress={handlePerfilPress}
                >
                  <MaterialIcons name="person" size={20} color="#fff" />
                  <Text style={styles.mobileIconText}>Perfil</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.mobileIconButton, styles.loginButton]}
                  onPress={() => {
                    setMenuOpen(false);
                    handleDeslogar();
                  }}
                >
                  <MaterialIcons name="logout" size={20} color="#fff" />
                  <Text style={styles.mobileIconText}>Sair</Text>
                </TouchableOpacity>
              </View>
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
            {/* Botões com ícones para Desktop */}
            <IconButton
              icon="notifications"
              label="Notificações"
              onPress={handleNotificacoesPress}
              buttonStyle={styles.notificacoesButton}
            />

            <IconButton
              icon="person"
              label="Perfil"
              onPress={handlePerfilPress}
              buttonStyle={styles.perfilButton}
            />

            <IconButton
              icon="logout"
              label="Sair"
              onPress={handleDeslogar}
              buttonStyle={styles.loginButton}
            />
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
    // Corrigindo o warning do shadow
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
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
    gap: 8,
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
    // Corrigindo o warning do shadow
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
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
  // Estilos para botões de ícone no desktop
  iconButtonContainer: {
    position: 'relative',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  },
  iconButtonHovered: {
    transform: [{ scale: 1.1 }],
  },
  tooltip: {
    position: 'absolute',
    top: 50,
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1002,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  // Estilos para botões no mobile
  mobileIconButtons: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1a6fa3',
    paddingTop: 10,
  },
  mobileIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  mobileIconText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  // Cores dos botões
  notificacoesButton: {
    backgroundColor: "#FF9800",
  },
  perfilButton: {
    backgroundColor: "#1a6fa3",
  },
  loginButton: {
    backgroundColor: "#d32f2f",
  },
});