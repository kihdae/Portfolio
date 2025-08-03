'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioData } from '@/types/visualizer';

interface AudioManagerReturn {
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  loadingProgress: number;
  loadingMessage: string;
  audioElement: HTMLAudioElement | null;
  audioContext: AudioContext | null;
  sourceNode: MediaElementAudioSourceNode | null;
  analyzerNode: AnalyserNode | null;
  audioData: AudioData | null;
  play: (url?: string) => Promise<void>;
  pause: () => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  seek: (time: number) => void;
  setSource: (url: string) => Promise<void>;
  getAudioData: () => AudioData;
  forceResumeAudioContext: () => Promise<void>;
  keepAlive: () => void;
  stopKeepAlive: () => void;
}

function getAudioErrorMessage(error: MediaError | null): string {
  if (!error) return 'Unknown error';

  const codes: Record<number, string> = {
    1: "MEDIA_ERR_ABORTED - The fetching of the associated resource was aborted by the user's request.",
    2: 'MEDIA_ERR_NETWORK - Some kind of network error occurred which prevented the media from being successfully fetched, despite having previously been available.',
    3: 'MEDIA_ERR_DECODE - Despite having previously been determined to be usable, an error occurred while trying to decode the media resource, resulting in an error.',
    4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - The associated resource or media provider object has been found to be unsuitable.',
  };

  return codes[error.code] || `Unknown error (code: ${error.code})`;
}

export function useAudioManager(): AudioManagerReturn {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMutedState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [audioData, setAudioData] = useState<AudioData | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyzerNodeRef = useRef<AnalyserNode | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const frequencyDataRef = useRef<Uint8Array>(new Uint8Array(1024));
  const timeDomainDataRef = useRef<Uint8Array>(new Uint8Array(1024));
  const beatHistoryRef = useRef<number[]>([]);
  const lastBeatTimeRef = useRef<number>(0);
  const beatThresholdRef = useRef<number>(0.3);

  const startLoading = useCallback((message: string = 'Loading audio...') => {
    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingMessage(message);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    let progress = 0;
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15;
      if (progress < 90) {
        setLoadingProgress(Math.min(progress, 90));
      }
    }, 200);
  }, []);

  const updateLoadingProgress = useCallback(
    (progress: number, message?: string) => {
      setLoadingProgress(progress);
      if (message) {
        setLoadingMessage(message);
      }
    },
    []
  );

  const completeLoading = useCallback(() => {
    setLoadingProgress(100);
    setLoadingMessage('Ready to play');
    setIsLoading(false);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, []);

  const failLoading = useCallback((error: string) => {
    setLoadingMessage(`Error: ${error}`);
    setIsLoading(false);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = 'auto';

      const handleLoadStart = () => {
        startLoading('Initializing audio...');
      };

      const handleProgress = () => {
        if (audio.buffered.length > 0) {
          const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
          const duration = audio.duration || 1;
          const progress = (bufferedEnd / duration) * 100;
          updateLoadingProgress(Math.min(progress, 90), 'Buffering audio...');
        }
      };

      const handleCanPlay = () => {
        updateLoadingProgress(95, 'Audio ready...');
      };

      const handleCanPlayThrough = () => {
        completeLoading();
      };
      
      const handleError = () => {
        const error = audio.error;
        const errorMessage = getAudioErrorMessage(error);
        failLoading(errorMessage);

        console.error('Audio error details:', {
          message: errorMessage,
          errorCode: error?.code,
          errorMessage: error?.message,
          currentSrc: audio.currentSrc,
          src: audio.src,
          readyState: audio.readyState,
          networkState: audio.networkState,
          paused: audio.paused,
          duration: audio.duration,
          currentTime: audio.currentTime,
          volume: audio.volume,
          muted: audio.muted,
        });
      };

      audio.addEventListener('timeupdate', () =>
        setCurrentTime(audio.currentTime)
      );
      audio.addEventListener('durationchange', () =>
        setDuration(audio.duration)
      );
      audio.addEventListener('volumechange', () =>
        setVolumeState(audio.volume)
      );
      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('progress', handleProgress);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('error', handleError);

      audioRef.current = audio;

      const initializeAudioContext = async () => {
        try {
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext ||
              (window as any).webkitAudioContext)();
            sourceNodeRef.current =
              audioContextRef.current.createMediaElementSource(audio);

            analyzerNodeRef.current = audioContextRef.current.createAnalyser();
            analyzerNodeRef.current.fftSize = 2048; 
            analyzerNodeRef.current.smoothingTimeConstant = 0.8;

            const bufferLength = analyzerNodeRef.current.frequencyBinCount;
            frequencyDataRef.current = new Uint8Array(bufferLength);
            timeDomainDataRef.current = new Uint8Array(bufferLength);

            sourceNodeRef.current.connect(analyzerNodeRef.current);
            analyzerNodeRef.current.connect(
              audioContextRef.current.destination
            );

          }
        } catch (error) {
          console.warn('Could not initialize AudioContext immediately:', error);
        }
      };

      const initializeOnInteraction = () => {
        initializeAudioContext();
        document.removeEventListener('click', initializeOnInteraction);
        document.removeEventListener('keydown', initializeOnInteraction);
        document.removeEventListener('touchstart', initializeOnInteraction);
      };

      document.addEventListener('click', initializeOnInteraction, {
        once: true,
      });
      document.addEventListener('keydown', initializeOnInteraction, {
        once: true,
      });
      document.addEventListener('touchstart', initializeOnInteraction, {
        once: true,
      });

      const timeoutId = setTimeout(initializeAudioContext, 2000);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', initializeOnInteraction);
        document.removeEventListener('keydown', initializeOnInteraction);
        document.removeEventListener('touchstart', initializeOnInteraction);
        audio.removeEventListener('timeupdate', () =>
          setCurrentTime(audio.currentTime)
        );
        audio.removeEventListener('durationchange', () =>
          setDuration(audio.duration)
        );
        audio.removeEventListener('volumechange', () =>
          setVolumeState(audio.volume)
        );
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('progress', handleProgress);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('canplaythrough', handleCanPlayThrough);
        audio.removeEventListener('error', handleError);
      };
    } return;
  }, [startLoading, updateLoadingProgress, completeLoading, failLoading]);

  const calculateLowFrequency = useCallback((): number => {
    const frequencyData = frequencyDataRef.current;
    const lowFreqStart = 0;
    const lowFreqEnd = Math.floor(frequencyData.length * 0.1); 

    let sum = 0;
    for (let i = lowFreqStart; i < lowFreqEnd; i++) {
      sum += frequencyData[i] || 0;
    }

    return sum / (lowFreqEnd - lowFreqStart) / 255;
  }, []);

  const calculateMidFrequency = useCallback((): number => {
    const frequencyData = frequencyDataRef.current;
    const midFreqStart = Math.floor(frequencyData.length * 0.1);
      const midFreqEnd = Math.floor(frequencyData.length * 0.5); 

    let sum = 0;
    for (let i = midFreqStart; i < midFreqEnd; i++) {
      sum += frequencyData[i] || 0;
    }

    return sum / (midFreqEnd - midFreqStart) / 255;
  }, []);

  const calculateHighFrequency = useCallback((): number => {
    const frequencyData = frequencyDataRef.current;
    const highFreqStart = Math.floor(frequencyData.length * 0.5);
    const highFreqEnd = frequencyData.length; 

    let sum = 0;
    for (let i = highFreqStart; i < highFreqEnd; i++) {
      sum += frequencyData[i] || 0;
    }

    return sum / (highFreqEnd - highFreqStart) / 255;
  }, []);

  const calculateOverallVolume = useCallback((): number => {
    const timeDomainData = timeDomainDataRef.current;
    let sum = 0;
    for (let i = 0; i < timeDomainData.length; i++) {
      const sample = ((timeDomainData[i] || 0) - 128) / 128;
      sum += sample * sample;
    }

    const rms = Math.sqrt(sum / timeDomainData.length);
    return Math.min(rms * 2, 1); 
  }, []);

  const detectBeat = useCallback((volume: number): boolean => {
    const now = Date.now();
    const timeSinceLastBeat = now - lastBeatTimeRef.current;

    if (timeSinceLastBeat < 200) return false;

    beatHistoryRef.current.push(volume);
    if (beatHistoryRef.current.length > 10) {
      beatHistoryRef.current.shift();
    }

    const avgVolume =
      beatHistoryRef.current.reduce((a, b) => a + b, 0) /
      beatHistoryRef.current.length;

    if (volume > avgVolume * (1 + beatThresholdRef.current)) {
      lastBeatTimeRef.current = now;
      return true;
    }

    return false;
  }, []);

  const calculateBeatIntensity = useCallback((): number => {
    if (beatHistoryRef.current.length === 0) return 0;

    const currentVolume =
      beatHistoryRef.current[beatHistoryRef.current.length - 1] || 0;
    const avgVolume =
      beatHistoryRef.current.reduce((a, b) => a + b, 0) /
      beatHistoryRef.current.length;

    return Math.max(0, (currentVolume - avgVolume) / avgVolume);
  }, []);

  const calculateSpectralCentroid = useCallback((): number => {
    const frequencyData = frequencyDataRef.current;
    if (!audioContextRef.current) return 0;

    let weightedSum = 0;
    let sum = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      const frequency =
        (i * audioContextRef.current.sampleRate) / (2 * frequencyData.length);
      const magnitude = (frequencyData[i] || 0) / 255;

      weightedSum += frequency * magnitude;
      sum += magnitude;
    }

    return sum > 0
      ? weightedSum / sum / (audioContextRef.current.sampleRate / 2)
      : 0;
  }, []);

  const calculateSpectralRolloff = useCallback((): number => {
    const frequencyData = frequencyDataRef.current;
    const threshold = 0.85;
    let cumulativeEnergy = 0;
    let totalEnergy = 0;


    for (let i = 0; i < frequencyData.length; i++) {
      totalEnergy += (frequencyData[i] || 0) / 255;
    }


    for (let i = 0; i < frequencyData.length; i++) {
      cumulativeEnergy += (frequencyData[i] || 0) / 255;
      if (cumulativeEnergy >= totalEnergy * threshold) {
        return i / frequencyData.length;
      }
    }

    return 1;
  }, []);

  const updateAudioData = useCallback(() => {
    if (!analyzerNodeRef.current) return;

    analyzerNodeRef.current.getByteFrequencyData(frequencyDataRef.current);
    analyzerNodeRef.current.getByteTimeDomainData(timeDomainDataRef.current);

    const lowFreq = calculateLowFrequency();
    const midFreq = calculateMidFrequency();
    const highFreq = calculateHighFrequency();
    const overallVolume = calculateOverallVolume();
    const beatDetected = detectBeat(overallVolume);
    const beatIntensity = calculateBeatIntensity();
    const spectralCentroid = calculateSpectralCentroid();
    const spectralRolloff = calculateSpectralRolloff();

    const newAudioData: AudioData = {
      frequencyData: frequencyDataRef.current,
      timeDomainData: timeDomainDataRef.current,
      lowFrequency: lowFreq,
      midFrequency: midFreq,
      highFrequency: highFreq,
      overallVolume: overallVolume,
      beatDetected: beatDetected,
      beatIntensity: beatIntensity,
      spectralCentroid: spectralCentroid,
      spectralRolloff: spectralRolloff,
    };

    setAudioData(newAudioData);
  }, [
    calculateLowFrequency,
    calculateMidFrequency,
    calculateHighFrequency,
    calculateOverallVolume,
    detectBeat,
    calculateBeatIntensity,
    calculateSpectralCentroid,
    calculateSpectralRolloff,
  ]);

  useEffect(() => {
    let isActive = true;

    const updateLoop = () => {
      if (!isActive) return;

      try {
        updateAudioData();
      } catch (error) {
      }

      if (isActive) {
        requestAnimationFrame(updateLoop);
      }
    };

    updateLoop();

    return () => {
      isActive = false;
    };
  }, [updateAudioData]);


  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current.load();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }


      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
    };
  }, []);

  const setSource = useCallback(
    async (url: string) => {
      if (!audioRef.current || url === currentUrlRef.current) return;

      try {
        startLoading('Loading new audio...');


        audioRef.current.pause();
        audioRef.current.currentTime = 0;


        currentUrlRef.current = url;


        audioRef.current.src = url;


        audioRef.current.load();

        return new Promise<void>((resolve, reject) => {
          if (!audioRef.current) return reject(new Error('No audio element'));


          loadingTimeoutRef.current = setTimeout(() => {
            audioRef.current?.removeEventListener(
              'canplaythrough',
              handleCanPlayThrough
            );
            audioRef.current?.removeEventListener('error', handleError);
            failLoading('Audio loading timeout');
            reject(new Error('Audio loading timeout'));
          }, 15000); 

          const handleCanPlayThrough = () => {
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
            }
            audioRef.current?.removeEventListener(
              'canplaythrough',
              handleCanPlayThrough
            );
            audioRef.current?.removeEventListener('error', handleError);
            completeLoading();
            resolve();
          };

          const handleError = () => {
            if (loadingTimeoutRef.current) {
              clearTimeout(loadingTimeoutRef.current);
              loadingTimeoutRef.current = null;
            }
            audioRef.current?.removeEventListener(
              'canplaythrough',
              handleCanPlayThrough
            );
            audioRef.current?.removeEventListener('error', handleError);
            const errorMessage = getAudioErrorMessage(
              audioRef.current?.error || null
            );
            failLoading(errorMessage);
            reject(new Error(errorMessage));
          };

          audioRef.current.addEventListener(
            'canplaythrough',
            handleCanPlayThrough,
            { once: true }
          );
          audioRef.current.addEventListener('error', handleError, {
            once: true,
          });
        });
      } catch (error) {
        failLoading('Failed to set audio source');
        throw error;
      }
    },
    [startLoading, completeLoading, failLoading]
  );

  const play = useCallback(
    async (url?: string) => {
      if (!audioRef.current) return;

      try {


        if (url) {
          await setSource(url);
        }


        if (!audioRef.current.src) {
          throw new Error('No audio source set');
        }


        if (!audioContextRef.current) {
          console.warn(
            'AudioContext not initialized, attempting to initialize now'
          );
          startLoading('Initializing audio context...');

          audioContextRef.current = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          sourceNodeRef.current =
            audioContextRef.current.createMediaElementSource(audioRef.current);


          analyzerNodeRef.current = audioContextRef.current.createAnalyser();
          analyzerNodeRef.current.fftSize = 2048;
          analyzerNodeRef.current.smoothingTimeConstant = 0.8;


          const bufferLength = analyzerNodeRef.current.frequencyBinCount;
          frequencyDataRef.current = new Uint8Array(bufferLength);
          timeDomainDataRef.current = new Uint8Array(bufferLength);


          sourceNodeRef.current.connect(analyzerNodeRef.current);
          analyzerNodeRef.current.connect(audioContextRef.current.destination);

          updateLoadingProgress(50, 'Audio context ready...');
        }


        if (audioContextRef.current.state === 'suspended') {
          updateLoadingProgress(75, 'Resuming audio context...');
          await audioContextRef.current.resume();
        }


        if (audioRef.current.paused) {
          updateLoadingProgress(90, 'Starting playback...');
          await audioRef.current.play();
          completeLoading();
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log(
            'Playback was interrupted, this is normal during track changes'
          );
        } else {
          failLoading('Playback failed');
          throw error;
        }
      }
    },
    [
      setSource,
      startLoading,
      completeLoading,
      failLoading,
      updateLoadingProgress,
    ]
  );

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current && newVolume >= 0 && newVolume <= 1) {
      audioRef.current.volume = newVolume;
      setVolumeState(newVolume);


      if (newVolume > 0 && audioRef.current.muted) {
        audioRef.current.muted = false;
        setIsMutedState(false);
      }
    }
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
      setIsMutedState(muted);
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current && !isNaN(time) && time >= 0) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const forceResumeAudioContext = useCallback(async () => {
    if (
      !audioContextRef.current ||
      audioContextRef.current.state !== 'suspended'
    ) {
      return;
    }
    try {
      await audioContextRef.current.resume();
    } catch (error) {
    }
  }, []);

  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const keepAlive = useCallback(() => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
    }

    keepAliveIntervalRef.current = setInterval(async () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state === 'suspended'
      ) {
        try {
          await audioContextRef.current.resume(); 
        } catch (error) { 
        }
      }
      }, 500); 
  }, []);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  }, []);

  const getAudioData = useCallback((): AudioData => {
    if (!audioData) {
      return {
        frequencyData: new Uint8Array(1024),
        timeDomainData: new Uint8Array(1024),
        lowFrequency: 0,
        midFrequency: 0,
        highFrequency: 0,
        overallVolume: 0,
        beatDetected: false,
        beatIntensity: 0,
        spectralCentroid: 0,
        spectralRolloff: 0,
      };
    }
    return audioData;
  }, [audioData]);

  return {
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    loadingProgress,
    loadingMessage,
    audioElement: audioRef.current,
    audioContext: audioContextRef.current,
    sourceNode: sourceNodeRef.current,
    analyzerNode: analyzerNodeRef.current,
    audioData,
    play,
    pause,
    setVolume,
    setMuted,
    seek,
    setSource,
    getAudioData,
    forceResumeAudioContext,
    keepAlive,
    stopKeepAlive,
  };
}
