// componentes/AddVisitas.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import SelectWithSearch from './SelecaoBusca';

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

// Dados mockados para poços
const pocosMock = [
  { id: 1, nome: 'Poço A1', localizacao: '-23.5505, -46.6333', proprietario: 'João Silva' },
  { id: 2, nome: 'Poço B2', localizacao: '-23.5510, -46.6340', proprietario: 'Maria Santos' },
  { id: 3, nome: 'Poço C3', localizacao: '-23.5520, -46.6350', proprietario: 'Pedro Oliveira' },
  { id: 4, nome: 'Poço D4', localizacao: '-23.5530, -46.6360', proprietario: 'Ana Costa' },
];

const AddVisitas = ({ onAdicionarVisita }) => {
  const [formData, setFormData] = useState({
    poco: null,
    dataHora: new Date(),
    situacao: 'pendente',
    observacoes: ''
  });

  const handleSubmit = () => {
    // Validação básica
    if (!formData.poco) {
      Alert.alert('Erro', 'Por favor, selecione um poço');
      return;
    }

    const visitData = {
      ...formData,
      pocoId: formData.poco.id,
      pocoNome: formData.poco.nome,
      localizacao: formData.poco.localizacao,
      proprietario: formData.poco.proprietario,
      dataVisita: formData.dataHora.toISOString(),
    };

    onAdicionarVisita(visitData);
    
    // Reset form
    setFormData({
      poco: null,
      dataHora: new Date(),
      situacao: 'pendente',
      observacoes: ''
    });

    Alert.alert('Sucesso', 'Visita cadastrada com sucesso!');
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adicionar Visita</Text>
      
      <View style={styles.form}>
        {/* SEÇÃO INFORMAÇÕES BÁSICAS */}
        <Text style={styles.sectionTitle}>Informações da Visita</Text>
        
        <View style={isDesktop ? styles.twoColumns : styles.oneColumn}>
          <View style={styles.column}>
            <SelectWithSearch
              label="Poço *"
              value={formData.poco}
              onSelect={(poco) => updateFormData('poco', poco)}
              options={pocosMock}
              placeholder="Selecione o poço visitado"
              searchKeys={['nome', 'proprietario']}
            />
          </View>
          
          <View style={styles.column}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data e Hora</Text>
              <TouchableOpacity style={styles.dateButton}>
                <Text style={styles.dateText}>
                  {formData.dataHora.toLocaleString('pt-BR')}
                </Text>
              </TouchableOpacity>
              <Text style={styles.helpText}>
                Data atual selecionada automaticamente
              </Text>
            </View>
          </View>
        </View>

        {/* SITUAÇÃO */}
        <View style={styles.fullWidth}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Situação</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  formData.situacao === 'pendente' && styles.radioButtonSelected
                ]}
                onPress={() => updateFormData('situacao', 'pendente')}
              >
                <Text style={[
                  styles.radioText,
                  formData.situacao === 'pendente' && styles.radioTextSelected
                ]}>
                  Pendente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  formData.situacao === 'concluida' && styles.radioButtonSelected
                ]}
                onPress={() => updateFormData('situacao', 'concluida')}
              >
                <Text style={[
                  styles.radioText,
                  formData.situacao === 'concluida' && styles.radioTextSelected
                ]}>
                  Concluída
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* OBSERVAÇÕES */}
        <View style={styles.fullWidth}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.observacoes}
              onChangeText={(text) => updateFormData('observacoes', text)}
              placeholder="Digite observações sobre a visita..."
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* BOTÃO CADASTRAR */}
        <View style={styles.fullWidth}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>CADASTRAR VISITA</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    paddingTop: 8,
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
    fontSize: 14,
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
  helpText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  radioButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
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
  submitButton: {
    backgroundColor: '#2685BF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    minHeight: 50,
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddVisitas;