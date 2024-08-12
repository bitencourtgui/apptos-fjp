import {  useRef } from "react";
import { IconButton, SvgIcon, Tooltip } from "@mui/material";
import Settings03Icon from '@untitled-ui/icons-react/build/esm/Settings03';
import { useSettings } from "@/hooks/use-settings";

export const LanguageSwitch = () => {
  const anchorRef = useRef(null);
  const { handleDrawerOpen } = useSettings();

  return (
    <>
      <Tooltip title="Abrir configuração">
        <IconButton ref={anchorRef} onClick={handleDrawerOpen}>
          <SvgIcon>
            <Settings03Icon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
    </>
  );
};
