import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface ValidateEmailProps {
  username: string;
  accessLink: string;
}

export const ValidateEmail = ({
  username,
  accessLink,
}: ValidateEmailProps) => {
  const previewText = `Acesse sua conta na Neo`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src={`https://github.com/manassesCahunda/neo/blob/main/Icon%2064splash.png`}
                width="40"
                height="37"
                alt="Neo"
                className="my-0 mx-auto"
              />
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Acesso à Sua Conta
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Olá {username},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Estamos felizes em tê-lo de volta! Para acessar sua conta, clique no botão abaixo:
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={accessLink}
              >
                Acessar Conta
              </Button>
            </Section>
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Este e-mail foi enviado para <span className="text-black">{username}</span>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

