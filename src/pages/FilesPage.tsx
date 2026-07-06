import { useState } from 'react';
import {
  FileText,
  Image,
  FileSpreadsheet,
  Presentation,
  Archive,
  Folder,
  Upload,
  Grid3X3,
  List,
  Trash2,
  Eye,
} from 'lucide-react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useApp } from '@/context/AppContext';
import { formatFileSize, formatRelative } from '@/utils/helpers';
import type { FileItem, FileType } from '@/types';
import { cn } from '@/utils/cn';

const fileIcons: Record<FileType, typeof FileText> = {
  document: FileText,
  image: Image,
  spreadsheet: FileSpreadsheet,
  presentation: Presentation,
  archive: Archive,
  other: Folder,
};

export function FilesPage() {
  const { files, projects, users, uploadFile, deleteFile, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projectFilter, setProjectFilter] = useState('all');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadName, setUploadName] = useState('');

  const filtered = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === 'all' || f.projectId === projectFilter;
    return matchesSearch && matchesProject && f.size > 0;
  });

  const handleUpload = () => {
    if (!uploadName.trim()) return;
    uploadFile({
      name: uploadName,
      type: 'document',
      size: Math.floor(Math.random() * 5000000) + 10000,
      projectId: projects[0]?.id ?? 'proj-1',
      folderId: null,
      uploadedBy: currentUser?.id ?? 'user-1',
      url: '#',
    });
    setUploadName('');
    setUploadOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: 'Files' }]} />
          <h1 className="text-2xl font-bold mt-2">Files</h1>
          <p className="text-muted text-sm mt-1">{files.length} files across all projects</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4" /> Upload File
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search files..." className="flex-1" />
        <FilterDropdown
          label="Project"
          value={projectFilter}
          onChange={setProjectFilter}
          options={[
            { value: 'all', label: 'All Projects' },
            ...projects.map((p) => ({ value: p.id, label: p.name })),
          ]}
        />
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={cn('p-2.5', viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-slate-50')}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn('p-2.5', viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-slate-50')}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No files found"
          description="Upload files to share with your team."
          action={<Button onClick={() => setUploadOpen(true)}><Upload className="h-4 w-4" /> Upload File</Button>}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((file) => {
            const Icon = fileIcons[file.type];
            const uploader = users.find((u) => u.id === file.uploadedBy);
            const project = projects.find((p) => p.id === file.projectId);

            return (
              <Card key={file.id} hover className="group">
                <div className="flex items-center justify-center h-24 rounded-lg bg-slate-50 mb-3">
                  <Icon className="h-10 w-10 text-muted" />
                </div>
                <h3 className="text-sm font-medium truncate">{file.name}</h3>
                <p className="text-xs text-muted mt-1">{formatFileSize(file.size)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{project?.name}</Badge>
                </div>
                <p className="text-xs text-muted mt-2">
                  {uploader?.name} · {formatRelative(file.uploadedAt)}
                </p>
                <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => setPreviewFile(file)}>
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteId(file.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-danger" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card padding="none">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50/80">
                <th className="px-4 py-3 text-left font-medium text-muted">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Project</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Size</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Uploaded</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((file) => {
                const Icon = fileIcons[file.type];
                const project = projects.find((p) => p.id === file.projectId);
                return (
                  <tr key={file.id} className="border-b border-border last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted" />
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{project?.name}</td>
                    <td className="px-4 py-3 text-muted">{formatFileSize(file.size)}</td>
                    <td className="px-4 py-3 text-muted">{formatRelative(file.uploadedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setPreviewFile(file)} className="p-1.5 rounded-lg hover:bg-slate-100">
                          <Eye className="h-4 w-4 text-muted" />
                        </button>
                        <button onClick={() => setDeleteId(file.id)} className="p-1.5 rounded-lg hover:bg-red-50">
                          <Trash2 className="h-4 w-4 text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload File" size="sm">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <Upload className="h-8 w-8 text-muted mx-auto mb-3" />
            <p className="text-sm text-muted">Drag and drop files here, or click to browse</p>
            <p className="text-xs text-muted mt-1">Max file size: 50MB</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">File Name</label>
            <input
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              placeholder="document.pdf"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload}>Upload</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!previewFile} onClose={() => setPreviewFile(null)} title={previewFile?.name ?? 'Preview'} size="lg">
        {previewFile && (
          <div className="text-center py-12">
            {(() => { const Icon = fileIcons[previewFile.type]; return <Icon className="h-16 w-16 text-muted mx-auto mb-4" />; })()}
            <p className="text-lg font-medium">{previewFile.name}</p>
            <p className="text-sm text-muted mt-2">{formatFileSize(previewFile.size)}</p>
            <p className="text-xs text-muted mt-4">File preview simulation — actual content not available in demo mode.</p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) { deleteFile(deleteId); setDeleteId(null); } }}
        title="Delete File"
        message="Are you sure you want to delete this file?"
      />
    </div>
  );
}
