
export enum AppMode {
  VIRAL_COPY = 'VIRAL_COPY',
  VIRAL_SUBJECT = 'VIRAL_SUBJECT',
  VIRAL_IMITATION = 'VIRAL_IMITATION',
  DIGITAL_HUMAN = 'DIGITAL_HUMAN'
}

export interface UserState {
  credits: number;
  tier: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
