export enum AppMode {
  VIRAL_COPY = 'VIRAL_COPY',
  VIRAL_SUBJECT = 'VIRAL_SUBJECT',
  VIRAL_IMITATION = 'VIRAL_IMITATION',
  // Fix: Added DIGITAL_HUMAN to AppMode enum to match usage in geminiService
  DIGITAL_HUMAN = 'DIGITAL_HUMAN'
}

export interface Message {
  // Fix: Added optional id and timestamp properties to match usage in ChatAgent components
  id?: string;
  role: 'user' | 'model';
  text: string;
  timestamp?: number;
}
