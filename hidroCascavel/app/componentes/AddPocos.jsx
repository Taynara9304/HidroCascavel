import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import InputMapa from './InputMapa';
import InputProprietario from './InputProprietario';
import InputObservacoes from './InputObservacoes';

const AddPocos = ({ onAdicionarPoco }) => {
    const [localizacao, setLocalizacao] = useState(null);
    const [proprietario, setProprietario] = useState(null);
    const [observacoes, setObservacoes] = useState('');

    // Debug para ver quando a localização muda
    useEffect(() => {
        console.log('AddPocos: localizacao atualizada', localizacao);
    }, [localizacao]);

    const handleCadastrar = () => {
        console.log('AddPocos: Tentando cadastrar com:', { localizacao, proprietario, observacoes });

        // Validação dos campos
        if (!localizacao) {
            Alert.alert('Erro', 'Por favor, selecione a localização do poço no mapa.');
            return;
        }

        if (!proprietario) {
            Alert.alert('Erro', 'Por favor, selecione o proprietário do poço.');
            return;
        }

        // Criar objeto do poço no formato esperado pela tabela
        const novoPoco = {
            latitude: localizacao.latitude.toString(),
            longitude: localizacao.longitude.toString(),
            owner: proprietario.nome,
            observations: observacoes,
            lastAnalysis: new Date().toISOString().split('T')[0],
        };

        console.log('AddPocos: Poço criado para enviar', novoPoco);

        // Chamar função de callback para adicionar o poço
        if (onAdicionarPoco) {
            console.log('AddPocos: Chamando onAdicionarPoco prop');
            onAdicionarPoco(novoPoco);
        } else {
            console.log('AddPocos: onAdicionarPoco prop não está definida');
        }

        // Limpar formulário
        setLocalizacao(null);
        setProprietario(null);
        setObservacoes('');

        Alert.alert('Sucesso', 'Poço cadastrado com sucesso!');
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}>Adicionar Poço</Text>

            <View style={styles.formContainer}>
                {/* Input de Localização com Mapa */}
                <InputMapa
                    label="Localização"
                    value={localizacao}
                    onChange={setLocalizacao}
                    placeholder="Clique para selecionar a localização no mapa"
                />

                {/* Input de Proprietário com Autocomplete */}
                <InputProprietario
                    label="Proprietário"
                    value={proprietario}
                    onChange={setProprietario}
                    placeholder="Clique para selecionar o proprietário"
                />

                {/* Input de Observações */}
                <InputObservacoes
                    label="Observações"
                    value={observacoes}
                    onChange={setObservacoes}
                    placeholder="Digite observações sobre o poço (opcional)"
                />

                {/* Botão de Cadastrar */}
                <TouchableOpacity
                    style={styles.cadastrarButton}
                    onPress={handleCadastrar}
                >
                    <Text style={styles.cadastrarButtonText}>CADASTRAR POÇO</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        marginTop: 16,
        color: '#333',
    },
    formContainer: {
        padding: 16,
    },
    cadastrarButton: {
        backgroundColor: '#2685BF',
        padding: 16,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 24,
    },
    cadastrarButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddPocos;