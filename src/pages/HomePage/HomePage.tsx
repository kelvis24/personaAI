import React, { useState, CSSProperties } from 'react';

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

    const newUserMessage: Message = { sender: 'user', content: userInput };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    const botResponse = getRandomResponse();
    const newBotMessage: Message = { sender: 'bot', content: botResponse };
    setMessages((prevMessages) => [...prevMessages, newBotMessage]);

    setUserInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messageContainer}>
        {messages.map((message, index) => (
          <div key={index} style={message.sender === 'user' ? styles.userMessage : styles.botMessage}>
            <strong>{message.sender === 'user' ? 'You: ' : 'CustomGPT: '}</strong>{message.content}
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={styles.userInput}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

// Styling using CSS-in-JS
const styles: Record<string, CSSProperties> = {
  chatContainer: {
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  messageContainer: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#fff',
  },
  userMessage: {
    marginBottom: '12px',
    padding: '10px',
    backgroundColor: '#D1E8FF',
    borderRadius: '20px',
    maxWidth: '100%',
    alignSelf: 'flex-end',
  },
  botMessage: {
    marginBottom: '12px',
    padding: '10px',
    backgroundColor: '#F0F0F0',
    borderRadius: '20px',
    maxWidth: '100%',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
    backgroundColor: '#eee',
  },
  userInput: {
    flexGrow: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    marginRight: '10px',
  },
  sendButton: {
    background: 'linear-gradient(45deg, #6D5BBA, #8D58BF)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '20px',
    padding: '10px 15px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  }
};

export default HomePage;
