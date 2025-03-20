import { create } from 'zustand';
import { Document, Recipient, DocumentField } from '../types';

interface DocumentStore {
  currentDocument: Document | null;
  documents: Document[];
  setCurrentDocument: (document: Document | null) => void;
  addDocument: (document: Document) => void;
  updateDocument: (document: Document) => void;
  addRecipient: (documentId: string, recipient: Recipient) => void;
  removeRecipient: (documentId: string, recipientId: string) => void;
  addField: (documentId: string, field: DocumentField) => void;
  updateField: (documentId: string, field: DocumentField) => void;
  updateFieldValue: (documentId: string, fieldId: string, value: string) => void;
  removeField: (documentId: string, fieldId: string) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  currentDocument: null,
  documents: [],

  setCurrentDocument: (document) => set({ currentDocument: document }),

  addDocument: (document) =>
    set((state) => ({
      documents: [...state.documents, document],
    })),

  updateDocument: (document) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === document.id ? document : d
      ),
      currentDocument:
        state.currentDocument?.id === document.id ? document : state.currentDocument,
    })),

  addRecipient: (documentId, recipient) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId
          ? { ...d, recipients: [...d.recipients, recipient] }
          : d
      ),
      currentDocument:
        state.currentDocument?.id === documentId
          ? { ...state.currentDocument, recipients: [...state.currentDocument.recipients, recipient] }
          : state.currentDocument,
    })),

  removeRecipient: (documentId, recipientId) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId
          ? { ...d, recipients: d.recipients.filter((r) => r.id !== recipientId) }
          : d
      ),
      currentDocument:
        state.currentDocument?.id === documentId
          ? { ...state.currentDocument, recipients: state.currentDocument.recipients.filter((r) => r.id !== recipientId) }
          : state.currentDocument,
    })),

  addField: (documentId, field) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId
          ? { ...d, fields: [...d.fields, field] }
          : d
      ),
      currentDocument:
        state.currentDocument?.id === documentId
          ? { ...state.currentDocument, fields: [...state.currentDocument.fields, field] }
          : state.currentDocument,
    })),

  updateField: (documentId, field) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId
          ? {
            ...d,
            fields: d.fields.map((f) =>
              f.id === field.id ? { ...f, ...field } : f
            ),
          }
          : d
      ),
      currentDocument:
        state.currentDocument?.id === documentId
          ? {
            ...state.currentDocument,
            fields: state.currentDocument.fields.map((f) =>
              f.id === field.id ? { ...f, ...field } : f
            ),
          }
          : state.currentDocument,
    })),

  // function to update only the inputted field value
  updateFieldValue: (documentId, fieldId, value) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId
          ? {
            ...d,
            fields: d.fields.map((f) =>
              f.id === fieldId ? { ...f, value } : f
            ),
          }
          : d
      ),
      currentDocument:
        state.currentDocument?.id === documentId
          ? {
            ...state.currentDocument,
            fields: state.currentDocument.fields.map((f) =>
              f.id === fieldId ? { ...f, value } : f
            ),
          }
          : state.currentDocument,
    })),

  removeField: (documentId, fieldId) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === documentId
          ? { ...d, fields: d.fields.filter((f) => f.id !== fieldId) }
          : d
      ),
      currentDocument:
        state.currentDocument?.id === documentId
          ? {
            ...state.currentDocument,
            fields: state.currentDocument.fields.filter((f) => f.id !== fieldId),
          }
          : state.currentDocument,
    })),
}));
