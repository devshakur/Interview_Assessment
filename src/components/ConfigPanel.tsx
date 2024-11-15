import React, { useState } from "react";
import { X, Plus, Trash } from "lucide-react";
import { Node } from "reactflow";
import { useFlowStore } from "../store/flowStore";

interface ConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdateNode: (id: string, data: any) => void;
}

interface Field {
  name: string;
  type: string;
  validation?: string;
}

export function ConfigPanel({ node, onClose, onUpdateNode }: ConfigPanelProps) {
  const { models } = useFlowStore();
  const [newField, setNewField] = useState<Field>({ name: "", type: "string" });

  if (!node) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    onUpdateNode(node.id, {
      ...node.data,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayChange = (
    index: number,
    field: string,
    value: string,
    arrayName: string
  ) => {
    const array = [...(node.data[arrayName] || [])];
    array[index] = { ...array[index], [field]: value };
    onUpdateNode(node.id, {
      ...node.data,
      [arrayName]: array,
    });
  };

  const addField = (arrayName: string) => {
    const array = [...(node.data[arrayName] || []), newField];
    onUpdateNode(node.id, {
      ...node.data,
      [arrayName]: array,
    });
    setNewField({ name: "", type: "string" });
  };

  const removeField = (index: number, arrayName: string) => {
    const array = [...(node.data[arrayName] || [])];
    array.splice(index, 1);
    onUpdateNode(node.id, {
      ...node.data,
      [arrayName]: array,
    });
  };

  const copyQueryFields = () => {
    const currentFields = node.data.fields || [];
    navigator.clipboard.writeText(JSON.stringify(currentFields, null, 2));
  };

  const extractQueryParams = (path: string) => {
    const params = path.match(/:[a-zA-Z]+/g) || [];
    return params.map((param) => ({
      name: param.substring(1),
      type: "string",
      validation: "",
    }));
  };

  const renderDatabaseFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Model</label>
        <select
          name="model"
          value={node.data.model || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Model</option>
          {models.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">SQL Query</label>
        <textarea
          name="query"
          value={node.data.query || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded h-32 font-mono text-sm"
          placeholder="SELECT * FROM table WHERE id = :id"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Save Result In</label>
        <input
          type="text"
          name="resultVar"
          value={node.data.resultVar || ""}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="result"
        />
      </div>
    </>
  );

  const renderFields = () => {
    switch (node.type) {
      case "auth":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Auth Type
              </label>
              <select
                name="authType"
                value={node.data.authType || "bearer"}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="jwt">JWT</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Token Variable
              </label>
              <input
                type="text"
                name="tokenVar"
                value={node.data.tokenVar || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="token"
              />
            </div>
          </>
        );

      case "url":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Method</label>
              <select
                name="method"
                value={node.data.method || "GET"}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {["GET", "POST", "PUT", "DELETE", "PATCH"].map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Route Path
              </label>
              <input
                type="text"
                name="path"
                value={node.data.path || ""}
                onChange={(e) => {
                  handleChange(e);
                  const queryParams = extractQueryParams(e.target.value);
                  onUpdateNode(node.id, {
                    ...node.data,
                    path: e.target.value,
                    queryFields: queryParams,
                  });
                }}
                className="w-full p-2 border rounded"
                placeholder="/api/users/:id"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Body Fields
              </label>
              <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                {node.data.fields && node.data.fields.length > 0 ? (
                  node.data.fields.map((field: Field) => (
                    <div key={field.name} className="text-gray-600">
                      {field.name}: {field.type}
                      {field.validation ? ` (${field.validation})` : ""}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    No body fields defined
                  </div>
                )}
              </div>
              {(node.data.fields || []).map((field: Field, index: number) => (
                <div key={index} className="flex gap-1 mb-2">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) =>
                      handleArrayChange(index, "name", e.target.value, "fields")
                    }
                    className="flex-1 p-2 border rounded text-sm"
                    placeholder="Field name"
                  />
                  <select
                    value={field.type}
                    onChange={(e) =>
                      handleArrayChange(index, "type", e.target.value, "fields")
                    }
                    className="w-20 p-2 border rounded text-sm"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Bool</option>
                    <option value="date">Date</option>
                  </select>
                  <button
                    onClick={() => removeField(index, "fields")}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-1 mt-2">
                <input
                  type="text"
                  value={newField.name}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                  className="flex-1 p-2 border rounded text-sm"
                  placeholder="New field name"
                />
                <select
                  value={newField.type}
                  onChange={(e) =>
                    setNewField({ ...newField, type: e.target.value })
                  }
                  className="w-20 p-2 border rounded text-sm"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Bool</option>
                  <option value="date">Date</option>
                </select>
                <button
                  onClick={() => addField("fields")}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Query Fields
              </label>
              <div className="mb-2 p-2 bg-gray-50 rounded text-sm">
                {node.data.queryFields && node.data.queryFields.length > 0 ? (
                  node.data.queryFields.map((field: Field) => (
                    <div key={field.name} className="text-gray-600">
                      {field.name}: {field.type}
                      {field.validation ? ` (${field.validation})` : ""}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">
                    No query fields defined
                  </div>
                )}
              </div>
              {(node.data.queryFields || []).map(
                (field: Field, index: number) => (
                  <div key={index} className="flex gap-1 mb-2">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "name",
                          e.target.value,
                          "queryFields"
                        )
                      }
                      className="flex-1 p-2 border rounded text-sm"
                      placeholder="Field name"
                    />
                    <select
                      value={field.type}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "type",
                          e.target.value,
                          "queryFields"
                        )
                      }
                      className="w-20 p-2 border rounded text-sm"
                    >
                      <option value="string">String</option>
                      <option value="number">Number</option>
                      <option value="boolean">Bool</option>
                      <option value="date">Date</option>
                    </select>
                    <button
                      onClick={() => removeField(index, "queryFields")}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                )
              )}
              <div className="flex gap-1 mt-2">
                <input
                  type="text"
                  value={newField.name}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                  className="flex-1 p-2 border rounded text-sm"
                  placeholder="New query param"
                />
                <select
                  value={newField.type}
                  onChange={(e) =>
                    setNewField({ ...newField, type: e.target.value })
                  }
                  className="w-20 p-2 border rounded text-sm"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Bool</option>
                  <option value="date">Date</option>
                </select>
                <button
                  onClick={() => addField("queryFields")}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        );

      case "output":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Fields</label>
              {(node.data.fields || []).map((field: Field, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={field.name}
                    onChange={(e) =>
                      handleArrayChange(index, "name", e.target.value, "fields")
                    }
                    className="flex-1 p-2 border rounded"
                    placeholder="Field name"
                  />
                  <select
                    value={field.type}
                    onChange={(e) =>
                      handleArrayChange(index, "type", e.target.value, "fields")
                    }
                    className="w-24 p-2 border rounded"
                  >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="date">Date</option>
                  </select>
                  <button
                    onClick={() => removeField(index, "fields")}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newField.name}
                  onChange={(e) =>
                    setNewField({ ...newField, name: e.target.value })
                  }
                  className="flex-1 p-2 border rounded"
                  placeholder="New field name"
                />
                <select
                  value={newField.type}
                  onChange={(e) =>
                    setNewField({ ...newField, type: e.target.value })
                  }
                  className="w-24 p-2 border rounded"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="date">Date</option>
                </select>
                <button
                  onClick={() => addField("fields")}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        );

      case "variable":
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Variable Name
              </label>
              <input
                type="text"
                name="name"
                value={node.data.name || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="myVariable"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={node.data.type || "string"}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="string">String</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="object">Object</option>
                <option value="array">Array</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Default Value
              </label>
              <input
                type="text"
                name="defaultValue"
                value={node.data.defaultValue || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Default value"
              />
            </div>
          </>
        );

      case "logic":
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              JavaScript Code
            </label>
            <textarea
              name="code"
              value={node.data.code || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded h-40 font-mono text-sm"
              placeholder="// Write your JavaScript code here"
            />
          </div>
        );

      case "db-find":
      case "db-query":
        return (
          <>
            {renderDatabaseFields()}
            <div className="mb-4">
              <button
                onClick={copyQueryFields}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
              >
                Copy Fields
              </button>
            </div>
          </>
        );

      case "db-insert":
        return (
          <>
            {renderDatabaseFields()}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Variables
              </label>
              <textarea
                name="variables"
                value={node.data.variables || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded h-20 font-mono text-sm"
                placeholder="name: string&#10;age: number"
              />
            </div>
          </>
        );

      case "db-update":
      case "db-delete":
        return (
          <>
            {renderDatabaseFields()}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">ID Field</label>
              <input
                type="text"
                name="idField"
                value={node.data.idField || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="id"
              />
            </div>
            {node.type === "db-update" && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Variables
                </label>
                <textarea
                  name="variables"
                  value={node.data.variables || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded h-20 font-mono text-sm"
                  placeholder="name: string&#10;age: number"
                />
              </div>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 p-4 shadow-lg transform transition-transform overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Configure Node</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>
      {renderFields()}
    </div>
  );
}
