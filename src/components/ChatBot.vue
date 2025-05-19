<template>
  <div class="chat-container">
    <div v-if="hasUnreadMessages && !isOpen" class="notification-badge">
      {{ unreadMessagesCount }}
    </div>
    <button class="chat-button" @click="toggleChat">
      <i class="pi pi-comments"></i>
    </button>

    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>Asistent TravelS</h3>
        <div class="header-actions">
          <button class="action-button" @click="startNewChat" title="Chat nou">
            <i class="pi pi-plus"></i>
          </button>
          <button class="action-button" @click="clearChatHistory" title="Șterge istoricul">
            <i class="pi pi-trash"></i>
          </button>
          <button class="close-button" @click="toggleChat">
            <i class="pi pi-times"></i>
          </button>
        </div>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div v-for="(message, index) in messages" :key="index" 
             :class="['message', message.isUser ? 'user-message' : 'bot-message']">
          <div class="message-content">
            {{ message.text }}
          </div>
          <div class="message-time">
            {{ formatTime(message.timestamp) }}
          </div>
        </div>
        
        <!-- Indicator de încărcare -->
        <div v-if="isLoading" class="message bot-message typing-indicator">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- Zona de input -->
      <div class="chat-input">
        <InputText 
          v-model="newMessage" 
          placeholder="Scrie un mesaj..." 
          @keyup.enter="sendMessage"
          class="message-input"
          :disabled="isLoading"
        />
        <Button 
          icon="pi pi-send" 
          @click="sendMessage"
          :disabled="!newMessage.trim() || isLoading"
          class="send-button"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useToast } from "primevue/usetoast";
import { useChatStore } from '../stores/chatStore';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isRead?: boolean;
}

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

const chatStore = useChatStore();
const isOpen = ref(false);
const messages = ref<ChatMessage[]>([]);
const newMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const toast = useToast();
const isLoading = ref(false);
const hasUnreadMessages = ref(false);
const unreadMessagesCount = ref(0);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    markMessagesAsRead();
  }
};

const markMessagesAsRead = () => {
  messages.value.forEach((msg: ChatMessage) => msg.isRead = true);
  hasUnreadMessages.value = false;
  unreadMessagesCount.value = 0;
  chatStore.updateMessages(messages.value);
};

const getChatHistory = (): ChatHistoryItem[] => {
  return messages.value.map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.text
  }));
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || isLoading.value) return;

  const userMessage: ChatMessage = {
    text: newMessage.value,
    isUser: true,
    timestamp: new Date(),
    isRead: true
  };
  messages.value.push(userMessage);
  
  const messageToSend = newMessage.value;
  newMessage.value = '';

  isLoading.value = true;

  await nextTick();
  scrollToBottom();

  try {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: messageToSend,
        chat_history: getChatHistory()
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    const botMessage: ChatMessage = {
      text: data.response,
      isUser: false,
      timestamp: new Date(),
      isRead: isOpen.value
    };
    messages.value.push(botMessage);
    
    if (!isOpen.value) {
      hasUnreadMessages.value = true;
      unreadMessagesCount.value++;
    }
    
    chatStore.updateMessages(messages.value);
    
  } catch (error) {
    console.error('Eroare:', error);
    toast.add({
      severity: 'error',
      summary: 'Eroare',
      detail: 'Nu am putut procesa mesajul. Vă rugăm să încercați din nou.',
      life: 3000
    });
  } finally {
    isLoading.value = false;
    await nextTick();
    scrollToBottom();
  }
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('ro-RO', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const startNewChat = () => {
  messages.value = [{
    text: 'Bună! Sunt asistentul TravelS. Cu ce te pot ajuta?',
    isUser: false,
    timestamp: new Date(),
    isRead: true
  }];
  chatStore.updateMessages(messages.value);
  hasUnreadMessages.value = false;
  unreadMessagesCount.value = 0;
};

const clearChatHistory = () => {
  messages.value = [];
  chatStore.updateMessages(messages.value);
  hasUnreadMessages.value = false;
  unreadMessagesCount.value = 0;
};

onMounted(() => {
  const savedMessages = chatStore.getMessages();
  if (savedMessages.length > 0) {
    messages.value = savedMessages;
    const unreadCount = savedMessages.filter(msg => !msg.isRead).length;
    if (unreadCount > 0) {
      hasUnreadMessages.value = true;
      unreadMessagesCount.value = unreadCount;
    }
  } else {
    messages.value.push({
      text: 'Bună! Sunt asistentul TravelS. Cu ce te pot ajuta?',
      isUser: false,
      timestamp: new Date(),
      isRead: true
    });
  }
});
</script>

<style scoped>
.chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #4CAF50;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.chat-button:hover {
  transform: scale(1.1);
}

.chat-window {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 350px;
  height: 500px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 15px;
  background-color: #4CAF50;
  color: white;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.close-button {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 80%;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 5px;
}

.user-message {
  align-self: flex-end;
  background-color: #4CAF50;
  color: white;
}

.bot-message {
  align-self: flex-start;
  background-color: #f0f0f0;
  color: #333;
}

.message-time {
  font-size: 0.7rem;
  margin-top: 5px;
  opacity: 0.7;
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.message-input {
  flex: 1;
}

.send-button {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
}

.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Stiluri pentru scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Stiluri pentru indicatorul de încărcare */
.typing-indicator {
  padding: 10px 15px;
  background-color: #f0f0f0;
  border-radius: 10px;
  display: inline-block;
  margin-bottom: 5px;
}

.typing-dots {
  display: flex;
  align-items: center;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background-color: #666;
  border-radius: 50%;
  display: inline-block;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-dots span:nth-child(1) {
  animation-delay: 0s;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 80%, 100% { 
    transform: scale(0.6);
    opacity: 0.6;
  }
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}

/* Stiluri pentru input dezactivat */
.message-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.send-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style> 