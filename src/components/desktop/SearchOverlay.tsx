'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface SearchResult {
  name: string;
  icon: string;
  type: string;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string, title: string) => void;
  icons: Array<{
    name: string;
    icon: string;
    type: string;
  }>;
}

export default function SearchOverlay({
  isOpen,
  onClose,
  onSelect,
  icons,
}: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!searchTerm) {
      setResults(icons);
    } else {
      const filtered = icons.filter(icon =>
        icon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    }
    setSelectedIndex(0);
  }, [searchTerm, icons]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(
            prev => (prev - 1 + results.length) % results.length
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            onSelect(results[selectedIndex].type, results[selectedIndex].name);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, results, selectedIndex, onSelect, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      const input = document.getElementById('search-input');
      if (input) {
        input.focus();
      }
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      <div className='w-96 bg-[#1f1f1f] rounded-lg shadow-xl overflow-hidden'>
        <div className='p-4 border-b border-white/10'>
          <input
            id='search-input'
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Search apps...'
            className='w-full bg-[#2f2f2f] text-white px-4 py-2 rounded-lg outline-none'
            autoFocus
          />
        </div>

        <div className='max-h-96 overflow-y-auto'>
          {results.map((result, index) => (
            <button
              key={result.name}
              className={`
                w-full px-4 py-3 flex items-center gap-3 
                hover:bg-white/5 transition-colors
                ${selectedIndex === index ? 'bg-white/10' : ''}
              `}
              onClick={() => {
                onSelect(result.type, result.name);
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <Image
                src={result.icon}
                alt={result.name}
                width={24}
                height={24}
                className='object-contain'
              />
              <span className='text-white'>{result.name}</span>
            </button>
          ))}
          {results.length === 0 && (
            <div className='px-4 py-3 text-white/50 text-center'>
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
