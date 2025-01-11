import * as React from 'react';

import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface FileUploadConfirmationEmailProps {
  status: "success" | "error";
  errorMessage?: string;
  user: string;
  company: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const FileUploadConfirmationEmail = ({
  status,
  errorMessage,
  user,
  company
}: FileUploadConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {status === "success"
        ? `Envio de arquivo concluído com sucesso!`
        : `Erro no envio do arquivo`}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Row>
            <Column style={headerContent}>
              <Heading style={headerContentTitle}>
                {status === "success"
                  ? `Olá, ${user}! Arquivo Enviado com Sucesso!`
                  : `Olá, ${user}! Erro no Envio do Arquivo`}
              </Heading>
              <Text style={headerContentSubtitle}>
                {status === "success"
                  ? `O arquivo foi enviado com sucesso para a empresa ${company} e está sendo processado. Ele será contado pela empresa em breve.`
                  : `O envio do arquivo para a empresa ${company} falhou. O erro foi: ${errorMessage}. Por favor, tente novamente.`}
              </Text>
            </Column>
          </Row>
        </Section>

        <Section style={content}>
          <Heading as="h2" style={title}>
            {status === "success" ? "O que acontece agora?" : "O que fazer em caso de erro?"}
          </Heading>
          <Text style={paragraph}>
            {status === "success"
              ? `Seu arquivo está sendo processado e será considerado pela empresa ${company} em breve. Você será notificado quando o processo estiver concluído.`
              : `Por favor, verifique a conexão e tente reenviar o arquivo. Se o problema persistir, entre em contato com o suporte para assistência.`}
          </Text>

          <Hr style={divider} />

          <Heading as="h2" style={title}>
            {status === "success" ? "Agradecemos pela sua contribuição!" : "Precisa de ajuda?"}
          </Heading>
          <Text style={paragraph}>
            {status === "success"
              ? `Sua contribuição para a empresa ${company} é importante para nós, e sua paciência durante o processamento do arquivo é muito apreciada.`
              : `Se você continuar enfrentando problemas, não hesite em entrar em contato com nossa equipe de suporte técnico.`}
          </Text>

          <Section style={buttonContainer}>
            <Link style={button} href={status === "success" ? "/dashboard" : "/suporte"}>
              {status === "success" ? "Acessar meu painel" : "Falar com o suporte"}
            </Link>
          </Section>
        </Section>
      </Container>

      <Section style={footer}>
        <Text style={footerText}>
          Você está recebendo este email porque seu envio de arquivo foi processado pela plataforma da empresa {company}.
        </Text>

        <Link href="/" style={footerLink}>
          Desinscrever-se de e-mails como este{" "}
        </Link>
        <Link href="/" style={footerLink}>
          Editar configurações de email{" "}
        </Link>
        <Link href="/" style={footerLink}>
          Contate-nos
        </Link>
        <Link href="/" style={footerLink}>
          Política de privacidade
        </Link>

        <Hr style={footerDivider} />

        <Text style={footerAddress}>
          <strong>{company}</strong>, Endereço da empresa, Cidade, País
        </Text>
        <Text style={footerHeart}>{"<3"}</Text>
        <Text style={footerAddress}>
          Produto de Neo
        </Text>
      </Section>
    </Body>
  </Html>
);

export default FileUploadConfirmationEmail;

const main = {
  backgroundColor: "#ffffff", // fundo branco
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const headerContent = { padding: "20px 30px 15px" };

const headerContentTitle = {
  color: "#000", // texto preto
  fontSize: "27px",
  fontWeight: "bold",
  lineHeight: "27px",
};

const headerContentSubtitle = {
  color: "#000", 
  fontSize: "17px",
};

const title = {
  margin: "0 0 15px",
  fontWeight: "bold",
  fontSize: "21px",
  lineHeight: "21px",
  color: "#000",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "21px",
  color: "#000", 
};

const divider = {
  margin: "30px 0",
  borderColor: "#000",
};

const container = {
  width: "680px",
  maxWidth: "100%",
  margin: "0 auto",
  backgroundColor: "#ffffff", 
};

const footer = {
  width: "680px",
  maxWidth: "100%",
  margin: "32px auto 0 auto",
  padding: "0 30px",
};

const content = {
  padding: "30px 30px 40px 30px",
};

const header = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#ffffff", 
};

const buttonContainer = {
  marginTop: "24px",
  display: "block",
};

const button = {
  backgroundColor: "#000", 
  border: "1px solid #000", 
  fontSize: "17px",
  lineHeight: "17px",
  padding: "13px 17px",
  borderRadius: "4px", 
  maxWidth: "120px",
  color: "#fff", 
};

const footerDivider = {
  ...divider,
  borderColor: "#000",
};

const footerText = {
  fontSize: "12px",
  lineHeight: "15px",
  color: "#000", 
  margin: "0",
};

const footerLink = {
  display: "inline-block",
  color: "#000", 
  textDecoration: "underline",
  fontSize: "12px",
  marginRight: "10px",
  marginBottom: "0",
  marginTop: "8px",
};

const footerAddress = {
  margin: "4px 0",
  fontSize: "12px",
  lineHeight: "15px",
  color: "#000",
};

const footerHeart = {
  borderRadius: "1px",
  border: "1px solid #000", 
  padding: "4px 6px 3px 6px",
  fontSize: "11px",
  lineHeight: "11px",
  fontFamily: "Consolas,monospace",
  color: "#000",
  maxWidth: "min-content",
  margin: "0 0 32px 0",
};
