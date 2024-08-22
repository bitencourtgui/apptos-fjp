import { useMemo } from "react";
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
  Font,
} from "@react-pdf/renderer";
import { useTheme } from "@mui/material/styles";
import { translateMaritalStatus } from "@/utils/translate";
import { maskDocument } from "@/utils/masks/maskDocument";
import { phoneMask } from "@/utils/masks/phoneMask";
import { numberInWords } from "@/utils/number-in-words";

const useStyles = () => {
  const theme = useTheme();

  Font.register({
    family: "Inter",
    fonts: [
      {
        src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf",
        fontWeight: 100,
      },
      {
        src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyfMZhrib2Bg-4.ttf",
        fontWeight: 200,
      },
      {
        src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf",
        fontWeight: 300,
      },
      {
        src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
        fontWeight: 400,
      },
      {
        src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
        fontWeight: 500,
      },
      {
        src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
        fontWeight: 600,
      },
      {
        src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
        fontWeight: 700,
      },
      {
        src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuDyYMZhrib2Bg-4.ttf",
        fontWeight: 800,
      },
      {
        src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZhrib2Bg-4.ttf",
        fontWeight: 900,
      },
    ],
  });
  return useMemo(() => {
    return StyleSheet.create({
      page: {
        backgroundColor: "#FFFFFF",
        paddingBottom: 58,
      },
      h4: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.235,
      },
      h6: {
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.6,
      },
      alignRight: {
        textAlign: "right",
      },
      subtitle2: {
        fontSize: 10,
        fontWeight: 500,
        lineHeight: 1.57,
      },
      body3: {
        fontSize: 10,
        fontFamily: "Inter",
        fontWeight: "bold", // Ou fontWeight: 700
        lineHeight: 1.6,
      },
      body2: {
        fontFamily: "Inter",
        fontSize: 10,
        fontWeight: 400,
        lineHeight: 1.43,
      },
      boldText: {
        fontFamily: "Inter",
        fontWeight: "bold", // Ou fontWeight: 700
        textTransform: "uppercase",
      },
      underlineText: {
        fontFamily: "Inter",
        textDecoration: "underline",
      },
      centeredText: {
        fontFamily: "Inter",
        textAlign: "center",
      },
      gutterBottom: {
        marginBottom: 4,
      },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 16,
      },
      footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 50,
        position: "absolute",
        fontSize: 12,
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: "center",
        color: "grey",
      },
      brand: {
        height: "100%",
        width: "100%",
      },
      payment: {
        flexDirection: "row",
        margin: 12,
        marginLeft: 48,
        marginRight: 48,
      },
      paymentDetails: {
        borderColor: "#000",
        justifyContent: "center",
        padding: 8,
        borderStyle: "solid",
        borderWidth: 1,
        width: "40%",
      },
      paymentDetails2: {
        borderColor: "#000",
        justifyContent: "center",
        padding: 8,
        borderStyle: "solid",
        borderWidth: 1,
        width: "60%",
      },
      contractTitle: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingBottom: 24,
      },
      contractDate: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        paddingTop: 18,
      },
      contract: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 48,
        paddingRight: 48,
      },
      contractText: {
        textAlign: "justify",
        marginBottom: 8,
      },
      references: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 32,
      },
      signature: {
        marginTop: 32,
        marginBottom: 32,
      },
      signatureAdicional: {
        marginTop: 48,
        marginBottom: 32,
      },
      items: {
        paddingLeft: 48,
        paddingRight: 48,
        paddingBottom: 12,
      },
      itemRow: {
        borderBottomWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
        flexDirection: "row",
        padding: 4,
      },
      itemNumber: {
        padding: 6,
      },
      itemDescription: {
        padding: 6,
        width: "50%",
      },
      itemQty: {
        padding: 6,
        width: "10%",
      },
      itemUnitAmount: {
        padding: 6,
        width: "15%",
      },
      itemTotalAmount: {
        padding: 6,
        width: "15%",
      },
      summaryRow: {
        flexDirection: "row",
      },
      summaryGap: {
        padding: 6,
        width: "70%",
      },
      summaryTitle: {
        padding: 6,
        width: "15%",
      },
      summaryValue: {
        padding: 6,
        width: "15%",
      },
      notes: {
        marginTop: 32,
      },
      pageNumber: {
        fontFamily: "Inter",
        fontWeight: 600,
        textTransform: "uppercase",
        position: "absolute",
        fontSize: 10,
        top: 65,
        left: 420,
        right: 0,
        textAlign: "center",
      },
    });
  }, [theme]);
};

export const InvoicePdfDocument = ({ invoice }) => {
  const styles = useStyles();
  const today = new Date();

  const customerData = invoice;

  const isBusiness = customerData?.business?.corporateName.length > 1;
  const customer = isBusiness ? customerData?.business : customerData;

  const partners = customer?.partners;
  const address = `${customer.address?.street || ""}, nº ${
    customer.address?.number || ""
  }, ${customer.address?.neighborhood || ""}, ${
    customer.address?.city || ""
  }, ${customer.address?.state || ""} - CEP ${
    customer.address?.postalCode || ""
  }`;

  const contractNumber = customer?.document?.substring(0, 8);

  function formatBRL(value) {
    const currency = Number(value);

    return currency.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const calculatePaymentDate = (createdAt, paymentDate) => {
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
    const mm = String(paymentDueDate.getMonth() + 1).padStart(2, "0");
    const yyyy = paymentDueDate.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  };

  function getContractServices(services) {
    if (!services) return null;

    const labels = [
      "Primeiro",
      "Segundo",
      "Terceiro",
      "Quarto",
      "Quinto",
      "Sexto",
    ];
    const servicesMap = [
      "Abertura de Empresa",
      "Contabilidade Empresarial",
      "Desenquadramento",
      "Planejamento Tributário",
      "Isenção de IR",
      "Defesa Administrativa",
    ];

    return services
      .sort((a, b) => a.serviceType - b.serviceType)
      .map(({ serviceType }, index) => (
        <Text style={[styles.body2, styles.contractText]} key={index}>
          {`Objeto ${labels[index]} – `}
          <Text style={styles.boldText}>{servicesMap[serviceType]}</Text>
        </Text>
      ));
  }

  function getContractServicesDetails(services) {
    const servicesMap = {
      0: "Abertura de Empresa",
      1: "Contabilidade Empresarial",
      2: "Desenquadramento",
      3: "Planejamento Tributário",
      4: "Isenção de IR",
      5: "Defesa Administrativa",
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
                <View style={styles.payment} wrap={false} key={index}>
                  <View style={styles.paymentDetails}>
                    <Text
                      style={styles.body2}
                    >{`Objeto ${objectLabels[index]}`}</Text>
                    <Text style={styles.body2}>
                      <Text style={styles.boldText}>
                        {servicesMap[service.serviceType]}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.paymentDetails2}>
                    <Text style={[styles.body2, styles.contractText]}>
                      Valor: {formatBRL(service?.openingContract)} (
                      {numberInWords(service?.openingContract)})
                      {service.cashPayment
                        ? " à vista"
                        : ` ${
                            service?.paymentEntry
                              ? `com uma entrada de ${formatBRL(
                                  service?.accountingPayment
                                )} (${numberInWords(
                                  service?.accountingPayment
                                )}) e o restante`
                              : ""
                          } parcelado em ${service?.monthyFee}x de ${formatBRL(
                            monthyPrice
                          )} (${numberInWords(monthyPrice)}) ${
                            service?.paymentMethod === "bankslip"
                              ? "no Boleto"
                              : "no Cartão de Crédito"
                          }`}
                    </Text>

                    <Text style={styles.body2}>
                      Com pagamento previsto para dia{" "}
                      <Text style={styles.boldText}>
                        {" "}
                        {calculatePaymentDate(
                          service?.createdAt,
                          parseInt(service?.paymentDate)
                        )}
                      </Text>
                      , e os demais no mesmo dia dos meses subsequentes, durante
                      a vigência do presente instrumento.
                    </Text>
                  </View>
                </View>
              );
            }

            if (service?.serviceType === "1" && isBusiness) {
              return (
                <View style={styles.payment} wrap={false} key={index}>
                  <View style={styles.paymentDetails}>
                    <Text
                      style={styles.body2}
                    >{`Objeto ${objectLabels[index]}`}</Text>
                    <Text style={styles.body2}>
                      <Text style={styles.boldText}>
                        {servicesMap[service.serviceType]}
                      </Text>
                    </Text>
                    <Text style={styles.body2}>
                      <Text style={styles.boldText}>
                        {`Faixa de faturamento - Até ${formatBRL(
                          service.billingRange
                        )}`}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.paymentDetails2}>
                    {service.paymentEntry ? (
                      <>
                        <Text style={[styles.body2, styles.contractText]}>
                          Mensalidade inicial:{" "}
                          {formatBRL(service?.accountingPayment)}/mês (
                          {numberInWords(service?.accountingPayment)}). Primeiro
                          pagamento em{" "}
                          <Text style={styles.boldText}>
                            {dayjs(service?.accountingDate).format(
                              "DD/MM/YYYY"
                            )}
                          </Text>
                        </Text>
                        <Text style={[styles.body2, styles.contractText]}>
                          Demais Mensalidades:{" "}
                          {formatBRL(service?.accountingFee)} (
                          {numberInWords(service?.accountingFee)}).
                        </Text>
                        <Text style={[styles.body2, styles.contractText]}>
                          Primeiro pagamento em{" "}
                          <Text style={styles.boldText}>
                            {dayjs(service?.accountingDate)
                              .add(1, "month")
                              .format("DD/MM/YYYY")}
                          </Text>{" "}
                          e os demais no mesmo dia dos meses subsequentes,
                          durante a vigência do presente instrumento.
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text style={[styles.body2, styles.contractText]}>
                          Mensalidade: {formatBRL(service?.accountingFee)} (
                          {numberInWords(service?.accountingFee)}).
                        </Text>
                        <Text style={[styles.body2, styles.contractText]}>
                          Primeiro pagamento em{" "}
                          <Text style={styles.boldText}>
                            {dayjs(service?.accountingDate).format(
                              "DD/MM/YYYY"
                            )}
                          </Text>{" "}
                          e os demais no mesmo dia dos meses subsequentes,
                          durante a vigência do presente instrumento.
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              );
            }

            if (service?.serviceType === "2" && isBusiness) {
              return (
                <View style={styles.payment} wrap={false} key={index}>
                  <View style={styles.paymentDetails}>
                    <Text
                      style={styles.body2}
                    >{`Objeto ${objectLabels[index]}`}</Text>
                    <Text style={styles.body2}>
                      <Text style={styles.boldText}>
                        {servicesMap[service.serviceType]}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.paymentDetails2}>
                    {service.cashPayment ? (
                      <Text style={[styles.body2, styles.contractText]}>
                        Valor: {formatBRL(service?.openingContract)} (
                        {numberInWords(service?.openingContract)}) à vista
                      </Text>
                    ) : (
                      <Text style={[styles.body2, styles.contractText]}>
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
                      </Text>
                    )}
                    <Text style={[styles.body2, styles.contractText]}>
                      Com pagamento previsto para dia{" "}
                      <Text style={styles.boldText}>
                        {calculatePaymentDate(
                          service?.createdAt,
                          parseInt(service?.paymentDate)
                        )}
                      </Text>
                    </Text>
                  </View>
                </View>
              );
            }

            return (
              <Text style={[styles.body2, styles.contractText]} key={index}>
                Serviço não selecionado
              </Text>
            );
          })}
        </>
      );
    }
  }

  const renderHeader = () => (
    <View style={styles.header} fixed>
      <Image source="/assets/logos/contract-header2.png" style={styles.brand} />
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber} de ${totalPages}`
        }
        fixed
      />
    </View>
  );

  const renderFooter = () => {
    return (
      <View style={styles.footer} fixed>
        <Image
          source="/assets/logos/contract-footer.png"
          style={styles.brand}
        />
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        {renderHeader()}
        <View style={styles.contractTitle}>
          <Text style={styles.body3}>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</Text>
          <Text style={styles.body3}>Nº {contractNumber}-001</Text>
        </View>
        <View style={styles.contract}>
          <View>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>
                FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA
              </Text>
              , inscrita no CNPJ nº 50.675.326/0001-97, com sede na Avenida Nove
              de Julho, Vila das Acácias, na cidade de Poá, no Estado de São
              Paulo, CEP 08.557- 100, e-mail
              controladoria@fjpconsultoria.com.br, neste ato representada na
              forma do seu contrato social, doravante denominada “CONTRATADA” e;
            </Text>

            {isBusiness &&
              customer?.partners.map((partner, key) => (
                <Text style={[styles.body2, styles.contractText]} key={key}>
                  <Text style={styles.boldText}>{partner.name}</Text>,
                  brasileira, Solteira, inscrito no CPF sob o nº 139.257.458-74,
                  documento de identificação RG nº 179088907 SSP/SP, residente e
                  domiciliado na Rua Expedicionário Abílio Fernandes, nº
                  248,Vila Paiva, Suzano, SP - CEP 08675100, telefone:
                  11976467496, e-mail: msiqueira478@gmail.com; doravante
                  denominada “CONTRATANTE”;
                </Text>
              ))}

            {/* @TODO RG SSP/SP FIXO? */}
            {!isBusiness && (
              <Text style={[styles.body2, styles.contractText]}>
                <Text style={styles.boldText}>{customer.name}</Text>,{" "}
                {customer.nationality},
                {translateMaritalStatus(
                  customer.maritalStatus,
                  customer.gender
                )}{" "}
                {customer.occupation && `${customer.occupation},`} inscrito(a)
                no CPF sob o nº {maskDocument(customer.document)}, documento de
                identificação RG nº {customer.rg} SSP/SP, residente e
                domiciliado na {address}, telefone: {phoneMask(customer.phone)},
                e-mail:
                {customer.email}; em conformidade com seu contrato social;
                doravante denominada “CONTRATANTE”;
              </Text>
            )}

            <Text style={[styles.body2, styles.contractText]}>
              ambas conjuntamente denominadas “PARTES”, resolvem firmar o
              presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE CONTABILIDADE
              EMPRESARIAL têm, entre si, certa e ajustada mediante as cláusulas
              e condições seguintes:
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>DO OBJETO E DO PRAZO</Text>
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA PRIMEIRA</Text> – A
              CONTRATADA compromete-se a realizar a Prestação de Serviços
              negociados entre as PARTES, que compreende, restrita e nos
              limites, o estipulado(s) no(s) objeto(s) abaixo:
            </Text>

            {getContractServices(customer.services)}

            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo único. A execução dos serviços contábeis objeto(s) deste
              contrato será de responsabilidade técnica do PARCEIRO indicado
              neste contrato (Anexo).
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>
                DA EXECUÇÃO DOS SERVIÇOS E DOS PARCEIROS
              </Text>
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA SEGUNDA</Text> – Para que
              se tenha início a execução do(s) serviço(s) objeto deste contrato,
              se dará(ão) a partir do cumprimento integral dos Parágrafos 1º e
              2º da CLÁUSULA QUINTA, indispensáveis à correta e integral
              execução dos serviços.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo primeiro. Ocorrerá a suspensão do(s) serviço(s) objeto
              deste contrato, unilateralmente e automática, sem necessidade de
              prévio aviso, em caso de inadimplência do CONTRATANTE, por mais de
              60 (sessenta) dias corridos do vencimento de qualquer parcela,
              facultando à CONTRATADA a rescisão motivada do contrato.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo segundo. O não cumprimento dos serviços estipulados na
              CLÁUSULA PRIMEIRA pela CONTRATADA ou PARCEIRO(s), por sua
              exclusiva culpa, faz jus a CONTRATANTE à multa pelo atraso, no
              valor de 5% do valor proporcional correspondente a parcela
              correspondente do mêsrágrafo terceiro. Na ocorrência de suspensão
              da execução do(s) serviço(s) objeto(s) do presente instrumento, a
              CONTRATADA e PARCEIRO(s) eximem-se de qualquer responsabilidade
              por danos causados em consequência da suspensão.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA TERCEIRA</Text> – A
              CONTRATADA é livre para a execução e desenvolvimento da prestação
              do(s) serviço(s) objeto(s) do presente instrumento, estando
              autorizada, inclusive, e a qualquer tempo, a firmar parcerias
              técnicas, contratar e subcontratar, denominados no presente
              instrumento de “PARCEIROS”, para atingir os fins do(s) objeto(s)
              deste instrumento.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo primeiro. O(s) PARCEIRO(s), habilitados e regulares
              perante os órgãos legais, para a execução do(s) serviço(s)
              objeto(s) deste contrato, são responsáveis de forma integral e
              irrestrita da execução do(s) serviço(s) atribuído(s), e por suas
              consequências administrativas, civis e penais pela execução,
              imperfeição ou inexecução.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo segundo. O(s) PARCEIRO(s) está(ão) subordinado(s) às
              cláusulas do presente instrumento, inclusive quanto aos sigilos,
              segurança, responsabilidades, profissionalismo, ética e moral
              necessários.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo terceiro. O CONTRATANTE poderá, a qualquer tempo,
              solicitar a substituição do PARCEIRO(s) indicado(s), se houver,
              por meio de notificação, com 60 (sessenta) dias de antecedência,
              ou na metade do prazo, com pagamento à CONTRATADA de taxa
              adicional na proporção de 50% (cinquenta porcento) da parcela
              mensal do contrato contábil, respeitado os termos da CLÁUSULA
              QUARTA.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo quarto. A substituição do PARCEIRO, na forma do
              parágrafo anterior, em qualquer caso, poderá ocorrer por 1 (uma)
              única vez, por objeto, dentro do período de vigência do presente
              instrumento.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo quinto. A CONTRATADA poderá, unilateralmente, a qualquer
              tempo, realizar a substituição do PARCEIRO(s), se houver, na qual
              a CONTRATANTE será notificada previamente, na qual poderá se
              manifestar quanto ao novo parceiro, cuja manifestação em contrário
              suspenderá a execução do serviço objeto atribuído até , salvo
              efeitos financeiros, o que não importará em rescisão contratual.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA QUARTA</Text> – Os serviços
              contábeis, discriminado(s) na CLÁUSULA PRIMEIRA, quando da sua
              transferência externa, só poderá ser realizada e concluída
              mediante o cumprimento das formalidades estabelecidas no Termo de
              Transferência de Responsabilidade Técnica, na forma e procedimento
              estabelecido em Lei específica.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>DAS OBRIGAÇÕES DA CONTRATANTE</Text>
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA QUINTA</Text> – A
              CONTRATANTE compromete-se, durante a vigência do presente
              instrumento, a garantir o fiel cumprimento das suas obrigações, e
              ainda:
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo primeiro. Fornecer à CONTRATADA e PARCEIRO(s) todos os
              documentos, arquivos, credenciais, dados, metadados, informações,
              pormenores, etc. solicitados, e indispensáveis à integral execução
              dos objetos da CLÁUSULA PRIMEIRA, dentro dos prazos, datas e
              períodos estipulados, responsabilizando-se pelas consequências do
              não cumprimento das solicitações neste período
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo segundo. Se obriga a preparar, mensalmente, toda a
              documentação fisco-contábil e de pessoal, que deverá ser
              disponibilizada dentre o período estipulado, conforme cronograma
              pactuado entre as PARTES, a fim de que possa executar seus
              serviços em conformidade com o citado neste instrumento.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo terceiro. DECLARA que todos os documentos, arquivos,
              credenciais, dados, metadados, informações, pormenores, etc.
              encaminhados à CONTRATADA e PARCEIRO(s), estão revestidos de
              integridade, idoneidade e legalidade, assumindo total
              responsabilidade pelo seu conteúdo.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo quarto. DECLARA plena ciência da Lei nº 9.613/98,
              alterada pela Lei nº 12.683/2012, especificamente no que trata da
              lavagem de dinheiro, regulamentada pela Resolução n.º 1.445/13 do
              Conselho Federal de Contabilidade - CFC.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo quinto. Se obriga a realizar o pagamento das guias
              referentes às obrigações principais e acessórias, assumindo total
              responsabilidade pelas consequências da não quitação até o
              vencimento estipulado pelo órgão.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo sexto. Se obriga, antes do encerramento do exercício
              social, a fornecer a Carta de Responsabilidade da Administração.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo sétimo. A efetuar os pagamentos devidos na forma e nas
              condições estabelecidas no presente instrumento.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo oitavo. A manter a comunicação ativa e atualizada com a
              CONTRATADA e PARCEIRO(S), de forma a responder as solicitações de
              forma integral e no esclarecimento de eventuais dúvidas.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo nono. Compromete-se a seguir rigorosamente todas as
              orientações estipuladas, responsabilizando-se das consequências
              legais do não cumprimento.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo décimo. Eventuais multas e taxas por entrega fora de
              prazo junto aos órgãos oficiais ocasionados pelo não cumprimento
              das orientações estipuladas em tempo hábil, deverão ser suportados
              integralmente pelo CONTRATANTE.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo décimo primeiro. Valores como taxas, multas e impostos,
              e demais pagamentos necessários à execução do objeto da CLÁUSULA
              PRIMEIRA junto aos órgãos oficiais deverão ser suportados pela
              CONTRATANTE e, caso a CONTRATADA ou PARCEIRO realize o respectivo
              pagamento, deverá ser reembolsada mediante apresentação de
              comprovante.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>
                DAS OBRIGAÇÕES DA CONTRATADA E PARCEIROS
              </Text>
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA SEXTA</Text> – A CONTRATADA
              e PARCEIRO(s), comprometem-se a executar o(s) serviço(s) objeto(s)
              DA CLÁUSULA PRIMEIRA em observância à ética profissional e a moral
              pública, responsabilizando-se pela respectiva execução, pelos
              prazos de conclusão estipulados e diligência(s) presencial(is)
              e/ou virtual(is) de sua responsabilidade necessária(s) às demandas
              de interesse da CONTRATANTE para o integral cumprimento do(s)
              objeto(s) deste instrumento.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo único. A CONTRATADA e PARCEIRO(s) se obrigam a entregar
              ao CONTRATANTE, mediante protocolo, em tempo hábil, os Balancetes,
              o Balanço Patrimonial e as demais demonstrações contábeis,
              documentos necessários para que este efetue os devidos pagamentos
              e recolhimentos obrigatórios, bem como comprovante de entrega das
              obrigações acessórias.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA SÉTIMA</Text> – A
              CONTRATADA e PARCEIRO(s) comprometem-se a manter o absoluto sigilo
              fiscal, bancário, financeiro e de informações sobre operações,
              dados, pormenores, informações, documentos, dados, metadados, etc.
              solicitados e entregues pela CONTRATANTE, não eximindo-se de
              manter as mesmas obrigações após a extinção do presente
              instrumento, reservando-se de manter sob sua guarda somente
              documentos indispensáveis à fiscalização dos órgãos públicos e de
              classes profissionais pelo prazo máximo 5 (cinco) anos,
              observando-se a CLÁUSULA DÉCIMA QUARTA.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA OITAVA</Text> – A
              CONTRATADA e PARCEIRO(s) manterão a CONTRATANTE constantemente
              atualizada do andamento da execução dos serviços, do cumprimento
              dos prazos e da conclusão de tarefas.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA NONA</Text> – A CONTRATADA
              fornecerá histórico dos pagamentos realizados pela CONTRATANTE,
              quando solicitado, de acordo com os valores estipulados no
              presente instrumento e aditivos.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>
                DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO
              </Text>
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA DÉCIMA</Text> – A título de
              remuneração, a CONTRATANTE pagará à CONTRATADA a(s) quantia(s) e
              na(s) forma(s) que segue(m):
            </Text>
          </View>
        </View>

        {getContractServicesDetails(customer?.services)}

        <View style={styles.contract}>
          <View>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo primeiro. O CONTRATANTE concorda que, os valores da
              mensalidade contábil, na forma estabelecida nesta cláusula, são
              precificados conforme sua faixa de faturamento mensal, aos quais
              sofrerão ajustes conforme haja alteração, que será informada
              mediante notificação.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo segundo. As condições e valores de pagamento(s) do(s)
              serviço(s) objeto(s) do presente instrumento são conforme
              estipulado no caput e no parágrafo anterior, aos quais sofrerão
              reajustes anuais, no mês de Janeiro, previamente informados por
              notificação, com antecedência mínima de 30 (trinta) dias.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo terceiro. No mês de dezembro de cada ano, será cobrado
              adicionalmente o equivalente a 01(um) mensalidade contábil,
              intitulada de “taxa de balanço”, em conformidade com a Resolução
              nº 987/2003 do Conselho Federal de Contabilidade - CFC, que poderá
              ser parcelada a pedido, antecipadamente, em até 02 (duas) parcelas
              (Novembro e Dezembro), a ser pago no mesmo dia da mensalidade
              corrente daquele mês, por conta do Encerramento do Balanço
              Patrimonial e demais obrigações anuais próprias do período final
              do ano-exercício fiscal.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo quarto. As respectivas remunerações, deverão ser
              realizadas mediante uma das formas de pagamento abaixo, todas de
              titularidade da FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA:
            </Text>
          </View>
        </View>
        <View style={styles.items}>
          <View style={styles.itemRow}>
            <Text style={styles.body2}></Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.body2}>
              <Text style={styles.boldText}>Boleto Bancário</Text>{" "}
              (recomendado): enviado automaticamente no e-mail informado pela
              CONTRATANTE neste contrato.
            </Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.body2}>
              <Text style={styles.boldText}>Chave PIX CNPJ</Text>:
              50.675.326/0001-97
            </Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.body2}>
              <Text style={styles.boldText}>Transferência Bancária</Text>: Banco
              403 - CORA SDC – AGENCIA: 0001; C/C: 4177549-8
            </Text>
          </View>
        </View>
        <View style={styles.contract}>
          <View>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo quinto. A realização do pagamento com acréscimo de multa
              e juros legais após a data de vencimento é de total
              responsabilidade da CONTRATANTE, assim como a verificação,
              confirmação e comprovação do título de pagamento, cujo não
              recebimento deve ser informado à CONTRATADA com antecedência
              mínima de 2 (dois) dias, anterior ao seu vencimento.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo sexto. Não importará em novação, o eventual recebimento
              de qualquer valor após o seu vencimento o que poderá se dar por
              mera liberalidade do CONTRATADO, contudo, neste caso, poderá
              incidir multa de 2% sobre a valor a receber com atraso, além de
              juros legais de 1%, pro rata die, ao mês.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo sétimo. O CONTRATADO isenta-se de toda e qualquer
              responsabilidade pelo não envio de lembretes de pagamento,
              notificações, ou qualquer informação fornecida com a mesma
              finalidade de pré-aviso de pagamento, cuja realização se dará por
              mera liberalidade do CONTRATADO.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo oitavo. A execução de serviço(s) extraordinário(s)
              somente será realizada mediante termo aditivo ao presente
              instrumento, conforme negociação entre as PARTES.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>
                DO DESCUMPRIMENTO, DA RESCISÃO E DO TERMO ADITIVO
              </Text>
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA DÉCIMA PRIMEIRA</Text> – O
              descumprimento de qualquer das cláusulas do presente instrumento
              por qualquer das PARTES implicará na rescisão imediata deste
              instrumento, isentandose a CONTRATADA e PARCEIROS da não
              continuidade dos serviços objeto, que será transferida para o novo
              parceiro indicado pela CONTRATANTE no ato da rescisão, não
              desobrigando a CONTRATADA e PARCEIRO(s) do cumprimento integral da
              CLÁUSULA SÉTIMA.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo primeiro - O presente instrumento, em comum acordo,
              poderá ser alterado mediante termo aditivo competente, salvo
              parágrafo quarto da cláusula terceira.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo segundo. O presente instrumento poderá ser rescindindo,
              em comum acordo entre as PARTES ou unilateralmente, a qualquer
              tempo, mediante comunicação por escrito à outra parte, com
              antecedência mínima de 30 (trinta) dias, sem que caiba qualquer
              direito de indenização na hipótese de uma das partes: (i) entrar
              em liquidação judicial ou extrajudicial, tiver requerido a
              falência ou requerer concordata; ou (ii) não infringir qualquer
              cláusula deste contrato; ou (iii) da não renovação deste
              instrumento.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo terceiro. Passados 60 (sessenta) dias da inadimplência
              do CONTRATANTE, o presente instrumento poderá ser rescindido
              unilateralmente pela CONTRATADA sem que caiba qualquer direito de
              indenização à CONTRATANTE e, não a eximindo do pagamento de juros
              legais de 1% ao mês e multa contratual de 10% do saldo devedor do
              contrato, e do vencimento antecipado das parcelas vincendas,
              podendo o presente instrumento ser executado por via judicial.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo quarto. Da rescisão, suspensão ou extinção do presente
              instrumento, em qualquer caso e por qualquer motivo, e obedecido
              os prazos legais, desobriga plena, irrestrita e irrevogável a
              CONTRATADA e PARCEIRO(s), da continuidade da execução dos
              serviços, não se responsabilizando por qualquer prejuízo que a
              suspensão ou interrupção da execução do serviço venha a causar.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo quinto. A CONTRATADA e PARCEIRO(s), obriga-se a
              entregar, quando da rescisão do presente instrumento, os
              documentos, Livros Contábeis e Fiscais e/ou arquivos eletrônicos
              ao CONTRATANTE ou a outro profissional da Contabilidade por ele(a)
              indicado(a).
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo sexto. O rompimento do vínculo contratual mediante
              rescisão, por qualquer motivo, desobriga CONTRATADO e PARCEIROS do
              prosseguimento das atividades, cessando integralmente suas
              responsabilidades onde, dentro do prazo estipulados nesta
              cláusula, o CONTRATANTE deverá indicar seu novo parceiro contábil
              para transferência no mesmo período, não isentando-se do pagamento
              dos honorários contábeis à CONTRATADA pelo fechamento deste
              período.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA DÉCIMA SEGUNDA</Text> –
              Quando da rescisão, o CONTRATANTE obriga-se a indicar novo
              parceiro contábil dentre os prazos estabelecidos na cláusula
              anterior, isentando-se total e irrestrita a CONTRATADA e
              PARCEIRO(s) de quaisquer responsabilidades cíveis, administrativas
              e penais causadas pela sua inação.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>
                DO DESCUMPRIMENTO, DA RESCISÃO E DO TERMO ADITIVO
              </Text>
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA DÉCIMA TERCEIRA</Text> –
              Por tratar-se de instrumento de contrato de prestação de serviços,
              sem compromissos de pessoalidade e subordinação, não há qualquer
              vínculo empregatício entre as PARTES, e entre as PARTES e
              PARCEIRO(s), não gerando, assim, obrigações trabalhistas ou
              previdenciárias.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA DÉCIMA QUARTA</Text> –
              Considerando a Lei Geral de Proteção de Dados - LGPD, a CONTRATADA
              e PARCEIRO(s) se obrigam na observância e no cumprimento das
              regras quanto a proteção de dados, inclusive no tratamento de
              dados pessoais e sensíveis, de acordo com a necessidade e/ou
              obrigação legal de coleta dos dados.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo primeiro. A CONTRATADA e PARCEIRO(s) executará os
              trabalhos a partir das premissas da LGPD, em especial os
              princípios da finalidade, adequação, transparência, livre acesso,
              segurança, prevenção e não discriminação no tratamento dos dados.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo segundo. Os documentos, arquivos, dados, metadados,
              informações, etc. entregues pelo CONTRATANTE serão mantidos sob
              sigilo, com integridade e segurança, estritamente pelo tempo
              necessário ao cumprimento integral dos objetos deste contrato.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo terceiro. Com a extinção do presente instrumento, os
              documentos, arquivos, dados, metadados, informações, etc. acima
              citados serão destruídos, salvo aqueles que forem necessários para
              cumprimento de obrigação legal, na forma do Artigo 16, inciso I,
              da Lei Federal nº 13.709 de 2018.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA DÉCIMA QUINTA</Text> –
              Quaisquer notificações, lembretes ou outra forma de comunicação
              entre as PARTES poderá ocorrer por meio de qualquer dos canais de
              comunicação, inclusive e principalmente pelos meios eletrônicos,
              como o App WhatsApp, informados pela CONTRATANTE, cuja data e hora
              da leitura, confirmação e/ou qualquer tipo de verificação será a
              do início da contagem do prazo de prescrição, se houver.
            </Text>

            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>
                DA VALIDADE DA ASSINATURA ELETRÔNICA
              </Text>
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA DÉCIMA SEXTA</Text> – As
              PARTES conferem anuência para que este instrumento de contrato,
              notificações e/ou documentos possam ser celebrados por meio de
              assinaturas eletrônicas ou digitais, nos termos do Artigo 10, da
              Medida Provisória nº 2.200-0, de 24 de agosto de 2001, inclusive
              em casos de certificados não emitidos pela ICP-Brasil.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Parágrafo primeiro. O presente instrumento, notificações e
              documentos poderão ser assinados pelas PARTES inclusive via
              plataformas públicas e privadas de assinatura eletrônica e
              digital, desde que a mesma esteja em estrita observância do
              estipulado em Lei que garantam validade jurídica.
            </Text>
            <Text
              style={[styles.body2, styles.contractText, styles.underlineText]}
            >
              Parágrafo segundo. As PARTES{" "}
              <Text style={styles.boldText}>RENUNCIAM</Text> à possibilidade de
              exigir a troca, envio ou entrega das vias originais (não
              eletrônicas) assinadas do presente instrumento, notificações e/ou
              documentos, bem como, ao assinarem por meio de assinaturas
              eletrônicas ou digitais, declaram a sua integralidade,
              autenticidade, validade, executividade e regularidade.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>DA VIGÊNCIA E DA RENOVAÇÃO</Text>
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA DÉCIMA SÉTIMA</Text> – O
              presente instrumento de contrato vigerá pelo período de 1 (um)
              ano, com início em {customer?.contractStartDate} e será renovado
              automaticamente pelo mesmo período nos anos subsequentes, salvo
              notificação de qualquer das PARTES com, no mínimo, 30 (trinta)
              dias corridos de antecedência.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>DOS CASOS OMISSOS E DO FORO</Text>
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>CLÁUSULA DÉCIMA OITAVA</Text> – Os
              casos omissos serão saneados, preferencialmente, entre as PARTES,
              buscando-se a resolução extra judicial, elegendo o Foro da comarca
              de Poá, Estado de São Paulo como único competente para cujo
              saneamento extrajudicial não for possível, com renúncia expressa a
              qualquer outro, por mais privilegiado que seja.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              E, por assim estarem de acordo, as partes firmam o presente
              instrumento de contrato de prestação de serviços, em 02 (duas)
              vias de igual teor e forma, na presença das testemunhas abaixo
              assinadas, para que produza seus devidos efeitos legais.
            </Text>
          </View>
        </View>
        <View style={styles.contractDate}>
          <Text style={styles.body2}>
            Poá (SP), {today.getDate()} de{" "}
            {today.toLocaleString("default", { month: "long" })} de{" "}
            {today.getFullYear()}.
          </Text>
        </View>
        <View style={styles.signature} wrap={false}>
          <Text style={[styles.body2, styles.centeredText]}>
            ________________________________________________________________
          </Text>
          <Text style={[styles.body2, styles.centeredText, styles.boldText]}>
            FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA
          </Text>
          <Text style={[styles.body2, styles.centeredText, styles.boldText]}>
            CNPJ nº 50.675.326/0001-97
          </Text>
          <Text style={[styles.body2, styles.centeredText]}>
            FLÁVIA ALMEIDA DA SILVA
          </Text>
          <Text style={[styles.body2, styles.centeredText]}>
            Sócio administrador
          </Text>
        </View>

        {isBusiness &&
          partners?.map((partner, index) => {
            return (
              <View style={styles.signature} wrap={false} key={index}>
                <Text style={[styles.body2, styles.centeredText]}>
                  ________________________________________________________________
                </Text>
                <Text
                  style={[styles.body2, styles.centeredText, styles.boldText]}
                >
                  {partner?.name}
                </Text>
                <Text
                  style={[styles.body2, styles.centeredText, styles.boldText]}
                >
                  <strong>CPF n° {maskDocument(partner?.document)}</strong>
                </Text>
              </View>
            );
          })}
        {!isBusiness && (
          <View style={styles.signature} wrap={false}>
            <Text style={[styles.body2, styles.centeredText]}>
              ________________________________________________________________
            </Text>
            <Text style={[styles.body2, styles.centeredText, styles.boldText]}>
              {customer?.name}
            </Text>
            <Text style={[styles.body2, styles.centeredText, styles.boldText]}>
              CPF n° {maskDocument(customer?.document)}
            </Text>
          </View>
        )}
        {renderFooter()}
      </Page>
      <Page size="A4" style={styles.page} wrap={true}>
        {renderHeader()}
        <View style={styles.contractTitle}>
          <Text style={styles.body3}>TERMO DE RESPONSABILIDADE CONTÁBIL</Text>
          <Text style={styles.body3}>
            CONTRATO VINCULADO Nº {contractNumber}-001
          </Text>
        </View>
        <View style={styles.contract}>
          <View>
            <Text style={[styles.body2, styles.contractText]}>
              Pelo presente instrumento de Termo de Responsabilidade Contábil:
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>
                SUPORHTE CONSULTORIA EMPRESARIAL LTDA
              </Text>
              , com sede na cidade de Maringá, Estado do Paraná, na Rua Neo
              Alves martins, nº 903, Sala 03, bairro Zona 03, CEP 87.050-110,
              inscrito sob o CNPJ nº 13.925.866/0001-55, e-mail
              marceloneto@suporhte.com.br, neste ato representada na forma do
              seu contrato social, na qualidade de PARCEIRO representando os
              interesses da{" "}
              <Text style={styles.boldText}>
                FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA
              </Text>
              , inscrita no CNPJ nº 50.675.326/0001-97;
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              ME COMPROMETO, a elaborar a Contabilidade de acordo com as Normas
              Brasileiras de Contabilidade, executando atividades na forma e
              limites discriminados abaixo e, em obediência irrestrita,
              irretratável e imprescritível das cláusulas estipuladas no
              CONTRATO DE PRESTAÇÃO DE SERVIÇOS VINCULADO, considerado vinculado
              para todos os efeitos legais, quanto à prestação dos serviços do
              Título – DO OBJETO E DO PRAZO, mais especificadamente na CLÁUSULA
              1ª e seguintes, firmado entre:
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              <Text style={styles.boldText}>Marisa Siqueira do Nascimento</Text>
              , com sede na cidade de Maringá, Estado do Paraná, na Rua Neo
              brasileira, , inscrito no CPF sob o nº 139.257.458-74 e{" "}
              <Text style={styles.boldText}>
                FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA
              </Text>
              , inscrita no CNPJ nº 50.675.326/0001-97, denominadas PARTES,
              devidamente qualificadas no contrato vinculado.
            </Text>

            {isBusiness &&
              customer?.partners?.map((partner, index, array) => {
                return (
                  <Text style={[styles.body2, styles.contractText]} key={index}>
                    <Text style={styles.boldText}>{partner?.name}</Text>,{" "}
                    {partner?.nationality},{" "}
                    {translateMaritalStatus(
                      partner?.maritalStatus,
                      partner?.gender
                    )}
                    , inscrito no CPF sob o nº {maskDocument(partner?.document)}
                    {index < array.length - 1 ? "," : " e"} e{" "}
                    <Text style={styles.boldText}>
                      FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA
                    </Text>
                    , inscrita no CNPJ nº 50.675.326/0001-97, denominadas
                    PARTES, devidamente qualificadas no contrato vinculado.
                  </Text>
                );
              })}

            {!isBusiness && (
              <Text style={[styles.body2, styles.contractText]}>
                <Text style={styles.boldText}>{customer?.name}</Text>,{" "}
                {customer?.nationality}, inscrito no CPF sob o nº{" "}
                {maskDocument(customer?.document)} e{" "}
                <Text style={styles.boldText}>
                  FJP CONSULTORIA TRIBUTÁRIA E EMPRESARIAL LTDA
                </Text>
                , inscrita no CNPJ nº 50.675.326/0001-97, denominadas PARTES,
                devidamente qualificadas no contrato vinculado.
              </Text>
            )}
            <Text style={[styles.body2, styles.contractText]}>
              Cláusula primeira. Descrição das atividades a serem executadas:
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                <Text style={styles.boldText}>1. Escrituração Contábil.</Text>
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                1.1 - Classificação da contabilidade de acordo com normas e
                princípios contábeis vigentes;
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                1.2 - Emissão de Balancetes;
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                1.3 - Elaboração de Balanço anual e Demonstrativo de Resultado.
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                <Text style={styles.boldText}>2. Escrituração Fiscal.</Text>
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                2.1 - Orientação e controle de aplicação dos dispositivos legais
                vigentes, sejam Federais, Estaduais ou Municipais;
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                2.2 - Escrituração dos Registros Fiscais de todos Livros
                obrigatórios perante o Governo Estadual do respectivo domicílio
                fiscal, bem como, as obrigações que se fizerem necessárias;
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                2.3 - Escriturações do Registro Fiscal de ISSQN, bem como, as
                que se fizerem necessárias;
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                2.4 - Escriturações do Registro Fiscal de IPI, bem como, as que
                se fizerem necessárias;
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                2.5 - Atendimento das demais exigências previstas na Legislação,
                bem como, de eventuais procedimentos fiscais.
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                <Text style={styles.boldText}>3. Impostos Federais.</Text>
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                3.1 - Orientação e controle de aplicação dos dispositivos legais
                vigentes;
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                3.2 - Guias de todos os impostos;
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                3.3 - Elaboração da DCTF;
              </Text>
            </Text>
            <Text style={[styles.body2, { padding: "4px 32px" }]}>
              <Text style={[styles.body2, styles.contractText]}>
                3.4 - Atendimento das demais exigências previstas na Legislação,
                bem como, de eventuais procedimentos fiscais.
              </Text>
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Cláusula segunda. O PARCEIRO assume inteira responsabilidade pelos
              serviços técnicos a que se obrigou, assim como pelas orientações
              que prestar às PARTES.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Cláusula terceira. O presente termo de responsabilidade contábil é
              celebrado por prazo indeterminado, podendo ser rescindido, a
              qualquer tempo, mediante os termos do contrato vinculado.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Cláusula quarta. As despesas decorrentes da execução dos serviços
              discriminados neste termo, são de exclusiva responsabilidade do
              PARCEIRO.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Cláusula quinta. Não há qualquer vínculo empregatício do PARCEIRO
              com as PARTES, seus empregados ou prepostos.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              Cláusula sexta. A vigência do presente TERMO DE RESPONSABILIDADE
              CONTÁBIL é a mesma do contrato vinculado, assim como sua extinção.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              DECLARO plena ciência e concordância dos termos do contrato
              vinculado entre as PARTES, aos quais também me vínculo.
            </Text>
            <Text style={[styles.body2, styles.contractText]}>
              E por ser a expressão verdade, firmo o presente, para que surta os
              legais e jurídicos efeitos, sob pena das cominações previstas em
              lei.
            </Text>
            <View style={styles.contractDate}>
              <Text style={styles.body2}>
                Mesmo local e data do contrato vinculado
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.signatureAdicional} wrap={false}>
          <Text style={[styles.body2, styles.centeredText]}>
            ________________________________________________________________
          </Text>

          <Text style={[styles.body2, styles.centeredText, styles.boldText]}>
            SUPORHTE CONSULTORIA EMPRESARIAL LTDA
          </Text>
          <Text style={[styles.body2, styles.centeredText, styles.boldText]}>
            CNPJ nº 13.925.866/0001-55
          </Text>
        </View>
        {renderFooter()}
      </Page>
    </Document>
  );
};
