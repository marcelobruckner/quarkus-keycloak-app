import Keycloak from 'keycloak-js';

// Configuração do Keycloak
const keycloak = new Keycloak({
  url: 'http://localhost:8180/',
  realm: 'quarkus-realm',
  clientId: 'quarkus-app'
});

export default keycloak;