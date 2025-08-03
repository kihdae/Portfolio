import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

interface PowerContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isSleeping: boolean;
  isRestarting: boolean;
  isShuttingDown: boolean;
  restartMessage: string;
  restartProgress: number;
  handleSleep: () => void;
  handleWake: () => void;
  handleRestart: () => void;
  handleShutdown: () => void;
}

const PowerContext = createContext<PowerContextType | undefined>(undefined);

export function PowerProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSleeping, setIsSleeping] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [restartMessage, setRestartMessage] = useState('');
  const [restartProgress, setRestartProgress] = useState(0);
  const router = useRouter();

  const handleSleep = () => {
    setIsSleeping(true);
  };

  const handleWake = () => {
    setIsSleeping(false);
    router.push('/desktop');
  };

  const handleRestart = () => {
    console.log('Initiating restart sequence...');
    setIsRestarting(true);
    setRestartProgress(0);
    setRestartMessage('System Restarting...');

    const restartSequence = [
      { progress: 10, message: 'System Restarting...', delay: 500 },
      { progress: 20, message: 'Saving user settings...', delay: 800 },
      { progress: 35, message: 'Closing applications...', delay: 600 },
      { progress: 50, message: 'Shutting down system services...', delay: 700 },
      { progress: 65, message: 'Loading modules...', delay: 900 },
      { progress: 80, message: 'Initializing services...', delay: 800 },
      { progress: 90, message: 'Preparing desktop environment...', delay: 600 },
      { progress: 95, message: 'Almost ready...', delay: 500 },
      { progress: 100, message: 'Welcome Back!', delay: 1000 },
    ];

    let currentStep = 0;

    const updateRestartState = () => {
      if (currentStep < restartSequence.length) {
        const step = restartSequence[currentStep];
        setRestartProgress(step.progress);
        setRestartMessage(step.message);
        currentStep++;

        if (currentStep < restartSequence.length) {
          setTimeout(updateRestartState, step.delay);
        } else {
          setTimeout(() => {
            console.log('Restart sequence completed');
            setIsRestarting(false);
            setRestartMessage('');
            setRestartProgress(0);
            setIsLoading(true);

            if (typeof window !== 'undefined') {
              localStorage.setItem('system_restart', 'true');
            }

            router.push('/');
          }, step.delay);
        }
      }
    };

    setTimeout(updateRestartState, restartSequence[0].delay);
  };

  const handleShutdown = () => {
    setIsShuttingDown(true);
  };

  return (
    <PowerContext.Provider
      value={{
        isLoading,
        setIsLoading,
        isSleeping,
        isRestarting,
        isShuttingDown,
        restartMessage,
        restartProgress,
        handleSleep,
        handleWake,
        handleRestart,
        handleShutdown,
      }}
    >
      {children}
    </PowerContext.Provider>
  );
}

export function usePower() {
  const context = useContext(PowerContext);
  if (context === undefined) {
    throw new Error('usePower must be used within a PowerProvider');
  }
  return context;
}
