
import { GoogleGenAI, Modality } from "@google/genai";
import { GenerationParams } from "../types";
import { decode, decodeAudioData, audioBufferToWav } from "../utils/audioUtils";

const API_KEY = process.env.API_KEY || "";

export const generateMusicTrack = async (params: GenerationParams) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // 1. Generate Lyrics
  const lyricPrompt = `
    Write a short 4-line song lyric based on this prompt: "${params.prompt}".
    Style: ${params.style}.
    Make it poetic and catchy. Only return the lyrics, nothing else.
  `;
  const lyricResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: lyricPrompt,
  });
  const lyrics = lyricResponse.text || "No lyrics generated.";

  // 2. Generate Cover Art
  const imageResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `An artistic, high-quality album cover for a song titled "${params.prompt.substring(0, 20)}". Style: ${params.style}. Abstract, cinematic lighting, vibrant colors.` },
      ],
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    },
  });

  let coverUrl = `https://picsum.photos/seed/${Math.random()}/400/400`;
  for (const part of imageResponse.candidates[0].content.parts) {
    if (part.inlineData) {
      coverUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  // 3. Generate Audio
  const ttsPrompt = `Speak rhythmically and with emotion like a ${params.style} artist: ${lyrics}`;
  const audioResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
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
  if (!base64Audio) throw new Error("Failed to generate audio content.");

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const rawData = decode(base64Audio);
  const audioBuffer = await decodeAudioData(rawData, audioContext, 24000, 1);
  const wavBlob = audioBufferToWav(audioBuffer);
  const audioUrl = URL.createObjectURL(wavBlob);

  return {
    lyrics,
    audioUrl,
    coverUrl,
    duration: audioBuffer.duration
  };
};
