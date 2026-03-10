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

自适应音轨工作室，用于创作、编排、配乐和导出互动游戏音乐。

## 产品介绍

Soundweave 是一款以创作为先导，并具有自适应功能的专业工作站。它将结构化的音乐创作功能（包括音符、提示音、场景、音轨和自动化）与能够响应游戏运行时状态的自适应逻辑相结合。结果是：游戏音乐听起来是经过精心设计的，而不是随机生成的。

## 它不是什么

它不是一个数字音频工作站（DAW）。它不是一个简单的序列器。它不是一个人工智能音乐生成器。它也不是一个带有声音的世界构建数据库。Soundweave 是一个用于自适应游戏配乐创作的专业创意工具。

## 它可以做什么

- **创作 (Compose)**：包含音符、乐器、音阶、和弦、动机变换、强度变体的音符片段。
- **编排 (Arrange)**：包含分层音轨、段落角色、强度曲线的场景。
- **配乐世界 (Score a world)**：包含动机家族、配乐配置文件、提示音家族、世界地图条目、衍生功能。
- **自动化 (Automate)**：包含音轨、宏、包络线、实时捕捉和合并功能。
- **调用和重用 (Recall and reuse)**：包含模板、快照、分支、收藏夹、比较功能。
- **采样工作流程 (Sample workflow)**：包含导入、裁剪、分割、采样器构建器、采样乐器功能。
- **自适应逻辑 (Adaptive logic)**：包含触发器绑定、过渡、确定性场景解析功能。
- **验证 (Validate)**：包含模式验证、完整性审计、交叉引用检查功能。
- **导出 (Export)**：包含用于游戏引擎的运行时包。

## 单仓库结构

### 应用程序

| 应用程序 | 描述 |
|-----|-------------|
| [`apps/studio`](apps/studio) | 主要创作用户界面（Next.js 15，Zustand 5） |
| [`apps/docs`](apps/docs) | 文档网站（Astro） |

### 核心组件

| 组件 | 描述 |
|---------|-------------|
| [`@soundweave/schema`](packages/schema) | 标准类型、Zod 模式、解析/验证功能。 |
| [`@soundweave/asset-index`](packages/asset-index) | 打包完整性索引和审计功能。 |
| [`@soundweave/audio-engine`](packages/audio-engine) | 采样播放和声音管理功能。 |
| [`@soundweave/test-kit`](packages/test-kit) | 测试工具和辅助功能。 |

### 创作与播放

| 组件 | 描述 |
|---------|-------------|
| [`@soundweave/clip-engine`](packages/clip-engine) | 音符序列、变换、提示音调度功能。 |
| [`@soundweave/instrument-rack`](packages/instrument-rack) | 合成器和鼓声声音管理，包含预设。 |
| [`@soundweave/music-theory`](packages/music-theory) | 音阶、和弦、动机、强度变换功能。 |
| [`@soundweave/playback-engine`](packages/playback-engine) | 实时播放、混音、效果、渲染功能。 |
| [`@soundweave/sample-lab`](packages/sample-lab) | 裁剪、分割、采样器、乐器辅助功能。 |
| [`@soundweave/score-map`](packages/score-map) | 动机、配置文件、提示音家族、衍生功能。 |
| [`@soundweave/automation`](packages/automation) | 音轨、宏、包络线、捕捉功能。 |
| [`@soundweave/library`](packages/library) | 模板、快照、分支、收藏夹、比较功能。 |

### 基础设施

| 组件 | 描述 |
|---------|-------------|
| [`@soundweave/scene-mapper`](packages/scene-mapper) | 触发器映射和确定性绑定评估功能。 |
| [`@soundweave/runtime-pack`](packages/runtime-pack) | 具有确定性序列化的运行时导出/导入功能。 |
| [`@soundweave/review`](packages/review) | 摘要和审计辅助功能。 |
| [`@soundweave/ui`](packages/ui) | 共享用户界面组件。 |

## 快速开始

```bash
pnpm install
pnpm build
pnpm test       # 299+ tests across all packages
pnpm dev        # Start Studio dev server
```

**要求：** Node.js >= 22，pnpm >= 10

## 测试

所有组件都包含单元测试，涵盖模式验证、完整性审计、采样操作、世界配乐、自动化、库管理和工作室集成。

运行所有测试：`pnpm test`

## 手册

[手册](handbook/) 是一个全面的操作手册，涵盖产品愿景、架构、数据模型、工作室使用方法、创意工作流程和工程实践（共 40 章）。

## 安全与信任

Soundweave 完全在浏览器中运行。没有服务器，没有云同步，没有遥测。

- **数据访问：** 用户创建的音轨包文件（JSON）、音频资源引用、浏览器本地存储。
- **未访问的数据：** 没有服务器端存储，超出浏览器沙箱的文件系统访问权限。
- **网络：** 没有网络出站流量——所有创作和播放都在客户端进行。
- **密钥：** 不读取、存储或传输凭据。
- **遥测：** 不收集或发送任何数据。
- **权限：** 仅使用标准的浏览器 API（Web Audio API）。

有关漏洞报告，请参阅 [SECURITY.md](SECURITY.md) 文件。

## 许可证

MIT

---

由 <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a> 构建。
