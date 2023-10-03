// components/FileUpload.tsx

import React, { ChangeEvent } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
        console.log(file);
      onFileSelect(file);
    }
  };

  return (
    <input type="file" accept=".pdf" onChange={handleFileSelect} style={{ display: 'block' }} />
  );
};

export default FileUpload;
