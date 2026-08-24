// Single source of truth for the /policies page copy.
// Consumed by src/pages/Policies.tsx (runtime) AND
// scripts/prerender-bodies.ts (static HTML), so the two can never drift.

export const EFFECTIVE_DATE = "Effective 24 August 2026";
export const CONTACT_EMAIL = "carnivalglamhub@gmail.com";

export const TERMS_INTRO = [
  'These Terms govern every booking made with Carnival Glam Hub, whether made on carnivalglamhub.com, through our booking platform, by email, by WhatsApp or in person. By placing a booking you accept these Terms on behalf of yourself and anyone you book for.',
  'In these Terms, "we", "us" and "our" mean Carnival Glam Hub. "You" means the person making the booking. "Event" means the Carnival, festival or date for which the appointment is booked. "Hub" means the venue at which we operate on that date.',
];

export const PRIVACY_INTRO = [
  "Carnival Glam Hub is committed to protecting your personal information. This Privacy Policy explains what we collect, why we collect it, who we share it with and what choices you have.",
  "It applies to carnivalglamhub.com, to bookings made through our booking platform, and to information you give us by email, by WhatsApp, by social media or in person at one of our Hubs.",
];

/** Expansion of the "__STATION__" clause placeholder, as plain text. */
export const STATION_CLAUSE_TEXT =
  "Station rentals for independent service providers are a separate commercial arrangement and are governed by the station rental terms issued with the rental confirmation, not by this booking policy.";

export const CONTENTS = [
  { href: "#terms", label: "Terms of Service and Booking Policy" },
  { href: "#refunds", label: "Cancellations and refunds" },
  { href: "#transfers", label: "Transfers and rescheduling" },
  { href: "#referrals", label: "Referral programme" },
  { href: "#privacy", label: "Privacy Policy" },
  { href: "#contact-policies", label: "Contact us" },
];

export const anchorFor = (heading: string): string | undefined => {
  if (heading.startsWith("4.")) return "transfers";
  if (heading.startsWith("13.")) return "referrals";
  return undefined;
};


export type Clause = { n: string; body: string };
export type Block = {
  id?: string;
  heading: string;
  intro?: string[];
  clauses?: Clause[];
  bullets?: string[];
  paragraphs?: string[];
};

export const TERMS_BLOCKS: Block[] = [
  {
    heading: "1. Bookings and deposits",
    clauses: [
      { n: "1.1", body: "A non-refundable deposit of US$50.00 is required to confirm a booking. The deposit applies per masquerader, per appointment, in every territory." },
      { n: "1.2", body: "Your appointment is not confirmed, and no time slot is held for you, until the deposit has been received. Availability is not reserved by enquiry, by conversation or by intention to pay." },
      { n: "1.3", body: "The deposit is applied to the total price of your booking. It is not an additional charge." },
      { n: "1.4", body: "The balance of your booking is due in full before your service begins, unless you have paid in full at the time of booking." },
      { n: "1.5", body: "If the balance is not settled before your service begins, we may release your appointment. The deposit is forfeited in that event." },
      { n: "1.6", body: "We reserve the right to require full payment at the time of booking for certain services, add-ons, group bookings or promotional rates. Where this applies, it is stated at checkout." },
    ],
  },
  {
    heading: "2. Pricing",
    clauses: [
      { n: "2.1", body: "Prices for the services we offer are those displayed at the time of booking and are subject to change on the date of the Event." },
      { n: "2.2", body: "Prices vary by territory, by service and by day. The price shown at checkout for your selected territory and date is the price that applies to your booking." },
      { n: "2.3", body: "Quotes produced by our booking calculator are estimates based on the information you enter. They are not a confirmed price and do not constitute an offer until a booking is placed and a deposit received." },
      { n: "2.4", body: "Promotional codes and discounts must be applied at the time of booking. They cannot be applied to a booking after it has been confirmed and cannot be exchanged for cash or credit." },
    ],
  },
  {
    id: "refunds",
    heading: "3. Cancellations and refunds",
    clauses: [
      { n: "3.1", body: "The deposit is non-refundable in all circumstances." },
      { n: "3.2", body: "Cancellation within 14 days of the Event. No refund is given if you cancel within 14 days before the Event. Bookings made within this period are non-refundable in full." },
      { n: "3.3", body: "No shows and same-day cancellations. If you do not attend your appointment, or cancel on the day of the Event, all payments made are forfeited. No transfer and no credit is issued." },
      { n: "3.4", body: "Services and add-ons under US$50.00. Refunds are not permitted on any service or add-on priced under US$50.00." },
      { n: "3.5", body: "Late arrival and early departure. Refunds are not provided if you arrive late for your appointment, or if you choose to leave before receiving the service." },
      { n: "3.6", body: "Where a refund is approved at our discretion, it is returned by the original payment method and may take up to 30 days to reach you. Payment processing fees are not refundable." },
    ],
  },
  {
    heading: "4. Transfers",
    clauses: [
      { n: "4.1", body: "A deposit or booking may be transferred to another Carnival Glam Hub event within 12 months of the original Event date. This includes transfers between territories, subject to availability at the receiving Hub." },
      { n: "4.2", body: "A transfer is allowed once per booking." },
      { n: "4.3", body: "A transfer must be requested at least 3 days before the Event. Requests made inside that window are not accepted." },
      { n: "4.4", body: "If a transfer results in a price difference, the balance must be paid at the time of transfer. If the balance is not paid, the booking is cancelled without refund." },
      { n: "4.5", body: "Where the receiving event is priced lower than the original, no refund, credit or cash difference is issued." },
      { n: "4.6", body: "Transferred bookings are subject to availability. A transfer request is not a guaranteed appointment until we confirm a new date and time in writing." },
    ],
  },
  {
    heading: "5. Rescheduling within the same Event",
    clauses: [
      { n: "5.1", body: "Where the schedule allows, one change of appointment time within the same Event may be permitted if requested at least 3 days before the Event." },
      { n: "5.2", body: "Time changes are subject to availability and are not guaranteed. Carnival morning schedules fill early and a preferred replacement slot may not exist." },
    ],
  },
  {
    heading: "6. Arrival and lateness",
    clauses: [
      { n: "6.1", body: "Please register at the Hub no later than 30 minutes before your confirmed appointment time." },
      { n: "6.2", body: "A 15 minute grace period applies from your confirmed appointment time." },
      { n: "6.3", body: "After the grace period has passed, we may shorten your service to fit the remaining time, or cancel the appointment. Where the appointment is cancelled, all payments made are forfeited." },
      { n: "6.4", body: "A shortened service is charged at the full booked price. Carnival morning runs to a fixed schedule and time released to a late arrival is taken from the masquerader booked after them." },
      { n: "6.5", body: "We do not accept responsibility for missed appointments caused by traffic, transport, road closures, band schedules or any other circumstance outside the Hub." },
    ],
  },
  {
    heading: "7. Your artist",
    clauses: [
      { n: "7.1", body: "Bookings are made for a service, not for a named artist, unless you have booked a named premium or team service that specifically identifies the artist." },
      { n: "7.2", body: "We may substitute an artist of equivalent standard where necessary. A substitution is not grounds for a refund." },
    ],
  },
  {
    heading: "8. Service satisfaction",
    clauses: [
      { n: "8.1", body: "If you are not fully satisfied with your service, tell our representative at the Hub before you leave, so that adjustments can be made while you are still with us." },
      { n: "8.2", body: "Once you leave the Hub, the service is considered accepted and completed." },
      { n: "8.3", body: "We assess reported concerns case by case. Where a concern is upheld after you have left, a partial credit or a discount on a future service may be offered at management's discretion. This is a goodwill measure and not an entitlement." },
      { n: "8.4", body: "Carnival makeup and hair are applied to a brief agreed with you at the chair. Change of preference after the fact, a change in how a look photographs, and the effects of weather, perspiration, costume, travel or the passage of the day are not service faults." },
    ],
  },
  {
    heading: "9. Skin, hair, health and suitability",
    clauses: [
      { n: "9.1", body: "You must tell us before your service begins about any allergy, skin sensitivity, scalp condition, recent cosmetic or dermatological procedure, medication, pregnancy or other condition that could affect your service." },
      { n: "9.2", body: "We are not responsible for a reaction arising from a condition you did not disclose." },
      { n: "9.3", body: "We may decline or modify a service where we consider it unsuitable for your skin, hair or health. Where we decline on those grounds, the deposit remains non-refundable." },
      { n: "9.4", body: "Masqueraders under 18 must be accompanied by a parent or guardian, who must consent to the service." },
    ],
  },
  {
    heading: "10. Photography and image rights",
    clauses: [
      { n: "10.1", body: "By opting for Glam Shots or any photoshoot service, you agree that while your image remains your property, you grant us the right to use, publish and print any images taken during your service." },
      { n: "10.2", body: "This licence covers our website, social media, printed and digital marketing, and partner and sponsor material relating to Carnival Glam Hub. It is granted at no charge and without time limit." },
      { n: "10.3", body: "We will not use your photographs unlawfully." },
      { n: "10.4", body: "If you do not wish your images to be used in our marketing, tell us in writing before the Event and we will record the restriction against your booking." },
      { n: "10.5", body: "We may photograph or film generally at the Hub for marketing purposes. Tell our representative on arrival if you do not wish to appear in general Hub footage." },
      { n: "10.6", body: "Edited images are delivered after the Event through a private gallery. Delivery times are indicative and are not a term of the booking." },
    ],
  },
  {
    heading: "11. Belongings, bag check and add-ons",
    clauses: [
      { n: "11.1", body: "Day-time bag and wing check is offered at our Hubs where space allows. Overnight bag check, where offered, is a paid add-on and must be booked and paid for in advance." },
      { n: "11.2", body: "Items are left at your own risk. We do not accept liability for loss of or damage to cash, jewellery, phones, documents, costume pieces or any other property left with us or at the Hub." },
      { n: "11.3", body: "Overnight items must be collected on the day stated at booking. Items left uncollected after 14 days may be disposed of." },
      { n: "11.4", body: "Add-ons are subject to availability on the day. Where an add-on you have paid for cannot be provided by us, that add-on is credited or refunded. This does not affect the rest of the booking." },
    ],
  },
  {
    heading: "12. Conduct at the Hub",
    clauses: [
      { n: "12.1", body: "We ask everyone at the Hub to treat our team, our artists and other masqueraders with respect." },
      { n: "12.2", body: "We may refuse or end a service where a person is abusive, threatening, intoxicated to a degree that makes the service unsafe, or otherwise disruptive. All payments are forfeited in that event." },
      { n: "12.3", body: "Guests accompanying a masquerader are admitted at our discretion and subject to space." },
    ],
  },
  {
    heading: "13. Referral programme",
    clauses: [
      { n: "13.1", body: "Purpose. The Glam Hub Referral Programme rewards our customers for sharing the Glam Hub experience with friends and family." },
      { n: "13.2", body: "Eligibility. A Referrer must have used a Glam Hub service or purchased a product. A Referee must be a new customer who has not booked with us before." },
      { n: "13.3", body: "How it works. The Referrer shares their unique referral code. The Referee applies the code at checkout to receive the stated discount. The Referrer earns the reward once the Referee's booking is completed and paid in full." },
      { n: "13.4", body: "Payment of rewards. Rewards are paid 2 weeks after the Event, by Zelle, PayPal or WiPay. It is your responsibility to give us correct payment details." },
      { n: "13.5", body: "Code usage. One referral code per booking. Codes cannot be combined with other offers unless stated. We may disable codes, set limits or change reward values at any time without prior notice." },
      { n: "13.6", body: "Misuse. Self-referral, fabricated bookings, resale of codes and publication of codes on coupon or deal sites are misuse. Misuse results in forfeiture of rewards and removal from the programme." },
      { n: "13.7", body: "Concierge companies. Concierge and travel companies must identify themselves as such when participating." },
      { n: "13.8", body: "General. We may modify or terminate the Referral Programme at any time, without prior notice. By participating, you agree to these Terms." },
    ],
  },
  {
    heading: "14. Station rentals",
    clauses: [
      { n: "14.1", body: "__STATION__" },
    ],
  },
  {
    heading: "15. Events beyond our control",
    clauses: [
      { n: "15.1", body: "We are not liable for failure or delay in providing a service caused by circumstances beyond our reasonable control, including weather, storm or hurricane, venue closure or change, loss of power or water, road closure, transport disruption, band or event schedule changes, public health measures, civil disruption or act of government." },
      { n: "15.2", body: "Where such circumstances affect a Hub, we may reschedule the affected bookings or issue a credit valid for 12 months. Refunds are not issued." },
      { n: "15.3", body: "Where an Event itself is cancelled or postponed by its organisers, clause 15.2 applies." },
    ],
  },
  {
    heading: "16. Limitation of liability",
    clauses: [
      { n: "16.1", body: "Nothing in these Terms excludes or limits liability that cannot lawfully be excluded or limited." },
      { n: "16.2", body: "Subject to clause 16.1, our total liability arising out of or in connection with a booking is limited to the amount you have actually paid us for that booking." },
      { n: "16.3", body: "Subject to clause 16.1, we are not liable for indirect or consequential loss, including travel and accommodation costs, missed events, missed appointments with third parties, or loss of enjoyment." },
    ],
  },
  {
    heading: "17. Changes to these Terms",
    clauses: [
      { n: "17.1", body: "We may update these Terms from time to time. The version published on carnivalglamhub.com at the time you place your booking is the version that applies to that booking." },
    ],
  },
  {
    heading: "18. Governing law",
    clauses: [
      { n: "18.1", body: "These Terms are governed by the laws of Jamaica." },
      { n: "18.2", body: "Any dispute arising under or in connection with these Terms is subject to the jurisdiction of the courts of Jamaica." },
      { n: "18.3", body: "Nothing in this clause removes any right you may have to bring proceedings in your country of residence where the law of that country gives you that right and it cannot be excluded by agreement." },
    ],
  },
  {
    heading: "19. Contact",
    paragraphs: [
      `Questions about a booking or about these Terms: Carnival Glam Hub, ${CONTACT_EMAIL}, carnivalglamhub.com`,
    ],
  },
];

export const PRIVACY_BLOCKS: Block[] = [
  {
    heading: "1. Information we collect",
    paragraphs: [
      "Contact information. Your name, email address, phone number and, where you give it, your social media handle and country of residence.",
      "Booking information. The territory, date and time of your appointment, the services and add-ons you select, your Carnival band and section where relevant, any preferences or notes you give us, and your booking history with us.",
      "Service information. Information you choose to tell us so that we can carry out your service safely, such as an allergy, a skin or scalp sensitivity, or a hair type or preference.",
      "Payment information. Payments are processed by third-party payment providers. We receive confirmation that a payment has succeeded, along with limited details such as the amount, the date and the last digits of the card. We do not collect or store full payment card numbers.",
      "Images. Photographs and video taken during your service where you have booked a photoshoot service, and general photography and video taken at our Hubs.",
      "Communications. The messages you send us and our replies, so that we have a record of what was agreed.",
      "Website information. Standard technical information such as pages viewed, approximate location derived from IP address, device and browser type, collected through our website and analytics tools.",
      "We do not ask for, and do not want, national identification numbers, passport numbers or banking credentials. Please do not send them to us.",
    ],
  },
  {
    heading: "2. How we collect it",
    paragraphs: [
      "Most of the information we hold comes directly from you, at the point you make a booking, ask a question or attend a Hub.",
      "Bookings and payments are taken through a third-party booking and payment platform. Where you subscribe to our updates, that consent is captured through the same platform on an opt-in basis. That platform processes your information under its own terms and security arrangements, in addition to this Policy.",
    ],
  },
  {
    heading: "3. How we use your information",
    paragraphs: ["We use your information to:"],
    bullets: [
      "create, confirm, manage and deliver your booking",
      "communicate with you about your appointment, including reminders, arrival times and venue details",
      "take payment and issue receipts",
      "carry out your service safely, including acting on anything you have told us about allergies or sensitivities",
      "deliver photographs you have booked",
      "answer questions and handle concerns about a service",
      "operate the referral programme",
      "keep proper business, accounting and tax records",
      "understand which territories, services and pages are of interest, so that we can plan and improve",
      "send you marketing about future Carnivals, offers and services, where you have opted in",
    ],
  },
  {
    heading: "4. Marketing and how to stop it",
    paragraphs: [
      "We send marketing only to people who have opted in, or who have booked with us before.",
      `Every marketing email carries a way to unsubscribe, and you can also reply STOP or write to ${CONTACT_EMAIL} at any time. We action opt-out requests promptly. You will continue to receive messages about a booking you have already made, because those are operational rather than marketing.`,
    ],
  },
  {
    heading: "5. Who we share it with",
    paragraphs: [
      "We do not sell or rent your personal information to anyone.",
      "We share it only where it is needed to run our business, and only with:",
    ],
    bullets: [
      "our artists and Hub team, who receive the booking details needed to deliver your service",
      "our booking, scheduling and payment providers",
      "our email, messaging and analytics providers",
      "venue and event partners, where a Hub operates inside their premises or programme and they require an attendee list",
      "our professional advisers, such as accountants and lawyers, where required",
      "a purchaser or successor, if our business or part of it changes hands",
      "a public authority or court, where we are required to disclose by law, or where disclosure is necessary to protect our rights, our team or the safety of any person",
    ],
  },
  {
    heading: "6. Photography",
    paragraphs: [
      "Where you book a photoshoot service, the image rights position is set out in our Terms of Service. In summary, your image remains yours, and you grant us the right to use and publish images taken during your service. You may tell us in writing before your Event that you do not wish your images to be used in our marketing, and we will record that against your booking.",
    ],
  },
  {
    heading: "7. Where your information is held",
    paragraphs: [
      "We operate across several territories and use service providers located outside Jamaica, including in the United States. Your information may therefore be stored or processed outside the country in which you live. We take reasonable steps to work with providers that maintain appropriate protections.",
    ],
  },
  {
    heading: "8. How long we keep it",
    paragraphs: [
      "We keep booking and contact information for as long as needed to deliver the service and to meet our record-keeping, accounting and tax obligations, and for a reasonable period afterwards so that we can handle any question or claim relating to a booking. Marketing contact details are kept until you opt out. Photographs may be retained in our archive and portfolio.",
    ],
  },
  {
    heading: "9. Your choices",
    paragraphs: ["You may ask us to:"],
    bullets: [
      "give you a copy of the personal information we hold about you",
      "correct information that is wrong or out of date",
      "delete information we no longer need to keep",
      "stop sending you marketing",
      "stop using your images in our marketing",
    ],
  },
  {
    heading: "10. Security",
    paragraphs: [
      "We take reasonable measures to protect the personal information in our care, and we work with established providers for booking, payment and communications.",
      "No method of transmission over the internet, and no method of electronic storage, is completely secure. We cannot guarantee absolute security, and we do not warrant it.",
    ],
  },
  {
    heading: "11. Children",
    paragraphs: [
      "Our services are booked by adults. We do not knowingly collect personal information from a child under 13. Where a masquerader under 18 is booked, the booking and the information supporting it come from a parent or guardian. If you believe a child has given us information, write to us and we will remove it.",
    ],
  },
  {
    heading: "12. Cookies and analytics",
    paragraphs: [
      "Our website uses cookies and similar technologies to keep the site working, remember your choices and understand how the site is used. You can control cookies through your browser settings. Turning some cookies off may affect how parts of the site work.",
    ],
  },
  {
    heading: "13. Third-party links",
    paragraphs: [
      "Our website and emails link to third parties, including our booking platform, payment providers, band and event partners and social media. This Policy does not cover those sites. Please read their privacy notices.",
    ],
  },
  {
    heading: "14. Changes to this Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. We will post the updated version on carnivalglamhub.com with a new effective date. Where a change is significant, we will take reasonable steps to bring it to your attention.",
    ],
  },
  {
    heading: "15. Contact us",
    paragraphs: [
      `Questions, requests or concerns about this Privacy Policy: Carnival Glam Hub, ${CONTACT_EMAIL}, carnivalglamhub.com`,
    ],
  },
  {
    heading: "16. Governing law",
    paragraphs: [
      "Any dispute arising under or in connection with this Privacy Policy is subject to the jurisdiction of the courts of Jamaica, save where the law of your country of residence gives you a right to bring proceedings there which cannot be excluded by agreement.",
    ],
  },
];

// Trailing sentences that sit after the bulleted lists in the Privacy Policy.
export const PRIVACY_TAILS: Record<string, string> = {
  "5. Who we share it with":
    "We ask the providers we work with to handle your information only for the purposes we have engaged them for.",
  "9. Your choices": `Write to ${CONTACT_EMAIL} and we will respond within a reasonable period, normally within 30 days. We may need to verify your identity first. Some information we may need to retain, for example where a legal or accounting obligation requires it, and we will tell you if that is the case.`,
};
