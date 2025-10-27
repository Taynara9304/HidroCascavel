// componentes/AddVisitasAnalista.js - ATUALIZADO
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import SelecaoBuscaSeguro from './SelecaoBusca';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/authContext';

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

const AddVisitasAnalista = ({ onAdicionarVisita }) => {
  const { user, userData } = useAuth();
  const [formData, setFormData] = useState({
    poco: null,
    dataHora: new Date(),
    situacao: 'concluida',
    observacoes: '',
    resultado: '',
    recomendacoes: ''
  });
  const [pocos, setPocos] = useState([]);
  const [carregandoPocos, setCarregandoPocos] = useState(true);

  // Analista pode ver TODOS os poços
  useEffect(() => {
    console.log('📡 AddVisitasAnalista: Buscando TODOS os poços');
    
    const pocosCollection = collection(db, 'wells');
    const q = query(pocosCollection, orderBy('nomeProprietario'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const pocosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setPocos(pocosData);
        setCarregandoPocos(false);
      },
      (error) => {
        console.error('❌ Erro ao carregar poços:', error);
        Alert.alert('Erro', 'Não foi possível carregar os poços');
        setCarregandoPocos(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!formData.poco) {
      Alert.alert('Erro', 'Por favor, selecione um poço');
      return;
    }

    try {
      const visitData = {
        ...formData,
        pocoId: formData.poco.id,
        pocoNome: formData.poco.nomeProprietario,
        pocoLocalizacao: formData.poco.localizacao,
        proprietario: formData.poco.nomeProprietario,
        dataVisita: formData.dataHora.toISOString(),
        tipo: 'registro_analista',
        status: 'pendente_aprovacao',
        criadoPor: user.uid,
        tipoUsuario: userData?.tipoUsuario || 'analista', // ← Use tipoUsuario
        userId: formData.poco.userId,
        dataSolicitacao: new Date().toISOString()
      };

      await onAdicionarVisita(visitData);
      
      setFormData({
        poco: null,
        dataHora: new Date(),
        situacao: 'concluida',
        observacoes: '',
        resultado: '',
        recomendacoes: ''
      });

      Alert.alert(
        'Registro Enviado!', 
        'Seu registro de visita foi enviado para aprovação do administrador.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('❌ Erro ao enviar registro:', error);
      Alert.alert('Erro', 'Não foi possível enviar o registro de visita');
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const opcoesPocos = pocos.map(poco => ({
    id: poco.id,
    nome: poco.nomeProprietario,
    nomeProprietario: poco.nomeProprietario,
    localizacao: poco.localizacao,
    proprietario: poco.nomeProprietario,
    userId: poco.userId,
    ...poco
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registrar Visita Técnica</Text>
      <Text style={styles.subtitle}>Analista</Text>
      
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Informações da Visita</Text>
        
        <View style={isDesktop ? styles.twoColumns : styles.oneColumn}>
          <View style={styles.column}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Poço Visitado *</Text>
              {carregandoPocos ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#2685BF" />
                  <Text style={styles.loadingText}>Carregando poços...</Text>
                </View>
              ) : (
                <SelecaoBuscaSeguro
                  value={formData.poco}
                  onSelect={(poco) => updateFormData('poco', poco)}
                  options={opcoesPocos}
                  placeholder="Selecione qualquer poço"
                  searchKeys={['nome', 'proprietario']}
                  displayKey="nome"
                />
              )}
            </View>
          </View>
          
          <View style={styles.column}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data da Visita</Text>
              <TouchableOpacity style={styles.dateButton}>
                <Text style={styles.dateText}>
                  {formData.dataHora.toLocaleString('pt-BR')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.fullWidth}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações da Visita</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.observacoes}
              onChangeText={(text) => updateFormData('observacoes', text)}
              placeholder="Descreva as condições do poço, problemas encontrados..."
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.fullWidth}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Resultados e Análises</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.resultado}
              onChangeText={(text) => updateFormData('resultado', text)}
              placeholder="Resultados das análises, medições, etc..."
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.fullWidth}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recomendações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.recomendacoes}
              onChangeText={(text) => updateFormData('recomendacoes', text)}
              placeholder="Recomendações para o proprietário..."
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Fluxo do Analista:</Text>
          <Text style={styles.infoText}>
            • Selecione QUALQUER poço do sistema{'\n'}
            • Registre os dados da visita realizada{'\n'}
            • Registro enviado para aprovação do admin{'\n'}
            • Após aprovado, aparecerá no histórico
          </Text>
        </View>

        <View style={styles.fullWidth}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              !formData.poco && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={!formData.poco}
          >
            <Text style={styles.submitButtonText}>
              📋 ENVIAR PARA APROVAÇÃO
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Adicione isso ao final de AddVisitasAnalista.js e AddVisitasAdmin.js
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2685BF',
    paddingTop: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  form: {
    padding: 16,
    gap: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#2685BF',
    paddingBottom: 8,
  },
  oneColumn: {
    gap: 16,
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  inputGroup: {
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    minHeight: 50,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2685BF',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2685BF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: '#2685BF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    minHeight: 50,
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos específicos para admin (radio buttons)
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  radioButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  radioButtonSelected: {
    backgroundColor: '#2685BF',
    borderColor: '#2685BF',
  },
  radioText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  radioTextSelected: {
    color: 'white',
  },
});

export default AddVisitasAnalista;