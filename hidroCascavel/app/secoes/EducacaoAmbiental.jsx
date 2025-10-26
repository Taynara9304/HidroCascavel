import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const EducacaoAmbiental = () => {
  const [dropdownAberto, setDropdownAberto] = useState(null);

  const toggleDropdown = (dropdown) => {
    if (dropdownAberto === dropdown) {
      setDropdownAberto(null);
    } else {
      setDropdownAberto(dropdown);
    }
  };

  const screenWidth = Dimensions.get("window").width;
  const isMobile = screenWidth < 850;
  const linkFontSize = isMobile ? 10 : 16;

  const conteudos = {
    informacoes: {
      titulo: "Informações sobre poços",
      texto: `Os poços são estruturas fundamentais para o acesso à água subterrânea, especialmente em regiões onde o abastecimento público é limitado.\n\n• Acesso à água potável em áreas remotas\n• Redução da dependência de sistemas públicos de abastecimento\n• Sustentabilidade hídrica quando bem manejados\n• Alternativa para períodos de seca`
    },
    importancia: {
      titulo: "Importância da água", 
      texto: `A água é essencial para a vida e desempenha papéis cruciais nos ecossistemas, agricultura e saúde humana.\n\n• Regulação da temperatura corporal\n• Transporte de nutrientes\n• Irrigação agrícola\n• Geração de energia`
    },
    cuidados: {
      titulo: "Cuidados ambientais",
      texto: `A preservação da água depende de boas práticas ambientais.\n\n• Uso consciente dos recursos\n• Proteção de nascentes\n• Tratamento de esgoto\n• Redução da poluição industrial`
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>EDUCAÇÃO AMBIENTAL</Text>
      
      {/* Dropdown para Informações sobre poços */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          onPress={() => toggleDropdown('informacoes')}
          style={[
            styles.dropdownButton,
            dropdownAberto === 'informacoes' && styles.dropdownButtonAtivo
          ]}
        >
          <Text style={[
            styles.dropdownButtonText,
            { fontSize: linkFontSize }
          ]}>
            INFORMAÇÕES SOBRE POÇOS
          </Text>
        </TouchableOpacity>
        
        {dropdownAberto === 'informacoes' && (
          <View style={styles.dropdownContent}>
            <Text style={styles.texto}>
              {conteudos.informacoes.texto}
            </Text>
          </View>
        )}
      </View>

      {/* Dropdown para Importância da água */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          onPress={() => toggleDropdown('importancia')}
          style={[
            styles.dropdownButton,
            dropdownAberto === 'importancia' && styles.dropdownButtonAtivo
          ]}
        >
          <Text style={[
            styles.dropdownButtonText,
            { fontSize: linkFontSize }
          ]}>
            IMPORTÂNCIA DA ÁGUA
          </Text>
        </TouchableOpacity>
        
        {dropdownAberto === 'importancia' && (
          <View style={styles.dropdownContent}>
            <Text style={styles.texto}>
              {conteudos.importancia.texto}
            </Text>
          </View>
        )}
      </View>

      {/* Dropdown para Cuidados ambientais */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          onPress={() => toggleDropdown('cuidados')}
          style={[
            styles.dropdownButton,
            dropdownAberto === 'cuidados' && styles.dropdownButtonAtivo
          ]}
        >
          <Text style={[
            styles.dropdownButtonText,
            { fontSize: linkFontSize }
          ]}>
            CUIDADOS AMBIENTAIS
          </Text>
        </TouchableOpacity>
        
        {dropdownAberto === 'cuidados' && (
          <View style={styles.dropdownContent}>
            <Text style={styles.texto}>
              {conteudos.cuidados.texto}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    padding: 20,
    backgroundColor: '#3D9DD9',
    borderRadius: 0,
    width: '100%',
    alignItems: 'center',
    marginBottom: 0,
  },
  titulo: {
    fontSize: 30,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 10,
  },
  dropdownButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  dropdownButtonAtivo: {
    backgroundColor: "#2B7BB9",
    borderColor: "#fff",
  },
  dropdownButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  dropdownContent: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginTop: 5,
  },
  texto: {
    fontSize: 16,
    color: '#000',
    textAlign: 'justify',
    lineHeight: 24,
  },
});

export default EducacaoAmbiental;