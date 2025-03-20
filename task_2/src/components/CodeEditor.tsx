import React from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
  const lines = value.split('\n');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [highlighted, setHighlighted] = React.useState('');

  React.useEffect(() => {
    const highlighted = Prism.highlight(
      value,
      Prism.languages.tsx,
      'tsx'
    );
    setHighlighted(highlighted);
  }, [value]);
  
  return (
    <div className="relative h-full bg-[#1E1E1E] text-gray-300 font-mono text-sm">
      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-end pr-2 pt-4 text-gray-500 select-none bg-[#1E1E1E] border-r border-gray-800">
        {lines.map((_, i) => (
          <div key={i} className="leading-6">
            {i + 1}
          </div>
        ))}
      </div>
      <pre className="absolute left-12 right-0 top-0 bottom-0 m-0 p-4 overflow-hidden pointer-events-none ">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full p-4 bg-transparent text-transparent caret-gray-300 resize-none font-mono"
        spellCheck={false}
      />
    </div>
  );
}
