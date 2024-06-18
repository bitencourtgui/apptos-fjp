/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from "react";
import { maskDocument } from "../../../utils/masks/maskDocument";
import { useMounted } from "../../../hooks/use-mounted";
import CustomersApi from "../../../api/customers";

const useCustomer = (userId: string) => {
  const isMounted = useMounted();

  const [customer, setCustomer] = useState(null);

  const getCustomer = useCallback(async () => {
    try {
      const response = await CustomersApi.getCustomer(userId.toString());

      if (isMounted()) {
        setCustomer(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getCustomer();
  }, []);

  return customer;
};

const Hyposufficiency = () => {
  let customerId: string;
  let url: string;

  if (typeof window !== "undefined") {
    url = window.location.href;
    const regex = /\/(\w+-\w+-\w+-\w+-\w+)/;
    const match = url.match(regex);

    if (match) {
      const id = match[1];
      customerId = id;
    } else {
      console.info("ID não encontrado na URL");
    }
  }

  const customer = useCustomer(customerId);

  useEffect(() => {
    if (customer?.name) {
      document.title = `Declaração de Hipossuficiencia - ${customer?.name?.toUpperCase()}`;
      handleLoad();
    }
  }, [customer]);

  const today = new Date();

  const handleAfterPrint = () => {
    // Lógica a ser executada após a impressão
    // Por exemplo, fechar a janela ou redirecionar para outra página
    window.close(); // Isso fechará a janela após a impressão
  };

  useEffect(() => {
    // Adiciona os ouvintes de eventos para a impressão
    window.addEventListener("afterprint", handleAfterPrint);

    // Remove os ouvintes de eventos quando o componente é desmontado
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []); // Vazio como dependência para ser executado apenas uma vez durante o montagem do componente

  const handleLoad = () => {
    window.print();
  };

  const maleGender = customer?.gender === "male";

  const holder = maleGender ? "portador" : "portadora";
  const residing = maleGender ? "domiciliado" : "domiciliada";
  const registered = maleGender ? "inscrito" : "inscrita";

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "12pt",
        textAlign: "justify",
        margin: "2cm 2cm 2cm 2cm", // Margens superior, direita, inferior e esquerda, nessa ordem.
      }}
    >
      <img
        src="/assets/logos/logo.png"
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: "80px",
          width: "145px",
          height: "auto",
        }}
      />
      <p style={{ textAlign: "center", marginBottom: "30px" }}>
        <strong>DECLARAÇÃO DE HIPOSSUFICIÊNCIA</strong>
      </p>
      <p style={{ textIndent: "50pt" }}>
        <strong>{customer?.name?.toUpperCase().trim()}</strong>,{" "}
        {customer?.nationality}, {registered} no CPF n°
        {maskDocument(customer?.cpf)}, {holder} da cédula de identidade n°{" "}
        {customer?.rg}, residente e {residing} na {customer?.street}, n°{" "}
        {customer?.number}, {customer?.complement ?? ""} -{" "}
        {customer?.neighborhood}, {customer?.city} - {customer?.state}, CEP:{" "}
        {customer?.postalCode}{" "}<strong>DECLARA</strong> para os devidos fins de
        direito, nos termos do art. 5º, LXXIV da Constituição Federal de 1988 e
        art. 98 e seguintes do Novo Código de Processo Civil, que é pessoa pobre
        na acepção jurídica do termo e que não tem condições de arcar com as
        custas, despesas processuais e honorários advocatícios de sucumbência,
        sem se privar dos meios necessários para sua subsistência.
      </p>

      <p style={{ textIndent: "50pt" }}>
        Por ser expressão da verdade, firma a presente declaração, sob as penas
        da lei.
      </p>

      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Poá (SP), {today.getDate()} de{" "}
        {today.toLocaleString("default", { month: "long" })} de{" "}
        {today.getFullYear()}.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 50,
          margin: "50px 50px 0px 50px ",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p> &nbsp;</p>
          <p style={{ marginTop: 0 }}>__________________________________</p>
          <p>
            <strong>{customer?.name?.toUpperCase().trim()}</strong>
          </p>
        </div>
      </div>
      <img
        src="/assets/logos/footer-fa.png"
        alt=""
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          height: "auto",
        }}
      />
    </div>
  );
};

export default Hyposufficiency;
