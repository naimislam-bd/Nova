
export interface Track {
  id: string;
  title: string;
  style: string;
  prompt: string;
  lyrics: string;
  audioUrl: string;
  createdAt: number;
  duration?: number;
}

export enum VoiceName {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr'
}

export interface GenerationParams {
  prompt: string;
  style: string;
  voice: VoiceName;
}
