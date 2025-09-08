import React from "react";
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
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

  const handleSubmit = (data) => {
    console.log("Novo depoimento:", data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avaliações e depoimentos</Text>

      {isMobile ? (
        // Mobile → swipe lateral, 1 por vez
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.cardWrapper, { width }]}>
              <Card {...item} />
            </View>
          )}
        />
      ) : (
        // Desktop/tablet → grid sem rolagem
        <View style={styles.cardsGrid}>
          {data.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <Card {...item} />
            </View>
          ))}
        </View>
      )}

      {/* Formulário abaixo, não sobreposto */}
      <FormAvaliacoes onSubmit={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3498db",
    padding: 15,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 15,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap", // permite quebra automática
    justifyContent: "center",
    marginBottom: 20,
  },
  cardWrapper: {
    flexBasis: 300, // largura base dos cards
    margin: 8,
    alignItems: "stretch",
  },
});

export default Avaliacoes;
