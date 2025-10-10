// hooks/useTabelaAnalises.js
import { useState, useMemo } from 'react';

// Dados mockados para poços, proprietários e analistas
const initialPocos = [
  { id: 1, nome: 'Poço A1', proprietario: 'João Silva' },
  { id: 2, nome: 'Poço B2', proprietario: 'Maria Santos' },
  { id: 3, nome: 'Poço C3', proprietario: 'Pedro Oliveira' },
  { id: 4, nome: 'Poço D4', proprietario: 'Ana Costa' },
];

const initialProprietarios = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com' },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com' },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com' },
  { id: 4, nome: 'Ana Costa', email: 'ana@email.com' },
  { id: 5, nome: 'Carlos Souza', email: 'carlos@email.com' },
];

const initialAnalistas = [
  { id: 1, nome: 'Laboratório Central', tipo: 'Laboratório' },
  { id: 2, nome: 'Carlos Silva', tipo: 'Analista' },
  { id: 3, nome: 'Ana Santos', tipo: 'Analista' },
  { id: 4, nome: 'Lab Química Avançada', tipo: 'Laboratório' },
];

const initialAnalysesData = [
  {
    id: 1,
    pocoId: 1,
    pocoNome: 'Poço A1',
    proprietario: 'João Silva',
    analista: 'Carlos Silva',
    dataAnalise: '2024-01-15',
    resultado: 'Aprovada',
    temperaturaAr: 25.5,
    temperaturaAmostra: 22.0,
    ph: 7.2,
    alcalinidade: 120,
    acidez: 15,
    cor: 5,
    turbidez: 0.5,
    condutividadeEletrica: 250,
    sdt: 180,
    sst: 20,
    cloroTotal: 0.8,
    cloroLivre: 0.5,
    coliformesTotais: 0,
    ecoli: 0
  },
  // ... outros dados mockados
];

const useTabelaAnalises = (initialAnalyses = initialAnalysesData) => {
  const [analyses, setAnalyses] = useState(initialAnalyses);
  const [sortField, setSortField] = useState('dataAnalise');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedAnalyses = useMemo(() => {
    const sorted = [...analyses].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'dataAnalise') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [analyses, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const addAnalysis = (analysis) => {
    const newAnalysis = {
      ...analysis,
      id: Math.max(...analyses.map(a => a.id), 0) + 1,
    };
    setAnalyses(prev => [...prev, newAnalysis]);
  };

  const editAnalysis = (id, updatedAnalysis) => {
    setAnalyses(prev => prev.map(analysis => 
      analysis.id === id ? { ...analysis, ...updatedAnalysis } : analysis
    ));
  };

  const deleteAnalysis = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta análise?')) {
      setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
    }
  };

  return {
    analyses: sortedAnalyses,
    pocos: initialPocos,
    proprietarios: initialProprietarios,
    analistas: initialAnalistas,
    sortField,
    sortDirection,
    handleSort,
    addAnalysis,
    editAnalysis,
    deleteAnalysis,
  };
};

export default useTabelaAnalises;