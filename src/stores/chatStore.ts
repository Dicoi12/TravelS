import { defineStore } from 'pinia';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isRead?: boolean;
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[]
  }),

  actions: {
    updateMessages(messages: ChatMessage[]) {
      this.messages = messages;
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    },

    getMessages(): ChatMessage[] {
      const savedMessages = localStorage.getItem('chatHistory');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        return parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      return [];
    }
  }
}); 