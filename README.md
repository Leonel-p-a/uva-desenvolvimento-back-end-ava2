# Sistema de Agendamento Clínico

Aplicação full-stack para gerenciamento de pacientes e agendamentos médicos, com autenticação, controle de acesso e integração com APIs externas, desenvolvido como Atividade AVA2 da Disciplina Desenvolvimento Back-End da UVA.

**Acesse a aplicação online:**  
https://uva-desenvolvimento-back-end-ava2.vercel.app/

---

## Visão Geral

Este projeto consiste em um sistema web onde:

- Pacientes podem se cadastrar, fazer login e agendar consultas
- Administradores/secretários podem gerenciar atendimentos
- O sistema utiliza autenticação via JWT
- Os dados são persistidos em banco de dados na nuvem

---

## Tecnologias Utilizadas

### Frontend
- Vue.js
- Vite
- TypeScript
- Vue Router
- Fetch API

### Backend
- Node.js
- Express
- TypeScript
- JWT (JSON Web Token)
- MongoDB (Atlas)
- Mongoose
- Dotenv

### APIs Externas
- OpenWeather API (dados climáticos)
- ViaCEP API (consulta de endereço)

---

## Arquitetura do Projeto

O projeto segue uma estrutura **monorepo**, com separação clara entre frontend e backend:

```
uva-desenvolvimento-back-end-ava2/
│
├── backend
│ ├── src/ # código fonte
| | ├── controllers
| | ├── models
| | ├── routes
| | ├── services
│ ├── .env.example
│ ├──.gitignore
│ ├── package-lock.json
│ ├── package.json
│ └── tsconfig.json
├── frontend
│ ├── src/ # código fonte
| | ├── components
| | ├── router
| | ├── services
| | ├── styles
| | ├── views
| | ├── App.vue
| | ├── main.ts
│ ├──.gitignore
│ ├── index.html
│ ├── package-lock.json
│ ├── package.json
│ ├── tsconfig.app.json
│ └── tsconfig.json
```


### Backend
- Arquitetura em camadas (Controller → Service → Model)
- Middleware para autenticação com JWT
- Conexão com MongoDB via Mongoose

### Frontend
- SPA (Single Page Application)
- Navegação via Vue Router
- Consumo de API via fetch

---

## Autenticação

- Baseada em JWT
- Token armazenado no `localStorage`
- Enviado via header:
  ```
  Authorization: Bearer <token>
  ```

---

## Como Rodar o Projeto Localmente

### Pré-requisitos
- Node.js instalado
- Conta no MongoDB Atlas
- Chave da OpenWeather API

---

### 1. Clonar o repositório

#### BACKEND

```bash
git clone https://github.com/Leonel-p-a/uva-desenvolvimento-back-end-ava2
cd uva-desenvolvimento-back-end-ava2
cd backend
npm install
```

Criar arquivo .env baseado no .env.example:

```
MONGO_URI=sua_string_mongodb
JWT_SECRET=sua_chave_secreta
OPENWEATHER_API_KEY=sua_api_key
```

Rodar servidor:

```
npm run dev
```

#### FRONTEND

```bash
cd frontend
npm install
```

Criar arquivo .env:

```
VITE_API_URL=http://localhost:3000
```

Rodar aplicação:

```
npm run dev
```

## Variáveis de Ambiente

### Backend
- MONGO_URI
- JWT_SECRET
- OPENWEATHER_API_KEY

### Frontend
- VITE_API_URL

## Endpoints da API
### Autenticação
POST/register
Cria um novo usuário

```json
{
  "name": "Nome",
  "email": "email@email.com",
  "password": "123456"
}
```

POST/login
Realizar login e retorna token JWT
```json
{
  "email": "email@email.com",
  "password": "123456"
}
```

### Agendmentos
GET/appointments
Lista agendamentos do usuário autenticado
* Requer token

POST/appointments
Cria um novo agendamenti
* Requer token

### Clima
GET/weather
retorna dados climáticos via OpenWeather API

### Endereço
GET/cep/:cep
Consulta endereço via ViaCEP

## Observações
- O sistema ainda não possui diferenciação completa de permissões entre usuários

- Qualquer usuário cadastrado pode acessar diferentes áreas do sistema

- Melhorias futuras incluem:

  - Controle de roles (admin/paciente)

  - Validação mais robusta

  - Melhor tratamento de erros
 

## Deploy
- Frontend: Vercel
- Backend: Render
- Banco de Dados: MongoDB Atlas

## Autor
**Leonel Almeida**
- GitHub: https://github.com/Leonel-p-a
