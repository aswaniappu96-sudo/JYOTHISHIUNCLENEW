<?php
/**
 * Canonical Refund Policy HTML for the WordPress Pages editor.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function ju_refund_notices_html( $email = '', $address = '' ) {
	$email   = is_email( $email ) ? $email : 'support@jyothishiuncle.com';
	$address = trim( (string) $address );
	$place   = $address ? $address : '[Your Full Registered Address, Kerala, India]';
	$lines   = array();
	$lines[] = '<p>JyothishiUncle, ' . esc_html( $place ) . '</p>';
	$lines[] = '<p>Email: <a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a></p>';
	return implode( "\n", $lines );
}

function ju_refund_html( $address = '', $email = '' ) {
	$notices = ju_refund_notices_html( $email, $address );

	return '
<p><strong>Last Updated:</strong> 12th October 2026</p>
<p>www.jyothishiuncle.com | JyothishiUncle App</p>
<p>These Terms and Conditions of Use ("Terms") govern your use of content and services offered by JyothishiUncle ("We", "Us", "Our", "Company", "Platform") through our website and mobile application.</p>

<h2>1. UPDATION</h2>
<p>We may update, amend or modify these Terms at any time. The updated version will be posted on this page with a revised date. You are responsible for checking these Terms periodically. Your continued use of the Platform after any changes shall mean you accept the revised Terms.</p>

<h2>2. USER CONSENT</h2>
<p>By accessing our Platform, creating an account or clicking "I Agree", you ("User", "You", "Your") confirm that you have read, understood and unconditionally agree to these Terms. If you do not agree, please do not use our Platform.</p>

<h2>3. GENERAL DESCRIPTION</h2>
<p>JyothishiUncle is an internet-based spiritual tech platform providing:</p>
<p>a) Online and Offline Pooja Booking</p>
<p>b) Sale of Astrological and Spiritual Products (Gemstones, Rudraksha, Yantras, etc.)</p>
<p>c) Temple Yatra and Pilgrimage Packages</p>
<p>d) Astrological Consultations via Call, Chat and Video with empanelled astrologers.</p>
<p>We offer both Free Services and Paid Services (collectively "Services"). For personalized Paid Services, you must register as a member.</p>

<h2>4. REGISTRATION AND ELIGIBILITY</h2>
<p>4.1 You must be 18 years of age or above and competent to enter into a contract under the Indian Contract Act, 1872.</p>
<p>4.2 To avail services, you must register using your mobile number and OTP or via Gmail / other valid email ID.</p>
<p>4.3 You agree to provide current, accurate, complete information including Name, Date of Birth, Time of Birth, Place of Birth, Gotra for Pooja purposes. This information is referred to as "Registration Data".</p>
<p>4.4 Use of another person\'s account is strictly prohibited. If information provided is found to be false or inaccurate, we have the right to suspend or terminate your account.</p>
<p>4.5 Your right to use the Platform is personal and non-transferable. You are responsible for maintaining confidentiality of your account. You must notify us immediately of any unauthorized use.</p>
<p>We do not permit use of our Services if:</p>
<p>a) You are a resident of a jurisdiction where such services are prohibited by law.</p>
<p>b) You have created multiple accounts with different mobile numbers.</p>
<p>c) You are using our services for illegal or commercial reselling without written consent.</p>

<h2>5. SERVICES DESCRIPTION</h2>
<h3>A. FEATURE "CALL / CHAT / VIDEO WITH ASTROLOGER"</h3>
<p>We provide telecommunication-based astrology consultations. By agreeing to these Terms, you give unconditional consent to receive calls from our system and astrologers on your mobile number, even if your number is registered under DND/NDNC. Charges are on a per-minute basis or fixed package as displayed.</p>
<h3>B. POOJA SERVICES (ONLINE &amp; OFFLINE)</h3>
<p>For Online Poojas, the ritual will be performed at the respective temple or by our priests on your behalf using your Name and Gotra. Proof in the form of photos / videos / live link will be shared where available.</p>
<p>For Offline Poojas, our priest will visit your location on the scheduled date. You must arrange for Pooja samagri and space as instructed. Dates may be rescheduled due to tithi, temple rules or force majeure.</p>
<h3>C. ASTROLOGICAL PRODUCTS</h3>
<p>We sell spiritual products through our e-store. Images are for reference only. Natural products like gemstones may vary slightly. Lab certification will be provided where mentioned.</p>
<h3>D. TEMPLE YATRA</h3>
<p>We act as a facilitator for Yatra packages through verified third-party travel partners. Itinerary, hotels, and transport are subject to availability and weather conditions. We reserve the right to cancel or alter Yatra due to unforeseen circumstances.</p>

<h2>6. WEBSITE CONTENT</h2>
<p>6.1 All content on the Platform is private property of JyothishiUncle.</p>
<p>6.2 You shall not post or transmit any content that is unlawful, abusive, defamatory, obscene, vulgar, invasive of privacy, or that infringes intellectual property rights of others.</p>
<p>6.3 We reserve the right to suspend access or discontinue any feature, content, offer or graphic without notice.</p>
<p>6.4 Any astrological content, reports or product information other than direct advice from an astrologer is for spiritual and informational purposes and should not be considered as medical, legal or financial advice.</p>
<p>6.5 We do not guarantee any specific result from Poojas, consultations or products. Accessing and using our services is purely at your own risk and faith.</p>

<h2>7. USER ACCOUNT ACCESS</h2>
<p>You consent to unconditional access of your account by JyothishiUncle, its employees and agents for maintaining service quality and for addressing complaints and suspected abuse.</p>

<h2>8. PRIVACY POLICY</h2>
<p>By using our Platform, you confirm that you have read and understood our Privacy Policy. Please read our detailed Privacy Policy on our website.</p>

<h2>9. BREACH AND TERMINATION</h2>
<p>We may modify, discontinue or terminate your account or ordered services without prior notice. Your registration may be cancelled immediately if:</p>
<p>a) We are unable to verify your Registration Data.</p>
<p>b) Your actions may cause legal liability for us or other users.</p>
<p>c) You have provided false Registration Data or violated our Privacy Policy.</p>
<p>For astrologers/priests, we may deactivate your profile for any violation of service terms.</p>

<h2>10. DELIVERY, CANCELLATION AND REFUND</h2>
<p>a) Astrology Consultation: No refund once call/chat/video is connected. No refund for wrong number, low balance, or not answering the call. If call disconnects due to technical error from our side, lost duration will be credited to your wallet.</p>
<p>b) Pooja Booking: No refund once Pooja is assigned to a priest and Sankalp is taken (Processing stage). For cancellation before processing and at least 24 hours before muhurat, you must contact customer care. Refund if approved will be 50% or one-time rescheduling at our discretion.</p>
<p>c) Reports / Remedies: No refund once order reaches processing stage.</p>
<p>d) Products: Return accepted only if product is damaged in transit or wrong product delivered. You must share unboxing video within 48 hours of delivery. No refund for energized gemstones or on grounds of astrological results not met. For COD returns, shipping and courier charges will be deducted.</p>
<p>e) Temple Yatra: Cancellation policy as shared at booking time will apply. Generally 75% refund if cancelled 15 days before, 50% if 7 days before, no refund within 7 days.</p>
<p>f) General: Refunds will be processed after deducting payment gateway charges, shipping, priest dakshina and other incurred costs. Refunds will be issued within 7-10 working days to original payment source or JyothishiUncle wallet.</p>
<p>In case of double payment due to technical glitch, full excess amount will be refunded without deduction.</p>

<h2>11. USER OBLIGATIONS</h2>
<p>You agree not to:</p>
<p>a) Post false, misleading, harassing, hateful or defamatory messages.</p>
<p>b) Upload content you have no right to share.</p>
<p>c) Infringe patent, trademark, copyright of any party.</p>
<p>d) Collect email IDs or phone numbers for spam or advertisement.</p>
<p>e) Send junk mail, spam, chain letters.</p>
<p>f) Upload viruses or corrupted files.</p>
<p>g) Attempt to gain unauthorized access by hacking or password mining.</p>
<p>h) Use services for commercial resale without our written consent.</p>
<p>i) Reverse engineer, copy, distribute, or create derivative works from our Platform.</p>
<p>You agree to receive transactional SMS, emails and calls from us regarding your bookings.</p>
<p>You must report any abuse or misuse of the Platform to our Customer Care. False complaints may lead to termination without refund.</p>
<p>We reserve the right to withdraw service to any user who is found abusive towards our astrologers, priests or staff.</p>

<h2>12. BANK ACCOUNT INFORMATION</h2>
<p>You agree that debit/credit card or bank details provided by you are correct and lawfully owned by you. You are responsible for ensuring sufficient balance before making payment. You confirm you are authorized to use the payment instrument.</p>

<h2>13. DISCLAIMER / LIMITATION OF LIABILITY / WARRANTY</h2>
<p>13.1 Astrological consultations are based on individual knowledge and interpretation of astrologers and may vary from one to another.</p>
<p>13.2 Our Platform and services are provided on an "as is" basis without any warranty of any kind. We do not warrant that services will be uninterrupted, timely, secure or error-free, or that results will be accurate or meet your expectations.</p>
<p>13.3 Recommendations for mantras, yantras, gemstones or Poojas are made in good faith by astrologers and priests.</p>
<p>13.4 JyothishiUncle is a facilitator platform. Astrologers, priests and travel partners are independent service providers, not employees. We verify their credentials but do not guarantee their advice.</p>
<p>13.5 We are not a suicide helpline. If you are having suicidal thoughts or are in distress, please stop using our services and immediately call AASRA helpline 91-22-27546669 or seek medical help.</p>
<p>13.6 Under no circumstances shall JyothishiUncle, its payment providers or agents be liable for any direct, indirect, incidental or consequential damages arising from use of services.</p>
<p>13.7 Our total liability for any claim shall be limited to the amount paid by you for that specific service.</p>

<h2>14. INDEMNIFICATION</h2>
<p>You agree to indemnify and hold harmless JyothishiUncle, its parents, subsidiaries, affiliates, officers, directors, employees and agents from any claims, damages, costs including attorney fees arising from your use of Services, violation of Terms or Privacy Policy, or violation of any third-party rights.</p>

<h2>15. PROPRIETARY RIGHTS TO CONTENT</h2>
<p>All content including text, software, images, graphics, logos is protected by copyright and trademark laws. You are not permitted to copy or create derivative works without express written authorization.</p>

<h2>16. NOTICES</h2>
<p>All notices shall be in writing via email or registered post. Notices to User will be sent to address/email provided in Registration Data. Notices to us at:</p>
<!-- ju-contact-start -->
' . $notices . '
<!-- ju-contact-end -->

<h2>17. GOVERNING LAW AND JURISDICTION</h2>
<p>These Terms shall be governed by laws of India. Any dispute arising out of these Terms shall be resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be Kochi, Kerala. Proceedings shall be in English. Subject to arbitration, courts at Kochi, Kerala shall have exclusive jurisdiction.</p>
<p>If any provision of these Terms is found invalid, the remaining provisions shall continue in full force.</p>
<p>These Terms constitute the entire agreement between you and JyothishiUncle.</p>
';
}
