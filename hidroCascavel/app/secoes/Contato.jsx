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
import imgIfpr from '../assets/iconeIfpr2.png';

const Contato = () => {

    return (
        <View style={styles.container}>
            <View style={styles.containerContato}>
                <Text style={styles.titulo}>Contato</Text>
                <Text style={styles.texto}>(45) 99988-7766</Text>
                <Text style={styles.texto}>email@gmail.com</Text>
                <View style={styles.containerImagem}>
                    <TouchableOpacity><Image style={styles.imagem} source={imgInstagram}/></TouchableOpacity>
                    <TouchableOpacity><Image style={styles.imagem} source={imgWhatsApp}/></TouchableOpacity>
                    <TouchableOpacity><Image style={styles.imagem} source={imgIfpr}/></TouchableOpacity>
                </View>
            </View>

            <View style={styles.containerRodape}>
                <Text style={styles.texto}>2025 HidroCascavel</Text>
                <Text style={styles.texto}>Feito por Lucas e Taynara</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        marginTop: 10,
    },
    containerContato:{
        backgroundColor: '#236289',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    containerRodape: {
        backgroundColor: '#192F38',
        alignItems: 'center',
        padding: 10,
    },
    containerImagem: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        gap: 10,
    },
    imagem: {
        width: 30,
        height: 30,
    },
    titulo: {
        fontSize: 30,
        textAlign: "center",
        color: "#fff",
        marginBottom: 15,
    },
    texto: {
        color: '#ffffff',   
        marginBottom: 10,
    }
});

export default Contato;
