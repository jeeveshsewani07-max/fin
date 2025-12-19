import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Mic, Heart, Calendar, Phone, Car, Receipt, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';

interface Message {
  id: string;
  sender: string;
  message: string;
  time: string;
  sent: boolean;
  type?: 'text' | 'task' | 'suggestion';
}

interface QuickTask {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  action: string;
  category: 'health' | 'family' | 'emergency' | 'daily';
}

export function ChatBot() {
  const { settings, setCurrentPage } = useApp();
  const t = useTranslation(settings.language);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Assistant',
      message: settings.language === 'hindi' 
        ? '🙏 नमस्ते! मैं आपका डिजिटल सहायक हूं। मैं आपकी दवाईयों, डॉक्टर की अपॉइंटमेंट्स, और अन्य कामों में मदद कर सकता हूं। आप क्या चाहेंगे?'
        : '🙏 Hello! I\'m your digital assistant. I can help you with medicines, doctor appointments, family contacts, and daily tasks. What would you like to do?',
      time: '9:00 AM',
      sent: false,
      type: 'text'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickTasks: QuickTask[] = [
    {
      id: 'medicine-reminder',
      title: settings.language === 'hindi' ? 'दवाई रिमाइंडर' : 'Medicine Reminder',
      icon: Heart,
      description: settings.language === 'hindi' ? 'दवाई का समय सेट करें' : 'Set medicine schedule',
      action: 'SET_MEDICINE_REMINDER',
      category: 'health'
    },
    {
      id: 'find-doctor',
      title: settings.language === 'hindi' ? 'डॉक्टर खोजें' : 'Find Doctor',
      icon: Phone,
      description: settings.language === 'hindi' ? 'नजदीकी डॉक्टर ढूंढें' : 'Find nearby doctors',
      action: 'FIND_DOCTOR',
      category: 'health'
    },
    {
      id: 'book-appointment',
      title: settings.language === 'hindi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment',
      icon: Calendar,
      description: settings.language === 'hindi' ? 'डॉक्टर की अपॉइंटमेंट' : 'Schedule doctor visit',
      action: 'BOOK_APPOINTMENT',
      category: 'health'
    },
    {
      id: 'emergency-help',
      title: settings.language === 'hindi' ? 'आपातकालीन सहायता' : 'Emergency Help',
      icon: AlertTriangle,
      description: settings.language === 'hindi' ? 'तत्काल सहायता' : 'Immediate assistance',
      action: 'EMERGENCY_HELP',
      category: 'emergency'
    },
    {
      id: 'book-ride',
      title: settings.language === 'hindi' ? 'राइड बुक करें' : 'Book Ride',
      icon: Car,
      description: settings.language === 'hindi' ? 'टैक्सी या ऑटो बुक करें' : 'Book taxi or auto',
      action: 'BOOK_RIDE',
      category: 'daily'
    },
    {
      id: 'check-bills',
      title: settings.language === 'hindi' ? 'बिल देखें' : 'Check Bills',
      icon: Receipt,
      description: settings.language === 'hindi' ? 'बकाया बिल देखें' : 'View pending bills',
      action: 'CHECK_BILLS',
      category: 'daily'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuickTask = async (task: QuickTask) => {
    setIsSending(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'You',
      message: task.title,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      type: 'task'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsTyping(false);

    let response = '';
    let action = '';

    switch (task.action) {
      case 'SET_MEDICINE_REMINDER':
        response = settings.language === 'hindi'
          ? '✅ मैं आपके लिए दवाई का रिमाइंडर सेट कर रहा हूं। Health पेज खोल रहा हूं...'
          : '✅ I\'ll help you set a medicine reminder. Opening Health page...';
        action = 'health';
        break;
      case 'FIND_DOCTOR':
        response = settings.language === 'hindi'
          ? '🔍 मैं आपके लिए नजदीकी डॉक्टर खोज रहा हूं। Find Doctor पेज खोल रहा हूं...'
          : '🔍 I\'m searching for nearby doctors for you. Opening Find Doctor page...';
        action = 'findDoctor';
        break;
      case 'BOOK_APPOINTMENT':
        response = settings.language === 'hindi'
          ? '📅 मैं आपके लिए डॉक्टर की अपॉइंटमेंट बुक करूंगा। Find Doctor पेज खोल रहा हूं...'
          : '📅 I\'ll help you book a doctor appointment. Opening Find Doctor page...';
        action = 'findDoctor';
        break;
      case 'EMERGENCY_HELP':
        response = settings.language === 'hindi'
          ? '🚨 आपातकालीन सहायता! SOS पेज खोल रहा हूं। यदि यह वास्तविक आपातकाल है, तो 108 डायल करें।'
          : '🚨 Emergency assistance! Opening SOS page. If this is a real emergency, please dial 108.';
        action = 'sos';
        break;
      case 'BOOK_RIDE':
        response = settings.language === 'hindi'
          ? '🚗 मैं आपके लिए राइड बुक करूंगा। Rides पेज खोल रहा हूं...'
          : '🚗 I\'ll help you book a ride. Opening Rides page...';
        action = 'rides';
        break;
      case 'CHECK_BILLS':
        response = settings.language === 'hindi'
          ? '📄 आपके बकाया बिल दिखा रहा हूं। Bills पेज खोल रहा हूं...'
          : '📄 Showing your pending bills. Opening Bills page...';
        action = 'bills';
        break;
      default:
        response = settings.language === 'hindi'
          ? 'मैं इस कार्य में आपकी सहायता करूंगा।'
          : 'I\'ll help you with this task.';
    }

    const aiMessage: Message = {
      id: Date.now().toString() + '1',
      sender: 'Assistant',
      message: response,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      sent: false,
      type: 'suggestion'
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsSending(false);

    // Navigate to appropriate page and close chat after a delay
    if (action) {
      setTimeout(() => {
        setCurrentPage(action as any);
        setIsOpen(false);
      }, 2000);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() && !isSending) {
      setIsSending(true);
      const userMessage: Message = {
        id: Date.now().toString(),
        sender: 'You',
        message: message,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sent: true,
        type: 'text'
      };

      setMessages(prev => [...prev, userMessage]);
      const currentMessage = message;
      setMessage('');
      setIsTyping(true);

      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setIsTyping(false);

      let response = '';
      const lowerMessage = currentMessage.toLowerCase();
      
      if (lowerMessage.includes('medicine') || lowerMessage.includes('दवाई')) {
        response = settings.language === 'hindi'
          ? 'मैं आपकी दवाई के साथ मदद कर सकता हूं। Health पेज खोल रहा हूं...'
          : 'I can help you with your medicines. Opening Health page...';
        setTimeout(() => {
          setCurrentPage('health');
          setIsOpen(false);
        }, 2000);
      } else if (lowerMessage.includes('doctor') || lowerMessage.includes('डॉक्टर')) {
        response = settings.language === 'hindi'
          ? 'डॉक्टर खोजने में मदद कर रहा हूं। Find Doctor पेज खोल रहा हूं...'
          : 'I\'m helping you find a doctor. Opening Find Doctor page...';
        setTimeout(() => {
          setCurrentPage('findDoctor');
          setIsOpen(false);
        }, 2000);
      } else if (lowerMessage.includes('emergency') || lowerMessage.includes('आपातकाल')) {
        response = settings.language === 'hindi'
          ? 'आपातकालीन सहायता के लिए SOS पेज खोल रहा हूं...'
          : 'Opening SOS page for emergency assistance...';
        setTimeout(() => {
          setCurrentPage('sos');
          setIsOpen(false);
        }, 2000);
      } else {
        response = settings.language === 'hindi'
          ? 'मैं समझ गया। आप नीचे दिए गए Quick Tasks का उपयोग कर सकते हैं या मुझसे कुछ और पूछ सकते हैं।'
          : 'I understand. You can use the Quick Tasks below or ask me something else.';
      }

      const aiMessage: Message = {
        id: Date.now().toString() + '1',
        sender: 'Assistant',
        message: response,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sent: false,
        type: 'text'
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsSending(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health': return 'bg-red-100 text-red-800 border-red-200';
      case 'family': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'emergency': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'daily': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 group animate-pulse hover:animate-none"
        aria-label={settings.language === 'hindi' ? 'AI सहायक खोलें' : 'Open AI Assistant'}
      >
        <Bot size={24} className="group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 animate-in slide-in-from-bottom-4 duration-300">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <Bot size={20} className="text-primary" />
              {settings.language === 'hindi' ? 'AI सहायक' : 'AI Assistant'}
            </DialogTitle>
            <DialogDescription>
              {settings.language === 'hindi' 
                ? 'आपका व्यक्तिगत AI सहायक। दवाईयों, डॉक्टर अपॉइंटमेंट्स, और दैनिक कामों में सहायता के लिए।'
                : 'Your personal AI assistant for medicines, doctor appointments, and daily tasks.'}
            </DialogDescription>
          </DialogHeader>

          {/* Quick Tasks */}
          <div className="px-6 py-4 border-b">
            <h4 className="font-medium mb-3">
              {settings.language === 'hindi' ? '🚀 त्वरित कार्य' : '🚀 Quick Tasks'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {quickTasks.map((task, index) => {
                const IconComponent = task.icon;
                return (
                  <button
                    key={task.id}
                    onClick={() => handleQuickTask(task)}
                    disabled={isSending}
                    className="p-3 text-left border rounded-lg hover:bg-accent hover:scale-[1.02] transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed animate-in fade-in-50 slide-in-from-left-5"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <IconComponent size={16} className="text-primary transition-transform group-hover:scale-110" />
                      <span className="font-medium text-sm">{task.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                    <Badge variant="outline" className={`mt-1 text-xs ${getCategoryColor(task.category)}`}>
                      {task.category}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto px-6 py-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={msg.id || index} 
                  className={`flex ${msg.sent ? 'justify-end' : 'justify-start'} animate-in fade-in-50 slide-in-from-${msg.sent ? 'right' : 'left'}-4 duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                    msg.sent 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }`}>
                    {!msg.sent && (
                      <div className="flex items-center gap-1 mb-1">
                        <Bot size={12} className="animate-pulse" />
                        <p className="text-xs font-medium">Assistant</p>
                      </div>
                    )}
                    <p className="text-lg">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-in fade-in-50 slide-in-from-left-4 duration-300">
                  <div className="bg-accent text-accent-foreground px-4 py-3 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Bot size={12} />
                      <p className="text-xs font-medium">Assistant</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t px-6 py-4 bg-background/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={settings.language === 'hindi' ? 'अपना संदेश टाइप करें...' : 'Type your message...'}
                  className="pr-12 h-12 transition-all duration-200 focus:shadow-lg"
                  disabled={isSending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  disabled={!message.trim() || isSending}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-200 hover:scale-105"
                >
                  {isSending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </div>
              <Button 
                variant="outline" 
                size="lg"
                className="transition-all duration-200 hover:scale-105 hover:bg-accent"
              >
                <Mic size={20} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}