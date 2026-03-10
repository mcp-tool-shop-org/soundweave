<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.md">English</a>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/mcp-tool-shop-org/brand/main/logos/soundweave/readme.png" width="400" alt="SoundWeave">
</p>

<p align="center">
  <a href="https://github.com/mcp-tool-shop-org/soundweave/actions/workflows/ci.yml"><img src="https://github.com/mcp-tool-shop-org/soundweave/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://codecov.io/gh/mcp-tool-shop-org/soundweave"><img src="https://codecov.io/gh/mcp-tool-shop-org/soundweave/branch/main/graph/badge.svg" alt="Coverage"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
  <a href="https://mcp-tool-shop-org.github.io/soundweave/"><img src="https://img.shields.io/badge/Landing_Page-live-blue" alt="Landing Page"></a>
</p>

Estúdio de trilha sonora adaptável para composição, arranjo, criação de trilhas sonoras e exportação de músicas interativas para jogos.

## O que é

Soundweave é uma estação de trabalho focada na composição, com recursos de adaptação. Combina a criação estruturada de música — trechos, pistas, cenas, camadas, automação — com lógica adaptativa que responde ao estado do jogo em tempo real. O resultado: músicas para jogos que parecem intencionais, e não geradas aleatoriamente.

## O que não é

Uma DAW (Digital Audio Workstation). Um sequenciador simples. Um gerador de música baseado em inteligência artificial. Um banco de dados para criação de mundos com sons. Soundweave é uma ferramenta criativa para a criação de trilhas sonoras adaptativas para jogos.

## O que ele pode fazer

- **Compor** — Trechos com notas, instrumentos, escalas, acordes, transformações de motivos, variações de intensidade.
- **Arranjar** — Cenas com camadas, funções de seções, curvas de intensidade.
- **Criar a trilha sonora de um mundo** — Famílias de motivos, perfis de trilha sonora, famílias de pistas, entradas no mapa do mundo, derivação.
- **Automatizar** — Canais, macros, envelopes, captura e mesclagem em tempo real.
- **Reutilizar e salvar** — Modelos, instantâneos, ramificações, favoritos, coleções, comparação.
- **Fluxo de trabalho com amostras** — Importar, cortar, dividir, criador de kits, instrumentos de amostra.
- **Lógica adaptativa** — Associações de gatilhos, transições, resolução de cenas determinística.
- **Validar** — Validação de esquema, auditoria de integridade, verificações de referência cruzada.
- **Exportar** — Pacotes de tempo de execução para uso em engines de jogos.

## Estrutura do Monorepository

### Aplicativos

| Aplicativo | Descrição |
|-----|-------------|
| [`apps/studio`](apps/studio) | Interface de usuário principal de criação (Next.js 15, Zustand 5). |
| [`apps/docs`](apps/docs) | Site de documentação (Astro). |

### Pacotes Principais

| Pacote | Descrição |
|---------|-------------|
| [`@soundweave/schema`](packages/schema) | Tipos canônicos, esquemas Zod, análise/validação. |
| [`@soundweave/asset-index`](packages/asset-index) | Indexação e auditoria da integridade dos pacotes. |
| [`@soundweave/audio-engine`](packages/audio-engine) | Reprodução de amostras e gerenciamento de vozes. |
| [`@soundweave/test-kit`](packages/test-kit) | Fixutros e utilitários de teste. |

### Composição e Reprodução

| Pacote | Descrição |
|---------|-------------|
| [`@soundweave/clip-engine`](packages/clip-engine) | Sequenciamento de trechos, transformações, agendamento de pistas. |
| [`@soundweave/instrument-rack`](packages/instrument-rack) | Gerenciamento de vozes de sintetizador e bateria com predefinições. |
| [`@soundweave/music-theory`](packages/music-theory) | Escalas, acordes, motivos, transformações de intensidade. |
| [`@soundweave/playback-engine`](packages/playback-engine) | Reprodução em tempo real, mixagem, efeitos, renderização. |
| [`@soundweave/sample-lab`](packages/sample-lab) | Ferramentas para cortar, dividir, criar kits e instrumentos. |
| [`@soundweave/score-map`](packages/score-map) | Motivos, perfis, famílias de pistas, derivação. |
| [`@soundweave/automation`](packages/automation) | Canais, macros, envelopes, captura. |
| [`@soundweave/library`](packages/library) | Modelos, instantâneos, ramificações, favoritos, comparação. |

### Infraestrutura

| Pacote | Descrição |
|---------|-------------|
| [`@soundweave/scene-mapper`](packages/scene-mapper) | Mapeamento de gatilhos e avaliação determinística de associações. |
| [`@soundweave/runtime-pack`](packages/runtime-pack) | Exportação/importação em tempo de execução com serialização determinística. |
| [`@soundweave/review`](packages/review) | Resumos e utilitários de auditoria. |
| [`@soundweave/ui`](packages/ui) | Componentes de interface de usuário compartilhados. |

## Como começar

```bash
pnpm install
pnpm build
pnpm test       # 299+ tests across all packages
pnpm dev        # Start Studio dev server
```

**Requisitos:** Node.js >= 22, pnpm >= 10

## Testes

Todos os pacotes possuem testes unitários que cobrem a validação de esquema, auditoria de integridade, operações com amostras, criação de trilhas sonoras, automação, gerenciamento de bibliotecas e integração com o estúdio.

Para executar todos os testes: `pnpm test`

## Manual

O [manual](handbook/) é o manual de operação abrangente que cobre a visão geral do produto, a arquitetura, o modelo de dados, o uso do estúdio, os fluxos de trabalho criativos e as práticas de engenharia (40 capítulos).

## Segurança e Confiança

Soundweave funciona **totalmente no navegador**. Não há servidor, não há sincronização na nuvem, não há coleta de dados.

- **Dados acessados:** Arquivos de pacotes de trilha sonora criados pelo usuário (JSON), referências de ativos de áudio, armazenamento local do navegador.
- **Dados NÃO acessados:** Não há armazenamento no lado do servidor, não há acesso ao sistema de arquivos além do sandbox do navegador.
- **Rede:** Sem tráfego de rede — toda a criação e reprodução ocorrem no lado do cliente.
- **Credenciais:** Não lê, armazena ou transmite credenciais.
- **Coleta de dados:** Nenhum dado é coletado ou enviado.
- **Permissões:** Apenas APIs padrão do navegador (Web Audio API).

Consulte o arquivo [SECURITY.md](SECURITY.md) para relatar vulnerabilidades.

## Licença

MIT

---

Desenvolvido por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
