# Configuração de Rede para o Sistema de Escala de Sobreaviso

Este documento descreve como configurar a rede para que o Sistema de Escala de Sobreaviso possa ser acessado por outros dispositivos na mesma rede local.

## 1. Obter o Endereço IP Local

O sistema precisa saber o endereço IP do computador onde o backend está rodando para que o frontend (e outros dispositivos) possa se conectar a ele.

Você pode obter o IP local executando o script Node.js fornecido:

\`\`\`bash
node backend/scripts/get-network-ip.js
\`\`\`

Este script irá exibir o IP principal da sua máquina. Anote-o, pois ele será usado nas configurações.

## 2. Configurar o Firewall do Windows (se aplicável)

Se você estiver usando o Firewall do Windows, precisará adicionar regras para permitir o tráfego nas portas usadas pelo sistema:

*   **Porta 3000:** Usada pelo Frontend (Next.js)
*   **Porta 3001:** Usada pelo Backend (Express.js API)

**Passos para adicionar regras no Firewall do Windows:**

1.  Abra o **Painel de Controle** > **Sistema e Segurança** > **Firewall do Windows Defender**.
2.  Clique em **Configurações avançadas** no painel esquerdo.
3.  No painel esquerdo, clique em **Regras de Entrada**.
4.  No painel direito, clique em **Nova Regra...**.
5.  Selecione **Porta** e clique em **Avançar**.
6.  Selecione **TCP** e, em **Portas locais específicas**, digite `3000, 3001`. Clique em **Avançar**.
7.  Selecione **Permitir a conexão** e clique em **Avançar**.
8.  Marque os perfis de rede aplicáveis (Geralmente **Domínio**, **Particular** e **Público**). Clique em **Avançar**.
9.  Dê um nome à regra (ex: `Sistema Escala - Portas 3000 e 3001`) e uma descrição (opcional). Clique em **Concluir**.

**Alternativamente, você pode usar o prompt de comando (como Administrador):**

\`\`\`cmd
netsh advfirewall firewall add rule name="Sistema Escala - Frontend (3000)" dir=in action=allow protocol=TCP localport=3000 enable=yes
netsh advfirewall firewall add rule name="Sistema Escala - Backend (3001)" dir=in action=allow protocol=TCP localport=3001 enable=yes
\`\`\`

## 3. Configurar Variáveis de Ambiente do Frontend

O frontend precisa saber onde encontrar o backend. Isso é feito através da variável de ambiente `NEXT_PUBLIC_API_URL`.

Crie ou edite o arquivo `.env.local` na raiz do projeto (onde está o `package.json` do frontend) e adicione as seguintes linhas, substituindo `[SEU_IP_LOCAL]` pelo IP que você obteve no Passo 1:

\`\`\`
NEXT_PUBLIC_API_URL=http://[SEU_IP_LOCAL]:3001/api
PORT=3000
\`\`\`

**Exemplo:** Se o seu IP local for `192.168.1.100`, o arquivo `.env.local` ficaria assim:

\`\`\`
NEXT_PUBLIC_API_URL=http://192.168.1.100:3001/api
PORT=3000
\`\`\`

## 4. Iniciar o Sistema

Após configurar o IP e o firewall, você pode iniciar o sistema.

*   **Para iniciar o Backend:**
    Navegue até a pasta `backend` no terminal e execute:
    \`\`\`bash
    npm start
    \`\`\`
*   **Para iniciar o Frontend:**
    Navegue até a raiz do projeto no terminal e execute:
    \`\`\`bash
    npm run dev
    \`\`\`

## 5. Acessar o Sistema de Outros Dispositivos

Com o backend e o frontend rodando e o firewall configurado, outros dispositivos na mesma rede local podem acessar o sistema.

Basta abrir um navegador em outro dispositivo e digitar o endereço:

\`\`\`
http://[SEU_IP_LOCAL]:3000
\`\`\`

Substitua `[SEU_IP_LOCAL]` pelo IP do computador onde o sistema está rodando.

---

**Observações:**

*   Se o IP do seu computador mudar (por exemplo, se você se conectar a uma rede Wi-Fi diferente), você precisará atualizar o arquivo `.env.local` e reiniciar o frontend.
*   Para ambientes de produção, considere usar um nome de domínio e configurar um proxy reverso (como Nginx) para gerenciar o acesso e a segurança.
