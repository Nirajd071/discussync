import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tag as TagIcon, AlertCircle, Search } from 'lucide-react';
import MainLayout from '@/components/Layout/MainLayout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TagsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState<Array<{ name: string; count: number }>>([]);

  // Simulating loading and error state for now
  React.useEffect(() => {
    const loadTags = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        throw new Error('Failed to load tags');
        // const response = await fetch('/api/tags');
        // const data = await response.json();
        // setTags(data);
      } catch (err) {
        setError('Failed to load tags. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTags();
  }, []);

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Browse Tags
          </h1>
          <p className="text-muted-foreground">
            Explore discussions by topics that interest you
          </p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <Card key={i} className="p-6 space-y-4">
                <div className="h-6 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/2 mx-auto animate-pulse" />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredTags.length === 0 ? (
          <Card className="p-12 text-center">
            <TagIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? 'No matching tags found' : 'No tags available'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? 'Try searching with different keywords'
                : 'Tags will appear here as discussions are created'}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredTags.map((tag) => (
              <Link
                key={tag.name}
                to={`/discussions?tag=${tag.name}`}
                className="block"
              >
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <div className="p-6 text-center">
                    <div className="p-3 rounded-full bg-emerald-100 dark:bg-emerald-500/10 w-fit mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <TagIcon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{tag.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {tag.count} {tag.count === 1 ? 'discussion' : 'discussions'}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TagsPage;
