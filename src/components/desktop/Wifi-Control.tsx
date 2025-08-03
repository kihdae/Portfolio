'use client';

import { useState } from 'react';
import { Wifi, WifiOff, Lock, Signal, X } from 'lucide-react';

interface WifiControlProps {
  onClose: () => void;
}

export default function WifiControl({ onClose }: WifiControlProps) {
  const [isWifiEnabled, setIsWifiEnabled] = useState(true);
  const [connectedNetwork, setConnectedNetwork] = useState('Home Network');
  const [isConnecting, setIsConnecting] = useState(false);

  const availableNetworks = [
    { name: 'Home Network', signal: 4, secured: true },
    { name: 'Office WiFi', signal: 3, secured: true },
    { name: 'Guest Network', signal: 2, secured: false },
    { name: 'Neighbor WiFi', signal: 1, secured: true },
  ];

  const handleNetworkConnect = (networkName: string) => {
    setIsConnecting(true);
    setTimeout(() => {
      setConnectedNetwork(networkName);
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <>
      <div className='fixed inset-0 z-40' onClick={onClose} />
      <div className='absolute bottom-14 right-4 w-80 bg-black/90 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl z-50 animate-in slide-in-from-bottom-2 duration-200'>
        <div className='flex items-center justify-end p-4'>
          <button
            onClick={onClose}
            className='text-white/70 hover:text-white transition-colors'
          >
            <X className='w-4 h-4' />
          </button>
        </div>
        <div className='p-4 border-b border-white/10'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              {isWifiEnabled ? (
                <Wifi className='w-5 h-5 text-blue-400' />
              ) : (
                <WifiOff className='w-5 h-5 text-red-400' />
              )}
              <span className='text-white font-medium'>Wi-Fi</span>
            </div>
            <button
              onClick={() => setIsWifiEnabled(!isWifiEnabled)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                isWifiEnabled ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  isWifiEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
                
        {isWifiEnabled && (
          <div className='p-4'>
            <h3 className='text-white/80 text-sm font-medium mb-3'>
              Available Networks
            </h3>
            <div className='space-y-2'>
              {availableNetworks.map(network => (
                <button
                  key={network.name}
                  onClick={() =>
                    connectedNetwork !== network.name && !isConnecting && handleNetworkConnect(network.name)
                  }
                  disabled={isConnecting}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                    connectedNetwork === network.name
                      ? 'bg-blue-500/20 border border-blue-500/30'
                      : 'hover:bg-white/10'
                  } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className='flex items-center space-x-3'>
                    <div className='flex items-center space-x-1'>
                      <Signal className='w-4 h-4 text-white/70' />
                      <div className='flex space-x-0.5'>
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 h-3 rounded-full ${i < network.signal ? 'bg-white' : 'bg-white/20'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className='text-white text-sm'>{network.name}</span>
                    {network.secured && (
                      <Lock className='w-3 h-3 text-white/50' />
                    )}
                  </div>
                  {connectedNetwork === network.name && <span className='text-blue-400 text-xs'>Connected</span>}
                  {isConnecting && connectedNetwork !== network.name && (
                    <span className='text-yellow-400 text-xs'>Connecting...</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
