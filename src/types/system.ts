export interface SystemState {
  isWifiEnabled: boolean;
  volume: number;
  isMuted: boolean;
  brightness: number;
  batteryLevel: number;
  isCharging: boolean;
  networkName: string | null;
}

export interface SystemControls {
  toggleWifi: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  connectToNetwork: (networkName: string) => void;
}

export interface PowerState {
  isSleeping: boolean;
  isRestarting: boolean;
  isShuttingDown: boolean;
}

export interface PowerControls {
  handleSleep: () => void;
  handleRestart: () => void;
  handleShutdown: () => void;
  handleWake: () => void;
}

export type SystemEvent =
  | { type: 'system-wifi-toggle' }
  | { type: 'system-volume-change'; detail: { volume: number } }
  | { type: 'system-volume-mute' }
  | { type: 'system-network-connect'; detail: { networkName: string } }
  | { type: 'system-sleep' }
  | { type: 'system-restart' }
  | { type: 'system-shutdown' };
