import PropTypes from "prop-types";
import Lightbulb04Icon from "@untitled-ui/icons-react/build/esm/Lightbulb04";
import { SvgIcon, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const TipRoot = styled("div")(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  display: "flex",
  padding: theme.spacing(1),
}));

export const Tip = ({ message }: { message: string }) => {
  return (
    <TipRoot>
      <SvgIcon color="action" sx={{ mr: 1 }}>
        <Lightbulb04Icon />
      </SvgIcon>
      <Typography
        color="text.secondary"
        sx={{
          alignItems: "center",
          display: "flex",
          "& span": {
            fontWeight: 700,
            mr: 0.5,
          },
        }}
        variant="caption"
      >
        <span>Dica.</span> {message}
      </Typography>
    </TipRoot>
  );
};

Tip.propTypes = {
  message: PropTypes.string.isRequired,
};
