import React, { useState, useEffect } from 'react';
import keycloak from './utils/keycloak';
import Header from './components/Header';
import Home from './pages/Home';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    keycloak.init({ 
      onLoad: 'login-required',
      checkLoginIframe: false,
      pkceMethod: 'S256'
    }).then((auth) => {
      setAuthenticated(auth);
      setLoading(false);

      setInterval(() => {
        keycloak.updateToken(70).catch(() => {
          console.log('Falha ao renovar token');
        });
      }, 60000);

    }).catch((err) => {
      console.error('Falha na autenticação', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={styles.loading}>
        <h2>Carregando...</h2>
        <p>Conectando ao Keycloak</p>
      </div>
    );
  }

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