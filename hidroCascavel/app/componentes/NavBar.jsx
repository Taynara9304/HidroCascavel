import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'

const NavBar = () => {    
    return(
            <View>

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

export default NavBar;