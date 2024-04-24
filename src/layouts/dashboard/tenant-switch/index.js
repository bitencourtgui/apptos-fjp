/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import { Box, IconButton, Stack, SvgIcon, Typography } from "@mui/material";
import { TenantPopover } from "./tenant-popover";
import { useAuth } from "../../../hooks/use-auth";
import { capitalize } from "../../../utils/capitalize";
import { cleanText } from "../../../utils/clear-text";
import { useRouter } from 'next/router'

const tenants = ["Cívil", "Familia", "Trabalhista"];

export const TenantSwitch = (props) => {
  const anchorRef = useRef(null);
  const router = useRouter();
  

  const [openPopover, setOpenPopover] = useState(false);
  const { getTenant, setTenant } = useAuth();

  const tenant = getTenant();

  const handlePopoverOpen = useCallback(() => {
    setOpenPopover(true);
  }, []);

  const handlePopoverClose = useCallback(() => {
    setOpenPopover(false);
  }, []);

  const handleTenantChange = useCallback((tenant) => {
    setTenant(cleanText(tenant));
    setOpenPopover(false);
    router.push(`/${cleanText(tenant)}`);
  }, []);

  return (
    <>
      <Stack alignItems="center" direction="row" spacing={2} {...props}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography color="inherit" variant="h6">
            FA Advocacia
          </Typography>
          <Typography color="neutral.400" variant="body2">
            {capitalize(tenant)}
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
        onChange={handleTenantChange}
        onClose={handlePopoverClose}
        open={openPopover}
        tenants={tenants}
      />
    </>
  );
};

TenantSwitch.propTypes = {
  // @ts-ignore
  sx: PropTypes.object,
};
