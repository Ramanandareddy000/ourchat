import React, { useEffect, useState } from 'react';
import { messageService } from './services/messageService';
import axiosInstance from './api/axiosInstance';

interface TestConversationsProps {
  userId: number;
  token: string;
}

const TestConversations: React.FC<TestConversationsProps> = ({ userId, token }) => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Set the token in axios instance
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch conversations
        const fetchedConversations = await messageService.fetchConversations(userId);
        setConversations(fetchedConversations);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userId, token]);

  if (loading) return <div>Loading conversations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Conversations for user {userId}</h2>
      <ul>
        {conversations.map(conversation => (
          <li key={conversation.id}>
            <strong>{conversation.display_name}</strong> (ID: {conversation.id})
            {conversation.is_group && <span> [GROUP]</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestConversations;