import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const PopUp = prop => {
    return (
        <View style={styles.container} >
            <View style={styles.numero}>{prop.num}</View>
            <Text style={styles.texto}>{prop.texto}</Text>
            <View style={styles.containerIcone}>
                <Image style={styles.icone} source={prop.img} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            width: 300,
            height: 50,
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: "space-between",
            flexDirection: "row",
            borderRadius: 10,
            margin: 0,
            borderColor: '#3D9DD9',
            borderWidth: 1,
        },
        numero: {
            width: 50,
            height: 45,
            backgroundColor: "white",
            display: 'flex',
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
        },
        containerIcone: {
            width: 50,
            height: 50,
            backgroundColor: "#3D9DD9",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        icone: {
            width: 30,
            height: 30,
        },
        texto: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    }
)

export default PopUp;