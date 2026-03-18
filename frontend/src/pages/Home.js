import React, { useState, useEffect } from 'react';
import { getUserInfo, getAdminData } from '../services/api';
import keycloak from '../utils/keycloak';

function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = keycloak.hasRealmRole('admin');

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const response = await getUserInfo();
      setUserInfo(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erro ao carregar informações do usuário');
      setLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      const response = await getAdminData();
      setAdminMessage(response.data);
    } catch (err) {
      setAdminMessage('Você não tem permissão de administrador');
    }
  };

  if (loading) {
    return <div style={styles.container}>Carregando...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Bem-vindo ao Dashboard!</h2>
        
        {error && <p style={styles.error}>{error}</p>}
        
        {userInfo && (
          <div style={styles.userCard}>
            <h3>Suas Informações</h3>
            <p><strong>Usuário:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Nome:</strong> {userInfo.nome}</p>
          </div>
        )}

        {isAdmin && (
          <div style={styles.adminSection}>
            <h3>Área do Administrador</h3>
            <button onClick={loadAdminData} style={styles.button}>
              Carregar Dados Admin
            </button>
            {adminMessage && (
              <p style={styles.adminMessage}>{adminMessage}</p>
            )}
          </div>
        )}

        <div style={styles.tokenSection}>
          <h3>Token Info</h3>
          <p><strong>Roles:</strong> {keycloak.realmAccess?.roles.join(', ')}</p>
          <p><strong>Token expira em:</strong> {new Date(keycloak.tokenParsed?.exp * 1000).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '0 20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  userCard: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '5px',
    marginTop: '20px'
  },
  adminSection: {
    backgroundColor: '#fff3cd',
    padding: '20px',
    borderRadius: '5px',
    marginTop: '20px'
  },
  tokenSection: {
    backgroundColor: '#e7f3ff',
    padding: '20px',
    borderRadius: '5px',
    marginTop: '20px'
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  adminMessage: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '5px'
  },
  error: {
    color: 'red',
    padding: '10px',
    backgroundColor: '#ffe6e6',
    borderRadius: '5px'
  }
};

export default Home;