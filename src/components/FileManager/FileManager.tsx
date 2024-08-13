import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Card,
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
import { convertFileSize } from "@/utils/convert-filesize";
import { firebaseApp } from "@/libs/firebase";

interface FileManagerProps {
  customerId: string;
}

interface Document {
  name: string;
  url: string;
  size: string;
  time: string;
}

export const FileManager: React.FC<FileManagerProps> = ({ customerId }) => {
  const storage = getStorage(firebaseApp);
  const [docList, setDocList] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [successUpload, setSuccessUpload] = useState(false);
  const [deletedDocuments, setDeletedDocuments] = useState<string[]>([]);

  const refreshDocumentList = useCallback(async () => {
    if (!storage || !customerId) {
      console.error("Storage or customerId not defined");
      return;
    }

    try {
      const docListRef = ref(storage, `documents/${customerId}`);
      const response = await listAll(docListRef);
      const tempDocList: Document[] = await Promise.all(
        response.items.map(async (item) => {
          const [url, metadata] = await Promise.all([
            getDownloadURL(item),
            getMetadata(item),
          ]);
          return {
            name: metadata.name,
            url,
            size: convertFileSize(metadata.size),
            time: metadata.updated,
          };
        })
      );

      setEmpty(tempDocList.length === 0);
      setDocList(tempDocList);
    } catch (error) {
      console.error("Error listing documents:", error);
    }
  }, [storage, customerId]);

  useEffect(() => {
    if (customerId) {
      refreshDocumentList();
      setSuccessUpload(false);
      setOpen(false);
    }
  }, [customerId, refreshDocumentList]);

  useEffect(() => {
    if (successUpload || (!empty && docList.length === 0)) {
      refreshDocumentList();
      setSuccessUpload(false);
      setOpen(false);
    }
  }, [successUpload, docList, empty, refreshDocumentList]);

  const handleDelete = async (name: string) => {
    const storageRef = ref(storage, `documents/${customerId}/${name}`);

    try {
      await deleteObject(storageRef);
      setDeletedDocuments((prev) => [...prev, name]);
      refreshDocumentList();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleToggle = (isOpen: boolean) => setOpen(isOpen);

  const filteredDocList = docList
    .filter((doc) => !deletedDocuments.includes(doc.name))
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <Card>
      <div style={{ padding: "16px" }}>
        <Stack direction="row" justifyContent="flex-end" mb={2}>
          <Button
            startIcon={<FileUploadOutlinedIcon />}
            variant="contained"
            onClick={() => handleToggle(true)}
            size="small"
          >
            Enviar
          </Button>
        </Stack>

        {filteredDocList.length === 0 ? (
          <Grid item xs={12} sm={6} md={4} textAlign="center" justifyContent="center">
            {empty ? (
              <>
                <img
                  src="/assets/errors/empty.png"
                  alt="No files found"
                  width={250}
                />
                <Typography color="inherit" variant="body2" m={1}>
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
          setSuccessUpload={setSuccessUpload}
          successUpload={successUpload}
        />
      </div>
    </Card>
  );
};


