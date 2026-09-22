export type WPImage = {
  id: number;
  url: string;
  alt: string;
  full: string | null;
  thumb: string | null;
} | null;

export type BrandSettings = {
  midnight: string;
  saffron: string;
  cream: string;
  ink: string;
};

export type SiteSettings = {
  site_tagline: string;
  whatsapp_number: string;
  phone_number: string;
  address: string;
  hero_title: string;
  hero_subtitle: string;
  hero_primary_cta_label: string;
  hero_primary_cta_url: string;
  about_excerpt: string;
  consultation_timezone: string;
  consultation_slot_minutes: number;
  consultation_days: string[];
  consultation_start_time: string;
  consultation_end_time: string;
  meeting_methods: string[];
  default_meeting_method: string;
  show_prices_on_website: boolean;
  social_instagram: string;
  social_facebook: string;
  social_youtube: string;
  footer_text: string;
  brand: BrandSettings;
  logo_url: string;
  logo: WPImage;
  hero_image: WPImage;
  about_teaser_image: WPImage;
};

export type ContentCard = {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  featured_image: WPImage;
  display_order: number;
  show_on_homepage?: boolean;
};

export type Pooja = ContentCard & {
  full_description: string;
  benefits: string;
  requirements: string;
  gallery: NonNullable<WPImage>[];
  booking_enabled: boolean;
  whatsapp_message: string;
};

export type Product = ContentCard & {
  full_description: string;
  product_info: string;
  availability: string;
  gallery: NonNullable<WPImage>[];
  whatsapp_message: string;
};

export type AstrologyService = ContentCard & {
  full_description: string;
  duration_minutes: number;
  booking_enabled: boolean;
  whatsapp_message: string;
};

export type Astrologer = ContentCard & {
  specialty: string;
  location?: string;
  full_description: string;
  first_session_note: string;
};

export type TravelDestination = ContentCard & {
  location: string;
  full_description: string;
  travel_information: string;
  phone: string;
  gallery: NonNullable<WPImage>[];
  whatsapp_message: string;
};

export type FaqItem = {
  id: number;
  slug: string;
  question: string;
  answer: string;
  display_order: number;
};

export type Testimonial = {
  id: number;
  name: string;
  review: string;
  rating: number;
  image: WPImage;
  display_order: number;
};

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featured_image: WPImage;
  categories: string[];
  tags: string[];
};

export type WPPage = {
  id: number;
  slug: string;
  title: string;
  content: string;
  eyebrow?: string;
  hero_copy?: string;
  portrait_name?: string;
  portrait_caption?: string;
  featured_image?: WPImage;
  image_1?: WPImage;
  image_1_title?: string;
  image_1_copy?: string;
  image_2?: WPImage;
  image_2_title?: string;
  image_2_copy?: string;
};

export type HomePayload = {
  settings: SiteSettings;
  poojas: Pooja[];
  products: Product[];
  services: AstrologyService[];
  travel: TravelDestination[];
  faqs: FaqItem[];
  testimonials: Testimonial[];
  articles: Article[];
};
