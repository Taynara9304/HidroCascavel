import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from "react-native";
import Card from "../componentes/Card";
import FormAvaliacoes from "../componentes/FormAvaliacoes";

const data = [
  {
    id: "1",
    name: "Georgina dos Santos",
    image: require("../assets/img1Poco.png"),
    rating: 5,
    comment:
      "dhibsjfhdsbfjsbdhfhsdbfjshdbfsbdhfsdhfjdbhfbsjsdbhfjsbdfbsjhdbfsdsjhfbsdhfbsdhfbsdjhbfsdjbfjsbdhfjsd",
  },
  {
    id: "2",
    name: "Carmen Maria",
    image: require("../assets/img2Poco.png"),
    rating: 4,
    comment: "Bom!",
  },
  {
    id: "3",
    name: "Carlos Almeida",
    image: require("../assets/img1Poco.png"),
    rating: 5,
    comment: "Ótimo serviço!",
  },
];

const Avaliacoes = () => {
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Tamanho fixo para os cards
  const cardWidth = isMobile ? width * 0.85 : 280;
  const cardHeight = 280;

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const handleSubmit = (data) => {
    console.log("Novo depoimento:", data);
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex 
                ? styles.paginationDotActive 
                : styles.paginationDotInactive
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      isMobile && styles.containerMobile
    ]}>
      <Text style={[
        styles.title,
        isMobile && styles.titleMobile
      ]}>
        AVALIAÇÕES E DEPOIMENTOS
      </Text>

      <View style={styles.content}>
        {isMobile ? (
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={data}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              snapToInterval={width}
              snapToAlignment="center"
              decelerationRate="fast"
              getItemLayout={(data, index) => ({
                length: width,
                offset: width * index,
                index,
              })}
              renderItem={({ item }) => (
                <View style={[styles.slide, { width }]}>
                  <View style={[styles.cardContainer, { width: cardWidth, height: cardHeight }]}>
                    <Card {...item} />
                  </View>
                </View>
              )}
            />
            {renderPagination()}
          </View>
        ) : (
          <View style={styles.cardsGrid}>
            {data.map((item) => (
              <View key={item.id} style={[styles.cardWrapper, { width: cardWidth }]}>
                <Card {...item} />
              </View>
            ))}
          </View>
        )}

        {/* Formulário */}
        <View style={[
          styles.formContainer,
          isMobile && styles.formContainerMobile
        ]}>
          <FormAvaliacoes onSubmit={handleSubmit} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2c84be",
    padding: 20,
    paddingTop: 40,
    marginTop: 0,
    borderRadius: 0,
    width: '100%',
    marginBottom: 0,
  },
  containerMobile: {
    padding: 16,
    paddingTop: 30,
    marginTop: 0,
  },
  content: {
    gap: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  titleMobile: {
    fontSize: 24,
    marginBottom: 10,
  },
  carouselContainer: {
    minHeight: 320,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  cardWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#ffffff",
    width: 20,
    height: 8,
  },
  paginationDotInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  formContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  formContainerMobile: {
    paddingHorizontal: 0,
  },
});

export default Avaliacoes;