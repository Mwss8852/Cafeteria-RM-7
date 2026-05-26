from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
import requests
import os
import re
import json

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000"])

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8080")


def buscar_produtos():
    try:
        res = requests.get(f"{BACKEND_URL}/api/produtos", timeout=5)
        if res.status_code == 200:
            return res.json()
        return []
    except:
        return []


def buscar_pedidos_usuario(token):
    try:
        headers = {"Authorization": f"Bearer {token}"}
        res = requests.get(f"{BACKEND_URL}/api/pedidos/meus", headers=headers, timeout=5)
        if res.status_code == 200:
            return res.json()
        return []
    except:
        return []


def criar_pedido(token, itens, numero_mesa=None, observacao=None):
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = {
            "itens": itens,
            "numeroMesa": numero_mesa,
            "observacao": observacao
        }
        res = requests.post(
            f"{BACKEND_URL}/api/pedidos",
            json=payload,
            headers=headers,
            timeout=5
        )
        if res.status_code == 201:
            return res.json()
        return None
    except:
        return None


def montar_contexto(token=None):
    produtos = buscar_produtos()
    cardapio_texto = ""
    if produtos:
        for p in produtos:
            disponivel = "✅ Disponível" if p.get("disponivel") else "❌ Indisponível"
            tempo = str(p.get("tempoPreparo", "?")) + " min" if p.get("tempoPreparo") else "rápido"
            cardapio_texto += "\n- ID:" + str(p["id"]) + " | " + p["nome"] + " | R$ " + f"{float(p['preco']):.2f}" + " | " + disponivel + " | Preparo: " + tempo + "\n"
            cardapio_texto += "  Descrição: " + p.get("descricao", "") + "\n"
    else:
        cardapio_texto = "Cardápio temporariamente indisponível."

    pedidos_texto = ""
    if token:
        pedidos = buscar_pedidos_usuario(token)
        if pedidos:
            for ped in pedidos[:5]:
                itens = ", ".join([str(i["quantidade"]) + "x " + i["nomeProduto"] for i in ped.get("itens", [])])
                pedidos_texto += "\n- Pedido #" + str(ped["id"]) + " | Status: " + ped["status"] + " | Total: R$ " + f"{float(ped['valorTotal']):.2f}" + "\n"
                pedidos_texto += "  Itens: " + itens + "\n"
        else:
            pedidos_texto = "Nenhum pedido encontrado."

    return cardapio_texto, pedidos_texto


def montar_system_prompt(cardapio_texto, pedidos_texto, nome_usuario=None):
    saudacao = "O cliente se chama " + nome_usuario + "." if nome_usuario else "O cliente não está logado."

    return """Você é o Café Bot ☕, assistente virtual da Cafeteria RM.

""" + saudacao + """

═══════════════════════════════
📋 CARDÁPIO COM IDs:
═══════════════════════════════
""" + cardapio_texto + """

═══════════════════════════════
📦 PEDIDOS DO CLIENTE:
═══════════════════════════════
""" + (pedidos_texto if pedidos_texto else "Cliente não autenticado ou sem pedidos.") + """

═══════════════════════════════
📌 REGRAS:
═══════════════════════════════
1. Responda sempre em português brasileiro, de forma calorosa
2. Mencione o PREÇO ao recomendar produtos
3. Sugira combinações (ex: cappuccino + croissant)
4. Se produto indisponível, sugira alternativa
5. Nunca invente informações
6. Use emojis com moderação
7. Finalize com pergunta ou sugestão
8. Se o cliente confirmar que quer fazer um pedido, use EXATAMENTE o formato abaixo:
   FAZER_PEDIDO:[{"produtoId": ID, "quantidade": QTD}]
9. Só use FAZER_PEDIDO quando o cliente confirmar claramente que quer pedir
10. Se cliente não estiver logado, peça para ele fazer login primeiro
"""


historicos = {}


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "agente": "Café Bot RM ☕"})


@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    mensagem = data.get("mensagem", "").strip()
    session_id = data.get("sessionId", "anonimo")
    token = data.get("token")
    nome_usuario = data.get("nomeUsuario")

    if not mensagem:
        return jsonify({"erro": "Mensagem vazia"}), 400

    if session_id not in historicos:
        historicos[session_id] = []

    cardapio_texto, pedidos_texto = montar_contexto(token)
    system_prompt = montar_system_prompt(cardapio_texto, pedidos_texto, nome_usuario)

    mensagens = [{"role": "system", "content": system_prompt}]
    mensagens += historicos[session_id][-10:]
    mensagens.append({"role": "user", "content": mensagem})

    try:
        resposta = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=mensagens,
            temperature=0.7,
            max_tokens=512,
        )

        texto_resposta = resposta.choices[0].message.content

        # ═══ DETECTA E EXECUTA PEDIDO ═══
        match = re.search(r'FAZER_PEDIDO:(\[.*?\])', texto_resposta, re.DOTALL)

        if match and token:
            try:
                itens = json.loads(match.group(1))
                resultado = criar_pedido(token, itens)
                if resultado:
                    itens_lista = ", ".join([str(i["quantidade"]) + "x " + i["nomeProduto"] for i in resultado.get("itens", [])])
                    texto_resposta = "✅ Pedido #" + str(resultado["id"]) + " realizado com sucesso!\n\n"
                    texto_resposta += "🛒 Itens: " + itens_lista + "\n"
                    texto_resposta += "💰 Total: R$ " + f"{float(resultado['valorTotal']):.2f}" + "\n"
                    texto_resposta += "📋 Status: " + resultado["status"] + "\n\n"
                    texto_resposta += "Posso ajudar com mais alguma coisa? ☕"
                else:
                    texto_resposta = "❌ Não consegui finalizar o pedido. Tente pelo cardápio do site."
            except Exception as e:
                texto_resposta = "❌ Erro ao criar pedido: " + str(e)

        elif match and not token:
            texto_resposta = "Para fazer um pedido você precisa estar logado! 🔐\n\nAcesse /login, entre na sua conta e volte aqui para pedir. ☕"

        historicos[session_id].append({"role": "user", "content": mensagem})
        historicos[session_id].append({"role": "assistant", "content": texto_resposta})

        if len(historicos[session_id]) > 20:
            historicos[session_id] = historicos[session_id][-20:]

        return jsonify({"resposta": texto_resposta, "sessionId": session_id})

    except Exception as e:
        return jsonify({"erro": "Erro ao chamar Groq: " + str(e)}), 500


@app.route("/limpar", methods=["POST"])
def limpar():
    data = request.json
    session_id = data.get("sessionId", "anonimo")
    if session_id in historicos:
        del historicos[session_id]
    return jsonify({"ok": True, "mensagem": "Histórico limpo"})


@app.route("/produtos", methods=["GET"])
def produtos():
    return jsonify(buscar_produtos())


if __name__ == "__main__":
    port = int(os.getenv("AGENT_PORT", 5000))
    print(f"☕ Café Bot RM rodando na porta {port}")
    app.run(host="0.0.0.0", port=port, debug=True)