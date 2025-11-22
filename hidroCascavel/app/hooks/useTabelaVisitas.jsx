// hooks/useVisitas.js - VERSÃO CORRIGIDA
import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
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

  useEffect(() => {
    if (!user) return;

    console.log('useVisitas: Iniciando carregamento para usuário:', userData?.tipoUsuario);
    
    try {
      let q;
      const visitsCollection = collection(db, 'visits');

      if (userData?.tipoUsuario === 'administrador') {
        q = query(visitsCollection, orderBy(sortField, sortDirection));
      } else if (userData?.tipoUsuario === 'analista') {
        q = query(
          visitsCollection, 
          where('analistaId', '==', user.uid),
          where('status', 'in', ['aprovada', 'concluida']),
          orderBy(sortField, sortDirection)
        );
      } else {
        q = query(
          visitsCollection, 
          where('userId', '==', user.uid),
          orderBy(sortField, sortDirection)
        );
      }

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const visitsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          console.log('useVisitas: Visitas carregadas:', visitsData.length);
          setVisits(visitsData);
          setLoading(false);
          setError(null);
        },
        (snapshotError) => {
          console.error('useVisitas: Erro no snapshot:', snapshotError);
          setError('Erro ao carregar visitas: ' + snapshotError.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (catchError) {
      console.error('useVisitas: Erro geral:', catchError);
      setError('Erro ao configurar listener: ' + catchError.message);
      setLoading(false);
    }
  }, [user, userData, sortField, sortDirection]);

  const enviarVisitaParaAprovacao = async (visitData) => {
    try {
      console.log('Enviando visita para aprovação:', visitData);
      
      const dadosValidados = {
        ...visitData,
        userId: visitData.userId || 'unknown',
        pocoId: visitData.pocoId || 'unknown',
        analistaId: visitData.analistaId || 'unknown',
        pocoNome: visitData.pocoNome || 'Poço não identificado',
        analistaNome: visitData.analistaNome || 'Analista'
      };

      console.log('Dados validados para notificação:', dadosValidados);

      const notificationData = {
        tipo: 'solicitacao_cadastro_visita',
        titulo: 'Nova Visita Técnica para Aprovação',
        mensagem: `O analista ${dadosValidados.analistaNome} registrou uma visita técnica no poço ${dadosValidados.pocoNome}`,
        userId: 'admin',
        status: 'pendente',
        dataCriacao: serverTimestamp(),
        dadosVisita: dadosValidados
      };

      const docRef = await addDoc(collection(db, 'notifications'), notificationData);
      
      console.log('Notificação de visita criada com sucesso. ID:', docRef.id);
      return true;
    } catch (error) {
      console.error('Erro ao enviar visita para aprovação:', error);
      throw new Error('Não foi possível enviar a visita para aprovação: ' + error.message);
    }
  };

  const addVisit = async (visitData) => {
    try {
      const docRef = await addDoc(collection(db, 'visits'), {
        ...visitData,
        dataCriacao: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao adicionar visita:', error);
      throw error;
    }
  };

  const editVisit = async (visitId, updatedData) => {
    try {
      await updateDoc(doc(db, 'visits', visitId), updatedData);
    } catch (error) {
      console.error('Erro ao editar visita:', error);
      throw error;
    }
  };

  const deleteVisit = async (visitId) => {
    try {
      await deleteDoc(doc(db, 'visits', visitId));
    } catch (error) {
      console.error('Erro ao deletar visita:', error);
      throw error;
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return {
    visits,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort,
    addVisit,
    editVisit,
    deleteVisit,
    enviarVisitaParaAprovacao,
  };
};

export default useVisitas;