import { useCallback, useRef, useState } from "react";
import { DotsThreeVertical as DotsVerticalIcon } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";

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
import { sendPasswordResetEmail } from "firebase/auth"; // Importando a função do Firebase
import { getFirebaseAuth } from "@/lib/auth/firebase/client";

import type { Auth } from "firebase/auth";

export const UserMenu = ({ user, ...props }: any) => {
  const anchorRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [firebaseAuth] = useState<Auth>(getFirebaseAuth());

  const handleMenuOpen = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleResetPassword = useCallback(async () => {
    setOpenMenu(false);
    try {
      await sendPasswordResetEmail(firebaseAuth, user.user); // Usando a função sendPasswordResetEmail
      // Exibir mensagem de sucesso
    } catch (err) {
      console.error(err);
      // Exibir mensagem de erro
      console.error("Erro na solicitação de redefinição de senha");
    }
  }, [firebaseAuth, user.user]);

  return (
    <>
      <Tooltip title="Mais opções">
        <IconButton onClick={handleMenuOpen} ref={anchorRef} {...props}>
          <SvgIcon>
            <DotsVerticalIcon />
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
