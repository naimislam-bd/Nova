
import React, { useEffect, useRef, useState } from 'react';
import { Track } from '../types';

interface MusicPlayerProps {
  activeTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ activeTrack, isPlaying, onTogglePlay }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, activeTrack]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  if (!activeTrack) return null;

  return (
    <>
      {/* Lyrics Drawer */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-2xl z-[90] transition-all duration-500 border-t border-zinc-800 ${
          showLyrics ? 'h-[60vh]' : 'h-0 overflow-hidden'
        }`}
      >
        <div className="max-w-3xl mx-auto h-full p-8 pt-12 relative">
          <button 
            onClick={() => setShowLyrics(false)}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="flex gap-8 h-full">
            <div className="hidden md:block w-64 h-64 flex-shrink-0 bg-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
              <img src={activeTrack.coverUrl} className="w-full h-full object-cover" alt="" />
            </div>
            <div className="flex-grow overflow-y-auto pr-4 scroll-smooth">
              <span className="text-purple-500 font-bold text-xs uppercase tracking-widest mb-2 block">Lyrics</span>
              <h2 className="text-3xl font-outfit font-bold mb-6">{activeTrack.title}</h2>
              <pre className="text-xl md:text-2xl font-outfit font-medium text-zinc-300 whitespace-pre-wrap leading-relaxed italic">
                {activeTrack.lyrics}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-800 p-4 md:px-8 z-[100]">
        <audio 
          ref={audioRef} 
          src={activeTrack.audioUrl} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={onTogglePlay}
        />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          {/* Info */}
          <div className="flex items-center gap-4 w-full md:w-1/4">
            <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
              <img src={activeTrack.coverUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{activeTrack.title}</h4>
              <p className="text-xs text-zinc-500 truncate">{activeTrack.style}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-grow w-full md:w-auto">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowLyrics(!showLyrics)}
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all ${
                  showLyrics ? 'bg-purple-600 text-white' : 'text-zinc-500 hover:text-white'
                }`}
              >
                Lyrics
              </button>
              <button 
                onClick={onTogglePlay}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                ) : (
                  <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
              </button>
            </div>
            
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] font-mono text-zinc-500 w-8">{formatTime(audioRef.current?.currentTime || 0)}</span>
              <div className="flex-grow h-1 bg-zinc-800 rounded-full relative group cursor-pointer">
                <div 
                  className="absolute h-full bg-white rounded-full transition-all duration-100" 
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-white/20"></div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 w-8">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Extra */}
          <div className="hidden md:flex items-center justify-end gap-4 w-1/4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <div className="w-20 h-1 bg-zinc-800 rounded-full">
                <div className="w-2/3 h-full bg-zinc-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
