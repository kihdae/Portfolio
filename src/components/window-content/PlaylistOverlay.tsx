'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

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

interface PlaylistOverlayProps {
  playlists: Record<string, Playlist>;
  currentPlaylist: string;
  onSelectPlaylist: (playlistName: string) => void;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PlaylistOverlay({
  playlists,
  currentPlaylist,
  onSelectPlaylist,
  onClose,
}: PlaylistOverlayProps) {
  return (
    <motion.div
      className='playlist-overlay'
      initial='hidden'
      animate='visible'
      exit='hidden'
      variants={overlayVariants}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className='playlist-overlay-content'>
        <div className='playlist-overlay-header'>
          <h2 className='playlist-overlay-title'>Select a Playlist</h2>
          <button onClick={onClose} className='playlist-overlay-close'>
            <X className='w-6 h-6' />
          </button>
        </div>
        <motion.ul
          className='playlist-overlay-list'
          variants={listVariants}
          initial='hidden'
          animate='visible'
        >
          {Object.keys(playlists).map(playlistName => (
            <motion.li
              key={playlistName}
              className={`playlist-overlay-item ${
                playlistName === currentPlaylist ? 'active' : ''
              }`}
              onClick={() => onSelectPlaylist(playlistName)}
              variants={itemVariants}
            >
              <img
                src={
                  playlistName === 'CodeNation'
                    ? '/assets/CodeNation-optimized.gif'
                    : '/assets/meme.jpg'
                }
                alt={playlistName}
                className='playlist-overlay-item-image'
              />
              <div className='playlist-overlay-item-info'>
                <h3 className='playlist-overlay-item-title'>{playlistName}</h3>
                <p className='playlist-overlay-item-tracks'>
                  {playlists[playlistName].tracks.length} tracks
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}
