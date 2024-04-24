import InfoCircleIcon from '@untitled-ui/icons-react/build/esm/InfoCircle';
import Link01Icon from '@untitled-ui/icons-react/build/esm/Link01';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  SvgIcon,
  Typography
} from '@mui/material';

export const OverviewHelp = (props) => (
  <Card {...props}>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex'
        }}
      >
        <SvgIcon color="primary">
          <InfoCircleIcon />
        </SvgIcon>
        <Typography
          color="primary.main"
          sx={{ pl: 1 }}
          variant="subtitle2"
        >
         Suporte
        </Typography>
      </Box>
      <Typography
        sx={{ mt: 2 }}
        variant="h6"
      >
        Ficou com dúvida ou precisa de ajuda?
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mt: 1 }}
        variant="body2"
      >
       Não sofra sozinho, estamos aqui para ajudar, clique no botão abaixo para receber ajuda.
      </Typography>
    </CardContent>
    <Divider />
    <CardActions>
      <Button
        color="inherit"
        href="https://chat.whatsapp.com/L8lmrCKIAJy7r6yfMoGjqY"
        target="_blank"
        endIcon={(
          <SvgIcon>
            <Link01Icon />
          </SvgIcon>
        )}
        size="small"
      >
        Entrar em contato
      </Button>
    </CardActions>
  </Card>
);
