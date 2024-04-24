import React, { useState } from "react";
import { IconButton, Snackbar, Tooltip } from "@mui/material";
import toast from "react-hot-toast";

const CopyToClipboard = ({ icon, text }: any) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(text);
    toast.success("Código PIX copiado");
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Tooltip title="Copiar código PIX">{icon}</Tooltip>
      </IconButton>
    </>
  );
};

export default CopyToClipboard;
