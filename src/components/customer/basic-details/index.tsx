/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { BasicBusiness } from './business';

export function BasicDetails({ customers }: any): React.JSX.Element {
  const isBusiness = customers?.business?.document?.length >= 1;

  const customer = isBusiness ? customers.business : customers;

  return <BasicBusiness customers={customer} />;
}
