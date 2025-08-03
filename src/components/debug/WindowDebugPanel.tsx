'use client';

import { useState, useEffect } from 'react';
import { useWindowDebugger } from '@/hooks/useWindowDebugger';
import { WindowMetrics } from '@/lib/windowDebugger';

interface WindowDebugPanelProps {
  isVisible?: boolean;
  onClose?: () => void;
}

export default function WindowDebugPanel({
  isVisible = false,
  onClose,
}: WindowDebugPanelProps) {
  const [showPanel, setShowPanel] = useState(isVisible);
  const [metrics, setMetrics] = useState<WindowMetrics[]>([]);

  const {
    logExperience,
    logSkills,
    logAbout,
    logAll,
    startMonitoring,
    stopMonitoring,
    isMonitoring,
    lastMetrics,
  } = useWindowDebugger({
    onMetricsChange: setMetrics,
  });

  useEffect(() => {
    setShowPanel(isVisible);
  }, [isVisible]);

  const handleLogAll = () => {
    const results = logAll({ verbose: true });
    setMetrics(results);
  };

  const handleStartMonitoring = () => {
    startMonitoring({ interval: 2000, verbose: false });
  };

  const handleStopMonitoring = () => {
    stopMonitoring();
  };

  const handleClose = () => {
    setShowPanel(false);
    if (onClose) onClose();
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className='fixed top-4 right-4 z-[10000] bg-red-600 text-white px-3 py-2 rounded text-sm font-mono'
        title='Open Debug Panel'
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className='fixed top-4 right-4 z-[10000] bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-md font-mono text-sm'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-bold'>Window Debugger</h3>
        <button
          onClick={handleClose}
          className='text-gray-400 hover:text-white'
        >
          ✕
        </button>
      </div>

      <div className='space-y-3'>
        <div className='grid grid-cols-3 gap-2'>
          <button
            onClick={() => logExperience({ verbose: true })}
            className='bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs'
          >
            Experience
          </button>
          <button
            onClick={() => logSkills({ verbose: true })}
            className='bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-xs'
          >
            Skills
          </button>
          <button
            onClick={() => logAbout({ verbose: true })}
            className='bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-xs'
          >
            About
          </button>
        </div>

        <div className='space-y-2'>
          <button
            onClick={handleLogAll}
            className='w-full bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded text-xs'
          >
            Log All Windows
          </button>

          {!isMonitoring ? (
            <button
              onClick={handleStartMonitoring}
              className='w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-xs'
            >
              Start Monitoring
            </button>
          ) : (
            <button
              onClick={handleStopMonitoring}
              className='w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-xs'
            >
              Stop Monitoring
            </button>
          )}
        </div>

        {metrics.length > 0 && (
          <div className='mt-4 p-3 bg-gray-800 rounded text-xs'>
            <h4 className='font-bold mb-2'>Last Metrics:</h4>
            {metrics.map((metric, index) => (
              <div key={index} className='mb-2 p-2 bg-gray-700 rounded'>
                <div className='font-bold text-blue-400'>
                  {metric.windowTitle}
                </div>
                <div>
                  Position: ({Math.round(metric.x)}, {Math.round(metric.y)})
                </div>
                <div>
                  Size: {Math.round(metric.width)} × {Math.round(metric.height)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='text-xs text-gray-400'>
          Status: {isMonitoring ? '🟢 Monitoring' : '🔴 Stopped'}
        </div>
      </div>
    </div>
  );
}
