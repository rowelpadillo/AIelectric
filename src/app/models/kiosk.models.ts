export interface CustomerAccount {
  account: string;
  name: string;
  address: string;
  meter: string;
  type: string;
  status: 'Active' | 'Disconnected' | 'Suspended';
  balance: string;
  dueDate: string;
}

export interface ConcernResponse {
  status: string;
  body: string;
}

export interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'warn' | 'data';
  text: string;
}

export interface PipelineNode {
  id: number;
  icon: string;
  name: string;
  desc: string;
  state: 'idle' | 'active' | 'done';
}

export type KioskStep = 1 | 2 | 3 | 4;

export interface Concern {
  label: string;
  icon: string;
  key: string;
}
