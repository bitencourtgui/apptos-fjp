import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "@/components/scrollbar";
import { UserMenu } from "@/components/menu-user";

const roles = {
  developer: "Desenvolvedor",
  intern: "Estagiário",
  lawyer: "Advogado",
};

const rolesList = (role: string) => roles[role] || role;

export const UserListTable = ({ users, ...other }) => (
  <Box sx={{ position: "relative" }} {...other}>
    <Scrollbar>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Usuário</TableCell>
            <TableCell>Função</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow hover key={user.id}>
              <TableCell>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography variant="body2">{user.name}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography variant="body2">{user.user}</Typography>
                </Stack>
              </TableCell>
              <TableCell>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography variant="body2">
                    {rolesList(user.role)}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="right">
                <UserMenu user={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Scrollbar>
  </Box>
);
