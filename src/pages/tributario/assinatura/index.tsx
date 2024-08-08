import React, { useState, useRef } from "react";
import { Layout as DashboardLayout } from "../../../layouts/dashboard";
import Head from "next/head";
import {
  Box,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Typography,
  SelectChangeEvent,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { PDFDocument } from "pdf-lib";

// Simulando uma lista de clientes
const clients = [
  { name: "Cliente A", socios: 2 },
  { name: "Cliente B", socios: 3 },
  { name: "Cliente C", socios: 1 },
];

const AssinaturaDocumentos = () => {
  const [contractType, setContractType] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<{ name: string; socios: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContractChange = (event: SelectChangeEvent<string>) => {
    setContractType(event.target.value);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);

      reader.onload = async () => {
        const pdfDoc = await PDFDocument.load(reader.result as ArrayBuffer);
        setNumPages(pdfDoc.getPageCount());
      };
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelectedClient(null);
  };

  const handleClientSelect = (client: { name: string; socios: number }) => {
    setSelectedClient(client);
    setSearchTerm(client.name);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Assinatura | FJP</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="contract-type-label">Tipo de Contrato</InputLabel>
            <Select
              labelId="contract-type-label"
              value={contractType}
              label="Tipo de Contrato"
              onChange={handleContractChange}
            >
              <MenuItem value="contabilidade">Contrato Contabilidade</MenuItem>
              <MenuItem value="prestacao-servicos">
                Contrato Prestação de Serviços
              </MenuItem>
              <MenuItem value="outros">Outros</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Pesquisar Cliente"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 3 }}
          />

          {searchTerm && (
            <List sx={{ mb: 3 }}>
              {filteredClients.map(client => (
                <ListItem
                  button
                  key={client.name}
                  onClick={() => handleClientSelect(client)}
                >
                  <ListItemText primary={client.name} />
                </ListItem>
              ))}
            </List>
          )}

          {selectedClient && (
            <Typography variant="body1">
              Cliente: {selectedClient.name} - Número de Sócios: {selectedClient.socios}
            </Typography>
          )}

          <Button
            variant="contained"
            component="label"
            onClick={() => fileInputRef.current?.click()}
            sx={{ mb: 3 }}
          >
            Enviar PDF
            <input
              type="file"
              accept="application/pdf"
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </Button>

          {pdfFile && (
            <>
              <Typography variant="body1">Arquivo: {pdfFile.name}</Typography>
              <Typography variant="body1">
                Número de páginas: {numPages}
              </Typography>
              <Typography variant="body1">
                Página de assinatura: {(numPages ?? 0) - 2}
              </Typography>
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

AssinaturaDocumentos.getLayout = (page: React.ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default AssinaturaDocumentos;
