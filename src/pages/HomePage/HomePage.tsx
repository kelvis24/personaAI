// ChatApp.tsx
import React, { useState } from 'react';

type Message = {
  sender: 'user' | 'bot';
  content: string;
};

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');

  const getRandomResponse = (): string => {
    const responses = [
      "Interesting point!",
      "Can you elaborate on that?",
      "Why do you think that?",
      "I never thought of it that way.",
      "That's a great insight.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    // Add user message
    const newUserMessage: Message = { sender: 'user', content: userInput };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    // Simulate getting a random bot response
    const botResponse = getRandomResponse();

    // Add bot response
    const newBotMessage: Message = { sender: 'bot', content: botResponse };
    setMessages((prevMessages) => [...prevMessages, newBotMessage]);

    // Clear user input
    setUserInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div id="chat-container" style={{ maxWidth: '1200px', margin: '20px auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <div id="message-container" style={{ maxHeight: '800px', overflowY: 'auto', padding: '20px', boxSizing: 'border-box' }}>
        {messages.map((message, index) => (
          <div key={index} className={message.sender === 'user' ? 'user-message' : 'bot-message'} style={{
            marginBottom: '10px', padding: '10px', borderRadius: '5px', backgroundColor: message.sender === 'user' ? '#e6f7e6' : '#fff2cc',
          }}>
            {message.sender === 'user' ? 'You: ' : 'CustomGPT: '}{message.content}
          </div>
        ))}
      </div>
      <div id="input-container" style={{ padding: '10px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', borderTop: '1px solid #ccc' }}>
        <input
          type="text"
          id="user-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <button id="send-button" onClick={sendMessage} style={{ marginLeft: '10px', padding: '8px 12px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default HomePage;
