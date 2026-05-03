export interface AudioDataPoint {
  bass: number;
  mid: number;
  treble: number;
  frame: number;
}

export type FrequencyRange = 'bass' | 'mid' | 'treble';

export interface IAudioAnalyzer {
  initialized: boolean;
  getFrequencyData(frame: number): { bass: number; mid: number; treble: number };
}

export interface VisualizerBlobProps {
  analyzer: IAudioAnalyzer;
  range: FrequencyRange;
  color: string;
  position: [number, number, number];
  strength?: number; // 0–1, scales reactivity
  size?: number;     // multiplier on resting radius, default 1
}