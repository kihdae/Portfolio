import type {
  VisualizerType,
  AudioData,
  VisualParameters,
  AudioMapping,
  PerformanceMetrics,
} from '@/types/visualizer';

export class EnhancedVisualizerEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private lastFrameTime = 0;
  private frameCount = 0;
  private fps = 60;
  private performanceMetrics: PerformanceMetrics = {
    fps: 60,
    cpuUsage: 0,
    memoryUsage: 0,
    renderTime: 0,
    audioLatency: 0,
  };

  private currentType: VisualizerType = 'spectrum-circle';
  private visualParams: VisualParameters;
  private audioMapping: AudioMapping;
  private audioData: AudioData | null = null;
  private smoothingBuffer: Float32Array | null = null;
  private smoothingBufferSize: number = 0;

  private useThemeColors = true;
  private cachedThemeColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  } = {
    primary: '#9D72FF',
    secondary: '#7A4FF0',
    accent: '#B794FF',
    background: '#12101D',
  };

  private particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    alpha: number;
  }> = [];

  private orbState = {
    size: 50,
    targetSize: 50,
    glow: 0.5,
    targetGlow: 0.5,
    rotation: 0,
  };

  private gridState: Array<
    Array<{
      value: number;
      targetValue: number;
      brightness: number;
    }>
  > = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get 2D context from canvas');
    }
    this.ctx = ctx;

    this.visualParams = this.getDefaultVisualParameters();
    this.audioMapping = this.getDefaultAudioMapping();

    this.setupCanvas();

    this.updateThemeColors();

    this.initializeGridState();

    this.setupResizeObserver();
  }

  private resizeObserver: ResizeObserver | null = null;

  private setupResizeObserver(): void {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target === parent) {
          this.resize();
        }
      }
    });

    this.resizeObserver.observe(parent);
  }

  private setupCanvas(): void {
    const dpr = window.devicePixelRatio || 1;
    const parent = this.canvas.parentElement;

    if (!parent) {
      console.warn('Canvas has no parent element');
      return;
    }

    const parentRect = parent.getBoundingClientRect();
    const rect = this.canvas.getBoundingClientRect();

    let width = parentRect.width || rect.width || 800;
    let height = parentRect.height || rect.height || 600;

    const finalWidth = Math.max(width, 100);
    const finalHeight = Math.max(height, 100);

    this.canvas.width = finalWidth * dpr;
    this.canvas.height = finalHeight * dpr;
    this.ctx.scale(dpr, dpr);

    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.display = 'block';

    console.log('Enhanced Canvas setup:', {
      width: finalWidth,
      height: finalHeight,
      dpr,
      parentWidth: parentRect.width,
      parentHeight: parentRect.height,
    });
  }

  private initializeGridState(): void {
    const gridCols = 32;
    const gridRows = 16;
    this.gridState = [];

    for (let row = 0; row < gridRows; row++) {
      this.gridState[row] = [];
      for (let col = 0; col < gridCols; col++) {
        this.gridState[row]![col] = {
          value: 0,
          targetValue: 0,
          brightness: 0,
        };
      }
    }
  }

  start(): void {
    if (this.animationFrameId) return;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.animate();
  }

  stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy(): void {
    this.stop();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
  }

  private resizeTimeout: number | null = null;

  resize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = setTimeout(() => {
      this.setupCanvas();
      this.initializeGridState();

      if (this.animationFrameId) {
        this.renderVisualizer();
      }
    }, 100) as any;
  }

  private animate(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    this.frameCount++;
    if (this.frameCount % 60 === 0) {
      this.fps = 1000 / ((deltaTime * 60) / this.frameCount);
      this.performanceMetrics.fps = this.fps;
    }

    this.clearCanvas();

    try {
      this.renderVisualizer();
    } catch (error) {
      console.warn('Enhanced Visualizer render error:', error);
      this.renderFallbackVisualizer();
    }

    this.updatePerformanceMetrics(deltaTime);
    this.lastFrameTime = currentTime;
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  private clearCanvas(): void {
    if (this.useThemeColors) {
      this.ctx.fillStyle = this.cachedThemeColors.background;
    } else {
      this.ctx.fillStyle = this.visualParams.backgroundColor;
    }
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private renderVisualizer(): void {
    switch (this.currentType) {
      case 'spectrum-circle':
        this.renderCenteredSpectrumCircle();
        break;
      case 'waveform':
        this.renderWaveform();
        break;
      case 'particle-system':
        this.renderEnhancedParticleSystem();
        break;
      case 'frequency-bars':
        this.renderEnhancedFrequencyBars();
        break;
      case 'liquid-wave':
        this.renderLiquidWave();
        break;
      case 'matrix-rain':
        this.renderMatrixRain();
        break;
      case 'pulsing-orb':
        this.renderPulsingOrb();
        break;
      case 'dynamic-equalizer-grid':
        this.renderDynamicEqualizerGrid();
        break;
      default:
        this.renderCenteredSpectrumCircle();
    }
  }

  private renderEnhancedFrequencyBars(): void {
    const totalBars = Math.floor(
      this.canvas.width /
        (this.visualParams.barWidth + this.visualParams.barSpacing)
    );
    const barWidth = this.visualParams.barWidth;
    const spacing = this.visualParams.barSpacing;

    if (totalBars <= 0) return;

    const frequencyData = this.audioData?.frequencyData;
    const sampleCount = frequencyData?.length || 0;

    for (let i = 0; i < totalBars; i++) {
      let value = 0.25;

      if (frequencyData && sampleCount > 0) {
        const exactIndex = (i / totalBars) * sampleCount;
        const lowerIndex = Math.floor(exactIndex);
        const upperIndex = Math.min(lowerIndex + 1, sampleCount - 1);
        const fraction = exactIndex - lowerIndex;

        const lowerValue = (frequencyData[lowerIndex] || 0) / 255;
        const upperValue = (frequencyData[upperIndex] || 0) / 255;
        value = lowerValue * (1 - fraction) + upperValue * fraction;

        value = this.smoothValue(value, i);
        value = Math.max(value, 0.1);
      } else {
        const time = Date.now() * 0.001;
        value =
          0.25 +
          0.15 * Math.sin(time + i * 0.1) +
          0.08 * Math.sin(time * 2 + i * 0.05);
      }

      const mappedValue = this.applyAudioMapping(value, i, totalBars);
      const height = Math.max(
        mappedValue * this.canvas.height * this.visualParams.barHeight,
        4
      );

      const x = i * (barWidth + spacing);
      const y = this.canvas.height - height;

      this.drawCrispBar(x, y, barWidth, height, value);
    }
  }

  private drawCrispBar(
    x: number,
    y: number,
    width: number,
    height: number,
    intensity: number,
  ): void {
    const pixelX = Math.round(x);
    const pixelY = Math.round(y);
    const pixelWidth = Math.round(width);
    const pixelHeight = Math.round(height);

    const gradient = this.ctx.createLinearGradient(
      pixelX,
      pixelY,
      pixelX,
      pixelY + pixelHeight
    );
    gradient.addColorStop(0, this.cachedThemeColors.primary);
    gradient.addColorStop(0.7, this.cachedThemeColors.secondary);
    gradient.addColorStop(1, this.cachedThemeColors.accent);

    if (this.visualParams.glowIntensity > 0) {
      this.ctx.shadowColor = this.cachedThemeColors.primary;
      this.ctx.shadowBlur = this.visualParams.glowIntensity * 20 * intensity;
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(pixelX, pixelY, pixelWidth, pixelHeight);

    this.ctx.globalAlpha = 0.3 * intensity;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.fillRect(
      pixelX,
      pixelY,
      pixelWidth,
      Math.max(pixelHeight * 0.2, 2)
    );
    this.ctx.globalAlpha = 1;

    if (this.visualParams.reflectionOpacity > 0) {
      this.ctx.globalAlpha =
        this.visualParams.reflectionOpacity * intensity * 0.5;
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(
        pixelX,
        this.canvas.height,
        pixelWidth,
        pixelHeight * 0.3
      );
      this.ctx.globalAlpha = 1;
    }

    this.ctx.shadowBlur = 0;
  }

  private renderEnhancedParticleSystem(): void {
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx * this.visualParams.animationSpeed;
      particle.y += particle.vy * this.visualParams.animationSpeed;
      particle.vy += this.visualParams.particleGravity;
      particle.life -= 0.016;

      particle.alpha = particle.life / particle.maxLife;

      return particle.life > 0;
    });

    let particleCount = this.visualParams.particleCount;
    if (this.audioData) {
      const audioIntensity =
        this.audioData.overallVolume * this.audioMapping.volumeSensitivity;
      particleCount = Math.floor(
        this.visualParams.particleCount * audioIntensity * 2
      );
    }

    while (this.particles.length < Math.min(particleCount, 200)) {
      const audioIntensity = this.audioData
        ? (this.audioData.frequencyData?.[
            Math.floor(Math.random() * this.audioData.frequencyData.length)
          ] || 128) / 255
        : 0.5;

      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height + 10,
        vx:
          (Math.random() - 0.5) *
          this.visualParams.particleSpeed *
          2 *
          audioIntensity,
        vy:
          -Math.random() * this.visualParams.particleSpeed * 3 * audioIntensity,
        life: this.visualParams.particleLife * (0.5 + audioIntensity * 0.5),
        maxLife: this.visualParams.particleLife,
        size: this.visualParams.particleSize * (0.5 + audioIntensity * 1.5),
        color: this.cachedThemeColors.primary,
        alpha: 1,
      });
    }

    this.particles.forEach(particle => {
      const size = particle.size * (0.5 + particle.alpha * 0.5);

      if (this.visualParams.glowIntensity > 0) {
        this.ctx.shadowColor = particle.color;
        this.ctx.shadowBlur =
          this.visualParams.glowIntensity * 15 * particle.alpha;
      }

      if (this.visualParams.bloomIntensity > 0) {
        this.ctx.globalAlpha =
          this.visualParams.bloomIntensity * particle.alpha * 0.5;
        this.ctx.fillStyle = this.cachedThemeColors.accent;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.globalAlpha = particle.alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.shadowBlur = 0;
      this.ctx.globalAlpha = 1;
    });
  }

  private renderCenteredSpectrumCircle(): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    const minDimension = Math.min(canvasWidth, canvasHeight);

    const maxRadius = Math.max(minDimension * 0.7, minDimension - 30);

    const effectiveRadius = Math.min(maxRadius, centerX - 20, centerY - 20);

    let frequencyData: number[] = [];
    if (this.audioData && this.audioData.frequencyData) {
      frequencyData = Array.from(this.audioData.frequencyData);
    } else {
      const time = Date.now() * 0.001;
      frequencyData = Array.from(
        { length: 64 },
        (_, i) =>
          128 +
          127 * Math.sin(time + i * 0.1) * this.visualParams.animationSpeed
      );
    }

    const audioIntensity = this.audioData
      ? this.audioData.overallVolume * this.audioMapping.volumeSensitivity
      : 1;

    if (this.visualParams.glowIntensity > 0) {
      this.ctx.shadowColor = this.cachedThemeColors.primary;
      this.ctx.shadowBlur = this.visualParams.glowIntensity * 20;
    }

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.cachedThemeColors.primary;
    this.ctx.lineWidth = 3 + this.visualParams.glowIntensity * 2;

    for (let i = 0; i < frequencyData.length; i++) {
      const angle = (i / frequencyData.length) * Math.PI * 2;
      let value = (frequencyData[i] || 0) / 255;

      if (i < frequencyData.length * 0.3) {
        value *= this.audioMapping.lowFreqSensitivity;
      } else if (i < frequencyData.length * 0.7) {
        value *= this.audioMapping.midFreqSensitivity;
      } else {
        value *= this.audioMapping.highFreqSensitivity;
      }

      const radius = effectiveRadius * (0.3 + value * 0.7) * audioIntensity;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.closePath();
    this.ctx.stroke();

    if (this.visualParams.glowIntensity > 0) {
      this.ctx.strokeStyle = this.cachedThemeColors.accent;
      this.ctx.lineWidth = 1;
      this.ctx.globalAlpha = this.visualParams.glowIntensity * 0.5;
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, effectiveRadius * 0.2, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.globalAlpha = 1;
    }

    this.ctx.shadowBlur = 0;
  }

  private renderPulsingOrb(): void {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    if (this.audioData) {
      const bassIntensity =
        this.audioData.lowFrequency * this.audioMapping.lowFreqSensitivity;
      const volume =
        this.audioData.overallVolume * this.audioMapping.volumeSensitivity;

      this.orbState.targetSize = 50 + bassIntensity * 100;
      this.orbState.targetGlow = 0.5 + volume * 0.5;
    } else {
      const time = Date.now() * 0.001;
      this.orbState.targetSize = 50 + 30 * Math.sin(time);
      this.orbState.targetGlow = 0.5 + 0.3 * Math.sin(time * 1.5);
    }

    this.orbState.size += (this.orbState.targetSize - this.orbState.size) * 0.1;
    this.orbState.glow += (this.orbState.targetGlow - this.orbState.glow) * 0.1;
    this.orbState.rotation += 0.02;

    const gradient = this.ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      this.orbState.size
    );
    gradient.addColorStop(0, this.cachedThemeColors.primary);
    gradient.addColorStop(0.7, this.cachedThemeColors.secondary);
    gradient.addColorStop(1, 'transparent');

    this.ctx.shadowColor = this.cachedThemeColors.primary;
    this.ctx.shadowBlur = this.orbState.glow * 50;

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, this.orbState.size, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = this.cachedThemeColors.accent;
    this.ctx.lineWidth = 2;
    this.ctx.globalAlpha = this.orbState.glow * 0.7;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, this.orbState.size * 1.2, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1;
  }

  private renderDynamicEqualizerGrid(): void {
    const gridCols = this.gridState[0]?.length || 32;
    const gridRows = this.gridState.length;
    const cellWidth = this.canvas.width / gridCols;
    const cellHeight = this.canvas.height / gridRows;

    if (this.audioData && this.audioData.frequencyData) {
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const freqIndex = Math.floor(
            (col / gridCols) * this.audioData.frequencyData.length
          );
          const freqValue = (this.audioData.frequencyData[freqIndex] || 0) / 255;

          let mappedValue = freqValue;
          if (col < gridCols * 0.3) {
            mappedValue *= this.audioMapping.lowFreqSensitivity;
          } else if (col < gridCols * 0.7) {
            mappedValue *= this.audioMapping.midFreqSensitivity;
          } else {
            mappedValue *= this.audioMapping.highFreqSensitivity;
          }

          const heightFactor = (gridRows - row) / gridRows;
          this.gridState[row]![col]!.targetValue = mappedValue * heightFactor;
        }
      }
    } else {  
      const time = Date.now() * 0.001;
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const wave = Math.sin(time + col * 0.1 + row * 0.05);
          this.gridState[row]![col]!.targetValue = (wave + 1) * 0.5;
        }
      }
    }

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        const cell = this.gridState[row]![col];

        cell!.value += (cell!.targetValue - cell!.value) * 0.2;
        cell!.brightness = cell!.value;

        if (cell!.brightness > 0.1) {
          const x = col * cellWidth;
          const y = row * cellHeight;

          let color = this.cachedThemeColors.primary;
          if (col < gridCols * 0.3) {
            color = this.cachedThemeColors.secondary;
          } else if (col > gridCols * 0.7) {
            color = this.cachedThemeColors.accent;
          }

          if (this.visualParams.glowIntensity > 0) {
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur =
            this.visualParams.glowIntensity * 10 * cell!.brightness;
          }

          this.ctx.globalAlpha = cell!.brightness;
          this.ctx.fillStyle = color;
          this.ctx.fillRect(x + 1, y + 1, cellWidth - 2, cellHeight - 2);
        }
      }
    }

    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1;
  }

  private renderWaveform(): void {
    const centerY = this.canvas.height / 2;
    let timeDomainData: Uint8Array;

    if (this.audioData && this.audioData.timeDomainData) {
      timeDomainData = this.audioData.timeDomainData;
    } else {
      timeDomainData = new Uint8Array(1024);
      const time = Date.now() * 0.001;
      for (let i = 0; i < timeDomainData.length; i++) {
        const value = Math.sin(time + i * 0.01) * 50 + 128;
        timeDomainData[i] = Math.max(0, Math.min(255, value));
      }
    }

    const step = this.canvas.width / timeDomainData.length;

    if (this.visualParams.glowIntensity > 0) {
      this.ctx.shadowColor = this.cachedThemeColors.primary;
      this.ctx.shadowBlur = this.visualParams.glowIntensity * 15;
    }

    this.ctx.beginPath();
    this.ctx.strokeStyle = this.cachedThemeColors.primary;
    this.ctx.lineWidth = 3;

    for (let i = 0; i < timeDomainData.length; i++) {
      const x = i * step;
      const value = ((timeDomainData[i] || 0) - 128) / 128;
      const y = centerY + value * centerY * this.visualParams.waveAmplitude;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  private renderLiquidWave(): void {
    const time = Date.now() * 0.001 * this.visualParams.animationSpeed;
    const audioIntensity = this.audioData
      ? this.audioData.overallVolume * this.audioMapping.volumeSensitivity
      : 0.5;

    this.ctx.beginPath();
    this.ctx.fillStyle = this.cachedThemeColors.primary;
    this.ctx.globalAlpha = 0.6 + this.visualParams.reflectionOpacity * 0.4;

    for (let x = 0; x < this.canvas.width; x += 2) {
      const wave1 =
        Math.sin(x * 0.01 + time) *
        this.visualParams.waveAmplitude *
        audioIntensity;
      const wave2 =
        Math.sin(x * 0.02 + time * 1.5) *
        this.visualParams.waveAmplitude *
        0.75 *
        audioIntensity;
      const wave3 =
        Math.sin(x * 0.005 + time * 0.5) *
        this.visualParams.waveAmplitude *
        1.25 *
        audioIntensity;
      const y = this.canvas.height / 2 + wave1 + wave2 + wave3;

      if (x === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.lineTo(0, this.canvas.height);
    this.ctx.closePath();
    this.ctx.fill();

    if (this.visualParams.reflectionOpacity > 0) {
      this.ctx.globalAlpha = this.visualParams.reflectionOpacity * 0.3;
      this.ctx.fillStyle = this.cachedThemeColors.secondary;
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  private renderMatrixRain(): void {
    const columns = Math.floor(
      this.canvas.width /
        (this.visualParams.barWidth + this.visualParams.barSpacing)
    );
    const drops: Array<{
      y: number;
      speed: number;
      intensity: number;
      char: string;
    }> = [];

    if (drops.length === 0) {
      for (let i = 0; i < columns; i++) {
        drops.push({
          y: Math.random() * this.canvas.height,
          speed: this.visualParams.particleSpeed * (0.5 + Math.random() * 0.5),
          intensity: Math.random(),
          char: String.fromCharCode(0x30a0 + Math.random() * 96),
        });
      }
    }

    const audioIntensity = this.audioData
      ? this.audioData.overallVolume * this.audioMapping.volumeSensitivity
      : 0.5;

    this.ctx.font = `${this.visualParams.particleSize * 2}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const drop = drops[i];
      const x = i * (this.visualParams.barWidth + this.visualParams.barSpacing);

      drop!.y +=
        drop!.speed * this.visualParams.animationSpeed * (1 + audioIntensity);

      if (drop!.y > this.canvas.height) {
        drop!.y = -20;
        drop!.intensity = Math.random();
        drop!.char = String.fromCharCode(0x30a0 + Math.random() * 96);
      }

      let alpha = drop!.intensity;
      if (i < drops.length * 0.3) {
        alpha *= this.audioData?.lowFrequency || 0.5;
      } else if (i < drops.length * 0.7) {
        alpha *= this.audioData?.midFrequency || 0.5;
      } else {
        alpha *= this.audioData?.highFrequency || 0.5;
      }

      if (this.visualParams.glowIntensity > 0) {
        this.ctx.shadowColor = this.cachedThemeColors.primary;
        this.ctx.shadowBlur = this.visualParams.glowIntensity * 5 * alpha;
      }

      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = this.cachedThemeColors.primary;
      this.ctx.fillText(drop!.char, x, drop!.y);

      if (this.visualParams.reflectionOpacity > 0) {
        this.ctx.globalAlpha =
          this.visualParams.reflectionOpacity * alpha * 0.3;
        this.ctx.fillStyle = this.cachedThemeColors.accent;
        this.ctx.fillText(drop!.char, x, drop!.y + 20);
      }
    }

    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1;
  }

  private renderFallbackVisualizer(): void {
    const totalBars = Math.floor(this.canvas.width / 12);
    const barWidth = 8;
    const spacing = 4;

    for (let i = 0; i < totalBars; i++) {
      const time = Date.now() * 0.001;
      const value = 0.25 + 0.2 * Math.sin(time + i * 0.1);
      const height = value * this.canvas.height * 0.6;
      const x = i * (barWidth + spacing);
      const y = this.canvas.height - height;

      this.ctx.fillStyle = this.cachedThemeColors.primary;
      this.ctx.fillRect(x, y, barWidth, height);
    }
  }

  private smoothValue(value: number, index: number): number {
    if (!this.smoothingBuffer || this.smoothingBufferSize < index + 1) {
      this.smoothingBufferSize = Math.max(
        this.smoothingBufferSize,
        index + 1,
        128
      ); 
      this.smoothingBuffer = new Float32Array(this.smoothingBufferSize);
    }

    const previousValue = this.smoothingBuffer[index] || value;

    const change = Math.abs(value - previousValue);
    const adaptiveSmoothingFactor = change > 0.3 ? 0.7 : 0.85; 

    const smoothedValue =
      previousValue * adaptiveSmoothingFactor +
      value * (1 - adaptiveSmoothingFactor);

    const compressedValue =
      change > 0.5
        ? previousValue + (value - previousValue) * 0.6 
        : smoothedValue;

    this.smoothingBuffer[index] = compressedValue;
    return compressedValue;
  }

  private applyAudioMapping(
    value: number,
    index: number,
    total: number
  ): number {
    let mappedValue = value;

    if (this.audioData) {
      if (index < total * 0.3) {
        const lowFreq = this.audioData.lowFrequency || 0.5;
        mappedValue *= lowFreq * (this.audioMapping.lowFreqSensitivity * 0.8); 
      } else if (index < total * 0.7) {
        const midFreq = this.audioData.midFrequency || 0.5;
        mappedValue *= midFreq * (this.audioMapping.midFreqSensitivity * 0.8); 
      } else {
        const highFreq = this.audioData.highFrequency || 0.5;
        mappedValue *= highFreq * (this.audioMapping.highFreqSensitivity * 0.8); 
      }

      const volumeMultiplier =
        (this.audioData.overallVolume || 0.5) *
        this.audioMapping.volumeSensitivity;

      if (volumeMultiplier < 0.1) {
        mappedValue *= volumeMultiplier * 1.5; 
      } else {
        mappedValue *= volumeMultiplier;
      }

      if (this.audioData.beatDetected) {
        const beatIntensity = this.audioData.beatIntensity || 0.5;
        const beatMultiplier =
            1 + beatIntensity * this.audioMapping.beatSensitivity * 0.6; 
        mappedValue *= beatMultiplier;
      }

      if (mappedValue > 0.7) {
        mappedValue = 0.7 + (mappedValue - 0.7) * 0.3; 
      }
    } else {
      const time = Date.now() * 0.001;
      const animationFactor = 0.9 + 0.2 * Math.sin(time + index * 0.1);
      mappedValue *= animationFactor;
    }

    mappedValue = Math.max(mappedValue, 0.1); 
    mappedValue = Math.min(mappedValue, 0.95); 
    return Math.min(1, mappedValue);
  }

  updateThemeColors(): void {
    if (!this.useThemeColors) return;

    try {
      const computedStyle = getComputedStyle(document.documentElement);
      this.cachedThemeColors = {
        primary:
          computedStyle.getPropertyValue('--mixer-visualizer-color-1').trim() ||
          '#9D72FF',
        secondary:
          computedStyle.getPropertyValue('--mixer-visualizer-color-2').trim() ||
          '#7A4FF0',
        accent:
          computedStyle.getPropertyValue('--mixer-visualizer-color-3').trim() ||
          '#B794FF',
        background:
          computedStyle.getPropertyValue('--color-background').trim() ||
          '#12101D',
      };
    } catch (error) {
      console.warn('Failed to update theme colors:', error);
      this.cachedThemeColors = {
        primary: '#9D72FF',
        secondary: '#7A4FF0',
        accent: '#B794FF',
        background: '#12101D',
      };
    }
  }

  private updatePerformanceMetrics(deltaTime: number): void {
    this.performanceMetrics.renderTime = deltaTime;
    this.performanceMetrics.cpuUsage = this.calculateCPUUsage();
    this.performanceMetrics.memoryUsage = this.calculateMemoryUsage();
  }

  private calculateCPUUsage(): number {
    return Math.min(1, this.fps / 60);
  }

  private calculateMemoryUsage(): number {
    return (performance as any).memory
      ? (performance as any).memory.usedJSHeapSize /
          (performance as any).memory.jsHeapSizeLimit
      : 0;
  }

  setAudioData(audioData: AudioData | null): void {
    this.audioData = audioData;
  }

  setVisualizerType(type: VisualizerType): void {
    this.currentType = type;
  }

  setVisualParameters(params: VisualParameters): void {
    this.visualParams = { ...this.visualParams, ...params };
  }

  setAudioMapping(mapping: AudioMapping): void {
    this.audioMapping = { ...this.audioMapping, ...mapping };
  }

  setThemeIntegration(useTheme: boolean): void {
    this.useThemeColors = useTheme;
    if (useTheme) {
      this.updateThemeColors();
    }
  }

  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  private getDefaultVisualParameters(): VisualParameters {
    return {
      primaryColor: '#9D72FF',
      secondaryColor: '#7A4FF0',
      accentColor: '#B794FF',
      backgroundColor: '#12101D',
      opacity: 1,
      saturation: 1.1,
      brightness: 1.05,
      contrast: 1.1,
      barWidth: 8,
      barSpacing: 2,
      barHeight: 1.5,
      cornerRadius: 1,
      animationSpeed: 1.2,
      decayRate: 0.85,
      bounceIntensity: 0.6,
      waveAmplitude: 80,
      waveFrequency: 1.0,
      glowIntensity: 0.5,
      blurAmount: 0,
      distortionAmount: 0,
      reflectionOpacity: 0.3,
      bloomIntensity: 0.2,
      particleCount: 150,
      particleSize: 3,
      particleSpeed: 1.2,
      particleLife: 2.5,
      particleGravity: 0.08,
    };
  }

  private getDefaultAudioMapping(): AudioMapping {
    return {
      lowFreqMapping: 'barHeight',
      midFreqMapping: 'barHeight',
      highFreqMapping: 'barHeight',
      volumeMapping: 'overallOpacity',
      beatMapping: 'colorFlash',
      lowFreqSensitivity: 1.1, 
      midFreqSensitivity: 1.0, 
      highFreqSensitivity: 0.9, 
      volumeSensitivity: 1.0, 
      beatSensitivity: 1.2, 
    };
  }
}
