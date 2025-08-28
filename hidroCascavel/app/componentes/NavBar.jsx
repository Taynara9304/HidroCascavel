import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'

const NavBar = () => {    
    return(
        <View style={styles.navBar}>

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

            <TouchableOpacity style={[styles.navItem, styles.loginButton]}>
                <MaterialIcons name="login" size={20} color="#2685BF" />
                <Text style={styles.loginText}>Entrar</Text>
            </TouchableOpacity>

        </View>
    );
};

export default NavBar;

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        position: 'absolute',
        top: 0,
        width: '100%',
        backgroundColor: '#fff',
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    navText: {
        fontSize: 16,
        color: '#333',
    },
    loginButton: {
        marginLeft: 12,
    },
    loginText: {
        marginLeft: 4,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2685BF',
    }
});
