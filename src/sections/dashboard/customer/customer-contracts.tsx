import { useRouter } from "next/navigation";
import { Box, Card, ListItemText, Tooltip } from "@mui/material";

const contracts = [
  { id: 1, name: "Contabilidade" },
  { id: 2, name: "Prestação de serviços" },
];

export const ContractList = ({ customer, hasServices }) => {
  const router = useRouter();

  const handleContractClick = (name: string) => {
    const contractType = name.toLowerCase();
    if (hasServices) {
      router.push(`/contratos/${contractType}/${customer.id}`);
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {contracts.map(({ name, id }) => (

        <Card
          key={id}
          sx={{ cursor: "pointer", width: "100%" }}
          onClick={() => handleContractClick(name)}
        >
          <Tooltip
            key={id}
            title={!hasServices ? "Contrato não disponível" : ""}
            placement="top"
          >
            <div style={{ padding: "16px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <img src="/assets/files/icon-pdf.svg" alt="" />
                <ListItemText primary="Contrato" secondary={name} />
              </Box>
            </div>
          </Tooltip>

        </Card>
      ))
      }
    </Box >
  );
};
