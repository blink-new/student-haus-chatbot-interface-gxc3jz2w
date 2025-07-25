import { useState, useRef, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { ScrollArea } from './components/ui/scroll-area'
import { Separator } from './components/ui/separator'
import { Plus, Send, MessageSquare, Search, Menu, X } from 'lucide-react'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  lastMessage: Date
}

function App() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Welcome to Student Haus',
      messages: [
        {
          id: '1',
          content: 'Hello! Welcome to Student Haus. How can I help you today?',
          isUser: false,
          timestamp: new Date()
        }
      ],
      lastMessage: new Date()
    }
  ])
  
  const [currentChatId, setCurrentChatId] = useState('1')
  const [inputMessage, setInputMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentChat = chats.find(chat => chat.id === currentChatId)
  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [
        {
          id: Date.now().toString(),
          content: 'Hello! How can I assist you with Student Haus today?',
          isUser: false,
          timestamp: new Date()
        }
      ],
      lastMessage: new Date()
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setSidebarOpen(false)
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentChat) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    }

    // Add user message
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, userMessage],
            lastMessage: new Date(),
            title: chat.title === 'New Chat' ? inputMessage.slice(0, 30) + '...' : chat.title
          }
        : chat
    ))

    setInputMessage('')
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Thank you for your message about "${inputMessage}". As a Student Haus assistant, I'm here to help you with any questions about our services, accommodations, or student life. How else can I assist you today?`,
        isUser: false,
        timestamp: new Date()
      }

      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, botMessage],
              lastMessage: new Date()
            }
          : chat
      ))
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-gray-50 border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SH</span>
                </div>
                <h1 className="text-lg font-semibold text-gray-900">Student Haus</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              onClick={createNewChat}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Search */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <Button
                  key={chat.id}
                  variant={currentChatId === chat.id ? "secondary" : "ghost"}
                  className={`w-full justify-start p-3 h-auto text-left ${
                    currentChatId === chat.id 
                      ? 'bg-primary/10 border-l-2 border-primary' 
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setCurrentChatId(chat.id)
                    setSidebarOpen(false)
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {chat.messages[chat.messages.length - 1]?.content}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold text-gray-900">
                {currentChat?.title || 'Student Haus Chat'}
              </h2>
            </div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-primary-foreground/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex space-x-2">
              <Input
                placeholder="Message Student Haus..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Student Haus AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App