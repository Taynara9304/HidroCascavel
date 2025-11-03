// telas/DeixarAvaliacao.jsx (Simplificado - Sem Imagem)
import React, { useState } from 'react'; // 1. Importar useState
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, updateDoc, collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebaseConfig'; // 2. Não importa mais 'storage'
import { useAuth } from '../contexts/authContext';
import FormAvaliacoes from '../componentes/FormAvaliacoes';

const DeixarAvaliacao = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, userData } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false); // 3. Para evitar double-click

  const { notificationId, analiseId, pocoId } = route.params;

  // 4. 'handleSubmit' simplificado
  const handleSubmit = async (data) => {
    // data é apenas { comment, rating }
    const { comment, rating } = data;

    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para avaliar.');
      return;
    }
    
    if (isSubmitting) return; // Evita envio duplo
    setIsSubmitting(true);

    try {
      // 1. Salva a nova avaliação na coleção 'avaliacoes'
      await addDoc(collection(db, 'avaliacoes'), {
        comment: comment,
        rating: rating,
        imageURL: null, // 5. Salva 'null' para a imagem
        userId: user.uid,
        userName: userData?.nome || 'Usuário Anônimo',
        createdAt: Timestamp.now(),
        analiseId: analiseId,
        pocoId: pocoId,
      });

      // 2. Atualiza a notificação
      const notifRef = doc(db, 'notifications', notificationId);
      await updateDoc(notifRef, {
        statusAvaliacao: 'concluida',
      });

      Alert.alert('Obrigado!', 'Sua avaliação foi enviada com sucesso.');
      navigation.goBack();

    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
      Alert.alert('Erro', 'Não foi possível enviar sua avaliação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Avaliar Serviço</Text>
        <Text style={styles.subtitle}>
          Conte-nos o que achou do serviço de análise do seu poço.
        </Text>
        
        {/* 6. Passa 'isSubmitting' para o formulário */}
        <FormAvaliacoes 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c84be',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  // Estilos de loading foram removidos
});

export default DeixarAvaliacao;