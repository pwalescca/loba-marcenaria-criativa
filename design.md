# Design de Interface - Loba Marcenaria Criativa

## Visão Geral

O aplicativo **Loba Marcenaria Criativa** é um gerenciador de negócios para uma marcenaria de paletes. O design segue as **Apple Human Interface Guidelines (HIG)** com orientação em retrato (9:16) e suporte a uso com uma mão.

**Paleta de Cores:**
- **Cor Primária**: Preto (#000000)
- **Cor Secundária**: Amarelo (#FFD700)
- **Cor de Fundo**: Preto (#1a1a1a)
- **Cor de Texto**: Branco (#FFFFFF)
- **Cor de Superfície**: Cinza escuro (#2a2a2a)

---

## Lista de Telas

1. **Tela de Login (Face ID)** - Autenticação biométrica
2. **Tela Home** - Navegação principal com abas
3. **Catálogo de Produtos** - Listagem e gerenciamento de produtos
4. **Detalhe do Produto** - Visualização e edição de um produto
5. **Estoque** - Listagem e gerenciamento de peças em estoque
6. **Detalhe do Estoque** - Visualização e edição de uma peça
7. **Explorer** - Busca de preços de paletes na região
8. **Detalhe do Fornecedor** - Informações do fornecedor de paletes

---

## Fluxos de Usuário Principais

### Fluxo 1: Autenticação
1. Usuário abre o app
2. Tela de Login com Face ID aparece
3. Usuário autoriza com Face ID
4. Acesso concedido → Tela Home

### Fluxo 2: Gerenciar Catálogo
1. Usuário toca na aba "Catálogo"
2. Lista de produtos aparece
3. Usuário toca em um produto → Detalhe do Produto
4. Usuário pode editar ou adicionar novo produto
5. Salvar → Retorna à lista

### Fluxo 3: Gerenciar Estoque
1. Usuário toca na aba "Estoque"
2. Lista de peças em estoque aparece
3. Usuário toca em uma peça → Detalhe do Estoque
4. Usuário pode editar quantidade, tipo de madeira, medidas e fotos
5. Salvar → Retorna à lista

### Fluxo 4: Buscar Preços de Paletes
1. Usuário toca na aba "Explorer"
2. App solicita localização do usuário
3. Lista de fornecedores próximos aparece
4. Usuário toca em um fornecedor → Detalhe do Fornecedor
5. Informações: nome, telefone, preço do palete

---

## Descrição Detalhada das Telas

### 1. Tela de Login (Face ID)

**Conteúdo:**
- Logo da Loba Marcenaria Criativa (centro superior)
- Texto: "Bem-vindo à Loba Marcenaria Criativa"
- Botão: "Autenticar com Face ID"
- Mensagem de status (sucesso/erro)

**Funcionalidade:**
- Biometria via Face ID (iOS)
- Fallback para PIN/senha se Face ID não disponível
- Persistência de sessão com AsyncStorage

---

### 2. Tela Home

**Conteúdo:**
- Barra de abas na parte inferior (3 abas)
- Aba 1: "Catálogo" (ícone: catálogo/livro)
- Aba 2: "Estoque" (ícone: caixa/inventário)
- Aba 3: "Explorer" (ícone: lupa/busca)

**Funcionalidade:**
- Navegação entre as três seções principais
- Cada aba carrega seu conteúdo específico

---

### 3. Catálogo de Produtos

**Conteúdo:**
- Título: "Catálogo de Produtos"
- Botão flutuante: "+" (adicionar novo produto)
- Lista de produtos em cards:
  - Imagem principal (primeira das 4 fotos)
  - Nome do produto
  - Descrição resumida
  - Medidas (altura x largura x profundidade)

**Funcionalidade:**
- Listar todos os produtos
- Toque em um card → Detalhe do Produto
- Swipe para deletar (com confirmação)
- Busca/filtro por nome (opcional)

---

### 4. Detalhe do Produto

**Conteúdo:**
- Galeria de 4 fotos (carousel horizontal)
- Nome do produto (editável)
- Descrição completa (editável)
- Medidas (altura, largura, profundidade) - editáveis
- Botões: "Salvar" e "Cancelar"

**Funcionalidade:**
- Adicionar/remover fotos (câmera ou galeria)
- Editar informações
- Salvar ou descartar mudanças

---

### 5. Estoque

**Conteúdo:**
- Título: "Controle de Estoque"
- Botão flutuante: "+" (adicionar nova peça)
- Lista de peças em cards:
  - Imagem principal (primeira das 4 fotos)
  - Tipo de madeira
  - Medidas
  - Quantidade em estoque

**Funcionalidade:**
- Listar todas as peças
- Toque em um card → Detalhe do Estoque
- Swipe para deletar (com confirmação)
- Busca/filtro por tipo de madeira (opcional)

---

### 6. Detalhe do Estoque

**Conteúdo:**
- Galeria de 4 fotos (carousel horizontal)
- Tipo de madeira (editável - dropdown ou seleção)
- Medidas (altura, largura, profundidade) - editáveis
- Quantidade em estoque (editável - spinner/input numérico)
- Botões: "Salvar" e "Cancelar"

**Funcionalidade:**
- Adicionar/remover fotos
- Editar informações
- Controlar quantidade (incrementar/decrementar)
- Salvar ou descartar mudanças

---

### 7. Explorer

**Conteúdo:**
- Título: "Buscar Preços de Paletes"
- Botão: "Usar Minha Localização"
- Raio de busca (slider: 1km a 50km)
- Lista de fornecedores em cards:
  - Nome do lugar
  - Distância
  - Telefone (clicável)
  - Preço do palete
  - Ícone de mapa (abrir no Maps)

**Funcionalidade:**
- Solicitar permissão de localização
- Buscar fornecedores próximos (integração com API ou dados locais)
- Ligar para fornecedor (integração com Phone)
- Abrir localização no Mapa

---

### 8. Detalhe do Fornecedor

**Conteúdo:**
- Nome do lugar
- Endereço completo
- Telefone (com botão para ligar)
- Preço do palete
- Distância da sua localização
- Botão: "Abrir no Mapa"

**Funcionalidade:**
- Exibir informações do fornecedor
- Ligar diretamente
- Abrir localização no Apple Maps

---

## Padrões de Design

### Tipografia
- **Títulos**: 28px, Peso: Bold, Cor: Amarelo (#FFD700)
- **Subtítulos**: 18px, Peso: Semibold, Cor: Branco (#FFFFFF)
- **Corpo**: 16px, Peso: Regular, Cor: Branco (#FFFFFF)
- **Labels**: 14px, Peso: Regular, Cor: Cinza (#999999)

### Espaçamento
- Padding padrão: 16px
- Margin entre elementos: 12px
- Raio de cantos: 12px (cards), 8px (inputs)

### Componentes Reutilizáveis
- **Card**: Fundo cinza escuro, borda sutil, sombra
- **Botão Primário**: Fundo amarelo, texto preto, altura 48px
- **Botão Secundário**: Borda amarela, texto amarelo, fundo transparente
- **Input**: Fundo cinza escuro, borda cinza, texto branco
- **Galeria de Fotos**: Carousel horizontal com indicadores

### Feedback Visual
- **Press**: Opacidade 0.7 ao tocar
- **Haptics**: Feedback tátil em ações principais
- **Loading**: Spinner centralizado
- **Erro**: Mensagem em vermelho (#FF6B6B)
- **Sucesso**: Mensagem em verde (#51CF66)

---

## Considerações de Usabilidade

1. **Uma mão**: Todos os botões principais na metade inferior da tela
2. **Segurança**: Face ID para acesso, dados armazenados localmente
3. **Performance**: Lazy loading de imagens, cache de dados
4. **Acessibilidade**: Contraste adequado, labels descritivos
5. **Offline**: Funcionalidade básica sem internet (sincronização posterior)

---

## Próximos Passos

1. Implementar autenticação com Face ID
2. Criar estrutura de navegação com abas
3. Desenvolver módulo de Catálogo
4. Desenvolver módulo de Estoque
5. Integrar Explorer com localização e API de fornecedores
6. Testes e ajustes finais
