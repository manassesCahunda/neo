import * as React from 'react';

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface OrganizationInviteEmailProps {
  username?: string;
  organizationName?: string;
  inviteLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const OrganizationInviteEmail = ({
  username,
  organizationName,
  inviteLink,
}: OrganizationInviteEmailProps) => {
  const previewText = `Junte-se ao time ${organizationName} no Neo smart business`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Junte-se à <strong>{organizationName}</strong> no <strong>Neo Smart Business</strong>
              </Heading>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Olá {username},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Você foi convidado para fazer parte da organização <strong>{organizationName}</strong>.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                href={inviteLink}
              >
                Juntar-se à organização
              </Button>
            </Section>
               <Text className="text-black text-[14px] leading-[24px]">
                 ou copie e cole este link no seu navegador:{" "}
              </Text>
 
            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Este convite foi destinado para{" "}
              <span className="text-black">{username}</span>. Se você não esperava este convite, você pode ignorar este e-mail. Se
              você está preocupado com a segurança da sua conta, por favor, responda a este e-mail para entrar em contato conosco.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

OrganizationInviteEmail.PreviewProps = {
  username: "alanmoura",
  organizationName: "TechBr",
  inviteLink: "https://vercel.com/teams/invite/abc123",
} as OrganizationInviteEmailProps;

export default OrganizationInviteEmail;
