import React from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import img1Carrossel from '../assets/img1Carrossel.png'
const { width } = Dimensions.get('window');

const CarosselInicial = () => {
  const carouselData = [
    {
      id: 1,
      title: 'Hidro Cascavel',
      description: 'Sua água de confiança',
      image: img1Carrossel,
    },
    {
      id: 2,
      title: 'Qualidade Garantida',
      description: 'Padrões rigorosos de qualidade',
      image: 'https://images.unsplash.com/photo-1545147985-5a3dab3c3f54?w=400',
    },
    {
      id: 3,
      title: 'Sustentabilidade',
      description: 'Compromisso com o meio ambiente',
      image: 'https://images.unsplash.com/photo-1506629905877-52a5ca6d63b1?w=400',
    },
  ];

  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={220}
        autoPlay={true}
        data={carouselData}
        scrollAnimationDuration={1300}
        autoPlayInterval={3000}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.overlay} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    height: 220,
  },
  slide: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: 'white',
    fontSize: 16,
  },
});

export default CarosselInicial;