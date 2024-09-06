import React from "react";
import { Divider } from "@mui/material";

import { PropertyItem } from "@/components/core/property-item";
import { PropertyList } from "@/components/core/property-list";

export function BasicBusiness({ customers }: any): React.JSX.Element {
  return (
    <PropertyList>
      {(
        [
          { key: "Razão social", value: customers?.corporateName },
          { key: "CNPJ", value: customers?.document },
          { key: "CNAE", value: customers?.cnae },
          { key: "E-mail", value: customers?.email },
          { key: "Telefone", value: customers?.phone },
        ] satisfies { key: string; value: React.ReactNode }[]
      ).map(
        (item): React.JSX.Element => (
          <PropertyItem key={item.key} name={item.key} value={item.value} />
        ),
      )}
    </PropertyList>
  );
}
