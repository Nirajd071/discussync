import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  Flag,
  MoreHorizontal,
  Search,
  Shield,
  Trash2,
  XCircle,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Discussion, Comment, ReportedContent } from '@/types';
import { formatDistanceToNow } from 'date-fns';

const ContentModerationTab: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showResolvedDialog, setShowResolvedDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState<ReportedContent | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolutionAction, setResolutionAction] = useState('warning');

  // Load reported content
  useEffect(() => {
    const loadReportedContent = async () => {
      setIsLoading(true);
      try {
        const data = await api.getReportedContent();
        setReportedContent(data);
        setError(null);
      } catch (err) {
        setError('Failed to load reported content. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReportedContent();
  }, []);

  // Filter content based on search term and status
  const filteredContent = reportedContent.filter(item => {
    const matchesSearch = 
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reporter_username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'pending' && !item.resolved) ||
      (filterStatus === 'resolved' && item.resolved);
    
    return matchesSearch && matchesStatus;
  });

  // Handle bulk selection
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map(item => item.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Handle bulk actions
  const handleBulkAction = async (action: 'resolve' | 'delete') => {
    if (selectedItems.length === 0) return;
    
    try {
      if (action === 'resolve') {
        await api.resolveReportedContent(selectedItems, 'Bulk resolved by moderator', 'warning');
        toast({
          title: 'Reports resolved',
          description: `${selectedItems.length} reports have been resolved.`,
        });
      } else if (action === 'delete') {
        await api.deleteReportedContent(selectedItems);
        toast({
          title: 'Reports deleted',
          description: `${selectedItems.length} reports have been deleted.`,
        });
      }
      
      // Refresh the list
      const data = await api.getReportedContent();
      setReportedContent(data);
      setSelectedItems([]);
    } catch (error) {
      toast({
        title: 'Action failed',
        description: 'Failed to perform the selected action. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle individual item resolution
  const openResolveDialog = (item: ReportedContent) => {
    setCurrentItem(item);
    setResolutionNote('');
    setResolutionAction('warning');
    setShowResolvedDialog(true);
  };

  const handleResolveItem = async () => {
    if (!currentItem) return;
    
    try {
      await api.resolveReportedContent(
        [currentItem.id], 
        resolutionNote, 
        resolutionAction
      );
      
      // Update the local state
      setReportedContent(prev => 
        prev.map(item => 
          item.id === currentItem.id 
            ? { ...item, resolved: true, resolution_note: resolutionNote } 
            : item
        )
      );
      
      toast({
        title: 'Report resolved',
        description: 'The report has been successfully resolved.',
      });
      
      setShowResolvedDialog(false);
    } catch (error) {
      toast({
        title: 'Resolution failed',
        description: 'Failed to resolve the report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Handle viewing the reported content
  const viewReportedContent = (item: ReportedContent) => {
    let url = '';
    
    if (item.content_type === 'discussion') {
      url = `/discussions/${item.content_id}`;
    } else if (item.content_type === 'comment') {
      url = `/discussions/${item.parent_id}#comment-${item.content_id}`;
    } else if (item.content_type === 'user') {
      url = `/users/${item.content_id}`;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" text="Loading reported content..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Failed to load reported content" 
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={selectedItems.length === 0}>
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleBulkAction('resolve')}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Resolve Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleBulkAction('delete')}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {reportedContent.length === 0 ? (
        <EmptyState
          icon={<Shield className="h-12 w-12" />}
          title="No reported content"
          description="There are no content reports to moderate at this time."
          className="py-12"
        />
      ) : filteredContent.length === 0 ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="No matching reports"
          description="No reports match your current search or filter criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setFilterStatus('all');
          }}
          className="py-12"
        />
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleSelectItem(item.id)}
                      aria-label={`Select report ${item.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {item.content}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      item.content_type === 'discussion' ? 'default' :
                      item.content_type === 'comment' ? 'secondary' :
                      'outline'
                    }>
                      {item.content_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.reporter_username}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {item.reason}
                  </TableCell>
                  <TableCell>
                    {item.resolved ? (
                      <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Resolved
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewReportedContent(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Content
                        </DropdownMenuItem>
                        {!item.resolved && (
                          <DropdownMenuItem onClick={() => openResolveDialog(item)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Resolve
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleBulkAction('delete')}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Resolution Dialog */}
      <Dialog open={showResolvedDialog} onOpenChange={setShowResolvedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Report</DialogTitle>
            <DialogDescription>
              Take action on this reported content and mark it as resolved.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="action">Action</Label>
              <Select value={resolutionAction} onValueChange={setResolutionAction}>
                <SelectTrigger id="action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">Send Warning</SelectItem>
                  <SelectItem value="hide">Hide Content</SelectItem>
                  <SelectItem value="delete">Delete Content</SelectItem>
                  <SelectItem value="ban">Ban User</SelectItem>
                  <SelectItem value="none">No Action Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="note">Resolution Note</Label>
              <Input
                id="note"
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Add a note about this resolution"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolvedDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolveItem}>
              Resolve Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentModerationTab;
