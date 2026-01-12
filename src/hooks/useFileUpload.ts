import { useState, useCallback } from 'react';

export function useFileUpload(onFileLoaded: (content: string) => void) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.xml')) {
      alert('Please upload a valid XML file');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileLoaded(content);
      setIsLoading(false);
    };

    reader.onerror = () => {
      alert('Failed to read file');
      setIsLoading(false);
    };

    reader.readAsText(file);
  }, [onFileLoaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  return {
    isDragging,
    isLoading,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileSelect,
  };
}
