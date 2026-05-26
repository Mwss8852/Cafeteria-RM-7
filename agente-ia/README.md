# ☕ Café Bot RM — Agente de IA

Agente inteligente da Cafeteria RM usando **Python Flask + Groq (LLaMA 3 70B)**.

---

## O que o agente faz

- Apresenta e vende produtos do cardápio com entusiasmo
- Sugere combinações (ex: cappuccino + croissant)
- Consulta pedidos reais do usuário logado
- Responde dúvidas sobre ingredientes e tempo de preparo
- Faz upsell de forma natural e não invasiva
- Mantém histórico da conversa por sessão

---

## Como rodar

### 1. Obter a chave do Groq (gratuita)
- Acesse: https://console.groq.com
- Crie uma conta e gere uma API Key
- Cole no arquivo `.env`:
```
GROQ_API_KEY=sua_chave_aqui
```

### 2. Instalar dependências
```bash
cd agente-ia
pip install -r requirements.txt
```

### 3. Rodar o agente
```bash
python app.py
```

O agente sobe em: **http://localhost:5000**

---

## Rotas da API do agente

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/health` | Verifica se o agente está online |
| POST | `/chat` | Envia mensagem e recebe resposta |
| POST | `/limpar` | Limpa histórico da sessão |
| GET | `/produtos` | Lista produtos via agente |

### Exemplo de requisição `/chat`:
```json
POST http://localhost:5000/chat

{
  "mensagem": "Qual café você recomenda?",
  "sessionId": "usuario_123",
  "token": "Bearer eyJ...",
  "nomeUsuario": "João"
}
```

---

## Modelo usado
- **LLaMA 3 70B** via Groq (rápido e gratuito)
- Contexto: cardápio real + pedidos do usuário
- Histórico: últimas 10 mensagens por sessão

---

## Rodar tudo junto

Terminal 1 — Backend Java:
```bash
cd backend && mvn spring-boot:run
```

Terminal 2 — Agente Python:
```bash
cd agente-ia && python app.py
```

Terminal 3 — Frontend React:
```bash
cd frontend && npm run dev
```
