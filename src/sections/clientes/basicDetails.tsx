import { Card, Unstable_Grid2 as Grid } from "@mui/material";
import { BusinessCard } from "@/sections/clientes/businessCard";
import { PersonalCard } from "@/sections/clientes/personalCard";

export const BasicDetails = ({ customer }) => (
  <Grid xs={12} lg={4} sx={{ pr: { lg: 3, xs: 0 }, pb: { xs: 3, lg: 0 } }}>
    <Card>
      <BusinessCard customer={customer} />
      <PersonalCard customer={customer} />
    </Card>
  </Grid>
);
