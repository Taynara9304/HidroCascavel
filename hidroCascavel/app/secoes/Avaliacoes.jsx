import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Card from "../componentes/Card";
import FormAvaliacoes from "../componentes/FormAvaliacoes";

const Avaliacoes = () => {
  const handleSubmit = (data) => {
    console.log("Novo depoimento:", data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Avaliações e depoimentos</Text>

      {/* Linha com cards + veja mais */}
      <View style={styles.cardsRow}>
        <View style={styles.cardsContainer}>
          <Card
            name="Georgina dos Santos"
            image={require("../assets/img1Poco.png")}
            rating={5}
            comment="Meninas muito educadas, excelente atendimento. A coleta é rápida e o resultado é detalhado."
          />
          <Card
            name="Carmen Maria"
            image={require("../assets/img2Poco.png")}
            rating={4}
            comment="Bom!"
          />
        </View>

        <View style={styles.vejaMais}>
          <Text style={styles.arrow}>»</Text>
          <Text style={styles.vejaMaisText}>Veja mais</Text>
        </View>
      </View>

      {/* Formulário logo abaixo */}
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
  cardsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",        // evita overflow
    flex: 1,
    gap: 10,
  },
  vejaMais: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    width: 70,              // largura fixa p/ não empurrar
  },
  arrow: {
    fontSize: 28,
    color: "#fff",
  },
  vejaMaisText: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    marginBottom: 15,
  },
});

export default Avaliacoes;
