import { useState, useRef, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { ScrollArea } from './components/ui/scroll-area'
import { Separator } from './components/ui/separator'
import { Plus, Send, MessageSquare, Search, Settings, User, MoreHorizontal } from 'lucide-react'

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
      {/* Sidebar - Always Visible */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {/* Circular Logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">SH</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Student Haus</h1>
                <p className="text-xs text-gray-500">AI Assistant</p>
              </div>
            </div>
            {/* Circular Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-full p-0 hover:bg-gray-200"
            >
              <Settings className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
          
          {/* Circular New Chat Button */}
          <Button 
            onClick={createNewChat}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full py-3 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center mr-2">
              <Plus className="h-3 w-3" />
            </div>
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            {/* Circular Search Icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-3 w-3 text-gray-400" />
            </div>
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 rounded-full border-gray-200 focus:border-primary"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className={`w-full justify-start p-4 h-auto text-left rounded-xl transition-all duration-200 ${
                  currentChatId === chat.id 
                    ? 'bg-primary/10 border border-primary/20 shadow-sm' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setCurrentChatId(chat.id)}
              >
                {/* Circular Chat Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                  currentChatId === chat.id 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {chat.messages[chat.messages.length - 1]?.content}
                  </p>
                </div>
                {/* Circular More Options */}
                <div className="w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-3 w-3 text-gray-400" />
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            {/* Circular User Avatar */}
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Student User</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
            {/* Circular Online Status */}
            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Circular Chat Avatar */}
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {currentChat?.title || 'Student Haus Chat'}
                </h2>
                <p className="text-sm text-gray-500">AI Assistant • Always here to help</p>
              </div>
            </div>
            {/* Circular Online Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Circular Message Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser 
                    ? 'bg-primary text-white' 
                    : 'bg-gradient-to-br from-accent to-primary text-white'
                }`}>
                  {message.isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <span className="text-xs font-bold">SH</span>
                  )}
                </div>
                
                <div className={`max-w-xs lg:max-w-2xl ${message.isUser ? 'text-right' : ''}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      message.isUser
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-gray-100 text-gray-900 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p className={`text-xs mt-2 ${
                    message.isUser ? 'text-gray-400' : 'text-gray-500'
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
              <div className="flex items-start space-x-3">
                {/* Circular Typing Avatar */}
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">SH</span>
                </div>
                <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl rounded-bl-md">
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
        <div className="border-t border-gray-200 p-6 bg-gray-50/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Message Student Haus..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12 py-3 rounded-full border-gray-200 focus:border-primary shadow-sm"
                />
                {/* Circular Send Button */}
                <Button 
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  className="absolute right-1 top-1 w-8 h-8 rounded-full p-0 bg-primary hover:bg-primary/90 text-white disabled:bg-gray-300 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Student Haus AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App