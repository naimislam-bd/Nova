
import React from 'react';
import { Track } from '../types';

interface TrackCardProps {
  track: Track;
  onPlay: (track: Track) => void;
  isPlaying: boolean;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onPlay, isPlaying }) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(timestamp);
  };

  return (
    <div className="group bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300">
      <div className="relative aspect-square bg-zinc-800">
        <img 
          src={track.coverUrl} 
          alt={track.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <button 
            onClick={() => onPlay(track)}
            className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-2xl"
          >
            {isPlaying ? (
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>
        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider text-zinc-300">
          {track.style}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-zinc-100 truncate mb-1">{track.title}</h3>
        <p className="text-xs text-zinc-500 mb-3 line-clamp-2 italic font-light leading-relaxed">"{track.prompt}"</p>
        
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-zinc-600 font-medium">{formatDate(track.createdAt)}</span>
          <div className="flex gap-3">
            <a 
              href={track.audioUrl} 
              download={`${track.title}.wav`}
              className="text-zinc-500 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
