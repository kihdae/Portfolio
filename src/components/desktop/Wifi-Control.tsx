'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

interface WifiControlProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  isWifiOn: boolean;
  onToggleWifi: () => void;
  onConnectToNetwork: (networkName: string) => void;
  connectedNetwork: string | null;
}

const NETWORKS = [
  { name: 'Home Network', strength: 100, secured: true },
  { name: 'Coffee Shop', strength: 75, secured: true },
  { name: 'Public WiFi', strength: 50, secured: false },
  { name: 'Guest Network', strength: 25, secured: true },
];

export default function WifiControl({
  isOpen,
  onClose,
  onOpen,
  isWifiOn,
  onToggleWifi,
  onConnectToNetwork,
  connectedNetwork,
}: WifiControlProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          className='absolute bottom-14 right-16 w-80 bg-black/80 backdrop-blur-xl rounded-lg border border-white/20 shadow-2xl z-40 animate-in slide-in-from-bottom-2 duration-200'
        >
          <div className='p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-white font-medium'>WiFi</h3>
              <button
                onClick={() => {
                  onToggleWifi();
                  onOpen();
                }}
                className='text-white/70 hover:text-white transition-colors'
              >
                {isWifiOn ? (
                  <Wifi className='w-4 h-4' />
                ) : (
                  <WifiOff className='w-4 h-4' />
                )}
              </button>
            </div>

            {isWifiOn ? (
              <div className='space-y-2'>
                {NETWORKS.map(network => (
                  <button
                    key={network.name}
                    onClick={() => onConnectToNetwork(network.name)}
                    className={`
                  w-full p-2 rounded-lg flex items-center justify-between
                  ${
                    connectedNetwork === network.name
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }
                  transition-colors duration-200
                `}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='relative'>
                        <Wifi
                          className={`w-4 h-4 ${network.secured ? 'text-white/70' : 'text-white/50'}`}
                        />
                        {network.secured && (
                          <div className='absolute -right-1 -bottom-1 w-2 h-2 bg-white/70 rounded-full' />
                        )}
                      </div>
                      <span className='text-sm text-white/90'>
                        {network.name}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      {connectedNetwork === network.name && (
                        <span className='text-xs text-white/50'>Connected</span>
                      )}
                      <div className='flex gap-0.5'>
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`
                          w-1 rounded-sm
                          ${i === 0 ? 'h-1' : i === 1 ? 'h-2' : i === 2 ? 'h-3' : 'h-4'}
                          ${i < network.strength / 25 ? 'bg-white/70' : 'bg-white/20'}
                        `}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className='text-sm text-white/50 text-center py-2'>
                WiFi is turned off
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
