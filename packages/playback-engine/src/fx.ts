// ────────────────────────────────────────────
// FX — audio effect node factory and wiring
// ────────────────────────────────────────────

import type {
  FxType,
  FxParams,
  EqParams,
  DelayParams,
  ReverbParams,
  CompressorParams,
} from "./mixer-types.js";

/** Nodes created for a single FX slot */
export interface FxNodeSet {
  type: FxType;
  input: AudioNode;
  output: AudioNode;
  /** All nodes owned by this slot (for cleanup) */
  nodes: AudioNode[];
  /** Update parameters on existing nodes */
  update(params: FxParams): void;
}

/** Create an EQ (BiquadFilter) FX slot */
function createEq(ctx: BaseAudioContext, params: EqParams): FxNodeSet {
  const filter = ctx.createBiquadFilter();
  filter.type = params.type;
  filter.frequency.value = params.frequency;
  filter.gain.value = params.gain;
  filter.Q.value = params.Q;

  return {
    type: "eq",
    input: filter,
    output: filter,
    nodes: [filter],
    update(p: FxParams) {
      const ep = p as EqParams;
      filter.type = ep.type;
      filter.frequency.value = ep.frequency;
      filter.gain.value = ep.gain;
      filter.Q.value = ep.Q;
    },
  };
}

/** Create a delay FX slot with feedback loop */
function createDelay(ctx: BaseAudioContext, params: DelayParams): FxNodeSet {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const delay = ctx.createDelay(5);
  const feedback = ctx.createGain();

  dry.gain.value = 1 - params.mix;
  wet.gain.value = params.mix;
  delay.delayTime.value = params.delayTime;
  feedback.gain.value = params.feedback;

  // dry path: input → dry → output
  input.connect(dry);
  dry.connect(output);

  // wet path: input → delay → wet → output, with feedback loop
  input.connect(delay);
  delay.connect(feedback);
  feedback.connect(delay); // feedback loop
  delay.connect(wet);
  wet.connect(output);

  return {
    type: "delay",
    input,
    output,
    nodes: [input, output, dry, wet, delay, feedback],
    update(p: FxParams) {
      const dp = p as DelayParams;
      dry.gain.value = 1 - dp.mix;
      wet.gain.value = dp.mix;
      delay.delayTime.value = dp.delayTime;
      feedback.gain.value = dp.feedback;
    },
  };
}

/** Create a reverb FX slot using ConvolverNode with generated impulse */
function createReverb(ctx: BaseAudioContext, params: ReverbParams): FxNodeSet {
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const convolver = ctx.createConvolver();

  dry.gain.value = 1 - params.mix;
  wet.gain.value = params.mix;

  // Generate impulse response
  convolver.buffer = generateImpulse(ctx, params.decayTime);

  // dry path
  input.connect(dry);
  dry.connect(output);

  // wet path
  input.connect(convolver);
  convolver.connect(wet);
  wet.connect(output);

  return {
    type: "reverb",
    input,
    output,
    nodes: [input, output, dry, wet, convolver],
    update(p: FxParams) {
      const rp = p as ReverbParams;
      dry.gain.value = 1 - rp.mix;
      wet.gain.value = rp.mix;
      convolver.buffer = generateImpulse(ctx, rp.decayTime);
    },
  };
}

/** Create a compressor/limiter FX slot */
function createCompressor(
  ctx: BaseAudioContext,
  params: CompressorParams,
): FxNodeSet {
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = params.threshold;
  comp.ratio.value = params.ratio;
  comp.attack.value = params.attack;
  comp.release.value = params.release;
  comp.knee.value = params.knee;

  return {
    type: "compressor",
    input: comp,
    output: comp,
    nodes: [comp],
    update(p: FxParams) {
      const cp = p as CompressorParams;
      comp.threshold.value = cp.threshold;
      comp.ratio.value = cp.ratio;
      comp.attack.value = cp.attack;
      comp.release.value = cp.release;
      comp.knee.value = cp.knee;
    },
  };
}

/** Factory: create an FX node set for any FX type */
export function createFxNodes(
  ctx: BaseAudioContext,
  type: FxType,
  params: FxParams,
): FxNodeSet {
  switch (type) {
    case "eq":
      return createEq(ctx, params as EqParams);
    case "delay":
      return createDelay(ctx, params as DelayParams);
    case "reverb":
      return createReverb(ctx, params as ReverbParams);
    case "compressor":
      return createCompressor(ctx, params as CompressorParams);
  }
}

/** Disconnect and clean up an FX node set */
export function disposeFxNodes(fxNodeSet: FxNodeSet): void {
  for (const node of fxNodeSet.nodes) {
    try {
      node.disconnect();
    } catch {
      // May already be disconnected
    }
  }
}

/** Generate a simple exponential-decay impulse response */
function generateImpulse(
  ctx: BaseAudioContext,
  decayTime: number,
): AudioBuffer {
  const length = Math.max(1, Math.floor(ctx.sampleRate * decayTime));
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      // Exponential decay with random noise
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }
  }
  return buffer;
}
