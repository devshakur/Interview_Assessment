import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Ensuring PDFs load correctly
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | string; 
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
     

      return () => {
      
        URL.revokeObjectURL(url);
      };
    } else {
      setFileUrl(file); 
    
    }
  }, [file]);

  if (!fileUrl) {
    
    return <p className="text-red-500"> No PDF file available</p>;
  }

  return (
    <div className="pdf-container">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(error) => console.error(" PDF Load Error:", error)}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page key={index + 1} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
};
