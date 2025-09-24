import React from "react";
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, TouchableOpacity } from 'react-native';
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
    const navigation = useNavigation();

    const marcadores = [
        {
        latitude: -23.5505,
        longitude: -46.6333,
        titulo: 'Visita Técnica - SP',
        endereco: 'Av. Paulista, 1000, São Paulo - SP',
        data: '15/01/2024',
        responsavel: 'Carlos Silva',
        status: 'Agendado'
        },
        {
        latitude: -23.5489,
        longitude: -46.6388,
        titulo: 'Manutenção Preventiva',
        endereco: 'Rua Augusta, 500, São Paulo - SP',
        data: '18/01/2024',
        responsavel: 'Ana Santos',
        status: 'Pendente'
        }
    ];

    const handleLocationSelect = (location) => {
        console.log('Localização selecionada:', location);
    };

    return (
        <ScrollView>
            <View style={[styles.container, { width: contentWidth }]}>
                <View style={styles.containerNavBar}>
                    <NavBar />
                </View>

                <View style={[styles.containerPopUps, { width: contentWidth }]}>
                    <View>
                        <PopUp texto="Total de poços" num="1" img={iconeMundo} />
                        <PopUp texto="Análises realizadas" num="2" img={iconeQuimica} />
                    </View>
                    
                    <View>
                        <PopUp texto="Visitas agendadas" num="3" img={iconeCalendario} />
                        <PopUp texto="Usuários cadastrados" num="4" img={iconePessoa} />
                    </View>
                </View>

                <View style={styles.containerItems}>
                    <Calendario />
                </View>

                <View style={styles.containerItems}>
                    <TabelaVisitas />
                </View>

                <View style={styles.containerItems}>
                    <MapaUniversal 
                        onLocationSelect={handleLocationSelect}
                        markers={marcadores}
                    />
                </View>

                <View style={styles.containerPopUps}>
                <TouchableOpacity
                    style={[styles.navItem, styles.loginButton]}
                    onPress={() => {
                    navigation.navigate("GerenciarUsuarios");
                    }}
                >
                    <BotaoFuncionalidades texto="Gerenciar poços" />
              </TouchableOpacity>

                    <BotaoFuncionalidades texto="Gerenciar visitas" />
                    <BotaoFuncionalidades texto="Gerenciar análises" />
                    <BotaoFuncionalidades texto="Gerenciar usuários" />
                </View>

                <View style={styles.containerBotaoRelatorio}>
                    <BotaoFuncionalidades texto="Gerar relatórios" />
                </View>
            </View>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "flex-start",
            margin: 'auto',
            padding: 10,
        },
        containerNavBar: {
            width: '100%',
            height: 150,
        },
        containerPopUps: {
            display: 'flex',
            justifyContent: "center",
            flexDirection: "row",
            flexWrap: 'wrap',
            gap: 5,
            width: '100%',
        },
        containerItems: {
            width: '100%',
        },
        containerBotaoRelatorio: {
            width: '100%',
            flex: 1,
            marginTop: 20,
            display: 'flex',
            justifyContent: "center",
            flexDirection: "row",
        }
    }
)

export default HomeAdm;