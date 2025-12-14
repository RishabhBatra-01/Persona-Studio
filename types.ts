export interface HeadshotStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  previewColor: string;
}

export interface GeneratedImage {
  data: string; // Base64 string
  mimeType: string;
}

export interface ApiMetrics {
  totalRequests: number;
  errorRate: number; // percentage
  lastLatency: number; // ms
  requestsPerMinute: number;
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  STYLE_SELECT = 'STYLE_SELECT',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
}

export type AiModelId = 'gemini-2.5-flash-image' | 'gemini-3-pro-image-preview';

export interface AiModelConfig {
  id: AiModelId;
  name: string;
  badge: string;
  description: string;
}