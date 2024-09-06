import React from "react";
import { Box, Divider, Grid, IconButton, Paper, Stack, Typography } from "@mui/material";

import { extensionFiles } from "@/utils/extension-files";
import { ICardFile } from "./CardFile.types";

import Trash01 from "@untitled-ui/icons-react/build/esm/Trash01";
import Download01 from "@untitled-ui/icons-react/build/esm/Download01";
import Edit04 from "@untitled-ui/icons-react/build/esm/Edit04";
import Image from "next/image";
import { convertDateTime } from "@/utils/convert-timeIso";


export const CardFile: React.FC<ICardFile> = ({ name, size, url, time, handleDelete }) => {

// remover isso daqui
  const handleAssingDocument  = (url: any) => {
    console.info('assinar docs', url)
  }

  return (
    <Grid item xs={12} sm={6} md={4} key={name}>
      <Paper variant="outlined" key={name}>
        <Stack direction="row" justifyContent="flex-end" p={2} pb={0}>
        <IconButton aria-label="delete" sx={{ padding: "0" }} onClick={() => handleAssingDocument(url)}>
            <Edit04 fontSize="small"/>
          </IconButton>
          <IconButton aria-label="delete" sx={{ padding: "0" }} onClick={() => handleDelete(name)}>
            <Trash01 fontSize="small"/>
          </IconButton>
        
        </Stack>
        <Box sx={{ padding: "16px", paddingTop: "0px" }}>
          <Box sx={{ display: "flex", marginBottom: "8px" }}>
            <Box sx={{ display: "inline-flex", cursor: "pointer" }}>
              <Image src={extensionFiles(name)} alt="imagem simbolizando extensão" width={41} height={48} />
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
              <Download01 fontSize="small" />
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
