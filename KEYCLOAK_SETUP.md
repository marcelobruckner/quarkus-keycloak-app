# Configuração do Keycloak

## Passo a Passo para Configurar

### 1. Subir o Keycloak

```bash
docker-compose up -d
```

Aguarde alguns segundos até o Keycloak iniciar completamente.

### 2. Acessar o Console Admin

- URL: http://localhost:8180
- Usuário: `admin`
- Senha: `admin`

### 3. Criar Realm

1. No menu superior esquerdo, clique em "Master"
2. Clique em "Create Realm"
3. Nome: `quarkus-realm`
4. Clique em "Create"

### 4. Criar Client (Aplicação)

1. No menu lateral, clique em "Clients"
2. Clique em "Create client"
3. Preencha:
   - **Client ID**: `quarkus-app`
   - **Client Protocol**: `openid-connect`
4. Clique em "Next"
5. Habilite:
   - ✅ Client authentication
   - ✅ Authorization
   - ✅ Standard flow
   - ✅ Direct access grants
6. Clique em "Next"
7. Preencha:
   - **Valid redirect URIs**: `http://localhost:3000/*`
   - **Valid post logout redirect URIs**: `http://localhost:3000`
   - **Web origins**: `http://localhost:3000`
8. Clique em "Save"

### 5. Obter Client Secret

1. Vá na aba "Credentials"
2. Copie o "Client secret"
3. Cole no arquivo `backend/src/main/resources/application.properties`:
   ```
   %dev.quarkus.oidc.credentials.secret=SEU_SECRET_AQUI
   ```

### 6. Criar Roles

1. No menu lateral, clique em "Realm roles"
2. Clique em "Create role"
3. Crie duas roles:
   - Nome: `user`
   - Nome: `admin`

### 7. Criar Usuários

#### Usuário Normal:
1. Menu lateral → "Users"
2. Clique em "Add user"
3. Preencha:
   - **Username**: `usuario`
   - **Email**: `usuario@email.com`
   - **First name**: `Usuario`
   - **Last name**: `Teste`
   - ✅ Email verified
4. Clique em "Create"
5. Vá na aba "Credentials"
6. Clique em "Set password"
   - Password: `usuario`
   - ❌ Temporary (desmarque)
7. Vá na aba "Role mapping"
8. Clique em "Assign role"
9. Selecione `user` e clique em "Assign"

#### Usuário Admin:
1. Repita os passos acima com:
   - **Username**: `admin`
   - **Email**: `admin@email.com`
   - **Password**: `admin`
2. Na aba "Role mapping", atribua as roles `user` e `admin`

### 8. Pronto!

Agora você pode testar a aplicação:

```bash
# Terminal 1 - Backend
cd backend
./mvnw quarkus:dev

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

Acesse: http://localhost:3000

**Credenciais para teste:**
- Usuário normal: `usuario` / `usuario`
- Administrador: `admin` / `admin`