import { useState, useMemo } from 'react';

// Dados mockados movidos para dentro do hook
const initialWellsData = [
  {
    id: 1,
    latitude: '-23.5505',
    longitude: '-46.6333',
    owner: 'João Silva',
    lastAnalysis: '2024-01-15',
    observations: 'Poço em bom estado'
  },
  {
    id: 2,
    latitude: '-23.5510',
    longitude: '-46.6340',
    owner: 'Maria Santos',
    lastAnalysis: '2024-02-20',
    observations: 'Necessita manutenção'
  },
  {
    id: 3,
    latitude: '-23.5520',
    longitude: '-46.6350',
    owner: 'Pedro Oliveira',
    lastAnalysis: '2024-03-10',
    observations: ''
  },
];

const useTabelaPocos = (initialWells = initialWellsData) => {
  const [wells, setWells] = useState(initialWells);
  const [sortField, setSortField] = useState('lastAnalysis');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedWells = useMemo(() => {
    const sorted = [...wells].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'lastAnalysis') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [wells, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const addWell = (well) => {
    const newWell = {
      ...well,
      id: Math.max(...wells.map(w => w.id), 0) + 1,
      createdAt: new Date().toISOString(),
    };
    setWells(prev => [...prev, newWell]);
  };

  const editWell = (id, updatedWell) => {
    setWells(prev => prev.map(well => 
      well.id === id ? { ...well, ...updatedWell } : well
    ));
  };

  const deleteWell = (id) => {
    // Para web
    if (window.confirm('Tem certeza que deseja excluir este poço?')) {
      setWells(prev => prev.filter(well => well.id !== id));
    }
  };

  return {
    wells: sortedWells,
    sortField,
    sortDirection,
    handleSort,
    addWell,
    editWell,
    deleteWell,
  };
};

export default useTabelaPocos;