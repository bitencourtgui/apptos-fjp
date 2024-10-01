import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const FJPWelcomeEmail = ({
  customerName,
  accessData,
}: {
  customerName: string;
  accessData: { username: string; password: string };
}) => (
  <Html>
    <Head />
    <Preview>Bem-vindo à FJP Consultoria Tributária e Empresarial!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`https://fjp.goduck.com.br/_next/image?url=%2Fassets%2Flogos%2Flogo-fjp.png&w=384&q=75`}
            width="384"
            height="75"
            alt="FJP Consultoria"
          />
          <Hr style={hr} />
          <Text style={paragraph}>
            Olá {customerName}, bem-vindo à FJP Consultoria Tributária e
            Empresarial!
          </Text>
          <Text style={paragraph}>
            Estamos felizes em tê-lo conosco. A partir de agora, você terá
            acesso a uma variedade de serviços e informações úteis para a sua
            empresa, diretamente em nossa plataforma.
          </Text>
          <Hr style={hr} />
          <Text style={paragraph}>
            Abaixo estão os dados de acesso à plataforma:
          </Text>
          <Text style={paragraph}>
            <strong>Usuário:</strong> {accessData.username}
            <br />
            <strong>Senha:</strong> {accessData.password}
          </Text>
          <Button style={button} href="https://fjp.goduck.com.br/auth">
            Acessar a Plataforma
          </Button>
          <Hr style={hr} />

          <Text style={paragraph}>— Equipe FJP Consultoria</Text>
          <Hr style={hr} />
          <Text style={footer}>
            FJP Consultoria Tributária e Empresarial - 50.675.326/0001-97
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default FJPWelcomeEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#556cd6",
};

const button = {
  backgroundColor: "#0056b3",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};
