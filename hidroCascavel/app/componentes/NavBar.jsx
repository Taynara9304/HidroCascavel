import { View, Text, TouchableOpacity } from 'react-native';
import { Icons } from '@expo/vector-icons'

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
                <Icons> name = "login"</Icons>
            </TouchableOpacity>

        </View>
    );
};

export default NavBar;