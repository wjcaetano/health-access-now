-- ===================================
-- ETAPA 6.3: ÍNDICES DE PERFORMANCE
-- ===================================

-- Índice para agendamentos por data
CREATE INDEX IF NOT EXISTS idx_agendamentos_data 
ON agendamentos(data_agendamento);

-- Índice para agendamentos por cliente
CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente 
ON agendamentos(cliente_id, data_agendamento DESC);

-- Índice para agendamentos por prestador
CREATE INDEX IF NOT EXISTS idx_agendamentos_prestador 
ON agendamentos(prestador_id, data_agendamento DESC);

-- Índice para guias por status
CREATE INDEX IF NOT EXISTS idx_guias_status 
ON guias(status, data_emissao DESC);

-- Índice para guias por cliente
CREATE INDEX IF NOT EXISTS idx_guias_cliente 
ON guias(cliente_id, data_emissao DESC);

-- Índice para guias por prestador
CREATE INDEX IF NOT EXISTS idx_guias_prestador 
ON guias(prestador_id, data_emissao DESC);

-- Índice para vendas por data
CREATE INDEX IF NOT EXISTS idx_vendas_created_at 
ON vendas(created_at DESC);

-- Índice para vendas por cliente
CREATE INDEX IF NOT EXISTS idx_vendas_cliente 
ON vendas(cliente_id, created_at DESC);

-- Índice para avaliações por prestador
CREATE INDEX IF NOT EXISTS idx_avaliacoes_prestador 
ON avaliacoes(prestador_id, created_at DESC);

-- Índice para notificações não lidas
CREATE INDEX IF NOT EXISTS idx_notifications_unread 
ON notifications(user_id, read_at) 
WHERE read_at IS NULL;

-- Índice para orcamentos por status
CREATE INDEX IF NOT EXISTS idx_orcamentos_status 
ON orcamentos(status, created_at DESC);

-- Índice para orcamentos por cliente
CREATE INDEX IF NOT EXISTS idx_orcamentos_cliente 
ON orcamentos(cliente_id, status, created_at DESC);

-- Índice composto para queries de dashboard
CREATE INDEX IF NOT EXISTS idx_guias_dashboard 
ON guias(organizacao_id, status, data_emissao DESC);

-- Índice para busca de clientes por email
CREATE INDEX IF NOT EXISTS idx_clientes_email 
ON clientes(email);

-- Índice para busca de prestadores por tipo
CREATE INDEX IF NOT EXISTS idx_prestadores_tipo 
ON prestadores(tipo, ativo);

-- Comentários explicativos
COMMENT ON INDEX idx_agendamentos_data IS 'Otimiza queries de agendamentos por período';
COMMENT ON INDEX idx_guias_status IS 'Otimiza filtros de guias por status';
COMMENT ON INDEX idx_notifications_unread IS 'Partial index para notificações não lidas';
COMMENT ON INDEX idx_guias_dashboard IS 'Índice composto para dashboard queries';