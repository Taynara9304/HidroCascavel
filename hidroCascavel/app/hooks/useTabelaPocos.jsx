// hooks/useTabelaPocos.js - versão com debug completo
import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  orderBy, 
  query,
  serverTimestamp,
  GeoPoint 
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

const useWells = () => {
  const [wells, setWells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('dataCadastro');
  const [sortDirection, setSortDirection] = useState('desc');

  console.log('🔄 useWells: Hook inicializado');

  // Buscar poços em tempo real
  useEffect(() => {
    console.log('📡 useWells: Configurando listener do Firebase...');
    setLoading(true);
    setError(null);
    
    try {
      const wellsCollection = collection(db, 'wells');
      console.log('📡 useWells: Coleção referenciada:', wellsCollection);
      
      const q = query(wellsCollection, orderBy(sortField, sortDirection === 'asc' ? 'asc' : 'desc'));
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('📡 useWells: Snapshot recebido -', snapshot.docs.length, 'documentos');
          
          const wellsData = snapshot.docs.map(doc => {
            const data = doc.data();
            console.log('📡 useWells: Documento', doc.id, '=', data);
            return {
              id: doc.id,
              ...data
            };
          });
          
          setWells(wellsData);
          setLoading(false);
          console.log('✅ useWells: Estado atualizado com', wellsData.length, 'poços');
        },
        (error) => {
          console.error('❌ useWells: Erro no listener:', error);
          console.error('❌ useWells: Código do erro:', error.code);
          console.error('❌ useWells: Mensagem:', error.message);
          setError('Erro ao carregar poços: ' + error.message);
          setLoading(false);
        }
      );

      return () => {
        console.log('📡 useWells: Removendo listener');
        unsubscribe();
      };
    } catch (err) {
      console.error('❌ useWells: Erro ao configurar listener:', err);
      setError('Erro de configuração: ' + err.message);
      setLoading(false);
    }
  }, [sortField, sortDirection]);

  // Adicionar poço
  const addWell = async (wellData) => {
    try {
      console.log('➕ useWells: Iniciando cadastro...', wellData);
      
      // Validação detalhada
      if (!wellData.localizacao) {
        throw new Error('Localização não fornecida');
      }
      if (!wellData.proprietario) {
        throw new Error('Proprietário não fornecido');
      }

      const wellsCollection = collection(db, 'wells');
      console.log('➕ useWells: Coleção referenciada para escrita');
      
      const wellDocument = {
        localizacao: new GeoPoint(
          parseFloat(wellData.localizacao.latitude),
          parseFloat(wellData.localizacao.longitude)
        ),
        idProprietario: wellData.proprietario.id,
        nomeProprietario: wellData.proprietario.nome,
        observacoes: wellData.observacoes || '',
        dataCadastro: serverTimestamp()
      };

      console.log('➕ useWells: Documento preparado:', wellDocument);
      
      console.log('➕ useWells: Enviando para Firebase...');
      const docRef = await addDoc(wellsCollection, wellDocument);
      console.log('✅ useWells: Poço cadastrado com sucesso! ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('❌ useWells: Erro ao adicionar poço:', error);
      console.error('❌ useWells: Código do erro:', error.code);
      console.error('❌ useWells: Mensagem:', error.message);
      throw error;
    }
  };

  // Editar poço
  const editWell = async (wellId, updatedWell) => {
    try {
      const wellDoc = doc(db, 'wells', wellId);
      await updateDoc(wellDoc, updatedWell);
      console.log('useWells: Poço editado:', wellId);
    } catch (error) {
      console.error('useWells: Erro ao editar poço:', error);
      throw error;
    }
  };

  // Deletar poço
  const deleteWell = async (wellId) => {
    try {
      const wellDoc = doc(db, 'wells', wellId);
      await deleteDoc(wellDoc);
      console.log('useWells: Poço deletado:', wellId);
    } catch (error) {
      console.error('useWells: Erro ao deletar poço:', error);
      throw error;
    }
  };

  // Ordenação
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    wells,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort,
    addWell,
    editWell,
    deleteWell,
  };
};

export default useWells;

export const testarFirebase = async () => {
  try {
    console.log('🔥 TESTE: Iniciando teste do Firebase...');
    
    // Teste 1: Listar coleções
    const wellsCollection = collection(db, 'wells');
    const snapshot = await getDocs(wellsCollection);
    console.log('✅ TESTE: Conexão OK! Poços encontrados:', snapshot.docs.length);
    
    // Teste 2: Adicionar um poço de teste
    const testWell = {
      localizacao: new GeoPoint(-23.5505, -46.6333),
      idProprietario: "teste123",
      nomeProprietario: "Proprietário Teste",
      observacoes: "Poço de teste",
      dataCadastro: serverTimestamp()
    };
    
    const docRef = await addDoc(wellsCollection, testWell);
    console.log('✅ TESTE: Poço de teste adicionado com ID:', docRef.id);
    
    return true;
  } catch (error) {
    console.error('❌ TESTE: Erro no Firebase:', error);
    console.error('❌ Mensagem detalhada:', error.message);
    return false;
  }
};