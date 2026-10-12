<?php
/**
 * Canonical Disclaimer HTML for the WordPress Pages editor.
 *
 * @package JyothishiUncleCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function ju_disclaimer_contact_html( $email = '' ) {
	$email = is_email( $email ) ? $email : 'support@jyothishiuncle.com';
	return '<p>For any queries, contact us at: <a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a></p>';
}

function ju_disclaimer_html( $email = '' ) {
	$contact = ju_disclaimer_contact_html( $email );

	return '
<p><strong>Last Updated:</strong> 12th October 2026</p>
<p>The information, content, predictions, consultations, pooja services, astrological products, and yatra services provided on www.jyothishiuncle.com, our mobile application, and all associated platforms (collectively referred to as "JyothishiUncle", "We", "Our") are intended for spiritual, informational and entertainment purposes only.</p>

<h2>1. No Professional Advice</h2>
<p>Any prediction, forecast, reading, mantra, yantra, gemstone recommendation, Pooja, remedy or other message you receive from our astrologers, priests or through our website is not a substitute for professional advice. It should not be considered as a replacement for advice, programs, or treatment that you would normally receive from a licensed professional such as a doctor, psychiatrist, psychologist, lawyer, financial advisor or counselor.</p>
<p>You should always seek the advice of a qualified professional for any medical, mental health, legal or financial concerns. Never disregard professional medical advice or delay in seeking it because of something you have read or received on JyothishiUncle.</p>

<h2>2. No Guarantee of Accuracy or Results</h2>
<p>Astrology is a matter of faith, belief and interpretation based on ancient Vedic scriptures and calculations. Pooja, Homam, Anushthanam, Gemstones, Rudraksha, Yantras and other spiritual remedies are based on traditional beliefs.</p>
<p>JyothishiUncle provides no guarantees, implied warranties, or assurances of any kind regarding:</p>
<p>a) The accuracy, completeness, or reliability of any prediction or astrological advice.</p>
<p>b) The fulfilment of any wish, desire, or outcome from performing any Pooja or Yatra.</p>
<p>c) The effectiveness of any gemstone, rudraksha, yantra or other spiritual product sold on our platform.</p>
<p>All transactions and outcomes are subject to your faith and personal belief. Your interpretation and use of the information is solely at your own risk and discretion.</p>

<h2>3. Role of JyothishiUncle</h2>
<p>JyothishiUncle is an intermediary platform and facilitator. We connect Users with independent third-party Astrologers, Priests, Temples, and Travel Partners.</p>
<p>Astrologers and Priests registered on our platform are independent service providers and not employees of JyothishiUncle. We verify their profile and experience to the best of our ability, but we do not endorse, guarantee, or take responsibility for the advice, methods, or conduct of any astrologer or priest.</p>
<p>Similarly, for Temple Yatra packages, we act only as a booking facilitator through verified travel partners. We are not liable for any delay, cancellation, accident, injury, or loss during travel.</p>

<h2>4. Company Information</h2>
<p>JyothishiUncle is a product and brand owned and operated by [Add Your Company Legal Name Here]. All transactions, bookings, payments, and data collected on the website and app are accessed and managed by JyothishiUncle and its authorized team for the purpose of providing services.</p>
<p>This website is not a government-registered astrological institution and is not affiliated with any temple trust or religious authority in an official capacity. All Pooja bookings are done through our authorized priests and associates.</p>

<h2>5. Limitation of Liability</h2>
<p>JyothishiUncle, its directors, officers, employees, astrologers, priests and affiliates shall not be liable for any direct, indirect, incidental, consequential or special damages arising out of your use of our services, reliance on any information provided, or any products purchased.</p>
<p>By using our Platform, you agree that any claim or legal remedy sought for actions or omissions of astrologers, priests, or third-party partners shall be limited to a claim against that particular party, and not against JyothishiUncle.</p>

<h2>6. User Responsibility</h2>
<p>You agree that you are using our services with your free will and at your own risk. You are solely responsible for your decisions, actions and interpretations based on the services provided.</p>
<p>If you are experiencing severe mental distress, depression, or have thoughts of self-harm or suicide, please discontinue use of this website immediately and seek immediate help from a qualified medical professional. You can contact AASRA Suicide Prevention Helpline at 91-22-27546669.</p>
<p>By continuing to use www.jyothishiuncle.com, you acknowledge that you have read, understood and agree to this Disclaimer.</p>
<!-- ju-contact-start -->
' . $contact . '
<!-- ju-contact-end -->
';
}
