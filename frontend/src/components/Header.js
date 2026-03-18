import React from 'react';
import keycloak from '../utils/keycloak';

function Header() {
  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <h1 style={styles.title}>Quarkus + Keycloak App</h1>
        <div style={styles.userInfo}>
          <span style={styles.username}>
            Olá, {keycloak.tokenParsed?.preferred_username}
          </span>
          <button onClick={handleLogout} style={styles.button}>
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#282c34',
    padding: '20px',
    color: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    fontSize: '24px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  username: {
    fontSize: '16px'
  },
  button: {
    backgroundColor: '#61dafb',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#282c34'
  }
};

export default Header;