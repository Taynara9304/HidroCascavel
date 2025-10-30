// hooks/useTabelaVisitas.jsx - VERSÃO ATUALIZADA
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
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { useAuth } from '../contexts/authContext';

const useVisitas = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('dataVisita');
  const [sortDirection, setSortDirection] = useState('desc');
  const { user, userData } = useAuth();

  console.log('🔄 useVisitas: Hook inicializado');

  // Buscar visitas em tempo real
  useEffect(() => {
    if (!user) {
      setVisits([]);
      setLoading(false);
      return;
    }

    console.log('📡 useVisitas: Configurando listener do Firebase...');
    setLoading(true);
    
    try {
      const visitsCollection = collection(db, 'visits');
      let q;

      if (userData?.tipoUsuario === 'administrador') {
        // ADM vê TODAS as visitas
        q = query(visitsCollection, orderBy('dataVisita', 'desc'));
        console.log('🎯 ADM: Carregando TODAS as visitas');
      } else if (userData?.tipoUsuario === 'analista') {
        // Analista vê apenas suas visitas APROVADAS
        q = query(
          visitsCollection, 
          where('criadoPor', '==', user.uid),
          where('status', 'in', ['aprovada', 'concluida']),
          orderBy('dataVisita', 'desc')
        );
        console.log('🎯 Analista: Carregando visitas aprovadas do usuário');
      } else {
        // Proprietário vê visitas do seu poço
        q = query(
          visitsCollection, 
          where('userId', '==', user.uid),
          orderBy('dataVisita', 'desc')
        );
        console.log('🎯 Proprietário: Carregando visitas do usuário');
      }

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          console.log('📡 useVisitas: Snapshot recebido -', snapshot.docs.length, 'documentos');
          
          const visitsData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              dataVisita: data.dataVisita,
              dataCriacao: data.dataCriacao
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
  }, [user, userData]);

  // ✅ NOVA FUNÇÃO: Enviar visita para aprovação
  const enviarVisitaParaAprovacao = async (visitData) => {
    try {
      console.log('📋 useVisitas: Enviando visita para aprovação...', visitData);
      
      // 1. Salvar na coleção de visitas_pendentes
      const pendingVisitsCollection = collection(db, 'visits_pendentes');
      
      const pendingVisitDoc = {
        ...visitData,
        status: 'pendente_aprovacao',
        dataSolicitacao: serverTimestamp(),
        tipoSolicitacao: 'visita_analista',
        analistaId: user.uid,
        analistaNome: userData?.nome || 'Analista',
        dataCriacao: serverTimestamp()
      };

      console.log('📤 Salvando em visits_pendentes:', pendingVisitDoc);
      const docRef = await addDoc(pendingVisitsCollection, pendingVisitDoc);
      
      // 2. Criar notificação para o administrador
      await criarNotificacaoAdmin(docRef.id, visitData);
      
      console.log('✅ useVisitas: Visita enviada para aprovação! ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ useVisitas: Erro ao enviar visita para aprovação:', error);
      throw error;
    }
  };

  // ✅ FUNÇÃO: Criar notificação para administrador
  const criarNotificacaoAdmin = async (visitPendingId, visitData) => {
    try {
      const notificationsCollection = collection(db, 'notifications_admin');
      
      const notificationDoc = {
        tipo: 'visita_pendente',
        titulo: '📋 Nova Visita para Aprovação',
        mensagem: `O analista ${userData?.nome || 'Analista'} enviou uma visita técnica para o poço ${visitData.pocoNome}`,
        visitPendingId: visitPendingId,
        dadosVisita: {
          pocoNome: visitData.pocoNome,
          dataVisita: visitData.dataVisita,
          observacoes: visitData.observacoes,
          analistaNome: userData?.nome || 'Analista',
          analistaId: user.uid
        },
        status: 'nao_lida',
        dataCriacao: serverTimestamp(),
        userId: 'admin' // Notificação para todos os admins
      };

      await addDoc(notificationsCollection, notificationDoc);
      console.log('✅ Notificação criada para admin');
    } catch (error) {
      console.error('❌ Erro ao criar notificação:', error);
      // Não lançar erro para não quebrar o fluxo principal
    }
  };

  // ✅ FUNÇÃO ORIGINAL: Adicionar visita diretamente (para admin/proprietário)
  const addVisit = async (visitData) => {
    try {
      console.log('➕ useVisitas: Adicionando visita...', visitData);
      
      const visitsCollection = collection(db, 'visits');
      
      const visitDocument = {
        ...visitData,
        dataCriacao: serverTimestamp(),
        status: visitData.status || 'concluida'
      };

      console.log('➕ useVisitas: Enviando para Firebase...', visitDocument);
      const docRef = await addDoc(visitsCollection, visitDocument);
      console.log('✅ useVisitas: Visita cadastrada com sucesso! ID:', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('❌ useVisitas: Erro ao adicionar visita:', error);
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

  // Ordenação
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Aplicar ordenação client-side
  const visitsOrdenadas = [...visits].sort((a, b) => {
    if (!a[sortField] || !b[sortField]) return 0;
    
    let aValue = a[sortField];
    let bValue = b[sortField];
    
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
    visits: visitsOrdenadas,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort,
    addVisit,
    editVisit,
    deleteVisit,
    enviarVisitaParaAprovacao
  };
};

export default useVisitas;