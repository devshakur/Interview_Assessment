import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, GripHorizontal } from 'lucide-react';
import { useDocumentStore } from '../store/documentStore';
import { ProgressBar } from '../components/ProgressBar';
import { PDFViewer } from '../components/PDFViewer';
import { EditorSidebar } from '../components/EditorSidebar';
import type { DocumentField } from '../types';

const FIELD_DEFAULT_SIZES = {
  signature: { width: 200, height: 50 },
  text: { width: 200, height: 40 },
  date: { width: 150, height: 40 },
  checkbox: { width: 30, height: 30 },
  initial: { width: 100, height: 50 },
};

export const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentDocument, addField, updateFieldPosition } = useDocumentStore();
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!currentDocument || !containerRef.current) return;

    const type = e.dataTransfer.getData('fieldType') as DocumentField['type'];
    const rect = containerRef.current.getBoundingClientRect();
    
    // Get scroll positions
    const scrollX = containerRef.current.scrollLeft;
    const scrollY = containerRef.current.scrollTop;

    // Calculate position in pixels
    const x = e.clientX - rect.left + scrollX;
    const y = e.clientY - rect.top + scrollY;

    if (type) {
      const newField: DocumentField = {
        id: crypto.randomUUID(),
        type,
        recipientId: currentDocument.recipients[0].id,
        position: { x, y },
        size: FIELD_DEFAULT_SIZES[type],
        required: true,
        page: currentPage,
      };

      addField(currentDocument.id, newField);
      setSelectedField(newField);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFieldDrag = (e: React.DragEvent<HTMLDivElement>, field: DocumentField) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left + containerRef.current.scrollLeft;
    const newY = e.clientY - rect.top + containerRef.current.scrollTop;
    
    updateFieldPosition(currentDocument.id, field.id, { x: newX, y: newY });
  };

  const handleSave = () => {
    navigate('/summary');
  };

  if (!currentDocument) {
    navigate('/upload');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-4">
        <ProgressBar />
      </div>

      <div className="flex flex-1">
        <EditorSidebar />
        
        <div className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Document Editor</h2>
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>

          <div 
            ref={containerRef}
            className="bg-gray-100 rounded-lg p-4 flex justify-center relative overflow-auto min-h-[600px]"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="relative">
              {currentDocument.file && (
                <PDFViewer
                  file={currentDocument.file}
                  pageNumber={currentPage}
                  onPageChange={setCurrentPage}
                  onLoadSuccess={setTotalPages}
                />
              )}
              {currentDocument.fields
                .filter(field => field.page === currentPage)
                .map(field => (
                  <div
                    key={field.id}
                    draggable
                    onDragEnd={(e) => handleFieldDrag(e, field)}
                    style={{
                      position: 'absolute',
                      left: `${field.position.x}px`,
                      top: `${field.position.y}px`,
                      width: field.size.width,
                      height: field.size.height,
                    }}
                    className="border-2 border-blue-500 bg-white/80 rounded-md shadow-sm cursor-move"
                  >
                    <div className="text-xs bg-blue-500 text-white px-2 py-1 flex items-center justify-between rounded-t-sm">
                      <span className="capitalize">{field.type}</span>
                      <GripHorizontal className="w-3 h-3" />
                    </div>
                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={field.value || ''}
                        onChange={(e) => {
                          const updatedField = { ...field, value: e.target.value };
                          addField(currentDocument.id, updatedField);
                        }}
                        className="w-full h-full text-sm p-1 bg-transparent outline-none"
                        placeholder="Enter text..."
                      />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
