
import React, { useState } from 'react';
import { GenerationParams, VoiceName } from '../types';

interface GeneratorFormProps {
  onGenerate: (params: GenerationParams) => void;
  isLoading: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Chill Lofi');
  const [voice, setVoice] = useState<VoiceName>(VoiceName.Zephyr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({ prompt, style, voice });
  };

  const styles = ['Chill Lofi', 'Synthwave', 'Epic Orchestral', 'Cyberpunk', 'Acoustic Folk', 'Jazz Hop'];

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-400">Song Description</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. A nostalgic sunset drive through a neon city..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all resize-none h-28"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-400">Music Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all cursor-pointer"
          >
            {styles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-400">AI Voice Model</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(VoiceName).map(v => (
              <button
                key={v}
                type="button"
                onClick={() => setVoice(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  voice === v 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-zinc-950 text-zinc-500 border border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className={`w-full py-4 rounded-xl font-outfit font-bold text-lg flex items-center justify-center gap-2 transition-all ${
          isLoading 
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-900/20'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-zinc-500 border-t-white rounded-full animate-spin"></div>
            Crafting Audio...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Create Song
          </>
        )}
      </button>
    </form>
  );
};

export default GeneratorForm;
