import { describe, it, expect } from "vitest";
import { scheduleNotes, clipLengthSeconds } from "../src/scheduler";
import type { ClipNote } from "@soundweave/schema";

describe("scheduleNotes", () => {
  const bpm = 120; // 0.5s per beat, 480 ticks per beat
  const startTime = 1.0;

  it("converts ticks to seconds correctly", () => {
    const notes: ClipNote[] = [
      { pitch: 60, startTick: 0, durationTicks: 480, velocity: 100 },
    ];
    const result = scheduleNotes(notes, bpm, startTime);
    expect(result).toHaveLength(1);
    expect(result[0].startTime).toBeCloseTo(1.0);
    expect(result[0].duration).toBeCloseTo(0.5); // 480 ticks at 120 bpm = 0.5s
  });

  it("offsets notes correctly", () => {
    const notes: ClipNote[] = [
      { pitch: 60, startTick: 0, durationTicks: 240, velocity: 100 },
      { pitch: 64, startTick: 240, durationTicks: 240, velocity: 80 },
      { pitch: 67, startTick: 480, durationTicks: 240, velocity: 90 },
    ];
    const result = scheduleNotes(notes, bpm, startTime);
    expect(result).toHaveLength(3);
    expect(result[0].startTime).toBeCloseTo(1.0);
    expect(result[1].startTime).toBeCloseTo(1.25); // 240 ticks = 0.25s at 120bpm
    expect(result[2].startTime).toBeCloseTo(1.5);
  });

  it("preserves pitch and velocity", () => {
    const notes: ClipNote[] = [
      { pitch: 48, startTick: 0, durationTicks: 120, velocity: 127 },
    ];
    const result = scheduleNotes(notes, bpm, startTime);
    expect(result[0].pitch).toBe(48);
    expect(result[0].velocity).toBe(127);
  });

  it("handles empty notes array", () => {
    expect(scheduleNotes([], 120, 0)).toEqual([]);
  });

  it("handles different BPMs", () => {
    const notes: ClipNote[] = [
      { pitch: 60, startTick: 480, durationTicks: 480, velocity: 100 },
    ];
    // 60 BPM = 1s per beat
    const result60 = scheduleNotes(notes, 60, 0);
    expect(result60[0].startTime).toBeCloseTo(1.0);
    expect(result60[0].duration).toBeCloseTo(1.0);

    // 240 BPM = 0.25s per beat
    const result240 = scheduleNotes(notes, 240, 0);
    expect(result240[0].startTime).toBeCloseTo(0.25);
    expect(result240[0].duration).toBeCloseTo(0.25);
  });
});

describe("clipLengthSeconds", () => {
  it("calculates correct length at 120 BPM", () => {
    expect(clipLengthSeconds(120, 4)).toBeCloseTo(2.0); // 4 beats at 120bpm = 2s
  });

  it("calculates correct length at 60 BPM", () => {
    expect(clipLengthSeconds(60, 4)).toBeCloseTo(4.0); // 4 beats at 60bpm = 4s
  });

  it("handles odd beat counts", () => {
    expect(clipLengthSeconds(120, 3)).toBeCloseTo(1.5);
  });
});
