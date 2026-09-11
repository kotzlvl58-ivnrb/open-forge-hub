/**
 * Demo catalog for the OpenForge Hub front-end.
 *
 * In production this data would come from the hub API. Every artifact carries
 * torrent metadata: an info-hash (v1), trackers, and — critically — web seeds
 * (BEP 19) pointing at ordinary HTTP mirrors. That is what makes each magnet
 * work even when the swarm is small: any BitTorrent client can fall back to
 * the web seed, while browsers use WebTorrent peers + the same seeds.
 *
 * The info-hashes below are syntactically valid 40-hex placeholders used for
 * the demo; they are NOT real torrents.
 */

export type ArtifactKind = 'model' | 'dataset'

export type License =
  | 'MIT'
  | 'Apache-2.0'
  | 'Llama-3.2'
  | 'Gemma'
  | 'CC-BY-4.0'
  | 'CC-BY-SA-4.0'
  | 'OpenRAIL-M'

export interface TorrentMeta {
  /** BitTorrent v1 info-hash (40 hex chars). Demo placeholders. */
  infoHash: string
  /** Web seed (BEP 19) base URL — plain HTTP fallback so magnets never die. */
  webSeed: string
  /** Tracker announce URLs embedded in the magnet. */
  trackers: string[]
  /** Size of the torrent payload in bytes. */
  sizeBytes: number
  /** Number of pieces — used to show file/piece granularity in the UI. */
  pieces: number
}

export interface Artifact {
  id: string
  kind: ArtifactKind
  name: string
  author: string
  summary: string
  /** Long description shown on the detail page. */
  description: string[]
  tags: string[]
  license: License
  updated: string // ISO date
  downloads: number
  seeders: number
  leechers: number
  /** e.g. "7B · Q4_K_M GGUF", "64k context", "image" */
  spec: string[]
  torrent: TorrentMeta
  files: { path: string; sizeBytes: number }[]
}

const TRACKERS = [
  'udp://tracker.opentrackr.org:1337/announce',
  'udp://open.demonii.com:1337/announce',
  'udp://tracker.openbittorrent.com:6969/announce',
  'wss://tracker.openwebtorrent.com',
]

function ws(path: string) {
  return `https://mirror.example-openforge.org/r/${path}/`
}

export const ARTIFACTS: Artifact[] = [
  {
    id: 'forge-mini-3b-instruct',
    kind: 'model',
    name: 'forge-mini-3b-instruct',
    author: '@openforge-core',
    summary:
      'Compact instruction-tuned LLM that runs comfortably on 8 GB of RAM. Built for local assistants and offline tooling.',
    description: [
      'forge-mini is a 3-billion-parameter decoder trained on a curated multilingual instruction corpus, then distilled from a larger teacher with an emphasis on factual short-form answers.',
      'The GGUF build ships pre-quantized in Q4_K_M and Q8_0 so llama.cpp, Ollama and LM Studio can load it directly. Context window: 32k tokens.',
      'Weights are released under MIT. The torrent includes a SHA256SUMS manifest so you can verify every shard after download.',
    ],
    tags: ['llm', 'instruct', 'gguf', 'llama.cpp', 'cpu-friendly'],
    license: 'MIT',
    updated: '2026-08-28',
    downloads: 184_203,
    seeders: 47,
    leechers: 12,
    spec: ['3B params', 'Q4_K_M / Q8_0', '32k context'],
    torrent: {
      infoHash: '3f1a9c44e2b7d86051a4c9f0b3d2e7a8c516940b',
      webSeed: ws('forge-mini-3b-instruct'),
      trackers: TRACKERS,
      sizeBytes: 2_147_483_648,
      pieces: 4096,
    },
    files: [
      { path: 'forge-mini-3b-q4_k_m.gguf', sizeBytes: 1_932_735_182 },
      { path: 'forge-mini-3b-q8_0.gguf', sizeBytes: 3_221_225_472 },
      { path: 'SHA256SUMS', sizeBytes: 132 },
      { path: 'README.md', sizeBytes: 8_412 },
    ],
  },
  {
    id: 'whisper-forge-small',
    kind: 'model',
    name: 'whisper-forge-small',
    author: '@forge-audio',
    summary:
      'Multilingual speech-to-text distilled to 240 M parameters. Real-time transcription on a laptop CPU.',
    description: [
      'A distilled variant of the classic open speech-recognition architecture, retrained on 680k hours of permissively licensed audio across 57 languages.',
      'Ships as ONNX and as a tiny 4-bit GGML build. The ONNX export includes a streaming decoder demo that runs fully offline.',
      'Audio test fixtures (45 MB) are bundled in the torrent so you can verify accuracy immediately after download.',
    ],
    tags: ['speech', 'asr', 'onnx', 'multilingual'],
    license: 'Apache-2.0',
    updated: '2026-08-11',
    downloads: 97_481,
    seeders: 31,
    leechers: 8,
    spec: ['240M params', 'ONNX + GGML', '57 languages'],
    torrent: {
      infoHash: '9d84e0c1a2f3b4c5d6e7f8091a2b3c4d5e6f7081',
      webSeed: ws('whisper-forge-small'),
      trackers: TRACKERS,
      sizeBytes: 483_183_821,
      pieces: 1024,
    },
    files: [
      { path: 'whisper-forge-small.onnx', sizeBytes: 241_591_910 },
      { path: 'whisper-forge-small-q4.ggml', sizeBytes: 121_000_000 },
      { path: 'test-fixtures.tar.zst', sizeBytes: 47_185_920 },
      { path: 'README.md', sizeBytes: 6_120 },
    ],
  },
  {
    id: 'vision-forge-base',
    kind: 'model',
    name: 'vision-forge-base',
    author: '@forge-vision',
    summary:
      'Image encoder + detection heads for classification, OCR-lite and object detection at the edge.',
    description: [
      'vision-forge-base is a 28 M-parameter vision transformer distilled for embedded deployment — 12 ms per frame on a Raspberry Pi 5.',
      'Includes three exported heads: classification (1k classes), object detection (80 classes) and an OCR-lite text detector.',
      'The torrent carries the safetensors weights, the three head exports, and an evaluation notebook with expected outputs.',
    ],
    tags: ['vision', 'edge', 'safetensors', 'detection'],
    license: 'Apache-2.0',
    updated: '2026-07-30',
    downloads: 41_022,
    seeders: 18,
    leechers: 4,
    spec: ['28M params', 'ViT-ish encoder', '12 ms/frame on Pi 5'],
    torrent: {
      infoHash: 'c7b8a9d0e1f234567890abcdef01234567890abc',
      webSeed: ws('vision-forge-base'),
      trackers: TRACKERS,
      sizeBytes: 116_391_936,
      pieces: 512,
    },
    files: [
      { path: 'encoder.safetensors', sizeBytes: 105_000_000 },
      { path: 'head-classification.onnx', sizeBytes: 4_200_000 },
      { path: 'head-detection.onnx', sizeBytes: 6_800_000 },
      { path: 'eval.ipynb', sizeBytes: 391_936 },
    ],
  },
  {
    id: 'emb-forge-multilingual',
    kind: 'model',
    name: 'emb-forge-multilingual',
    author: '@openforge-core',
    summary:
      '512-dimension sentence embeddings across 40 languages. The workhorse for local RAG pipelines.',
    description: [
      'A bilingual-friendly embedding model trained with a contrastive objective on 1.2 billion mined pairs. 512 output dimensions, max sequence 512 tokens.',
      'Validated on MTEB-lite with competitive retrieval scores at a fraction of the size of larger embedders.',
      'Packaged as ONNX with tokenizer.json — drop it straight into fastembed, Ollama, or your own runtime.',
    ],
    tags: ['embeddings', 'rag', 'onnx', 'multilingual'],
    license: 'MIT',
    updated: '2026-08-21',
    downloads: 76_530,
    seeders: 26,
    leechers: 6,
    spec: ['120M params', '512-dim', '40 languages'],
    torrent: {
      infoHash: 'aa11bb22cc33dd44ee55ff6677889900aabbccdd',
      webSeed: ws('emb-forge-multilingual'),
      trackers: TRACKERS,
      sizeBytes: 241_172_480,
      pieces: 512,
    },
    files: [
      { path: 'model.onnx', sizeBytes: 228_000_000 },
      { path: 'tokenizer.json', sizeBytes: 7_172_480 },
      { path: 'config.json', sizeBytes: 642 },
      { path: 'README.md', sizeBytes: 5_358 },
    ],
  },
  {
    id: 'code-forge-7b',
    kind: 'model',
    name: 'code-forge-7b',
    author: '@forge-labs',
    summary:
      'Fill-in-the-middle code model for 20+ languages, quantized to run inside editor plugins.',
    description: [
      'Trained on permissively licensed code with a 30% fill-in-the-middle objective, which is what makes single-line completions feel instant.',
      'The torrent ships GGUF Q5_K_M, an AWQ 4-bit GEMM build for GPUs with 6 GB VRAM, and a VS Code extension manifest for local servers.',
      'A repo-level context packer is included so the model can see surrounding files without sending code anywhere.',
    ],
    tags: ['code', 'fim', 'gguf', 'autocomplete'],
    license: 'OpenRAIL-M',
    updated: '2026-09-02',
    downloads: 210_917,
    seeders: 63,
    leechers: 21,
    spec: ['7B params', 'Q5_K_M / AWQ-4bit', 'FIM + chat'],
    torrent: {
      infoHash: '0f9e8d7c6b5a4938271605948372615049382716',
      webSeed: ws('code-forge-7b'),
      trackers: TRACKERS,
      sizeBytes: 5_368_709_120,
      pieces: 8192,
    },
    files: [
      { path: 'code-forge-7b-q5_k_m.gguf', sizeBytes: 4_810_383_360 },
      { path: 'code-forge-7b-awq4.safetensors', sizeBytes: 3_800_000_000 },
      { path: 'context-packer.py', sizeBytes: 18_570 },
      { path: 'SHA256SUMS', sizeBytes: 210 },
      { path: 'README.md', sizeBytes: 11_204 },
    ],
  },
  {
    id: 'open-corpus-2026-08',
    kind: 'dataset',
    name: 'open-corpus-2026-08',
    author: '@openforge-core',
    summary:
      '1.4 TB snapshot of permissively licensed web text, code and OCR — deduplicated and domain-tagged.',
    description: [
      'A monthly crawl snapshot restricted to public-domain and permissively licensed sources, with boilerplate stripped and near-duplicates removed via MinHash.',
      'Each document carries a license tag, a language tag and a domain classification. The whole corpus is sharded into 4 GB parquet chunks so you can fetch only what you need — BitTorrent lets you download selected files from the torrent.',
      'Generation scripts and the full URL allowlist are included so the snapshot is fully reproducible.',
    ],
    tags: ['corpus', 'pretraining', 'parquet', 'multilingual'],
    license: 'CC-BY-4.0',
    updated: '2026-09-01',
    downloads: 12_940,
    seeders: 14,
    leechers: 9,
    spec: ['1.4 TB', '349 shards', 'MinHash-deduped'],
    torrent: {
      infoHash: '5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b',
      webSeed: ws('open-corpus-2026-08'),
      trackers: TRACKERS,
      sizeBytes: 1_503_238_553_600,
      pieces: 143_360,
    },
    files: [
      { path: 'manifest.parquet', sizeBytes: 88_080_384 },
      { path: 'shard-0000.parquet', sizeBytes: 4_294_967_296 },
      { path: 'shard-0001.parquet', sizeBytes: 4_294_967_296 },
      { path: 'generation-scripts.tar.zst', sizeBytes: 2_200_000 },
      { path: 'URL-ALLOWLIST.txt', sizeBytes: 14_400_000 },
    ],
  },
  {
    id: 'forge-chat-sft-1m',
    kind: 'dataset',
    name: 'forge-chat-sft-1m',
    author: '@forge-labs',
    summary:
      'One million high-quality chat turns, human-verified, with chain-of-thought traces for SFT.',
    description: [
      'A supervised-fine-tuning set of one million conversations, filtered by an ensemble of quality scorers and spot-checked by human reviewers at 2% sampling.',
      'Format: JSONL with system/user/assistant turns, quality scores and the optional reasoning trace that produced each assistant turn.',
      'Released under CC-BY-SA-4.0 to keep derivative SFT sets open as well.',
    ],
    tags: ['sft', 'chat', 'jsonl', 'verified'],
    license: 'CC-BY-SA-4.0',
    updated: '2026-08-19',
    downloads: 23_418,
    seeders: 22,
    leechers: 5,
    spec: ['1M turns', 'JSONL', 'CoT traces included'],
    torrent: {
      infoHash: 'e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
      webSeed: ws('forge-chat-sft-1m'),
      trackers: TRACKERS,
      sizeBytes: 1_649_267_441,
      pieces: 2048,
    },
    files: [
      { path: 'train-0000.jsonl', sizeBytes: 812_000_000 },
      { path: 'train-0001.jsonl', sizeBytes: 812_000_000 },
      { path: 'validation.jsonl', sizeBytes: 25_267_441 },
      { path: 'README.md', sizeBytes: 9_800 },
    ],
  },
  {
    id: 'bench-forge-tiny',
    kind: 'dataset',
    name: 'bench-forge-tiny',
    author: '@openforge-core',
    summary:
      'A 40 MB evaluation suite that fits on a floppy-era budget: 12 tasks, clean rubrics, zero leakage.',
    description: [
      'Tiny, contamination-audited benchmark: reasoning, math, code, translation and 8 more tasks, each capped at 500 items with gold answers and rubrics.',
      'Designed for quick regression checks between model releases — full sweep takes under 20 minutes on a laptop.',
      'Includes a runner script and expected-score envelopes for the hub models above.',
    ],
    tags: ['benchmark', 'eval', 'lightweight'],
    license: 'MIT',
    updated: '2026-07-14',
    downloads: 31_755,
    seeders: 29,
    leechers: 3,
    spec: ['12 tasks', '~40 MB', 'leakage-audited'],
    torrent: {
      infoHash: 'b0a9d8c7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1',
      webSeed: ws('bench-forge-tiny'),
      trackers: TRACKERS,
      sizeBytes: 41_943_040,
      pieces: 128,
    },
    files: [
      { path: 'tasks.tar.zst', sizeBytes: 38_000_000 },
      { path: 'runner.py', sizeBytes: 22_400 },
      { path: 'expected-scores.json', sizeBytes: 3_920_640 },
      { path: 'README.md', sizeBytes: 4_800 },
    ],
  },
]

export function getArtifact(id: string): Artifact | undefined {
  return ARTIFACTS.find((a) => a.id === id)
}

export function artifactsByKind(kind: ArtifactKind): Artifact[] {
  return ARTIFACTS.filter((a) => a.kind === kind)
}

export interface CatalogFilters {
  q?: string
  kind?: ArtifactKind | 'all'
  tag?: string
}

export function searchArtifacts({ q, kind = 'all', tag }: CatalogFilters): Artifact[] {
  let list = ARTIFACTS
  if (kind !== 'all') list = list.filter((a) => a.kind === kind)
  if (tag) list = list.filter((a) => a.tags.includes(tag))
  if (q) {
    const needle = q.toLowerCase()
    list = list.filter(
      (a) =>
        a.name.toLowerCase().includes(needle) ||
        a.summary.toLowerCase().includes(needle) ||
        a.author.toLowerCase().includes(needle) ||
        a.tags.some((t) => t.includes(needle)),
    )
  }
  return list
}

export function allTags(): string[] {
  const set = new Set<string>()
  for (const a of ARTIFACTS) a.tags.forEach((t) => set.add(t))
  return [...set].sort()
}
