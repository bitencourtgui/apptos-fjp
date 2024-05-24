import { useState } from "react";
import CustomerModal from "./customer-contract-modal";
import { Box, Card, ListItemText } from "@mui/material";

const contracts = [
  { id: 1, name: "Contabilidade" },
  { id: 2, name: "Prestação de serviços" },
];

export const ContractList = ({customer}) => {
  const [open, setOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);

  const handleToggle = (isOpen) => setOpen(isOpen);
  const handleContractClick = (contract) => {
    setSelectedContract(contract);
    setOpen(true);
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 2 }}>
        {contracts.map((contract) => (
          <Card
            key={contract.id}
            sx={{ cursor: "pointer" }}
            onClick={() => handleContractClick(contract)}
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
                <ListItemText primary="Contrato" secondary={contract?.name} />
              </Box>
            </div>
          </Card>
        ))}
      </Box>
      <CustomerModal
        open={open}
        handleToggle={handleToggle}
        contract={selectedContract}
        customer={customer}
      />
    </>
  );
};
