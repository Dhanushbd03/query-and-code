import createApi from "./axios";

const chat_api = createApi("api/chat");

export interface Message {
  id: number;
  conversation_id: number;
  sender: string;
  message: string;
  timestamp: string;
}

export interface Conversation {
  id: number;
  user_id: string;
  language_id: number;
  title: string;
  created_at: string;
}

export const getMessages = async (id: number) => {
  const response = await chat_api.get(`/messages/${id}`);
  return response?.data?.data ? (response.data.data as Message[]) : [];
};

export const getConversations = async () => {
  const response = await chat_api.get("/conversations");
  return response?.data?.data ? (response.data.data as Conversation[]) : [];
};
