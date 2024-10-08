import { useRouter } from "next/navigation";
import { Box, Card, ListItemText, Tooltip } from "@mui/material";
import Image from "next/image";

const contracts = [
  { id: 1, name: "Contabilidade", path: "contabilidade" },
  { id: 2, name: "Prestação de serviços", path: "outros-servicos" },
];

export const ContractListOld = ({ customer, hasServices }: any) => {
  const router = useRouter();

  const handleContractClick = (path: string) => {
    const contractType = path.toLowerCase();

    router.push(`/contratos/${contractType}/${customer.id}`);
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      {contracts.map(({ name, id, path }) => (
        <Card
          key={id}
          sx={{ cursor: "pointer", width: "100%" }}
          onClick={() => handleContractClick(path)}
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
                <Image src="/assets/files/icon-pdf.svg" alt="icone pdf" width={40} height={48}/>
                <ListItemText primary="Contrato" secondary={name} />
              </Box>
            </div>
          </Tooltip>
        </Card>
      ))}
    </Box>
  );
};
