/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import {
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  deleteObject,
  getStorage,
} from "firebase/storage";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import FileManagerModal from "./FileManager.modal";
import CardFile from "../Card-file";
import { convertFileSize } from "../../utils/convert-filesize";
import { firebaseApp } from "../../libs/firebase";

export const FileManager = ({ customerId }) => {
  const storage = getStorage(firebaseApp);
  const [docList, setDocList] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [empty, setEmpty] = React.useState(false);
  const [sucessUpload, setSucessUpload] = React.useState(false);
  const [deletedDocuments, setDeletedDocuments] = React.useState([]);

  const refreshDocumentList = async () => {
    if (!storage || !customerId) {
      console.error('Storage ou customerId não definido');
      return;
    }
  
    const docListRef = ref(storage, `documents/${customerId}`);
  

    try {
      const response = await listAll(docListRef);
      const tempDocList = [];

      await Promise.all(
        response.items.map(async (item) => {
          const [url, metadata] = await Promise.all([
            getDownloadURL(item),
            getMetadata(item),
          ]);
          const payload = {
            name: metadata.name,
            url,
            size: convertFileSize(metadata.size),
            time: metadata.updated,
          };
          tempDocList.push(payload);
        })
      );

      if (tempDocList.length === 0) {
        setEmpty(true);
      }

      setDocList(tempDocList);
    } catch (error) {
      console.error("Erro ao listar documentos:", error);
    }
  };

  useEffect(() => {
    if (customerId !== undefined) {
      refreshDocumentList();
      setSucessUpload(false);
      setOpen(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (sucessUpload || (!empty && docList.length === 0)) {
      refreshDocumentList();
      setSucessUpload(false);
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sucessUpload, docList, empty]);

  const handleDelete = async (name) => {
    const storageRef = ref(storage, `documents/${customerId}/${name}`);

    try {
      await deleteObject(storageRef);
      setDeletedDocuments([...deletedDocuments, name]);
      refreshDocumentList();
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
    }
  };

  const handleToggle = (isOpen) => setOpen(isOpen);
  const filteredDocList = docList
    .filter((doc) => !deletedDocuments.includes(doc.name))
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Stack spacing={1}>
          <Button
            startIcon={<FileUploadOutlinedIcon />}
            variant="contained"
            onClick={() => handleToggle(true)}
            size="small"
          >
            Carregar
          </Button>
        </Stack>
      </Stack>

      {filteredDocList.length === 0 ? (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          textAlign="center"
          justifyContent="center"
        >
          {empty ? (
            <>
              <img
                src="/assets/errors/empty.jpg"
                alt="imagem simbolizando extensão"
                width={300}
              />
              <Typography sx={{ color: "rgb(108, 115, 127)" }}>
                Nenhum arquivo encontrado
              </Typography>
            </>
          ) : (
            <CircularProgress disableShrink />
          )}
        </Grid>
      ) : (
        <Grid container spacing={2}>
          {filteredDocList.map(({ url, name, size, time }) => (
            <CardFile
              url={url}
              name={name}
              size={size}
              time={time}
              key={name}
              handleDelete={handleDelete}
            />
          ))}
        </Grid>
      )}

      <FileManagerModal
        open={open}
        handleToggle={handleToggle}
        customerId={customerId}
        setSucessUpload={setSucessUpload}
        sucessUpload={sucessUpload}
      />
    </>
  );
};
