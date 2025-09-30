# 🛒 Marketplace - E-commerce Platform

Uma plataforma de e-commerce moderna construída com Next.js 14, TypeScript e Tailwind CSS.

## 🚀 Funcionalidades

- **Autenticação de Usuários**: Login e registro com diferentes níveis de acesso (USER/ADMIN)
- **Catálogo de Produtos**: Visualização de produtos com imagens e descrições
- **Carrinho de Compras**: Adicionar, remover e gerenciar itens
- **Painel Administrativo**: CRUD completo de produtos com upload de imagens


## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Context API** - Gerenciamento de estado global
- **Axios** - Cliente HTTP para API
- **Next/Image** - Otimização de imagens

## 📋 Pré-requisitos

- Node.js 18+ 
- npm, yarn, pnpm ou bun
- Backend API rodando (para funcionalidade completa)

## ⚙️ Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# URL da API Backend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Exemplo para produção
# NEXT_PUBLIC_API_URL=https://sua-api.com/api
```

## 🚀 Passo a Passo para Rodar o Projeto

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd marketplace
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Edite o arquivo .env.local com suas configurações
nano .env.local
```

### 4. Execute o servidor de desenvolvimento
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

### 5. Acesse a aplicação
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
marketplace/
├── app/                    # App Router (Next.js 13+)
│   ├── admin/             # Painel administrativo
│   ├── carrinho/          # Página do carrinho
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   └── page.tsx           # Página inicial
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI base
│   ├── Header.tsx        # Cabeçalho da aplicação
│   └── Footer.tsx        # Rodapé da aplicação
├── context/              # Contextos React
│   ├── AuthContext.tsx   # Contexto de autenticação
│   └── CartContext.tsx   # Contexto do carrinho
├── src/
│   └── services/         # Serviços da aplicação
│       └── api.tsx       # Configuração do Axios
└── public/              # Arquivos estáticos
```

## 🔐 Níveis de Acesso

### Usuário (USER)
- Visualizar produtos
- Adicionar itens ao carrinho
- Gerenciar carrinho de compras

### Administrador (ADMIN)
- Todas as funcionalidades de usuário
- Acessar painel administrativo (`/admin`)
- Criar, editar e deletar produtos
- Upload de imagens para produtos

## 🎨 Funcionalidades Principais

### Autenticação
- Login com email e senha
- Registro com validação de dados
- Controle de sessão com localStorage
- Redirecionamento automático baseado no role

### Produtos
- Listagem dos produtos


### Carrinho
- Adicionar/remover produtos
- Alterar quantidades
- Cálculo automático de totais
- Persistência no backend

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🔧 Configuração do Backend

Este frontend espera um backend com as seguintes rotas:

```
POST /api/auth/login
POST /api/auth/register
GET  /api/products
POST /api/products
PUT  /api/products/:id
DELETE /api/products/:id
GET  /api/cart
POST /api/cart/add-product
DELETE /api/cart/remove-product
```

## 🐛 Solução de problemas

### Problemas Comuns

1. **Erro de CORS**: Verifique se o backend está configurado para aceitar requisições do frontend
2. **Imagens não carregam**: Verifique se o `NEXT_PUBLIC_API_URL` está correto
3. **Login não funciona**: Verifique se o backend está rodando e acessível

### Logs de Debug

Para debugar problemas, verifique o console do navegador e os logs do servidor.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👥 Autores

- **Seu Nome** - *Desenvolvimento* - [SeuGitHub](https://github.com/maxwellmoura)
