import React, { useState, useEffect, CSSProperties } from 'react';
import { db, auth } from '~/lib/firebase'; // Make sure this path matches your Firebase config file
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

type Message = {
  sender: 'user' | 'bot';
  content: string;
  username: string;
};
interface User {
  username: string;
  email: string;
}

const HomePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
      const fetchUser = async () => {
        try {
          const userEmail = auth.currentUser?.email;
          if (userEmail) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", userEmail));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const userData = querySnapshot.docs[0].data() as User;
              setUser(userData);
            }
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        }
      };

      fetchUser();
    }, []);



const sendMessage = async () => {
  if (userInput.trim() === '') return;

  // Constructing the user message to add to the local state
  const newUserMessage: Message = { 
    sender: 'user', 
    content: userInput, 
    username: user?.username || 'anonymous' // Using 'anonymous' if username is not available
  };
  setMessages((prevMessages) => [...prevMessages, newUserMessage]);

try {
    const url = `https://www.safetyscan.live/query?input_string=${encodeURIComponent(userInput)}&username=${encodeURIComponent(user?.username || 'anonymous')}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const botResponse = data.response; // Assuming the response structure includes a 'response' field
    const newBotMessage: Message = { sender: 'bot', content: botResponse, username: 'bot' };
    setMessages((prevMessages) => [...prevMessages, newBotMessage]);
  } catch (error) {
    console.error('Error fetching response:', error);
    const errorMessage: Message = { sender: 'bot', content: 'Sorry, something went wrong.', username: 'bot' };
    setMessages((prevMessages) => [...prevMessages, errorMessage]);
  }
  setUserInput('');
};


//   const sendMessage = async () => {
//   if (userInput.trim() === '') return;

//   const newUserMessage: Message = { sender: 'user', content: userInput };
//   setMessages((prevMessages) => [...prevMessages, newUserMessage]);
//   try {
//       const response = await fetch(`http://localhost:8080/query?input_string=${encodeURIComponent(userInput)}`);

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     const data = await response.json();

//     const botResponse = data.response; // Adjust based on how the response is structured
//     const newBotMessage: Message = { sender: 'bot', content: botResponse };
//     setMessages((prevMessages) => [...prevMessages, newBotMessage]);
//   } catch (error) {
//     console.error('Error fetching response:', error);
//     const errorMessage: Message = { sender: 'bot', content: 'Sorry, something went wrong.' };
//     setMessages((prevMessages) => [...prevMessages, errorMessage]);
//   }

//   setUserInput('');
// };

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
