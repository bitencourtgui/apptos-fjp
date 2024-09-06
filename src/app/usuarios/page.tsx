"use client";

import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { UserListTable } from "@/components/usuarios/usuarios";
import { useUsers } from "@/hooks/use-users";
import { UserDrawer } from "@/components/usuarios/usuarios-modal";

export default function Page(): React.JSX.Element {
  const rootRef = useRef(null);
  const { users, loading, error, reload } = useUsers();
  
  const [drawer, setDrawer] = useState({
    isOpen: false,
    data: undefined,
  });

  const handleOrderClose = useCallback(() => {
    setDrawer({
      isOpen: false,
      data: undefined,
    });
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Stack direction="row" justifyContent="space-between" spacing={4}>
            <Typography variant="h4">Usuários</Typography>
            <Stack alignItems="center" direction="row" spacing={3}>
              <Button
                onClick={() => setDrawer({ isOpen: true, data: undefined })}
                startIcon={
                  <SvgIcon>
                    <PlusIcon />
                  </SvgIcon>
                }
                size="small"
                variant="contained"
              >
                Novo
              </Button>
            </Stack>
          </Stack>
          <Card>
            <UserListTable users={users} />
          </Card>
        </Stack>
        <UserDrawer
          container={rootRef.current}
          onClose={handleOrderClose}
          open={drawer.isOpen}
          reload={reload}
        />
      </Container>
    </Box>
  );
}
