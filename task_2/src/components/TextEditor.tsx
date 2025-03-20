import React from "react";

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextEditor({ value, onChange, placeholder }: TextEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className="w-full min-h-[100px] px-4 py-[10px] bg-white border border-gray-300 rounded-lg resize-y text-base leading-relaxed font-sans placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
    />
  );
}
