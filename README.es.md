<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.md">English</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

Estudio de composición de música adaptable para crear, organizar, componer y exportar música interactiva para videojuegos.

## ¿Qué es?

Soundweave es una estación de trabajo centrada en la composición, con capacidad de adaptación. Combina la creación musical estructurada (clips, indicaciones, escenas, capas, automatización) con una lógica adaptativa que responde al estado del juego en tiempo real. El resultado: música para videojuegos que parece intencional, no generada.

## ¿Qué no es?

Un DAW (Digital Audio Workstation). Un secuenciador básico. Un generador de música con inteligencia artificial. Una base de datos para la creación de mundos con sonido adjunto. Soundweave es una herramienta creativa seria para la composición de música adaptable para videojuegos.

## ¿Qué puede hacer?

- **Componer:** Clips con notas, instrumentos, escalas, acordes, transformaciones de motivos, variaciones de intensidad.
- **Organizar:** Escenas con capas, roles de sección, curvas de intensidad.
- **Crear un mundo:** Familias de motivos, perfiles de composición, familias de indicaciones, entradas de mapa del mundo, derivación.
- **Automatizar:** Pistas, macros, envolventes, captura y combinación en tiempo real.
- **Recordar y reutilizar:** Plantillas, instantáneas, ramas, favoritos, colecciones, comparación.
- **Flujo de trabajo con muestras:** Importación, recorte, segmentación, creación de kits, instrumentos de muestra.
- **Lógica adaptativa:** Enlaces de activación, transiciones, resolución de escenas determinista.
- **Validar:** Validación de esquemas, auditoría de integridad, comprobaciones de referencias cruzadas.
- **Exportar:** Paquetes de tiempo de ejecución para su uso en motores de juego.

## Estructura de Monorrepositorio

### Aplicaciones

| Aplicación | Descripción |
|-----|-------------|
| [`apps/studio`](apps/studio) | Interfaz de usuario principal de composición (Next.js 15, Zustand 5). |
| [`apps/docs`](apps/docs) | Sitio de documentación (Astro). |

### Paquetes principales

| Paquete | Descripción |
|---------|-------------|
| [`@soundweave/schema`](packages/schema) | Tipos canónicos, esquemas Zod, análisis/validación. |
| [`@soundweave/asset-index`](packages/asset-index) | Indexación y auditoría de la integridad de los paquetes. |
| [`@soundweave/audio-engine`](packages/audio-engine) | Reproducción de muestras y gestión de voces. |
| [`@soundweave/test-kit`](packages/test-kit) | Herramientas de prueba y configuración. |

### Composición y reproducción

| Paquete | Descripción |
|---------|-------------|
| [`@soundweave/clip-engine`](packages/clip-engine) | Secuenciación de clips, transformaciones, programación de indicaciones. |
| [`@soundweave/instrument-rack`](packages/instrument-rack) | Gestión de voces de sintetizador y batería con preajustes. |
| [`@soundweave/music-theory`](packages/music-theory) | Escalas, acordes, motivos, transformaciones de intensidad. |
| [`@soundweave/playback-engine`](packages/playback-engine) | Reproducción en tiempo real, mezcla, efectos, renderizado. |
| [`@soundweave/sample-lab`](packages/sample-lab) | Herramientas para recortar, segmentar, crear kits e instrumentos. |
| [`@soundweave/score-map`](packages/score-map) | Motivos, perfiles, familias de indicaciones, derivación. |
| [`@soundweave/automation`](packages/automation) | Pistas, macros, envolventes, captura. |
| [`@soundweave/library`](packages/library) | Plantillas, instantáneas, ramas, favoritos, comparación. |

### Infraestructura

| Paquete | Descripción |
|---------|-------------|
| [`@soundweave/scene-mapper`](packages/scene-mapper) | Mapeo de activadores y evaluación determinista de enlaces. |
| [`@soundweave/runtime-pack`](packages/runtime-pack) | Exportación/importación en tiempo de ejecución con serialización determinista. |
| [`@soundweave/review`](packages/review) | Resúmenes y herramientas de auditoría. |
| [`@soundweave/ui`](packages/ui) | Componentes de interfaz de usuario compartidos. |

## Cómo empezar

```bash
pnpm install
pnpm build
pnpm test       # 299+ tests across all packages
pnpm dev        # Start Studio dev server
```

**Requisitos:** Node.js >= 22, pnpm >= 10

## Pruebas

Todos los paquetes tienen pruebas unitarias que cubren la validación de esquemas, la auditoría de integridad, las operaciones con muestras, la composición de mundos, la automatización, la gestión de bibliotecas y la integración con el estudio.

Para ejecutar todo: `pnpm test`

## Manual

El [manual](handbook/) es el manual de operación completo que cubre la visión general del producto, la arquitectura, el modelo de datos, el uso del estudio, los flujos de trabajo creativos y las prácticas de ingeniería (40 capítulos).

## Seguridad y Confianza

Soundweave se ejecuta **completamente en el navegador**. No hay servidor, no hay sincronización en la nube, no hay telemetría.

- **Datos accedidos:** Archivos de paquete de banda sonora creados por el usuario (JSON), referencias de activos de audio, almacenamiento local del navegador.
- **Datos NO accedidos:** No hay almacenamiento en el servidor, no hay acceso al sistema de archivos más allá de la caja de arena del navegador.
- **Red:** Cero tráfico de red saliente: toda la composición y reproducción se realizan en el lado del cliente.
- **Contraseñas:** No lee, almacena ni transmite credenciales.
- **Telemetría:** No se recopila ni se envía nada.
- **Permisos:** Solo se utilizan las API estándar del navegador (Web Audio API).

Consulte el archivo [SECURITY.md](SECURITY.md) para informar sobre vulnerabilidades.

## Licencia

MIT

---

Desarrollado por <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>.
