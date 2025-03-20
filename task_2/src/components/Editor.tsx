import React from 'react';
import { FileTree } from './FileTree';
import { CodeEditor } from './CodeEditor';
import { EditorTabs } from './EditorTabs';
import { EditorNavBar } from './EditorNavBar';
import { Breadcrumb } from './Breadcrumb';
import { useNavigate, useSearchParams } from "react-router-dom";


const fileContents: Record<string, string> = {
  "/src/App.tsx": `// App.tsx
import React from 'react';
import { Prompt } from './components/Prompt';
import { Chat } from './components/Chat';
import { Editor } from './components/Editor';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b">
        <div className="text-xl font-bold text-blue-500">bolt.new</div>
      </header>
      
      <Prompt />
      
      <main className="flex-1 grid grid-cols-2 gap-4 p-4">
        <Chat />
        <Editor />
      </main>
    </div>
  );
}
export default App;`,

  "/src/components/Chat.tsx": `// Chat.tsx
import React from 'react';

export function Chat() {
  return <div>Chat Component</div>;
}`,

  "/src/components/Editor.tsx": `// Editor.tsx
import React from 'react';

export function Editor() {
  return <div>Editor Component</div>;
}`,
};

export function Editor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get file path from URL or default to App.tsx
  const filePath = searchParams.get("file") || "/src/App.tsx";

  // Set initial code
  const [code, setCode] = React.useState(fileContents[filePath] || "// File not found");

  // Update code when file changes
  React.useEffect(() => {
    setCode(fileContents[filePath] || "// File not found");
  }, [filePath]);

  return (
    <>
      <EditorTabs />
      <EditorNavBar />
      <div className="h-full flex bg-[#1E1E1E]">
        {/* File Tree */}
        <FileTree
          onFileSelect={(path) => {
            navigate(`/editor?file=${encodeURIComponent(path)}`);
          }}
        />

        {/* Code Editor Section */}
        <div className="flex-1 flex flex-col">
          <Breadcrumb path={filePath} />
          <CodeEditor value={code} onChange={setCode} />
        </div>
      </div>
    </>
  );
}
