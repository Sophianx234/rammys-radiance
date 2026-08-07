import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Rammy's Radiance",
  description: "Read the terms and conditions that govern your use of the Rammy's Radiance website.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header Banner */}
      <div className="w-full bg-[#222222] py-24 px-6 border-b border-border/40">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-[32px] md:text-[52px] font-bold tracking-tight uppercase mb-4 text-white">
            Terms of Service
          </h1>
          <p className="text-[13px] tracking-widest uppercase text-white/60 max-w-lg">
            Last Updated: August 2026
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16 md:py-24">
        {/* Content Area with Custom Typography */}
        <article className="
            flex-1 max-w-none text-[#444] 
            [&>h2]:text-xl [&>h2]:md:text-2xl [&>h2]:font-bold [&>h2]:text-[#222222] [&>h2]:mt-16 [&>h2]:mb-6 [&>h2]:uppercase [&>h2]:tracking-wider [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-border/40
            [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-[#222222] [&>h3]:mt-8 [&>h3]:mb-4
            [&>p]:text-[15px] [&>p]:md:text-[16px] [&>p]:leading-loose [&>p]:mb-6
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul>li]:mb-3 [&>ul>li]:text-[15px] [&>ul>li]:leading-loose
            [&>strong]:text-[#222222] [&>strong]:font-bold
          ">
          
          <p>Welcome to <strong>Rammy's Radiance</strong>. These terms and conditions outline the rules and regulations for the use of our website and the purchase of our products.</p>
          <p>By accessing this website and purchasing our products, we assume you accept these terms and conditions. Do not continue to use Rammy's Radiance if you do not agree to take all of the terms and conditions stated on this page.</p>

          <h2>1. Introduction and General Terms</h2>
          <p>These terms of service govern your use of our website. By registering an account, placing an order, or browsing our site, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"). These Terms apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>

          <h2>2. Products and Pricing</h2>
          <p>All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time. Any offer for any product or service made on this site is void where prohibited.</p>
          <p>We have made every effort to display as accurately as possible the colors and images of our products that appear on the store. However, we cannot guarantee that your computer monitor's display of any color will be accurate.</p>

          <h2>3. Order Process and Delivery</h2>
          <ul>
            <li><strong>Order Acceptance:</strong> The receipt of an order number or an email order confirmation does not constitute the acceptance of an order or a confirmation of an offer to sell. We reserve the right, without prior notification, to limit the order quantity on any item and/or to refuse service to any customer.</li>
            <li><strong>Delivery Schedule:</strong> Please note that Rammy's Radiance dispatches all orders exclusively on <strong>Fridays</strong> to maintain strict quality control and batch freshness. By placing an order, you agree to this fulfillment schedule.</li>
            <li><strong>Shipping Restrictions:</strong> We are not responsible for delays caused by customs, natural occurrences, or transit strikes. Once a package is handed over to the logistics provider, the responsibility transfers to them.</li>
          </ul>

          <h2>4. Returns, Exchanges, and Refunds</h2>
          <p>Due to the nature of our luxury skincare and cosmetic products, we adhere to a strict hygiene policy. We accept returns within 14 days of receipt only if the products are completely unused, unopened, and the tamper-evident seals are fully intact.</p>
          <p>If a product arrives damaged or defective, you must contact our Customer Service team within 48 hours of delivery with photographic evidence to arrange an exchange.</p>

          <h2>5. Intellectual Property</h2>
          <p>Unless otherwise stated, Rammy's Radiance and/or its licensors own the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may access this from Rammy's Radiance for your own personal use subjected to restrictions set in these terms and conditions.</p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from Rammy's Radiance</li>
            <li>Sell, rent or sub-license material from Rammy's Radiance</li>
            <li>Reproduce, duplicate or copy material from Rammy's Radiance</li>
            <li>Redistribute content from Rammy's Radiance</li>
          </ul>

          <h2>6. User Accounts and Security</h2>
          <p>If you create an account on our website, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password. We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders at our sole discretion.</p>

          <h2>7. Limitation of Liability</h2>
          <p>In no case shall Rammy's Radiance, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service.</p>

          <h2>8. Governing Law</h2>
          <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of the jurisdiction in which Rammy's Radiance is headquartered, without regard to its conflict of law provisions.</p>

          <h2>9. Changes to Terms of Service</h2>
          <p>You can review the most current version of the Terms of Service at any time at this page. We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.</p>
        </article>
      </div>
    </div>
  );
}
