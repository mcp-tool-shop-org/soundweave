<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.md">English</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

Studio di composizione musicale adattiva per creare, organizzare, comporre e esportare musica interattiva per videogiochi.

## Cos'è

Soundweave è una workstation orientata alla composizione, con funzionalità di adattamento. Combina la creazione musicale strutturata (clip, indicazioni, scene, livelli, automazioni) con una logica adattiva che risponde allo stato del gioco durante l'esecuzione. Il risultato: musica per videogiochi che sembra intenzionale, non generata.

## Cosa non è

Una DAW (Digital Audio Workstation). Un sequencer giocattolo. Un generatore di musica basato sull'intelligenza artificiale. Un database di creazione di mondi con audio integrato. Soundweave è uno strumento creativo avanzato per la composizione di musica adattiva per videogiochi.

## Cosa può fare

- **Comporre** — Clip con note, strumenti, scale, accordi, trasformazioni di motivi, varianti di intensità.
- **Organizzare** — Scene con livelli, ruoli delle sezioni, curve di intensità.
- **Comporre un mondo** — Famiglie di motivi, profili di composizione, famiglie di indicazioni, voci di mappe del mondo, derivazione.
- **Automatizzare** — Tracce, macro, inviluppi, acquisizione e unione in tempo reale.
- **Richiamare e riutilizzare** — Modelli, snapshot, rami, preferiti, raccolte, confronto.
- **Flusso di lavoro con campioni** — Importazione, taglio, suddivisione, creazione di kit, strumenti basati su campioni.
- **Logica adattiva** — Associazioni di trigger, transizioni, risoluzione deterministica delle scene.
- **Validare** — Validazione dello schema, controllo dell'integrità, controlli di riferimento incrociato.
- **Esportare** — Pacchetti di runtime per l'utilizzo nei motori di gioco.

## Struttura Monorepo

### Applicazioni

| Applicazione | Descrizione |
|-----|-------------|
| [`apps/studio`](apps/studio) | Interfaccia utente principale per la composizione (Next.js 15, Zustand 5). |
| [`apps/docs`](apps/docs) | Sito di documentazione (Astro). |

### Pacchetti principali

| Pacchetto | Descrizione |
|---------|-------------|
| [`@soundweave/schema`](packages/schema) | Tipi canonici, schemi Zod, analisi/validazione. |
| [`@soundweave/asset-index`](packages/asset-index) | Indicizzazione e controllo dell'integrità dei pacchetti. |
| [`@soundweave/audio-engine`](packages/audio-engine) | Riproduzione di campioni e gestione delle voci. |
| [`@soundweave/test-kit`](packages/test-kit) | Strumenti di test e utilità. |

### Composizione e riproduzione

| Pacchetto | Descrizione |
|---------|-------------|
| [`@soundweave/clip-engine`](packages/clip-engine) | Sequenziamento di clip, trasformazioni, pianificazione di indicazioni. |
| [`@soundweave/instrument-rack`](packages/instrument-rack) | Gestione delle voci di sintetizzatori e batteria con preset. |
| [`@soundweave/music-theory`](packages/music-theory) | Scale, accordi, motivi, trasformazioni di intensità. |
| [`@soundweave/playback-engine`](packages/playback-engine) | Riproduzione in tempo reale, missaggio, effetti, rendering. |
| [`@soundweave/sample-lab`](packages/sample-lab) | Strumenti per il taglio, la suddivisione, la creazione di kit e di strumenti. |
| [`@soundweave/score-map`](packages/score-map) | Motivi, profili, famiglie di indicazioni, derivazione. |
| [`@soundweave/automation`](packages/automation) | Tracce, macro, inviluppi, acquisizione. |
| [`@soundweave/library`](packages/library) | Modelli, snapshot, rami, preferiti, confronto. |

### Infrastruttura

| Pacchetto | Descrizione |
|---------|-------------|
| [`@soundweave/scene-mapper`](packages/scene-mapper) | Mappatura dei trigger e valutazione deterministica delle associazioni. |
| [`@soundweave/runtime-pack`](packages/runtime-pack) | Esportazione/importazione in runtime con serializzazione deterministica. |
| [`@soundweave/review`](packages/review) | Riepiloghi e strumenti di controllo. |
| [`@soundweave/ui`](packages/ui) | Componenti dell'interfaccia utente condivisi. |

## Guida rapida

```bash
pnpm install
pnpm build
pnpm test       # 299+ tests across all packages
pnpm dev        # Start Studio dev server
```

**Requisiti:** Node.js >= 22, pnpm >= 10

## Test

Tutti i pacchetti includono test unitari che coprono la validazione dello schema, il controllo dell'integrità, le operazioni sui campioni, la composizione di mondi, l'automazione, la gestione delle librerie e l'integrazione con lo studio.

Eseguire tutto: `pnpm test`

## Manuale

Il [manuale](handbook/) è il manuale operativo completo che copre la visione del prodotto, l'architettura, il modello dei dati, l'utilizzo dello studio, i flussi di lavoro creativi e le pratiche di ingegneria (40 capitoli).

## Sicurezza e affidabilità

Soundweave funziona **interamente nel browser**. Nessun server, nessuna sincronizzazione cloud, nessuna telemetria.

- **Dati accessibili:** File di pacchetti di colonna sonora creati dall'utente (JSON), riferimenti a risorse audio, archiviazione locale del browser.
- **Dati NON accessibili:** Nessun archivio lato server, nessun accesso al file system al di fuori della sandbox del browser.
- **Rete:** Nessun traffico di rete in uscita: tutta la composizione e la riproduzione avvengono lato client.
- **Credenziali:** Non legge, memorizza o trasmette credenziali.
- **Telemetria:** Nessuna informazione raccolta o inviata.
- **Permessi:** Solo API del browser standard (Web Audio API).

Consultare il file [SECURITY.md](SECURITY.md) per segnalare eventuali vulnerabilità.

## Licenza

MIT

---

Creato da <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
