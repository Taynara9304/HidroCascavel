import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'

const NavBar = () => {    
    return(
        <View style={styles.container}>

            <TouchableOpacity>
                <Text>Sobre</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text>Serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text>Educação Ambiental</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <Text>Contato</Text>
            </TouchableOpacity>

            <TouchableOpacity>
                <MaterialIcons> name = "login"</MaterialIcons>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    height: 100,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  slide: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
    padding: 20,
    left: 20,
    right: 20,
    backgroundColor: '#3D9DD9',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: 'white',
    fontSize: 16,
  },
});

export default NavBar;