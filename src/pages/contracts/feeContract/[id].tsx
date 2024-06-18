/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useCallback, useEffect } from "react";
import { useMounted } from "../../../hooks/use-mounted";
import CustomersApi from "../../../api/customers";
import FinancialApi from "../../../api/financial";
import { numberInWords } from "../../../utils/number-in-words";
import { formatCurrency } from "../../../utils/masks/currencyMask";
import { maskDocument } from "../../../utils/masks/maskDocument";

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

  useEffect(
    () => {
      getCustomer();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return customer;
};

const useFinancial = (id: string) => {
  const isMounted = useMounted();
  const [financial, setFinancial] = useState(null);

  const getFinancial = useCallback(async () => {
    try {
      const response = await FinancialApi.getInvoices(id);

      if (isMounted()) {
        setFinancial(response.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  useEffect(() => {
    getFinancial();
  }, []);

  return financial;
};

const FeeContract = () => {
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
  const [queryParams, setQueryParams] = useState<string>();

  const customer = useCustomer(customerId);
  const financial = useFinancial(customerId);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const frequencyParam = urlParams.get("frequency");

    if (frequencyParam) {
      setQueryParams(frequencyParam);
    } else {
      console.error("Frequency parameter não encontrado na URL");
    }
  }, []); // Este efeito será executado apenas uma vez após a montagem do componente

  const textPayment =
    ", a ser depositada no PIX: 47.956.830/0001-50, Banco: 0260 - Nu Pagamentos S.A. - Instituição de Pagamento, Agência: 0001 e Conta Corrente: 13814965-0";

  function generatePaymentQuestion(paymentData) {
    let questionText = "";

    paymentData?.payments?.forEach((payment, index) => {
      const installmentsNumber = payment.installments.length - 1;
      const userData = payment.installments[installmentsNumber];
      const dueDate = payment.installments[0].dueDate;
      const monthlyPayment = userData?.installmentValue;
      const hasDownPayment = userData.installmentDownPayment > 0;

      const typeCorrect = userData.frequency === queryParams;

      const totalDownPayment =
        userData.installmentTotal + parseFloat(userData.installmentDownPayment);

      const totalValue = hasDownPayment
        ? totalDownPayment
        : userData.installmentTotal;

      if (
        payment.installments.length === 1 &&
        typeCorrect &&
        userData.frequency === "indetermined"
      ) {
        questionText += `<p><strong>${index + 1}. ${formatCurrency(
          totalValue
        )} (${numberInWords(
          totalValue
        )}) a título de pagamento à vista previsto para ${dueDate}${
          userData?.fees > 0
            ? ` e ${userData?.fees}% sobre a vantagem economica total que vier a ser alcançada em seu favor imediatamente após a distribuição da presente ação, que em juízo ou fora dele`
            : ""
        }</strong>${textPayment}</p>`;
      } else if (hasDownPayment && typeCorrect) {
        questionText += `<p><strong>${index + 1}. ${formatCurrency(
          totalValue
        )} (${numberInWords(totalValue)}), sendo ${formatCurrency(
          userData.installmentDownPayment
        )} (${numberInWords(
          userData.installmentDownPayment
        )}) a titulo de entrada com o pagamento previsto em  ${dueDate} e as demais com previsão de
            pagamento para todo dia ${
              userData.installmentsRecorrence
            } dos meses subsequentes${
          userData?.fees > 0
            ? ` e ${userData?.fees}% sobre a vantagem economica total que vier a ser alcançada em seu favor imediatamente após a distribuição da presente ação, que em juízo ou fora dele`
            : ""
        }</strong>${textPayment}</p>\n`;
      } else if (
        payment.installments.length > 1 &&
        !hasDownPayment &&
        typeCorrect &&
        userData.frequency === "indetermined"
      ) {
        questionText += `<p><strong>
${index + 1}. ${formatCurrency(totalValue)} (${numberInWords(
          totalValue
        )}), parcelado
            em ${userData.installmentNumber} (${numberInWords(
          userData.installmentNumber,
          false
        )}) vezes de 
            ${formatCurrency(monthlyPayment)} (${numberInWords(
          monthlyPayment
        )}) sendo a primeira com o
            pagamento previsto para dia ${
              userData.installmentsRecorrence
            } e as demais a previstas para todo
            dia ${dueDate} dos meses subsequentes</strong>${textPayment}</p>\n`;
      } else if (
        !hasDownPayment &&
        typeCorrect &&
        userData.frequency === "monthly"
      ) {
        questionText += `<p><strong>
${index + 1}. ${formatCurrency(monthlyPayment)} (${numberInWords(
          monthlyPayment
        )}) mensais, sendo a primeira com o
            pagamento previsto para dia ${dueDate} e as demais a previstas para todo
            dia ${
              userData.installmentsRecorrence
            } dos meses subsequentes</strong>${textPayment}</p>\n`;
      } else if (typeCorrect) {
        questionText += `<p><strong>
${index + 1}. ${formatCurrency(totalValue)} (${numberInWords(
          totalValue
        )}), parcelado
      em ${userData.installmentNumber} (${numberInWords(
          userData.installmentNumber,
          false
        )}) vezes de 
      ${formatCurrency(monthlyPayment)} (${numberInWords(
          monthlyPayment
        )}) sendo a primeira com o
      pagamento previsto para dia ${dueDate} e as demais a previstas para todo
      dia ${
        userData.installmentsRecorrence
      } dos meses subsequentes</strong>${textPayment}</p>\n`;
      }
    });
    return questionText;
  }

  function generateFrequencyText(paymentData) {
    let questionText = "";

    paymentData?.payments?.forEach((payment, index) => {
      const installmentsNumber = payment.installments.length - 1;
      const userData = payment.installments[installmentsNumber];
      const typeCorrect = userData.frequency === queryParams;

      if (userData.frequency === "indetermined" && typeCorrect) {
        questionText = `<p><strong>Cláusula Segunda</strong> - O presente contrato vigerá por tempo indeterminado, até que se cumpra o quanto determinado na Cláusula Primeira</p>\n`;
      } else if (userData.frequency === "monthly" && typeCorrect) {
        questionText = `<p><strong>Cláusula Segunda</strong> - O presente contrato vigerá por tempo determinado de ${numberInWords(
          userData.installmentNumber
        )} meses a partir da assinatura do contrato.</p>\n`;
      }
    });

    return questionText;
  }

  useEffect(() => {
    if (customer?.name) {
      document.title = `Contrato de honorários - ${customer?.name?.toUpperCase()}`;
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

  const PrintHeader: React.FC = () => {
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
                <p style={{ textAlign: "center" }}>
                  <strong>
                    CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS
                  </strong>
                </p>
                <p style={{ paddingLeft: "102pt" }}>
                  Pelo presente instrumento particular de contrato de prestação
                  de serviços, de um lado,{" "}
                  <strong>
                    FLÁVIA ALMEIDA SOCIEDADE INDIVIDUAL DE ADVOCACIA
                  </strong>
                  , CNPJ Nº: 47.956.830/0001-50 representada neste ato por{" "}
                  <strong>FLÁVIA ALMEIDA DA SILVA</strong>, brasileira,
                  solteira, advogada, inscrita na Ordem dos Advogados do Brasil,
                  Seccional de São Paulo sob Nº 467.877, com escritório
                  profissional situado na Rua Barão do Rio Branco, Nº 330,
                  apartamento 21, Vila Costa, Suzano - Estado de São Paulo, CEP:
                  08675-030 doravante denominada <strong>CONTRATADA</strong>, e{" "}
                  <strong>{customer?.name?.toUpperCase()}</strong>, pessoa
                  física, {customer?.nationality}, {registered} no CPF n°{" "}
                  {maskDocument(customer?.cpf)} e {holder} de cédula de
                  identidade Nº: {customer?.rg} residente e {residing} na{" "}
                  {customer?.street}, n° {customer?.number},{" "}
                  {customer?.complement ?? ""} - {customer?.neighborhood},{" "}
                  {customer?.city} - {customer?.state}, CEP:{" "}
                  {customer?.postalCode}, doravante denominada CONTRATANTE,
                  tendo justo e acertado o seguinte:
                </p>
                <p>
                  <strong>DO OBJETO</strong>
                </p>

                <p>
                  <strong>Cláusula Primeira</strong> - A contratada,
                  compromete-se, a realizar a prestação jurídica{" "}
                  {customer?.object}
                </p>

                <p
                  dangerouslySetInnerHTML={{
                    __html: financial && generateFrequencyText(financial),
                  }}
                />

                <p>
                  <strong>Parágrafo Primeiro</strong> - Desistindo as partes,
                  deverá as partes, por obrigação, cumprir com os valores
                  determinados para os demais pagamentos a títulos de honorários
                  advocatícios, afinal, o estudo e o trabalho para a demanda já
                  estão sendo prestados.
                </p>

                <p>
                  <strong>DAS OBRIGAÇÕES DA CONTRATANTE</strong>
                </p>

                <p>
                  <strong>Cláusula Terceira</strong> - A contratante
                  compromete-se a fornecer todos os elementos, informações,
                  documentos, relatórios etc., para o bom desempenho dos
                  serviços prestados pela contratada.
                </p>

                <p>
                  <strong>Parágrafo primeiro:</strong> A contratante deverá
                  efetuar o pagamento na forma e condições estabelecidas na
                  Cláusula Oitava.
                </p>

                <p>
                  <strong>Cláusula Quarta</strong> - O contratante
                  responsabiliza-se pela veracidade de todas as informações
                  prestadas, sob pena de descumprimento do presente contrato.
                </p>

                <p>
                  <strong>DAS OBRIGAÇÕES DA CONTRATADA</strong>
                </p>

                <p>
                  <strong>Cláusula Quinta</strong> - A contratada compromete-se
                  a prestar os serviços ora contratados com zelo, dedicação e
                  ética.
                </p>

                <p>
                  <strong>Cláusula Sexta</strong> - A contratada se obriga a
                  manter absoluto sigilo sobre as operações, dados, pormenores,
                  informações e documentos da contratante, mesmo após a
                  conclusão dos projetos e serviços ou do término da relação
                  contratual.
                </p>

                <p>
                  <strong>Cláusula Sétima</strong> - A contratada deverá
                  fornecer os respectivos documentos fiscais referentes aos
                  pagamentos do presente instrumento, se houver.
                </p>

                <p>
                  <strong>DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO</strong>
                </p>

                <p>
                  <strong>Cláusula Oitava</strong> - A título de remuneração dos
                  honorários advocatícios, o Contratante pagará à Contratada, a
                  quantia de:
                </p>
                <p
                  dangerouslySetInnerHTML={{
                    __html: financial && generatePaymentQuestion(financial),
                  }}
                />
                <p>
                  <strong>Parágrafo Primeiro:</strong> Ciente de que qualquer
                  que seja a forma de extinção contratual, não serão devolvidos
                  os valores já pagos, e não fica prejudicado o pagamento do
                  valor devido a título de honorários.
                </p>

                <p>
                  <strong>DO DESCUMPRIMENTO</strong>
                </p>

                <p>
                  <strong>Cláusula Nona</strong> - O descumprimento de qualquer
                  uma das cláusulas por
                </p>
                <p>
                  qualquer parte implicará na rescisão imediata deste contrato,
                  não isentando a CONTRATADA de suas responsabilidades
                  referentes ao zelo com informações e dados do CONTRATANTE.
                </p>

                <p>
                  <strong>Parágrafo primeiro:</strong> Caso haja atraso no
                  pagamento será cobrado multa de 5% sobre o valor total a
                  partir do segundo dia. A multa será cobrada em dias corridos.
                </p>

                <p>
                  <strong>DA RESCISÃO IMOTIVADA</strong>
                </p>

                <p>
                  <strong>Cláusula Décima:</strong> Poderá o presente
                  instrumento ser rescindido por qualquer das partes, em
                  qualquer momento, sem que haja qualquer tipo de motivo
                  relevante, respeitando-se um período mínimo de 30 (trinta)
                  dias (denominado período de encerramento do contrato), devendo
                  então somente ser finalizadas e pagas as etapas que já
                  estiverem em andamento.
                </p>

                <p>
                  <strong>DAS CONDIÇÕES GERAIS</strong>
                </p>

                <p>
                  <strong>Cláusula Décima Primeira</strong> - Em decorrência
                  deste contrato, não haverá qualquer vínculo empregatício entre
                  os contratantes, não gerando, assim, obrigações trabalhistas
                  ou previdenciárias.
                </p>

                <p>
                  <strong>Cláusula Décima Segunda</strong> - Fica ciente o
                  contratante que não existe garantia absoluta de resultado na
                  medida jurídica objeto deste instrumento, tendo em vista que o
                  serviço ora contratado é DE MEIO, não responsabilizando o
                  CONTRATADO pelo resultado que possa advir.
                </p>

                <p>
                  <strong>Cláusula Décima Terceira</strong> - Considerando a Lei
                  Geral de Proteção de Dados, a CONTRATADA se obriga na
                  observância e no cumprimento das regras quanto a proteção de
                  dados, inclusive no tratamento de dados pessoais e sensíveis,
                  de acordo com a necessidade e/ou obrigação legal de coleta dos
                  dados.
                </p>

                <p>
                  <strong>Parágrafo Primeiro</strong> - O CONTRATADO executará
                  os trabalhos a partir das premissas da LGPD, em especial os
                  princípios da finalidade, adequação, transparência, livre
                  acesso, segurança, prevenção e não discriminação no tratamento
                  dos dados.
                </p>

                <p>
                  <strong>Parágrafo Segundo</strong> - O CONTRATADO esclarece
                  que possui política interna para tratamento em caso de
                  vazamento de dados. Bem como, uma política de privacidade que
                  visa garantir a confidencialidade dos dados coletados e o
                  atendimento à finalidade do presente contrato.
                </p>

                <p>
                  <strong>Parágrafo Terceiro</strong> - Os dados serão mantidos
                  sob arquivo do CONTRATANTE estritamente pelo tempo necessário
                  para o cumprimento dos serviços objeto deste contrato. Após
                  concluído o presente contrato, os dados pessoais acima citados
                  serão destruídos, salvo aqueles que forem necessários para
                  cumprimento de obrigação legal, na forma do art. 16, I da Lei
                  n° 13.709/18.
                </p>

                <p>
                  <strong>DO FORO</strong>
                </p>

                <p>
                  <strong>Cláusula Décima Quarta</strong> - Para solução de
                  quaisquer dúvidas resultantes do presente contrato fica eleito
                  pelas partes o foro da Suzano - Estado de São Paulo, com
                  renúncia expressa de qualquer outro, por mais privilegiado que
                  seja.
                </p>

                <p>
                  E, por estarem justos e contratados, assinam o presente em 02
                  (duas) vias, na presença de duas testemunhas.
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
                    <p style={{ marginTop: 0 }}>__________________________</p>
                    <p>Contratante</p>
                  </div>

                  <div style={{ textAlign: "center", marginTop: 23.5 }}>
                    <img
                      width="199"
                      height="25"
                      src="data:image/jpg;base64,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"
                    />
                    <p style={{ marginTop: 0 }}>__________________________</p>
                    <p>Contratada</p>
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

export default FeeContract;
