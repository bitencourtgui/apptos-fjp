import { useState } from "react";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import AddOutlined from "@mui/icons-material/AddOutlined";
import {
  Button,
  Card,
  CardHeader,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

import CustomersApi from "@/api/customers";
import { useAuth } from "@/hooks/use-auth";
import { Scrollbar } from "@/components/scrollbar";
import { SeverityPill } from "@/components/severity-pill";
import { maskDocument } from "@/utils/masks/maskDocument";

import PartnersModal from "./Partners/modal";
import { customersSchema } from "./customer-schema";
import { partnersInitial } from "./Partners/partners-initial";

interface CustomerPartnersProps {
  customers: any;
  getCustomer: () => void;
}

const ActionButton = ({ action }: { action: () => void }): JSX.Element => {
  return (
    <Button
      size="small"
      startIcon={
        <SvgIcon fontSize="small">
          <AddOutlined />
        </SvgIcon>
      }
      onClick={action}
      variant="contained"
    >
      Adicionar
    </Button>
  );
};

export const CustomerPartners = ({
  customers,
  getCustomer,
}: CustomerPartnersProps) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const onSubmit = async (values, helpers) => {
    try {
      const payload = {
        ...customers,
        partners: [...(customers.partners || []), values],
      };

      const response = await CustomersApi.updateCustomer(customers.id, payload);

      if (response.status === 200) {
        getCustomer();
        handleToggle();
        toast.success("Sócio cadastrado");
        helpers.setStatus({ success: true });
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      toast.error("Falha ao cadastrar client5");
      helpers.setStatus({ success: false });
      helpers.setErrors({ submit: err.message });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: partnersInitial,
    validationSchema: customersSchema,
    onSubmit,
  });

  return (
    <>
      <Card>
        <CardHeader
          action={<ActionButton action={handleToggle} />}
          title="Quadro Societário"
        />
        <Scrollbar>
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
                ? customers.partners?.map((partner, key) => {
                    const managingPartner = partner.managingPartner
                      ? "Administrador"
                      : "";

                    const severity = partner.managingPartner ? "error" : "info"

                    return (
                      <TableRow key={key}>
                        <TableCell>{maskDocument(partner.document)}</TableCell>
                        <TableCell>{partner.name}</TableCell>
                        <TableCell>
                          <SeverityPill color={severity}>{`Sócio ${managingPartner}`}</SeverityPill>
                        </TableCell>
                      </TableRow>
                    );
                  })
                : []}
               
            </TableBody> 
          </Table>
        </Scrollbar>
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
