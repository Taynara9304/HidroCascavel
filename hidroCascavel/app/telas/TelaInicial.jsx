import React from 'react';
import { View } from 'react-native';
import CarosselInicial from '../secoes/CarosselInicial';
import Apresentacao from '../secoes/Apresentacao';
import EducacaoAmbiental from '../secoes/EducacaoAmbiental';
import Avaliacoes from '../secoes/Avaliacoes';

const TelaInicial = ({ containerWidth }) => {
  return (
    <View>
        <CarosselInicial containerWidth={containerWidth} />
        <Apresentacao />
        <EducacaoAmbiental />
        <Avaliacoes />
    </View>
  );
};

export default TelaInicial;
