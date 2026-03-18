import React, { useEffect } from 'react';
import keycloak from './utils/keycloak';
import Header from './components/Header';
import Home from './pages/Home';

function App({ authenticated }) {
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      keycloak.updateToken(70).catch(() => console.log('Falha ao renovar token'));
    }, 60000);
    return () => clearInterval(interval);
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div style={styles.loading}>
        <h2>Não autenticado</h2>
        <p>Redirecionando para login...</p>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Header />
      <Home />
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#282c34',
    color: 'white'
  }
};

export default App;