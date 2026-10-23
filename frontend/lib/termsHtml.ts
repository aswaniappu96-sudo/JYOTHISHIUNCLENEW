import { BRAND_EMAIL, markBrandHtml, rewriteBrandText } from "@/lib/brand";
import type { SiteSettings } from "@/types/wordpress";

const PUBLIC_EMAIL = BRAND_EMAIL;

export function publicContactEmail(settings?: Pick<SiteSettings, "contact_email"> | null) {
  const fromSite = (settings?.contact_email || "").trim();
  if (fromSite && fromSite.includes("@") && !/0000/.test(fromSite)) return rewriteBrandText(fromSite);
  return PUBLIC_EMAIL;
}

export function termsContactHtml(settings?: Pick<SiteSettings, "contact_email" | "address" | "phone_number"> | null) {
  const email = publicContactEmail(settings);
  const address = (settings?.address || "").trim();
  const phone = (settings?.phone_number || "").trim();
  const lines = [`<p>Email: <a href="mailto:${email}">${email}</a></p>`];
  if (address) lines.push(`<p>Address: ${escapeHtml(address)}</p>`);
  if (phone) lines.push(`<p>Phone: ${escapeHtml(phone)}</p>`);
  return lines.join("\n");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function applyTermsContact(html: string, settings?: SiteSettings | null) {
  const block = termsContactHtml(settings);
  let next = html;
  if (next.includes("ju-contact-start")) {
    next = next.replace(/<!-- ju-contact-start -->[\s\S]*?<!-- ju-contact-end -->/, `<!-- ju-contact-start -->\n${block}\n<!-- ju-contact-end -->`);
  } else {
    next = next
      .replace(/\[Add Your Company Registered Address Here\]/g, (settings?.address || "").trim() || "See the Contact page")
      .replace(/\[Add Your Support Number Here\]/g, (settings?.phone_number || "").trim() || "See the Contact page");
  }
  return markBrandHtml(next);
}

export const TERMS_FALLBACK = `
<p><strong>Last Updated:</strong> 12th October 2026</p>
<p>These Terms and Conditions of Use ("Terms") govern your use of the website, mobile application, and services offered by MaharshiOm ("We", "Us", "Our", "Company", "MaharshiOm"). By accessing www.maharshiom.com, our app, or any of our services, you ("User", "You", "Your") agree to be legally bound by these Terms.</p>
<p>If you do not agree with these Terms, please do not use our platform or click on "I Agree".</p>

<h2>1. DEFINITIONS</h2>
<p>1.1 "Platform" means the website www.maharshiom.com, mobile application, and all associated services.</p>
<p>1.2 "Services" includes (a) Online and Offline Pooja Booking, (b) Sale of Spiritual and Astrological Products, (c) Temple Yatra and Pilgrimage Packages, (d) Astrology Consultations via Call, Chat, and Video with astrologers registered on our platform.</p>
<p>1.3 "Astrologer" means an independent service provider registered with MaharshiOm to provide astrological guidance.</p>
<p>1.4 "User" means any person who accesses, browses, or books any service on the Platform.</p>

<h2>2. UPDATION OF TERMS</h2>
<p>We reserve the right to update, modify, or amend these Terms at any time without prior notice. The updated Terms will be posted on this page with the revised date. You are advised to check this page periodically. Your continued use of the Platform after any change constitutes acceptance of the new Terms.</p>

<h2>3. ELIGIBILITY AND REGISTRATION</h2>
<p>3.1 You must be at least 18 years of age and capable of entering into a legally binding contract under the Indian Contract Act, 1872 to use our Paid Services.</p>
<p>3.2 To avail personalized services, you must register using your mobile number and OTP, or via Google / Email login.</p>
<p>3.3 You agree to provide true, accurate, current, and complete information during registration, including name, date of birth, place of birth, and time of birth for astrological purposes.</p>
<p>3.4 You are responsible for maintaining the confidentiality of your account. Any activity under your account will be deemed to be done by you. You shall not share your account or create more than one active account.</p>
<p>3.5 We reserve the right to suspend or terminate your account if any information provided is found to be false, misleading, or inaccurate.</p>

<h2>4. SCOPE OF SERVICES</h2>
<h3>A. POOJA SERVICES (Online &amp; Offline)</h3>
<p>4.1 We facilitate booking of Poojas, Homams, Anushthanam, and other rituals performed at temples or by empanelled priests at your location.</p>
<p>4.2 For Online Poojas, the Pooja will be performed on your behalf by our priests. You will receive photos, videos, or live streaming as proof of completion, wherever applicable.</p>
<p>4.3 For Offline Poojas at your home, the date, time, and samagri will be confirmed after booking. The User must ensure a suitable place and necessary arrangements are available.</p>
<p>4.4 Pooja dates may change due to temple rules, tithi, priest availability, or force majeure events. In such cases, we will reschedule in consultation with you.</p>
<h3>B. ASTROLOGICAL PRODUCTS</h3>
<p>4.5 Products include gemstones, rudraksha, yantras, malas, and other spiritual items listed on our store.</p>
<p>4.6 All product images are for representation purposes only. Actual products may slightly vary in colour, size, and appearance due to natural formation.</p>
<p>4.7 Gemstones and Rudraksha are natural products. We provide lab certification where mentioned. Effects are based on traditional astrological beliefs.</p>
<h3>C. TEMPLE YATRA / PILGRIMAGE</h3>
<p>4.8 We act as a facilitator for Yatra packages organized through third-party travel partners. Itinerary, accommodation, food, and transport are subject to third-party availability.</p>
<p>4.9 Yatra bookings are subject to confirmation. We reserve the right to cancel or modify a Yatra due to weather conditions, temple closures, government restrictions, or low occupancy.</p>
<h3>D. ASTROLOGER CONSULTATION (Call, Chat, Video)</h3>
<p>4.10 Consultation charges are on a per-minute basis or as a fixed fee package as displayed on the astrologer's profile.</p>
<p>4.11 By booking a consultation, you consent to receive calls from our astrologers and our system, even if your number is registered under DND/NDNC.</p>
<p>4.12 Astrologers on our Platform are independent consultants, not employees of MaharshiOm. We verify their experience but do not guarantee their predictions.</p>

<h2>5. PAYMENTS, PRICING AND FEES</h2>
<p>5.1 All prices are in Indian Rupees (INR) unless otherwise stated and inclusive of applicable taxes unless specified.</p>
<p>5.2 Payments can be made via UPI, Net Banking, Credit/Debit Card, and other payment gateways integrated on our Platform.</p>
<p>5.3 You agree that your card/bank details provided are valid and lawfully owned by you.</p>

<h2>6. CANCELLATION, RESCHEDULING AND REFUND POLICY</h2>
<p>6.1 Pooja Services: Once a Pooja is assigned to a priest or temple and Sankalp is taken, it cannot be cancelled or refunded. If you request cancellation at least 24 hours before the scheduled time and before Sankalp, we may offer a 50% refund or reschedule once, at our discretion.</p>
<p>6.2 Astrology Consultation: Once a call/chat/video session is connected, no refund will be provided for poor network, wrong birth details provided, or dissatisfaction with advice. If the call drops due to a technical issue from our side and more than 60 seconds are lost, the lost balance will be credited to your MaharshiOm wallet.</p>
<p>6.3 Products: Products once sold can be returned only if received damaged or different from ordered. You must report with unboxing video within 48 hours of delivery. No refund for gemstones once energized or on the basis of astrological results.</p>
<p>6.4 Yatra: Cancellation charges will be as per the Yatra policy shared at the time of booking. Generally, 75% refund if cancelled 15 days before, 50% if 7 days before, and no refund within 7 days of departure.</p>
<p>6.5 All eligible refunds will be processed to the original payment method or MaharshiOm wallet within 7-10 working days after deducting payment gateway charges, shipping charges, and priest dakshina if applicable.</p>

<h2>7. USER OBLIGATIONS AND CONDUCT</h2>
<p>You agree not to:</p>
<ol>
<li>Post or transmit any false, defamatory, abusive, obscene, harassing, or unlawful content.</li>
<li>Upload any content that infringes any patent, trademark, copyright, or proprietary rights.</li>
<li>Use our Platform for any illegal purpose or to violate any local, state, national, or international law.</li>
<li>Attempt to hack, reverse engineer, or gain unauthorized access to our Platform.</li>
<li>Spam, advertise, or solicit other users.</li>
<li>Use the consultation service for immoral, illegal, or inappropriate discussions. We reserve the right to terminate such calls without refund.</li>
</ol>

<h2>8. DISCLAIMER, NO GUARANTEE AND LIMITATION OF LIABILITY</h2>
<p>8.1 Astrology, Pooja, Yantra, Gemstones, and Yatra are based on ancient Vedic beliefs, faith, and traditions. They are not a substitute for professional medical, legal, or financial advice.</p>
<p>8.2 We do not guarantee accuracy, reliability, or achievement of any desired outcome or wish fulfilment through Poojas or consultations. All astrological predictions and remedies are provided in good faith.</p>
<p>8.3 Our Platform and Services are provided on an "as is" and "as available" basis without any warranty of any kind.</p>
<p>8.4 MaharshiOm shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of our Services.</p>
<p>8.5 Our total liability in any case shall not exceed the amount paid by you for that specific service.</p>

<h2>9. WEBSITE CONTENT AND INTELLECTUAL PROPERTY</h2>
<p>All content on the Platform, including text, graphics, logos, images, audio, video, and software, is the property of MaharshiOm and is protected by copyright and trademark laws. You may not copy, reproduce, distribute, or create derivative works without our prior written permission.</p>

<h2>10. PRIVACY</h2>
<p>Your personal information is governed by our Privacy Policy. By using our Platform, you consent to our collection and use of information as described in the Privacy Policy. You consent to our access to your account for service, support, and quality assurance purposes.</p>

<h2>11. INDEMNIFICATION</h2>
<p>You agree to indemnify and hold harmless MaharshiOm, its directors, officers, employees, and astrologers from any claims, damages, losses, or expenses arising out of your violation of these Terms, your use of the Services, or violation of any rights of a third party.</p>

<h2>12. TERMINATION</h2>
<p>We may suspend or terminate your account and access to our Services at any time without notice if we believe you have violated these Terms, provided false information, or engaged in conduct harmful to us or other users.</p>

<h2>13. GOVERNING LAW AND JURISDICTION</h2>
<p>These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Kochi, Kerala. Both parties agree to attempt to resolve disputes through mediation/arbitration as per the Arbitration and Conciliation Act, 1996 before approaching the courts.</p>

<h2>14. CONTACT US</h2>
<p>For any questions regarding these Terms, grievances, or support, please contact us at:</p>
<p><strong>MaharshiOm</strong></p>
<!-- ju-contact-start -->
<p>Email: <a href="mailto:support@maharshiom.com">support@maharshiom.com</a></p>
<!-- ju-contact-end -->
`;
