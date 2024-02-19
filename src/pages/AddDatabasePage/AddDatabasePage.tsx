import React, { useState, CSSProperties } from 'react';
import { db } from '~/lib/firebase'; // Adjust the import path as necessary
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

type Message = {
  sender: 'user' | 'bot';
  content: string;
};

const AddDatabasePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (userInput.trim() === '') return;

    const newUserMessage: Message = { sender: 'user', content: userInput };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      const username = 'usernamePlaceholder'; // Implement actual username retrieval logic

      await addDoc(collection(db, 'conversations'), {
        username: username,
        text: userInput,
        timestamp: serverTimestamp(),
      });

      const successMessage: Message = { sender: 'bot', content: "Successfully noted." };
      setMessages((prevMessages) => [...prevMessages, successMessage]);
    } catch (error) {
      console.error('Error adding message to Firestore:', error);
      const failureMessage: Message = { sender: 'bot', content: "Failed." };
      setMessages((prevMessages) => [...prevMessages, failureMessage]);
    }

    setUserInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  // Styles object using CSSProperties for type safety
  const styles: Record<string, CSSProperties> = {
    chatContainer: {
      maxWidth: '600px',
      margin: '20px auto',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#fff',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    messageContainer: {
      maxHeight: '500px',
      overflowY: 'auto',
      padding: '20px',
    },
    userMessage: {
      marginBottom: '12px',
      padding: '10px',
      backgroundColor: '#D1E8FF',
      borderRadius: '8px',
      maxWidth: '75%',
    },
    botMessage: {
      marginBottom: '12px',
      padding: '10px',
      backgroundColor: '#F0F0F0',
      borderRadius: '8px',
      maxWidth: '75%',
    },
    inputContainer: {
      display: 'flex',
      padding: '10px',
      borderTop: '1px solid #ccc',
      backgroundColor: '#fafafa',
    },
    userInput: {
      flexGrow: 1,
      padding: '8px',
      marginRight: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    sendButton: {
      padding: '8px 15px',
      background: 'linear-gradient(45deg, #6D5BBA, #8D58BF)',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messageContainer}>
        {messages.map((message, index) => (
          <div key={index} style={message.sender === 'user' ? styles.userMessage : styles.botMessage}>
            {message.sender === 'user' ? 'You: ' : ''}{message.content}
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

export default AddDatabasePage;
