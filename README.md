# ☕ Cafeteria RM — Sistema Completo

Sistema de gerenciamento de cafeteria com **Spring Boot**, **React** e **PostgreSQL**.

---

## 🏗️ Estrutura do Projeto

```
cafeteria-rm/
├── backend/          # Spring Boot 3 + Java 17
│   └── src/main/java/com/cafeteria/rm/
│       ├── config/           # Segurança e CORS
│       ├── controller/       # REST Controllers
│       ├── dto/              # Request e Response DTOs
│       │   ├── request/
│       │   └── response/
│       ├── entity/           # Entidades JPA
│       ├── enums/            # Enumerações
│       ├── exception/        # Tratamento de erros
│       ├── repository/       # Spring Data JPA
│       ├── security/         # JWT Filter + Service
│       └── service/          # Lógica de negócio
│           └── impl/
└── frontend/         # React + Vite + Tailwind CSS
    └── src/
        ├── api/              # Axios + Services
        ├── components/
        │   ├── layout/       # Navbar, Footer
        │   └── ui/           # Componentes reutilizáveis
        ├── context/          # AuthContext
        ├── pages/            # Páginas da aplicação
        │   └── admin/
        └── store/            # Zustand (carrinho)
```

---

## 🚀 Como Rodar

### Pré-requisitos
- Java 17+
- Maven 3.8+
- Node.js 18+
- PostgreSQL 14+

---

### 1️⃣ Banco de Dados (PostgreSQL)

```sql
CREATE DATABASE cafeteria_rm;
```

> Certifique-se que o PostgreSQL está rodando em `localhost:5432`
> Usuário: `postgres` | Senha: `postgres`
>
> Para alterar, edite: `backend/src/main/resources/application.properties`

---

### 2️⃣ Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

O backend sobe em: **http://localhost:8080**

---

### 3️⃣ Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe em: **http://localhost:5173**

---

## 🔑 Criando usuário ADMIN

Faça um `POST /api/auth/register` com:

```json
{
  "nome": "Administrador",
  "email": "admin@cafeteria.com",
  "senha": "admin123",
  "telefone": "11999999999",
  "role": "ADMIN"
}
```

---

## 📡 Endpoints da API

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Cadastro |

### Produtos
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/api/produtos` | Público | Listar disponíveis |
| GET | `/api/produtos/todos` | Admin | Listar todos |
| GET | `/api/produtos/{id}` | Público | Buscar por ID |
| GET | `/api/produtos/categoria/{cat}` | Público | Por categoria |
| POST | `/api/produtos` | Admin | Criar |
| PUT | `/api/produtos/{id}` | Admin | Atualizar |
| DELETE | `/api/produtos/{id}` | Admin | Deletar |

### Pedidos
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/pedidos` | Logado | Criar pedido |
| GET | `/api/pedidos/meus` | Logado | Meus pedidos |
| GET | `/api/pedidos` | Admin/Atendente | Todos pedidos |
| PATCH | `/api/pedidos/{id}/status` | Admin/Atendente | Atualizar status |
| PATCH | `/api/pedidos/{id}/cancelar` | Logado | Cancelar |

---

## 🎨 Páginas do Frontend

| Rota | Página | Acesso |
|------|--------|--------|
| `/` | Home | Público |
| `/cardapio` | Cardápio | Público |
| `/login` | Login | Público |
| `/register` | Cadastro | Público |
| `/carrinho` | Carrinho | Logado |
| `/meus-pedidos` | Meus Pedidos | Logado |
| `/admin` | Painel Admin | Admin/Atendente |

---

## 🛠️ Tecnologias

**Backend:**
- Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA / Hibernate
- PostgreSQL
- Lombok, Validation

**Frontend:**
- React 18 + Vite
- React Router DOM v6
- Tailwind CSS 3
- Axios
- Zustand (carrinho)
- React Hot Toast
- Lucide React (ícones)
