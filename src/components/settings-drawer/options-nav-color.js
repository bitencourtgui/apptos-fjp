import { Chip, Stack, Typography } from "@mui/material";

const options = [
  {
    label: "Sem cor",
    value: "blend-in",
  },
  {
    label: "Discreto",
    value: "discreet",
  },
  {
    label: "Evidente",
    value: "evident",
  },
];

export const OptionsNavColor = ({ onChange, value }) => {
  return (
    <Stack spacing={1}>
      <Typography color="text.secondary" variant="overline">
        Cor do menu
      </Typography>
      <Stack alignItems="center" direction="row" flexWrap="wrap" gap={2}>
        {options.map((option) => (
          <Chip
            key={option.label}
            label={option.label}
            onClick={() => onChange?.(option.value)}
            sx={{
              borderColor: "transparent",
              borderRadius: 1.5,
              borderStyle: "solid",
              borderWidth: 2,
              ...(option.value === value && {
                borderColor: "primary.main",
              }),
            }}
          />
        ))}
      </Stack>
    </Stack>
  );
};
