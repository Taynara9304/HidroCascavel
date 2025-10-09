import React from 'react';
import { View, ScrollView } from 'react-native';
import TabelaPocos from '../componentes/TabelaPocos';
import AddPocos from '../componentes/AddPocos';
import useWells from '../hooks/useTabelaPocos';

const GerenciarPocos = () => {
  const {
    wells,
    sortField,
    sortDirection,
    handleSort,
    addWell,
    editWell,
    deleteWell,
  } = useWells();

  const handleAdicionarPoco = (novoPoco) => {
    console.log('GerenciarPocos: Recebendo novo poço', novoPoco);
    
    // Chamar a função addWell do hook
    addWell(novoPoco);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      <TabelaPocos
        wells={wells}
        onEdit={(well) => {
          console.log('Editar poço:', well);
        }}
        onDelete={deleteWell}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      
      <AddPocos onAdicionarPoco={handleAdicionarPoco} />
    </ScrollView>
  );
};

export default GerenciarPocos;