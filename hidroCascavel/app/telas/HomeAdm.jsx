import React from "react";
import { View, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
import PopUp from "../componentes/PopUp";
import Calendario from "../componentes/Calendario";
import TabelaVisitas from '../componentes/TabelaVisitas';
import NavBar from '../componentes/NavBarHome';
import MapaUniversal from '../componentes/MapaUniversalPocos';
import BotaoFuncionalidades from "../componentes/BotaoFuncionalidades";
import iconeMundo from '../assets/iconeMundo.png';
import iconePessoa from "../assets/iconePessoa.png";
import iconeQuimica from '../assets/iconeQuimica.png';
import iconeCalendario from '../assets/iconeCalendario.png';
import { useNavigation } from "@react-navigation/native";

const HomeAdm = () => {
    const { width } = useWindowDimensions();
    const contentWidth = width < 800 ? width : width * 0.6;
    const isMobile = width < 800;
    
    const navigation = useNavigation();

    // Função simples para lidar com seleção de localização (se necessário)
    const handleLocationSelect = (location) => {
        console.log('Localização selecionada:', location);
    };

    // Funções de navegação
    const navigateToGerenciarPocos = () => {
        navigation.navigate("GerenciarPocos");
    };

    const navigateToGerenciarVisitas = () => {
        navigation.navigate("GerenciarVisitas");
    };

    const navigateToGerenciarAnalises = () => {
        navigation.navigate("GerenciarAnalises");
    };

    const navigateToGerenciarUsuarios = () => {
        navigation.navigate("GerenciarUsuarios");
    };

    // NOVA FUNÇÃO: Navegar para Gerenciar Relatórios
    const navigateToGerenciarRelatorios = () => {
        navigation.navigate("GerenciarRelatorios");
    };

    // Styles DEFINIDOS DENTRO do componente para acessar isMobile
    const styles = StyleSheet.create({
        scrollView: {
            flex: 1,
            backgroundColor: "#fff",
        },
        container: {
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "flex-start",
            margin: 'auto',
            padding: 10,
        },
        containerNavBar: {
            top: isMobile ? 20 : 0,
            width: '100%',
            height: 150,
        },
        containerPopUps: {
            top: isMobile ? -50 : 0,
            display: 'flex',
            justifyContent: "center",
            flexDirection: "row",
            flexWrap: 'wrap',
            gap: 10,
            width: '100%',
            marginVertical: 10,
        },
        containerItems: {
            top: isMobile ? -60 : 0,
            width: '100%',
            marginVertical: 10,
        },
        containerBotaoRelatorio: {
            width: '100%',
            marginTop: 20,
            marginBottom: 40,
            display: 'flex',
            justifyContent: "center",
            flexDirection: "row",
        },
        navItem: {
            margin: 5,
        }
    });

    const irHome = () => {
        navigation.navigate("HomeProprietario");
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={[styles.container, { width: contentWidth }]}>
                <View style={styles.containerNavBar}>
                    <NavBar />
                </View>

                <View style={[styles.containerPopUps, { width: contentWidth }]}>
                    <View>
                        <PopUp texto="Total de poços" num="1" img={iconeMundo} />
                    </View>
                    <View>
                        <PopUp texto="Análises realizadas" num="2" img={iconeQuimica} />
                    </View>
                    
                    <View>
                        <PopUp texto="Visitas agendadas" num="3" img={iconeCalendario} />
                    </View>

                    <View>
                        <PopUp texto="Usuários cadastrados" num="4" img={iconePessoa} />
                    </View>

                    <TouchableOpacity
                    onPress={irHome}>
                        oi
                    </TouchableOpacity>
                </View>

                <View style={styles.containerItems}>
                    <Calendario />
                </View>

                <View style={styles.containerItems}>
                    <TabelaVisitas />
                </View>

                <View style={styles.containerItems}>
                    {/* MapaUniversal gerencia seus próprios marcadores */}
                    <MapaUniversal onLocationSelect={handleLocationSelect} />
                </View>

                <View style={styles.containerPopUps}>
                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={navigateToGerenciarPocos}
                    >
                        <BotaoFuncionalidades texto="Gerenciar poços" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={navigateToGerenciarVisitas}
                    >
                        <BotaoFuncionalidades texto="Gerenciar visitas" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={navigateToGerenciarAnalises}
                    >
                        <BotaoFuncionalidades texto="Gerenciar análises" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.navItem}
                        onPress={navigateToGerenciarUsuarios}
                    >
                        <BotaoFuncionalidades texto="Gerenciar usuários" />
                    </TouchableOpacity>
                </View>

                {/* BOTÃO GERAR RELATÓRIOS ATUALIZADO */}
                <View style={styles.containerBotaoRelatorio}>
                    <TouchableOpacity
                        onPress={navigateToGerenciarRelatorios}
                    >
                        <BotaoFuncionalidades texto="Gerar relatórios" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export default HomeAdm;