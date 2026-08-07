import * as React from "react";
import { Text, Heading, Button, Section, Hr, Row, Column } from "@react-email/components";
import EmailLayout from "./email-layout";

interface OrderConfirmationEmailProps {
  name: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  address: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rammys-radiance.com";

export default function OrderConfirmationEmail({
  name,
  orderId,
  items,
  totalAmount,
  address,
}: OrderConfirmationEmailProps) {
  return (
    <EmailLayout previewText="Your Order is Confirmed! 🎉">
      <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
        Your Order is Confirmed! 🎉
      </Heading>
      
      <Text className="text-black text-[14px] leading-[24px]">
        Hello {name},
      </Text>
      
      <Text className="text-black text-[14px] leading-[24px]">
        Thank you for shopping with Rammy's Radiance! Your order has been successfully received and is now being processed.
      </Text>

      <Section className="bg-[#f2f2f2] p-[16px] rounded my-[20px]">
        <Text className="text-black text-[14px] m-0 leading-[24px]">
          <strong>Order ID:</strong> {orderId}
        </Text>
        <Text className="text-black text-[14px] m-0 leading-[24px]">
          <strong>Delivery Address:</strong> {address}
        </Text>
      </Section>

      <Heading as="h3" className="text-black text-[18px] font-medium mt-[32px] mb-[16px]">
        Order Summary
      </Heading>

      <Section>
        <Row className="border-b border-solid border-[#eaeaea] pb-[8px] mb-[8px]">
          <Column className="w-[60%]">
            <Text className="text-[#666] text-[12px] font-bold uppercase tracking-wider m-0">Item</Text>
          </Column>
          <Column className="w-[20%] text-center">
            <Text className="text-[#666] text-[12px] font-bold uppercase tracking-wider m-0">Qty</Text>
          </Column>
          <Column className="w-[20%] text-right">
            <Text className="text-[#666] text-[12px] font-bold uppercase tracking-wider m-0">Price</Text>
          </Column>
        </Row>

        {items.map((item, index) => (
          <Row key={index} className="py-[8px]">
            <Column className="w-[60%]">
              <Text className="text-black text-[14px] m-0">{item.name}</Text>
            </Column>
            <Column className="w-[20%] text-center">
              <Text className="text-black text-[14px] m-0">{item.quantity}</Text>
            </Column>
            <Column className="w-[20%] text-right">
              <Text className="text-black text-[14px] m-0">₵{item.price.toLocaleString()}</Text>
            </Column>
          </Row>
        ))}
      </Section>

      <Hr className="border border-solid border-[#eaeaea] my-[20px] mx-0 w-full" />

      <Section className="text-right">
        <Text className="text-black text-[16px] font-bold m-0">
          Total: ₵{totalAmount.toLocaleString()}
        </Text>
      </Section>

      <Section className="text-center mt-[32px] mb-[32px]">
        <Button
          href={`${baseUrl}/admin/orders`}
          className="bg-black text-white px-[24px] py-[14px] rounded-none font-bold tracking-widest text-[12px] uppercase no-underline text-center inline-block"
        >
          View Order Status
        </Button>
      </Section>

      <Text className="text-[#666] text-[14px] leading-[24px]">
        You'll receive another update once your order is on its way. Thank you for choosing Rammy's Radiance!
      </Text>
    </EmailLayout>
  );
}
