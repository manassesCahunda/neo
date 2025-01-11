'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { Terminal } from 'lucide-react';

import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { useUserData } from '@/hooks/userDate';
import {
  app,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from '@neo/firebase';

import { queryOpenai } from './action';
import { SheetDemo } from "./form/page";

const ChatPage = () => {
  const { user: userData } = useUserData();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAvatarText, setShowAvatarText] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [existe, setExiste] = useState(false);
  const db = getFirestore(app);


  useEffect(() => {
    if (userData?.email) {
      const docRef = doc(db, 'personAi', userData.email);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setExiste(true);
        } else {
          setExiste(false);
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: prevMessages.length + 1, sender: 'bot', text: '"Olá! Eu sou o Dia. Não encontrei suas informações, então, por favor, me diga de forma detalhada o que você gostaria que eu fizesse ou o que você deseja que eu seja para você."' },
          ]);
        }
      });

      return () => unsubscribe();
    }
  }, [userData?.email]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const extractPhoneAndMessage = (input: string) => {
    const phoneRegex = /(\d{9})/;
    const phoneMatch = input.match(phoneRegex);

    if (phoneMatch) {
      const phone = phoneMatch[0];
      const message = input.replace(phone, '').trim();
      return { phone, message };
    }

    return { phone: undefined, message: input };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const { phone, message } = extractPhoneAndMessage(inputMessage);

    setMessages((prevMessages) => [
      ...prevMessages,
      { id: prevMessages.length + 1, sender: 'user', text: message },
    ]);

    setInputMessage('');
    setShowAvatarText(false);
    setLoading(true);

    if (!existe) {
     
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: prevMessages.length + 1, sender: 'bot', text: '"O seu desejo será realizado."' },
      ]);

      const docRef = doc(db, 'personAi', userData?.email);

      await setDoc(docRef, {
        content: message,
      });

      setLoading(false);

    } else {
      try {
        const response = await queryOpenai({
          message: message || "O que deseja hoje",
          phone: phone || "900000000",
          email: userData?.email || "default@gmail.com",
          name: userData?.name || "Proprietário dos serviços",
        });

        setMessages((prevMessages) => [
          ...prevMessages,
          { id: prevMessages.length + 1, sender: 'bot', text: response },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
        setLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col text-white justify-between items-center overflow-hidden">
      {showAvatarText && (
        <div className="flex flex-col items-center space-y-6 py-6">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="flex items-center justify-center text-2xl font-semibold text-black">
              CN
            </AvatarFallback>
            <AvatarImage src="https://avatars.githubusercontent.com/u/150891445?s=400&u=cd9aa86506d5e42d87f732eb45fcfadbec4482ee&v=4" alt="Bot" />
          </Avatar>
          <p className="text-xl text-center">👋 Olá! Eu sou o Dia, vemos no v2! 🚀</p>
        </div>
      )}

      <div className="flex-1 w-full max-w-2xl pb-40 p-4 overflow-y-auto scrollbar-hidden space-y-4" style={{ maxHeight: 'calc(100vh - 150px)' }}>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-4 rounded-lg shadow-md ${message.sender === 'user' ? 'text-black' : 'text-white'}`}>
              {message.sender !== 'user' && (
                <div className="flex items-center space-x-2">
                  <Avatar className="w-12 h-12 rounded-none">
                    <AvatarFallback className="flex items-center justify-center text-xl font-semibold text-black">
                      CN
                    </AvatarFallback>
                    <AvatarImage src="https://avatars.githubusercontent.com/u/150891445?s=400&u=cd9aa86506d5e42d87f732eb45fcfadbec4482ee&v=4" alt="Bot" />
                  </Avatar>
                </div>
              )}
              <Terminal className="h-4 w-4 text-white" />
              <Alert>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs p-4 rounded-lg shadow-md bg-gray-700 text-white">
              <p>Processando...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="w-full">
        <footer className="fixed bottom-0 bg-black-200 w-full p-6 pb-10">
          <div className="flex items-center justify-center">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ height: 50, borderRadius: 6, marginLeft: -90 }}
              placeholder="Digite sua mensagem..."
              className="w-full max-w-2xl p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            { (userData?.role === "Owner" || userData?.role === "admin" )?
              (
              
               <div className="ml-10">
                <SheetDemo email={userData?.email}/>
               </div> 
              
              ):  ""
            } 
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;
