
# AGENDAJA - Documentação do Sistema

## 📋 Visão Geral do Sistema

O AGENDAJA é um sistema completo de gestão de saúde que oferece diferentes portais para diferentes tipos de usuários, incluindo uma estrutura de franquia com holding e unidades operacionais.

## 🏗️ Estrutura do Sistema

### Organização Hierárquica
```
🏢 AGENDAJA (Holding/Franqueadora)
├── 🏪 Franquias/Unidades
│   ├── 👥 Clientes
│   ├── 👨‍⚕️ Prestadores
│   ├── 📋 Serviços
│   ├── 📅 Agendamentos
│   └── 💰 Vendas
└── 🔧 Administração
    ├── 👨‍💼 Colaboradores
    ├── 📊 Relatórios
    ├── 💳 Financeiro
    └── ⚙️ Configurações
```

### Níveis de Acesso
- **👑 Admin**: Acesso total ao sistema
- **👨‍💼 Gerente**: Gestão operacional e relatórios
- **👥 Colaborador**: Operações básicas do dia a dia
- **👨‍⚕️ Prestador**: Portal específico para prestadores de serviços

## 🌐 Estrutura de Rotas (Endpoints)

### Rotas Públicas
- **`/`**: Página inicial da empresa (landing page)
- **`/login`**: Página de login/cadastro
- **`/portal-parceiro`**: Portal para parceiros
- **`/seja-franqueado`**: Página de informações sobre franquia

### Rotas Protegidas (Sistema Administrativo)
Todas as rotas administrativas estão sob `/sistema/*` e requerem autenticação:

#### Dashboard Principal
- **`/sistema/dashboard`**: Dashboard principal do sistema

#### Gestão Operacional
- **`/sistema/vendas`**: Gestão de vendas
- **`/sistema/agendamentos`**: Gestão de agendamentos
- **`/sistema/clientes`**: Gestão de clientes
- **`/sistema/prestadores`**: Gestão de prestadores
- **`/sistema/servicos`**: Gestão de serviços
- **`/sistema/orcamentos`**: Gestão de orçamentos
- **`/sistema/guias`**: Gestão de guias

#### Gestão Administrativa
- **`/sistema/financeiro`**: Gestão financeira
- **`/sistema/colaboradores`**: Gestão de colaboradores
- **`/sistema/usuarios`**: Gestão de usuários
- **`/sistema/relatorios`**: Relatórios do sistema
- **`/sistema/configuracoes`**: Configurações do sistema

#### Portal da Franqueadora (Admin/Gerente)
- **`/sistema/franqueadora/dashboard`**: Dashboard da franqueadora
- **`/sistema/franqueadora/franquias`**: Gestão de franquias
- **`/sistema/franqueadora/leads`**: Leads de franqueados
- **`/sistema/franqueadora/financeiro`**: Financeiro da matriz
- **`/sistema/franqueadora/royalties`**: Gestão de royalties
- **`/sistema/franqueadora/contratos`**: Gestão de contratos
- **`/sistema/franqueadora/relatorios`**: Relatórios executivos

#### Portal do Prestador
- **`/sistema/prestador/portal`**: Dashboard do prestador
- **`/sistema/prestador/guias`**: Guias do prestador
- **`/sistema/prestador/faturamento`**: Faturamento do prestador

## 📖 Como Usar o Sistema

### 1. 🏠 Acessando o Sistema

#### Primeira Visita
1. Digite o endereço do sistema no navegador
2. Você será direcionado para a página inicial (`/`) que contém:
   - Informações sobre a empresa
   - Serviços oferecidos
   - Depoimentos de clientes
   - Botão para acessar o sistema

#### Fazendo Login
1. Na página inicial, clique em **"Acessar Sistema"** ou **"Login"**
2. Digite seu **email** e **senha**
3. Clique em **"Entrar"**
4. Se não tem conta, clique em **"Não tem conta? Cadastre-se"**

### 2. 📊 Após o Login - Dashboard Principal

Após fazer login, você será direcionado para `/sistema/dashboard` onde encontrará:

- **📈 Métricas principais**: Vendas, agendamentos, clientes
- **📅 Agenda do dia**: Próximos agendamentos
- **💰 Resumo financeiro**: Receitas e despesas
- **🔔 Notificações**: Alertas importantes

### 3. 🧭 Navegação no Sistema

#### Menu Principal (Lateral Esquerdo)
O menu é organizado por seções baseadas no seu nível de acesso:

**Para Colaboradores, Gerentes e Admins:**
- 📊 Dashboard
- 💰 Vendas
- 📅 Agendamentos
- 👥 Clientes
- 👨‍⚕️ Prestadores
- 📋 Serviços
- 💵 Orçamentos
- 📄 Guias

**Para Gerentes e Admins (seção adicional):**
- 💳 Financeiro
- 👨‍💼 Colaboradores
- 👤 Usuários
- 📊 Relatórios
- ⚙️ Configurações

**Para Admins (seção Franqueadora):**
- 🏢 Dashboard Franqueadora
- 🏪 Gestão de Franquias
- 📈 Leads de Franqueados
- 💰 Financeiro Matriz
- 👑 Gestão de Royalties
- 📄 Gestão de Contratos
- 📊 Relatórios Executivos

**Para Prestadores:**
- 📊 Portal do Prestador
- 📄 Minhas Guias
- 💰 Faturamento

#### Navegação Superior
- **🔍 Busca global**: Para encontrar clientes, serviços, etc.
- **🔔 Notificações**: Alertas e mensagens importantes
- **👤 Perfil**: Acesso às configurações pessoais e logout

### 4. 📱 Funcionalidades Principais

#### Gestão de Vendas
1. Acesse **Vendas** no menu lateral
2. Para nova venda: clique em **"Nova Venda"**
3. Busque ou cadastre o cliente
4. Adicione os serviços desejados
5. Defina o método de pagamento
6. Finalize a venda

#### Gestão de Agendamentos
1. Acesse **Agendamentos** no menu lateral
2. Para novo agendamento: clique em **"Novo Agendamento"**
3. Selecione cliente, serviço e prestador
4. Escolha data e horário
5. Adicione observações se necessário
6. Confirme o agendamento

#### Gestão de Clientes
1. Acesse **Clientes** no menu lateral
2. Para novo cliente: clique em **"Novo Cliente"**
3. Preencha os dados pessoais
4. Salve o cadastro
5. Use a busca para encontrar clientes existentes

### 5. 🔐 Logout e Segurança

#### Como Sair do Sistema
1. Clique no seu **nome/foto** no canto superior direito
2. Clique em **"Sair"** ou **"Logout"**
3. Você será redirecionado para a página de login

#### Dicas de Segurança
- Sempre faça logout ao terminar de usar o sistema
- Não compartilhe suas credenciais de acesso
- Use senhas fortes (mínimo 6 caracteres)
- Em caso de esquecimento da senha, use "Esqueceu a senha?"

### 6. 📞 Suporte e Ajuda

#### Em Caso de Problemas
- Entre em contato com o administrador do sistema
- Verifique se sua conexão com internet está funcionando
- Limpe o cache do navegador se necessário

#### Informações Técnicas
- O sistema funciona melhor nos navegadores Chrome, Firefox e Safari
- Mantenha seu navegador sempre atualizado
- Para melhor experiência, use tela com resolução mínima de 1024x768

## 🔧 Níveis de Acesso Detalhados

### 👑 Administrador
- Acesso completo a todas as funcionalidades
- Pode gerenciar usuários e colaboradores
- Acesso ao módulo da franqueadora
- Pode configurar o sistema

### 👨‍💼 Gerente
- Acesso às operações administrativas
- Pode visualizar relatórios
- Gerencia equipe operacional
- Acesso parcial ao módulo franqueadora

### 👥 Colaborador
- Acesso às operações básicas
- Vendas, agendamentos, clientes
- Prestadores e serviços
- Sem acesso administrativo

### 👨‍⚕️ Prestador
- Portal específico e restrito
- Visualização de suas guias
- Controle de faturamento
- Agenda pessoal

---

**🏥 AGENDAJA - Sistema de Gestão de Saúde**
*Versão 1.0 - Documentação para Usuários*
