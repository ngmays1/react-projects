import React, { useRef, useState, useMemo, CSSProperties } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { AudioDataPoint, VisualizerBlobProps } from './structures/types';

// --- 1. Audio Processing Logic ---
class AudioAnalyzer {
  public initialized: boolean = false;
  public source: 'microphone' | 'file' | null = null;
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  public recordedData: AudioDataPoint[] = [];

  // file playback
  private audioBuffer: AudioBuffer | null = null;
  private bufferSource: AudioBufferSourceNode | null = null;
  private startedAt: number = 0;
  private pauseOffset: number = 0;
  public isPlaying: boolean = false;
  public duration: number = 0;
  private linkedToDestination: boolean = false;
  private micStream: MediaStream | null = null;

  private ensureContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    }
    return this.audioCtx;
  }

  async initMicrophone(): Promise<void> {
    const ctx = this.ensureContext();
    await ctx.resume();
    this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const micSource = ctx.createMediaStreamSource(this.micStream);
    micSource.connect(this.analyser!);
    this.initialized = true;
    this.source = 'microphone';
  }

  stopMicrophone(): void {
    this.micStream?.getTracks().forEach(t => t.stop());
    this.micStream = null;
    this.initialized = false;
    this.source = null;
  }

  async initFromFile(arrayBuffer: ArrayBuffer): Promise<void> {
    this.stopPlayback();
    const ctx = this.ensureContext();
    await ctx.resume();
    this.audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    this.duration = this.audioBuffer.duration;
    this.pauseOffset = 0;
    this.initialized = true;
    this.source = 'file';
  }

  play(onEnded: () => void): void {
    if (!this.audioBuffer || !this.audioCtx || !this.analyser || this.isPlaying) return;
    const ctx = this.audioCtx;
    this.bufferSource = ctx.createBufferSource();
    this.bufferSource.buffer = this.audioBuffer;
    this.bufferSource.connect(this.analyser);
    if (!this.linkedToDestination) {
      this.analyser.connect(ctx.destination);
      this.linkedToDestination = true;
    }
    this.bufferSource.start(0, this.pauseOffset);
    this.startedAt = ctx.currentTime - this.pauseOffset;
    this.isPlaying = true;
    this.bufferSource.onended = () => {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.pauseOffset = 0;
        onEnded();
      }
    };
  }

  pause(): void {
    if (!this.audioCtx || !this.isPlaying || !this.bufferSource) return;
    this.pauseOffset = this.audioCtx.currentTime - this.startedAt;
    this.isPlaying = false;
    this.bufferSource.onended = null;
    this.bufferSource.stop();
  }

  stopPlayback(): void {
    if (this.bufferSource) {
      this.bufferSource.onended = null;
      try { this.bufferSource.stop(); } catch { /* already stopped */ }
      this.bufferSource = null;
    }
    this.isPlaying = false;
    this.pauseOffset = 0;
  }

  getCurrentTime(): number {
    if (!this.audioCtx) return 0;
    return this.isPlaying ? this.audioCtx.currentTime - this.startedAt : this.pauseOffset;
  }

  getFrequencyData(frame: number): { bass: number; mid: number; treble: number } {
    if (!this.initialized || !this.analyser || !this.dataArray) {
      return { bass: 0, mid: 0, treble: 0 };
    }
    this.analyser.getByteFrequencyData(this.dataArray);
    const bass = this.dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / (10 * 255);
    const mid = this.dataArray.slice(10, 80).reduce((a, b) => a + b, 0) / (70 * 255);
    const treble = this.dataArray.slice(80, 200).reduce((a, b) => a + b, 0) / (120 * 255);
    this.recordedData.push({ bass, mid, treble, frame });
    return { bass, mid, treble };
  }
}

// --- 2. Blob Component ---
const VisualizerBlob: React.FC<VisualizerBlobProps> = ({ analyzer, range, color, position, strength = .5 }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const vec = new THREE.Vector3();

  useFrame((state) => {
    if (!analyzer.initialized) return;
    const frameIndex = Math.floor(state.clock.elapsedTime * 60);
    const data = analyzer.getFrequencyData(frameIndex);
    const value = data[range] * strength;
    const s = 1 + value * 2;
    meshRef.current.scale.lerp(vec.set(s, s, s), 0.1);
    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, 0.3 + value * 1.5, 0.1);
      materialRef.current.speed = 2 + value * 5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial ref={materialRef} color={color} speed={2} distort={0.3} radius={1} roughness={0.1} metalness={0.05} />
      </Sphere>
    </Float>
  );
};

// --- 3. Progress Bar ---
const ProgressBar: React.FC<{ analyzer: AudioAnalyzer; isPlaying: boolean }> = ({ analyzer, isPlaying }) => {
  const { tokens } = useTheme();
  const [pct, setPct] = useState(0);
  const rafRef = useRef<number | null>(null);

  React.useEffect(() => {
    const tick = () => {
      if (analyzer.duration > 0) {
        setPct(Math.min(1, analyzer.getCurrentTime() / analyzer.duration));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, analyzer]);

  if (analyzer.duration === 0) return null;

  return (
    <div style={{ width: '100%', height: '3px', background: tokens.border, borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
      <div style={{ height: '100%', width: `${pct * 100}%`, background: tokens.accent, borderRadius: '2px', transition: 'width 0.1s linear' }} />
    </div>
  );
};

// --- 4. Main Component ---
export const ModularVisualizer: React.FC = () => {
  const { tokens } = useTheme();
  const [mode, setMode] = useState<'mic' | 'file'>('mic');
  const [isRecording, setIsRecording] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const analyzer = useMemo(() => new AudioAnalyzer(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const btn = (active = false): CSSProperties => ({
    padding: '7px 16px',
    borderRadius: '20px',
    border: `1px solid ${active ? tokens.accent : tokens.border}`,
    background: active ? tokens.accent : tokens.surface,
    color: active ? tokens.accentFg : tokens.textPrimary,
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap' as const,
  });

  const iconBtn = (): CSSProperties => ({
    padding: '7px 12px',
    borderRadius: '20px',
    border: `1px solid ${tokens.border}`,
    background: tokens.surface,
    color: tokens.textPrimary,
    fontWeight: 600,
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  });

  const handleMicToggle = async () => {
    setError(null);
    try {
      if (!isRecording) {
        await analyzer.initMicrophone();
        setIsRecording(true);
      } else {
        analyzer.stopMicrophone();
        setIsRecording(false);
      }
    } catch {
      setError('Microphone access denied.');
    }
  };

  const loadFile = async (file: File) => {
    setError(null);
    try {
      analyzer.stopPlayback();
      setIsPlaying(false);
      const buf = await file.arrayBuffer();
      await analyzer.initFromFile(buf);
      setFileName(file.name);
    } catch {
      setError('Could not decode audio file.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  };

  const handlePlay = () => {
    analyzer.play(() => setIsPlaying(false));
    setIsPlaying(true);
  };

  const handlePause = () => {
    analyzer.pause();
    setIsPlaying(false);
  };

  const handleStop = () => {
    analyzer.stopPlayback();
    setIsPlaying(false);
  };

  const clearFile = () => {
    analyzer.stopPlayback();
    setFileName(null);
    setIsPlaying(false);
  };

  const switchMode = (m: 'mic' | 'file') => {
    if (isRecording) { analyzer.stopMicrophone(); setIsRecording(false); }
    if (isPlaying) { analyzer.stopPlayback(); setIsPlaying(false); }
    setMode(m);
    setError(null);
  };

  const exportBlenderJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analyzer.recordedData));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', 'blender_motion_data.json');
    a.click();
  };

  const hasData = isRecording || fileName != null;

  return (
    <div style={{ width: '100%', height: '80vh', background: tokens.bg, position: 'relative', transition: 'background-color 0.3s', display: 'flex', flexDirection: 'column' }}>

      {/* Controls bar */}
      <div style={{ padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', zIndex: 10, background: `${tokens.header}cc`, backdropFilter: 'blur(8px)', borderBottom: `1px solid ${tokens.border}` }}>

        {/* Mode toggle */}
        <div style={{ display: 'flex', borderRadius: '20px', overflow: 'hidden', border: `1px solid ${tokens.border}`, flexShrink: 0 }}>
          <button onClick={() => switchMode('mic')} style={{ ...btn(mode === 'mic'), borderRadius: 0, border: 'none' }}>🎤 Mic</button>
          <div style={{ width: '1px', background: tokens.border }} />
          <button onClick={() => switchMode('file')} style={{ ...btn(mode === 'file'), borderRadius: 0, border: 'none' }}>📁 File</button>
        </div>

        {/* Mic controls */}
        {mode === 'mic' && (
          <button onClick={handleMicToggle} style={btn(isRecording)}>
            {isRecording ? '🎤 Listening…' : 'Start Microphone'}
          </button>
        )}

        {/* File controls */}
        {mode === 'file' && (
          <>
            {!fileName ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                style={{
                  padding: '7px 18px',
                  borderRadius: '20px',
                  border: `2px dashed ${isDragging ? tokens.accent : tokens.border}`,
                  background: isDragging ? `${tokens.accent}18` : 'transparent',
                  color: tokens.textSecondary,
                  cursor: 'pointer',
                  fontSize: '13px',
                  transition: 'all 0.15s',
                  userSelect: 'none',
                }}
              >
                Drop MP3 / FLAC or click to upload
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: tokens.textPrimary, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    🎵 {fileName}
                  </span>
                  <button onClick={isPlaying ? handlePause : handlePlay} style={iconBtn()}>
                    {isPlaying ? '⏸' : '▶'}
                  </button>
                  <button onClick={handleStop} style={iconBtn()}>⏹</button>
                  <button onClick={clearFile} style={{ ...iconBtn(), color: tokens.textMuted, fontSize: '12px' }}>✕</button>
                </div>
                <ProgressBar analyzer={analyzer} isPlaying={isPlaying} />
              </div>
            )}
            <input ref={fileInputRef} type="file" accept=".mp3,.flac,audio/mpeg,audio/flac" style={{ display: 'none' }} onChange={handleFileChange} />
          </>
        )}

        {/* Spacer + export */}
        <div style={{ marginLeft: 'auto' }}>
          {hasData && (
            <button onClick={exportBlenderJSON} style={btn()}>
              ↓ Blender JSON
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ position: 'absolute', top: 70, left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', zIndex: 20 }}>
          {error}
        </div>
      )}

      {/* Canvas */}
      <div style={{ flex: 1 }}>
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
          <pointLight position={[-10, -10, -10]} color="#99ccff" />
          <VisualizerBlob analyzer={analyzer} range="bass" color="#ffb7ce" position={[-3.5, 0, 0]} strength={0.4} />
          <VisualizerBlob analyzer={analyzer} range="mid" color="#a2d2ff" position={[0, 0, 0]} strength={0.4} />
          <VisualizerBlob analyzer={analyzer} range="treble" color="#ccffcc" position={[3.5, 0, 0]} strength={0.4} />
          <ContactShadows position={[0, -3, 0]} opacity={0.3} scale={15} blur={2.5} far={4} />
          <Environment preset="studio" />
        </Canvas>
      </div>
    </div>
  );
};

export default ModularVisualizer;
