
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/components/Layout/MainLayout';
import UserAvatar from '@/components/UserAvatar';
import { api } from '@/lib/api';
import { User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { mockUsers } from '@/lib/mock-data';

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        // In a real app, fetch users from API
        // For now, we'll use the mock data
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load users',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [toast]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled in the effect
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Community Members</h1>
        <Button asChild>
          <Link to="/discussions">
            View Discussions
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md"
          />
          <Button type="submit" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-40 bg-card border rounded-lg p-4 animate-pulse">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 bg-muted rounded-full mb-3"></div>
                <div className="h-5 bg-muted rounded w-20 mb-2"></div>
                <div className="h-4 bg-muted rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-40" />
          <h3 className="text-lg font-medium mb-2">No users found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? `No users match "${searchTerm}"`
              : "There are no users available yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <Link
              key={user.id}
              to={`/users/${user.username}`}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <UserAvatar user={user} size="lg" avatarOnly />
              <h3 className="font-medium mt-3 mb-1">{user.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
              {user.bio && (
                <p className="text-sm line-clamp-2">{user.bio}</p>
              )}
              {user.isAdmin && (
                <Badge variant="outline" className="mt-2 bg-primary/10 text-primary text-xs">
                  Admin
                </Badge>
              )}
            </Link>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default UsersPage;
