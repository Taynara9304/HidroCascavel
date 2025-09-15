import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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
            <MaterialIcons name="menu" size={30} color="#2685BF" />
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

              <TouchableOpacity
                style={[styles.navItem, styles.loginButton]}
                onPress={() => {
                  setMenuOpen(false); // fecha o menu
                  navigation.navigate("Login");
                }}
              >
                <MaterialIcons name="login" size={20} color="#2685BF" />
                <Text style={styles.loginText}>Entrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <View style={styles.navRow}>
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

          <TouchableOpacity
            style={[styles.navItem, styles.loginButton]}
            onPress={() => navigation.navigate("Login")}
          >
            <MaterialIcons name="login" size={20} color="#2685BF" />
            <Text style={styles.loginText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  navBar: {
    marginTop: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    position: "absolute",
    top: 0,
    width: "95%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1000,
    alignSelf: "center",
    borderRadius: 10,
  },
  mobileNav: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
  },
  desktopNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sideMenu: {
    position: "absolute",
    top: 60,
    left: 0,
    width: "70%",
    backgroundColor: "#fff",
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
    color: "#333",
  },
  loginButton: {
    marginLeft: 12,
  },
  loginText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "bold",
    color: "#2685BF",
  },
});
