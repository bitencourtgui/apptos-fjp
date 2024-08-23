import React, { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";

import { useUsers } from "@/hooks/useUsers";

import { Layout as DashboardLayout } from "@/layouts/dashboard";
import { UserListTable } from "@/sections/dashboard/users/users-list-table";
import { UserDrawer } from "@/sections/dashboard/users/user-drawer";
import { Head } from "@/components/Head";

const Usuarios = () => {
  const rootRef = useRef(null);
  const { users, reload } = useUsers();

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
    <>
      <Head page="Usuários" />
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
    </>
  );
};

Usuarios.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default Usuarios;
