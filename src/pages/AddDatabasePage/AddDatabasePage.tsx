import React, { useState } from 'react';
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

    // Prepare the user message for display
    const newUserMessage: Message = { sender: 'user', content: userInput };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);

    try {
      // Assume the user's unique identifier or username is available
      // Replace 'usernamePlaceholder' with actual logic to retrieve the current user's username or UID
      const username = 'usernamePlaceholder';

      // Add the message to Firestore
      await addDoc(collection(db, 'conversations'), {
        username: username,
        text: userInput,
        timestamp: serverTimestamp(), // Use Firestore's server timestamp
      });

      // Display a success message
      const successMessage: Message = { sender: 'bot', content: "Successfully noted." };
      setMessages((prevMessages) => [...prevMessages, successMessage]);
    } catch (error) {
      console.error('Error adding message to Firestore:', error);

      // Display a failure message
      const failureMessage: Message = { sender: 'bot', content: "Failed." };
      setMessages((prevMessages) => [...prevMessages, failureMessage]);
    }

    // Clear user input
    setUserInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div id="chat-container" style={{ /* styles omitted for brevity */ }}>
      <div id="message-container" style={{ /* styles omitted for brevity */ }}>
        {messages.map((message, index) => (
          <div key={index} className={message.sender === 'user' ? 'user-message' : 'bot-message'} style={{ /* styles omitted for brevity */ }}>
            {message.sender === 'user' ? 'You: ' : ''}{message.content}
          </div>
        ))}
      </div>
      <div id="input-container" style={{ /* styles omitted for brevity */ }}>
        <input
          type="text"
          id="user-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          style={{ /* styles omitted for brevity */ }}
        />
        <button id="send-button" onClick={sendMessage} style={{ /* styles omitted for brevity */ }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default AddDatabasePage;
