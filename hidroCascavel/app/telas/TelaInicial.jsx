import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useRoute } from '@react-navigation/native'; 

import CarosselInicial from '../secoes/CarosselInicial';
import Apresentacao from '../secoes/Apresentacao';
import EducacaoAmbiental from '../secoes/EducacaoAmbiental';
import Avaliacoes from '../secoes/Avaliacoes';
import Contato from '../secoes/Contato';
import NavBar from '../componentes/NavBar';

const TelaInicial = () => {
  const { width } = useWindowDimensions();
  const contentWidth = width < 800 ? width : width * 0.6;
  const scrollViewRef = useRef(null);
  
  const route = useRoute();

  const [layoutY, setLayoutY] = useState({
    apresentacao: 0,
    educacao: 0,
    avaliacoes: 0,
    contato: 0,
  });

  const scrollToApresentacao = () => {
    scrollViewRef.current?.scrollTo({ y: layoutY.apresentacao, animated: true });
  };
  
  const scrollToEducacao = () => {
    scrollViewRef.current?.scrollTo({ y: layoutY.educacao, animated: true });
  };

  const scrollToAvaliacoes = () => {
    scrollViewRef.current?.scrollTo({ y: layoutY.avaliacoes, animated: true });
  };

  const scrollToContato = () => {
    scrollViewRef.current?.scrollTo({ y: layoutY.contato, animated: true });
  };

  const onLayout = (key) => (event) => {
    const { y } = event.nativeEvent.layout;
    setLayoutY((prev) => ({ ...prev, [key]: y - 20 })); 
  };

  useEffect(() => {
    const section = route.params?.scrollTo;
    
    if (!section) return;

    const timer = setTimeout(() => {
      console.log(`Tentando rolar para: ${section}`);
      if (section === 'sobre' || section === 'servicos') {
        scrollToApresentacao();
      } else if (section === 'educacao') {
        scrollToEducacao();
      } else if (section === 'contato') {
        scrollToContato();
      }

    }, 300);

    return () => clearTimeout(timer);

  }, [route.params?.scrollTo, layoutY]);


  return (
    <ScrollView 
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.containerApp}>
        <View style={[styles.contentContainer, { width: contentWidth }]}>
          
          <NavBar
            onScrollToApresentacao={scrollToApresentacao}
            onScrollToEducacao={scrollToEducacao}
            onScrollToContato={scrollToContato}
            onScrollToServicos={scrollToApresentacao}
          />
          
          <CarosselInicial 
            containerWidth={contentWidth} 
            onScrollToAvaliacoes={scrollToAvaliacoes}
          />

          <View onLayout={onLayout('apresentacao')} style={{ width: '100%' }}>
            <Apresentacao />
          </View>

          <View onLayout={onLayout('educacao')} style={{ width: '100%' }}>
            <EducacaoAmbiental />
          </View>
          
          <View onLayout={onLayout('avaliacoes')} style={{ width: '100%' }}>
            <Avaliacoes />
          </View>
          
          <View onLayout={onLayout('contato')} style={{ width: '100%' }}>
            <Contato />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
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