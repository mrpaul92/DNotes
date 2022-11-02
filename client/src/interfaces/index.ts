export interface User {
  id: number;
  name: string;
  key: string;
  status: boolean;
  timestamp: number;
}

export interface Note {
  id: number;
  title: string;
  body: string;
  status: boolean;
  timestamp: number;
  files: File[];
}

export interface File {
  id: number;
  name: string;
  hash: string;
  size: number;
  mime: string;
  status: boolean;
  timestamp: number;
}
