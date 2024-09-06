import React from "react";

import { BasicBusiness } from "./business";

export function BasicDetails({ customers }: any): React.JSX.Element {
  const isBusiness = customers?.business?.document?.length >= 1;

  const customer = isBusiness ? customers.business : customers;

  return <BasicBusiness customers={customer} />;
}
