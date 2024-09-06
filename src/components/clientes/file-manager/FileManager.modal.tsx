import React, { useState } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { StyledContainer } from "./FileManager.style";
import { useDropzone } from "react-dropzone";
import UploadCloud01 from "@untitled-ui/icons-react/build/esm/UploadCloud01";
import XClose from "@untitled-ui/icons-react/build/esm/XClose";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
import { convertFileSize } from "@/utils/convert-filesize";
import Image from "next/image";
import { extensionFiles } from "@/utils/extension-files";

interface FileManagerModalProps {
  open: boolean;
  handleToggle: (isOpen: boolean) => void;
  customerId: string;
  setSuccessUpload: React.Dispatch<React.SetStateAction<boolean>>;
  successUpload: boolean;
}

const FileManagerModal: React.FC<FileManagerModalProps> = ({
  open,
  handleToggle,
  customerId,
  setSuccessUpload,
}) => {
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  // const storage = getStorage(firebaseApp);

  const handleUpload = () => {
    // if (droppedFiles.length > 0) {
    //   const promises = droppedFiles.map((file) => {
    //     const storageRef = ref(storage, `documents/${customerId}/${file.name}`);
    //     return uploadBytes(storageRef, file);
    //   });
    //   Promise.all(promises)
    //     .then(() => {
    //       setDroppedFiles([]);
    //       setSuccessUpload(true);
    //     })
    //     .catch((error) => {
    //       console.error("Erro no upload:", error);
    //     });
    // }
  };

  const clearDocumentList = () => {
    setDroppedFiles([]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png", ".jpg", ".jpeg"],
      "application/msword": [".doc", ".docx"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/plain": [".txt"],
      "application/x-pkcs12": [".pfx"],
      "application/x-pem-file": [".pem"],
      "application/x-x509-ca-cert": [".crt", ".cer", ".der"],
      "application/x-iwork-keynote-sffkey": [".key"],
      "application/pkcs10": [".csr"],
      "application/xml": [".xml"], // Adiciona o suporte para arquivos .xml
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setDroppedFiles([...droppedFiles, ...acceptedFiles]);
      }
    },
  });

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...droppedFiles];
    updatedFiles.splice(index, 1);
    setDroppedFiles(updatedFiles);
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleToggle(false)}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle
        id="scroll-dialog-title"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography>Carregar arquivos</Typography>
        <IconButton
          aria-label="delete"
          onClick={() => handleToggle(false)}
          sx={{ padding: "0" }}
        >
          <XClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <StyledContainer {...getRootProps()}>
          <input {...getInputProps()} />
          <Avatar
            sx={{
              backgroundColor: "rgb(229, 231, 235)",
              width: "64px",
              height: "64px",
            }}
          >
            <UploadCloud01 />
          </Avatar>
          <Stack spacing={1} ml={2} justifyContent="center">
            <Typography variant="h6">
              Clique para carregar ou arraste e solte
            </Typography>
            <Typography variant="body2">Tamanho máximo 10MB</Typography>
          </Stack>
        </StyledContainer>
        {droppedFiles.length > 0 && (
          <List>
            {droppedFiles.map((droppedFile, index) => (
              <ListItem
                key={index}
                sx={{
                  border: "1px solid rgb(242, 244, 247)",
                  borderRadius: "8px",
                  marginBottom: "8px",
                  width: "auto",
                }}
                secondaryAction={
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteFile(index)}
                  >
                    <XClose />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      backgroundColor: "rgb(242, 244, 247)",
                      width: "48px",
                      height: "48px",
                      padding: "10px",
                    }}
                  >
                    <Image
                      src={extensionFiles(droppedFile.name)}
                      alt={`Ícone de arquivo ${droppedFile.name}`}
                      width={28}
                      height={32}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={droppedFile.name}
                  secondary={convertFileSize(droppedFile.size)}
                />
              </ListItem>
            ))}
          </List>
        )}
        <Button
          onClick={clearDocumentList}
          sx={{
            backgroundColor: "transparent",
            color: "rgb(97, 170, 255)",
            border: "none",
            boxShadow: "none",
            textDecoration: "underline",
            margin: "5px 0 15px 0",
            "&:hover": {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
        >
          Limpar lista
        </Button>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
          <Button
            onClick={() => handleToggle(false)}
            color="error"
            variant="outlined"
            size="small"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            size="small"
          >
            Carregar
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default FileManagerModal;
