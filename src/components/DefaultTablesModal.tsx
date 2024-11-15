import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { useFlowStore } from "../store/flowStore";

interface DefaultTable {
  id: string;
  name: string;
  description: string;
  fields: {
    name: string;
    type: string;
    defaultValue?: string;
    mapping?: string;
    validation?: string;
  }[];
}

const defaultTables: DefaultTable[] = [
  {
    id: "cms",
    name: "CMS",
    description: "Content Management System table for storing dynamic content",
    fields: [
      { name: "id", type: "primary key" },
      { name: "key", type: "string", validation: "required" },
      {
        name: "type",
        type: "mapping",
        mapping: "0:Text,1:Number,2:Image,3:Raw",
        validation: "0",
      },
      { name: "value", type: "long text" },
    ],
  },
  {
    id: "user",
    name: "User",
    description: "User management table with authentication details",
    fields: [
      { name: "id", type: "primary key" },
      { name: "email", type: "string", validation: "required,email" },
      {
        name: "login_type",
        type: "mapping",
        mapping: "0:Regular,1:Google,2:Microsoft,3:Apple",
        defaultValue: "0",
      },
      { name: "role_id", type: "string" },
      { name: "data", type: "json" },
      {
        name: "status",
        type: "mapping",
        mapping: "0:Active,1:Inactive,2:Suspend",
        defaultValue: "0",
      },
    ],
  },
];

interface DefaultTablesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DefaultTablesModal({
  isOpen,
  onClose,
}: DefaultTablesModalProps) {
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const { addModel } = useFlowStore();

  const handleToggleTable = (tableId: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleAddTables = () => {
    selectedTables.forEach((tableId) => {
      const table = defaultTables.find((t) => t.id === tableId);
      if (table) {
        addModel({
          id: `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: table.name,
          fields: table.fields,
        });
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Default Tables</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <p className="text-sm text-gray-600 mb-4">
            Select the default tables you would like to add to your project:
          </p>

          <div className="space-y-4">
            {defaultTables.map((table) => (
              <div
                key={table.id}
                className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTables.includes(table.id)}
                    onChange={() => handleToggleTable(table.id)}
                    className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <div>
                    <h3 className="font-medium">{table.name}</h3>
                    <p className="text-sm text-gray-600">{table.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Fields: {table.fields.map((f) => f.name).join(", ")}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleAddTables}
            disabled={selectedTables.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Selected Tables
          </button>
        </div>
      </div>
    </div>
  );
}
