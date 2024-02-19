import React, { useEffect, useState } from 'react';
import { db } from '~/lib/firebase';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

type Message = {
  sender: string;
  content: string;
  timestamp: Date;
};

interface FirestoreMessage {
  id: string;
  username: string;
  text: string;
  timestamp: Timestamp | null;
}

const ViewDatabasePage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const username = 'usernamePlaceholder'; // Placeholder, replace as needed
      const messagesRef = collection(db, 'conversations');
      const q = query(messagesRef, where('username', '==', username), orderBy('timestamp', 'desc'));

      const querySnapshot = await getDocs(q);
      const fetchedMessages: Message[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as FirestoreMessage;
        return {
          sender: data.username === username ? 'You' : data.username, // Assuming the bot has a username
          content: data.text,
          timestamp: data.timestamp?.toDate() || new Date(),
        };
      });

      setMessages(fetchedMessages);
    };

    fetchMessages().catch(console.error);
  }, []);

  return (
    <div className="chat-container">
      <div className="message-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === 'You' ? 'user' : 'bot'}`}>
            <div className="message-header">
              <strong>{message.sender}</strong>
              <span>({format(message.timestamp, 'PPPp')})</span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewDatabasePage;
