import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface Props {
  otp?: string;
}
export const ValidateOpt = ({otp}:Props) => {
  return (
    <Html>
      <Head />
      <Preview>validação do codigo OTP</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={company}>neo</Text>
          <Heading style={codeTitle}>Seu código de autenticação</Heading>
          <Text style={codeDescription}>
            Insira-o na janela do navegador aberta .
            Este código tem um tempo de expiração muito curto
          </Text>
          <Section style={codeContainer}>
            <Heading style={codeStyle}>{otp}</Heading>
          </Section>
          <Text style={paragraph}>Não esperava este e-mail?</Text>
          <Text style={paragraph}>
            Contacto{" "}
            <Link href="mailto:enterprise6neo@gmail.com" style={link}>
               enterprise6neo@gmail.com
            </Link>{" "}
            se você não solicitou este código
          </Text>
        </Container>
      </Body>
    </Html>
  );
};


const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #ddd",
  borderRadius: "5px",
  marginTop: "20px",
  width: "480px",
  maxWidth: "100%",
  margin: "0 auto",
  padding: "12% 6%",
};

const company = {
  fontWeight: "bold",
  fontSize: "18px",
  textAlign: "center" as const,
};

const codeTitle = {
  textAlign: "center" as const,
};

const codeDescription = {
  textAlign: "center" as const,
};

const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
  maxWidth: "100%",
};

const codeStyle = {
  color: "#000",
  display: "inline-block",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
  letterSpacing: "8px",
};

const buttonContainer = {
  margin: "27px auto",
  width: "auto",
};

const button = {
  backgroundColor: "#5e6ad2",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  textAlign: "center" as const,
  padding: "12px 24px",
  margin: "0 auto",
};

const paragraph = {
  color: "#444",
  letterSpacing: "0",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
};

const link = {
  color: "#444",
  textDecoration: "underline",
};
