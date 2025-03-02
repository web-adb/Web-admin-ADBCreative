'use client';

import { useEffect, useState } from 'react';
import { FaUser, FaRobot, FaSearch, FaArrowRight, FaTrash, FaCopy } from 'react-icons/fa';
import Link from 'next/link';
import debounce from 'lodash.debounce';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Conversation {
  id: string;
  userInput: string;
  aiResponse: string;
  createdAt: string;
}

export default function LogAI() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/conversation');
        const data = await response.json();
        setConversations(data);
        setFilteredConversations(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Debounce untuk pencarian
  const handleSearch = debounce((query: string) => {
    const filtered = conversations.filter(
      (conversation) =>
        conversation.userInput.toLowerCase().includes(query.toLowerCase()) ||
        conversation.aiResponse.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, 300);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  // Fungsi untuk menghapus chat user atau AI
  const handleDelete = async (id: string, type: 'user' | 'ai') => {
    try {
      await fetch('/api/conversation', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, type }),
      });

      // Update state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id
            ? {
                ...conv,
                userInput: type === 'user' ? '' : conv.userInput,
                aiResponse: type === 'ai' ? '' : conv.aiResponse,
              }
            : conv
        )
      );
      setFilteredConversations((prev) =>
        prev.map((conv) =>
          conv.id === id
            ? {
                ...conv,
                userInput: type === 'user' ? '' : conv.userInput,
                aiResponse: type === 'ai' ? '' : conv.aiResponse,
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  // Fungsi untuk menyalin teks
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">AI Response History</h1>

      {/* Header dengan Pencarian dan Tombol Tanya AI */}
      <div className="flex justify-between items-center mb-6">
        {/* Search Bar */}
        <div className="relative flex-1 mr-4">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
          />
          <FaSearch className="absolute left-3 top-3.5 text-gray-500" />
        </div>

        {/* Tanya AI Button */}
        <Link href="/tanya-AI">
          <div className="flex items-center justify-center bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap">
            <FaRobot className="mr-2" />
            <span>Tanya AI</span>
            <FaArrowRight className="ml-2" />
          </div>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* No Conversations Found */}
      {!isLoading && filteredConversations.length === 0 && (
        <div className="text-center text-gray-500 py-4">No conversations found.</div>
      )}

      {/* Conversation List */}
      <div className="space-y-4">
        {filteredConversations.map((conversation) => (
          <div key={conversation.id} className="space-y-2">
            {/* User Message */}
            {conversation.userInput && (
              <div className="flex items-start space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                  <FaUser className="text-white" />
                </div>
                <div className="bg-blue-100 p-3 rounded-lg max-w-[70%] hover:bg-blue-200 transition-colors">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {conversation.userInput}
                  </ReactMarkdown>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {new Date(conversation.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleCopy(conversation.userInput)}
                      className="text-gray-500 hover:text-blue-500 transition-colors relative group"
                    >
                      <FaCopy />
                      <span className="absolute -top-6 -left-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Copy
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(conversation.id, 'user')}
                      className="text-gray-500 hover:text-red-500 transition-colors relative group"
                    >
                      <FaTrash />
                      <span className="absolute -top-6 -left-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* AI Message */}
            {conversation.aiResponse && (
              <div className="flex items-start space-x-2 justify-end">
                <div className="bg-green-100 p-3 rounded-lg max-w-[70%] hover:bg-green-200 transition-colors">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {conversation.aiResponse}
                  </ReactMarkdown>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {new Date(conversation.createdAt).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleCopy(conversation.aiResponse)}
                      className="text-gray-500 hover:text-green-500 transition-colors relative group"
                    >
                      <FaCopy />
                      <span className="absolute -top-6 -left-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Copy
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(conversation.id, 'ai')}
                      className="text-gray-500 hover:text-red-500 transition-colors relative group"
                    >
                      <FaTrash />
                      <span className="absolute -top-6 -left-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                  <FaRobot className="text-white" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}