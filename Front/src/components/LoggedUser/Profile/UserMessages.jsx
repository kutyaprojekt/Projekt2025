import React, { useState, useEffect } from 'react';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const token = localStorage.getItem("usertoken");

  // Üzenetek lekérése
  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:8000/get-messages', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Üzenetek lekérése sikertelen');
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Hiba történt:', error);
    }
  };

  // Üzenet küldése
  const handleSendMessage = async () => {
    if (!newMessage || !receiverId) {
      alert("Kérjük, töltsd ki mindkét mezőt!");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/send-message', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiverId, content: newMessage }),
      });

      if (!response.ok) {
        throw new Error('Üzenet küldése sikertelen');
      }

      const data = await response.json();
      console.log('Üzenet elküldve:', data);
      setNewMessage(''); // Üzenet mező ürítése
      fetchMessages(); // Üzenetek frissítése
    } catch (error) {
      console.error('Hiba történt:', error);
    }
  };

  // Üzenetek betöltése komponens mountolásakor
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
      <div className="p-2 md:p-4">
        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
          <h2 className="pl-6 text-2xl font-bold sm:text-xl">Üzenetek</h2>

          {/* Üzenetek listája */}
          <div className="mt-8 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`p-4 rounded-lg ${message.senderId === parseInt(localStorage.getItem("userId")) ? 'bg-indigo-100 ml-auto' : 'bg-gray-100'}`}>
                <p className="text-sm text-gray-600">{message.sender.username}</p>
                <p className="text-lg">{message.content}</p>
                <p className="text-xs text-gray-500">{new Date(message.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Új üzenet küldése */}
          <div className="mt-8">
            <input
              type="text"
              placeholder="Címzett felhasználó ID-ja"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="w-full p-2 mb-4 border rounded-lg"
            />
            <textarea
              placeholder="Írd ide az üzeneted..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full p-2 border rounded-lg"
              rows="4"
            />
            <button
              onClick={handleSendMessage}
              className="mt-4 px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
            >
              Küldés
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMessages;