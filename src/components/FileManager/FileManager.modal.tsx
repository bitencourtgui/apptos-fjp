import * as React from "react";

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

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { getStorage, ref, uploadBytes } from "firebase/storage";
// import { storage } from "@/utils/firebase";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { extensionFiles } from "../../utils/extension-files";
import { convertFileSize } from "../../utils/convert-filesize";
import { firebaseApp } from "../../libs/firebase";

export default function FileManagerModal({
  open,
  handleToggle,
  customerId,
  setSucessUpload,
  sucessUpload,
}) {
  const [droppedFiles, setDroppedFiles] = React.useState<File[]>([]);
  const storage = getStorage(firebaseApp);
  const handleUpload = () => {
    if (droppedFiles.length > 0) {
      const promises = droppedFiles.map((file) => {
        const storageRef = ref(storage, `documents/${customerId}/${file.name}`);
        return uploadBytes(storageRef, file);
      });

      Promise.all(promises)
        .then(() => {
          setDroppedFiles([]); // Limpa os arquivos selecionados
          setSucessUpload(true);
        })
        .catch((error) => {
          console.error("Erro no upload:", error);
        });
    }
  };

  const clearDocumentList = () => {
    setDroppedFiles([]); // Limpa os arquivos selecionados
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
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setDroppedFiles([...droppedFiles, ...acceptedFiles]);
      }
    },
  });

  const handleDeleteFile = (index) => {
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
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <StyledContainer {...getRootProps()}>
          <input {...getInputProps()} />
          <Avatar
            sx={{
              backgroundColor: "rgb(229, 231, 235)",
              width: "64px",
              height: "64px",
            }}
          >
            <FileUploadOutlinedIcon sx={{ color: "black" }} />
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
                    <CloseOutlinedIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <img src={extensionFiles(droppedFile.name)} alt="" />
                </ListItemAvatar>
                <ListItemText
                  primary={droppedFile.name}
                  secondary={convertFileSize(droppedFile.size)}
                />
              </ListItem>
            ))}
          </List>
        )}
        {droppedFiles.length !== 0 && (
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button
              size="small"
              variant="text"
              color="primary"
              onClick={clearDocumentList}
            >
              Remover tudo
            </Button>
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={handleUpload}
            >
              Carregar
            </Button>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
