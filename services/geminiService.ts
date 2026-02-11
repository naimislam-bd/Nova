
import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationParams, VoiceName } from "../types";
import { decode, decodeAudioData, audioBufferToWav } from "../utils/audioUtils";

const API_KEY = process.env.API_KEY || "";

export const generateMusicTrack = async (params: GenerationParams) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Step 1: Generate Lyrics based on Prompt and Style
  const textModel = "gemini-3-flash-preview";
  const lyricPrompt = `
    Write a short 4-line song lyric based on this prompt: "${params.prompt}".
    Style: ${params.style}.
    Make it poetic and catchy. Only return the lyrics, nothing else.
  `;

  const lyricResponse = await ai.models.generateContent({
    model: textModel,
    contents: lyricPrompt,
  });

  const lyrics = lyricResponse.text || "No lyrics generated.";

  // Step 2: Convert Lyrics to Audio using TTS
  const audioModel = "gemini-2.5-flash-preview-tts";
  const ttsPrompt = `Speak rhythmically and with emotion like a ${params.style} artist: ${lyrics}`;

  const audioResponse = await ai.models.generateContent({
    model: audioModel,
    contents: [{ parts: [{ text: ttsPrompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: params.voice },
        },
      },
    },
  });

  const base64Audio = audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!base64Audio) {
    throw new Error("Failed to generate audio content.");
  }

  // Create an AudioBuffer from the raw PCM
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const rawData = decode(base64Audio);
  const audioBuffer = await decodeAudioData(rawData, audioContext, 24000, 1);
  
  // Convert to a playable Blob
  const wavBlob = audioBufferToWav(audioBuffer);
  const audioUrl = URL.createObjectURL(wavBlob);

  return {
    lyrics,
    audioUrl,
    duration: audioBuffer.duration
  };
};
