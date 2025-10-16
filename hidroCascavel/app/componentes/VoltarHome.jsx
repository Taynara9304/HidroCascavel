import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ondaTopo from "../assets/ondaTopo.png";

const VoltarHome = ({ navigation, props }) => {
    const { width } = useWindowDimensions();
    const contentWidth = width < 800 ? width : width * 0.8;

    // Usando props diretamente ou valores padrão
    const tela = props.tela || "Home";
    const titulo = props.titulo || "Título";

    const voltar = () => {
        navigation.navigate(tela);
    };

    return (
        <View>
            <View style={[styles.topContainer, { width: contentWidth }]}>
                <Image
                    source={ondaTopo}
                    style={[styles.image, { width: contentWidth }]}
                    resizeMode="contain"
                />
                
                {/* Botão de voltar no canto superior esquerdo */}
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={voltar}
                >
                    <MaterialIcons name="arrow-back" style={styles.iconeVoltar} />
                    <Text style={styles.titleSobreImagem}>{titulo}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topContainer: {
        position: "relative",
        alignItems: "center",
        marginBottom: 10,
    },
    image: {
        alignSelf: "center",
        marginTop: -35,
    },
    titleSobreImagem: {
        position: "absolute",
        top: "20%",
        left: "80%",
        transform: [{ translateX: -100 }, { translateY: -10 }],
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    backButton: {
        position: "absolute",
        top: "20%",
        left: "20%",
        transform: [{ translateX: -100 }, { translateY: -10 }],
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        alignSelf: 'flex-start',
    },
    backButtonText: {
        color: '#2685BF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 30,
    },
    iconeVoltar: {
        position: 'absolute',
        top: '40%',
        left: '20%',
        transform: [{translateX: -100}, {translateY: -10}],
        size: 100,
        width: 100,
        color: "#ffffff"
    }
})

export default VoltarHome;