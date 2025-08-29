import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from "react-native";

const Apresentacao = () => {
  const [secaoAtiva, setSecaoAtiva] = useState("quemSomos");

  const screenWidth = Dimensions.get("window").width;
  // Tamanho máximo da imagem
  const maxImageSize = 250;
  // Diminui proporcionalmente em telas pequenas
  const imageSize = Math.min(maxImageSize, screenWidth * 0.35);

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
          <Text style={[styles.link, secaoAtiva === "quemSomos" && styles.linkAtivo]}>
            Quem Somos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSecaoAtiva("oQueFazemos")}>
          <Text style={[styles.link, secaoAtiva === "oQueFazemos" && styles.linkAtivo]}>
            O que fazemos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSecaoAtiva("nossaMissao")}>
          <Text style={[styles.link, secaoAtiva === "nossaMissao" && styles.linkAtivo]}>
            Nossa missão
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo dinâmico */}
      <View style={styles.conteudo}>
        <Image
          source={conteudo[secaoAtiva].imagem}
          style={{ width: imageSize, height: imageSize, marginRight: 20, borderRadius: 10 }}
          resizeMode="contain"
        />

        <View style={{ flex: 1 }}>
          {conteudo[secaoAtiva].lista ? (
            conteudo[secaoAtiva].lista.map((item, index) => (
              <Text key={index} style={styles.itemLista}>
                • {item}
              </Text>
            ))
          ) : (
            <Text style={styles.texto}>{conteudo[secaoAtiva].texto}</Text>
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
    backgroundColor: "#1976D2",
    flex: 1,
    width: "100%",
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  link: {
    fontSize: 24,
    color: "#fff",
    paddingBottom: 5,
  },
  linkAtivo: {
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  conteudo: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "flex-start", // alinha a imagem ao topo do texto
  },
  texto: {
    fontSize: 20,
    color: "#000",
    lineHeight: 28,
  },
  itemLista: {
    fontSize: 20,
    color: "#000",
    marginBottom: 12,
  },
});

export default Apresentacao;
