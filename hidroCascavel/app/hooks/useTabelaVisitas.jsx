// hooks/useTabelaVisitas.js - VERSÃO COMPLETA CORRIGIDA
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
  Timestamp
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { enviarNotificacaoWhatsAppSolicitacao } from '../services/whatsappNotificationService';


const useVisitas = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('dataVisita');
  const [sortDirection, setSortDirection] = useState('desc');

  console.log('🔄 useVisitas: Hook inicializado');

  // Buscar visitas em tempo real - VERSÃO SIMPLIFICADA
  useEffect(() => {
    console.log('📡 useVisitas: Configurando listener do Firebase...');
    setLoading(true);
    setError(null);
    
    try {
      const visitsCollection = collection(db, 'visits');
      console.log('📡 useVisitas: Coleção referenciada');
      
      // Query simples sem filtros complexos por enquanto
      const q = query(visitsCollection, orderBy('dataVisita', 'desc'));
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('📡 useVisitas: Snapshot recebido -', snapshot.docs.length, 'documentos');
          
          const visitsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data
            };
          });
          
          setVisits(visitsData);
          setLoading(false);
          console.log('✅ useVisitas: Estado atualizado com', visitsData.length, 'visitas');
        },
        (error) => {
          console.error('❌ useVisitas: Erro no listener:', error);
          setError('Erro ao carregar visitas: ' + error.message);
          setLoading(false);
        }
      );

      return () => {
        console.log('📡 useVisitas: Removendo listener');
        unsubscribe();
      };
    } catch (err) {
      console.error('❌ useVisitas: Erro ao configurar listener:', err);
      setError('Erro de configuração: ' + err.message);
      setLoading(false);
    }
  }, []);

  const addVisit = async (visitData) => {
    try {
      console.log('🎯 useVisitas.addVisit: Iniciando...', visitData);
      
      // ✅ ADICIONAR: Enviar notificação para WhatsApp se for do proprietário
      if (visitData.tipo === 'solicitacao_proprietario_whatsapp') {
        console.log('📱 Enviando notificação WhatsApp...');
        await enviarNotificacaoWhatsAppSolicitacao(visitData);
      }

      const visitsCollection = collection(db, 'visits');
      const visitWithTimestamp = {
        ...visitData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(visitsCollection, visitWithTimestamp);
      console.log('✅ Visita adicionada com ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('❌ Erro ao adicionar visita:', error);
      throw error;
    }
  };

  // Editar visita
  const editVisit = async (visitId, updatedVisit) => {
    try {
      const visitDoc = doc(db, 'visits', visitId);
      await updateDoc(visitDoc, {
        ...updatedVisit,
        atualizadoEm: serverTimestamp()
      });
      console.log('✅ useVisitas: Visita editada:', visitId);
    } catch (error) {
      console.error('❌ useVisitas: Erro ao editar visita:', error);
      throw error;
    }
  };

  // Deletar visita
  const deleteVisit = async (visitId) => {
    try {
      const visitDoc = doc(db, 'visits', visitId);
      await deleteDoc(visitDoc);
      console.log('✅ useVisitas: Visita deletada:', visitId);
    } catch (error) {
      console.error('❌ useVisitas: Erro ao deletar visita:', error);
      throw error;
    }
  };

  // Ordenação - AGORA DEFINIDA CORRETAMENTE
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Aplicar ordenação client-side
  const visitsOrdenados = [...visits].sort((a, b) => {
    if (!a[sortField] || !b[sortField]) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Se for Timestamp do Firebase, converter para Date
    if (aValue.toDate && bValue.toDate) {
      aValue = aValue.toDate();
      bValue = bValue.toDate();
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  return {
    visits: visitsOrdenados,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort,
    addVisit,
    editVisit,
    deleteVisit,
  };
};

export default useVisitas;