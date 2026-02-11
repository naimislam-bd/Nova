
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GeneratorForm from './components/GeneratorForm';
import TrackCard from './components/TrackCard';
import MusicPlayer from './components/MusicPlayer';
import { Track, GenerationParams } from './types';
import { generateMusicTrack } from './services/geminiService';

const App: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedTracks = localStorage.getItem('nova_tracks_v2');
    if (savedTracks) {
      try {
        setTracks(JSON.parse(savedTracks));
      } catch (e) {
        console.error("Failed to parse local tracks", e);
      }
    }
  }, []);

  useEffect(() => {
    if (tracks.length > 0) {
      // Limit to 10 tracks to avoid storage limits with base64 images
      localStorage.setItem('nova_tracks_v2', JSON.stringify(tracks.slice(0, 10)));
    }
  }, [tracks]);

  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    setError(null);
    try {
      const { lyrics, audioUrl, coverUrl, duration } = await generateMusicTrack(params);
      
      const newTrack: Track = {
        id: Math.random().toString(36).substring(7),
        title: params.prompt.split(' ').slice(0, 3).join(' ') || 'AI Session',
        style: params.style,
        prompt: params.prompt,
        lyrics,
        audioUrl,
        coverUrl,
        createdAt: Date.now(),
        duration
      };

      setTracks(prev => [newTrack, ...prev]);
      setActiveTrack(newTrack);
      setIsPlaying(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to craft your song. Try again!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTogglePlay = (track?: Track) => {
    if (track && (!activeTrack || activeTrack.id !== track.id)) {
      setActiveTrack(track);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col pb-32">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        <section className="mb-20 text-center">
          <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Multi-Modality AI Studio</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-outfit font-extrabold mb-6 tracking-tight">
            Music from your<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
              imagination.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Nova generates lyrics, creates custom cover art, and performs your track in high-fidelity AI voice.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-28">
              <h2 className="text-2xl font-outfit font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                Composer
              </h2>
              <GeneratorForm onGenerate={handleGenerate} isLoading={isGenerating} />
              
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7 xl:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-outfit font-bold">Studio Library</h2>
            </div>

            {tracks.length === 0 ? (
              <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-800 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Empty Studio</h3>
                <p className="text-zinc-500">Your generated tracks will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-700">
                {tracks.map(track => (
                  <TrackCard 
                    key={track.id} 
                    track={track} 
                    onPlay={handleTogglePlay}
                    isPlaying={activeTrack?.id === track.id && isPlaying}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <MusicPlayer 
        activeTrack={activeTrack} 
        isPlaying={isPlaying} 
        onTogglePlay={() => setIsPlaying(!isPlaying)} 
      />
    </div>
  );
};

export default App;
