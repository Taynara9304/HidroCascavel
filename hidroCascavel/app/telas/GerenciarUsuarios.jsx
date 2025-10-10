// screens/GerenciarUsuarios.js
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import TabelaUsuarios from '../componentes/TabelaUsuarios';
import useUsuarios from '../hooks/useTabelaUsuarios';

const GerenciarUsuarios = () => {
  const {
    users,
    sortField,
    sortDirection,
    handleSort,
    addUser,
    editUser,
    deleteUser,
  } = useUsuarios();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <TabelaUsuarios
          users={users}
          onEdit={(user) => {
            console.log('Editar usuário:', user);
          }}
          onDelete={deleteUser}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
});

export default GerenciarUsuarios;