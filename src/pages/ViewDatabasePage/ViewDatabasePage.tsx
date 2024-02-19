import React, { useEffect, useState } from 'react';
import { auth, db } from '~/lib/firebase'; // Adjust the import path as necessary
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
    const fetchUsernameAndMessages = async () => {
      try {
        const userEmail = auth.currentUser?.email;
        if (!userEmail) throw new Error('User not logged in');

        const usersRef = collection(db, "users");
        const qUser = query(usersRef, where("email", "==", userEmail));
        const userSnapshot = await getDocs(qUser);
        if (userSnapshot.empty) throw new Error('User profile not found');

        const userData = userSnapshot.docs[0].data();
        const username = userData.username as string;

        const messagesRef = collection(db, 'conversations');
        const qMessages = query(messagesRef, where('username', '==', username), orderBy('timestamp', 'desc'));

        const messagesSnapshot = await getDocs(qMessages);
        const fetchedMessages: Message[] = messagesSnapshot.docs.map((doc) => {
          const data = doc.data() as FirestoreMessage;
          return {
            sender: data.username === username ? 'You' : data.username,
            content: data.text,
            timestamp: data.timestamp?.toDate() || new Date(),
          };
        });

        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchUsernameAndMessages();
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
