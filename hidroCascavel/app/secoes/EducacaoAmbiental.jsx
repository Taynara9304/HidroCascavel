import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Dropdown from '../componentes/Dropdown';

const EducacaoAmbiental = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.titulo}>Educação Ambiental</Text>
        <Dropdown
            title="Informações sobre poços" 
            infoText={`Os poços são estruturas fundamentais para o acesso à água subterrânea, especialmente em regiões onde o abastecimento público é limitado.
    •   Acesso à água potável em áreas remotas
    •   Redução da dependência de sistemas públicos de abastecimento
    •   Sustentabilidade hídrica quando bem manejados
    •   Alternativa para períodos de seca`}
        />

        <Dropdown 
            title="Importância da água" 
            infoText={`A água é essencial para a vida e desempenha papéis cruciais nos ecossistemas, agricultura e saúde humana.
    •   Regulação da temperatura corporal
    •   Transporte de nutrientes
    •   Irrigação agrícola
    •   Geração de energia`}
        />

        <Dropdown 
            title="Cuidados ambientais" 
            infoText={`A preservação da água depende de boas práticas ambientais.
    •   Uso consciente dos recursos
    •   Proteção de nascentes
    •   Tratamento de esgoto
    •   Redução da poluição industrial`}
        />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        backgroundColor: '#3D9DD9',
        borderRadius: 10,
        width: '100%',
    },
    titulo: {
        fontSize: 30,
        display: 'flex',
        justifyContent: 'center',
        marginTop: 20,
        color: '#FFFFFF'
    },
});

export default EducacaoAmbiental;
