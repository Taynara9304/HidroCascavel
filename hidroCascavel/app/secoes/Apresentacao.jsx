import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";

const Apresentacao = () => {
  const [secaoAtiva, setSecaoAtiva] = useState("quemSomos");

  const screenWidth = Dimensions.get("window").width;

  // Define se é mobile (menos que 500px)
  const isMobile = screenWidth < 850;

  // Ajuste proporcional da imagem e fonte
  const imageSize = Math.min(250, isMobile ? screenWidth * 0.8 : 250);
  const fontSize = isMobile ? 16 : 20;
  const lineHeight = fontSize * 1.4;
  
  // Defina tamanhos de fonte responsivos para os links
  const linkFontSize = isMobile ? 15 : 24;

  const conteudo = {
    quemSomos: {
      texto:
        "Somos um projeto de extensão do IFPR Campus Cascavel vinculado ao Itaipu Parquetec.\n\nTemos como objetivo a disseminação e promoção do conhecimento sobre a importância da manutenção da qualidade da água de poços entre os habitantes de Cascavel.",
      imagem: require("../assets/imgMembrosGrupo.png"),
    },
    oQueFazemos: {
      lista: [
        "Analisamos a água de poços e nascentes na área urbana e rural que abastecem Cascavel;",
        "Avaliamos as percepções ambientais dos habitantes;",
        "Promovemos medidas de conscientização para os moradores;",
        "Promovemos acesso ao conhecimento ambiental."
      ],
      imagem: require("../assets/imgMembrosGrupo2.png"),
    },
    nossaMissao: {
      texto:
        "Nossa missão é garantir o acesso a informações confiáveis sobre a qualidade da água e promover a conscientização ambiental em Cascavel e região.\n\nPor meio de análises técnicas e ações educativas, buscamos fortalecer a relação entre a comunidade e os recursos hídricos, incentivando práticas sustentáveis que beneficiem as gerações atuais e futuras.",
      imagem: require("../assets/imgMembrosGrupo3.png"),
    },
  };

  return (
    <View style={styles.container}>
      {/* Menu */}
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => setSecaoAtiva("quemSomos")}>
          <Text style={[
            styles.link, 
            secaoAtiva === "quemSomos" && styles.linkAtivo,
            { fontSize: linkFontSize }
          ]}>
            Quem Somos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSecaoAtiva("oQueFazemos")}>
          <Text style={[
            styles.link, 
            secaoAtiva === "oQueFazemos" && styles.linkAtivo,
            { fontSize: linkFontSize }
          ]}>
            O que fazemos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSecaoAtiva("nossaMissao")}>
          <Text style={[
            styles.link, 
            secaoAtiva === "nossaMissao" && styles.linkAtivo,
            { fontSize: linkFontSize }
          ]}>
            Nossa missão
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <View style={[styles.conteudo, { flexDirection: isMobile ? "column" : "row" }]}>
        <Image
          source={conteudo[secaoAtiva].imagem}
          style={{
            width: imageSize,
            height: imageSize,
            marginRight: isMobile ? 0 : 15,
            marginBottom: isMobile ? 15 : 0,
            borderRadius: 10,
            alignSelf: "center"
          }}
          resizeMode="contain"
        />

        <View style={{ flex: 1 }}>
          {conteudo[secaoAtiva].lista ? (
            conteudo[secaoAtiva].lista.map((item, index) => (
              <Text key={index} style={[styles.itemLista, { fontSize, lineHeight }]}>
                • {item}
              </Text>
            ))
          ) : (
            <Text style={[styles.texto, { fontSize, lineHeight }]}>
              {conteudo[secaoAtiva].texto}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 20,
    backgroundColor: "#3D9DD9",
    flex: 1,
    width: "100%",
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  link: {
    color: "#fff",
    paddingBottom: 5,
  },
  linkAtivo: {
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  conteudo: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  texto: {
    color: "#000",
  },
  itemLista: {
    color: "#000",
    marginBottom: 12,
  },
});

export default Apresentacao;