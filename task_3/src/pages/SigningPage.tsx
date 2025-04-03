import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDocumentStore } from "../store/documentStore";
import { Document, Page, pdfjs } from "react-pdf";
import { SigningField } from "../components/SigningField";

// Ensuring PDF worker is loaded correctly
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const SigningPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { documents, updateDocument, updateFieldValue } = useDocumentStore();
  
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfFile, setPdfFile] = useState<string | null>(null);

  const document = documents.find((d) => d.id === documentId);

  //  Load saved field values from local storage
  useEffect(() => {
    const savedValues = JSON.parse(localStorage.getItem("documentFields") || "{}");
    setFieldValues(savedValues);
  }, []);

  
  useEffect(() => {
    if (document?.file) {
      if (typeof document.file === "string") {
        if (document.file.startsWith("data:application/pdf;base64,")) {
          setPdfFile(document.file); 
        } else if (document.file.startsWith("http") || document.file.startsWith("/")) {
          setPdfFile(document.file); 
        } else {
          setPdfFile(`data:application/pdf;base64,${document.file}`); 
        }
      } else if (document.file instanceof Blob || document.file instanceof File) {
        
        const url = URL.createObjectURL(document.file);
        setPdfFile(url);
      } else {
        console.error("Unsupported file format:", document.file);
      }
    }
  }, [document?.file]);
  

  
  const handleFieldChange = (fieldId: string, value: string) => {
    if (document?.id) {
      updateFieldValue(document.id, fieldId, value);
    }
  };

  //  Handling next and previous  navigtion
  const handleNextPage = () => {
    if (currentPage < numPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  
  const handleComplete = () => {
    if (!document) return;

    const updatedFields = document.fields.map((field) => ({
      ...field,
      value: fieldValues[field.id] || field.value || "",
    }));

    updateDocument({ ...document, status: "completed", fields: updatedFields });
    navigate(`/preview/${document.id}`);
  };

  const allFieldsFilled = document?.fields
    ?.filter((f) => f.required)
    .every((f) => fieldValues[f.id]);

  if (!document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error: Document not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Sign Document: {document.name}</h1>

        {/* ✅ PDF Viewer Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 relative">
          {pdfFile ? (
            <Document
              file={pdfFile}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={(error) => console.error("PDF Load Error:", error)}
            >
              <Page pageNumber={currentPage} width={600} />
            </Document>
          ) : (
            <p className="text-red-500">Error: Unable to load PDF.</p>
          )}

          
          {document.fields
            .filter((field) => field.page === currentPage)
            .map((field) => (
              <SigningField
                key={field.id}
                field={field}
                value={fieldValues[field.id] || ""}
                onChange={handleFieldChange}
                readOnly
              />
            ))}
        </div>

       
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            Previous Page
          </button>

          <span>
            Page {currentPage} of {numPages || "?"}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === numPages || numPages === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Next Page
          </button>
        </div>


        <div className="flex justify-end mt-6">
          <button
            onClick={handleComplete}
            // disabled={!allFieldsFilled}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Complete Signing
          </button>
        </div>
      </div>
    </div>
  );
};
