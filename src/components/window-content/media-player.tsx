'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useVolume } from '@/contexts/VolumeContext';
import { useTheme } from '@/contexts/ThemeContext';
import DynamicVisualizer from './DynamicVisualizer';
import DynamicMixerSettings from './DynamicMixerSettings';
import AudioLoadingIndicator from './AudioLoadingIndicator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronDown,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Settings,
} from 'lucide-react';
import { AnimatedTrackInfo } from './AnimatedTrackInfo';
import VolumeControl from '@/components/ui/VolumeControl';
import { PlayerToggle } from '@/components/ui/player-toggle';
import '@/styles/components/volume-control.css';
import '@/styles/components/player-toggle.css';
import {
  defaultPresets,
  getPerfectPresetForType,
} from '@/lib/visualizerPresets';
import {
  VisualizerType,
  VisualParameters,
  AudioMapping,
  VisualizerPreset,
  PerformanceMetrics,
} from '@/types/visualizer';

interface Track {
  title: string;
  artist: string;
  duration: string;
  url: string;
  albumArt?: string | null;
}

interface Playlist {
  name: string;
  tracks: Track[];
}

const defaultPlaylists: Record<string, Playlist> = {
  CodeNation: {
    name: 'CodeNation',
    tracks: [],
  },
  Jazz: {
    name: 'Jazz',
    tracks: [],
  },
};
  
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

interface SpotifyPlayerProps {
  onMinimize?: () => void;
  onClose?: () => void;
  minimized?: boolean;
}

export default function SpotifyPlayer({
  onMinimize,
  onClose,
  minimized = false,
}: SpotifyPlayerProps) {
  const { theme } = useTheme();
  const {
    volume: contextVolume,
    isMuted: contextIsMuted,
    toggleMute,
    setVolume: setContextVolume,
  } = useVolume();
  const audioManager = useAudioManager();

  useEffect(() => {
    if (
      minimized &&
      audioManager.audioContext &&
      audioManager.audioContext.state === 'suspended'
    ) {
      console.log('Player minimized, forcing audio context resume');
      audioManager.forceResumeAudioContext();
    }
  }, [minimized, audioManager]);

  const [playlistsLoaded, setPlaylistsLoaded] = useState(false);
  const [playlists, setPlaylists] =
    useState<Record<string, Playlist>>(defaultPlaylists);
  const {
    currentTime,
    duration,
    volume: audioVolume,
    isMuted: audioIsMuted,
    isLoading,
    loadingProgress,
    loadingMessage,
    audioElement,
    audioContext,
    sourceNode,
    play,
    pause,
    setVolume: setAudioVolume,
    setMuted: setAudioMuted,
    setSource,
    audioData,
    seek,
  } = useAudioManager();

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPlaylist, setCurrentPlaylist] = useState<string>('CodeNation');
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [playQueue, setPlayQueue] = useState<number[]>([]);
  const [isChangingPlaylist, setIsChangingPlaylist] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [showMixerSettings, setShowMixerSettings] = useState(false);
  const [visualizerType, setVisualizerType] =
    useState<VisualizerType>('spectrum-circle');
  const [visualParams, setVisualParams] = useState<VisualParameters>({
    primaryColor: 'var(--color-accent-primary)',
    secondaryColor: 'var(--color-accent-secondary)',
    accentColor: 'var(--color-text-secondary)',
    backgroundColor: '#0D0D0D',
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
  });

  const [audioMapping, setAudioMapping] = useState<AudioMapping>({
    lowFreqMapping: 'barHeight',
    midFreqMapping: 'barHeight',
    highFreqMapping: 'barHeight',
    volumeMapping: 'overallOpacity',
    beatMapping: 'colorFlash',
    lowFreqSensitivity: 1.4,
    midFreqSensitivity: 1.2,
    highFreqSensitivity: 1.0,
    volumeSensitivity: 1.3,
    beatSensitivity: 2.0,
  });

  const [performanceMetrics, setPerformanceMetrics] =
    useState<PerformanceMetrics>({
      fps: 60,
      cpuUsage: 0,
      memoryUsage: 0,
      renderTime: 0,
      audioLatency: 0,
    });

  const [savedPresets, setSavedPresets] =
    useState<VisualizerPreset[]>(defaultPresets);
  const [currentPreset, setCurrentPreset] = useState<VisualizerPreset | null>(
    defaultPresets[0]
  );
  const [visualizerInitialized, setVisualizerInitialized] = useState(false);

  const loadPerfectPreset = useCallback((type: VisualizerType) => {
    const perfectPreset = getPerfectPresetForType(type);
    if (perfectPreset) {
      setVisualParams(perfectPreset.visualParameters);
      setAudioMapping(perfectPreset.audioMapping);
      setCurrentPreset(perfectPreset);
      console.log(`Loaded perfect preset for ${type}:`, perfectPreset.name);
    }
  }, []);

  const handleVisualizerTypeChange = useCallback((type: VisualizerType) => {
    const perfectPreset = getPerfectPresetForType(type);
    if (perfectPreset) {
      setVisualParams(perfectPreset.visualParameters);
      setAudioMapping(perfectPreset.audioMapping);
      setCurrentPreset(perfectPreset);
      console.log(`Loaded perfect preset for ${type}:`, perfectPreset.name);
    }
  }, []);

  const initializeVisualizer = useCallback(() => {
    const defaultPreset = defaultPresets[0];
    if (defaultPreset) {
      setVisualizerType(defaultPreset.visualizerType);
      setVisualParams(defaultPreset.visualParameters);
      setAudioMapping(defaultPreset.audioMapping);
      setCurrentPreset(defaultPreset);
      setVisualizerInitialized(true);
      console.log(
        'Visualizer initialized with default preset:',
        defaultPreset.name
      );
    }
  }, []);

  useEffect(() => {
    initializeVisualizer();
  }, [initializeVisualizer]);

  useEffect(() => {
    if (!audioContext || !audioElement) return;
    if (minimized) {
      if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {});
      }
    } else {
    }
  }, [minimized, audioContext, audioElement]);

  useEffect(() => {
    if (minimized) {
      audioManager.keepAlive();
    } else {
      audioManager.stopKeepAlive();
    }
    return () => {
      audioManager.stopKeepAlive();
    };
  }, [minimized, audioManager]);

  useEffect(() => {
    if (!minimized || !audioManager.audioElement) return;

    const audioElement = audioManager.audioElement;

    const handlePause = (e: Event) => {
      if (isPlaying) {
        console.log('Preventing pause in minimized state');
        e.preventDefault();
        audioElement.play().catch(console.error);
      }
    };

    audioElement.addEventListener('pause', handlePause);

    return () => {
      audioElement.removeEventListener('pause', handlePause);
    };
  }, [minimized, audioManager.audioElement, isPlaying]);

  const currentPlaylistData = playlists[currentPlaylist];
  const currentTrack = currentPlaylistData?.tracks[currentTrackIndex];

  useEffect(() => {
    const loadTracks = async () => {
      try {
        const codeNationResponse = await fetch('/audio/codeNation/tracks.json');
        if (!codeNationResponse.ok) {
          throw new Error('Failed to load CodeNation tracks');
        }
        const codeNationTracksData = await codeNationResponse.json();

        const jazzResponse = await fetch('/audio/jazzAW/tracks.json');
        if (!jazzResponse.ok) {
          throw new Error('Failed to load Jazz tracks');
        }
        const jazzTracksData = await jazzResponse.json();

        const formattedCodeNationTracks = codeNationTracksData.map(
          (track: any) => ({
            title: track.title,
            artist: track.artist,
            duration: formatTime(track.duration),
            url: `/audio/codeNation/${track.newName}`,
            albumArt: track.albumArt
              ? `/audio/codeNation/${track.albumArt}`
              : null,
          })
        );

        const formattedJazzTracks = jazzTracksData.map((track: any) => ({
          title: track.title,
          artist: track.artist,
          duration: formatTime(track.duration),
          url: `/audio/jazzAW/${track.newName}`,
          albumArt: track.albumArt ? `/audio/jazzAW/${track.albumArt}` : null,
        }));

        setPlaylists(prev => ({
          ...prev,
          CodeNation: {
            ...prev.CodeNation,
            tracks: formattedCodeNationTracks,
          },
          Jazz: {
            ...prev.Jazz,
            tracks: formattedJazzTracks,
          },
        }));
        setPlaylistsLoaded(true);

        const currentTracks =
          currentPlaylist === 'Jazz'
            ? formattedJazzTracks
            : formattedCodeNationTracks;
        if (currentTracks[0]) {
          setSource(currentTracks[0].url).catch(error => {
            console.error('Error preloading first track:', error);
            setError('Failed to load audio file');
          });
        }
      } catch (error) {
        console.error('Error loading tracks:', error);
        setError('Failed to load playlist');
      }
    };

    loadTracks();
  }, [setSource, currentPlaylist]);

  useEffect(() => {
    if (!audioElement) return;

    const handlePlay = () => {
      setIsPlaying(true);
      if (!visualizerInitialized) {
        initializeVisualizer();
      }
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (isShuffled && playQueue.length > 0) {
        const nextIndex = playQueue[0];
        setPlayQueue(playQueue.slice(1));
        setTimeout(() => {
          if (currentPlaylistData.tracks[nextIndex]) {
            setCurrentTrackIndex(nextIndex);
            setSource(currentPlaylistData.tracks[nextIndex].url).then(() =>
              play()
            );
          }
        }, 100);
      } else if (currentTrackIndex < currentPlaylistData.tracks.length - 1) {
        setTimeout(() => {
          setCurrentTrackIndex(currentTrackIndex + 1);
          setSource(currentPlaylistData.tracks[currentTrackIndex + 1].url).then(
            () => play()
          );
        }, 100);
      } else {
        setTimeout(() => {
          setCurrentTrackIndex(0);
          setSource(currentPlaylistData.tracks[0].url).then(() => play());
        }, 100);
      }
    };
    const handleError = () => {
      setError('Audio playback error');
      setIsPlaying(false);
    };

    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);

    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
    };
  }, [
    audioElement,
    initializeVisualizer,
    visualizerInitialized,
    isShuffled,
    playQueue,
    currentTrackIndex,
    currentPlaylistData,
    setSource,
    play,
  ]);

  const handlePlayPause = useCallback(
    async (trackIndex: number = currentTrackIndex) => {
      try {
        setError(null); // Clear any previous errors
        console.log('handlePlayPause called:', {
          trackIndex,
          currentTrackIndex,
          isPlaying,
        });

        if (trackIndex !== currentTrackIndex) {
          console.log('Switching to new track:', trackIndex);
          setCurrentTrackIndex(trackIndex);
          const track = currentPlaylistData.tracks[trackIndex];
          console.log('Loading track:', track.title, track.url);

          // Set loading state immediately
          console.log('Setting audio source...');
          await setSource(track.url);

          // Auto-initialize visualizer when switching to a new track (always re-initialize for new track)
          console.log('Initializing visualizer...');
          initializeVisualizer();

          console.log('Starting playback...');
          await play();
          console.log('Playback started successfully');
        } else {
          if (isPlaying) {
            console.log('Pausing playback...');
            pause();
          } else {
            console.log('Resuming playback...');
            await play();
          }
        }
      } catch (err) {
        console.error('Playback error:', err);
        setError(err instanceof Error ? err.message : 'Playback error');
      }
    },
    [
      currentTrackIndex,
      currentPlaylistData,
      isPlaying,
      play,
      pause,
      setSource,
      initializeVisualizer,
    ]
  );

  const handlePlaylistChange = useCallback(
    async (newPlaylist: string) => {
      if (newPlaylist === currentPlaylist) return;

      console.log('Changing playlist from', currentPlaylist, 'to', newPlaylist);
      setIsChangingPlaylist(true);
      pause();

      await new Promise(resolve => setTimeout(resolve, 300));

      setCurrentPlaylist(newPlaylist);
      setCurrentTrackIndex(0);
      setPlayQueue([]);
      setIsShuffled(false);
      setError(null);

      // Auto-initialize visualizer when playlist changes (always re-initialize for new context)
      console.log('Initializing visualizer for new playlist...');
      initializeVisualizer();

      const newPlaylistData = playlists[newPlaylist];

      if (!newPlaylistData || newPlaylistData.tracks.length === 0) {
        console.warn(`Playlist "${newPlaylist}" is empty or not found.`);
        await setSource('');
      } else {
        const firstTrack = newPlaylistData.tracks[0];
        console.log(
          'Loading first track of new playlist:',
          firstTrack.title,
          firstTrack.url
        );
        try {
          await setSource(firstTrack.url);
          console.log('First track loaded successfully');
        } catch (error) {
          console.error('Error loading first track of new playlist:', error);
          setError('Failed to load audio for the new playlist.');
        }
      }

      setIsChangingPlaylist(false);
      console.log('Playlist change completed');
    },
    [playlists, setSource, pause, currentPlaylist, initializeVisualizer]
  );

  const handleShuffle = useCallback(
    (pressed: boolean) => {
      if (pressed) {
        const shuffled = [...Array(currentPlaylistData.tracks.length).keys()]
          .filter(i => i !== currentTrackIndex)
          .sort(() => Math.random() - 0.5);
        setPlayQueue(shuffled);
        setIsShuffled(true);
      } else {
        setIsShuffled(false);
        setPlayQueue([]);
      }
    },
    [currentPlaylistData, currentTrackIndex]
  );

  const handleNext = useCallback(() => {
    if (isShuffled && playQueue.length > 0) {
      const nextIndex = playQueue[0];
      setPlayQueue(playQueue.slice(1));
      handlePlayPause(nextIndex);
    } else if (currentTrackIndex < currentPlaylistData.tracks.length - 1) {
      handlePlayPause(currentTrackIndex + 1);
    } else {
      handlePlayPause(0);
    }
  }, [
    isShuffled,
    playQueue,
    currentTrackIndex,
    currentPlaylistData,
    handlePlayPause,
  ]);

  const handlePrevious = useCallback(() => {
    if (currentTrackIndex > 0) {
      handlePlayPause(currentTrackIndex - 1);
    } else {
      handlePlayPause(currentPlaylistData.tracks.length - 1);
    }
  }, [currentTrackIndex, currentPlaylistData, handlePlayPause]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      seek(newTime);
    },
    [duration, seek]
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        !document.hidden &&
        audioContext &&
        audioContext.state === 'suspended'
      ) {
        audioContext.resume().catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [audioContext]);

  useEffect(() => {
    const audioVolumeValue = contextVolume / 100;
    setAudioVolume(audioVolumeValue);

    if (audioVolumeValue < 0.1) {
      setVisualParams(prev => ({
        ...prev,
        barHeight: Math.max(prev.barHeight, 0.5),
        glowIntensity: Math.max(prev.glowIntensity, 0.3),
      }));
    }
  }, [contextVolume, setAudioVolume]);

  useEffect(() => {
    setAudioMuted(contextIsMuted);
  }, [contextIsMuted, setAudioMuted]);

  const savePreset = useCallback(() => {
    const preset: VisualizerPreset = {
      id: Date.now().toString(),
      name: `Preset ${savedPresets.length + 1}`,
      description: 'Custom visualizer preset',
      category: 'custom',
      visualizerType,
      visualParameters: visualParams,
      audioMapping,
      createdAt: new Date(),
    };

    setSavedPresets(prev => [...prev, preset]);
    setCurrentPreset(preset);
  }, [visualizerType, visualParams, audioMapping, savedPresets.length]);

  const loadPreset = useCallback((preset: VisualizerPreset) => {
    setVisualizerType(preset.visualizerType);
    setVisualParams(preset.visualParameters);
    setAudioMapping(preset.audioMapping);
    setCurrentPreset(preset);
  }, []);

  const deletePreset = useCallback(
    (presetId: string) => {
      setSavedPresets(prev => prev.filter(p => p.id !== presetId));
      if (currentPreset?.id === presetId) {
        setCurrentPreset(null);
      }
    },
    [currentPreset]
  );

  useEffect(() => {
    if (!currentPreset) return;

    setVisualizerType(currentPreset.visualizerType);
    setVisualParams(currentPreset.visualParameters);
    setAudioMapping(currentPreset.audioMapping);
  }, [currentPreset]);

  const getCurrentTrackInfo = () => {
    if (!currentTrack)
      return {
        title: 'Playlist Empty',
        artist: 'Select another playlist',
        albumArt: '',
      };

    return {
      title: currentTrack.title,
      artist: currentTrack.artist,
      albumArt: currentTrack.albumArt || '/assets/spotify-player.jpg',
    };
  };

  const trackInfo = getCurrentTrackInfo();

  const renderContent = () => {
    if (!playlistsLoaded) {
      return (
        <div className='w-full h-full flex flex-col'>
          <div className='window-header flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-primary)]/90 backdrop-blur-sm'>
            <span className='font-medium text-[var(--color-text-primary)]'>
              Music Player
            </span>
            <span className='text-[var(--color-text-secondary)]'>
              Loading...
            </span>
          </div>
          <div className='flex-1 flex items-center justify-center p-8'>
            <div className='text-center'>
              <div className='w-8 h-8 mx-auto mb-4 border-4 border-[var(--color-border)] border-t-[var(--color-accent-primary)] rounded-full animate-spin'></div>
              <div className='text-[var(--color-text-primary)]'>
                Loading playlist...
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='w-full h-full flex flex-col'>
          <div className='window-header flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-primary)]/90 backdrop-blur-sm'>
            <span className='font-medium text-[var(--color-text-primary)]'>
              Music Player
            </span>
            <span className='text-[var(--color-text-secondary)]'>
              Audio Error
            </span>
          </div>
          <div className='flex-1 flex items-center justify-center p-8'>
            <div className='text-center'>
              <div className='text-[var(--color-text-primary)] text-xl mb-4'>
                Audio Playback Error
              </div>
              <div className='text-[var(--color-text-secondary)] mb-4'>
                {error}
              </div>
              <button
                className='px-4 py-2 bg-[var(--color-accent-primary)] text-[var(--color-background-primary)] rounded hover:opacity-90 transition-opacity'
                onClick={() => {
                  setError(null);
                  window.location.reload();
                }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className='w-full h-full flex flex-col relative overflow-hidden font-sans bg-[var(--color-background-primary)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-border)]'
      >
        <div className='absolute inset-0 z-0 opacity-50'>
          <img
            src={trackInfo.albumArt}
            alt='Background'
            className='w-full h-full object-cover opacity-20 blur-2xl'
            draggable={false}
            onDragStart={e => e.preventDefault()}
          />
          <div className='absolute inset-0 bg-[var(--color-background-primary)]/60'></div>
        </div>

        <div className='relative z-10 w-full h-full flex flex-col'>
          <div className='window-header flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-surface-primary)]/90 backdrop-blur-sm'>
            <div className='flex items-center gap-4'>
              <h2
                className='text-xl font-bold text-[var(--color-text-primary)] tracking-wide'
                draggable={false}
                onDragStart={e => e.preventDefault()}
              >
                MUSIC PLAYER
              </h2>
              <div className='flex items-center gap-2'>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className='flex items-center gap-2 px-3 py-1.5 bg-[var(--color-surface-primary)]/50 hover:bg-[var(--color-interactive-hover)] rounded-md transition-all duration-200 border border-[var(--color-border)]'>
                    <span
                      className='text-sm font-medium text-[var(--color-text-primary)]'
                      draggable={false}
                      onDragStart={e => e.preventDefault()}
                    >
                      {currentPlaylist}
                    </span>
                    <ChevronDown className='w-4 h-4 text-[var(--color-text-secondary)]' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='min-w-[250px] border border-[var(--color-border)] bg-[var(--color-surface-primary)]/90 backdrop-blur-xl text-[var(--color-text-primary)]'>
                    {Object.keys(playlists).map((playlistName: string) => (
                      <DropdownMenuItem
                        key={playlistName}
                        className='cursor-pointer p-3 hover:bg-[var(--color-interactive-hover)] transition-colors'
                        onClick={() => handlePlaylistChange(playlistName)}
                      >
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-md overflow-hidden flex items-center justify-center'>
                            <img
                              src={
                                playlistName === 'CodeNation'
                                  ? '/assets/CodeNation-optimized.gif'
                                  : '/assets/meme.jpg'
                              }
                              alt={playlistName}
                              className='w-full h-full object-cover'
                              draggable={false}
                              onDragStart={e => e.preventDefault()}
                            />
                          </div>
                          <div>
                            <div
                              className='text-sm font-medium font-serif text-[var(--color-text-primary)]'
                              draggable={false}
                              onDragStart={e => e.preventDefault()}
                            >
                              {playlistName}
                            </div>
                            <div
                              className='text-xs text-[var(--color-text-secondary)]'
                              draggable={false}
                              onDragStart={e => e.preventDefault()}
                            >
                              {playlists[playlistName]?.tracks.length || 0}{' '}
                              tracks
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className='flex-1 flex p-6 gap-6 overflow-hidden'>
            <div
              className={`w-2/5 flex flex-col transition-opacity duration-300 ${isChangingPlaylist ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className='w-full aspect-square mb-6 overflow-hidden rounded-lg shadow-2xl shadow-black/50'>
                <img
                  src={trackInfo.albumArt || '/placeholder.svg'}
                  alt='Album Art'
                  className='w-full h-full object-cover'
                  draggable={false}
                  onDragStart={e => e.preventDefault()}
                />
              </div>

              <div
                className='text-2xl font-bold mb-2 text-[var(--color-text-primary)] font-serif'
                draggable={false}
                onDragStart={e => e.preventDefault()}
              >
                {trackInfo.title}
              </div>

              <div
                className='text-lg mb-4 text-[var(--color-text-secondary)]'
                draggable={false}
                onDragStart={e => e.preventDefault()}
              >
                {trackInfo.artist}
              </div>

              <div className='text-sm text-[var(--color-text-secondary)] mb-4'>
                Total tracks: {currentPlaylistData?.tracks.length || 0}
              </div>

              <div
                className='text-[var(--color-text-secondary)] text-sm leading-relaxed'
                draggable={false}
                onDragStart={e => e.preventDefault()}
              >
                {currentPlaylist === 'CodeNation'
                  ? "CodeNation was the name of my first fellowship/internship program, these compiled songs are apart of a variety of discography. They all have in some way aided in my creation of this project, I share with you something deeply meaningful to me, music, society pays great dues to music. I hope you'll stop for a sec and check out a couple of these songs, and if not, thank you for reading anyways."
                  : 'A curated collection of jazz classics featuring legendary artists like Bill Evans, Chet Baker, Duke Ellington, and more. These timeless pieces represent the rich history and emotional depth of jazz music, from smooth ballads to energetic improvisations.'}
              </div>
            </div>

            <div className='w-3/5 flex flex-col'>
              <div
                className='flex-1 min-h-[500px] mb-6 relative border border-[var(--color-border)] rounded-lg overflow-hidden visualizer-container'
                style={{
                  flexShrink: 0,
                  flexGrow: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div className='w-full h-full relative'>
                  <DynamicVisualizer
                    isPlaying={isPlaying}
                    volume={audioVolume}
                    audioElement={audioElement}
                    audioContext={audioContext}
                    sourceNode={sourceNode}
                    audioData={audioData}
                    visualizerType={visualizerType}
                    visualParams={visualParams}
                    audioMapping={audioMapping}
                  />

                  <button
                    onClick={() => setShowMixerSettings(true)}
                    className='absolute top-3 right-3 p-2 bg-[var(--color-surface-primary)]/80 hover:bg-[var(--color-interactive-hover)] rounded-lg transition-colors border border-[var(--color-border)] shadow-lg z-10'
                    title='Mixer Settings'
                  >
                    <Settings className='w-4 h-4 text-[var(--color-text-primary)]' />
                  </button>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 mb-4 transition-opacity duration-300 ${isChangingPlaylist ? 'opacity-0' : 'opacity-100'}`}
              >
                <div className='w-2 h-2 bg-[var(--color-accent-primary)] rounded-full animate-pulse'></div>
                <AnimatedTrackInfo
                  title={trackInfo.title}
                  artist={trackInfo.artist}
                  isPlaying={isPlaying}
                />
              </div>

              <div className='flex items-center justify-center gap-4 mb-4 controls'>
                <button
                  className='w-10 h-10 flex items-center justify-center bg-[var(--color-surface-primary)]/50 hover:bg-[var(--color-interactive-hover)] rounded-full transition-colors'
                  onClick={handlePrevious}
                >
                  <SkipBack className='w-4 h-4 text-[var(--color-text-primary)]' />
                </button>

                <button
                  className='w-12 h-12 flex items-center justify-center bg-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/80 rounded-full transition-colors shadow-lg'
                  onClick={() => handlePlayPause()}
                  disabled={isLoading || !currentTrack}
                >
                  {isLoading ? (
                    <div className='w-6 h-6 border-2 border-[var(--color-background-primary)] border-t-transparent rounded-full animate-spin'></div>
                  ) : isPlaying ? (
                    <Pause className='w-6 h-6 text-[var(--color-background-primary)]' />
                  ) : (
                    <Play className='w-6 h-6 ml-1 text-[var(--color-background-primary)]' />
                  )}
                </button>

                <button
                  className='w-10 h-10 flex items-center justify-center bg-[var(--color-surface-primary)]/50 hover:bg-[var(--color-interactive-hover)] rounded-full transition-colors'
                  onClick={handleNext}
                >
                  <SkipForward className='w-4 h-4 text-[var(--color-text-primary)]' />
                </button>

                <PlayerToggle
                  pressed={isShuffled}
                  onPressedChange={handleShuffle}
                  title={isShuffled ? 'Shuffle ON' : 'Shuffle OFF'}
                  className='data-[shuffle=true]'
                >
                  <Shuffle className='w-4 h-4' />
                </PlayerToggle>
              </div>

              <div className='flex items-center gap-4 mb-4'>
                <div className='text-[var(--color-text-secondary)] text-sm'>
                  {formatTime(currentTime)}
                </div>
                <div className='flex-1 relative'>
                  <div
                    className='h-2 bg-[var(--color-surface-primary)]/50 rounded-full cursor-pointer relative border border-[var(--color-border)] progress-bar'
                    onClick={handleProgressClick}
                  >
                    <div
                      className='h-full bg-gradient-to-r from-[var(--color-accent-primary)] to-[var(--color-accent-secondary)] rounded-full transition-all duration-100 shadow-lg'
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>
                <div className='text-[var(--color-text-secondary)] text-sm'>
                  {formatTime(duration)}
                </div>
              </div>

              <div className='flex items-center gap-3 mb-4 volume-control'>
                <VolumeControl />
              </div>

              <div className='flex-1 min-h-0 max-h-[300px]'>
                <ScrollArea className='h-full w-full'>
                  <div className='space-y-1 pr-2 pb-4'>
                    {currentPlaylistData?.tracks.map(
                      (track: Track, index: number) => (
                        <div
                          key={index}
                          className={`track-item flex items-center justify-between p-3 rounded-md transition-all duration-200 cursor-pointer ${
                            index === currentTrackIndex
                              ? 'active'
                              : 'hover:bg-[var(--color-interactive-hover)]'
                          }`}
                          onClick={() => handlePlayPause(index)}
                        >
                          <div className='flex-1 min-w-0'>
                            <AnimatedTrackInfo
                              title={track.title}
                              artist={track.artist}
                              isPlaying={
                                isPlaying && index === currentTrackIndex
                              }
                            />
                          </div>
                          <div className='text-sm ml-2 flex-shrink-0 text-[var(--color-text-secondary)] font-medium'>
                            {track.duration}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>

        <DynamicMixerSettings
          isOpen={showMixerSettings}
          onClose={() => setShowMixerSettings(false)}
          visualizerType={visualizerType}
          setVisualizerType={handleVisualizerTypeChange}
          visualParams={visualParams}
          setVisualParams={setVisualParams}
          audioMapping={audioMapping}
          setAudioMapping={setAudioMapping}
          performanceMetrics={performanceMetrics}
          savedPresets={savedPresets}
          currentPreset={currentPreset}
          onSavePreset={savePreset}
          onLoadPreset={loadPreset}
          onDeletePreset={deletePreset}
        />
      </div>
    );
  };

  return (
    <div style={minimized ? { display: 'none' } : {}}>
      <AudioLoadingIndicator
        isLoading={isLoading}
        progress={loadingProgress}
        message={loadingMessage}
      />

      {renderContent()}
    </div>
  );
}
