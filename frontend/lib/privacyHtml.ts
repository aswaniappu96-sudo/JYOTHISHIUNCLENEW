import { markBrandHtml } from "@/lib/brand";
import type { SiteSettings } from "@/types/wordpress";
import { publicContactEmail } from "@/lib/termsHtml";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function privacyGrievanceHtml(settings?: Pick<SiteSettings, "contact_email" | "address" | "phone_number"> | null) {
  const email = publicContactEmail(settings);
  const address = (settings?.address || "").trim();
  const phone = (settings?.phone_number || "").trim();
  return [
    "<p>Name: [Add Full Name]</p>",
    "<p>Designation: Grievance Officer - MaharshiOm</p>",
    `<p>Email: <a href="mailto:${email}">${email}</a> / <a href="mailto:grievance@maharshiom.com">grievance@maharshiom.com</a></p>`,
    `<p>Address: ${address ? escapeHtml(address) : "[Add Your Registered Company Address, Kochi / Tirur]"}</p>`,
    `<p>Phone: ${phone ? escapeHtml(phone) : "[Add Support Number]"}</p>`,
    "<p>Time: Monday to Saturday, 10 AM to 6 PM IST</p>",
  ].join("\n");
}

export function applyPrivacyContact(html: string, settings?: SiteSettings | null) {
  const block = privacyGrievanceHtml(settings);
  const address = (settings?.address || "").trim();
  const phone = (settings?.phone_number || "").trim();
  let next = html;
  if (next.includes("ju-grievance-start")) {
    next = next.replace(
      /<!-- ju-grievance-start -->[\s\S]*?<!-- ju-grievance-end -->/,
      `<!-- ju-grievance-start -->\n${block}\n<!-- ju-grievance-end -->`
    );
  }
  if (address) {
    next = next.replace(/\[Add Your Registered Company Address, Kochi \/ Tirur\]/g, escapeHtml(address));
  }
  if (phone) {
    next = next.replace(/\[Add Support Number\]/g, escapeHtml(phone));
  }
  return markBrandHtml(next);
}

export const PRIVACY_FALLBACK = `
<p><strong>Last Updated:</strong> 12th October 2026</p>
<p>www.maharshiom.com ("We", "Us", "Our", "MaharshiOm") is committed to protecting the privacy of its users ("You", "Your", "User"). This Privacy Policy explains how we collect, use, store, share and protect your information when you use our website, mobile application and services.</p>
<p>This Privacy Policy is published in compliance with Section 43A of the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023.</p>
<p>This Policy should be read together with our Terms and Conditions.</p>

<h2>1. USER CONSENT</h2>
<p>By accessing our Platform and providing your information, you consent to the collection, use, storage and transfer of your information as described in this Policy.</p>
<p>If you do not agree with this Policy, please do not use our Platform. Your continued use of the Platform signifies your unconditional consent to this Policy, including any amendments made from time to time.</p>

<h2>2. WHAT INFORMATION WE COLLECT</h2>
<p>We collect two types of information:</p>
<h3>A. Personal Information - Information that can identify you:</h3>
<p><strong>Registration Data:</strong> Name, mobile number, email ID, password/OTP, gender, profile photo.</p>
<p><strong>Astrological Data:</strong> Date of Birth, Time of Birth, Place of Birth, birth chart details you provide for consultation or Pooja Sankalp.</p>
<p><strong>Pooja &amp; Yatra Booking Data:</strong> Your full name, family member names for Sankalp, Gotra, address, ID proof required for travel bookings, emergency contact number, preferred Pooja date.</p>
<p><strong>Order &amp; Payment Data:</strong> Shipping address, billing address, phone number, transaction ID, payment method. We do not store your full card number, CVV or UPI PIN. Payments are processed through secure third-party payment gateways.</p>
<p><strong>Communication Data:</strong> Call recordings, chat transcripts, voice messages, video consultation recordings for quality, training and dispute resolution, feedback and reviews you provide.</p>
<p><strong>Device &amp; Technical Data:</strong> IP address, device ID, device model, OS version, browser type, mobile network, location data (with your permission).</p>
<h3>B. Non-Personal Information:</h3>
<p>Pages visited, time spent, clicks, referral URL, cookies and similar technologies.</p>
<p>Aggregated and anonymized demographic data.</p>

<h2>3. HOW WE COLLECT YOUR INFORMATION</h2>
<p>Directly from you when you register, book a Pooja, order a product, book a Yatra, or consult an astrologer.</p>
<p>Automatically through cookies, log files and analytics tools when you browse our Platform.</p>
<p>From third parties like payment gateways and analytics partners.</p>

<h2>4. WHY WE USE YOUR INFORMATION</h2>
<p>We use your information for the following purposes:</p>
<p>a) To create and manage your account and verify your identity via OTP.</p>
<p>b) To provide our services - To perform Pooja on your behalf with correct Name and Gotra, to deliver products to your address, to confirm Yatra bookings, and to connect you with an astrologer via Call / Chat / Video.</p>
<p>c) To personalize your experience and generate your Kundli / Horoscope.</p>
<p>d) To process payments and prevent fraud.</p>
<p>e) To communicate with you - order updates, Pooja photos/videos, Yatra itinerary, OTPs, customer support and promotional offers. Your phone number is masked - it is never shared directly with the astrologer. Calls are connected through our secure intermediary system.</p>
<p>f) To improve our Platform, for research, analytics and to ensure quality control of astrologers and priests.</p>
<p>g) To comply with legal obligations and law enforcement requests.</p>

<h2>5. POOJA, YATRA &amp; ASTROLOGER SPECIFIC PRIVACY</h2>
<p><strong>For Poojas:</strong> Your Name, Gotra and Sankalp details are shared only with the concerned priest/temple to perform the ritual. We do not publish this information publicly.</p>
<p><strong>For Yatra:</strong> Your name, age, ID details and contact number are shared with our verified travel partners, hotels and transport providers only to the extent required for booking.</p>
<p><strong>For Astrology Consultation:</strong> Information you share with the astrologer during chat/call/video is shared with that specific astrologer to provide consultation. Any personal information you voluntarily share directly with the astrologer during the consultation is outside our control and not covered under this Policy. We advise you not to share highly sensitive financial or personal data with astrologers.</p>

<h2>6. COOKIES</h2>
<p>We use cookies to remember your login, keep your cart, analyze traffic and show relevant ads. You can disable cookies from your browser settings, but some features of the Platform may not function properly.</p>

<h2>7. HOW WE SHARE YOUR INFORMATION</h2>
<p>We do not sell or rent your personal information to anyone.</p>
<p>We may share your information only with:</p>
<p>a) Service Providers: Priests, temples, courier partners, payment gateways, cloud hosting and SMS providers who work on our behalf.</p>
<p>b) Astrologers: Only the limited information required to provide consultation.</p>
<p>c) Legal Requirements: If required by law, court order, or government authority.</p>
<p>d) Business Transfer: In case of merger, acquisition or sale of assets, your information may be transferred.</p>
<p>We ensure all third parties adhere to reasonable security practices.</p>

<h2>8. DATA RETENTION AND DELETION</h2>
<p>We retain your personal data for as long as your account is active or as needed to provide services and to comply with legal and tax obligations.</p>
<p>You have the right to delete your account. You can request account deletion from the App Menu &gt; My Profile &gt; Delete Account or by emailing us at <a href="mailto:support@maharshiom.com">support@maharshiom.com</a>. Upon deletion, we will delete your personal data within 30 days except for data we are required to retain by law, for pending orders, or for dispute resolution.</p>

<h2>9. YOUR RIGHTS</h2>
<p>As per the Digital Personal Data Protection Act, 2023, you have the right to:</p>
<p>a) Access and review your personal data we hold.</p>
<p>b) Correct or update inaccurate information.</p>
<p>c) Request deletion of your data.</p>
<p>d) Withdraw consent for use of your data, with the understanding that it may restrict your use of our services.</p>
<p>e) Grievance redressal.</p>
<p>To exercise these rights, contact us at <a href="mailto:support@maharshiom.com">support@maharshiom.com</a>.</p>

<h2>10. SECURITY MEASURES</h2>
<p>We implement industry-standard physical, technical and administrative security measures including SSL encryption, secure servers and restricted access. Your payment information is always transmitted in encrypted form on the payment gateway page.</p>
<p>However, no method of transmission over the internet is 100% secure. You are advised to keep your OTP and password confidential and not share it with anyone including our staff.</p>

<h2>11. CHILDREN'S PRIVACY</h2>
<p>Our services are not intended for users under the age of 18. We do not knowingly collect personal data of children below 18 years. If we learn that we have collected data of a minor, we will delete it promptly. If you are a parent and become aware of such data, please contact us immediately.</p>

<h2>12. THIRD-PARTY LINKS</h2>
<p>Our Platform may contain links to third-party websites like payment gateways, YouTube for Pooja live streaming, or travel partners. We are not responsible for their privacy practices. We advise you to read their privacy policies.</p>

<h2>13. DISCLAIMER</h2>
<p>Our Platform is a marketplace connecting users with independent astrologers, priests and travel partners. We do not guarantee the accuracy of astrological predictions, the fulfilment of wishes from Pooja, or the effectiveness of products. These are matters of faith and belief.</p>
<p>We are not a medical or mental health helpline. If you are experiencing distress or suicidal thoughts, please discontinue use of our services and contact a qualified medical professional or call AASRA helpline at 91-22-27546669.</p>

<h2>14. CHANGES TO THIS POLICY</h2>
<p>We may update this Policy from time to time. Any changes will be posted on this page with an updated date. We will notify you via email or notification for significant changes.</p>

<h2>15. GRIEVANCE OFFICER</h2>
<p>In accordance with the Information Technology Act, 2000 and rules made thereunder, the name and contact details of the Grievance Officer are provided below:</p>
<!-- ju-grievance-start -->
<p>Name: [Add Full Name]</p>
<p>Designation: Grievance Officer - MaharshiOm</p>
<p>Email: <a href="mailto:support@maharshiom.com">support@maharshiom.com</a> / <a href="mailto:grievance@maharshiom.com">grievance@maharshiom.com</a></p>
<p>Address: [Add Your Registered Company Address, Kochi / Tirur]</p>
<p>Phone: [Add Support Number]</p>
<p>Time: Monday to Saturday, 10 AM to 6 PM IST</p>
<!-- ju-grievance-end -->
<p>We will endeavour to respond to your grievance within 48 hours and resolve it within 30 days.</p>
`;
