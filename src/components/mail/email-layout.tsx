import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Tailwind,
  Preview,
} from "@react-email/components";
import * as React from "react";

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rammys-radiance.com";

export default function EmailLayout({ children, previewText }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[600px]">
            
            {/* Header */}
            <Section className="mt-[32px] mb-[32px] text-center">
              <Img
                src={`https://i.ibb.co/5xBq7stv/logo-jpg.png`}
                width="160"
                height="48"
                alt="Rammy's Radiance"
                className="my-0 mx-auto object-contain"
              />
            </Section>

            {/* Main Content */}
            <Section className="bg-[#f9f9f9] p-[32px] rounded-lg">
              {children}
            </Section>

            {/* Footer */}
            <Section className="mt-[32px] border-t border-solid border-[#eaeaea] pt-[32px]">
              <Text className="text-[#666666] text-[12px] leading-[24px] text-center mb-0 uppercase tracking-widest font-bold">
                Rammy's Radiance
              </Text>
              <Text className="text-[#999999] text-[11px] leading-[20px] text-center mt-2">
                123 Skincare Ave, Glow City, GL 10024 <br />
                © {new Date().getFullYear()} Rammy's Radiance. All rights reserved.
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
