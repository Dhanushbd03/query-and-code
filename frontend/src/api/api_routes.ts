import createApi from "./axios";

const chat_api = createApi("api/chat");
const language_api = createApi("api/languages");
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

export interface Language {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export const getMessages = async (conv_id: string) => {
  const response = await chat_api.get(`/messages/${conv_id}`);
  return response?.data;
};

export const getConversations = async (lang_id: string) => {
  const response = await chat_api.get("/conversations", {
    params: {
      lang_id,
    },
  });
  return response?.data;
};

export const startChat = async (
  conversation_id: string,
  language_id: string
) => {
  const response = await chat_api.post("/start", {
    conversation_id,
    language_id,
  });
  return response?.data;
};

export const getLanguages = async () => {
  const response = await language_api.get("/");
  return response?.data;
};

export const sendMessage = async (
  language_id: string,
  conversation_id: string,
  message: string
) => {
  const response = await chat_api.post("/send", {
    language_id,
    conversation_id,
    message,
  });
  return response?.data;
};
