export interface Product {
  id: string;
  name: string;
  price: number;
  region: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: string[];
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  region: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}