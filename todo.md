# Loba Marcenaria Criativa - TODO

## Funcionalidades Principais

- [x] Autenticação via Face ID
- [x] Tela de Login com fallback para PIN
- [x] Navegação com abas (Catálogo, Estoque, Explorer)
- [x] Módulo Catálogo de Produtos
- [x] Adicionar/editar/deletar produtos no catálogo
- [x] Suporte a 4 fotos por produto
- [x] Campos de medidas no catálogo (altura, largura, profundidade)
- [x] Módulo Controle de Estoque
- [x] Adicionar/editar/deletar peças no estoque
- [x] Suporte a 4 fotos por peça
- [x] Campo de tipo de madeira
- [x] Campo de quantidade em estoque
- [x] Campos de medidas no estoque (altura, largura, profundidade)
- [x] Módulo Explorer de preços de paletes
- [x] Integração com localização do dispositivo
- [x] Busca de fornecedores próximos
- [x] Exibição de nome, telefone e preço do palete
- [x] Integração com app de telefone (ligar)
- [x] Integração com Apple Maps
- [x] Tema preto com detalhes amarelos
- [x] Idioma português brasileiro
- [x] Persistência de dados com AsyncStorage
- [x] Feedback visual (haptics, loading states)
- [ ] Testes e validação de fluxos
- [ ] Gerar logo do app
- [ ] Revisão final e ajustes de UI/UX

## Bugs Reportados

(Nenhum no momento)

## Melhorias Futuras

- [ ] Sincronização em nuvem (opcional)
- [ ] Relatórios de vendas
- [ ] Integração com WhatsApp para contato com clientes
- [ ] Histórico de transações

## Bugs Encontrados

- [x] Remover rotas internas do catálogo da barra de abas (catalog/index, catalog-detail, catalog/detail aparecem como abas)

## Alterações Solicitadas

- [x] Corrigir abas duplicadas de catálogo
- [x] Renomear "Catálogo" para "Produtos"
- [x] Adicionar logo como marca d'água nas páginas

## Novas Alterações Solicitadas

- [x] Aumentar tamanho da marca d'água e centralizar no meio da página
- [x] Criar aba de Configurações com tema claro/escuro
- [x] Criar aba Sobre com data de criação, versão e criador

## Implementação de Tema Claro/Escuro

- [x] Criar contexto de tema persistente
- [x] Implementar toggle de tema na aba Configurações
- [x] Salvar preferência de tema no AsyncStorage
- [x] Aplicar tema em todo o app
