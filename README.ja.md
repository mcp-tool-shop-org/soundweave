<p align="center">
  <a href="README.md">English</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.hi.md">हिन्दी</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
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

インタラクティブなゲーム音楽の作曲、編曲、採点、およびエクスポートを行うための、アダプティブなサウンドトラック制作環境。

## 概要

Soundweaveは、作曲を重視し、適応機能に特化したワークステーションです。構造化された音楽制作機能（クリップ、キュー、シーン、レイヤー、オートメーション）と、実行時にゲームの状態に応じて反応するアダプティブなロジックを組み合わせることで、意図的な、生成されたような音楽ではなく、ゲームに合った音楽を作り出すことができます。

## Soundweaveではないもの

DAW（デジタル・オーディオ・ワークステーション）。シンプルなシーケンサー。AI音楽生成ツール。サウンド付きの世界構築データベース。Soundweaveは、アダプティブなゲーム音楽の制作のための、本格的なクリエイティブツールです。

## できること

- **作曲:** クリップ（ノート、楽器、スケール、コード、モチーフ変換、強度バリエーション）
- **編曲:** シーン（レイヤー化されたステム、セクションの役割、強度曲線）
- **世界を音楽で彩る:** モチーフファミリー、スコアプロファイル、キューファミリー、ワールドマップのエントリ、派生
- **自動化:** レーン、マクロ、エンベロープ、ライブキャプチャとマージ
- **呼び出しと再利用:** テンプレート、スナップショット、ブランチ、お気に入り、コレクション、比較
- **サンプルワークフロー:** インポート、トリミング、スライス、キット作成、サンプル楽器
- **アダプティブロジック:** トリガーバインディング、トランジション、決定論的なシーン解決
- **検証:** スキーマ検証、整合性監査、相互参照チェック
- **エクスポート:** ゲームエンジンで使用するためのランタイムパック

## モノレポ構造

### アプリケーション

| アプリケーション | 説明 |
|-----|-------------|
| [`apps/studio`](apps/studio) | メインの作曲UI（Next.js 15、Zustand 5） |
| [`apps/docs`](apps/docs) | ドキュメントサイト（Astro） |

### コアパッケージ

| パッケージ | 説明 |
|---------|-------------|
| [`@soundweave/schema`](packages/schema) | 標準型、Zodスキーマ、解析/検証 |
| [`@soundweave/asset-index`](packages/asset-index) | パックの整合性インデックス作成と監査 |
| [`@soundweave/audio-engine`](packages/audio-engine) | サンプル再生とボイス管理 |
| [`@soundweave/test-kit`](packages/test-kit) | テスト用データとユーティリティ |

### 作曲と再生

| パッケージ | 説明 |
|---------|-------------|
| [`@soundweave/clip-engine`](packages/clip-engine) | クリップシーケンス、変換、キューのスケジュール |
| [`@soundweave/instrument-rack`](packages/instrument-rack) | シンセサイザーとドラムのボイス管理（プリセット付き） |
| [`@soundweave/music-theory`](packages/music-theory) | スケール、コード、モチーフ、強度変換 |
| [`@soundweave/playback-engine`](packages/playback-engine) | リアルタイム再生、ミキシング、エフェクト、レンダリング |
| [`@soundweave/sample-lab`](packages/sample-lab) | トリミング、スライス、キット、楽器の補助機能 |
| [`@soundweave/score-map`](packages/score-map) | モチーフ、プロファイル、キューファミリー、派生 |
| [`@soundweave/automation`](packages/automation) | レーン、マクロ、エンベロープ、キャプチャ |
| [`@soundweave/library`](packages/library) | テンプレート、スナップショット、ブランチ、お気に入り、比較 |

### インフラストラクチャ

| パッケージ | 説明 |
|---------|-------------|
| [`@soundweave/scene-mapper`](packages/scene-mapper) | トリガーマッピングと決定論的なバインディング評価 |
| [`@soundweave/runtime-pack`](packages/runtime-pack) | 決定論的なシリアル化によるランタイムエクスポート/インポート |
| [`@soundweave/review`](packages/review) | サマリーと監査ヘルパー |
| [`@soundweave/ui`](packages/ui) | 共有UIコンポーネント |

## クイックスタート

```bash
pnpm install
pnpm build
pnpm test       # 299+ tests across all packages
pnpm dev        # Start Studio dev server
```

**要件:** Node.js >= 22, pnpm >= 10

## テスト

すべてのパッケージには、スキーマ検証、整合性監査、サンプル操作、ワールドスコアリング、自動化、ライブラリ管理、およびスタジオ統合をカバーするユニットテストが含まれています。

すべてを実行: `pnpm test`

## ハンドブック

[ハンドブック](handbook/)は、製品のビジョン、アーキテクチャ、データモデル、スタジオの使用方法、クリエイティブワークフロー、およびエンジニアリングプラクティスを網羅した包括的な取扱説明書です（40章）。

## セキュリティと信頼性

Soundweaveは、**完全にブラウザ上で動作します**。サーバー、クラウド同期、テレメトリはありません。

- **アクセスされるデータ:** ユーザーが作成したサウンドトラックパックファイル（JSON）、オーディオアセット参照、ブラウザのローカルストレージ
- **アクセスされないデータ:** サーバー側のストレージ、ブラウザのサンドボックス以外のファイルシステムへのアクセス
- **ネットワーク:** ネットワークからの送信は一切なし。すべての作曲と再生はクライアント側で行われます。
- **認証情報:** 認証情報を読み込んだり、保存したり、送信したりすることはありません。
- **テレメトリ:** 収集または送信されるものはありません。
- **権限:** 標準的なブラウザAPIのみを使用します（Web Audio API）。

脆弱性に関する報告は、[SECURITY.md](SECURITY.md) を参照してください。

## ライセンス

MIT

---

作成者: <a href="https://mcp-tool-shop.github.io/">MCP Tool Shop</a>
