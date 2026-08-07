import * as React from "react";
import { Text, Heading, Button, Section } from "@react-email/components";
import EmailLayout from "./email-layout";

interface WelcomeEmailProps {
  name: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rammys-radiance.com";

export default function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailLayout previewText="Welcome to Rammy's Radiance!">
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        Welcome to the Family
      </Heading>
      <Text className="text-black text-[14px] leading-[24px]">
        Hello {name},
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        We are absolutely thrilled to have you here. Your account has been successfully created, and you are now part of the Rammy's Radiance family.
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        Get ready to discover premium skincare crafted to make you glow from the inside out.
      </Text>
      
      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          href={`${baseUrl}/shop`}
          className="bg-black text-white px-[24px] py-[14px] rounded-none font-bold tracking-widest text-[12px] uppercase no-underline text-center inline-block"
        >
          Shop Now
        </Button>
      </Section>
      
      <Text className="text-black text-[14px] leading-[24px]">
        If you have any questions or need recommendations, just reply to this email. We're always here to help.
      </Text>
    </EmailLayout>
  );
}
