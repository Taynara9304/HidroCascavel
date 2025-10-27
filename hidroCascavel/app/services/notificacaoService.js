// services/notificacaoService.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const enviarNotificacaoAdmin = async (dadosSolicitacao) => {
  try {
    console.log('🔔 Enviando notificação para admin...');
    
    const notificacoesCollection = collection(db, 'notifications');
    
    const notificacao = {
      tipo: 'solicitacao_visita',
      titulo: 'Nova Solicitação de Visita',
      mensagem: `Nova solicitação de visita para o poço: ${dadosSolicitacao.pocoNome}`,
      dados: dadosSolicitacao,
      lida: false,
      destinatario: 'admin', // Ou pegar do contexto de usuários admin
      criadoEm: serverTimestamp()
    };

    await addDoc(notificacoesCollection, notificacao);
    console.log('✅ Notificação enviada com sucesso!');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao enviar notificação:', error);
    return false;
  }
};