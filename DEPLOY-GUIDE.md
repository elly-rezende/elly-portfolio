# Deploy Guide — Elly Portfolio
## GitHub + Supabase + Vercel — Passo a Passo

---

## PASSO 1: Configurar o Supabase (tabela de contatos)

1. Abra o Supabase: https://supabase.com/dashboard
2. Selecione o projeto **elly-rezende-dev** (o `linkedin-engine`)
3. No menu lateral, clique em **SQL Editor**
4. Cole e execute este SQL:

```sql
CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts"
  ON contacts FOR INSERT
  TO anon
  WITH CHECK (true);
```

5. Vá em **Settings → API** e copie:
   - **Project URL** (algo como `https://vinzdrztlsiznyhglagf.supabase.co`)
   - **anon public key** (começa com `eyJhbGci...`)

6. Abra o arquivo `src/App.jsx` e atualize estas duas linhas no topo:
```javascript
const SUPABASE_URL = "https://SEU-PROJECT-URL.supabase.co";  // ← cole aqui
const SUPABASE_KEY = "eyJhbGci...SUA-ANON-KEY...";           // ← cole aqui
```

---

## PASSO 2: Subir para o GitHub

Abra o terminal (ou Git Bash no Windows) e execute:

```bash
# 1. Entre na pasta do projeto
cd caminho/para/portfolio-src

# 2. Inicie o repositório Git
git init

# 3. Adicione todos os arquivos
git add .

# 4. Faça o primeiro commit
git commit -m "Initial commit - portfolio site"

# 5. Crie o repositório no GitHub (vá em github.com/new)
#    Nome sugerido: elly-portfolio
#    Marque como Public
#    NÃO marque "Add README" (já temos um)

# 6. Conecte e envie
git remote add origin https://github.com/elly-rezende/elly-portfolio.git
git branch -M main
git push -u origin main
```

---

## PASSO 3: Deploy na Vercel

1. Acesse https://vercel.com e faça login com sua conta GitHub
2. Clique em **"Add New" → "Project"**
3. Encontre e selecione **elly-portfolio** na lista de repositórios
4. A Vercel vai detectar automaticamente que é um projeto Vite
5. Configurações (devem estar pré-preenchidas):
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Clique em **"Deploy"**
7. Em ~1 minuto, seu site estará live em algo como: `elly-portfolio.vercel.app`

### (Opcional) Domínio personalizado
Se quiser, depois você pode configurar um domínio customizado tipo `elly.dev` em Vercel → Settings → Domains.

---

## PASSO 4: Testar o formulário

1. Acesse seu site na URL da Vercel
2. Vá até a seção Contact
3. Preencha nome, email e mensagem e envie
4. Volte ao Supabase → Table Editor → tabela `contacts`
5. Sua mensagem deve aparecer lá!

---

## RESUMO DA ARQUITETURA

```
Visitante acessa → elly-portfolio.vercel.app (Vercel)
                    ↓
                    React App (código no GitHub)
                    ↓
Contact form  →   Supabase REST API → tabela contacts (PostgreSQL)
```

---

## TROUBLESHOOTING

**"Failed to save" no formulário:**
- Verifique se a anon key no App.jsx está correta
- Verifique se a tabela `contacts` foi criada
- Verifique se a RLS policy foi criada

**Site não aparece na Vercel:**
- Confirme que o `package.json` está na raiz do repositório
- Confirme que o build command é `npm run build`

**Precisa atualizar algo no site:**
- Edite o `src/App.jsx`
- Faça `git add . && git commit -m "update" && git push`
- A Vercel faz deploy automático em ~30 segundos
