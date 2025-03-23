import createApi from "@/api/axios";
import { create } from "zustand";
import { toast } from "@/hooks/use-toast";
import { Response, Message, Conversation } from "@/models/model";

interface ChatStore {
  messages: Message[];
  conversations: Conversation[];
  loading: boolean;
  c_loading: boolean;
  getMessages: (conv_id: string) => Promise<boolean>;
  sendMessage: (
    language_id: string,
    conversation_id: string,
    message: string
  ) => Promise<void>;
  addNewChat: (lang_id: string) => Promise<Response | null>;
  getConversations: (lang_id: string) => Promise<boolean>;
  deleteConversation: (conv_id: string, lang_id: string) => Promise<boolean>;
}

const chat_api = createApi("api/chat");

const useChat = create<ChatStore>((set, get) => ({
  messages: [],
  conversations: [],
  loading: false,
  c_loading: false,

  getMessages: async (conv_id: string) => {
    if (!conv_id) {
      toast({
        title: "Error", 
        description: "Conversation ID not found",
        variant: "destructive",
      });
      return false;
    }else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conv_id)){
      toast({
        title: "Error",
        description: "Invalid conversation ID",
        variant: "destructive",
      });
      return false;
    }

    set({ c_loading: true });

    try {
      const { data }: Response = await chat_api.get(`/messages/${conv_id}`);
      if (data.success) {
        set({ messages: data.data });
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch messages",
          variant: "destructive",
        });
        return false;
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
      return false;
    } finally {
      set({ c_loading: false });
    }
  },
  sendMessage: async (language_id, conversation_id, message) => {
    if (!language_id || !conversation_id) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      return;
    }
  
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Text cannot be empty",
        variant: "destructive",
      });
      return;
    }
  
    // Create a temporary message object with pending status
    const tempMessage = {
      id: `temp-${Date.now()}`, // Temporary ID
      conversation_id,
      content: message,
      sender: "user", // Assuming "user" represents messages sent by the user
      created_at: new Date().toISOString(),
      is_pending: true, // Flag to indicate this message is waiting for server confirmation
      message: message, // Assuming 'message' is the content
      timestamp: new Date().toISOString() // Assuming 'timestamp' is the created_at
    };
  
    try {
      // Add the message to the UI immediately
      const currentMessages = get().messages || [];
      set({ 
        messages: [...currentMessages, tempMessage],
        c_loading: true 
      });
  
      // Send the message to the server
      const { data }: Response = await chat_api.post("/send", {
        language_id,
        conversation_id,
        message,
      });
  
      if (data.success) {
        // If successful, refresh all messages to get the proper server IDs
        get().getMessages(conversation_id);
      } else {
        // If failed, mark the message as failed
        const updatedMessages = get().messages.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, is_pending: false, failed: true } 
            : msg
        );
        set({ messages: updatedMessages });
  
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch {
      // If exception, mark the message as failed
      const updatedMessages = get().messages.map(msg => 
        msg.id === tempMessage.id 
          ? { ...msg, is_pending: false, failed: true } 
          : msg
      );
      set({ messages: updatedMessages });
  
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      set({ c_loading: false });
    }
  },
  getConversations: async (lang_id: string) => {
    set({ loading: true });

    try {
      if (!lang_id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lang_id)){
        toast({
          title: "Error",
          description: "Invalid language ID",
          variant: "destructive",
        });
        return false;
      }
      const { data }: Response = await chat_api.get(
        `/${lang_id}/conversations`
      );
      if (data.success) {
        set({ conversations: data.data });
        return true;
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch conversations",
          variant: "destructive",
        });
        return false;
      }
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  addNewChat: async (lang_id) => {
    set({ loading: true });

    try {
      const { data }: Response = await chat_api.post("/start", {
        language_id: lang_id,
      });

      if (!data.success) {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
        return null;
      }

      get().getConversations(lang_id);
      return data;
    } catch {
      toast({
        title: "Error",
        description: "Failed to start a new chat",
        variant: "destructive",
      });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  deleteConversation: async (conv_id: string, lang_id: string) => {
    if (!conv_id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(conv_id)) {
      toast({
        title: "Error",
        description: "Invalid conversation ID",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { data }: Response = await chat_api.delete(`/${conv_id}`);
      console.log(data);
      if (data.success) {
        set(state => ({
          conversations: state.conversations.filter(conv => conv.id !== conv_id)
        }));
        get().getConversations(lang_id);
        toast({
          title: "Success",
          description: "Conversation deleted successfully",
          variant: "success",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
        return false;
      }
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Error",
        description: e.message,
        variant: "destructive",
      });
      return false;
    }
  },
}));

export default useChat;
