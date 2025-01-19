"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Menu, X } from 'lucide-react';
import ChatView from "../components/chat-view";
import { Chat, Message } from "../types/chat";

const users: Chat[] = [
  {
    id: 1,
    name: "Анна С.",
    message: "Привет! Как дела?",
    time: "14:30",
    unread: 2,
  },
  {
    id: 2,
    name: "Иван П.",
    message: "Спасибо за игру!",
    time: "Вчера",
    unread: 0,
  },
  {
    id: 3,
    name: "Мария К.",
    message: "Когда следующая встреча?",
    time: "Пн",
    unread: 1,
  },
  {
    id: 4,
    name: "Алексей Д.",
    message: "Отличная сделка!",
    time: "Вс",
    unread: 0,
  },
  {
    id: 5,
    name: "Ольга В.",
    message: "Новые предложения?",
    time: "Пт",
    unread: 3,
  },
];

function ChatsPageContent() {
  const [chats, setChats] = useState<Chat[]>(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatMessages, setChatMessages] = useState<{
    [chatId: number]: Message[];
  }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedChatId = searchParams.get("chatId");

  const selectedChat = chats.find((chat) => chat.id === Number(selectedChatId));

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleChatClick = (chat: Chat) => {
    router.push(`/chats?chatId=${chat.id}`);
    setChats((prevChats) =>
      prevChats.map((c) => (c.id === chat.id ? { ...c, unread: 0 } : c))
    );
    setIsSidebarOpen(false);
  };

  const handleSendMessage = useCallback(
    (chatId: number, message: string) => {
      const newMessage: Message = {
        id: Date.now(),
        senderId: 0,
        text: message,
        timestamp: new Date(),
      };

      setChatMessages((prevMessages) => ({
        ...prevMessages,
        [chatId]: [...(prevMessages[chatId] || []), newMessage],
      }));

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? { ...chat, message: message, time: "Сейчас" }
            : chat
        )
      );

      // Simulate receiving a message from the other user after a short delay
      setTimeout(() => {
        const receivedMessage: Message = {
          id: Date.now(),
          senderId: chatId,
          text: `Это автоматический ответ на: "${message}"`,
          timestamp: new Date(),
        };
        setChatMessages((prevMessages) => ({
          ...prevMessages,
          [chatId]: [...(prevMessages[chatId] || []), receivedMessage],
        }));

        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  message: receivedMessage.text,
                  time: "Сейчас",
                  unread:
                    chat.id === Number(selectedChatId)
                      ? chat.unread
                      : chat.unread + 1,
                }
              : chat
          )
        );
      }, 1000 + Math.random() * 2000);
    },
    [selectedChatId]
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-[calc(100vh-70px)] bg-dark">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-[350px] lg:flex lg:flex-col`}
      >
        <div className="flex justify-between items-center  border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="h-6 w-6 text-white" />
          </Button>
        </div>
        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="w-full pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              placeholder="Поиск"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center gap-3 p-4 hover:bg-gray-800 cursor-pointer ${
                selectedChatId === chat.id.toString() ? "bg-black" : ""
              }`}
              onClick={() => handleChatClick(chat)}
            >
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/100?u=${chat.id}`} />
                <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h2 className="text-sm font-medium text-white truncate">
                    {chat.name}
                  </h2>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{chat.message}</p>
              </div>
              {chat.unread > 0 && (
                <div className="bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>

        {/* New Chat Button */}
        <div className="p-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Новый чат
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar for mobile */}
        <div className="lg:hidden flex items-center p-4 border-b border-gray-800">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu className="h-6 w-6 text-white" />
          </Button>
          {selectedChat && (
            <div className="flex items-center">
              <Avatar className="mr-2">
                <AvatarImage
                  src={`https://i.pravatar.cc/100?u=${selectedChat.id}`}
                />
                <AvatarFallback>{selectedChat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-medium text-white">
                {selectedChat.name}
              </h2>
            </div>
          )}
        </div>

        {/* Chat View */}
        <div className="flex-1">
          {selectedChat ? (
            <ChatView
              chat={selectedChat}
              messages={chatMessages[Number(selectedChatId)] || []}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Выберите чат для начала общения
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatsPageContent />
    </Suspense>
  );
}

