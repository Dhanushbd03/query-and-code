export interface Response {
  data: any;
  message: string;
  success: boolean;
}
export interface Message {
  id: string;
  conversation_id: string;
  sender: string;
  message: string;
  timestamp: string;
}
export interface Conversation {
  id: string;
  user_id: string;
  language_id: number;
  title: string;
  created_at: string;
}
export interface Language {
  id: number;
  name: string;
  description: string;
  icon: string;
}