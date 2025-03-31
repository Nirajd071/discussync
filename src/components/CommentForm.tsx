
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface CommentFormProps {
  initialValue?: string;
  onSubmit: (content: string) => void;
  onCancel?: () => void;
  buttonText?: string;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  initialValue = '',
  onSubmit,
  onCancel,
  buttonText = 'Comment',
  placeholder = 'Add a comment...'
}) => {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(content);
      if (!initialValue) {
        setContent(''); // Clear form if it's not an edit
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] resize-none"
      />
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          size="sm"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : buttonText}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
