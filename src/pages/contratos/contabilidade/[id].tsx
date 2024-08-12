/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useCallback, useEffect } from "react";
import { useMounted } from "../../../hooks/use-mounted";
import CustomersApi from "../../../api/customers";
import { numberInWords } from "../../../utils/number-in-words";
import { maskDocument } from "../../../utils/masks/maskDocument";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/use-auth";
import dayjs from "dayjs";

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

const FeeContract = () => {
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
    if (customer?.name || customer?.business?.corporateName) {
      const titleName = customer.name || customer.business.corporateName;
      document.title = `Contrato contábil - ${titleName.toUpperCase()}`;
      // handleLoad();
    }
  }, [customer]);

  const today = new Date();

  const handleAfterPrint = () => {
    router.push(`/${gt}/clientes/${customerId}`);
  };

  useEffect(() => {
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, []);

  const handleLoad = () => {
    window.print();
  };

  function translateMaritalStatus(maritalStatus: string, gender: string) {
    const genderMale = gender === "male";

    const maritalStatusMap = {
      single: genderMale ? "Solteiro" : "Solteira",
      married: genderMale ? "Casado" : "Casada",
      divorced: genderMale ? "Divorciado" : "Divorciada",
      widowed: genderMale ? "Viúvo" : "Viúva",
    };

    return maritalStatusMap[maritalStatus] || "Status desconhecido";
  }

  const PrintHeader: React.FC = () => {
    return (
      <header
        style={{
          top: 0,
          left: 1,
          width: "100%",
          height: "auto",
        }}
      >
        <img src="/assets/logos/contract-header2.png" alt="" />
      </header>
    );
  };

  function getContractServices(services: any[]) {
    const servicesMap = {
      "0": "Abertura de Empresa",
      "1": "Contabilidade Empresarial",
      "2": "Desenquadramento",
      "3": "Planejamento Tributário",
      "4": "Isenção de IR",
      "5": "Defesa Administrativa",
    };

    const objectLabels = [
      "Primeiro",
      "Segundo",
      "Terceiro",
      "Quarto",
      "Quinto",
      "Sexto",
    ];

    if (services) {
      services.sort((a, b) => Number(a.serviceType) - Number(b.serviceType));

      return (
        <>
          {services.map((service, index) => (
            <p key={service.id} style={{ paddingLeft: "50pt" }}>
              {`Objeto ${objectLabels[index]} - `}
              <strong>{servicesMap[service.serviceType]}</strong>
            </p>
          ))}
        </>
      );
    }
  }

  const documentValue = customer?.document || customer?.business?.document || "";
  const firstEightDigits = documentValue.substring(0, 8);

  const business = customer?.business;
  const isBusiness = Boolean(business);

  const calculatePaymentDate = (createdAt: string, paymentDate: number) => {
    const [day, month, year] = createdAt.split("/").map(Number);
    const createdDate = new Date(year, month - 1, day);
    const paymentDueDate = new Date(
      createdDate.getFullYear(),
      createdDate.getMonth(),
      paymentDate
    );

    if (createdDate > paymentDueDate) {
      paymentDueDate.setMonth(paymentDueDate.getMonth() + 1);
    }

    const dd = String(paymentDueDate.getDate()).padStart(2, "0");
    const mm = String(paymentDueDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = paymentDueDate.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  };

  function formatBRL(value: string | number) {
    const currency = Number(value);

    return currency.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function getContractServicesDetails(services: any) {
    const servicesMap = {
      "0": "Abertura de Empresa",
      "1": "Contabilidade Empresarial",
      "2": "Desenquadramento",
      "3": "Planejamento Tributário",
      "4": "Isenção de IR",
      "5": "Defesa Administrativa",
    };

    const objectLabels = [
      "Primeiro",
      "Segundo",
      "Terceiro",
      "Quarto",
      "Quinto",
      "Sexto",
    ];

    if (services) {
      return (
        <>
          {services.map((service, index) => {
            if (service?.serviceType === "0") {
              return (
                <div key={index} style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      border: "solid 1px black",
                      width: "40%",
                      padding: "20px",
                    }}
                  >
                    <p style={{marginBottom: 0}}>{`Objeto ${objectLabels[index]}`}</p>
                    <p>
                      <strong>{servicesMap[service.serviceType]}</strong>
                    </p>
                  </div>
                  <div
                    style={{
                      border: "solid 1px black",
                      width: "60%",
                      padding: "20px",
                    }}
                  >
                    {service.cashPayment ? (
                      <p>
                        Valor: {formatBRL(service?.openingContract)} (
                        {numberInWords(service?.openingContract)}) à vista
                      </p>
                    ) : (
                      <p>
                        Valor: {formatBRL(service?.openingContract)}{" "}({numberInWords(service?.openingContract)}) parcelado
                        em {service?.monthyFee}x de{" "}
                        {formatBRL(
                          service?.openingContract / service?.monthyFee
                        )}{" "}
                        (
                        {numberInWords(
                          service?.openingContract / service?.monthyFee
                        )}
                        )
                      </p>
                    )}
                    <p>
                      Com pagamento previsto para dia{" "}
                      <strong>
                        {calculatePaymentDate(
                          service?.createdAt,
                          parseInt(service?.paymentDate)
                        )}
                      </strong>
                    </p>
                  </div>
                </div>
              );
            }

            if (service?.serviceType === "1") {
              return (
                <div key={index} style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      border: "solid 1px black",
                      width: "40%",
                      padding: "20px",
                    }}
                  >
                    <p style={{marginBottom: 0}}>{`Objeto ${objectLabels[index]}`}</p>
                    <p>
                      <strong>{servicesMap[service.serviceType]}</strong>
                    </p>
                    <p>{`Faixa de faturamento - Até ${formatBRL(
                      service.billingRange
                    )}`}</p>
                  </div>
                  <div
                    style={{
                      border: "solid 1px black",
                      width: "60%",
                      padding: "20px",
                    }}
                  >
                    {service.paymentEntry ? (
                      <>
                        <p>
                          Mensalidade inicial:{" "}
                          {formatBRL(service?.accountingPayment)}/mês (
                          {numberInWords(service?.accountingPayment)}). Primeiro
                          pagamento em{" "}
                          <strong>
                            {dayjs(service?.accountingDate).format(
                              "DD/MM/YYYY"
                            )}
                          </strong>
                        </p>
                        <p>
                          Demais Mensalidades:{" "}
                          {formatBRL(service?.accountingFee)} (
                          {numberInWords(service?.accountingFee)}).
                        </p>
                        <p>
                          Primeiro pagamento em{" "}
                          <strong>
                            {dayjs(service?.accountingDate)
                              .add(1, "month")
                              .format("DD/MM/YYYY")}
                          </strong>{" "}
                          e os demais no mesmo dia dos meses subsequentes,
                          durante a vigência do presente instrumento.
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          Mensalidade: {formatBRL(service?.accountingFee)} (
                          {numberInWords(service?.accountingFee)}).
                        </p>
                        <p>
                          Primeiro pagamento em{" "}
                          <strong>
                            {dayjs(service?.accountingDate).format(
                              "DD/MM/YYYY"
                            )}
                          </strong>{" "}
                          e os demais no mesmo dia dos meses subsequentes,
                          durante a vigência do presente instrumento.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            }

            if (service?.serviceType === "2") {
              return (
                <div key={index} style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      border: "solid 1px black",
                      width: "40%",
                      padding: "20px",
                    }}
                  >
                    <p style={{marginBottom: 0}}>{`Objeto ${objectLabels[index]}`}</p>
                    <p>
                      <strong>{servicesMap[service.serviceType]}</strong>
                    </p>
                  </div>
                  <div
                    style={{
                      border: "solid 1px black",
                      width: "60%",
                      padding: "20px",
                    }}
                  >
                    {service.cashPayment ? (
                      <p style={{margin: 10}}>
                        Valor: {formatBRL(service?.openingContract)} (
                        {numberInWords(service?.openingContract)}) à vista
                      </p>
                    ) : (
                      <p>
                        Valor: {formatBRL(service?.openingContract)}{" "} {numberInWords(service?.openingContract)} parcelado
                        em {service?.monthyFee}x de{" "}
                        {formatBRL(
                          service?.openingContract / service?.monthyFee
                        )}{" "}
                        ( {numberInWords(
                       
                          service?.openingContract / service?.monthyFee
                        )}
                        )
                      </p>
                    )}
                    <p>
                      Com pagamento previsto para dia{" "}
                      <strong>
                        {calculatePaymentDate(
                          service?.createdAt,
                          parseInt(service?.paymentDate)
                        )}
                      </strong>
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <>
                <p style={{ paddingLeft: "50pt" }}>
                  {/* {JSON.stringify(servicesDetails[service])} */}
                  Serviço não selecionado
                </p>
              </>
            );
          })}
        </>
      );
    }
  }

  return (
    <div>
      <PrintHeader />

      <table
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "12pt",
          textAlign: "justify",
          margin: "0 2cm",
        }}
      >
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
                <p style={{ textAlign: "center", marginBottom: "10px" }}>
                  <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</strong>
                </p>
                <p style={{ textAlign: "center", marginBottom: "30px" }}>
                  <strong>Nº {firstEightDigits}-001</strong>
                </p>
                <p style={{ textAlign: "justify" }}>
                  <strong>FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA</strong>
                  , inscrita no CNPJ nº 50.675.326/0001-97, com sede na Avenida
                  Nove de Julho, Vila das Acácias, na cidade de Poá, no Estado
                  de São Paulo, CEP 08.557- 100, e-mail
                  controladoria@fjpconsultoria.com.br, neste ato representada na
                  forma do seu contrato social, doravante denominada
                  “CONTRATADA” e;
                </p>

                <p>
                  {customer?.partners?.map((partner, index) => {
                    const address = `${partner.address?.street}, nº ${partner.address?.number},  ${partner.address?.neighborhood}, ${partner.address?.city}, ${partner.address?.state} - CEP ${partner.address?.postalCode}`;

                    console.log(partner)


                    return (
                      <span
                        style={{ textAlign: "justify", textIndent: "50pt" }}
                        key={index}
                      >
                        <strong style={{ textTransform: "uppercase" }}>
                          {partner?.name}
                        </strong>
                        , {partner?.nationality},{" "}
                        {translateMaritalStatus(
                          partner?.maritalStatus,
                          partner?.gender
                        )}
                        , {partner?.occupation}
                        , inscrito no CPF sob o nº{" "}
                        {maskDocument(partner?.document)}, documento de
                        identificação RG nº {partner?.rg} SSP/SP, residente e
                        domiciliado na {address};{" "}
                      </span>
                    );
                  })}
                  {isBusiness && "em conformidade com seu contrato social"};
                   doravante denominada
                  “CONTRATANTE”;
                </p>

                <p>
                  ambas conjuntamente denominadas “PARTES”, resolvem firmar o
                  presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONTABILIDADE
                  EMPRESARIAL têm, entre si, certa e ajustada mediante as
                  cláusulas e condições seguintes:
                </p>

                <p>
                  <strong>DO OBJETO E DO PRAZO</strong>
                </p>
                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA PRIMEIRA</strong> – A CONTRATADA
                  compromete-se a realizar a Prestação de Serviços negociados
                  entre as PARTES, que compreende, restrita e nos limites, o
                  estipulado(s) no(s) objeto(s) abaixo:
                </p>
                {getContractServices(customer?.services)}

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo único. A execução dos serviços contábeis objeto(s)
                  deste contrato será de responsabilidade técnica do PARCEIRO
                  indicado neste contrato (Anexo).
                </p>

                <p style={{ marginTop: "30px" }}>
                  <strong>DA EXECUÇÃO DOS SERVIÇOS E DOS PARCEIROS</strong>
                </p>
                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA SEGUNDA</strong> – Para que se tenha início a
                  execução do(s) serviço(s) objeto deste contrato, se dará(ão) a
                  partir do cumprimento integral dos Parágrafos 1º e 2º da
                  CLÁUSULA QUINTA, indispensáveis à correta e integral execução
                  dos serviços.
                </p>
                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo primeiro. Ocorrerá a suspensão do(s) serviço(s)
                  objeto deste contrato, unilateralmente e automática, sem
                  necessidade de prévio aviso, em caso de inadimplência do
                  CONTRATANTE, por mais de 60 (sessenta) dias corridos do
                  vencimento de qualquer parcela, facultando à CONTRATADA a
                  rescisão motivada do contrato.
                </p>
                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo segundo. O não cumprimento dos serviços estipulados
                  na CLÁUSULA PRIMEIRA pela CONTRATADA ou PARCEIRO(s), por sua
                  exclusiva culpa, faz jus a CONTRATANTE à multa pelo atraso, no
                  valor de 5% do valor proporcional correspondente a parcela
                  correspondente do mêsrágrafo terceiro. Na ocorrência de
                  suspensão da execução do(s) serviço(s) objeto(s) do presente
                  instrumento, a CONTRATADA e PARCEIRO(s) eximem-se de qualquer
                  responsabilidade por danos causados em consequência da
                  suspensão.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA TERCEIRA</strong> – A CONTRATADA é livre para
                  a execução e desenvolvimento da prestação do(s) serviço(s)
                  objeto(s) do presente instrumento, estando autorizada,
                  inclusive, e a qualquer tempo, a firmar parcerias técnicas,
                  contratar e subcontratar, denominados no presente instrumento
                  de “PARCEIROS”, para atingir os fins do(s) objeto(s) deste
                  instrumento.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo primeiro. O(s) PARCEIRO(s), habilitados e regulares
                  perante os órgãos legais, para a execução do(s) serviço(s)
                  objeto(s) deste contrato, são responsáveis de forma integral e
                  irrestrita da execução do(s) serviço(s) atribuído(s), e por
                  suas consequências administrativas, civis e penais pela
                  execução, imperfeição ou inexecução.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo segundo. O(s) PARCEIRO(s) está(ão) subordinado(s) às
                  cláusulas do presente instrumento, inclusive quanto aos
                  sigilos, segurança, responsabilidades, profissionalismo, ética
                  e moral necessários.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo terceiro. O CONTRATANTE poderá, a qualquer tempo,
                  solicitar a substituição do PARCEIRO(s) indicado(s), se
                  houver, por meio de notificação, com 60 (sessenta) dias de
                  antecedência, ou na metade do prazo, com pagamento à
                  CONTRATADA de taxa adicional na proporção de 50% (cinquenta
                  porcento) da parcela mensal do contrato contábil, respeitado
                  os termos da CLÁUSULA QUARTA.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo quarto. A substituição do PARCEIRO, na forma do
                  parágrafo anterior, em qualquer caso, poderá ocorrer por 1
                  (uma) única vez, por objeto, dentro do período de vigência do
                  presente instrumento.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo quinto. A CONTRATADA poderá, unilateralmente, a
                  qualquer tempo, realizar a substituição do PARCEIRO(s), se
                  houver, na qual a CONTRATANTE será notificada previamente, na
                  qual poderá se manifestar quanto ao novo parceiro, cuja
                  manifestação em contrário suspenderá a execução do serviço
                  objeto atribuído até , salvo efeitos financeiros, o que não
                  importará em rescisão contratual.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA QUARTA</strong> – Os serviços contábeis,
                  discriminado(s) na CLÁUSULA PRIMEIRA, quando da sua
                  transferência externa, só poderá ser realizada e concluída
                  mediante o cumprimento das formalidades estabelecidas no Termo
                  de Transferência de Responsabilidade Técnica, na forma e
                  procedimento estabelecido em Lei específica.
                </p>

                <p style={{ marginTop: "30px" }}>
                  <strong>DAS OBRIGAÇÕES DA CONTRATANTE</strong>
                </p>
                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA QUINTA</strong> – A CONTRATANTE
                  compromete-se, durante a vigência do presente instrumento, a
                  garantir o fiel cumprimento das suas obrigações, e ainda:
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo primeiro. Fornecer à CONTRATADA e PARCEIRO(s) todos
                  os documentos, arquivos, credenciais, dados, metadados,
                  informações, pormenores, etc. solicitados, e indispensáveis à
                  integral execução dos objetos da CLÁUSULA PRIMEIRA, dentro dos
                  prazos, datas e períodos estipulados, responsabilizando-se
                  pelas consequências do não cumprimento das solicitações neste
                  período
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo segundo. Se obriga a preparar, mensalmente, toda a
                  documentação fisco-contábil e de pessoal, que deverá ser
                  disponibilizada dentre o período estipulado, conforme
                  cronograma pactuado entre as PARTES, a fim de que possa
                  executar seus serviços em conformidade com o citado neste
                  instrumento.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo terceiro. DECLARA que todos os documentos, arquivos,
                  credenciais, dados, metadados, informações, pormenores, etc.
                  encaminhados à CONTRATADA e PARCEIRO(s), estão revestidos de
                  integridade, idoneidade e legalidade, assumindo total
                  responsabilidade pelo seu conteúdo.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo quarto. DECLARA plena ciência da Lei nº 9.613/98,
                  alterada pela Lei nº 12.683/2012, especificamente no que trata
                  da lavagem de dinheiro, regulamentada pela Resolução n.º
                  1.445/13 do Conselho Federal de Contabilidade - CFC.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo quinto. Se obriga a realizar o pagamento das guias
                  referentes às obrigações principais e acessórias, assumindo
                  total responsabilidade pelas consequências da não quitação até
                  o vencimento estipulado pelo órgão.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo sexto. Se obriga, antes do encerramento do exercício
                  social, a fornecer a Carta de Responsabilidade da
                  Administração.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo sétimo. A efetuar os pagamentos devidos na forma e
                  nas condições estabelecidas no presente instrumento.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo oitavo. A manter a comunicação ativa e atualizada
                  com a CONTRATADA e PARCEIRO(S), de forma a responder as
                  solicitações de forma integral e no esclarecimento de
                  eventuais dúvidas.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo nono. Compromete-se a seguir rigorosamente todas as
                  orientações estipuladas, responsabilizando-se das
                  consequências legais do não cumprimento.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo décimo. Eventuais multas e taxas por entrega fora de
                  prazo junto aos órgãos oficiais ocasionados pelo não
                  cumprimento das orientações estipuladas em tempo hábil,
                  deverão ser suportados integralmente pelo CONTRATANTE.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo décimo primeiro. Valores como taxas, multas e
                  impostos, e demais pagamentos necessários à execução do objeto
                  da CLÁUSULA PRIMEIRA junto aos órgãos oficiais deverão ser
                  suportados pela CONTRATANTE e, caso a CONTRATADA ou PARCEIRO
                  realize o respectivo pagamento, deverá ser reembolsada
                  mediante apresentação de comprovante.
                </p>

                <p style={{ marginTop: "30px" }}>
                  <strong>DAS OBRIGAÇÕES DA CONTRATADA E PARCEIROS</strong>
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA SEXTA</strong> – A CONTRATADA e PARCEIRO(s),
                  comprometem-se a executar o(s) serviço(s) objeto(s) DA
                  CLÁUSULA PRIMEIRA em observância à ética profissional e a
                  moral pública, responsabilizando-se pela respectiva execução,
                  pelos prazos de conclusão estipulados e diligência(s)
                  presencial(is) e/ou virtual(is) de sua responsabilidade
                  necessária(s) às demandas de interesse da CONTRATANTE para o
                  integral cumprimento do(s) objeto(s) deste instrumento.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo único. A CONTRATADA e PARCEIRO(s) se obrigam a
                  entregar ao CONTRATANTE, mediante protocolo, em tempo hábil,
                  os Balancetes, o Balanço Patrimonial e as demais demonstrações
                  contábeis, documentos necessários para que este efetue os
                  devidos pagamentos e recolhimentos obrigatórios, bem como
                  comprovante de entrega das obrigações acessórias.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA SÉTIMA</strong> – A CONTRATADA e PARCEIRO(s)
                  comprometem-se a manter o absoluto sigilo fiscal, bancário,
                  financeiro e de informações sobre operações, dados,
                  pormenores, informações, documentos, dados, metadados, etc.
                  solicitados e entregues pela CONTRATANTE, não eximindo-se de
                  manter as mesmas obrigações após a extinção do presente
                  instrumento, reservando-se de manter sob sua guarda somente
                  documentos indispensáveis à fiscalização dos órgãos públicos e
                  de classes profissionais pelo prazo máximo 5 (cinco) anos,
                  observando-se a CLÁUSULA DÉCIMA QUARTA.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA OITAVA</strong> – A CONTRATADA e PARCEIRO(s)
                  manterão a CONTRATANTE constantemente atualizada do andamento
                  da execução dos serviços, do cumprimento dos prazos e da
                  conclusão de tarefas.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA NONA</strong> – A CONTRATADA fornecerá
                  histórico dos pagamentos realizados pela CONTRATANTE, quando
                  solicitado, de acordo com os valores estipulados no presente
                  instrumento e aditivos.
                </p>

                <p style={{ marginTop: "30px" }}>
                  <strong>DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO</strong>
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA DÉCIMA</strong> – A título de remuneração, a
                  CONTRATANTE pagará à CONTRATADA a(s) quantia(s) e na(s)
                  forma(s) que segue(m):
                </p>

                <div style={{ paddingLeft: "50pt" }}>
                  {getContractServicesDetails(customer?.services)}
                </div>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo primeiro. O CONTRATANTE concorda que, os valores da
                  mensalidade contábil, na forma estabelecida nesta cláusula,
                  são precificados conforme sua faixa de faturamento mensal, aos
                  quais sofrerão ajustes conforme haja alteração, que será
                  informada mediante notificação.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo segundo. As condições e valores de pagamento(s)
                  do(s) serviço(s) objeto(s) do presente instrumento são
                  conforme estipulado no caput e no parágrafo anterior, aos
                  quais sofrerão reajustes anuais, no mês de Janeiro,
                  previamente informados por notificação, com antecedência
                  mínima de 30 (trinta) dias.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo terceiro. No mês de dezembro de cada ano, será
                  cobrado adicionalmente o equivalente a 01(um) mensalidade
                  contábil, intitulada de “taxa de balanço”, em conformidade com
                  a Resolução nº 987/2003 do Conselho Federal de Contabilidade -
                  CFC, que poderá ser parcelada a pedido, antecipadamente, em
                  até 02 (duas) parcelas (Novembro e Dezembro), a ser pago no
                  mesmo dia da mensalidade corrente daquele mês, por conta do
                  Encerramento do Balanço Patrimonial e demais obrigações anuais
                  próprias do período final do ano-exercício fiscal.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo quarto. As respectivas remunerações, deverão ser
                  realizadas mediante uma das formas de pagamento abaixo, todas
                  de titularidade da FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL
                  LTDA:
                </p>

                <div style={{ paddingLeft: "50pt" }}>
                  <div
                    style={{
                      borderTop: "solid 1px black",
                      padding: "10px 0",
                      borderBottom: "solid 1px black",
                    }}
                  >
                    <strong>Boleto Bancário</strong> (recomendado): enviado
                    automaticamente no e-mail informado pela CONTRATANTE neste
                    contrato.
                  </div>

                  <div style={{ padding: "10px 0" }}>
                    <strong>Chave PIX CNPJ</strong>: 50.675.326/0001-97
                  </div>

                  <div
                    style={{
                      borderTop: "solid 1px black",
                      padding: "10px 0",
                      borderBottom: "solid 1px black",
                    }}
                  >
                    <strong>Transferência Bancária</strong>: Banco 403 - CORA
                    SDC – AGENCIA: 0001; C/C: 4177549-8
                  </div>
                </div>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo quinto. A realização do pagamento com acréscimo de
                  multa e juros legais após a data de vencimento é de total
                  responsabilidade da CONTRATANTE, assim como a verificação,
                  confirmação e comprovação do título de pagamento, cujo não
                  recebimento deve ser informado à CONTRATADA com antecedência
                  mínima de 2 (dois) dias, anterior ao seu vencimento.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo sexto. Não importará em novação, o eventual
                  recebimento de qualquer valor após o seu vencimento o que
                  poderá se dar por mera liberalidade do CONTRATADO, contudo,
                  neste caso, poderá incidir multa de 2% sobre a valor a receber
                  com atraso, além de juros legais de 1%, pro rata die, ao mês.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo sétimo. O CONTRATADO isenta-se de toda e qualquer
                  responsabilidade pelo não envio de lembretes de pagamento,
                  notificações, ou qualquer informação fornecida com a mesma
                  finalidade de pré-aviso de pagamento, cuja realização se dará
                  por mera liberalidade do CONTRATADO.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo oitavo. A execução de serviço(s) extraordinário(s)
                  somente será realizada mediante termo aditivo ao presente
                  instrumento, conforme negociação entre as PARTES.
                </p>

                <p style={{ marginTop: "30px" }}>
                  <strong>
                    DO DESCUMPRIMENTO, DA RESCISÃO E DO TERMO ADITIVO
                  </strong>
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA DÉCIMA PRIMEIRA</strong> – O descumprimento
                  de qualquer das cláusulas do presente instrumento por qualquer
                  das PARTES implicará na rescisão imediata deste instrumento,
                  isentandose a CONTRATADA e PARCEIROS da não continuidade dos
                  serviços objeto, que será transferida para o novo parceiro
                  indicado pela CONTRATANTE no ato da rescisão, não desobrigando
                  a CONTRATADA e PARCEIRO(s) do cumprimento integral da CLÁUSULA
                  SÉTIMA.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo primeiro - O presente instrumento, em comum acordo,
                  poderá ser alterado mediante termo aditivo competente, salvo
                  parágrafo quarto da cláusula terceira.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo segundo. O presente instrumento poderá ser
                  rescindindo, em comum acordo entre as PARTES ou
                  unilateralmente, a qualquer tempo, mediante comunicação por
                  escrito à outra parte, com antecedência mínima de 30 (trinta)
                  dias, sem que caiba qualquer direito de indenização na
                  hipótese de uma das partes: (i) entrar em liquidação judicial
                  ou extrajudicial, tiver requerido a falência ou requerer
                  concordata; ou (ii) não infringir qualquer cláusula deste
                  contrato; ou (iii) da não renovação deste instrumento.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo terceiro. Passados 60 (sessenta) dias da
                  inadimplência do CONTRATANTE, o presente instrumento poderá
                  ser rescindido unilateralmente pela CONTRATADA sem que caiba
                  qualquer direito de indenização à CONTRATANTE e, não a
                  eximindo do pagamento de juros legais de 1% ao mês e multa
                  contratual de 10% do saldo devedor do contrato, e do
                  vencimento antecipado das parcelas vincendas, podendo o
                  presente instrumento ser executado por via judicial.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo quarto. Da rescisão, suspensão ou extinção do
                  presente instrumento, em qualquer caso e por qualquer motivo,
                  e obedecido os prazos legais, desobriga plena, irrestrita e
                  irrevogável a CONTRATADA e PARCEIRO(s), da continuidade da
                  execução dos serviços, não se responsabilizando por qualquer
                  prejuízo que a suspensão ou interrupção da execução do serviço
                  venha a causar.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo quinto. A CONTRATADA e PARCEIRO(s), obriga-se a
                  entregar, quando da rescisão do presente instrumento, os
                  documentos, Livros Contábeis e Fiscais e/ou arquivos
                  eletrônicos ao CONTRATANTE ou a outro profissional da
                  Contabilidade por ele(a) indicado(a).
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo sexto. O rompimento do vínculo contratual mediante
                  rescisão, por qualquer motivo, desobriga CONTRATADO e
                  PARCEIROS do prosseguimento das atividades, cessando
                  integralmente suas responsabilidades onde, dentro do prazo
                  estipulados nesta cláusula, o CONTRATANTE deverá indicar seu
                  novo parceiro contábil para transferência no mesmo período,
                  não isentando-se do pagamento dos honorários contábeis à
                  CONTRATADA pelo fechamento deste período.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA DÉCIMA SEGUNDA</strong> – Quando da rescisão,
                  o CONTRATANTE obriga-se a indicar novo parceiro contábil
                  dentre os prazos estabelecidos na cláusula anterior,
                  isentando-se total e irrestrita a CONTRATADA e PARCEIRO(s) de
                  quaisquer responsabilidades cíveis, administrativas e penais
                  causadas pela sua inação.
                </p>

                <p style={{ marginTop: "30px" }}>
                  <strong>DO SIGILO E DAS CONDIÇÕES GERAIS</strong>
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA DÉCIMA TERCEIRA</strong> – Por tratar-se de
                  instrumento de contrato de prestação de serviços, sem
                  compromissos de pessoalidade e subordinação, não há qualquer
                  vínculo empregatício entre as PARTES, e entre as PARTES e
                  PARCEIRO(s), não gerando, assim, obrigações trabalhistas ou
                  previdenciárias.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA DÉCIMA QUARTA</strong> – Considerando a Lei
                  Geral de Proteção de Dados - LGPD, a CONTRATADA e PARCEIRO(s)
                  se obrigam na observância e no cumprimento das regras quanto a
                  proteção de dados, inclusive no tratamento de dados pessoais e
                  sensíveis, de acordo com a necessidade e/ou obrigação legal de
                  coleta dos dados.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo primeiro. A CONTRATADA e PARCEIRO(s) executará os
                  trabalhos a partir das premissas da LGPD, em especial os
                  princípios da finalidade, adequação, transparência, livre
                  acesso, segurança, prevenção e não discriminação no tratamento
                  dos dados.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo segundo. Os documentos, arquivos, dados, metadados,
                  informações, etc. entregues pelo CONTRATANTE serão mantidos
                  sob sigilo, com integridade e segurança, estritamente pelo
                  tempo necessário ao cumprimento integral dos objetos deste
                  contrato.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo terceiro. Com a extinção do presente instrumento, os
                  documentos, arquivos, dados, metadados, informações, etc.
                  acima citados serão destruídos, salvo aqueles que forem
                  necessários para cumprimento de obrigação legal, na forma do
                  Artigo 16, inciso I, da Lei Federal nº 13.709 de 2018.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA DÉCIMA QUINTA</strong> – Quaisquer
                  notificações, lembretes ou outra forma de comunicação entre as
                  PARTES poderá ocorrer por meio de qualquer dos canais de
                  comunicação, inclusive e principalmente pelos meios
                  eletrônicos, como o App WhatsApp, informados pela CONTRATANTE,
                  cuja data e hora da leitura, confirmação e/ou qualquer tipo de
                  verificação será a do início da contagem do prazo de
                  prescrição, se houver.
                </p>

                <p style={{ marginTop: "30px" }}>
                  <strong>DA VALIDADE DA ASSINATURA ELETRÔNICA</strong>
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA DÉCIMA SEXTA</strong> – As PARTES conferem
                  anuência para que este instrumento de contrato, notificações
                  e/ou documentos possam ser celebrados por meio de assinaturas
                  eletrônicas ou digitais, nos termos do Artigo 10, da Medida
                  Provisória nº 2.200-0, de 24 de agosto de 2001, inclusive em
                  casos de certificados não emitidos pela ICP-Brasil.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  Parágrafo primeiro. O presente instrumento, notificações e
                  documentos poderão ser assinados pelas PARTES inclusive via
                  plataformas públicas e privadas de assinatura eletrônica e
                  digital, desde que a mesma esteja em estrita observância do
                  estipulado em Lei que garantam validade jurídica.
                </p>

                <p style={{ paddingLeft: "50pt", textDecoration: "underline" }}>
                  Parágrafo segundo. As PARTES <strong>RENUNCIAM</strong> à
                  possibilidade de exigir a troca, envio ou entrega das vias
                  originais (não eletrônicas) assinadas do presente instrumento,
                  notificações e/ou documentos, bem como, ao assinarem por meio
                  de assinaturas eletrônicas ou digitais, declaram a sua
                  integralidade, autenticidade, validade, executividade e
                  regularidade.
                </p>
                <p style={{ marginTop: "30px" }}>
                  <strong>DA VIGÊNCIA E DA RENOVAÇÃO</strong>
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA DÉCIMA SÉTIMA</strong> – O presente
                  instrumento de contrato vigerá pelo período de 1 (um) ano, com
                  início em {customer?.contractStartDate} e será renovado
                  automaticamente pelo mesmo período nos anos subsequentes,
                  salvo notificação de qualquer das PARTES com, no mínimo, 30
                  (trinta) dias corridos de antecedência.
                </p>

                <p style={{ marginTop: "30px" }}>
                  <strong>DOS CASOS OMISSOS E DO FORO</strong>
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  <strong>CLÁUSULA DÉCIMA OITAVA</strong> – Os casos omissos
                  serão saneados, preferencialmente, entre as PARTES,
                  buscando-se a resolução extra judicial, elegendo o Foro da
                  comarca de Poá, Estado de São Paulo como único competente para
                  cujo saneamento extrajudicial não for possível, com renúncia
                  expressa a qualquer outro, por mais privilegiado que seja.
                </p>

                <p style={{ paddingLeft: "50pt" }}>
                  E, por assim estarem de acordo, as partes firmam o presente
                  instrumento de contrato de prestação de serviços, em 02 (duas)
                  vias de igual teor e forma, na presença das testemunhas abaixo
                  assinadas, para que produza seus devidos efeitos legais.
                </p>

                <p style={{ textAlign: "center" }}>
                  Poá (SP), {today.getDate()} de{" "}
                  {today.toLocaleString("default", { month: "long" })} de{" "}
                  {today.getFullYear()}.
                </p>
                <div className="signature-section">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: "0px",
                    }}
                  >
                    <div style={{ textAlign: "center", marginTop: 50 }}>
                      <p style={{ marginTop: 0 }}>
                        ____________________________________________________
                      </p>
                      <p style={{ margin: 10 }}>
                        <strong>
                          FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA
                        </strong>
                      </p>
                      <p style={{ margin: 5 }}>
                        <strong>CNPJ nº 50.675.326/0001-97</strong>
                      </p>

                      <p style={{ margin: 5 }}>FLÁVIA ALMEIDA DA SILVA</p>
                      <p style={{ margin: 5 }}>
                        <i>Sócio administrador</i>
                      </p>
                    </div>

                    {customer?.partners?.map((partner, index) => {
                      return (
                        <div style={{ textAlign: "center" }} key={index}>
                          <p> &nbsp;</p>
                          <p style={{ marginTop: 0 }}>
                            ____________________________________________________
                          </p>
                          <p style={{ margin: 10 }}>
                            <strong style={{ textTransform: "uppercase" }}>
                              {partner?.name}
                            </strong>
                          </p>
                          <p style={{ margin: 5 }}>
                            <strong>
                              CPF n° {maskDocument(partner?.document)}
                            </strong>
                          </p>
                        </div>
                      );
                    })}
                  
                  </div>
                </div>
                <div className="signature-section">
                  <p style={{ textAlign: "center" }}>ANEXO I</p>
                  <p style={{ textAlign: "center" }}>
                    <strong>TERMO DE RESPONSABILIDADE CONTÁBIL</strong>
                  </p>
                  <p style={{ textAlign: "center", fontSize: ".9em" }}>
                    <strong>CONTRATO VINCULADO Nº{firstEightDigits}-001</strong>
                  </p>
                  <p style={{ marginTop: "30px" }}>
                    Pelo presente instrumento de Termo de Responsabilidade
                    Contábil:
                  </p>
                  <p style={{ margin: 10 }}>
                    <strong>SUPORHTE CONSULTORIA EMPRESARIAL LTDA</strong>, com
                    sede na cidade de Maringá, Estado do Paraná, na Rua Neo
                    Alves martins, nº 903, Sala 03, bairro Zona 03, CEP
                    87.050-110, inscrito sob o CNPJ nº 13.925.866/0001-55,
                    e-mail marceloneto@suporhte.com.br, neste ato representada
                    na forma do seu contrato social, na qualidade de PARCEIRO
                    representando os interesses da{" "}
                    <strong>
                      FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA
                    </strong>
                    , inscrita no CNPJ nº 50.675.326/0001-97;
                  </p>
                  <p style={{ textIndent: "200pt" }}>
                    ME COMPROMETO, a elaborar a Contabilidade de acordo com as
                    Normas Brasileiras de Contabilidade, executando atividades
                    na forma e limites discriminados abaixo e, em obediência
                    irrestrita, irretratável e imprescritível das cláusulas
                    estipuladas no CONTRATO DE PRESTAÇÃO DE SERVIÇOS VINCULADO,
                    considerado vinculado para todos os efeitos legais, quanto à
                    prestação dos serviços do Título – DO OBJETO E DO PRAZO,
                    mais especificadamente na CLÁUSULA 1ª e seguintes, firmado
                    entre:
                  </p>
                  <p style={{ marginTop: "10px" }}>
                    {customer?.partners?.map((partner, index, array) => {
                      return (
                        <div key={index}>
                          <strong style={{ textTransform: "uppercase" }}>
                            {partner?.name}
                          </strong>
                          , {partner?.nationality},{" "}
                          {translateMaritalStatus(
                            partner?.maritalStatus,
                            partner?.gender
                          )}
                          , inscrito no CPF sob o nº{" "}
                          {maskDocument(partner?.document)}
                          {index < array.length - 1 ? "," : " e"}{" "}
                        </div>
                      );
                    })}
                    <strong>
                      FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA
                    </strong>
                    , inscrita no CNPJ nº 50.675.326/0001-97, denominadas
                    PARTES, devidamente qualificadas no contrato vinculado.
                  </p>
                  <p style={{ marginTop: "10px" }}>
                    Cláusula primeira. Descrição das atividades a serem
                    executadas:
                  </p>
                  <p style={{ textAlign: "center", marginTop: "10px" }}>
                    <strong>1. Escrituração Contábil.</strong>
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    1.1 - Classificação da contabilidade de acordo com normas e
                    princípios contábeis vigentes;
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    1.2 - Emissão de Balancetes;
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    1.3 - Elaboração de Balanço anual e Demonstrativo de
                    Resultado.
                  </p>
                  <p style={{ textAlign: "center", marginTop: "10px" }}>
                    <strong>2. Escrituração Fiscal.</strong>
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    2.1 - Orientação e controle de aplicação dos dispositivos
                    legais vigentes, sejam Federais, Estaduais ou Municipais;
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    2.2 - Escrituração dos Registros Fiscais de todos Livros
                    obrigatórios perante o Governo Estadual do respectivo
                    domicílio fiscal, bem como, as obrigações que se fizerem
                    necessárias;
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    2.3 - Escriturações do Registro Fiscal de ISSQN, bem como,
                    as que se fizerem necessárias;
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    2.4 - Escriturações do Registro Fiscal de IPI, bem como, as
                    que se fizerem necessárias;
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    2.5 - Atendimento das demais exigências previstas na
                    Legislação, bem como, de eventuais procedimentos fiscais.
                  </p>
                  <p style={{ textAlign: "center", marginTop: "10px" }}>
                    <strong>3. Impostos Federais.</strong>
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    3.1 - Orientação e controle de aplicação dos dispositivos
                    legais vigentes;
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    3.2 - Guias de todos os impostos;
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    3.3 - Elaboração da DCTF;
                  </p>
                  <p style={{ paddingLeft: "50pt" }}>
                    3.4 - Atendimento das demais exigências previstas na
                    Legislação, bem como, de eventuais procedimentos fiscais.
                  </p>

                  <p>
                    Cláusula segunda. O PARCEIRO assume inteira responsabilidade
                    pelos serviços técnicos a que se obrigou, assim como pelas
                    orientações que prestar às PARTES.
                  </p>
                  <p>
                    Cláusula terceira. O presente termo de responsabilidade
                    contábil é celebrado por prazo indeterminado, podendo ser
                    rescindido, a qualquer tempo, mediante os termos do contrato
                    vinculado.
                  </p>
                  <p>
                    Cláusula quarta. As despesas decorrentes da execução dos
                    serviços discriminados neste termo, são de exclusiva
                    responsabilidade do PARCEIRO.
                  </p>
                  <p>
                    Cláusula quinta. Não há qualquer vínculo empregatício do
                    PARCEIRO com as PARTES, seus empregados ou prepostos.
                  </p>
                  <p>
                    Cláusula sexta. A vigência do presente TERMO DE
                    RESPONSABILIDADE CONTÁBIL é a mesma do contrato vinculado,
                    assim como sua extinção.
                  </p>
                  <p>
                    DECLARO plena ciência e concordância dos termos do contrato
                    vinculado entre as PARTES, aos quais também me vínculo.
                  </p>
                  <p>
                    E por ser a expressão verdade, firmo o presente, para que
                    surta os legais e jurídicos efeitos, sob pena das cominações
                    previstas em lei.
                  </p>
                  <p style={{ textAlign: "center", marginTop: "30px" }}>
                    <i> Mesmo local e data do contrato vinculado</i>
                  </p>

                  <div style={{ marginTop: "30px" }}>
                    <div style={{ textAlign: "center" }}>
                      <p> &nbsp;</p>
                      <p style={{ marginTop: 0 }}>
                        ____________________________________________________
                      </p>
                      <p style={{ margin: 10 }}>
                        <strong>SUPORHTE CONSULTORIA EMPRESARIAL LTDA</strong>
                      </p>
                      <p style={{ margin: 5 }}>CNPJ nº 13.925.866/0001-55</p>
                    </div>
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
          <tr>
            <td>&nbsp;</td>
          </tr>
        </tfoot>
      </table>
      <footer>
        <img
          src="/assets/logos/contract-footer.png"
          alt=""
          style={{
            left: 0,
            width: "100%",
            transform: "translateX(-1%) translateY(-43%)",
            height: "auto",
          }}
        />
      </footer>
    </div>
  );
};

export default FeeContract;
