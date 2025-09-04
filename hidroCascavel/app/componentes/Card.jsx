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
    card: {
        backgroundColor: "#3498db",
        borderRadius: 10,
        padding: 10,
        margin: 8,
        width: 160,
    },      
  image: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    marginBottom: 5,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  stars: {
    fontSize: 14,
    marginVertical: 4,
  },
  comment: {
    fontSize: 12,
    color: "#fff",
  },
});

export default Card;
