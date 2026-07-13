'use client';

import { useState, useEffect } from 'react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'read' | 'unread';
}

export default function AdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/messages`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', contentType);
        const text = await response.text();
        console.error('Response text:', text);
        throw new Error('Server did not return JSON');
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/messages/${id}/read`, {
        method: 'PUT',
      });
      if (!response.ok) throw new Error('Failed to mark as read');
      fetchMessages(); // Refresh the list
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contact/messages/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete message');
      fetchMessages(); // Refresh the list
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex flex-col items-center justify-center">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex flex-col items-center justify-center">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-pixelify-sans font-bold text-[rgb(216,52,52)] mb-4 drop-shadow-lg">Error</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 font-pixelify-sans">{error}</p>
            <button
              onClick={fetchMessages}
              className="text-white font-jersey-15 bg-[#38667f] px-8 py-3 rounded-lg text-lg border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[5px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038] transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-pixelify-sans font-bold text-[#1a1a1a] dark:text-white mb-2 drop-shadow-lg">
            Contact Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-pixelify-sans">
            Manage contact form submissions and feedback
          </p>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff1f,inset_0px_-5px_#00000030] p-8 border-4 border-[rgb(6,0,78)] text-center">
            <p className="text-gray-500 dark:text-gray-400 font-pixelify-sans">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff1f,inset_0px_-5px_#00000030] p-6 border-4 ${
                  message.status === 'unread' 
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/40' 
                    : 'border-[rgb(6,0,78)]'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-pixelify-sans font-bold text-[rgb(6,0,78)] dark:text-white">
                        {message.name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-pixelify-sans">
                        {message.email}
                      </span>
                      {message.status === 'unread' && (
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full font-pixelify-sans">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-pixelify-sans">
                      Subject: <span className="font-medium">{message.subject}</span>
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-pixelify-sans">
                      {formatDate(message.timestamp)}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    {message.status === 'unread' && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="px-4 py-2 text-sm text-white font-jersey-15 bg-[#6abc3a] rounded-lg border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[3px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038] transition-all"
                      >
                        Mark Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="px-4 py-2 text-sm text-white font-jersey-15 bg-[#d83434] rounded-lg border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[3px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038] transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="bg-gray-300 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-pixelify-sans">
                    {message.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={fetchMessages}
            className="text-white font-jersey-15 bg-[#38667f] px-10 py-4 text-lg border-0 shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,0px_10px_#00000038,5px_5px_#00000038,-5px_5px_#00000038,inset_0px_5px_#ffffff36] active:translate-y-[5px] active:shadow-[0px_5px_black,0px_-5px_black,5px_0px_black,-5px_0px_black,inset_0px_5px_#00000038] transition-all"
          >
            Refresh Messages
          </button>
        </div>
      </div>
    </div>
  );
} 