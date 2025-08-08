# Configuração para Rede Local

## 🌐 Configuração Automática

### 1. Configurar Rede
\`\`\`bash
# Execute como Administrador
configure-network.bat
\`\`\`

### 2. Iniciar Sistema para Rede
\`\`\`bash
start-system-network.bat
\`\`\`

### 3. Testar Conectividade
\`\`\`bash
test-network.bat
\`\`\`

## 🔧 Configuração Manual

### 1. Descobrir IP do Servidor
\`\`\`cmd
ipconfig
\`\`\`
Anote o "Endereço IPv4" (ex: 192.168.1.100)

### 2. Configurar Firewall
\`\`\`cmd
# Execute como Administrador
netsh advfirewall firewall add rule name="Sistema Escala - Frontend" dir=in action=allow protocol=TCP localport=3000
netsh advfirewall firewall add rule name="Sistema Escala - Backend" dir=in action=allow protocol=TCP localport=3001
\`\`\`

### 3. Atualizar Configuração
Edite o arquivo `.env.local`:
\`\`\`
NEXT_PUBLIC_API_URL=http://[SEU_IP]:3001/api
PORT=3000
\`\`\`

### 4. Reiniciar Sistema
\`\`\`bash
start-system.bat
\`\`\`

## 📱 Acesso de Outros Dispositivos

### Computadores
- Acesse: `http://[IP_DO_SERVIDOR]:3000`
- Exemplo: `http://192.168.1.100:3000`

### Celulares/Tablets
- Conecte na mesma rede WiFi
- Abra o navegador
- Digite o mesmo endereço

## 🔍 Solução de Problemas

### Outros computadores não acessam:
1. **Verificar rede**: Todos na mesma rede WiFi/cabo?
2. **Testar ping**: `ping [IP_DO_SERVIDOR]`
3. **Firewall**: Execute `configure-network.bat` como Admin
4. **Antivírus**: Pode estar bloqueando as portas

### Backend não conecta:
1. **Verificar se está rodando**: Veja se a janela do backend está aberta
2. **Testar localmente**: `http://localhost:3001/api/status`
3. **Verificar porta**: Porta 3001 pode estar ocupada

### Dados não sincronizam:
1. **Mesmo servidor**: Todos devem acessar o mesmo IP
2. **Cache do navegador**: Pressione Ctrl+F5 para atualizar
3. **Conexão**: Verifique se não perdeu conexão com servidor

## 📋 Checklist de Configuração

- [ ] Node.js instalado no servidor
- [ ] Sistema instalado (`install-system.bat`)
- [ ] Rede configurada (`configure-network.bat`)
- [ ] Firewall configurado (portas 3000 e 3001)
- [ ] IP do servidor anotado
- [ ] Sistema iniciado (`start-system-network.bat`)
- [ ] Teste de conectividade realizado
- [ ] Outros computadores testados

## 🎯 Resultado Esperado

Após a configuração:
- ✅ Servidor principal roda o sistema
- ✅ Outros computadores acessam via navegador
- ✅ Todos veem os mesmos dados em tempo real
- ✅ Alterações aparecem para todos instantaneamente
- ✅ Sistema funciona sem internet (apenas rede local)
