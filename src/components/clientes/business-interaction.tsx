"use client";

import { useFormik } from "formik";
import { initialValues } from "@/components/clientes/form/personal/initial";
import BusinessModal from "./business-modal";
import { antiUndefined } from "@/hooks/anti-undefined";
import { businessSchema } from "./form/business/schema";
import { updateCustomerAPI } from "@/api/customers";
import { toast } from "@/components/core/toaster";

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

    try {
      const result = await updateCustomerAPI(customers.id, sanitizedPayload);

      if (result.success) {
        toast.success("Empresa cadastrada");
        helpers.setStatus({ success: true });
        helpers.setSubmitting(false);
        window.location.reload();
      } else {
        console.error("[ERROR] CAD-EMPRESA1", result);
      }
    } catch (err) {
      helpers.setStatus({ success: false });

      if (err instanceof Error) {
        helpers.setErrors({ submit: err.message });
      } else {
        helpers.setErrors({ submit: "Ocorreu um erro desconhecido." });
      }

      helpers.setSubmitting(false);
      toast.error("Erro ao cadastrar empresa");
    }
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
