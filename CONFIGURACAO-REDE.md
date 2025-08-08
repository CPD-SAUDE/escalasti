# Configuração de Rede para o Sistema de Escala de Sobreaviso

Este documento detalha as configurações de rede necessárias para que o Sistema de Escala de Sobreaviso funcione corretamente em um ambiente de rede local, permitindo o acesso de múltiplos dispositivos.

## 1. Obtenção do Endereço IP da Máquina Host

Para que o frontend (Next.js) possa se comunicar com o backend (Node.js/Express) quando ambos estão rodando em diferentes máquinas ou quando o frontend é acessado de outros dispositivos na rede, o frontend precisa saber o endereço IP da máquina onde o backend está hospedado.

### No Windows:
1. Abra o **Prompt de Comando** (pesquise por `cmd` no menu Iniciar).
2. Digite `ipconfig` e pressione Enter.
3. Procure pela sua conexão de rede ativa (ex: "Adaptador Ethernet Ethernet", "Adaptador de LAN sem fio Wi-Fi").
4. O valor ao lado de "Endereço IPv4" é o seu IP de rede (ex: `192.168.1.100`).

### No Linux/macOS:
1. Abra o **Terminal**.
2. Digite `ifconfig` ou `ip a` e pressione Enter.
3. Procure pela sua interface de rede ativa (ex: `eth0`, `wlan0`, `en0`).
4. O valor ao lado de `inet` (ou `inet addr` em algumas versões) é o seu IP de rede (ex: `192.168.1.100`).

## 2. Configuração do Frontend (`.env.local`)

O frontend do Next.js utiliza uma variável de ambiente para saber onde encontrar a API do backend. Esta variável é definida no arquivo `.env.local` na raiz do projeto frontend.

1.  **Crie ou edite o arquivo `.env.local`** na raiz do seu projeto (onde está o `package.json` do frontend).
2.  Adicione a seguinte linha, substituindo `<SEU_IP_DE_REDE>` pelo endereço IP que você obteve no passo anterior:

    \`\`\`
    NEXT_PUBLIC_API_URL=http://<SEU_IP_DE_REDE>:3001/api
    \`\`\`
    **Exemplo:** Se o seu IP for `192.168.1.100`, o arquivo `.env.local` deve conter:
    \`\`\`
    NEXT_PUBLIC_API_URL=http://192.168.1.100:3001/api
    \`\`\`

    **Importante:** Se você estiver usando Docker Compose, a comunicação entre os serviços `frontend` e `backend` é feita internamente pela rede Docker, usando o nome do serviço (`http://backend:3001/api`). A configuração acima é mais relevante para execução local sem Docker ou para cenários específicos de rede. No Docker Compose, o `docker-compose.yml` já cuida disso.

## 3. Reinício do Frontend

Após alterar o arquivo `.env.local`, é crucial reiniciar o servidor de desenvolvimento do frontend para que as novas variáveis de ambiente sejam carregadas.

\`\`\`bash
# Se o frontend estiver rodando, pare-o (Ctrl+C)
npm run dev
\`\`\`

## 4. Configuração de Firewall (Opcional, mas Recomendado)

Se você tiver um firewall ativo na máquina onde o backend está rodando, pode ser necessário abrir as portas 3000 (para o frontend) e 3001 (para o backend) para permitir o acesso de outros dispositivos na rede.

### No Windows (Firewall do Windows):
1. Abra o **Painel de Controle** > **Sistema e Segurança** > **Firewall do Windows Defender**.
2. Clique em "Configurações avançadas" no painel esquerdo.
3. No painel esquerdo, clique em "Regras de Entrada".
4. No painel direito, clique em "Nova Regra...".
5. Selecione "Porta" e clique em "Avançar".
6. Selecione "Portas TCP específicas" e digite `3000, 3001`. Clique em "Avançar".
7. Selecione "Permitir a conexão" e clique em "Avançar".
8. Marque os perfis de rede aplicáveis (Domínio, Particular, Público) e clique em "Avançar".
9. Dê um nome à regra (ex: "Sistema Escala TI") e clique em "Concluir".

### No Linux (ex: UFW - Ubuntu):
\`\`\`bash
sudo ufw allow 3000/tcp
sudo ufw allow 3001/tcp
sudo ufw enable # Se o UFW não estiver ativo
\`\`\`

## 5. Teste de Conectividade

Após todas as configurações, você pode testar o acesso de outro dispositivo na mesma rede:

1.  Em outro computador ou celular conectado à mesma rede Wi-Fi/cabo, abra um navegador.
2.  Digite o endereço IP da máquina host seguido da porta do frontend: `http://<SEU_IP_DE_REDE>:3000`

Se tudo estiver configurado corretamente, o sistema deverá carregar e funcionar normalmente.
