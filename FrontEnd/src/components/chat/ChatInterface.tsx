"use client";

import { useState, useRef, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CodeBlock, dracula } from 'react-code-blocks';
import { logger } from '@/lib/logger';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  className?: string;
}

const CodeSnippet = memo(({ language, value }: { language: string, value: string }) => {
  return (
    <div className="my-2">
      <CodeBlock
        text={value}
        language={language}
        theme={dracula}
        showLineNumbers={true}
      />
    </div>
  );
});
CodeSnippet.displayName = 'CodeSnippet';

export default function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    logger.debug('ChatInterface mounted');
    return () => {
      logger.debug('ChatInterface unmounted');
    };
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
    logger.debug('Chat messages updated', { messageCount: messages.length });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        let errorMessage = 'An unexpected error occurred.';
        try {
          // Check if the response is JSON, otherwise use text
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errData = await response.json();
            errorMessage = errData.error || errData.detail || 'Failed to get a response from the agent.';
          } else {
            errorMessage = await response.text();
          }
        } catch (_e) {
          errorMessage = 'Failed to parse error response.';
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (data.timestamp || Date.now()).toString(),
        role: 'assistant',
        content: data.response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
          id: 'error-' + Date.now().toString(),
          role: 'assistant',
          content: `Sorry, something went wrong: ${err.message}`
      };
      setMessages(prev => [...prev, errorMessage]);
      setError(err.message); // You can still keep the state for other UI elements
    } finally {
      setIsLoading(false);
    }

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      const syntheticEvent = e as unknown as React.FormEvent;
      handleSendMessage(syntheticEvent);
    }
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Start a conversation by typing a message below.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      code({ node, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const codeValue = String(children).replace(/\n$/, '');
                        return match ? (
                          <CodeSnippet
                            language={match[1]}
                            value={codeValue}
                          />
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                logger.debug('Chat input updated', { 
                  length: e.target.value.length 
                });
              }}
              onKeyPress={(e) => handleKeyPress(e)}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
} 