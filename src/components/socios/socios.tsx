import { useState } from "react";
import { useFormik } from "formik";
import Plus from "@untitled-ui/icons-react/build/esm/Plus";
import {
  Button,
  Card,
  CardHeader,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import { SeverityPill } from "../core/severity-pill";
import { customersSchema } from "./form/schema";
import { initialValues } from "./form/initial";
import { maskDocument } from "@/utils/mask-document";
import PartnersModal from "./socios-modal";
import { updateCustomerAPI } from "@/api/customers";

interface CustomerPartnersProps {
  customers: any;
  getCustomer: () => void;
  isClient: boolean
}

const ActionButton = ({ action }: { action: () => void }): JSX.Element => {
  return (
    <Button
      size="small"
      startIcon={
        <SvgIcon fontSize="small">
          <Plus />
        </SvgIcon>
      }
      onClick={action}
      variant="contained"
    >
      Adicionar
    </Button>
  );
};

export const SociosList = ({
  customers,
  getCustomer,
  isClient
}: CustomerPartnersProps) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const onSubmit = async (values: any, helpers: any) => {
    try {
      const payload = {
        ...customers,
        partners: [...(customers.partners || []), values],
      };

      const result = await updateCustomerAPI(customers.id, payload);
      if (result.success) {
        getCustomer(); // Atualiza os dados do cliente após o sucesso
        handleToggle(); // Fecha o modal ou realiza a ação necessária
        // toast.success("Sócio cadastrado"); // Exibe uma mensagem de sucesso
        helpers.setStatus({ success: true }); // Marca o status como sucesso
      } else {
        throw new Error(result.error || "Erro inesperado na atualização");
      }
    } catch (err: any) {
      // toast.error("Falha ao cadastrar client5");
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: err?.message });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: customersSchema,
    onSubmit,
  });

  return (
    <>
      <Card>
        <CardHeader
          action={!isClient && <ActionButton action={handleToggle} />}
          title="Quadro Societário"
        />
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow>
              <TableCell>Documento</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Sócio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers?.partners
              ? customers.partners?.map((partner: any, key: any) => {
                  const managingPartner = partner.managingPartner
                    ? "Administrador"
                    : "";

                  const severity = partner.managingPartner ? "error" : "info";

                  return (
                    <TableRow key={key}>
                      <TableCell>{maskDocument(partner.document)}</TableCell>
                      <TableCell>{partner.name}</TableCell>
                      <TableCell>
                        <SeverityPill
                          color={severity}
                        >{`Sócio ${managingPartner}`}</SeverityPill>
                      </TableCell>
                    </TableRow>
                  );
                })
              : []}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={0}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          page={0}
          rowsPerPage={5}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
      <PartnersModal formik={formik} open={open} handleToggle={handleToggle} />
    </>
  );
};
