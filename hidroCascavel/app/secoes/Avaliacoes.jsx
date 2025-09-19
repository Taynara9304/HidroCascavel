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

  // Margens laterais para o card no mobile
  const CARD_MARGIN = 20;
  const cardWidth = width - (CARD_MARGIN * 2);

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
              renderItem={({ item }) => (
                <View style={[styles.cardWrapperMobile, { width: cardWidth }]}>
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
              <View key={item.id} style={styles.cardWrapper}>
                <Card {...item} />
              </View>
            ))}
          </View>
        )}

        {/* Formulário */}
        <View style={styles.formContainer}>
          <FormAvaliacoes onSubmit={handleSubmit} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3498db",
    padding: 20,
    paddingTop: 40,
    marginTop: 10,
    borderRadius: 10,
    width: '100%',
  },
  content: {
    gap: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  carouselContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
    minHeight: 300,
  },
  flatListContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 15,
  },
  cardWrapper: {
    width: 280,
    elevation: 5,
  },
  cardWrapperMobile: {
    elevation: 5,
    marginHorizontal: 10,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  paginationDotActive: {
    backgroundColor: "#ffffff",
    width: 12,
    height: 12,
  },
  paginationDotInactive: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  formContainer: {
    width: '100%',
    alignSelf: 'center',
  },
  contactSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 10,
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default Avaliacoes;