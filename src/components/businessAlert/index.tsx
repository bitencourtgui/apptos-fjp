import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

export const BusinessAlert = ({ isBusiness, handleToggle }) => {
  if (isBusiness) {
    return null;
  }

  return (
    <Alert
      severity="warning"
      variant="outlined"
      action={
        <Button
          variant="contained"
          color="warning"
          size="small"
          onClick={handleToggle}
          type="button"
        >
          CADASTRAR EMPRESA
        </Button>
      }
    >
      Processo de abertura concluído? Atualize o cadastro para empresa
    </Alert>
  );
};
