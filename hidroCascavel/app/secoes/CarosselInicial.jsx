import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import  NavBar from '../componentes/NavBar'

const CarosselInicial = ({ containerWidth }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselData = [
    {
      id: 1,
      title: 'RETROSPECTIVA HIDROCASCAVEL 2025',
      image: require('../assets/img1Carrossel.png'),
    },
    {
      id: 2,
      title: 'QUEM SOMOS NÓS?',
      image: require('../assets/img2Carrossel.png'),
    },
    {
      id: 3,
      title: 'QUERO AGENDAR UMA VISITA!',
      image: require('../assets/img3Carrossel.png'),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % carouselData.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width: containerWidth }]}>
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { width: containerWidth }]}>
      <FlatList
        ref={flatListRef}
        data={carouselData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        getItemLayout={(data, index) => ({
          length: containerWidth,
          offset: containerWidth * index,
          index,
        })}
      />

      <NavBar/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 600,
    marginVertical: 20,
    margin: 0,
  },
  slide: {
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
  },
  textContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    backgroundColor: '#3D9DD9',
    padding: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default CarosselInicial;