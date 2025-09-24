import React from "react";
import { ScrollView, View, Text } from "react-native";

const GerenciarVisitas = () => {
    const { width } = useWindowDimensions();
    const contentWidth = width < 800 ? width : width * 0.6;

    return (
         <ScrollView>
            <View style={[styles.container, { width: contentWidth }]}>

            </View>
        </ScrollView>
    )
}

export default GerenciarVisitas;