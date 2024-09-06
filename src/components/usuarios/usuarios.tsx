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
import { UserMenu } from "./usuarios-menu";

const roles: any = {
  developer: "Desenvolvedor",
  intern: "Estagiário",
  lawyer: "Advogado",
  accountant: "Contador",
};

const rolesList = (role: string) => roles[role] || role;

export const UserListTable = ({ users, ...other }: any) => (
  <Box sx={{ position: "relative" }} {...other}>
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
        {users.map((user: any) => (
          <TableRow hover key={user.id}>
            <TableCell>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="body2">{user.name ?? "--"}</Typography>
              </Stack>
            </TableCell>
            <TableCell>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="body2">{user.user}</Typography>
              </Stack>
            </TableCell>
            <TableCell>
              <Stack alignItems="center" direction="row" spacing={1}>
                <Typography variant="body2">{rolesList(user.role)}</Typography>
              </Stack>
            </TableCell>
            <TableCell align="right">
              <UserMenu user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
);
