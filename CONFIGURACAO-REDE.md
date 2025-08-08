# Configuração de Rede para o Sistema de Escala de Sobreavaviso

Este documento descreve as etapas para configurar a rede e garantir que o frontend e o backend do sistema de escala de sobreaviso possam se comunicar corretamente, especialmente em ambientes onde o IP do backend pode mudar ou precisa ser acessível de outras máquinas.

## 1. Entendendo a Comunicação entre Frontend e Backend

- **Frontend (Next.js)**: A aplicação web que o usuário interage. Ela precisa saber o endereço (IP e porta) do backend para fazer requisições API.
- **Backend (Node.js/Express)**: O servidor que fornece os dados e a lógica de negócio. Ele escuta em uma porta específica (padrão: 3001).

## 2. Configuração do IP do Backend

O frontend usa uma variável de ambiente `NEXT_PUBLIC_API_URL` para definir onde o backend está localizado.

### Em Desenvolvimento Local (sem Docker Compose)

Se você estiver executando o frontend e o backend diretamente na sua máquina (sem Docker Compose), o `NEXT_PUBLIC_API_URL` no frontend deve apontar para o IP da sua máquina onde o backend está rodando.

1.  **Obter o IP da sua máquina:**
    *   **Windows:** Abra o Prompt de Comando (CMD) ou PowerShell e digite `ipconfig`. Procure por "Endereço IPv4" na sua conexão de rede ativa (ex: Ethernet, Wi-Fi).
    *   **Linux/macOS:** Abra o Terminal e digite `ifconfig` ou `ip a`. Procure pelo endereço IP associado à sua interface de rede (ex: `eth0`, `wlan0`, `en0`).

2.  **Configurar `NEXT_PUBLIC_API_URL` no frontend:**
    *   No arquivo `.env.local` (ou diretamente no código, se não for usar `.env`) do frontend, defina:
