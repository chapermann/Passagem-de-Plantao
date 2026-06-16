# Guia de Deploy — Passagem de Plantão
## Cloudflare Worker + GitHub Pages

---

## PARTE 1 — Cloudflare Worker (o proxy da API NVIDIA)

### Passo 1 — Criar conta no Cloudflare
1. Acesse **https://cloudflare.com**
2. Clique em **Sign Up** (canto superior direito)
3. Preencha e-mail e senha → **Create Account**
4. Confirme o e-mail recebido

---

### Passo 2 — Acessar Workers & Pages
1. Após login, no menu lateral esquerdo clique em **Workers & Pages**
2. Clique no botão azul **Create**
3. Selecione a aba **Workers**
4. Clique em **Create Worker**

---

### Passo 3 — Nomear e criar o Worker
1. No campo **Name**, digite: `passagem-de-plantao`
   - A URL gerada será: `passagem-de-plantao.SEU-USUARIO.workers.dev`
2. Clique em **Deploy** (não edite o código ainda — vamos substituir a seguir)

---

### Passo 4 — Substituir o código do Worker
1. Após o deploy inicial, clique em **Edit code** (botão no canto superior direito)
2. Apague TODO o conteúdo do editor
3. Cole o conteúdo completo do arquivo **worker.js** fornecido
4. Clique em **Deploy** (botão azul superior direito)
5. Aguarde a mensagem: *"Your Worker has been deployed"*

---

### Passo 5 — Configurar a chave NVIDIA como variável secreta
> ⚠️ Este passo é essencial. Sem ele o Worker retorna erro 500.

1. Volte para a página do Worker (clique no nome `passagem-de-plantao`)
2. Clique na aba **Settings**
3. Role até a seção **Variables and Secrets**
4. Clique em **Add** → selecione **Secret**
5. Preencha:
   - **Variable name:** `NVIDIA_API_KEY`
   - **Value:** `nvapi-SUA_CHAVE_AQUI`  ← cole sua chave NVIDIA atual
6. Clique em **Deploy**

---

### Passo 6 — Testar o Worker
Abra o terminal ou use o site **https://reqbin.com** e envie:

```
POST https://passagem-de-plantao.SEU-USUARIO.workers.dev
Content-Type: application/json

{
  "model": "meta/llama-3.3-70b-instruct",
  "max_tokens": 50,
  "messages": [{"role":"user","content":"Responda apenas: funcionando"}]
}
```

A resposta deve conter `"content": "funcionando"` ou similar.

---

## PARTE 2 — GitHub Pages (o site do app)

### Passo 1 — Criar repositório
1. Acesse **https://github.com** e faça login
2. Clique em **+** (canto superior direito) → **New repository**
3. Preencha:
   - **Repository name:** `passagem-plantao`
   - Marque **Public**
4. Clique em **Create repository**

---

### Passo 2 — Fazer upload do HTML
1. Na página do repositório recém-criado, clique em **uploading an existing file**
2. Arraste o arquivo **passagem_plantao_final.html** para a área indicada
3. **Importante:** renomeie o arquivo para `index.html` antes de fazer upload
   - Ou após o upload, clique no arquivo → **Edit** → renomeie pelo menu de três pontos
4. No campo **Commit changes**, escreva: `Deploy inicial`
5. Clique em **Commit changes**

---

### Passo 3 — Ativar GitHub Pages
1. No repositório, clique em **Settings** (aba superior)
2. No menu lateral esquerdo, clique em **Pages**
3. Em **Source**, selecione:
   - Branch: **main**
   - Pasta: **/ (root)**
4. Clique em **Save**
5. Aguarde 1–2 minutos
6. A URL do app aparecerá na mesma página:
   **https://chapermann.github.io/passagem-plantao**

---

## RESULTADO FINAL

| Componente | URL |
|---|---|
| Worker (proxy) | https://passagem-de-plantao.chapermann.workers.dev |
| App web | https://chapermann.github.io/passagem-plantao |

---

## Limites do plano gratuito

| Serviço | Limite gratuito |
|---|---|
| Cloudflare Workers | 100.000 req/dia |
| NVIDIA NIM API | 40 req/min · créditos mensais gratuitos |
| GitHub Pages | Ilimitado para sites estáticos |

Para 18 pacientes × 3 plantões/dia = 54 requisições/dia → **muito abaixo dos limites**.

---

## Manutenção futura

**Trocar a chave NVIDIA:**
Cloudflare Dashboard → Workers & Pages → passagem-de-plantao → Settings → Variables and Secrets → editar `NVIDIA_API_KEY`

**Atualizar o app:**
GitHub → repositório → index.html → ícone de lápis (Edit) → colar novo conteúdo → Commit changes
O site atualiza automaticamente em 1–2 minutos.

**Trocar o modelo de IA:**
No arquivo worker.js ou diretamente no HTML, altere a linha:
`"model": "meta/llama-3.3-70b-instruct"`
Outros modelos disponíveis no NVIDIA NIM: `mistralai/mistral-7b-instruct-v0.3`, `google/gemma-3-27b-it`
