/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useRef, useState, FC } from "react";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import {
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
  SxProps,
} from "@mui/material";
import { TenantPopover } from "./tenant-popover";

interface TenantSwitchProps {
  sx?: SxProps;
}

const tenants = ["Tributário"];

export const TenantSwitch: FC<TenantSwitchProps> = (props) => {
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const handlePopoverOpen = useCallback(() => {
    setOpenPopover(true);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setOpenPopover(false);
  }, []);

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="inherit" variant="subtitle1">
            FJP Consultoria
          </Typography>
          <Typography color="neutral.400" variant="body2">
            Tributário
          </Typography>
        </Box>
        <IconButton onClick={handlePopoverOpen} ref={anchorRef}>
          <SvgIcon sx={{ fontSize: 16 }}>
            <ChevronDownIcon />
          </SvgIcon>
        </IconButton>
      </Stack>
      <TenantPopover
        anchorEl={anchorRef.current}
        // onChange={handleTenantChange}
        onClose={handlePopoverClose}
        open={openPopover}
        tenants={tenants}
      />
    </>
  );
};
