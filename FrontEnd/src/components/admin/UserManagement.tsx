'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from "@/components/ui/checkbox"
import { getUsers, updateUser, deleteUser } from '@/app/actions/adminActions';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  chat_requests_count: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const { toast } = useToast();
  const { token } = useAuth();

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const fetchedUsers = await getUsers(token);
      setUsers(fetchedUsers);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: 'Could not retrieve user list.',
        variant: 'destructive',
      });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleSelectUser = (userId: number, checked: boolean) => {
    setSelectedUserIds(prev =>
      checked ? [...prev, userId] : prev.filter(id => id !== userId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(users.map(user => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleDisableSelected = async () => {
    if (!token) return;
    try {
      await Promise.all(
        selectedUserIds.map(id => updateUser(id, { is_active: false }, token))
      );
      toast({ title: 'Success', description: 'Selected users have been disabled.' });
      fetchUsers(); // Refresh users
      setSelectedUserIds([]); // Clear selection
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to disable users.', variant: 'destructive' });
      console.error(error);
    }
  };

  const handleDeleteSelected = async () => {
    if (!token) return;
    try {
      await Promise.all(
        selectedUserIds.map(id => deleteUser(id, token))
      );
      toast({ title: 'Success', description: 'Selected users have been deleted.' });
      fetchUsers(); // Refresh users
      setSelectedUserIds([]); // Clear selection
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete users.', variant: 'destructive' });
      console.error(error);
    }
  };


  const areAnyUsersSelected = selectedUserIds.length > 0;

  return (
    <div>
        <div className="flex items-center gap-2 mb-4">
            <Button
                onClick={handleDisableSelected}
                disabled={!areAnyUsersSelected}
            >
                Disable Selected
            </Button>
            <Button
                variant="destructive"
                onClick={handleDeleteSelected}
                disabled={!areAnyUsersSelected}
            >
                Delete Selected
            </Button>
        </div>
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>
                <Checkbox
                    onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                    checked={selectedUserIds.length === users.length && users.length > 0}
                />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Chats</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {users.map((user) => (
                <TableRow key={user.id}>
                <TableCell>
                    <Checkbox
                    onCheckedChange={(checked) => handleSelectUser(user.id, Boolean(checked))}
                    checked={selectedUserIds.includes(user.id)}
                    />
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>{user.is_admin ? 'Yes' : 'No'}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{user.chat_requests_count}</TableCell>
                </TableRow>
            ))}
            </TableBody>
        </Table>
    </div>
  );
} 