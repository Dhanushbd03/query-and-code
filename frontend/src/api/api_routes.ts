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



export interface Language {
  id: number;
  name: string;
  description: string;
  icon: string;
}
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
  console.log(response);
  return response?.data;
};