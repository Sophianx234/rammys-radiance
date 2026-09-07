import next from "next";

export function welcomeEmail(name: string) {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#faf7f7; padding: 40px 0;">
    <div style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 35px 30px;
        border-radius: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      "
    >

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 25px;">
        <img 
          src="YOUR_LOGO_URL_HERE" 
          alt="Rammy's Closet Logo"
          style="width: 120px; height: auto;"
        />
      </div>

      <h2 style="color:#333; text-align:center; font-size:22px; font-weight:600;">
        Welcome to <span style="color:#ff8a7a;">Rammy’s Closet</span>!
      </h2>

      <p style="font-size: 15px; color:#555; line-height: 1.7;">
        Hi ${name},<br><br>
        We're absolutely thrilled to have you join our beauty and fashion family!
        From skincare essentials to stunning fashion pieces, you’re now part of a vibrant
        community that loves style, self-care, and confidence.
      </p>

      <p style="font-size: 15px; color:#555; line-height: 1.7;">
        As a new member, you’ll be the first to know about exclusive deals, new product drops, 
        special discounts, and beauty tips curated just for you.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center; margin:30px 0;">
        <a 
          href="${process.env.NEXT_PUBLIC_APP_URL}/shop"
          style="
            background:#ff8a7a;
            color:#fff;
            padding:13px 26px;
            border-radius:8px;
            text-decoration:none;
            font-weight:600;
          "
        >
          Start Shopping
        </a>
      </div>

      <p style="font-size:14px; color:#777;">
        We’re excited to be part of your beauty journey.  
        If you ever need help, our team is one message away.  
        <br><br>
        With love,<br>
        <strong>The Rammy’s Closet Team</strong>
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin: 30px 0;" />

      <div style="text-align:center; color:#999; font-size:12px;">
        <p style="margin:0;">&copy; ${new Date().getFullYear()} Rammy’s Closet. All rights reserved.</p>
        <p style="margin:0;">You're receiving this email because you created an account on our store.</p>
      </div>

    </div>
  </div>
  `;
}



export function orderConfirmationEmail({
  name,
  orderId,
  items,
  totalAmount,
  address,
}: {
  name: string;
  orderId: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  address: string;
}) {
  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; font-size:14px; color:#333;">${item.name}</td>
          <td style="padding: 8px 0; font-size:14px; color:#333; text-align:center;">${item.quantity}</td>
          <td style="padding: 8px 0; font-size:14px; color:#333; text-align:right;">GHS ${item.price}</td>
        </tr>
      `
    )
    .join("");

  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#faf7f7; padding: 40px 0;">
    <div style="
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 35px 30px;
      border-radius: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    ">

      <!-- Logo -->
      <div style="text-align:center; margin-bottom:25px;">
        <img 
          src="YOUR_LOGO_URL_HERE"
          alt="Rammy's Closet Logo"
          style="width: 120px; height:auto;"
        />
      </div>

      <h2 style="color:#333; text-align:center; font-size:22px; font-weight:600;">
        Your Order is Confirmed! 🎉
      </h2>

      <p style="font-size:15px; color:#555; line-height:1.7;">
        Hi ${name},<br><br>
        Thank you for shopping with <strong>Rammy’s Closet</strong>!  
        Your order has been successfully received and is now being processed.
      </p>

      <div style="
        background:#fff7f6;
        padding:15px 18px;
        border-left:4px solid #ff8a7a;
        border-radius:8px;
        margin:22px 0;
      ">
        <p style="margin:0; font-size:14px; color:#444;">
          <strong>Order ID:</strong> ${orderId}<br/>
          <strong>Delivery Address:</strong> ${address}
        </p>
      </div>

      <h3 style="font-size:17px; color:#333; margin-bottom:10px;">Order Summary</h3>

      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left; padding-bottom:8px; font-size:14px; color:#999;">Item</th>
            <th style="text-align:center; padding-bottom:8px; font-size:14px; color:#999;">Qty</th>
            <th style="text-align:right; padding-bottom:8px; font-size:14px; color:#999;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

      <p style="font-size:16px; font-weight:600; color:#333; text-align:right;">
        Total: GHS ${totalAmount}
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a 
          href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}"
          style="
            background:#ff8a7a;
            color:#fff;
            padding:13px 26px;
            border-radius:8px;
            text-decoration:none;
            font-weight:600;
          "
        >
          View Order Status
        </a>
      </div>

      <p style="font-size:14px; color:#777;">
        You’ll receive another update once your order is on its way.  
        Thank you for choosing Rammy’s Closet!
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin: 30px 0;" />

      <div style="text-align:center; color:#999; font-size:12px;">
        <p style="margin:0;">&copy; ${new Date().getFullYear()} Rammy’s Closet. All rights reserved.</p>
        <p style="margin:0;">This email confirms your order from our store.</p>
      </div>

    </div>
  </div>
  `;
}

export function reviewThankYouEmail(name: string, productName: string, rating: number) {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#faf7f7; padding: 40px 0;">
    <div style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 35px 30px;
        border-radius: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      "
    >

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 25px;">
        <img 
          src="YOUR_LOGO_URL_HERE" 
          alt="Rammy's Closet Logo"
          style="width: 120px; height: auto;"
        />
      </div>

      <h2 style="color:#333; text-align:center; font-size:22px; font-weight:600;">
        Thank You for Reviewing <span style="color:#ff8a7a;">${productName}</span>!
      </h2>

      <p style="font-size: 15px; color: #555; line-height: 1.7;">
        Hi ${name},<br><br>
        We truly appreciate you taking the time to share your experience with 
        <strong>${productName}</strong>. Your ${rating}-star rating helps other beauty lovers make 
        confident choices—and it helps us continue improving our products.
      </p>

      <p style="font-size: 15px; color:#555; line-height:1.7;">
        Thank you for being a valued member of the Rammy’s Closet beauty community. 
        We’re always excited to see what you discover next!
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a 
          href="${process.env.NEXT_PUBLIC_APP_URL}/shop"
          style="
            background:#ff8a7a;
            color:#fff;
            padding:13px 26px;
            border-radius:8px;
            text-decoration:none;
            font-weight:600;
          "
        >
          Continue Shopping
        </a>
      </div>

      <p style="font-size:14px; color:#777;">
        With love, <br>
        <strong>The Rammy’s Closet Team</strong>
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin: 30px 0;" />

      <div style="text-align:center; color:#999; font-size:12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rammy’s Closet. All rights reserved.</p>
        <p style="margin: 0;">You’re receiving this email because you reviewed a product on our store.</p>
      </div>

    </div>
  </div>
  `;
}


export function newProductAnnouncementEmail({
  name,
  description,
  price,
  image,
  url,
  category,
  features = [],
}: {
  name: string;
  description: string;
  price: number;
  image: string;
  url: string;
  category: string;
  features?: string[];
}) {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#faf7f7; padding: 40px 0;">
    <div
      style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 35px 30px;
        border-radius: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      "
    >

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 25px;">
        <img 
          src="YOUR_LOGO_URL_HERE"
          alt="Rammy's Closet Logo"
          style="width: 120px; height: auto;"
        />
      </div>

      <h2 style="color:#333; text-align:center; font-size:22px; font-weight:600;">
        ✨ New Product Added: <span style="color:#ff8a7a;">${name}</span>
      </h2>

      <p style="font-size: 15px; color: #555; text-align:center; margin-top:10px; line-height:1.7;">
        A brand-new <strong>${category}</strong> item has just arrived in our collection!
        Be among the first to check it out.
      </p>

      <!-- Product Image -->
      <div style="text-align:center; margin: 25px 0;">
        <img 
          src="${image}"
          alt="${name}"
          style="width: 100%; max-width: 360px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.08);"
        />
      </div>

      <!-- Description -->
      <p style="font-size: 15px; color:#555; line-height:1.7;">
        ${description}
      </p>

      <!-- Features list -->
      ${
        features.length
          ? `
      <div style="margin: 20px 0;">
        <h3 style="font-size:16px; color:#222; font-weight:600;">Key Features:</h3>
        <ul style="font-size:14px; color:#555; line-height:1.6; padding-left:20px;">
          ${features.map((f) => `<li>${f}</li>`).join("")}
        </ul>
      </div>
      `
          : ""
      }

      <!-- Price -->
      <p style="font-size:17px; color:#000; font-weight:600; margin: 15px 0;">
        Price: GHS ${price}
      </p>

      <!-- CTA -->
      <div style="text-align:center; margin:30px 0;">
        <a 
          href="${url}"
          style="
            background:#ff8a7a;
            color:#fff;
            padding:14px 28px;
            border-radius:8px;
            text-decoration:none;
            font-weight:600;
            font-size:15px;
          "
        >
          View Product
        </a>
      </div>

      <p style="font-size:14px; color:#777;">
        Stay elegant and stylish with the latest releases from  
        <strong>Rammy’s Closet</strong>.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin: 30px 0;" />

      <!-- Footer -->
      <div style="text-align:center; color:#999; font-size:12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rammy’s Closet. All rights reserved.</p>
        <p style="margin: 0;">You’re receiving this email because you're part of our store community.</p>
      </div>

    </div>
  </div>
  `;
}

export function resetPasswordEmail({
  name,
  resetUrl,
}: {
  name: string;
  resetUrl: string;
}) {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f4f4; padding: 40px 0;">
    <div
      style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 35px 30px;
        border-radius: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      "
    >

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 25px;">
        <img 
          src="YOUR_LOGO_URL"
          alt="Rammy's Closet"
          style="width: 120px; height: auto;"
        />
      </div>

      <h2 style="color:#333; text-align:center; font-size:22px; font-weight:600;">
        🔐 Reset Your Password
      </h2>

      <p style="font-size: 15px; color:#555; line-height:1.7; margin-top:10px;">
        Hi ${name || "there"},  
        <br/><br/>
        We received a request to reset your password for your 
        <strong>Rammy’s Closet</strong> account.
        Click the button below to continue.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center; margin:30px 0;">
        <a 
          href="${resetUrl}"
          style="
            background:#ff8a7a;
            color:#fff;
            padding:14px 28px;
            border-radius:8px;
            text-decoration:none;
            font-weight:600;
            font-size:15px;
          "
        >
          Reset Password
        </a>
      </div>

      <p style="font-size:14px; color:#777; line-height:1.7;">
        This link is valid for <strong>15 minutes</strong>.  
        <br/><br/>
        If you did not request this change, you can safely ignore this email.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin: 30px 0;" />

      <!-- Footer -->
      <div style="text-align:center; color:#999; font-size:12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rammy’s Closet. All rights reserved.</p>
      </div>

    </div>
  </div>
  `;
}


export function passwordResetConfirmationEmail(name: string) {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#faf7f7; padding: 40px 0;">
    <div style="
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 35px 30px;
        border-radius: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      "
    >

      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 25px;">
        <img 
          src="YOUR_LOGO_URL_HERE" 
          alt="Rammy's Closet Logo"
          style="width: 120px; height: auto;"
        />
      </div>

      <h2 style="color:#333; text-align:center; font-size:22px; font-weight:600;">
        Your Password Has Been Reset
      </h2>

      <p style="font-size: 15px; color: #555; line-height: 1.7;">
        Hi ${name},<br><br>
        Your password has been successfully updated. You can now use your new password 
        to log in to your Rammy’s Closet account.
      </p>

      <div style="text-align:center; margin:30px 0;">
        <a 
          href="${process.env.NEXT_PUBLIC_APP_URL}/login"
          style="
            background:#ff8a7a;
            color:#fff;
            padding:14px 28px;
            border-radius:8px;
            text-decoration:none;
            font-weight:600;
            font-size:15px;
          "
        >
          Log In
        </a>
      </div>

      <p style="font-size: 15px; color: #555; line-height: 1.7;">
        If you did not perform this action, we recommend you reset your password immediately
        and contact our support team.
      </p>

      <p style="font-size:14px; color:#777;">
        With love, <br>
        <strong>The Rammy’s Closet Team</strong>
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin: 30px 0;" />

      <div style="text-align:center; color:#999; font-size:12px;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} Rammy’s Closet. All rights reserved.</p>
        <p style="margin: 0;">You’re receiving this email because a password change was made on your account.</p>
      </div>

    </div>
  </div>
  `;
}
