import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 p-4">
        <ChatInterface className="h-full" />
      </div>
    </div>
  );
}
