import { useCallback, useRef, useState, useEffect } from "react";
import DotsHorizontalIcon from "@untitled-ui/icons-react/build/esm/DotsHorizontal";
import Download01Icon from "@untitled-ui/icons-react/build/esm/Key01";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
  Tooltip,
} from "@mui/material";
import { useAuth } from "../hooks/use-auth";
import toast from "react-hot-toast";

export const UserMenu = ({ user, ...props }) => {
  const anchorRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const { sendPasswordResetEmail, getUser } = useAuth();

  const [userData, setUserData] = useState(null);

  const handleMenuOpen = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleResetPassword = useCallback(async () => {
    setOpenMenu(false);
    try {
      await sendPasswordResetEmail(user.user);

      toast.success("Solicitação de redefinição de senha enviada");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao solicitação de redefinição de senha");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Tooltip title="More options">
        <IconButton onClick={handleMenuOpen} ref={anchorRef} {...props}>
          <SvgIcon>
            <DotsHorizontalIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorRef.current}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        onClose={handleMenuClose}
        open={openMenu}
        PaperProps={{
          sx: {
            maxWidth: "100%",
            width: 200,
          },
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
      >
        <MenuItem onClick={handleResetPassword}>
          <ListItemIcon>
            <SvgIcon>
              <Download01Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="Redefinir senha" />
        </MenuItem>
      </Menu>
    </>
  );
};
