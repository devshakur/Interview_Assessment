import React from "react";
import { ChevronDown, File, Folder } from "lucide-react";

interface FileTreeProps {
  onFileSelect: (path: string) => void;
}

export function FileTree({ onFileSelect }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(
    new Set(["src", "components"])
  );

  const toggleFolder = (folder: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folder)) {
        next.delete(folder);
      } else {
        next.add(folder);
      }
      return next;
    });
  };

  return (
    <div className="h-full w-64 bg-[#1E1E1E] text-gray-300 border-r border-gray-800">
      {/* SRC Folder */}
      <div
        className="flex items-center gap-2 p-2 text-sm cursor-pointer hover:bg-[#2D2D2D]"
        onClick={() => toggleFolder("src")}
      >
        <span className="flex items-center gap-1">
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedFolders.has("src") ? "" : "-rotate-90"
            }`}
          />
          <Folder className="w-4 h-4" />
          src
        </span>
      </div>

      {expandedFolders.has("src") && (
        <div className="pl-4">
          {/* Components Folder */}
          <div
            className="flex items-center gap-2 p-2 text-sm cursor-pointer hover:bg-[#2D2D2D]"
            onClick={() => toggleFolder("components")}
          >
            <span className="flex items-center gap-1">
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  expandedFolders.has("components") ? "" : "-rotate-90"
                }`}
              />
              <Folder className="w-4 h-4" />
              components
            </span>
          </div>

          {expandedFolders.has("components") && (
            <div className="pl-4">
              {/* File Items */}
              {["Chat.tsx", "Editor.tsx", "Prompt.tsx"].map((file) => (
                <div
                  key={file}
                  className="flex items-center gap-2 p-2 text-sm text-gray-400 cursor-pointer hover:bg-[#2D2D2D]"
                  onClick={() => onFileSelect(`/src/components/${file}`)}
                >
                  <File className="w-4 h-4" />
                  {file}
                </div>
              ))}
            </div>
          )}

          {/* App.tsx */}
          <div
            className="flex items-center gap-2 p-2 text-sm cursor-pointer hover:bg-[#2D2D2D] bg-[#2D2D2D] border-l-2 border-blue-500"
            onClick={() => onFileSelect("/src/App.tsx")}
          >
            <File className="w-4 h-4" />
            App.tsx
          </div>
        </div>
      )}
    </div>
  );
}
