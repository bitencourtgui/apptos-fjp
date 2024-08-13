import Camera01Icon from "@untitled-ui/icons-react/build/esm/Camera01";
import User01Icon from "@untitled-ui/icons-react/build/esm/User01";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import toast from "react-hot-toast";

export const AccountGeneralSettings = (props) => {
  const { avatar, email, name: initialName } = props;

  const { user, updateUserName } = useAuth();

  console.log(user);

  const [name, setName] = useState(initialName);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSaveName = async () => {
    try {
      await updateUserName(name);
      toast.success("Nome atualizado com Sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar o nome. Tente novamente.");
    }
  };

  return (
    <Stack spacing={4} {...props}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Typography variant="h6">Detalhes Básicos</Typography>
            </Grid>
            <Grid xs={12} md={8}>
              <Stack spacing={3}>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <Box
                    sx={{
                      borderColor: "neutral.300",
                      borderRadius: "50%",
                      borderStyle: "dashed",
                      borderWidth: 1,
                      p: "4px",
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: "50%",
                        height: "100%",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          alignItems: "center",
                          backgroundColor: (theme) =>
                            alpha(theme.palette.neutral[700], 0.5),
                          borderRadius: "50%",
                          color: "common.white",
                          cursor: "pointer",
                          display: "flex",
                          height: "100%",
                          justifyContent: "center",
                          left: 0,
                          opacity: 0,
                          position: "absolute",
                          top: 0,
                          width: "100%",
                          zIndex: 1,
                          "&:hover": {
                            opacity: 1,
                          },
                        }}
                      >
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <SvgIcon color="inherit">
                            <Camera01Icon />
                          </SvgIcon>
                        </Stack>
                      </Box>
                      <Avatar
                        src={avatar}
                        sx={{
                          height: 100,
                          width: 100,
                        }}
                      >
                        <SvgIcon>
                          <User01Icon />
                        </SvgIcon>
                      </Avatar>
                    </Box>
                  </Box>
                  <Button color="inherit" size="small">
                    Alterar
                  </Button>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <TextField
                    value={name}
                    onChange={handleNameChange}
                    label="Nome completo"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button color="inherit" size="small" onClick={handleSaveName}>
                    Salvar
                  </Button>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={2}>
                  <TextField
                    defaultValue={email}
                    disabled
                    label="Endereço de e-mail"
                    required
                    sx={{
                      flexGrow: 1,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderStyle: "dashed",
                      },
                    }}
                  />
                  <Button color="inherit" size="small">
                    Editar
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Typography variant="h6">Deletar Conta</Typography>
            </Grid>
            <Grid xs={12} md={8}>
              <Stack alignItems="flex-start" spacing={3}>
                <Typography variant="subtitle1">
                  Delete a sua conta e todos os seus dados. Isto é irreversível.
                </Typography>
                <Button color="error" variant="outlined">
                  Deletar conta
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
