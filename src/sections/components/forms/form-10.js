import { Box, Button, TextField, Typography } from '@mui/material';

export const Form10 = () => (
  <Box sx={{ p: 3 }}>
    <form onSubmit={(event) => event.preventDefault()}>
      <TextField
        fullWidth
        label="Product Name"
        name="name"
      />
      <Typography
        sx={{
          mt: 3,
          mb: 2
        }}
        variant="subtitle2"
      >
        Description
      </Typography>
  
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mt: 3
        }}
      >
        <Button
          type="submit"
          variant="contained"
        >
          Update
        </Button>
      </Box>
    </form>
  </Box>
);
