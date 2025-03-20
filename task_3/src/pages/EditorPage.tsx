
// import React, { useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Save, GripHorizontal } from 'lucide-react';
// import { useDocumentStore } from '../store/documentStore';
// import { ProgressBar } from '../components/ProgressBar';
// import { PDFViewer } from '../components/PDFViewer';
// import { EditorSidebar } from '../components/EditorSidebar';
// import type { DocumentField } from '../types';

// const FIELD_DEFAULT_SIZES = {
//   signature: { width: 200, height: 50 },
//   text: { width: 200, height: 40 },
//   date: { width: 150, height: 40 },
//   checkbox: { width: 30, height: 30 },
//   initial: { width: 100, height: 50 },
// };

// export const EditorPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { currentDocument, setCurrentDocument, addField } = useDocumentStore();
//   const [selectedField, setSelectedField] = useState<DocumentField | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const containerRef = useRef<HTMLDivElement>(null);

//   const handleInputChange = (id: string, newValue: string) => {
//     if (!currentDocument) return;

//     setCurrentDocument({
//       ...currentDocument,
//       fields: currentDocument.fields.map(field =>
//         field.id === id ? { ...field, value: newValue } : field
//       ),
//     });
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (!currentDocument || !containerRef.current) return;

//     const type = e.dataTransfer.getData('fieldType') as DocumentField['type'];
//     const rect = containerRef.current.getBoundingClientRect();

//     const scrollX = containerRef.current.scrollLeft;
//     const scrollY = containerRef.current.scrollTop;

//     const x = ((e.clientX - rect.left + scrollX) / rect.width) * 100;
//     const y = ((e.clientY - rect.top + scrollY) / rect.height) * 100;

//     if (type) {
//       const newField: DocumentField = {
//         id: crypto.randomUUID(),
//         type,
//         recipientId: currentDocument.recipients[0].id,
//         position: { x: Math.max(0, Math.min(x, 100)), y: Math.max(0, Math.min(y, 100)) },
//         size: FIELD_DEFAULT_SIZES[type],
//         required: true,
//         page: currentPage,
//         value: "", // Ensure new fields have a value
//       };

//       addField(currentDocument.id, newField);
//       setSelectedField(newField);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const handleSave = () => {
//     navigate('/summary');
//   };

//   if (!currentDocument) {
//     navigate('/upload');
//     return null;
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <div className="container mx-auto px-4 py-4">
//         <ProgressBar />
//       </div>

//       <div className="flex flex-1">
//         <EditorSidebar />

//         <div className="flex-1 p-4">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold">Document Editor</h2>
//             <button
//               onClick={handleSave}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Save className="w-4 h-4 mr-2" />
//               Save
//             </button>
//           </div>

//           <div
//             ref={containerRef}
//             className="bg-gray-100 rounded-lg p-4 flex justify-center relative overflow-auto min-h-[600px]"
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//           >
//             <div className="relative">
//               {currentDocument.file && (
//                 <PDFViewer file={currentDocument.file} pageNumber={currentPage} onPageChange={setCurrentPage} />
//               )}

//               {currentDocument.fields
//                 .filter(field => field.page === currentPage)
//                 .map(field => (
//                   <div
//                     key={field.id}
//                     style={{
//                       position: 'absolute',
//                       left: `${field.position.x}%`,
//                       top: `${field.position.y}%`,
//                       width: field.size.width,
//                       height: field.size.height,
//                     }}
//                     className="border-2 border-blue-500 bg-white/80 rounded-md shadow-sm p-1"
//                   >
//                     <div className="text-xs bg-blue-500 text-white px-2 py-1 flex items-center justify-between rounded-t-sm">
//                       <span className="capitalize">{field.type}</span>
//                       <GripHorizontal className="w-3 h-3 cursor-move" />
//                     </div>

//                     {field.type === "text" && (
//                       <input
//                         type="text"
//                         className="w-full h-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         value={field.value || ""}
//                         onChange={(e) => handleInputChange(field.id, e.target.value)}
//                       />
//                     )}

//                     {field.type === "date" && (
//                       <input
//                         type="date"
//                         className="w-full h-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                         value={field.value || ""}
//                         onChange={(e) => handleInputChange(field.id, e.target.value)}
//                       />
//                     )}

//                     {field.type === "checkbox" && (
//                       <input
//                         type="checkbox"
//                         checked={field.value === "true"}
//                         onChange={(e) => handleInputChange(field.id, e.target.checked ? "true" : "false")}
//                       />
//                     )}
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState, useRef, useEffect } from 'react';
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
  const { currentDocument, setCurrentDocument, addField } = useDocumentStore();
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ✅ Load saved field values from localStorage
    const savedFields = JSON.parse(localStorage.getItem('documentFields') || '{}');

    if (currentDocument) {
      setCurrentDocument({
        ...currentDocument,
        fields: currentDocument.fields.map((field) => ({
          ...field,
          value: savedFields[field.id] || field.value || '',
        })),
      });
    }
  }, []);

  const handleInputChange = (id: string, newValue: string) => {
    if (!currentDocument) return;

    const updatedFields = currentDocument.fields.map((field) =>
      field.id === id ? { ...field, value: newValue } : field
    );

    setCurrentDocument({ ...currentDocument, fields: updatedFields });

    // ✅ Save field values to localStorage
    const savedFields = JSON.parse(localStorage.getItem('documentFields') || '{}');
    localStorage.setItem(
      'documentFields',
      JSON.stringify({ ...savedFields, [id]: newValue })
    );
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!currentDocument || !containerRef.current) return;

    const type = e.dataTransfer.getData('fieldType') as DocumentField['type'];
    const rect = containerRef.current.getBoundingClientRect();
    const scrollX = containerRef.current.scrollLeft;
    const scrollY = containerRef.current.scrollTop;

    const x = ((e.clientX - rect.left + scrollX) / rect.width) * 100;
    const y = ((e.clientY - rect.top + scrollY) / rect.height) * 100;

    if (type) {
      const newField: DocumentField = {
        id: crypto.randomUUID(),
        type,
        recipientId: currentDocument.recipients[0].id,
        position: { x: Math.max(0, Math.min(x, 100)), y: Math.max(0, Math.min(y, 100)) },
        size: FIELD_DEFAULT_SIZES[type],
        required: true,
        page: currentPage,
        value: "",
      };

      addField(currentDocument.id, newField);
      setSelectedField(newField);
    }
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
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="relative">
              {currentDocument.file && (
                <PDFViewer file={currentDocument.file} pageNumber={currentPage} onPageChange={setCurrentPage} />
              )}

              {currentDocument.fields
                .filter((field) => field.page === currentPage)
                .map((field) => (
                  <div
                    key={field.id}
                    style={{
                      position: 'absolute',
                      left: `${field.position.x}%`,
                      top: `${field.position.y}%`,
                      width: field.size.width,
                      height: field.size.height,
                    }}
                    className="border-2 border-blue-500 bg-white/80 rounded-md shadow-sm p-1"
                  >
                    <div className="text-xs bg-blue-500 text-white px-2 py-1 flex items-center justify-between rounded-t-sm">
                      <span className="capitalize">{field.type}</span>
                      <GripHorizontal className="w-3 h-3 cursor-move" />
                    </div>

                    {field.type === "text" && (
                      <input
                        type="text"
                        className="w-full h-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={field.value || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                    )}

                    {field.type === "date" && (
                      <input
                        type="date"
                        className="w-full h-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={field.value || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                    )}

                    {field.type === "checkbox" && (
                      <input
                        type="checkbox"
                        checked={field.value === "true"}
                        onChange={(e) => handleInputChange(field.id, e.target.checked ? "true" : "false")}
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
