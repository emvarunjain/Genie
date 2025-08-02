'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger } from '@/lib/logger';
import { UserManagement } from './UserManagement';
import { KnowledgeManagement } from './KnowledgeManagement';

export function AdminDashboard() {
  logger.debug('AdminDashboard rendered');
  return (
    <Tabs defaultValue="users" className="w-full">
      <TabsList>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
        <TabsTrigger value="logging">Logging</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <UserManagement />
      </TabsContent>
      <TabsContent value="knowledge">
        <KnowledgeManagement />
      </TabsContent>
       <TabsContent value="logging">
        <div>Log level management will be here.</div>
      </TabsContent>
    </Tabs>
  );
} 