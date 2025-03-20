// import React from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// interface PDFViewerProps {
//   file: File | string;
//   onLoadSuccess?: (numPages: number) => void;
//   pageNumber: number;
//   onPageChange?: (pageNumber: number) => void;
//   scale?: number;
// }

// export const PDFViewer: React.FC<PDFViewerProps> = ({
//   file,
//   onLoadSuccess,
//   pageNumber,
//   onPageChange,
//   scale = 1,
// }) => {
//   const handlePageChange = (direction: 'prev' | 'next') => {
//     if (onPageChange) {
//       onPageChange(direction === 'next' ? pageNumber + 1 : pageNumber - 1);
//     }
//   };

//   return (
//     <div className="pdf-viewer">
//       <Document
//         file={file}
//         onLoadSuccess={({ numPages }) => onLoadSuccess?.(numPages)}
//         className="max-w-full"
//       >
//         <Page
//           pageNumber={pageNumber}
//           scale={scale}
//           renderTextLayer={false}
//           renderAnnotationLayer={false}
//           className="shadow-lg"
//         />
//       </Document>
//       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white rounded-lg shadow px-4 py-2">
//         <button
//           onClick={() => handlePageChange('prev')}
//           disabled={pageNumber <= 1}
//           className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span className="text-sm text-gray-600">Page {pageNumber}</span>
//         <button
//           onClick={() => handlePageChange('next')}
//           className="text-gray-600 hover:text-gray-900"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Ensure PDFs load correctly
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: File | string; // Allow both File object and blob URL string
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      console.log("🟢 Created Blob URL for File:", url);

      return () => {
        console.log("♻️ Revoking Blob URL");
        URL.revokeObjectURL(url);
      };
    } else {
      setFileUrl(file); // If already a string URL, just set it
      console.log("🔗 Using existing file URL:", file);
    }
  }, [file]);

  if (!fileUrl) {
    console.error("❌ No PDF file provided to PDFViewer!");
    return <p className="text-red-500">⚠️ No PDF file available</p>;
  }

  return (
    <div className="pdf-container">
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(error) => console.error("⚠️ PDF Load Error:", error)}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page key={index + 1} pageNumber={index + 1} />
        ))}
      </Document>
    </div>
  );
};
