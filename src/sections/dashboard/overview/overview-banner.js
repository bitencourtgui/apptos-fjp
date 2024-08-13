import PropTypes from 'prop-types';
import Settings04Icon from '@untitled-ui/icons-react/build/esm/Settings04';
import { Box, Button, Stack, SvgIcon, Typography } from '@mui/material';
import { useSettings } from '../../../hooks/use-settings';

export const OverviewBanner = (props) => {
  

  return (
    <Stack
      alignItems="center"
      direction={{
        xs: 'column',
        md: 'row'
      }}
      spacing={4}
      sx={{
        backgroundColor: (theme) => theme.palette.mode === 'dark'
          ? 'primary.darkest'
          : 'neutral.300',
        borderRadius: 2.5,
        p: 4
      }}
      {...props}>
      <Box
        sx={{
          width: 200,
          '& img': {
            width: '100%'
          }
        }}
      >
        <img src="/assets/person-standing.png" />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        
        <Typography
          color="text.primary"
          variant="h6"
          sx={{mt: 2}}
        >
          Nova atualização disponível!
        </Typography>
        <Typography
          color="text.primary"
          sx={{ mt: 1 }}
          variant="body1"
        >
          
          Agora, você pode gerenciar sua conta com facilidade na nova página de configurações. Tudo isso com uma navegação mais intuitiva e segura!
        </Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            color="primary"
            href="/minha-conta"
            startIcon={(
              <SvgIcon>
                <Settings04Icon />
              </SvgIcon>
            )}
            variant="contained"
          >
            Abrir configuração
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};

OverviewBanner.propTypes = {
  onDismiss: PropTypes.func
};
