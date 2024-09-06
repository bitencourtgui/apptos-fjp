import { useState } from "react";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
// import { useAuth } from "@/hooks/use-auth";
// import toast from "react-hot-toast";

export const ConfiguracoesSeguranca = () => {
  //   const { reauthenticateUser, updateUserPassword } = useAuth(); // Use reauthenticateUser do contexto

  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState(""); // Estado para a senha atual
  const [newPassword, setNewPassword] = useState("");

  const handleEdit = () => {
    // if (isEditing) {
    //   // Se estiver no modo de edição, tenta salvar a nova senha
    //   reauthenticateUser(currentPassword) // Primeiro, reautentica o usuário com a senha atual
    //     .then(() => {
    //       return updateUserPassword(newPassword); // Depois, atualiza a senha
    //     })
    //     .then(() => {
    //       toast.success("Senha atualizada com sucesso");
    //       setIsEditing(false); // Sai do modo de edição após salvar
    //     })
    //     .catch((error) => {
    //       toast.error("Falha ao atualizar a senha!");
    //       console.error("Erro ao alterar a senha: " + error.message);
    //     });
    // } else {
    //   // Entra no modo de edição
    //   setIsEditing(true);
    // }
  };

  return (
    <Stack spacing={4}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid xs={12} md={4}>
              <Typography variant="h6">Alterar senha</Typography>
            </Grid>
            <Grid xs={12} sm={12} md={8}>
              <Stack alignItems="center" direction="row" spacing={3}>
                {isEditing && (
                  <TextField
                    label="Senha Atual"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} // Atualiza o estado com a senha atual digitada
                    sx={{ flexGrow: 1 }}
                  />
                )}
                <TextField
                  disabled={!isEditing}
                  label="Nova Senha"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} // Atualiza o estado com a nova senha digitada
                  sx={{
                    flexGrow: 1,
                    ...(!isEditing && {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderStyle: "dotted",
                      },
                    }),
                  }}
                />
                <Button onClick={handleEdit}>
                  {isEditing ? "Salvar" : "Editar"}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card>
        <CardHeader title="Autenticação Multifator" />
        <CardContent sx={{ pt: 0 }}>
          <Grid container spacing={4}>
            <Grid xs={12} sm={6}>
              <Card sx={{ height: "100%" }} variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: "block",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        "&::before": {
                          backgroundColor: "error.main",
                          borderRadius: "50%",
                          content: '""',
                          display: "block",
                          height: 8,
                          left: 4,
                          position: "absolute",
                          top: 7,
                          width: 8,
                          zIndex: 1,
                        },
                      }}
                    >
                      <Typography color="error" sx={{ pl: 3 }} variant="body2">
                        Desativado
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ mt: 1 }} variant="subtitle2">
                    App de Autenticação
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Use um app de autenticação para gerar códigos de segurança
                    únicos.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      endIcon={
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      }
                      disabled
                      variant="outlined"
                    >
                      Configurar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid sm={6} xs={12}>
              <Card sx={{ height: "100%" }} variant="outlined">
                <CardContent>
                  <Box sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        "&::before": {
                          backgroundColor: "error.main",
                          borderRadius: "50%",
                          content: '""',
                          display: "block",
                          height: 8,
                          left: 4,
                          position: "absolute",
                          top: 7,
                          width: 8,
                          zIndex: 1,
                        },
                      }}
                    >
                      <Typography color="error" sx={{ pl: 3 }} variant="body2">
                        Desativado
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ mt: 1 }} variant="subtitle2">
                    SMS
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mt: 1 }}
                    variant="body2"
                  >
                    Use seu celular para receber códigos de segurança via SMS.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Button
                      endIcon={
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      }
                      variant="outlined"
                      disabled
                    >
                      Configurar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
};
