import * as React from "react";
import { Text, Heading, Section } from "@react-email/components";
import EmailLayout from "./email-layout";

interface OtpEmailProps {
  name: string;
  otp: string;
}

export default function OtpEmail({ name, otp }: OtpEmailProps) {
  return (
    <EmailLayout previewText="Your verification code">
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        Verify your email address
      </Heading>
      <Text className="text-black text-[14px] leading-[24px]">
        Hello {name},
      </Text>
      <Text className="text-black text-[14px] leading-[24px]">
        Here is your verification code to continue creating your account at Rammy's Radiance.
      </Text>
      
      <Section className="text-center mt-[32px] mb-[32px]">
        <div className="bg-[#f0f0f0] rounded-md inline-block py-[16px] px-[32px]">
          <Text className="text-black text-[32px] font-bold tracking-[6px] m-0">
            {otp}
          </Text>
        </div>
      </Section>
      
      <Text className="text-[#666666] text-[12px] leading-[24px]">
        This code will expire in 5 minutes. If you did not request this code, you can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}
