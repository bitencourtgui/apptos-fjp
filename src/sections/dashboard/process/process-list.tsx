/* eslint-disable react-hooks/exhaustive-deps */
import AddOutlined from "@mui/icons-material/AddOutlined";
import { Button, Grid, SvgIcon } from "@mui/material";
import { Stack } from "@mui/system";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useMounted } from "../../../hooks/use-mounted";
import ProcessApi from "../../../api/process";
import { CardProcess } from "../../../components/card-process";
import { useAuth } from "../../../hooks/use-auth";

const useProcess = (id: string) => {
  const isMounted = useMounted();
  const [process, setProcess] = useState(null);

  const getFinancial = useCallback(async () => {
    try {
      const response = await ProcessApi.getProcessByUser(id);

      if (isMounted()) {
        setProcess(response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getFinancial();
  }, [id]);

  return process;
};

export const ProcessList = (customer: any) => {
  const router = useRouter();
  const process = useProcess(customer.id);
  const { getTenant } = useAuth();
  const gt = getTenant();

  return (
    <Grid item xs={12} md={6} lg={8}>
      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Stack spacing={1}>
          <Button
            size="small"
            startIcon={
              <SvgIcon fontSize="small">
                <AddOutlined />
              </SvgIcon>
            }
            onClick={() =>
              router.push(
                `/${gt}/processos/adicionar?customerId=${customer.id}`
              )
            }
            variant="contained"
          >
            Novo Processo
          </Button>
        </Stack>
      </Stack>

      {process &&
        process.data.map((doc, index) => (
          <CardProcess key={index} customerName={customer?.name} {...doc} />
        ))}
    </Grid>
  );
};
