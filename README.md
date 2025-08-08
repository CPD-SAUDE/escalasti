# Sistema de Escala de Sobreaviso - TI

Este é um sistema para gerenciar a escala de sobreaviso de equipes de TI, permitindo a visualização e organização de profissionais em diferentes datas.

## Funcionalidades

-   **Gerenciamento de Profissionais:** Adicione, edite e remova profissionais, defina cores e horas padrão.
-   **Gerenciamento de Escala:** Atribua profissionais a datas específicas, defina horas e observações.
-   **Geração Automática de Escala:** Gere escalas automaticamente com rotação diária ou semanal entre profissionais ativos.
-   **Resumo de Horas:** Visualize o total de horas atribuídas a cada profissional no mês.
-   **Histórico de Escalas:** Salve e visualize escalas de meses anteriores.
-   **Pré-visualização de Impressão:** Visualize a escala formatada para impressão diretamente no navegador.
-   **Impressão:** Imprima a escala usando a funcionalidade nativa do navegador.
-   **Configurações:** Personalize o nome da empresa, departamento e título do sistema.

## Estrutura do Projeto

O projeto é dividido em duas partes principais:

1.  **Frontend (Next.js):** A interface do usuário, construída com Next.js (App Router), React e Tailwind CSS (com Shadcn/ui).
2.  **Backend (Node.js/Express):** A API RESTful que gerencia os dados, utilizando SQLite como banco de dados.

### Frontend (`/`)

-   `app/`: Contém as páginas da aplicação (ex: `page.tsx` para a página principal).
-   `components/`: Componentes React reutilizáveis (UI, calendário, gerenciamento, etc.).
-   `hooks/`: Hooks React personalizados para lógica de estado e chamadas de API.
-   `lib/`: Funções utilitárias e definições de tipos.
-   `public/`: Ativos estáticos (ex: `logo.png`).
-   `app/globals.css`: Estilos globais e específicos para impressão.
-   `.env.local`: Variáveis de ambiente para o frontend (ex: URL da API do backend).

### Backend (`/backend`)

-   `controllers/`: Lógica de negócio para cada recurso (profissionais, escala, histórico, configurações).
-   `database/`: Configuração e inicialização do banco de dados SQLite.
-   `routes/`: Definição das rotas da API.
-   `scripts/`: Scripts utilitários (ex: `init-database.js` para criar tabelas).
-   `server.js`: Ponto de entrada principal do servidor.
-   `package.json`: Dependências e scripts do Node.js.

## Instalação e Execução (Local)

Para rodar o sistema localmente, siga estes passos:

1.  **Pré-requisitos:**
    *   Node.js (versão 18 ou superior)
    *   npm (gerenciador de pacotes do Node.js)

2.  **Clone o repositório (se ainda não o fez):**
    \`\`\`bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd sistema-escalas-ti
    \`\`\`

3.  **Instalar e Iniciar o Sistema (Recomendado para Rede Local):**
    *   Use o script `install-system.bat` para instalar todas as dependências e o `start-system-network.bat` para iniciar o sistema com o backend acessível na rede local.

    \`\`\`bash
    # No diretório raiz do projeto
    install-system.bat
    start-system-network.bat
    \`\`\`
    Este script:
    *   Instala as dependências do backend e frontend.
    *   Inicia o backend.
    *   Detecta o IP da sua máquina na rede local.
    *   Atualiza o arquivo `.env.local` do frontend com o IP do backend.
    *   Inicia o frontend.

    Você verá duas janelas de terminal (uma para o backend, outra para o frontend) e o sistema estará acessível no seu navegador no endereço `http://<SEU_IP_DE_REDE>:3000`.

4.  **Instalação e Execução (Manual - para Desenvolvimento):**

    **a. Backend:**
    \`\`\`bash
    cd backend
    npm install
    npm run init-db # Apenas na primeira vez para criar o banco de dados
    npm start
    \`\`\`
    O backend estará rodando em `http://localhost:3001`.

    **b. Frontend:**
    Abra um novo terminal na raiz do projeto (fora da pasta `backend`).
    Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:
    \`\`\`
    NEXT_PUBLIC_API_URL=http://localhost:3001/api
    \`\`\`
    Então, instale e inicie o frontend:
    \`\`\`bash
    npm install
    npm run dev
    \`\`\`
    O frontend estará rodando em `http://localhost:3000`.

## Construção para Produção

Para construir o frontend para produção, use o script `build-frontend.bat`:

\`\`\`bash
# No diretório raiz do projeto
build-frontend.bat
\`\`\`

Este script:
1.  Verifica a instalação do Node.js.
2.  Instala as dependências do frontend.
3.  Obtém o endereço IP da sua máquina na rede local.
4.  Atualiza o arquivo `.env.local` com o IP da rede para que o frontend construído possa se comunicar com o backend na rede.
5.  Executa `npm run build` para criar a versão otimizada do frontend.

Após a construção, os arquivos estáticos estarão na pasta `.next/`. Você pode então servir esses arquivos com um servidor web de sua escolha ou usar `npm start` para iniciar o servidor de produção do Next.js.

## Configuração de Rede (para acesso de outros dispositivos)

Se você deseja que outros dispositivos na mesma rede acessem o sistema, o frontend precisa saber o endereço IP do seu computador onde o backend está rodando.

O script `start-system-network.bat` já faz isso automaticamente, atualizando o `.env.local` com o IP da sua máquina.

Se você estiver configurando manualmente ou tiver problemas:

1.  **Obtenha seu IP de Rede:**
    *   No Windows, abra o Prompt de Comando e digite `ipconfig`. Procure por "Endereço IPv4" na sua conexão de rede ativa (ex: Ethernet, Wi-Fi).
    *   No Linux/macOS, abra o Terminal e digite `ifconfig` ou `ip a`.

2.  **Atualize `.env.local`:**
    Na raiz do seu projeto frontend, edite o arquivo `.env.local` (ou crie-o se não existir) e defina `NEXT_PUBLIC_API_URL` com o IP da sua máquina:
    \`\`\`
    NEXT_PUBLIC_API_URL=http://<SEU_IP_DE_REDE>:3001/api
    \`\`\`
    Substitua `<SEU_IP_DE_REDE>` pelo IP que você encontrou.

3.  **Reinicie o Frontend:** Após alterar o `.env.local`, você precisará reiniciar o servidor de desenvolvimento do frontend (`npm run dev`) para que a mudança tenha efeito.

## Docker e Portainer

Para evitar conflitos de porta e facilitar a implantação em ambientes como Docker/Portainer, você pode:

1.  **Mudar as Portas:** Altere as portas padrão (3000 para frontend, 3001 para backend) para outras portas disponíveis no seu sistema ou contêiner. Isso é feito nos arquivos `server.js` (backend) e na configuração de inicialização do Next.js (frontend, geralmente via `package.json` ou variáveis de ambiente).
2.  **Usar Docker:** O Docker isola as aplicações em contêineres, permitindo que múltiplas aplicações usem as mesmas portas internas, mapeando-as para portas diferentes no host. Você precisaria criar arquivos `Dockerfile` para o frontend e backend e um `docker-compose.yml` para orquestrá-los.

    Exemplo de mapeamento de portas no Docker Compose:
    \`\`\`yaml
    services:
      frontend:
        ports:
          - "3000:3000" # Mapeia a porta 3000 do host para a porta 3000 do contêiner
      backend:
        ports:
          - "3001:3001" # Mapeia a porta 3001 do host para a porta 3001 do contêiner
    \`\`\`
    Se você quiser evitar conflitos com outra aplicação que já usa a porta 3000 no host, você pode mapear para outra porta:
    \`\`\`yaml
    services:
      frontend:
        ports:
          - "3002:3000" # Mapeia a porta 3002 do host para a porta 3000 do contêiner
    \`\`\`
    Assim, você acessaria o frontend via `http://localhost:3002`.

## Solução de Problemas

-   **"NÃO ESTA BAIXANDO PDF"**: O sistema agora usa a função de impressão nativa do navegador (`window.print()`) para a pré-visualização e impressão. Ele não gera um arquivo PDF diretamente. Se a caixa de diálogo de impressão não aparecer, verifique se há bloqueadores de pop-up ou erros no console do navegador (F12).
-   **"documento não esta aproveitando espaço"**: Verifique os estilos CSS em `app/globals.css` na seção `@media print` e `.print-preview-active-body-wrapper`. Ajuste `font-size`, `padding`, `margin` e `min-height` para otimizar o layout na página.
-   **Erros de Conexão com a API:** Verifique se o backend está rodando (`http://localhost:3001` ou seu IP de rede) e se o `NEXT_PUBLIC_API_URL` no `.env.local` do frontend está configurado corretamente.
-   **Problemas de CORS:** Se você vir erros de CORS no console do navegador, certifique-se de que o backend está permitindo requisições do seu frontend (o middleware `cors()` já está configurado para isso).

## Contribuição

Sinta-se à vontade para contribuir com melhorias, relatar bugs ou sugerir novas funcionalidades.
