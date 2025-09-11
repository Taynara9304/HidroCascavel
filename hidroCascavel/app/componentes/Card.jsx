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
      "Meninas muito educadas, excelente atendimento. A coleta é rápida e o resultado é detalhado.",
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
  const { width, height } = useWindowDimensions();
  const isMobile = width < 600;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const cardWidth = width * 0.85;

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const index = Math.floor(contentOffset.x / viewSize.width);
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
    <View style={styles.container}>
      <Text style={styles.title}>Avaliações e depoimentos</Text>

      <View style={styles.content}>
        {/* SEÇÃO DOS CARDS */}
        <View style={styles.cardsSection}>
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
                snapToAlignment="center"
                renderItem={({ item }) => (
                  <View style={[styles.cardContainer, { width: cardWidth }]}>
                    <Card {...item} />
                  </View>
                )}
                contentContainerStyle={styles.flatListContent}
              />
              {renderPagination()}
            </View>
          ) : (
            <View style={styles.cardsGrid}>
              {data.map((item) => (
                <View key={item.id} style={styles.cardContainer}>
                  <Card {...item} />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* FORMULÁRIO - ESPAÇAMENTO REDUZIDO */}
        <View style={styles.formContainer}>
          <FormAvaliacoes onSubmit={handleSubmit} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3498db",
    padding: 20,
    paddingTop: 30, // Reduzido
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28, // Um pouco menor
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20, // Reduzido
  },
  cardsSection: {
    flex: 0, // Remove flex para não expandir demais
    marginBottom: 10, // ESPAÇAMENTO REDUZIDO AQUI
  },
  carouselContainer: {
    height: 320, // Altura fixa
    marginBottom: 15,
  },
  flatListContent: {
    alignItems: 'center',
  },
  cardContainer: {
    marginHorizontal: 10,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 5, // Reduzido
  },
  paginationDot: {
    width: 8, // Menor
    height: 8, // Menor
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#ffffff",
  },
  paginationDotInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  formContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    marginTop: 10, // ESPAÇAMENTO REDUZIDO AQUI
  },
});

export default Avaliacoes;