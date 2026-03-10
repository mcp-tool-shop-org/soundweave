<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

Studio de création de bandes sonores adaptatives pour composer, arranger, orchestrer et exporter de la musique interactive pour les jeux vidéo.

## Qu'est-ce que c'est ?

Soundweave est une station de travail axée sur la composition, conçue pour l'adaptation. Elle combine la création musicale structurée – clips, indications, scènes, couches, automatisation – avec une logique adaptative qui réagit à l'état du jeu en temps réel. Le résultat : une musique de jeu qui semble intentionnelle, et non générée aléatoirement.

## Ce que ce n'est pas

Un DAW (Digital Audio Workstation). Un séquenceur basique. Un générateur de musique par intelligence artificielle. Une base de données de création de monde avec des sons associés. Soundweave est un outil de création sérieux pour l'orchestration adaptative de jeux vidéo.

## Ce que cela peut faire

- **Composer** : Clips avec notes, instruments, gammes, accords, transformations de motifs, variations d'intensité.
- **Arranger** : Scènes avec couches, rôles de sections, courbes d'intensité.
- **Créer un univers** : Familles de motifs, profils d'orchestration, familles d'indications, entrées de carte du monde, dérivation.
- **Automatiser** : Pistes, macros, enveloppes, capture et fusion en direct.
- **Récupérer et réutiliser** : Modèles, instantanés, branches, favoris, collections, comparaison.
- **Flux de travail d'échantillons** : Importation, découpe, tranche, création de kits, instruments d'échantillons.
- **Logique adaptative** : Liaisons de déclencheurs, transitions, résolution de scène déterministe.
- **Valider** : Validation de schéma, audit d'intégrité, vérifications de références croisées.
- **Exporter** : Packs d'exécution pour les moteurs de jeu.

## Structure du dépôt (monorepo)

### Applications

| Application. | Description. |
|-----|-------------|
| [`apps/studio`](apps/studio) | Interface utilisateur principale de création (Next.js 15, Zustand 5). |
| [`apps/docs`](apps/docs) | Site de documentation (Astro). |

### Paquets principaux

| Paquet. | Description. |
|---------|-------------|
| [`@soundweave/schema`](packages/schema) | Types canoniques, schémas Zod, analyse/validation. |
| [`@soundweave/asset-index`](packages/asset-index) | Indexation et audit de l'intégrité des packs. |
| [`@soundweave/audio-engine`](packages/audio-engine) | Lecture d'échantillons et gestion des voix. |
| [`@soundweave/test-kit`](packages/test-kit) | Fixtures et utilitaires de test. |

### Composition et lecture

| Paquet. | Description. |
|---------|-------------|
| [`@soundweave/clip-engine`](packages/clip-engine) | Séquençage de clips, transformations, planification d'indications. |
| [`@soundweave/instrument-rack`](packages/instrument-rack) | Gestion des voix de synthétiseur et de batterie avec préréglages. |
| [`@soundweave/music-theory`](packages/music-theory) | Gammes, accords, motifs, transformations d'intensité. |
| [`@soundweave/playback-engine`](packages/playback-engine) | Lecture en temps réel, mixage, effets, rendu. |
| [`@soundweave/sample-lab`](packages/sample-lab) | Découpe, tranche, kit, assistants d'instruments. |
| [`@soundweave/score-map`](packages/score-map) | Motifs, profils, familles d'indications, dérivation. |
| [`@soundweave/automation`](packages/automation) | Pistes, macros, enveloppes, capture. |
| [`@soundweave/library`](packages/library) | Modèles, instantanés, branches, favoris, comparaison. |

### Infrastructure

| Paquet. | Description. |
|---------|-------------|
| [`@soundweave/scene-mapper`](packages/scene-mapper) | Mappage des déclencheurs et évaluation déterministe des liaisons. |
| [`@soundweave/runtime-pack`](packages/runtime-pack) | Exportation/importation en temps réel avec sérialisation déterministe. |
| [`@soundweave/review`](packages/review) | Résumés et assistants d'audit. |
| [`@soundweave/ui`](packages/ui) | Composants d'interface utilisateur partagés. |

## Démarrage rapide

```bash
pnpm install
pnpm build
pnpm test       # 299+ tests across all packages
pnpm dev        # Start Studio dev server
```

**Prérequis :** Node.js >= 22, pnpm >= 10.

## Tests

Tous les paquets ont des tests unitaires couvrant la validation de schéma, l'audit d'intégrité, les opérations d'échantillons, l'orchestration du monde, l'automatisation, la gestion de bibliothèque et l'intégration du studio.

Exécuter tout : `pnpm test`.

## Manuel

Le [manuel](handbook/) est le manuel d'utilisation complet qui couvre la vision du produit, l'architecture, le modèle de données, l'utilisation du studio, les flux de travail créatifs et les pratiques d'ingénierie (40 chapitres).

## Sécurité et confiance

Soundweave fonctionne **entièrement dans le navigateur**. Pas de serveur, pas de synchronisation cloud, pas de télémétrie.

- **Données concernées :** Fichiers de packs de bandes sonores créés par l'utilisateur (JSON), références d'actifs audio, stockage local du navigateur.
- **Données NON concernées :** Pas de stockage côté serveur, pas d'accès au système de fichiers en dehors du bac à sable du navigateur.
- **Réseau :** Zéro émission de données sur le réseau – toute la création et la lecture se font côté client.
- **Secrets :** Ne lit, ne stocke ni ne transmet d'informations d'identification.
- **Télémétrie :** Aucune donnée n'est collectée ou envoyée.
- **Permissions :** Utilisation uniquement des API standard du navigateur (Web Audio API).

Consultez le fichier [SECURITY.md](SECURITY.md) pour signaler les vulnérabilités.

## Licence

MIT

---

Créé par <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>.
