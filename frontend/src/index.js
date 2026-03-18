import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import keycloak from './utils/keycloak';

keycloak.init({
  onLoad: 'login-required',
  checkLoginIframe: false,
  pkceMethod: 'S256'
}).then((auth) => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App authenticated={auth} />);
}).catch((err) => {
  console.error('Falha ao inicializar Keycloak', err);
  console.error('Tipo:', typeof err);
  console.error('JSON:', JSON.stringify(err));
  console.error('Stack:', err?.stack);
  document.getElementById('root').innerHTML = '<pre style="color:red;padding:20px">' + JSON.stringify(err, null, 2) + '\n' + err?.stack + '</pre>';
});