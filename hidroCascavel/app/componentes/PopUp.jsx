import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const PopUp = () => {
    return (
        <View style={styles.container} >
            <View style={styles.numero}>1</View>
            <Text style={styles.texto}>PopUp</Text>
            <Image style={styles.icone} />
        </View>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            width: 300,
            height: 50,
            backgroundColor: '#aa566a',
            display: 'flex',
            justifyContent: "space-between",
            flexDirection: "row",
            borderRadius: 10,
            margin: 0,
        },
        numero: {
            width: 80,
            height: 50,
            backgroundColor: "#ddafbb",
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
        },
        icone: {
            width: 80,
            height: 50,
            backgroundColor: "#ccd55a",
            borderRadius: 10,
        },
        texto: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    }
)

export default PopUp;