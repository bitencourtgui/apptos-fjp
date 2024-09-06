import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export interface PropertyItemProps {
  name: string;
  value: string | React.ReactNode;
}

export function PropertyItem({ name, value }: PropertyItemProps): React.JSX.Element {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'grid',
        gridTemplateColumns: 'var(--PropertyItem-columns)',
        px: '8px',
        py: '4px'
      }}
    >
      <div>
        <Typography color="text.secondary" variant="body2">
          {name}
        </Typography>
      </div>
      <div>
        {typeof value === 'string' ? (
          <Typography color={value ? 'text.primary' : 'text.secondary'} variant="subtitle2">
            {value || 'None'}
          </Typography>
        ) : (
          <React.Fragment>{value}</React.Fragment>
        )}
      </div>
    </Box>
  );
}
