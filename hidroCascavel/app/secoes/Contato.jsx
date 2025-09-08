import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
import imgInstagram from '../assets/Instagram.png';
import imgWhatsApp from '../assets/WhatsApp.png';
import imgIfpr from '../assets/ifpr.png';

const Contato = () => {

    return (
        <View>
            <View>
                <Text>Contato</Text>
                <Text>(45) 99988-7766</Text>
                <Text>email@gmail.com</Text>
                <View>
                    <TouchableOpacity><Image source={imgInstagram}/></TouchableOpacity>
                    <TouchableOpacity><Image source={imgWhatsApp}/></TouchableOpacity>
                    <TouchableOpacity><Image source={imgIfpr}/></TouchableOpacity>
                </View>
            </View>

            <View>
                <Text>2025 HidroCascavel</Text>
                <Text>Feito por Lucas e Taynara</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    containerContato:{
        backgroundColor: '#236289',
    },
    containerRodape: {
        backgroundColor: '#192F38'
    },
})

export default Contato;
