'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/config';

interface KnowledgeFile {
  id: number;
  filename: string;
  status: 'processing' | 'ingested' | 'failed';
  created_at: string;
}

export function KnowledgeManagement() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>([]);
  const { toast } = useToast();
  const { token } = useAuth();

  const fetchKnowledgeFiles = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/knowledge/files`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch knowledge files.');
      const data = await response.json();
      setKnowledgeFiles(data);
    } catch (error: any) {
      logger.error('Failed to fetch knowledge files:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchKnowledgeFiles();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) setFile(files[0]);
  };

  const handleUpload = async () => {
    if (!file || !token) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/knowledge/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload file.');
      }
      const result = await response.json();
      toast({ title: 'Upload Started', description: result.message });
      fetchKnowledgeFiles(); // Refresh list
    } catch (error: any) {
      toast({ title: 'Upload Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };
  
  const handleDelete = async (fileId: number) => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/knowledge/files/${fileId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete file.');
      }
      const result = await response.json();
      toast({ title: 'Deletion Started', description: result.message });
      fetchKnowledgeFiles(); // Refresh list
    } catch (error: any) {
      toast({ title: 'Deletion Failed', description: error.message, variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: KnowledgeFile['status']) => {
    switch (status) {
      case 'ingested': return <Badge variant="success">Ingested</Badge>;
      case 'processing': return <Badge variant="default">Processing</Badge>;
      case 'failed': return <Badge variant="destructive">Failed</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload New Knowledge</CardTitle>
          <CardDescription>Upload documents (PDF, TXT, DOCX) to expand the agent's knowledge.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="knowledge-file" type="file" onChange={handleFileChange} />
          </div>
          {file && <p className="mt-4 text-sm text-muted-foreground">Selected: {file.name}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Filename</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {knowledgeFiles.length > 0 ? (
                knowledgeFiles.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell>{f.filename}</TableCell>
                    <TableCell>{getStatusBadge(f.status)}</TableCell>
                    <TableCell>{new Date(f.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(f.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No knowledge files uploaded yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 