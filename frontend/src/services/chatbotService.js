import apiClient, { IS_MOCK_MODE } from './apiClient';
import { localChatFallback } from './localChatFallback';

const chatbotService = {
  async sendMessage(message, history = [], language = 'auto') {
    if (IS_MOCK_MODE) {
      return { answer: localChatFallback(message, language), model: 'local-fallback', fallback: true };
    }
    try {
      return await apiClient.post('/api/v1/chatbot/message', { message, history, language }, { timeout: 60000 });
    } catch (error) {
      if (error.status && error.status < 500) throw error;
      return {
        answer: localChatFallback(message, language),
        model: 'local-fallback',
        fallback: true
      };
    }
  }
};

export default chatbotService;
