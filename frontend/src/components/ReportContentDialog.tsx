import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Flag, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ReportContentDialogProps {
  contentType: 'discussion' | 'comment' | 'user';
  contentId: string;
  trigger?: React.ReactNode;
  onReportSubmitted?: () => void;
}

const ReportContentDialog: React.FC<ReportContentDialogProps> = ({
  contentType,
  contentId,
  trigger,
  onReportSubmitted
}) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonType, setReasonType] = useState('inappropriate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide details about why you are reporting this content.',
        variant: 'destructive',
      });
      return;
    }
    
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to report content.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Format the reason with the selected type
      const formattedReason = `${reasonType.toUpperCase()}: ${reason}`;
      
      // Submit the report
      await api.reportContent(contentType, contentId, formattedReason);
      
      toast({
        title: 'Report submitted',
        description: 'Thank you for helping keep our community safe. Our moderators will review your report.',
      });
      
      // Close the dialog
      setOpen(false);
      
      // Reset form
      setReason('');
      setReasonType('inappropriate');
      
      // Call the callback if provided
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (error) {
      toast({
        title: 'Failed to submit report',
        description: 'An error occurred while submitting your report. Please try again.',
        variant: 'destructive',
      });
      console.error('Report submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
            Report Content
          </DialogTitle>
          <DialogDescription>
            Report inappropriate or violating content to our moderators.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="reason-type">Reason for reporting</Label>
            <RadioGroup 
              id="reason-type" 
              value={reasonType} 
              onValueChange={setReasonType}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inappropriate" id="inappropriate" />
                <Label htmlFor="inappropriate" className="cursor-pointer">Inappropriate content</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spam" id="spam" />
                <Label htmlFor="spam" className="cursor-pointer">Spam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="harassment" id="harassment" />
                <Label htmlFor="harassment" className="cursor-pointer">Harassment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="misinformation" id="misinformation" />
                <Label htmlFor="misinformation" className="cursor-pointer">Misinformation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="cursor-pointer">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              placeholder="Please provide specific details about why you are reporting this content..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Flag className="mr-2 h-4 w-4" />
                  Submit Report
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportContentDialog;
