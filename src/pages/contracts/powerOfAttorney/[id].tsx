"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect, FC } from "react";

import { maskDocument } from "../../../utils/masks/maskDocument";
import { useMounted } from "../../../hooks/use-mounted";
import CustomersApi from "../../../api/customers";
import LawyersApi from "../../../api/lawyers";

interface Lawyer {
  name: string;
  OAB: string;
  oabBranch: string;
  address: string;
  nationality: string;
  maritalStatus: string;
  id: string;
}

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

const useLawyers = () => {
  const isMounted = useMounted();

  const [lawyers, setLawyers] = useState(null);

  const getCustomer = useCallback(async () => {
    try {
      const response = await LawyersApi.getLawyers();

      if (isMounted()) {
        setLawyers(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getCustomer();
  }, []);

  return lawyers;
};

const PowerOfAttorney = () => {
  let customerId: string;
  let isMinor: boolean = false;
  let oabValues = [];
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

    const isMinorRegex = /[?&]isMinor=([^&]+)/;
    const isMinorMatch = url.match(isMinorRegex);

    if (isMinorMatch) {
      isMinor = isMinorMatch[1] === "true"; // Se isMinor na URL for "true", define como true
    }

    // Extrai o parâmetro "oab" da URL
    const oabRegex = /[?&]oab=([^&]+)/;
    const oabMatch = url.match(oabRegex);

    if (oabMatch) {
      try {
        oabValues = JSON.parse(oabMatch[1]);
      } catch (error) {
        console.error("Erro ao analisar os valores 'oab' da URL:", error);
      }
    } else {
      console.info("Parâmetro 'oab' não encontrado na URL");
    }
  }

  // Extrair isMinor da URL

  const customer = useCustomer(customerId);
  const lawyers = useLawyers();

  useEffect(() => {
    if (customer?.name) {
      document.title = `Procuração - ${customer?.name?.toUpperCase()}`;
      handleLoad();
    }
  }, [customer]);

  // Define state for today's date
  const [today, setToday] = useState<Date>();

  useEffect(() => {
    // Set today's date in the state
    setToday(new Date());
  }, []);

  const filteredLawyerData: Lawyer[] = lawyers?.filter((lawyer: Lawyer) =>
    oabValues.includes(parseInt(lawyer.OAB))
  );

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
  const maleMinorGender = customer?.underage.gender === "male";

  const holder = maleGender ? "portador" : "portadora";
  const residing = maleGender ? "domiciliado" : "domiciliada";
  const registered = maleGender ? "inscrito" : "inscrita";
  const parent = maleGender ? "seu genitor" : "sua genitora";

  const underageHolder = maleMinorGender ? "portador" : "portadora";
  const underageRegistered = maleMinorGender ? "inscrito" : "inscrita";
  const underageNationality = maleMinorGender ? "brasileiro" : "brasileira";

  const PrintHeader: FC = () => {
    return (
      <header className="printHeaderFee">
        <img src="/assets/logos/logo.png" alt="" />
      </header>
    );
  };

  return (
    <div>
      <PrintHeader />

      <table className="printContainerFee">
        <thead>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div
                style={{
                  fontFamily: "Arial, sans-serif",
                  fontSize: "12pt",
                  textAlign: "justify",
                }}
              >
                <p style={{ textAlign: "center", marginBlockStart: 0 }}>
                  <strong>PROCURAÇÃO AD JUDICIA ET EXTRA</strong>
                </p>
                <p style={{ marginBottom: "4px" }}>Outorgante:</p>
                {isMinor ? (
                  <p style={{ paddingLeft: "30pt", margin: "4px 0" }}>
                    <strong>{customer?.underage.name?.toUpperCase()}</strong>,
                    pessoa física, {underageNationality}, {underageRegistered}{" "}
                    no CPF/MF sob N°
                    {maskDocument(customer?.underage.docuemnt)} e{" "}
                    {underageHolder} de cédula de identidade Nº{" "}
                    {customer?.underage.registration} representada neste ato por{" "}
                    {parent} <strong>{customer?.name?.toUpperCase()}</strong>,
                    pessoa física, {customer?.nationality}, {registered} no
                    CPF/MF N° {maskDocument(customer?.cpf)} e {holder} de cédula
                    de identidade Nº {customer?.rg}, residente e {residing} na{" "}
                    {customer?.street}, N° {customer?.number},{" "}
                    {customer?.complement ?? ""} - {customer?.neighborhood},{" "}
                    {customer?.city} - {customer?.state}, CEP:{" "}
                    {customer?.postalCode}.
                  </p>
                ) : (
                  <p style={{ paddingLeft: "30pt", margin: "4px 0" }}>
                    <strong>{customer?.name?.toUpperCase()}</strong>, pessoa
                    física, {customer?.nationality}, {registered} no CPF/MF N°
                    {maskDocument(customer?.cpf)} e {holder} de cédula de
                    identidade Nº {customer?.rg}, residente e {residing} na{" "}
                    {customer?.street}, N° {customer?.number},{" "}
                    {customer?.complement ?? ""} - {customer?.neighborhood},{" "}
                    {customer?.city} - {customer?.state}, CEP:{" "}
                    {customer?.postalCode}.
                  </p>
                )}

                <p style={{ marginBottom: "4px" }}>Outorgada:</p>

                {filteredLawyerData?.map((lawyer) => (
                  <p
                    style={{ paddingLeft: "30pt", margin: "4px 0" }}
                    key={lawyer.id}
                  >
                    <strong>{lawyer?.name?.toUpperCase()}</strong>,{" "}
                    {lawyer?.nationality?.toLowerCase()},{" "}
                    {lawyer.maritalStatus?.toLowerCase()},{" "}
                    {lawyer?.nationality?.toLowerCase() === "brasileira"
                      ? " advogada, inscrita"
                      : " advogado, inscrito"}{" "}
                    na Ordem dos Advogados do Brasil, Seccional de{" "}
                    {lawyer.oabBranch} sob Nº {lawyer.OAB}, com endereço
                    profissional em {lawyer.address}, onde recebem intimações e
                    notificações.
                  </p>
                ))}

                <p style={{ marginBottom: "4px" }}>Poderes:</p>
                <p style={{ paddingLeft: "30pt", margin: "4px 0" }}>
                  Pelo presente instrumento, o outorgante nomeia e constitui a
                  outorgada como sua procuradora, com os poderes contidos na
                  cláusula “ad-judicia et extra” para que em seu nome, o
                  representem em qualquer Juízo, Instância ou Tribunal, ou
                  ainda, fora dele, no foro em geral, para defenderem seus
                  direitos e interesses, podendo confessar, desistir, ratificar,
                  firmar compromisso e distrato, assinar compromisso de
                  inventariante, dar e receber quitação, propor ações de
                  qualquer natureza que sejam de interesse do outorgante,
                  seguindo umas e outras até final decisão, usando os recursos
                  legais e acompanhando, agindo em conjunto ou separadamente,
                  podendo ainda substabelecer está a outrem, com ou sem reservas
                  de iguais poderes, dando-lhe ciência, bem como tudo o mais que
                  se fizer necessário para o perfeito e cabal desempenho deste
                  mandato, dando tudo por bom, firme e valioso, com específico
                  fim de {customer?.powers}
                </p>

                <p style={{ textAlign: "center", marginTop: "40px" }}>
                  Poá, {today?.getDate()} de{" "}
                  {today?.toLocaleString("default", { month: "long" })} de{" "}
                  {today?.getFullYear()}.
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 20,
                    margin: "0 20px 0px 20px ",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p style={{ marginBottom: "4px" }}> &nbsp;</p>
                    <p style={{ marginTop: 0 }}>__________________________</p>
                    <p>
                      <strong>{customer?.name?.toUpperCase()}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
          </tr>
        </tfoot>
      </table>
      <footer>
        <img
          src="/assets/logos/footer-fa.png"
          alt=""
          style={{
            height: "auto",
          }}
        />
      </footer>
    </div>
  );
};

export default PowerOfAttorney;
