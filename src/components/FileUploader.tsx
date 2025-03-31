
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileIcon, ImageIcon, FileArchive } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { Attachment } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface FileUploaderProps {
  onFileUploaded: (attachment: Attachment) => void;
  onFileRemoved?: (id: string) => void;
  uploadedFiles?: Attachment[];
  maxSize?: number; // in MB
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  onFileRemoved,
  uploadedFiles = [],
  maxSize = 50 // Default max 50MB
}) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />;
    } else if (fileType.includes('zip') || fileType.includes('archive')) {
      return <FileArchive className="h-4 w-4" />;
    } else {
      return <FileIcon className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleUpload = async (file: File) => {
    // Check file size
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSize) {
      toast({
        title: 'File too large',
        description: `Maximum file size is ${maxSize}MB`,
        variant: 'destructive',
      });
      return;
    }

    // Create a unique id for this upload
    const uploadId = `upload-${Date.now()}`;
    
    // Initialize progress
    setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));
    
    // Simulate upload progress (in a real app, this would come from the actual upload)
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[uploadId] || 0;
        if (currentProgress >= 100) {
          clearInterval(progressInterval);
          return prev;
        }
        return { ...prev, [uploadId]: Math.min(currentProgress + 10, 95) };
      });
    }, 300);

    try {
      // Perform actual upload
      const attachment = await api.uploadFile(file);
      
      // Complete the progress
      setUploadProgress(prev => ({ ...prev, [uploadId]: 100 }));
      
      // Clear progress after a short delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const { [uploadId]: _, ...rest } = prev;
          return rest;
        });
      }, 1000);
      
      // Notify parent component
      onFileUploaded(attachment);
      
      toast({
        title: 'File uploaded',
        description: `${file.name} was successfully uploaded`,
      });
      
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred during upload',
        variant: 'destructive',
      });
    } finally {
      clearInterval(progressInterval);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
    
    // Reset input value to allow uploading the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleRemoveFile = (id: string) => {
    if (onFileRemoved) {
      onFileRemoved(id);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <div className="text-sm font-medium mb-1">Drag and drop a file here</div>
        <p className="text-xs text-muted-foreground mb-3">
          Support file up to {maxSize}MB
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose file
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      {/* Show uploading files with progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([id, progress]) => (
            <div key={id} className="bg-secondary p-3 rounded-md">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <FileIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          ))}
        </div>
      )}

      {/* Show uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Uploaded files</h4>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="bg-secondary p-3 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                {getFileIcon(file.type)}
                <div className="ml-2 overflow-hidden">
                  <p className="text-sm font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemoveFile(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
