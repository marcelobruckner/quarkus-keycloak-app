# Aplicação Web com Quarkus + React + Keycloak

Aplicação full stack com autenticação completa usando Keycloak, totalmente containerizada.

## Arquitetura

```
React (Frontend) → Keycloak (Autenticação) → Quarkus (API) → PostgreSQL
```

Todos os serviços sobem com um único comando e já estão prontos para uso, sem configuração manual.

---

## Estrutura do Projeto

```
.
├── backend/                  # API REST com Quarkus
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                 # SPA com React
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker/
│   └── quarkus-realm.json    # Configuração do realm importada automaticamente
└── docker-compose.yml
```

---

## Como executar

> **Pré-requisito:** Docker com Compose v2 (`docker compose version`)
>
> ⚠️ O `docker-compose` (v1) não funciona com Python 3.12+. Use sempre `docker compose` (sem hífen).

```bash
docker compose up -d
```

Na primeira execução as imagens serão buildadas. Aguarde todos os serviços ficarem healthy.

Para resetar tudo (apaga volumes e dados):
```bash
docker compose down -v && docker compose up -d
```

---

## URLs

| Serviço     | URL                        |
|-------------|----------------------------|
| Frontend    | http://localhost:3000       |
| Backend API | http://localhost:8080       |
| Keycloak    | http://localhost:8180       |

### Credenciais de teste

| Usuário   | Senha  | Roles        |
|-----------|--------|--------------|
| `usuario` | 123456 | user         |
| `admin`   | 123456 | user, admin  |

### Credenciais do Keycloak Admin

| Campo   | Valor |
|---------|-------|
| Usuário | admin |
| Senha   | admin |

---

## Serviços (docker-compose.yml)

### postgres

Banco de dados usado pelo Keycloak para persistir todas as suas configurações (realms, clients, usuários, sessões).

```yaml
environment:
  POSTGRES_DB: keycloak
  POSTGRES_USER: keycloak
  POSTGRES_PASSWORD: keycloak
```

O volume `postgres_data` garante que os dados sobrevivem a um `docker compose down`. Só são apagados com `down -v`.

---

### keycloak

Servidor de autenticação. A integração com o PostgreSQL é feita pelas variáveis:

```yaml
KC_DB: postgres                                      # driver a ser usado
KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak  # "postgres" é o nome do serviço na rede Docker
KC_DB_USERNAME: keycloak
KC_DB_PASSWORD: keycloak
```

O `postgres` na URL não é um hostname fixo — é o nome do serviço definido no docker-compose, resolvido automaticamente pelo Docker dentro da rede `keycloak-network`.

O `depends_on` com `condition: service_healthy` garante que o Keycloak só inicia após o PostgreSQL estar pronto.

#### Importação automática do realm

O comando `start-dev --import-realm` faz o Keycloak importar tudo que estiver em `/opt/keycloak/data/import/` na inicialização. O arquivo `docker/quarkus-realm.json` é montado nesse diretório via volume:

```yaml
volumes:
  - ./docker/quarkus-realm.json:/opt/keycloak/data/import/quarkus-realm.json
```

O realm só é importado se **não existir ainda**. Em um volume já existente, o import é ignorado.

O `quarkus-realm.json` configura automaticamente:
- Realm `quarkus-realm`
- Client `quarkus-app` (público, sem secret)
- Roles `user` e `admin`
- Usuários `usuario` e `admin` com senhas e roles atribuídas

---

### backend

API Quarkus que valida os tokens JWT emitidos pelo Keycloak.

```yaml
environment:
  QUARKUS_OIDC_AUTH_SERVER_URL: http://keycloak:8180/realms/quarkus-realm
  QUARKUS_OIDC_CLIENT_ID: quarkus-app
  QUARKUS_OIDC_APPLICATION_TYPE: service
  QUARKUS_OIDC_TOKEN_ISSUER: any
  QUARKUS_HTTP_CORS_ORIGINS: http://localhost:3000
```

**Por que `QUARKUS_OIDC_TOKEN_ISSUER: any`?**

O token JWT é gerado pelo browser acessando `http://localhost:8180`, então o campo `iss` (issuer) do token contém `localhost`. Porém o backend se comunica com o Keycloak via nome de serviço Docker (`keycloak:8180`). Sem essa configuração, o Quarkus rejeita o token por mismatch de issuer.

**Por que o client é público (`publicClient: true`)?**

O frontend React roda no browser do usuário. Um `client_secret` ficaria exposto no código JavaScript — o que é inseguro. Clients públicos usam PKCE (S256) no lugar do secret para garantir a segurança do fluxo de autenticação.

---

### frontend

React buildado com Node 18 e servido via nginx na porta 3000.

O `nginx.conf` usa `try_files` para suportar o React Router:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Sem isso, ao acessar uma rota diretamente (ex: `/dashboard`) o nginx retornaria 404.

---

## Endpoints da API

| Método | Path         | Proteção            |
|--------|--------------|---------------------|
| GET    | /api/public  | Público             |
| GET    | /api/user    | Role `user`         |
| GET    | /api/admin   | Role `admin`        |

---

## Ordem de inicialização

```
postgres (healthy) → keycloak (healthy) → backend → frontend
```

Cada serviço aguarda o anterior estar saudável antes de iniciar, evitando falhas de conexão na subida.
