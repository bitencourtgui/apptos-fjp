/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useEffect } from "react";
import { maskDocument } from "../../../utils/masks/maskDocument";
import { useMounted } from "../../../hooks/use-mounted";
import CustomersApi from "../../../api/customers";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/use-auth";

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

  const router = useRouter();
  const { getTenant } = useAuth();
  const gt = getTenant();

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
    // router.push(`/${gt}/clientes/${customerId}`)
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
    // window.print();
  };

  const maleGender = customer?.gender === "male";

  return (
    <div>
      <img
        src="/assets/logos/contract-header2.png"
        alt=""
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          left: 0,
          height: "auto",
        }}
      />
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "12pt",
          textAlign: "justify",
        }}
      >
        <p style={{ textAlign: "center", marginBottom: "10px" }}>
          <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</strong>
        </p>
        <p style={{ textAlign: "center", marginBottom: "30px" }}>
          <strong>Nº 46943616-01</strong>
        </p>
        <p style={{ textAlign: "justify", textIndent: "50pt" }}>
          <strong>FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA</strong>,
          inscrita no CNPJ nº 50.675.326/0001-97, com sede na Avenida Nove de
          Julho, Vila das Acácias, na cidade de Poá, no Estado de São Paulo, CEP
          08.557- 100, e-mail controladoria@fjpconsultoria.com.br, neste ato
          representada na forma do seu contrato social, doravante denominada
          “CONTRATADA” e;
        </p>

        <p style={{ textAlign: "justify", textIndent: "50pt" }}>
          <strong>LUCAS HENRIQUE FIRMINO RODRIGUES DA SILVA</strong>,
          brasileiro, casado, profissional de tecnologia, inscrito no CPF sob o
          nº469.436.168-62, documento de identificação RG nº 52.953.710-2
          SSP/SP, residente e domiciliado na Rua Itanhaem,nº 39,Calmon Viana,
          Poá, Estado de São Paulo,{" "}
          <strong>GUILHERME GALDINO BITENCOURT</strong>, brasileiro, solteiro,
          desenvolvedor de sistema, inscrito no CPF sob o 470.163.248-18,
          documento de identificação RG nº 52.094.198-6 SSP/SP, residente e
          domiciliado na Rua Alexandre Rossi, 90, Vila Helena, Suzano, CEP
          08655-490, Estado de São Paulo e <strong>DIEGO PADAVANI</strong>,
          brasileiro, casado, analista de BI, inscrito no CPF sob o nº
          390.650.598-73, documento de identificação RG nº 47.828.320-9 SSP/SP,
          residente e domiciliado na Rua Três,nº 28, Jardim Quaresmeira III,
          Suzano, CEP 08671-445, Estado de São Paulo em conformidade com seu
          contrato social; doravante denominada “CONTRATANTE”;
        </p>

        <p style={{ textIndent: "50pt" }}>
          ambas conjuntamente denominadas “PARTES”, resolvem firmar o presente
          CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONTABILIDADE EMPRESARIAL têm,
          entre si, certa e ajustada mediante as cláusulas e condições
          seguintes:
        </p>

        <p style={{ textIndent: "50pt", marginTop: "30px" }}>
          <strong>DO OBJETO E DO PRAZO</strong>
        </p>
        <p style={{ paddingLeft: "50pt" }}>
          <strong>CLÁUSULA PRIMEIRA</strong> – A CONTRATADA compromete-se a
          realizar a Prestação de Serviços negociados entre as PARTES, que
          compreende, restrita e nos limites, o estipulado(s) no(s) objeto(s)
          abaixo:
        </p>
        <p style={{ paddingLeft: "50pt" }}>
          Objeto Primeiro - <strong>Abertura</strong>
        </p>
        <p style={{ paddingLeft: "50pt" }}>
          Objeto Segundo - <strong>Contabilidade Empresarial</strong>
        </p>
        <p style={{ paddingLeft: "50pt" }}>
          Parágrafo único. A execução dos serviços contábeis objeto(s) deste
          contrato será de responsabilidade técnica do PARCEIRO indicado neste
          contrato (Anexo).
        </p>

        <p style={{ textIndent: "50pt", marginTop: "30px" }}>
          <strong>DA EXECUÇÃO DOS SERVIÇOS E DOS PARCEIROS</strong>
        </p>
        <p style={{ paddingLeft: "50pt" }}>
          <strong>CLÁUSULA SEGUNDA</strong> – Para que se tenha início a
          execução do(s) serviço(s) objeto deste contrato, se dará(ão) a partir
          do cumprimento integral dos Parágrafos 1º e 2º da CLÁUSULA QUINTA,
          indispensáveis à correta e integral execução dos serviços.
        </p>
        <p style={{ paddingLeft: "50pt" }}>
          CLÁUSULA SEGUNDA – Para que se tenha início a execução do(s)
          serviço(s) objeto deste contrato, se dará(ão) a partir do cumprimento
          integral dos Parágrafos 1º e 2º da CLÁUSULA QUINTA, indispensáveis à
          correta e integral execução dos serviços. Parágrafo primeiro. Ocorrerá
          a suspensão do(s) serviço(s) objeto deste contrato, unilateralmente e
          automática, sem necessidade de prévio aviso, em caso de inadimplência
          do CONTRATANTE, por mais de 60 (sessenta) dias corridos do vencimento
          de qualquer parcela, facultando à CONTRATADA a rescisão motivada do contrato.
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
      </div>
      <img
        src="/assets/logos/contract-footer.png"
        alt=""
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          width: "100%",
          transform: "translateX(-50%)",
          height: "auto",
        }}
      />
    </div>
  );
};

export default Hyposufficiency;
