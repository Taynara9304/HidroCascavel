import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Card = ({ name, image, rating, comment }) => {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.stars}>{"⭐".repeat(rating)}</Text>
      <Text style={styles.comment}>{comment}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // ocupa todo o espaço do wrapper
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    minHeight: 220,           // garante altura boa
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 8,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
  },
  comment: {
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
});


export default Card;
