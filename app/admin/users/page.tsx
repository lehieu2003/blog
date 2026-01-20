'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDate } from '@/lib/helpers';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    newRole: 'user' | 'admin',
  ) => {
    setUpdating(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user,
          ),
        );
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update user role');
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-4xl font-bold'>Manage Users</h1>
            <p className='text-muted-foreground mt-2'>
              Total users: {users.length}
            </p>
          </div>
          <Link href='/admin'>
            <Button variant='outline'>Back to Dashboard</Button>
          </Link>
        </div>

        {users.length === 0 ? (
          <Card className='p-12'>
            <p className='text-muted-foreground text-center'>No users found.</p>
          </Card>
        ) : (
          <div className='space-y-4'>
            {users.map((user) => (
              <Card
                key={user._id}
                className='hover:shadow-md transition-shadow'
              >
                <CardHeader>
                  <div className='flex justify-between items-start gap-4'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2 mb-2'>
                        {user.role === 'admin' ? (
                          <Shield className='w-5 h-5 text-primary' />
                        ) : (
                          <UserIcon className='w-5 h-5 text-muted-foreground' />
                        )}
                        <CardTitle className='text-xl'>{user.name}</CardTitle>
                      </div>
                      <CardDescription className='flex flex-col gap-1'>
                        <span className='text-sm'>{user.email}</span>
                        <span className='text-xs'>
                          Joined {formatDate(user.createdAt)}
                        </span>
                      </CardDescription>
                    </div>
                    <div className='flex items-center gap-3 flex-shrink-0'>
                      <div className='w-32'>
                        <Select
                          value={user.role}
                          onValueChange={(value) =>
                            handleRoleChange(
                              user._id,
                              value as 'user' | 'admin',
                            )
                          }
                          disabled={updating === user._id}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='user'>User</SelectItem>
                            <SelectItem value='admin'>Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDelete(user._id)}
                        title='Delete User'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
