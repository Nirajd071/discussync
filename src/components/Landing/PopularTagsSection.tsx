
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tag, ChevronRight } from 'lucide-react';

const PopularTagsSection: React.FC = () => {
  const tags = [
    { name: "React", discussions: 145, color: "bg-red-500/10", textColor: "text-red-500" },
    { name: "Python", discussions: 98, color: "bg-red-600/10", textColor: "text-red-600" },
    { name: "DevOps", discussions: 67, color: "bg-red-700/10", textColor: "text-red-700" },
    { name: "UI/UX", discussions: 54, color: "bg-red-800/10", textColor: "text-red-800" },
    { name: "JavaScript", discussions: 124, color: "bg-red-500/10", textColor: "text-red-500" },
    { name: "Database", discussions: 36, color: "bg-red-700/10", textColor: "text-red-700" },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Popular Tags</h2>
          <Button variant="ghost" asChild>
            <Link to="/tags">
              View all tags <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tags.map((tag, index) => (
            <Link
              key={index}
              to={`/discussions?tag=${tag.name}`}
              className="flex flex-col items-center justify-center p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-full ${tag.color} mb-3`}>
                <Tag className={`h-5 w-5 ${tag.textColor}`} />
              </div>
              <span className="font-medium">{tag.name}</span>
              <span className="text-xs text-muted-foreground">{tag.discussions} discussions</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTagsSection;
