import React, { useState, useEffect } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';

interface Field {
  name: string;
  type: string;
  defaultValue: string;
  validation: string;
  mapping?: string;
}

interface ModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  model?: {
    id: string;
    name: string;
    fields: Field[];
  };
}

const fieldTypes = [
  'string',
  'number',
  'boolean',
  'date',
  'mapping',
  'array',
  'object',
];

const validationRules = [
  'required',
  'email',
  'url',
  'min',
  'max',
  'pattern',
  'enum',
];

const initialNewField = {
  name: '',
  type: 'string',
  defaultValue: '',
  validation: '',
};

const createInitialModelData = () => ({
  id: `model_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name: '',
  fields: [],
});

export function ModelModal({ isOpen, onClose, model }: ModelModalProps) {
  const [modelData, setModelData] = useState(createInitialModelData());
  const [newField, setNewField] = useState<Field>(initialNewField);

  const { addModel, updateModel } = useFlowStore();

  useEffect(() => {
    if (model) {
      setModelData({
        id: model.id,
        name: model.name,
        fields: [...model.fields],
      });
    } else {
      setModelData(createInitialModelData());
    }
  }, [model, isOpen]);

  const handleAddField = () => {
    if (newField.name) {
      setModelData({
        ...modelData,
        fields: [...modelData.fields, { ...newField }],
      });
      setNewField(initialNewField);
    }
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = [...modelData.fields];
    updatedFields.splice(index, 1);
    setModelData({
      ...modelData,
      fields: updatedFields,
    });
  };

  const handleSave = () => {
    if (modelData.name) {
      if (model) {
        updateModel(modelData);
      } else {
        addModel(modelData);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {model ? 'Edit Model' : 'Add New Model'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Model Name</label>
            <input
              type="text"
              value={modelData.name}
              onChange={(e) => setModelData({ ...modelData, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter model name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Fields</label>
            <div className="space-y-2">
              {modelData.fields.map((field, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={field.name}
                    readOnly
                    className="flex-1 p-2 border rounded bg-gray-50"
                  />
                  <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                    {field.type}
                  </span>
                  {field.validation && (
                    <span className="px-2 py-1 bg-blue-100 rounded text-sm">
                      {field.validation}
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveField(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newField.name}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                  className="flex-1 p-2 border rounded"
                  placeholder="Field name"
                />
                <select
                  value={newField.type}
                  onChange={(e) =>
                    setNewField({ ...newField, type: e.target.value })
                  }
                  className="w-32 p-2 border rounded"
                >
                  {fieldTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newField.defaultValue}
                  onChange={(e) =>
                    setNewField({ ...newField, defaultValue: e.target.value })
                  }
                  className="flex-1 p-2 border rounded"
                  placeholder="Default value"
                />
                <select
                  value={newField.validation}
                  onChange={(e) =>
                    setNewField({ ...newField, validation: e.target.value })
                  }
                  className="w-32 p-2 border rounded"
                >
                  <option value="">Validation</option>
                  {validationRules.map((rule) => (
                    <option key={rule} value={rule}>
                      {rule}
                    </option>
                  ))}
                </select>
              </div>

              {newField.type === 'mapping' && (
                <input
                  type="text"
                  value={newField.mapping || ''}
                  onChange={(e) =>
                    setNewField({ ...newField, mapping: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  placeholder="key:value,key2:value2"
                />
              )}

              <button
                onClick={handleAddField}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>
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
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {model ? 'Update' : 'Save'} Model
          </button>
        </div>
      </div>
    </div>
  );
}