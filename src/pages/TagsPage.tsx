
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  Tag as TagIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/Layout/MainLayout';
import { api } from '@/lib/api';
import { Tag } from '@/types';
import { useToast } from '@/hooks/use-toast';

const TagsPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadTags = async () => {
      try {
        setIsLoading(true);
        const data = await api.getTags();
        setTags(data);
        setFilteredTags(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load tags',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, [toast]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTags(tags);
    } else {
      const filtered = tags.filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTags(filtered);
    }
  }, [searchTerm, tags]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled in the effect
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Tags</h1>
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
            placeholder="Search tags..."
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
            <div key={i} className="h-32 bg-card border rounded-lg p-4 animate-pulse">
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 bg-muted rounded-full mr-2"></div>
                <div className="h-5 bg-muted rounded w-20"></div>
              </div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredTags.length === 0 ? (
        <div className="text-center py-12">
          <TagIcon className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-40" />
          <h3 className="text-lg font-medium mb-2">No tags found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm
              ? `No tags match "${searchTerm}"`
              : "There are no tags available yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTags.map((tag) => (
            <Link
              key={tag.id}
              to={`/discussions?tag=${tag.name}`}
              className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <TagIcon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium">{tag.name}</h3>
              </div>
              {tag.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {tag.description}
                </p>
              )}
              <p className="text-xs font-medium">
                {tag.count} {tag.count === 1 ? 'discussion' : 'discussions'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default TagsPage;
