import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tag, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const PopularTagsSection: React.FC = () => {
  const tags = [
    { name: "React", discussions: 145, delay: 0 },
    { name: "Python", discussions: 98, delay: 100 },
    { name: "DevOps", discussions: 67, delay: 200 },
    { name: "UI/UX", discussions: 54, delay: 300 },
    { name: "JavaScript", discussions: 124, delay: 400 },
    { name: "Database", discussions: 36, delay: 500 },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              Popular Tags
            </h2>
            <p className="text-muted-foreground">
              Explore discussions by your favorite topics
            </p>
          </div>
          <Button 
            variant="outline" 
            className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/50"
            asChild
          >
            <Link to="/tags" className="flex items-center">
              View all tags <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tags.map((tag, index) => (
            <Card
              key={index}
              className="group border-red-100 dark:border-red-950 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 animate-fade-in opacity-0"
              style={{ animationDelay: `${tag.delay}ms` }}
            >
              <Link
                to={`/discussions?tag=${tag.name}`}
                className="flex flex-col items-center justify-center p-4"
              >
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-500/10 mb-3 group-hover:scale-110 transition-transform">
                  <Tag className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-medium text-foreground">{tag.name}</span>
                <span className="text-xs text-muted-foreground mt-1">{tag.discussions} discussions</span>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTagsSection;
