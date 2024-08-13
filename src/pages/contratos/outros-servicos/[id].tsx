/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useCallback, useEffect } from "react";
import { useMounted } from "../../../hooks/use-mounted";
import CustomersApi from "../../../api/customers";
import { numberInWords } from "../../../utils/number-in-words";
import { maskDocument } from "../../../utils/masks/maskDocument";
import { useRouter } from "next/navigation";
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
      handleLoad();
    }
  }, [customer]);

  const today = new Date();

  const handleAfterPrint = () => {
    router.push(`/tributario/clientes/${customerId}`);
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
            <p key={service.id}>
              {`Objeto ${objectLabels[index]} - `}
              <strong>{servicesMap[service.serviceType]}</strong>
            </p>
          ))}
        </>
      );
    }
  }

  const documentValue =
    customer?.document || customer?.business?.document || "";
  const firstEightDigits = documentValue.substring(0, 8);

  const isBusiness = customer?.business?.corporateName.lenght > 1;

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

    console.log("service", services);

    if (services) {
      return (
        <>
          {services.map((service, index) => {
            if (service?.serviceType === "0" && !isBusiness) {
              const priceWithEntry =
                (service?.openingContract -
                  Number(service?.accountingPayment)) /
                service?.monthyFee;
              const priceWithoutEntry =
                service?.openingContract / service?.monthyFee;
              const monthyPrice = service?.paymentEntry
                ? priceWithEntry
                : priceWithoutEntry;

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
                    <p
                      style={{ marginBottom: 0 }}
                    >{`Objeto ${objectLabels[index]}`}</p>
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
                        Valor: {formatBRL(service?.openingContract)} (
                        {numberInWords(service?.openingContract)})
                        {service?.paymentEntry
                          ? ` com uma entrada de ${formatBRL(
                              service?.accountingPayment
                            )} (${numberInWords(
                              service?.accountingPayment
                            )}) e o restante `
                          : ""}
                        parcelado em {service?.monthyFee}x de{" "}
                        {formatBRL(monthyPrice)} ({numberInWords(monthyPrice)})
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
                      , e os demais no mesmo dia dos meses subsequentes, durante
                      a vigência do presente instrumento.
                    </p>
                  </div>
                </div>
              );
            }

            if (service?.serviceType === "1" && isBusiness) {
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
                    <p
                      style={{ marginBottom: 0 }}
                    >{`Objeto ${objectLabels[index]}`}</p>
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

            if (service?.serviceType === "2" && isBusiness) {
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
                    <p
                      style={{ marginBottom: 0 }}
                    >{`Objeto ${objectLabels[index]}`}</p>
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
                      <p style={{ margin: 10 }}>
                        Valor: {formatBRL(service?.openingContract)} (
                        {numberInWords(service?.openingContract)}) à vista
                      </p>
                    ) : (
                      <p>
                        Valor: {formatBRL(service?.openingContract)}{" "}
                        {numberInWords(service?.openingContract)} parcelado em{" "}
                        {service?.monthyFee}x de{" "}
                        {formatBRL(
                          service?.openingContract / service?.monthyFee
                        )}{" "}
                        ({" "}
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

            return (
              <>
                <p>
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
                <p style={{ textAlign: "center", marginBottom: "10px" }}>
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
                {isBusiness && (
                  <p>
                    {customer?.partners?.map((partner, index) => {
                      const address = partner.address
                        ? `${partner.address.street}, nº ${partner.address.number},  ${partner.address.neighborhood}, ${partner.address.city}, ${partner.address.state} - CEP ${partner.address.postalCode}`
                        : "Endereço não disponível";

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
                          , {partner?.occupation}, inscrito no CPF sob o nº{" "}
                          {maskDocument(partner?.document)}, documento de
                          identificação RG nº {partner?.rg} SSP/SP, residente e
                          domiciliado na {address};{" "}
                        </span>
                      );
                    })}
                    em conformidade com seu contrato social; doravante
                    denominada “CONTRATANTE”;
                  </p>
                )}

                {customer && !isBusiness && (
                  <p>
                    <span style={{ textAlign: "justify", textIndent: "50pt" }}>
                      <strong style={{ textTransform: "uppercase" }}>
                        {customer.name}
                      </strong>
                      , {customer.nationality},{" "}
                      {translateMaritalStatus(
                        customer.maritalStatus,
                        customer.gender
                      )}
                      , {customer.occupation ? `${customer.occupation},` : ""}
                      inscrito no CPF sob o nº {maskDocument(customer.document)}
                      , documento de identificação RG nº {customer.rg} SSP/SP,
                      residente e domiciliado na{" "}
                      {customer.address?.street || "Endereço não disponível"},
                      nº {customer.address?.number || ""},
                      {customer.address?.neighborhood || ""},{" "}
                      {customer.address?.city || ""},{" "}
                      {customer.address?.state || ""} - CEP{" "}
                      {customer.address?.postalCode || ""},
                      {customer.phone ? ` telefone: ${customer.phone}, ` : ""}
                      {customer.email ? ` e-mail: ${customer.email};` : ";"}
                    </span>{" "}
                    doravante denominada “CONTRATANTE”;
                  </p>
                )}

                <p>
                  ambas conjuntamente denominadas “PARTES”, resolvem firmar o
                  presente Contrato de Prestação de Serviços de Consultoria
                  Tributária, Contábil e Empresarial têm, entre si, certa e
                  ajustada mediante as cláusulas e condições seguintes:
                </p>

                <p>
                  <strong>DO OBJETO E DO PRAZO</strong>
                </p>
                <p>
                  <strong>CLÁUSULA PRIMEIRA</strong> – A CONTRATADA
                  compromete-se a realizar a Prestação de Serviços negociados
                  entre as PARTES, aos quais compreenderão de forma restrita e
                  nos limites o estipulado(s) no(s) objeto(s) abaixo:
                </p>
                {getContractServices(customer?.services)}

                {/* DEIXAR DINAMICO AQUI TBM @TODO --- */}
                <p>
                  Parágrafo único. A execução dos serviços contábeis objeto(s)
                  deste contrato será de responsabilidade técnica do PARCEIRO
                  indicado neste contrato (Anexo).
                </p>
                {/* DEIXAR DINAMICO AQUI TBM @TODO --- */}

                <p>
                  <strong>DA EXECUÇÃO DOS SERVIÇOS</strong>
                </p>
                <p>
                  <strong>CLÁUSULA SEGUNDA</strong> – A execução dos serviços,
                  discriminados na CLÁUSULA PRIMEIRA, somente iniciarão a partir
                  do cumprimento integral da CLÁUSULA QUARTA do presente
                  instrumento, indispensáveis à correta e integral execução dos
                  serviços.
                </p>
                <p>
                  Parágrafo primeiro. A suspensão da execução dos serviços
                  ocorrerá automaticamente, sem necessidade de prévio aviso, em
                  caso de inadimplência do CONTRATANTE, por mais de 15 (quinze)
                  dias, facultando à CONTRATADA a rescisão motivada do presente
                  instrumento de contrato e imediato distrato do Contrato/Termo
                  ativo com o PARCEIRO indicado.
                </p>
                <p>
                  Parágrafo segundo. O não cumprimento dos serviços estipulados
                  na CLÁUSULA PRIMEIRA pela CONTRATADA ou parceiro indicado, por
                  sua exclusiva culpa, faz jus a CONTRATANTE à multa pelo
                  atraso, no valor de 5% do valor proporcional correspondente ao
                  pagamento correspondente do mês.
                </p>

                <p>
                  Parágrafo terceiro. Na ocorrência de suspensão da execução
                  do(s) serviço(s) objeto(s) do presente instrumento, nos termos
                  desta cláusula, a CONTRATADA e seus parceiros eximem-se de
                  qualquer responsabilidade por danos causados em consequência
                  da suspensão.
                </p>

                <p>
                  <strong>CLÁUSULA TERCEIRA</strong> – A CONTRATADA é livre para
                  a execução e desenvolvimento da prestação do(s) serviço(s)
                  objeto(s) do presente instrumento, estando autorizada,
                  inclusive, e a qualquer tempo, a firmar PARCERIAS, contratar,
                  subcontratar, indicar ou de qualquer forma integrar parceiros
                  e colaboradores externos, denominados no presente instrumento
                  de “PARCEIROS”, previamente habilitados pela CONTRATADA para
                  atingir os fins do(s) objeto(s) deste instrumento.
                </p>

                <p>
                  Parágrafo primeiro. Os PARCEIROS de que trata a presente
                  cláusula, todos pessoa jurídica de direito privado,
                  habilitados e regulares perante os órgãos legais e
                  fiscalizadores oficiais, para a execução dos serviços
                  discriminados na CLÁUSULA PRIMEIRA, nos seus exatos termos, e
                  previamente conhecidos pela CONTRATANTE nos termos do presente
                  instrumento e/ou por meios de notificações de que trata o
                  parágrafo quarto desta cláusula, e termos aditivos de que
                  trata a CLÁUSULA DÉCIMA, são responsáveis de forma integral e
                  irrestrita da execução dos serviços que se comprometeram e
                  pelas consequências administrativas, civis e penais pela
                  execução, imperfeição ou inexecução dos respectivos serviços e
                  seus efeitos legais.
                </p>

                <p>
                  Parágrafo segundo. O(s) PARCEIRO(S) da CONTRATADA, estão
                  subordinados às cláusulas do presente instrumento, inclusive
                  quanto aos sigilos, segurança, responsabilidades,
                  profissionalismo, ética e moral necessários.
                </p>

                <p>
                  Parágrafo terceiro. O CONTRATANTE poderá, a qualquer tempo,
                  solicitar a substituição do PARCEIRO(s) indicado(s), se
                  houver, responsável para a execução do(s) serviço(s) objeto(s)
                  do presente instrumento a que se comprometeu, na forma desta
                  cláusula, por meio de notificação escrita, com 60 (sessenta)
                  dias de antecedência, ou na metade do prazo, com pagamento à
                  CONTRATADA de taxa adicional na proporção de 15% do valor do
                  presente contrato.
                </p>

                <p>
                  Parágrafo quarto. A substituição do PARCEIRO, na forma do
                  parágrafo anterior, a pedido do CONTRATANTE, em qualquer caso,
                  poderá ocorrer por 1 (uma) única vez dentro do período de
                  vigência do presente instrumento.
                </p>

                <p>
                  Parágrafo quinto. A CONTRATADA poderá, unilateralmente,
                  imotivada e a qualquer tempo, realizar a substituição do
                  PARCEIRO, se houver, responsável pela execução do(s)
                  serviço(s) objeto(s) do presente instrumento, na qual o
                  CONTRATANTE será notificado da alteração, o qual não importará
                  em rescisão contratual.
                </p>

                <p>
                  <strong>DAS OBRIGAÇÕES DA CONTRATANTE</strong>
                </p>

                <p>
                  <strong>CLÁUSULA QUARTA</strong> – A CONTRATANTE
                  compromete-se, durante a vigência do presente instrumento de
                  contrato a garantir o fiel cumprimento das suas obrigações, e
                  ainda:
                </p>

                <p>
                  Parágrafo primeiro. A fornecer todos os documentos, arquivos,
                  credenciais, dados, metadados, informações, pormenores, etc.
                  solicitados, indispensáveis à integral execução da prestação
                  do(s) serviço(s) objeto(s) do presente instrumento, dentro dos
                  prazos, datas e períodos estipulados, responsabilizando-se
                  pelas consequências pelo não cumprimento das solicitações
                  dentro do prazo.
                </p>

                <p>
                  Parágrafo segundo. Se obriga a preparar, mensalmente, toda a
                  documentação solicitada, se houver, que deverá ser
                  disponibilizada à CONTRATADA em tempo hábil, conforme
                  cronograma pactuado entre as PARTES, a fim de que possa
                  executar seus serviços na conformidade com o citado neste
                  instrumento.
                </p>

                <p>
                  Parágrafo terceiro. DECLARA que todos os documentos, arquivos,
                  credenciais, dados, metadados, informações, pormenores, etc.
                  encaminhados à CONTRATADA e PARCEIRO(s), estão revestidos de
                  integridade, idoneidade e legalidade, assumindo total
                  responsabilidade pelo seu conteúdo.
                </p>

                <p>
                  Parágrafo quarto. DECLARA plena ciência da Lei nº 9.613/98,
                  alterada pela Lei nº 12.683/2012, especificamente no que trata
                  da lavagem de dinheiro.
                </p>

                <p>
                  Parágrafo quinto. Se obriga a realizar o pagamento das guias
                  oficiais relacionadas, assumindo total responsabilidade pelas
                  consequências pelo não pagamento no prazo estipulado.
                </p>

                <p>
                  Parágrafo sexto. A efetuar os pagamentos devidos na forma e
                  nas condições estabelecidas no presente instrumento.
                </p>

                <p>
                  Parágrafo sétimo. A manter a comunicação ativa e atualizada
                  com a CONTRATADA e PARCEIRO(S) indicado(s), de forma a
                  responder as solicitações de forma integral e no
                  esclarecimento de eventuais dúvidas.
                </p>

                <p>
                  Parágrafo oitavo. Compromete-se a seguir rigorosamente todas
                  as orientações estipuladas, responsabilizando-se das
                  consequências pelo seu não cumprimento.
                </p>

                <p>
                  Parágrafo nono. Eventuais multas e taxas por entrega fora de
                  prazo junto aos órgãos oficiais ocasionados pelo não
                  cumprimento das orientações estipuladas, às quais deverão ser
                  suportados integralmente pelo CONTRATANTE.
                </p>

                <p>
                  Parágrafo décimo. Valores como taxas, impostos, e demais
                  pagamentos necessários à execução da prestação do(s)
                  serviço(s) junto aos órgãos oficiais deverão ser suportados
                  pela CONTRATANTE e, caso a CONTRATADA e/ou PARCEIRO indicado
                  realize o respectivo pagamento, deverá ser reembolsada
                  mediante apresentação de comprovante.
                </p>

                <p>
                  <strong>DAS OBRIGAÇÕES DA CONTRATADA E PARCEIROS</strong>
                </p>

                <p>
                  <strong>CLÁUSULA QUINTA</strong> – A CONTRATADA e PARCEIRO(s),
                  comprometem-se a executar o(s) serviço(s) objeto(s) do
                  presente instrumento em observância à ética profissional e a
                  moral pública, responsabilizando-se tecnicamente pela
                  respectiva execução, pelos prazos de conclusão estipulados e
                  diligência(s) presencial(is) e/ou virtual(is) de sua
                  responsabilidade necessária(s) às demandas de interesse da
                  CONTRATANTE para o integral cumprimento das obrigações
                  objeto(s) deste instrumento.
                </p>

                <p>
                  <strong>CLÁUSULA SEXTA</strong> – A CONTRATADA e PARCEIRO(s)
                  compromete-se a manter o absoluto sigilo fiscal, bancário,
                  financeiro e de informações sobre operações, dados,
                  pormenores, informações, documentos, dados, metadados, etc.
                  solicitados e entregues pela CONTRATANTE, não eximindo-se de
                  manter as mesmas obrigações após a conclusão do presente
                  instrumento, reservando-se de manter sob sua guarda somente
                  documentos indispensáveis à fiscalização de órgãos públicos e
                  de classes profissionais pelo prazo de até 5 (cinco) anos,
                  observando-se a CLÁUSULA DÉCIMA TERCEIRA.
                </p>

                <p>
                  <strong>CLÁUSULA SÉTIMA</strong> – A CONTRATADA e PARCEIRO(s)
                  manterá a CONTRATANTE constantemente atualizada do andamento
                  da execução dos serviços, do cumprimento dos prazos e da
                  conclusão de tarefas.
                </p>

                <p>
                  <strong>CLÁUSULA OITAVA</strong> – A CONTRATADA fornecerá
                  nota(s) fiscal(is) dos pagamentos realizados pela CONTRATANTE,
                  se houver, de acordo com os valores estipulados no presente
                  instrumento.
                </p>

                <p>
                  <strong>DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO</strong>
                </p>

                <p>
                  <strong>CLÁUSULA NONA</strong> – A título de remuneração do
                  presente instrumento, a CONTRATANTE pagará à CONTRATADA a(s)
                  quantia(s) e na(s) forma(s) que segue(m):
                </p>

                <div>{getContractServicesDetails(customer?.services)}</div>

                <p>
                  Parágrafo primeiro. As respectivas remunerações, deverão ser
                  realizadas mediante uma das formas de pagamento abaixo, todas
                  de titularidade da FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL
                  LTDA:
                </p>

                <div>
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

                <p>
                  Parágrafo segundo. A realização do pagamento com acréscimo de
                  multa e juros legais após a data de vencimento é de total
                  responsabilidade da CONTRATANTE, assim como a verificação,
                  confirmação e comprovação do título de pagamento, cujo não
                  recebimento deve ser informado à CONTRATADA com antecedência
                  mínima de 2 (dois) dias, anterior ao seu vencimento.
                </p>

                <p>
                  Parágrafo terceiro. Não importará em novação, o eventual
                  recebimento de qualquer valor após o seu vencimento o que
                  poderá se dar por mera liberalidade do CONTRATADO, contudo,
                  neste caso, poderá incidir multa de 2% sobre a valor a receber
                  com atraso, além de juros legais de 1%, pro rata die, ao mês.
                </p>

                <p>
                  Parágrafo quarto. O CONTRATADO isenta-se de toda e qualquer
                  responsabilidade pelo não envio de lembretes de pagamento,
                  notificações, ou qualquer informação fornecida com a mesma
                  finalidade de pré-aviso de pagamento, cuja realização se dará
                  por mera liberalidade do CONTRATADO.
                </p>

                <p>
                  Parágrafo quinto. A execução de serviço(s) extraordinário(s)
                  somente será realizada mediante termo aditivo ao presente
                  instrumento, conforme negociação entre as PARTES.
                </p>

                <p>
                  <strong>
                    DO DESCUMPRIMENTO, DA RESCISÃO E DO TERMO ADITIVO
                  </strong>
                </p>

                <p>
                  <strong>CLÁUSULA DÉCIMA</strong> – O descumprimento de
                  qualquer das cláusulas do presente instrumento por qualquer
                  das PARTES e PARCEIRO(s) implicará na rescisão imediata deste
                  instrumento, não desobrigando a CONTRATADA e PARCEIRO(s) do
                  cumprimento integral da CLÁUSULA SEXTA.
                </p>

                <p>
                  Parágrafo primeiro - O presente instrumento, em comum acordo,
                  poderá ser alterado mediante termo aditivo competente, salvo
                  parágrafo quarto da cláusula terceira.
                </p>

                <p>
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

                <p>
                  Parágrafo terceiro. Passados 60 (sessenta) dias da
                  inadimplência do CONTRATANTE, o presente instrumento poderá
                  ser rescindido unilateralmente pela CONTRATADA sem que caiba
                  qualquer direito de indenização à CONTRATANTE e, não a
                  eximindo do pagamento de juros legais de 1% ao mês e multa
                  contratual de 10% do saldo devedor do contrato, e do
                  vencimento antecipado das parcelas vincendas, podendo o
                  presente instrumento ser executado por via judicial.
                </p>

                <p>
                  Parágrafo quarto. Da rescisão, suspensão ou extinção do
                  presente instrumento, em qualquer caso e por qualquer motivo,
                  e obedecido os prazos legais, desobriga plena, irrestrita e
                  irrevogável a CONTRATADA e PARCEIRO(s), da continuidade da
                  execução dos serviços, inclusive da renúncia como procurador
                  judicial, não se responsabilizando por qualquer prejuízo que a
                  suspensão ou interrupção da execução do serviço venha a causar
                </p>

                <p>
                  Parágrafo quinto. O rompimento do vínculo contratual obriga as
                  PARTES e PARCEIRO(s) à celebração de distrato com a
                  especificação da cessação das responsabilidades dos
                  contratantes.
                </p>

                <p>
                  <strong>CLÁUSULA DÉCIMA PRIMEIRA</strong> – Poderá o presente
                  instrumento de contrato ser rescindindo por qualquer da
                  PARTES, a qualquer momento, sem que haja qualquer motivo
                  relevante, por meio de notificação por escrito com
                  antecedência mínima de 30 (trinta) dias corridos do
                  recebimento, obrigando-se as PARTES e PARCEIRO(s) a concluírem
                  somente as tarefas que já estejam em andamento e do
                  cumprimento integral da CLÁUSULA NONA.
                </p>

                <p>
                  <strong>DO SIGILO E DAS CONDIÇÕES GERAIS</strong>
                </p>

                <p>
                  <strong>CLÁUSULA DÉCIMA SEGUNDA</strong> – Por tratar-se de
                  instrumento de contrato de prestação de serviços, sem
                  compromissos de pessoalidade e subordinação, não há qualquer
                  vínculo empregatício entre as PARTES e PARCEIRO(s), não
                  gerando, assim, obrigações trabalhistas ou previdenciárias.
                </p>

                <p>
                  <strong>CLÁUSULA DÉCIMA TERCEIRA</strong> – Considerando a Lei
                  Geral de Proteção de Dados - LGPD, a CONTRATADA e PARCEIRO(s)
                  se obrigam na observância e no cumprimento das regras quanto a
                  proteção de dados, inclusive no tratamento de dados pessoais e
                  sensíveis, de acordo com a necessidade e/ou obrigação legal de
                  coleta dos dados.
                </p>

                <p>
                  Parágrafo primeiro. A CONTRATADA e PARCEIRO(s) executará os
                  trabalhos a partir das premissas da LGPD, em especial os
                  princípios da finalidade, adequação, transparência, livre
                  acesso, segurança, prevenção e não discriminação no tratamento
                  dos dados.
                </p>

                <p>
                  Parágrafo segundo. Os documentos, arquivos, dados, metadados,
                  informações, etc. entregues pelo CONTRATANTE por solicitação
                  da CONTRATADA e PARCEIRO(s) serão mantidos sob sigilo,
                  integridade e segurança pela CONTRATADA, estritamente pelo
                  tempo necessário ao cumprimento integral dos serviços
                  contratados.
                </p>

                <p>
                  Parágrafo terceiro. Após concluída a prestação do(s)
                  serviço(s) objeto(s) do presente instrumento, os documentos,
                  arquivos, dados, metadados, informações, etc. acima citados
                  serão destruídos, salvo aqueles que forem necessários para
                  cumprimento de obrigação legal, na forma do Artigo 16, inciso
                  I, da Lei Federal nº 13.709 de 2018.
                </p>

                <p>
                  <strong>DA VALIDADE DA ASSINATURA ELETRÔNICA</strong>
                </p>

                <p>
                  <strong>CLÁUSULA DÉCIMA QUARTA</strong> – As PARTES conferem
                  anuência para que este instrumento de contrato, notificações
                  e/ou documentos possam ser celebrados por meio de assinaturas
                  eletrônicas ou digitais, nos termos do Artigo 10, da Medida
                  Provisória nº 2.200-0, de 24 de agosto de 2001, inclusive em
                  casos de certificados não emitidos pela ICP-Brasil.
                </p>

                <p>
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
                <p>
                  <strong>DA VIGÊNCIA E DA RENOVAÇÃO</strong>
                </p>

                <p>
                  <strong>CLÁUSULA DÉCIMA QUINTA</strong> – O presente contrato
                  vigerá pelo período de 1 (um) ano, e será renovado
                  automaticamente pelo mesmo período nos anos subsequentes,
                  salvo se haver notificação por escrito de qualquer das PARTES
                  com, no mínimo, 30 (trinta) dias corridos de antecedência.
                </p>

                <p>
                  <strong>DOS CASOS OMISSOS E DO FORO</strong>
                </p>

                <p>
                  <strong>CLÁUSULA DÉCIMA SEXTA</strong> – Os casos omissos
                  serão saneados, preferencialmente, entre as PARTES,
                  buscando-se a resolução extrajudicial, elegendo o Foro da
                  comarca de Suzano, Estado de São Paulo como único competente
                  para cujo saneamento extrajudicial não for possível, com
                  renúncia expressa a qualquer outro, por mais privilegiado que
                  seja.
                </p>

                <p>
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
                    {isBusiness &&
                      customer?.partners?.map((partner, index) => {
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

                    {!isBusiness && (
                      <div style={{ textAlign: "center" }}>
                        <p> &nbsp;</p>
                        <p style={{ marginTop: 0 }}>
                          ____________________________________________________
                        </p>
                        <p style={{ margin: 10 }}>
                          <strong style={{ textTransform: "uppercase" }}>
                            {customer?.name}
                          </strong>
                        </p>
                        <p style={{ margin: 5 }}>
                          <strong>
                            CPF n° {maskDocument(customer?.document)}
                          </strong>
                        </p>
                      </div>
                    )}
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
            marginTop: 10,
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
