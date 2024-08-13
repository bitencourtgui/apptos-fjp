import React from "react";
import { Box, Divider, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { extensionFiles } from "@/utils/extension-files";
import { convertDateTime } from "@/utils/convert-timeIso";
import { ICardFile } from "./CardFile.types";


export const CardFile: React.FC<ICardFile> = ({ name, size, url, time, handleDelete }) => {

// remover isso daqui
  const handleAssingDocument  = (url) => {
    console.info('assinar docs', url)
  }

  return (
    <Grid item xs={12} sm={6} md={4} key={name}>
      <Paper variant="outlined" key={name}>
        <Stack direction="row" justifyContent="flex-end" p={2} pb={0}>
        <IconButton aria-label="delete" sx={{ padding: "0" }} onClick={() => handleAssingDocument(url)}>
            <CreateOutlinedIcon fontSize="small"/>
          </IconButton>
          <IconButton aria-label="delete" sx={{ padding: "0" }} onClick={() => handleDelete(name)}>
            <DeleteOutlineIcon fontSize="small"/>
          </IconButton>
        
        </Stack>
        <Box sx={{ padding: "16px", paddingTop: "0px" }}>
          <Box sx={{ display: "flex", marginBottom: "8px" }}>
            <Box sx={{ display: "inline-flex", cursor: "pointer" }}>
              <img src={extensionFiles(name)} alt="imagem simbolizando extensão" />
            </Box>
          </Box>
          <Typography variant="subtitle2">{name}</Typography>
          <Divider sx={{ margin: "8px 0" }} />
          <Stack
            sx={{ color: "rgb(108, 115, 127)" }}
            spacing={2}
            direction="row"
            justifyContent="space-between"
          >
            <Typography variant="body2">{size}</Typography>

            <IconButton sx={{ padding: "0" }} href={url} target="_blank">
              <FileDownloadOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Typography variant="caption" sx={{ color: "rgb(108, 115, 127)" }}>
            {convertDateTime(time)}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};
