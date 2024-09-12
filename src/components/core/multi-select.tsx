import { useCallback, useRef, useState } from 'react';
import ChevronDownIcon from '@untitled-ui/icons-react/build/esm/ChevronDown';
import { Button, Checkbox, FormControlLabel, Menu, MenuItem, SvgIcon } from '@mui/material';

// Definindo os tipos para as props do componente
interface MultiSelectProps {
  label: string;
  onChange?: (value: string[]) => void;
  options: Array<{ label: string; value: string }>;
  value: string[];
}

export const MultiSelect: React.FC<MultiSelectProps> = (props) => {
  const { label, onChange, options, value = [], ...other } = props;
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = useCallback(() => {
    setOpenMenu(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setOpenMenu(false);
  }, []);

  const handleValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = [...value];

    if (event.target.checked) {
      newValue.push(event.target.value);
    } else {
      newValue = newValue.filter((item) => item !== event.target.value);
    }

    onChange?.(newValue);
  }, [onChange, value]);

  return (
    <>
      <Button
        color="inherit"
        endIcon={(
          <SvgIcon>
            <ChevronDownIcon />
          </SvgIcon>
        )}
        onClick={handleMenuOpen}
        ref={anchorRef}
        {...other}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        onClose={handleMenuClose}
        open={openMenu}
        PaperProps={{ style: { width: 250 } }}
      >
        {options.map((option) => (
          <MenuItem key={option.value}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={value.includes(option.value)}
                  onChange={handleValueChange}
                  value={option.value}
                />
              )}
              label={option.label}
              sx={{
                flexGrow: 1,
                mr: 0
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
