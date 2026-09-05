# OWASP Top 10 Security Audit & Remediation Report

This document outlines the security vulnerabilities originally discovered during the OWASP Top 10 security audit of the Rammy's Radiance Next.js application, and how they have been successfully remediated.

---

### ✅ 1. A01:2021 - Broken Access Control & A02:2021 - Cryptographic Failures
**Severity: Critical 🔴**
**Status: Patched**

**Original Vulnerability:**
The application relied on `src/middleware.ts` and Server Actions (`src/app/actions/auth.ts`) to extract the user's role from the JWT by simply decoding the Base64 payload without verifying its cryptographic signature. An attacker could forge a JWT with `{"role": "admin"}` and gain full administrative access.

**Remediation:**
Imported the `jose` library (Edge-compatible) and replaced all Base64 decoding logic with `jwtVerify()`. The application now rigorously verifies the cryptographic signature of the JWT using `process.env.JWT_SECRET` in both the Middleware and Server Actions before trusting any authorization claims.

---

### ✅ 2. A03:2021 - Injection (Stored XSS)
**Severity: High 🟠**
**Status: Patched**

**Original Vulnerability:**
Admin API routes accepted raw HTML/String inputs and saved them to MongoDB. When rendered in the JSON-LD `<script type="application/ld+json">` tag via `dangerouslySetInnerHTML`, an attacker could inject `</script><script>alert('Hacked')</script>` into a product description to execute arbitrary JavaScript on victims' browsers (Stored XSS).

**Remediation:**
1. **Entry Point:** Integrated `isomorphic-dompurify` into `POST /api/admin/products` to strictly sanitize all text-based fields (names, descriptions, variants) before they touch the database, neutralizing malicious payloads.
2. **Render Point:** Escaped all `<` characters in the JSON-LD stringification process (`JSON.stringify(jsonLd).replace(/</g, '\\u003c')`), structurally preventing script breakouts.

---

### ✅ 3. A07:2021 - Identification and Authentication Failures
**Severity: Medium 🟡**
**Status: Patched**

**Original Vulnerability:**
The `POST /api/auth/login` endpoint did not implement rate-limiting, leaving the application vulnerable to automated brute-force password guessing and credential stuffing attacks.

**Remediation:**
Integrated `@upstash/ratelimit` and `@upstash/redis` to implement a Sliding Window Rate Limiter. The endpoint now actively tracks incoming IP addresses and blocks requests exceeding 5 login attempts per 15-minute window with a `429 Too Many Requests` response.

---

### ✅ 4. A09:2021 - Security Logging and Monitoring Failures
**Severity: Low 🟢**
**Status: Patched**

**Original Vulnerability:**
Sensitive administrative and authentication actions were missing persistent audit trails.

**Remediation:**
Leveraged the existing Mongoose `ActivityLog` model to construct a secure audit trail. 
- Successful logins are automatically recorded alongside the originating IP address.
- Administrative actions (like product creation) securely decode the admin's JWT and record the action, target item ID, and timestamps for robust forensic monitoring.
