import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, GripHorizontal } from "lucide-react";
import { useDocumentStore } from "../store/documentStore";
import { ProgressBar } from "../components/ProgressBar";
import { PDFViewer } from "../components/PDFViewer";
import { EditorSidebar } from "../components/EditorSidebar";
import Draggable from "react-draggable";
import type { DocumentField } from "../types";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

const FIELD_DEFAULT_SIZES = {
  signature: { width: 200, height: 50 },
  text: { width: 200, height: 40 },
  date: { width: 150, height: 40 },
  checkbox: { width: 30, height: 30 },
  initial: { width: 100, height: 50 },
};

export const EditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { documents, setCurrentDocument, addField } = useDocumentStore();
  const [selectedField, setSelectedField] = useState<DocumentField | null>(null);
  const [currentDocIndex, setCurrentDocIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0); // Store total PDF pages
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documents.length > 0) {
      setCurrentDocument(documents[currentDocIndex]);
      setCurrentPage(1); // Reset to first page
    }
  }, [currentDocIndex, documents, setCurrentDocument]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, numPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextDocument = () => {
    if (currentDocIndex < documents.length - 1) {
      setCurrentDocIndex((prevIndex) => prevIndex + 1);
      setCurrentPage(1);
    } else {
      navigate("/summary");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!documents[currentDocIndex] || !containerRef.current) return;

    const type = e.dataTransfer.getData("fieldType") as DocumentField["type"];
    const rect = containerRef.current.getBoundingClientRect();
    const scrollX = containerRef.current.scrollLeft;
    const scrollY = containerRef.current.scrollTop;

    const x = ((e.clientX - rect.left + scrollX) / rect.width) * 100;
    const y = ((e.clientY - rect.top + scrollY) / rect.height) * 100;

    if (type) {
      const newField: DocumentField = {
        id: crypto.randomUUID(),
        type,
        recipientId: documents[currentDocIndex].recipients[0].id,
        position: { x: Math.max(0, Math.min(x, 100)), y: Math.max(0, Math.min(y, 100)) },
        size: FIELD_DEFAULT_SIZES[type],
        required: true,
        page: currentPage,
        value: "",
      };

      addField(documents[currentDocIndex].id, newField);
      setSelectedField(newField);
    }
  };

  if (documents.length === 0) {
    navigate("/upload");
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
              onClick={() => navigate("/summary")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>

          {/* PDF Viewer */}
          <div
            ref={containerRef}
            className="bg-gray-100 rounded-lg p-4 flex justify-center relative min-h-[600px]"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {documents[currentDocIndex]?.file && (
              <Document
                file={documents[currentDocIndex].file}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)} // Get total pages
              >
                <Page pageNumber={currentPage} width={600} />
              </Document>
            )}

            {/* {documents[currentDocIndex]?.fields
              .filter((field) => field.page === currentPage)
              .map((field) => (
                <div
                  key={field.id}
                  style={{
                    position: "absolute",
                    left: ${field.position.x}%,
                    top: ${field.position.y}%,
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
              ))} */}
              {documents[currentDocIndex]?.fields
  .filter((field) => field.page === currentPage)
  .map((field) => (
    <Draggable
      key={field.id}
      defaultPosition={{ x: (field.position.x / 100) * 600, y: (field.position.y / 100) * 800 }}
      onStop={(e, data) => {
        const newX = (data.x / 600) * 100;
        const newY = (data.y / 800) * 100;

        const updatedFields = documents[currentDocIndex].fields.map((f) =>
          f.id === field.id ? { ...f, position: { x: newX, y: newY } } : f
        );

        setCurrentDocument({
          ...documents[currentDocIndex],
          fields: updatedFields,
        });
      }}
      handle=".drag-handle" // 👈 Ensures only header is draggable
    >
      <div
        style={{
          position: "absolute",
          width: field.size.width,
          height: field.size.height,
        }}
        className="border-2 border-blue-500 bg-white/80 rounded-md shadow-sm p-1"
      >
        {/* Drag Handle (only this is draggable) */}
        <div className="drag-handle text-xs bg-blue-500 text-white px-2 py-1 flex items-center justify-between rounded-t-sm cursor-move">
          <span className="capitalize">{field.type}</span>
          <GripHorizontal className="w-3 h-3" />
        </div>

        {/* Editable Inputs */}
        {field.type === "text" && (
          <input
            type="text"
            className="w-full h-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={field.value || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            onMouseDown={(e) => e.stopPropagation()} // 👈 Prevents Draggable from interfering
          />
        )}

        {field.type === "date" && (
          <input
            type="date"
            className="w-full h-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={field.value || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            onMouseDown={(e) => e.stopPropagation()} // 👈 Prevents Draggable from interfering
          />
        )}

        {field.type === "checkbox" && (
          <input
            type="checkbox"
            checked={field.value === "true"}
            onChange={(e) => handleInputChange(field.id, e.target.checked ? "true" : "false")}
            onMouseDown={(e) => e.stopPropagation()} // 👈 Prevents Draggable from interfering
          />
        )}
      </div>
    </Draggable>
  ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handlePrevPage}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              disabled={currentPage === 1}
            >
              Previous Page
            </button>

            <span>
              Page {currentPage} of {numPages}
            </span>

            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={currentPage === numPages}
            >
              Next Page
            </button>
          </div>

          {/* Next Document Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleNextDocument}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {currentDocIndex < documents.length - 1 ? "Next Document" : "Finish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};