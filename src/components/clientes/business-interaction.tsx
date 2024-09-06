"use client";

import { useFormik } from "formik";
import { initialValues } from "@/components/clientes/form/personal/initial";
import BusinessModal from "./business-modal";
import { antiUndefined } from "@/hooks/anti-undefined";
import { businessSchema } from "./form/business/schema";

export function BusinessInteraction({ open, handleToggle, customers }: any) {
  const onSubmit = async (values: any, helpers: any) => {
    const customerToPartner = [
      {
        address: customers?.address,
        document: customers?.document,
        gender: customers?.gender,
        managingPartner: true,
        maritalStatus: customers?.maritalStatus,
        name: customers?.name,
        nationality: customers?.nationality,
        occupation: customers?.occupation,
        rg: customers?.rg,
      },
    ];

    const payload = {
      ...customers,
      business: values.business,
      partners: customerToPartner,
    };

    const sanitizedPayload = antiUndefined(payload);
    // try {
    //   const response = await CustomersApi.updateCustomer(
    //     customer.id,
    //     sanitizedPayload
    //   );

    //   if (response.status === 200) {
    //     toast.success("Empresa cadastrada");
    //     helpers.setStatus({ success: true });
    //     helpers.setSubmitting(false);
    //     window.location.reload();
    //   } else {
    //     console.error("[ERROR] CAD-EMPRESA1", response);
    //   }
    // } catch (err) {
    //   console.error("[ERROR] CAD-EMPRESA2", err);
    //   toast.error("Falha ao cadastrar empresa");
    //   helpers.setStatus({ success: false });
    //   helpers.setErrors({ submit: err.message });
    //   helpers.setSubmitting(false);
    // }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: businessSchema,
    onSubmit,
  });

  return (
    <BusinessModal formik={formik} open={open} handleToggle={handleToggle} />
  );
}
