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
import logo from '../assets/logoHidrocascavel.png';

const NavBar = ({
  onScrollToApresentacao,
  onScrollToEducacao,
  onScrollToContato,
  onScrollToServicos,
  isDashboard,
}) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { user, userData } = useAuth(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null); 

  const isMobile = width <= 800;

  const handlePressPublico = (scrollFunction) => {
    setMenuOpen(false);
    if (scrollFunction) {
      scrollFunction(); 
    } else {
      navigation.navigate("TelaInicial"); 
    }
  };

  const handleHomePress = () => {
    setMenuOpen(false);
    
    if (isDashboard) {
      navigation.navigate("TelaInicial");
      return;
    }
    
    if (userData?.tipoUsuario === 'administrador') {
      navigation.navigate("AdministradorStack"); 
    } else if (userData?.tipoUsuario === 'analista') {
      navigation.navigate("AnalistaStack"); 
    } else if (userData?.tipoUsuario === 'proprietario') {
      navigation.navigate("ProprietarioStack");
    }
  };
  
  const handleNotificacoesPress = () => {
    setMenuOpen(false);
    const tipo = userData?.tipoUsuario;
    
    console.log('Navegando para Notificações...');
    
    if (tipo === 'administrador') {
      navigation.navigate("AdministradorStack", { screen: "NotificacoesAdm" }); 
    } else if (tipo === 'analista') {
      navigation.navigate("AnalistaStack", { screen: "NotificacoesAnalista" }); 
    } else if (tipo === 'proprietario') {
      navigation.navigate("ProprietarioStack", { screen: "NotificacoesProprietario" });
    }
  };

  const handlePerfilPress = () => {
    setMenuOpen(false);
    const tipo = userData?.tipoUsuario;
    
    console.log('Navegando para Perfil');

    if (tipo === 'administrador') {
      navigation.navigate("AdministradorStack", { screen: "PerfilUsuario" });
    } else if (tipo === 'analista') {
      navigation.navigate("AnalistaStack", { screen: "PerfilUsuario" });
    } else if (tipo === 'proprietario') {
      navigation.navigate("ProprietarioStack", { screen: "PerfilUsuario" });
    }
  };


  const handleDeslogar = async () => {
    try {
      await signOut(auth);
      Toast.show({ type: 'success', text1: 'Logout realizado' });
      navigation.navigate("TelaInicial");
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro ao fazer logout' });
    }
  };
  
  const handleLoginPress = () => {
    setMenuOpen(false);
    navigation.navigate("Login");
  };

  const Tooltip = ({ text, visible }) => {
    if (!visible) return null;
    return (
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>{text}</Text>
      </View>
    );
  };
  const IconButton = ({ icon, label, onPress, buttonStyle }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <View style={styles.iconButtonContainer}>
        <TouchableOpacity
          style={[ styles.iconButton, buttonStyle, isHovered && styles.iconButtonHovered ]}
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

  const navBarStyle = user ? styles.navBarLogado : styles.navBarDeslogado;
  const navTextStyle = user ? styles.navTextLogado : styles.navTextDeslogado;
  const iconColor = user ? "#fff" : "#2685BF";
  const sideMenuColor = user ? styles.sideMenuLogado : styles.sideMenuDeslogado;


  return (
    <View style={[styles.navBar, navBarStyle, isMobile ? styles.mobileNav : styles.desktopNav]}>
      {isMobile ? (
        <>
          <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
            <MaterialIcons name="menu" size={30} color={iconColor} />
          </TouchableOpacity>

          {menuOpen && (
            <View style={[styles.sideMenu, sideMenuColor]}>
              <TouchableOpacity style={styles.navItem} onPress={() => handlePressPublico(onScrollToApresentacao)}>
                <Text style={navTextStyle}>Sobre</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => handlePressPublico(onScrollToServicos)}>
                <Text style={navTextStyle}>Serviços</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => handlePressPublico(onScrollToEducacao)}>
                <Text style={navTextStyle}>Educação Ambiental</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={() => handlePressPublico(onScrollToContato)}>
                <Text style={navTextStyle}>Contato</Text>
              </TouchableOpacity>

              {user ? (
                <View style={styles.mobileIconButtons}>
                  <TouchableOpacity style={[styles.mobileIconButton, styles.homeButton]} onPress={handleHomePress}>
                    <MaterialIcons name="home" size={20} color="#fff" />
                    <Text style={styles.mobileIconText}>Home</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.mobileIconButton, styles.notificacoesButton]} onPress={handleNotificacoesPress}>
                    <MaterialIcons name="notifications" size={20} color="#fff" />
                    <Text style={styles.mobileIconText}>Notificações</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.mobileIconButton, styles.perfilButton]} onPress={handlePerfilPress}>
                    <MaterialIcons name="person" size={20} color="#fff" />
                    <Text style={styles.mobileIconText}>Perfil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.mobileIconButton, styles.logoutButton]} onPress={handleDeslogar}>
                    <MaterialIcons name="logout" size={20} color="#fff" />
                    <Text style={styles.mobileIconText}>Sair</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[styles.navItem, styles.loginButton]} onPress={handleLoginPress}>
                  <MaterialIcons name="login" size={20} color="#2685BF" />
                  <Text style={styles.loginText}>Entrar</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </>
      ) : (
        <View style={styles.navRow}>
          <Image source={logo} style={styles.logo} /> 

          <View style={styles.navItemsContainer}>
            <TouchableOpacity style={styles.navItem} onPress={() => handlePressPublico(onScrollToApresentacao)}>
              <Text style={navTextStyle}>Sobre</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => handlePressPublico(onScrollToServicos)}>
              <Text style={navTextStyle}>Serviços</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => handlePressPublico(onScrollToEducacao)}>
              <Text style={navTextStyle}>Educação Ambiental</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => handlePressPublico(onScrollToContato)}>
              <Text style={navTextStyle}>Contato</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightButtons}>
            {user ? (
              <>
                <IconButton icon="home" label="Home" onPress={handleHomePress} buttonStyle={styles.homeButton} />
                <IconButton icon="notifications" label="Notificações" onPress={handleNotificacoesPress} buttonStyle={styles.notificacoesButton} />
                <IconButton icon="person" label="Perfil" onPress={handlePerfilPress} buttonStyle={styles.perfilButton} />
                <IconButton icon="logout" label="Sair" onPress={handleDeslogar} buttonStyle={styles.logoutButton} />
              </>
            ) : (
              <TouchableOpacity style={[styles.navItem, styles.loginButton]} onPress={handleLoginPress}>
                <MaterialIcons name="login" size={20} color="#2685BF" />
                <Text style={styles.loginText}>Entrar</Text>
              </TouchableOpacity>
            )}
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
    zIndex: 1000,
    alignSelf: "center",
    borderRadius: 10,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  navBarDeslogado: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  navTextDeslogado: {
    fontSize: 16,
    color: "#333",
  },
  sideMenuDeslogado: {
    backgroundColor: "#fff",
  },
    navBarLogado: {
    backgroundColor: "#2685BF",
  },
  navTextLogado: {
    fontSize: 16,
    color: "#fff",
  },
  sideMenuLogado: {
    backgroundColor: "#3D9DD9",
  },
  logo: { width: 80, height: 80 },
  mobileNav: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 90,
  },
  desktopNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'space-between',
    width: '100%',
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
    top: 90,
    left: 0,
    width: "70%",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    zIndex: 500,
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
  loginButton: {
  },
  loginText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#2685BF",
  },
  iconButtonContainer: { position: 'relative' },
  iconButton: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    transition: 'all 0.2s ease',
  },
  iconButtonHovered: { transform: [{ scale: 1.1 }] },
  tooltip: {
    position: 'absolute', top: 50, left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#333',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 4, zIndex: 1002,
  },
  tooltipText: {
    color: '#fff', fontSize: 12, fontWeight: '500',
  },
  mobileIconButtons: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1a6fa3',
    paddingTop: 10,
  },
  mobileIconButton: {
    flexDirection: 'row', alignItems: 'center',
    marginVertical: 4, paddingVertical: 8,
    paddingHorizontal: 12, borderRadius: 6,
  },
  mobileIconText: {
    marginLeft: 8, fontSize: 14,
    fontWeight: "bold", color: "#fff",
  },
  homeButton: { backgroundColor: "#008000" },
  notificacoesButton: { backgroundColor: "#FF9800" },
  perfilButton: { backgroundColor: "#1a6fa3" },
  logoutButton: { backgroundColor: "#d32f2f" },
});