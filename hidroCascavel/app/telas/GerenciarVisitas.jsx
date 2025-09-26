import React from "react";
import { ScrollView, View, Text, useWindowDimensions, StyleSheet } from "react-native";

const GerenciarVisitas = () => {
    const { width } = useWindowDimensions();
    const contentWidth = width < 800 ? width : width * 0.6;

    return (
         <ScrollView>
            <View style={[styles.container, { width: contentWidth }]}>
                <Text>Gerenciar visitas</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
        margin: 'auto',
        padding: 10,
    },
});

export default GerenciarVisitas;