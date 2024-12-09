import React from 'react';
import { FileTree } from './FileTree';
import { CodeEditor } from './CodeEditor';
import { EditorTabs } from './EditorTabs';
import { EditorNavBar } from './EditorNavBar';
import { Breadcrumb } from './Breadcrumb';

export function Editor() {
  const [code, setCode] = React.useState(`// Your code will appear here
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
export default App;`);
  const [currentFile, setCurrentFile] = React.useState('/src/App.tsx');

  return (
    <>
    <EditorTabs />
        <EditorNavBar />
    <div className="h-full flex bg-[#1E1E1E]">
      <FileTree onFileSelect={(path) => {
          setCurrentFile(path);
          // In a real app, we would load the file content here
        }} />
      <div className="flex-1 flex flex-col">
        <Breadcrumb path={currentFile} />
        <CodeEditor
          value={code}
          onChange={setCode}
        />
      </div>
    </div>
      </>
  );
}