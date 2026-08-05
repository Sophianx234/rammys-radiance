import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Rammy's Radiance",
  description: "Learn how Rammy's Radiance collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header Banner */}
      <div className="w-full bg-[#E8EAE6] py-24 px-6 border-b border-border/40">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-[32px] md:text-[52px] font-bold tracking-tight uppercase mb-4 text-[#222222]">
            Privacy Policy
          </h1>
          <p className="text-[13px] tracking-widest uppercase text-text-muted max-w-lg">
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
          
          <p>At <strong>Rammy's Radiance</strong>, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>

          <h2>1. Important Information and Who We Are</h2>
          <p>Rammy's Radiance is the controller and responsible for your personal data (collectively referred to as "we", "us" or "our" in this privacy policy). We have appointed a data privacy manager who is responsible for overseeing questions in relation to this privacy policy. If you have any questions, including any requests to exercise your legal rights, please contact us at <strong>privacy@rammysradiance.com</strong>.</p>

          <h2>2. The Data We Collect About You</h2>
          <p>Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, title, and date of birth.</li>
            <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Financial Data</strong> includes payment card details (processed securely via our payment gateways, not stored directly on our servers).</li>
            <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, and other technology on the devices you use to access this website.</li>
            <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses.</li>
          </ul>

          <h2>3. How Is Your Personal Data Collected?</h2>
          <p>We use different methods to collect data from and about you including through:</p>
          <ul>
            <li><strong>Direct interactions.</strong> You may give us your Identity, Contact and Financial Data by filling in forms or by corresponding with us by post, phone, email or otherwise. This includes personal data you provide when you create an account, purchase our products, or subscribe to our newsletter.</li>
            <li><strong>Automated technologies or interactions.</strong> As you interact with our website, we may automatically collect Technical Data about your equipment, browsing actions and patterns. We collect this personal data by using cookies, server logs and other similar technologies.</li>
          </ul>

          <h2>4. How We Use Your Personal Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., processing and delivering your order).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.</p>

          <h2>6. Data Retention</h2>
          <p>We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorised use or disclosure of your personal data, and whether we can achieve those purposes through other means.</p>

          <h2>7. Your Legal Rights</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to:</p>
          <ul>
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
          <p>If you wish to exercise any of the rights set out above, please contact our Data Privacy Manager via the Contact page.</p>
        </article>
      </div>
    </div>
  );
}
