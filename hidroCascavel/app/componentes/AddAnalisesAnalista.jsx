// componentes/AddAnalisesAnalista.js
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
import { useAuth } from '../contexts/authContext';

const { width } = Dimensions.get('window');
const isDesktop = width >= 768;

const AddAnalisesAnalista = ({ onAdicionarAnalise, pocos, proprietarios, analistas }) => {
  const { user, userData } = useAuth();
  const [formData, setFormData] = useState({
    poco: null,
    dataAnalise: new Date(),
    resultado: '',
    temperaturaAr: '',
    temperaturaAmostra: '',
    ph: '',
    alcalinidade: '',
    acidez: '',
    cor: '',
    turbidez: '',
    condutividadeEletrica: '',
    sdt: '',
    sst: '',
    cloroTotal: '',
    cloroLivre: '',
    coliformesTotais: '',
    ecoli: ''
  });
  const [enviando, setEnviando] = useState(false);

  // Preencher automaticamente o analista logado
  useEffect(() => {
    if (userData?.nome) {
      setFormData(prev => ({
        ...prev,
        analista: {
          id: user.uid,
          nome: userData.nome,
          tipoUsuario: 'analista'
        }
      }));
    }
  }, [userData, user]);

  const handleSubmit = async () => {
    if (!formData.poco || !formData.resultado) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios (*)');
      return;
    }

    try {
      setEnviando(true);

      const analysisData = {
        ...formData,
        pocoId: formData.poco.id,
        pocoNome: formData.poco.nomeProprietario || formData.poco.nome,
        pocoLocalizacao: formData.poco.localizacao,
        proprietario: formData.poco.nomeProprietario,
        proprietarioId: formData.poco.userId,
        analistaId: user.uid,
        analistaNome: userData.nome,
        dataAnalise: formData.dataAnalise.toISOString(),
        tipoCadastro: 'solicitacao_analista',
        status: 'pendente_aprovacao',
        criadoPor: user.uid,
        dataSolicitacao: new Date().toISOString()
      };

      console.log('📤 AddAnalisesAnalista: Enviando solicitação:', analysisData);
      await onAdicionarAnalise(analysisData);
      
      // Reset form
      setFormData({
        poco: null,
        dataAnalise: new Date(),
        resultado: '',
        temperaturaAr: '',
        temperaturaAmostra: '',
        ph: '',
        alcalinidade: '',
        acidez: '',
        cor: '',
        turbidez: '',
        condutividadeEletrica: '',
        sdt: '',
        sst: '',
        cloroTotal: '',
        cloroLivre: '',
        coliformesTotais: '',
        ecoli: ''
      });

      Alert.alert(
        'Solicitação Enviada!', 
        'Sua análise foi enviada para aprovação do administrador.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('❌ AddAnalisesAnalista: Erro na solicitação:', error);
      Alert.alert('Erro', `Não foi possível enviar a solicitação: ${error.message}`);
    } finally {
      setEnviando(false);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderInput = (label, key, placeholder, keyboardType = 'default', required = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={styles.input}
        value={formData[key]}
        onChangeText={(text) => updateFormData(key, text)}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );

  const opcoesPocos = pocos?.map(poco => ({
    id: poco.id,
    nome: poco.nomeProprietario || poco.nome,
    nomeProprietario: poco.nomeProprietario,
    localizacao: poco.localizacao,
    userId: poco.userId,
    ...poco
  })) || [];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Solicitar Cadastro de Análise</Text>
      <Text style={styles.subtitle}>Analista</Text>
      
      <View style={styles.form}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Fluxo do Analista:</Text>
          <Text style={styles.infoText}>
            • Preencha os dados da análise{'\n'}
            • Solicitação enviada para aprovação do admin{'\n'}
            • Após aprovada, a análise aparecerá no sistema{'\n'}
            • Você receberá uma notificação quando aprovada
          </Text>
        </View>

        {/* SEÇÃO INFORMAÇÕES BÁSICAS */}
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        
        <View style={isDesktop ? styles.twoColumns : styles.oneColumn}>
          <View style={styles.column}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Poço *</Text>
              <SelecaoBuscaSeguro
                value={formData.poco}
                onSelect={(poco) => updateFormData('poco', poco)}
                options={opcoesPocos}
                placeholder="Selecione o poço"
                searchKeys={['nome', 'nomeProprietario']}
                displayKey="nome"
              />
            </View>
          </View>
          
          <View style={styles.column}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Analista Responsável</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userData?.nome || ''}
                placeholder="Você é o analista responsável"
                editable={false}
              />
            </View>
          </View>
        </View>

        {/* DATA E RESULTADO */}
        <View style={isDesktop ? styles.twoColumns : styles.oneColumn}>
          <View style={styles.column}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data da Análise</Text>
              <TouchableOpacity style={styles.dateButton}>
                <Text style={styles.dateText}>
                  {formData.dataAnalise.toLocaleDateString('pt-BR')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.column}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Resultado *</Text>
              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.resultado === 'Aprovada' && styles.radioButtonSelected
                  ]}
                  onPress={() => updateFormData('resultado', 'Aprovada')}
                >
                  <Text style={[
                    styles.radioText,
                    formData.resultado === 'Aprovada' && styles.radioTextSelected
                  ]}>
                    Aprovada
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.radioButton,
                    formData.resultado === 'Reprovada' && styles.radioButtonSelected
                  ]}
                  onPress={() => updateFormData('resultado', 'Reprovada')}
                >
                  <Text style={[
                    styles.radioText,
                    formData.resultado === 'Reprovada' && styles.radioTextSelected
                  ]}>
                    Reprovada
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* ... (mantenha as mesmas seções de parâmetros do AddAnalisesAdmin) */}

        {/* BOTÃO SOLICITAR */}
        <View style={styles.fullWidth}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!formData.poco || !formData.resultado) && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={!formData.poco || !formData.resultado || enviando}
          >
            {enviando ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText}>SOLICITAR CADASTRO</Text>
            )}
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
    gap: 20,
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
  required: {
    color: '#FF3B30',
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
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2685BF',
    marginBottom: 20,
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
});

export default AddAnalisesAnalista;