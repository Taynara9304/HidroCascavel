import React, { useRef } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import CarosselInicial from '../secoes/CarosselInicial';
import Apresentacao from '../secoes/Apresentacao';
import EducacaoAmbiental from '../secoes/EducacaoAmbiental';
import Avaliacoes from '../secoes/Avaliacoes';
import Contato from '../secoes/Contato';

const TelaInicial = () => {
  const { width } = useWindowDimensions();
  const contentWidth = width < 800 ? width : width * 0.6;
  const scrollViewRef = useRef(null);

  const scrollToAvaliacoes = () => {
    // Estimativa da posição Y da seção de avaliações
    // Ajuste este valor conforme necessário
    scrollViewRef.current?.scrollTo({ y: 1260, animated: true });
  };

  return (
    <ScrollView ref={scrollViewRef}>
      <View style={styles.containerApp}>
        <View style={[styles.contentContainer, { width: contentWidth }]}>
          <CarosselInicial 
            containerWidth={contentWidth} 
            onScrollToAvaliacoes={scrollToAvaliacoes}
          />
          <Apresentacao />
          <EducacaoAmbiental />
          <Avaliacoes />
          <Contato />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  containerApp: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  contentContainer: {
    alignItems: 'center',
  },
});

export default TelaInicial;