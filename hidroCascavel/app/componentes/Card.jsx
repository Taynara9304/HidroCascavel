import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Card = ({ name, image, rating, comment }) => {
  // Limita o comentário a 100 caracteres e adiciona reticências se necessário
  const truncatedComment = comment.length > 100 
    ? comment.substring(0, 100) + '...' 
    : comment;

  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.stars}>{"⭐".repeat(rating)}</Text>
      <Text style={styles.comment}>{truncatedComment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    // Removidas as propriedades de sombra
    height: '100%', // Para ocupar toda a altura do container
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    color: "#333",
  },
  stars: {
    fontSize: 20,
    marginBottom: 8,
    color: "#FFD700",
  },
  comment: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    flexWrap: 'wrap',
    width: '100%',
  },
});

export default Card;