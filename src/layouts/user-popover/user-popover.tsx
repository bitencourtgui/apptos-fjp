"use client";

import * as React from "react";
import RouterLink from "next/link";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { CreditCard as CreditCardIcon } from "@phosphor-icons/react/dist/ssr/CreditCard";
import { LockKey as LockKeyIcon } from "@phosphor-icons/react/dist/ssr/LockKey";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

import type { User } from "@/types/user";
import { config } from "@/config";
import { paths } from "@/paths";
import { AuthStrategy } from "@/lib/auth/strategy";

import { FirebaseSignOut } from "./firebase-sign-out";
import { useUser } from "@/hooks/use-user";


const user = {
  id: "USR-000",
  name: "Sofia Rivers",
  avatar: "/assets/avatar.png",
  email: "sofia@devias.io",
} satisfies User;

export interface UserPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open: boolean;
}

export function UserPopover({
  anchorEl,
  onClose,
  open,
}: UserPopoverProps): React.JSX.Element {

  const { user, error, isLoading } = useUser();

  console.log('user', user)


  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: "280px" } } }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <Box sx={{ p: 2 }}>
        <Typography>{user?.name ?? ""}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.email ?? ""}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ p: 1 }}>
        <MenuItem component={RouterLink} href="/minha-conta" onClick={onClose}>
          <ListItemIcon>
            <UserIcon />
          </ListItemIcon>
          Minha conta
        </MenuItem>
      </List>
      <Divider />
      <Box sx={{ p: 1 }}>
        {config.auth.strategy === AuthStrategy.FIREBASE ? (
          <FirebaseSignOut />
        ) : null}
      </Box>
    </Popover>
  );
}
