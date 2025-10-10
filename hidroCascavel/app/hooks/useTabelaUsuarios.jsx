// hooks/useTabelaUsuarios.js
import { useState, useMemo } from 'react';

// Dados mockados para usuários
const initialUsersData = [
  {
    id: 1,
    nome: 'João',
    sobrenome: 'Silva',
    telefone: '(11) 99999-9999',
    email: 'joao.silva@email.com',
    endereco: 'Rua das Flores, 123 - São Paulo, SP'
  },
  {
    id: 2,
    nome: 'Maria',
    sobrenome: 'Santos',
    telefone: '(11) 88888-8888',
    email: 'maria.santos@email.com',
    endereco: 'Av. Paulista, 1000 - São Paulo, SP'
  },
  {
    id: 3,
    nome: 'Pedro',
    sobrenome: 'Oliveira',
    telefone: '(11) 77777-7777',
    email: 'pedro.oliveira@email.com',
    endereco: 'Rua Augusta, 500 - São Paulo, SP'
  },
  {
    id: 4,
    nome: 'Ana',
    sobrenome: 'Costa',
    telefone: '(11) 66666-6666',
    email: 'ana.costa@email.com',
    endereco: 'Alameda Santos, 200 - São Paulo, SP'
  },
  {
    id: 5,
    nome: 'Carlos',
    sobrenome: 'Souza',
    telefone: '(11) 55555-5555',
    email: 'carlos.souza@email.com',
    endereco: 'Rua XV de Novembro, 50 - São Paulo, SP'
  },
];

const useTabelaUsuarios = (initialUsers = initialUsersData) => {
  const [users, setUsers] = useState(initialUsers || []);
  const [sortField, setSortField] = useState('nome');
  const [sortDirection, setSortDirection] = useState('asc');

  const sortedUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    
    const sorted = [...users].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  }, [users, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Math.max(...(users?.map(u => u.id) || [0]), 0) + 1,
    };
    setUsers(prev => [...(prev || []), newUser]);
  };

  const editUser = (id, updatedUser) => {
    setUsers(prev => (prev || []).map(user => 
      user.id === id ? { ...user, ...updatedUser } : user
    ));
  };

  const deleteUser = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(prev => (prev || []).filter(user => user.id !== id));
    }
  };

  return {
    users: sortedUsers,
    sortField,
    sortDirection,
    handleSort,
    addUser,
    editUser,
    deleteUser,
  };
};

export default useTabelaUsuarios;