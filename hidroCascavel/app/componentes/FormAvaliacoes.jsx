import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

const FormAvaliacoes = ({ onSubmit }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Deixe seu depoimento:</Text>
      <TextInput
        style={styles.input}
        placeholder="Escreva aqui..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <Text style={styles.label}>Deixe sua avaliação:</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.star, rating >= star && styles.activeStar]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onSubmit({ comment, rating })}
      >
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#5dade2",
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 4,
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },
  starsRow: {
    flexDirection: "row",
    marginVertical: 6,
  },
  star: {
    fontSize: 22,
    color: "#ccc",
    marginRight: 6,
  },
  activeStar: {
    color: "#FFD700",
  },
  button: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2980b9",
  },
  buttonText: {
    fontSize: 16,
    color: "#2980b9",
    fontWeight: "bold",
  },
});

export default FormAvaliacoes;
