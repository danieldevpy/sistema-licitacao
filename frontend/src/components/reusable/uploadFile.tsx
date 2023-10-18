import { ChangeEvent } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React from 'react';
import RestorePageIcon from '@mui/icons-material/RestorePage';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface FileUploadProps {
    onFileSelect: (file: File|undefined) => void;
  }
const InputFileUploadComponent: React.FC<FileUploadProps> = ({ onFileSelect }) => {
    const [file, setFile] = React.useState<File>();
    
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setFile(file);
            onFileSelect(file);
        }
      };

    const removeFile = () =>{
        setTimeout(()=>{
            setFile(undefined);
        }, 200)
        onFileSelect(undefined);
    }

  return (
    <>
        {file?(
        <Button component="label" variant="contained" color='error' startIcon={<RestorePageIcon />}>
            {file.name + "  X"}
        <VisuallyHiddenInput onClick={removeFile}/>
        </Button>
        ):(
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            INSERIR PDF
          <VisuallyHiddenInput type="file" accept='.pdf' onChange={handleFileSelect}/>
        </Button>
        )}
    </>
  );
}

export default InputFileUploadComponent;