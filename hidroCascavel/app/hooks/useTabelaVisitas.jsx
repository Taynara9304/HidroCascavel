// hooks/useTabelaVisitas.js
import { useState, useMemo } from 'react';

// Dados mockados para visitas
const initialVisitsData = [
  {
    id: 1,
    pocoId: 1,
    pocoNome: 'Poço A1',
    localizacao: '-23.5505, -46.6333',
    proprietario: 'João Silva',
    dataVisita: '2024-01-15T10:30:00',
    situacao: 'concluida',
    observacoes: 'Visita de rotina - tudo em ordem'
  },
  {
    id: 2,
    pocoId: 2,
    pocoNome: 'Poço B2',
    localizacao: '-23.5510, -46.6340',
    proprietario: 'Maria Santos',
    dataVisita: '2024-02-20T14:15:00',
    situacao: 'concluida',
    observacoes: 'Necessita manutenção preventiva'
  },
  {
    id: 3,
    pocoId: 3,
    pocoNome: 'Poço C3',
    localizacao: '-23.5520, -46.6350',
    proprietario: 'Pedro Oliveira',
    dataVisita: '2024-03-25T09:00:00',
    situacao: 'pendente',
    observacoes: 'Agendada para vistoria'
  },
];

const useTabelaVisitas = (initialVisits = initialVisitsData) => {
  const [visits, setVisits] = useState(initialVisits || []);
  const [sortField, setSortField] = useState('dataVisita');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedVisits = useMemo(() => {
    if (!visits || !Array.isArray(visits)) return [];
    
    const sorted = [...visits].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'dataVisita') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [visits, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const addVisit = (visit) => {
    const newVisit = {
      ...visit,
      id: Math.max(...(visits?.map(v => v.id) || [0]), 0) + 1,
    };
    setVisits(prev => [...(prev || []), newVisit]);
  };

  const editVisit = (id, updatedVisit) => {
    setVisits(prev => (prev || []).map(visit => 
      visit.id === id ? { ...visit, ...updatedVisit } : visit
    ));
  };

  const deleteVisit = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta visita?')) {
      setVisits(prev => (prev || []).filter(visit => visit.id !== id));
    }
  };

  return {
    visits: sortedVisits,
    sortField,
    sortDirection,
    handleSort,
    addVisit,
    editVisit,
    deleteVisit,
  };
};

export default useTabelaVisitas;