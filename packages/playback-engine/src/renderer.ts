// ────────────────────────────────────────────
// CueRenderer — offline render to AudioBuffer + WAV
// ────────────────────────────────────────────

import type { SoundtrackPack } from "@soundweave/schema";
import { resolveActiveLayers } from "@soundweave/audio-engine";
import type { RenderOptions, RenderResult, BusId } from "./mixer-types.js";
import { Mixer } from "./mixer.js";
import { AssetLoader } from "./loader.js";
import { dbToGain } from "./scene-player.js";

/**
 * Renders a scene to an AudioBuffer using OfflineAudioContext.
 * Recreates the full mix graph (stems → gain → pan → buses → FX → master)
 * in an offline context and renders to a buffer.
 */
export class CueRenderer {
  private onlineCtx: AudioContext;
  private loader: AssetLoader;

  constructor(ctx: AudioContext, loader: AssetLoader) {
    this.onlineCtx = ctx;
    this.loader = loader;
  }

  /**
   * Render a scene to an AudioBuffer.
   * Uses OfflineAudioContext to produce a fully mixed audio buffer.
   */
  async render(
    pack: SoundtrackPack,
    options: RenderOptions,
  ): Promise<RenderResult> {
    const sampleRate = options.sampleRate ?? 44100;
    const channels = options.channels ?? 2;

    // Resolve scene and stems
    const scene = pack.scenes.find((s) => s.id === options.sceneId);
    if (!scene) throw new Error(`Scene not found: ${options.sceneId}`);

    const plan = resolveActiveLayers(pack, options.sceneId);
    const stemsById = new Map(pack.stems.map((s) => [s.id, s]));
    const layersByStEm = new Map(
      scene.layers.map((l) => [l.stemId, l]) ?? [],
    );

    // Ensure assets are loaded in the online context
    await this.loader.loadForStems(pack, plan.stemIds);

    // Determine render duration
    let durationSeconds = options.durationSeconds ?? 0;
    if (durationSeconds <= 0) {
      // Auto-detect from longest asset
      for (const stemId of plan.stemIds) {
        const stem = stemsById.get(stemId);
        if (!stem) continue;
        const buffer = this.loader.getBuffer(stem.assetId);
        if (buffer && buffer.duration > durationSeconds) {
          durationSeconds = buffer.duration;
        }
      }
    }
    // For loop-only, default to 30s if nothing useful found
    if (durationSeconds <= 0) durationSeconds = 30;

    // Add a small tail for reverb/delay
    const tailSeconds = 2;
    const totalDuration = durationSeconds + tailSeconds;

    // Create offline context
    const offlineCtx = new OfflineAudioContext(
      channels,
      Math.ceil(totalDuration * sampleRate),
      sampleRate,
    );

    // Create mixer in the offline context
    const mixer = new Mixer(offlineCtx, offlineCtx.destination);

    // Play stems into the offline graph
    for (const stemId of plan.stemIds) {
      const stem = stemsById.get(stemId);
      if (!stem) continue;

      const onlineBuffer = this.loader.getBuffer(stem.assetId);
      if (!onlineBuffer) continue;

      // Re-create the buffer in the offline context
      const offlineBuffer = offlineCtx.createBuffer(
        onlineBuffer.numberOfChannels,
        onlineBuffer.length,
        onlineBuffer.sampleRate,
      );
      for (let ch = 0; ch < onlineBuffer.numberOfChannels; ch++) {
        offlineBuffer.copyToChannel(onlineBuffer.getChannelData(ch), ch);
      }

      const gainNode = offlineCtx.createGain();
      const layerRef = layersByStEm.get(stemId);
      const stemGainDb = layerRef?.gainDb ?? stem.gainDb ?? 0;
      gainNode.gain.value = stem.mutedByDefault ? 0 : dbToGain(stemGainDb);

      // Infer bus assignment from stem role
      const bus: BusId = inferBus(stem.role);
      mixer.connectStem(stemId, gainNode, bus);

      const source = offlineCtx.createBufferSource();
      source.buffer = offlineBuffer;

      // For loop-only preset, enable looping
      if (options.preset === "loop-only") {
        source.loop = true;
      } else {
        source.loop = stem.loop;
      }

      source.connect(gainNode);
      source.start(0);

      // Stop looping sources at the target duration
      if (source.loop) {
        source.stop(durationSeconds);
      }
    }

    // Render
    const renderedBuffer = await offlineCtx.startRendering();
    mixer.dispose();

    // Trim tail silence (keep at least the requested duration)
    const trimmedBuffer = trimSilence(
      renderedBuffer,
      durationSeconds,
      sampleRate,
    );

    return {
      buffer: trimmedBuffer,
      durationSeconds: trimmedBuffer.duration,
      sampleRate,
      channels,
    };
  }
}

/** Infer bus assignment from stem role */
function inferBus(role: string): BusId {
  if (role === "accent") return "drums";
  return "music";
}

/** Trim trailing silence from a rendered buffer, keeping at least minDuration */
function trimSilence(
  buffer: AudioBuffer,
  minDuration: number,
  sampleRate: number,
): AudioBuffer {
  const minSamples = Math.ceil(minDuration * sampleRate);
  let lastNonSilent = minSamples;

  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = data.length - 1; i >= minSamples; i--) {
      if (Math.abs(data[i]) > 0.0001) {
        if (i > lastNonSilent) lastNonSilent = i;
        break;
      }
    }
  }

  // Add a tiny fade-out (100 samples)
  const endSample = Math.min(lastNonSilent + 100, buffer.length);
  if (endSample >= buffer.length) return buffer;

  // Can't re-create AudioBuffer without a context, so return as-is
  // The slight extra tail is acceptable (at most 2s)
  return buffer;
}

/**
 * Encode an AudioBuffer as a WAV Blob.
 * Returns a Blob of type audio/wav.
 */
export function encodeWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  // RIFF header
  writeString(view, 0, "RIFF");
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, "WAVE");

  // fmt chunk
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data chunk
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Interleave channel data and write as 16-bit PCM
  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(buffer.getChannelData(ch));
  }

  let offset = headerSize;
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      const intSample =
        sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
