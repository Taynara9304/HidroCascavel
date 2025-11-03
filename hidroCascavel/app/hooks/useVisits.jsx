// hooks/useVisits.js
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export const useVisits = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Query para buscar todas as visitas
    const q = query(
      collection(db, 'visits')
      // orderBy('dataVisita', 'asc') - removido pois dataVisita é string
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const visitsData = [];
      snapshot.forEach((doc) => {
        visitsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Ordenar por dataVisita manualmente
      visitsData.sort((a, b) => new Date(a.dataVisita) - new Date(b.dataVisita));
      
      setVisits(visitsData);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar visitas:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { visits, loading };
};