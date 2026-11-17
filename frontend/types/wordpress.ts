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
  contact_email?: string;
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
  hero_slides?: Array<WPImage>;
  hero_astro_slides?: Array<WPImage>;
  about_teaser_image: WPImage;
  guidance_image?: WPImage;
  join_image?: WPImage;
  cta_image?: WPImage;
  i18n?: Record<string, Record<string, string>>;
};

export type ContentI18n = Partial<Record<string, Partial<Record<string, string>>>>;

export type CatalogCategory = {
  slug: string;
  name: string;
};

export type ContentCard = {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  featured_image: WPImage;
  display_order: number;
  show_on_homepage?: boolean;
  i18n?: ContentI18n;
};

export type Pooja = ContentCard & {
  full_description: string;
  benefits: string;
  requirements: string;
  gallery: NonNullable<WPImage>[];
  booking_enabled: boolean;
  whatsapp_message: string;
  categories?: CatalogCategory[];
};

export type Vendor = ContentCard & {
  location?: string;
  full_description: string;
  pooja_ids?: number[];
};

export type Product = ContentCard & {
  full_description: string;
  product_info: string;
  availability: string;
  gallery: NonNullable<WPImage>[];
  whatsapp_message: string;
  categories?: CatalogCategory[];
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
  writer_name?: string;
  i18n?: ContentI18n;
};

export type WPPage = {
  id: number;
  slug: string;
  title: string;
  content: string;
  eyebrow?: string;
  hero_copy?: string;
  root_1_title?: string;
  root_1_copy?: string;
  root_2_title?: string;
  root_2_copy?: string;
  root_3_title?: string;
  root_3_copy?: string;
  root_4_title?: string;
  root_4_copy?: string;
  about_eyebrow?: string;
  about_lead?: string;
  about_accent?: string;
  about_body?: string;
  portrait_name?: string;
  portrait_caption?: string;
  tantric_eyebrow?: string;
  tantric_lead?: string;
  tantric_accent?: string;
  tantric_copy?: string;
  list_eyebrow?: string;
  list_title?: string;
  list_copy?: string;
  list2_eyebrow?: string;
  list2_title?: string;
  list2_copy?: string;
  photos_eyebrow?: string;
  photos_lead?: string;
  photos_copy?: string;
  photo1_badge?: string;
  photo1_title?: string;
  photo1_copy?: string;
  photo2_badge?: string;
  cta_eyebrow?: string;
  cta_title?: string;
  cta_copy?: string;
  cta_button?: string;
  cta_button_2?: string;
  cta_button_3?: string;
  proof_1_title?: string;
  proof_1_copy?: string;
  proof_2_title?: string;
  proof_2_copy?: string;
  proof_3_title?: string;
  proof_3_copy?: string;
  unique_eyebrow?: string;
  unique_title?: string;
  unique_copy?: string;
  unique_1_title?: string;
  unique_1_copy?: string;
  unique_1_note?: string;
  unique_2_title?: string;
  unique_2_copy?: string;
  unique_2_note?: string;
  unique_3_title?: string;
  unique_3_copy?: string;
  unique_3_note?: string;
  unique_4_title?: string;
  unique_4_copy?: string;
  unique_4_note?: string;
  stat_1_value?: string;
  stat_1_note?: string;
  stat_2_value?: string;
  stat_2_note?: string;
  stat_3_value?: string;
  stat_3_note?: string;
  stat_4_value?: string;
  stat_4_note?: string;
  wisdom_eyebrow?: string;
  wisdom_title?: string;
  wisdom_copy?: string;
  wisdom_1_kicker?: string;
  wisdom_1_title?: string;
  wisdom_1_copy?: string;
  wisdom_1_left?: string;
  wisdom_1_right?: string;
  wisdom_2_kicker?: string;
  wisdom_2_title?: string;
  wisdom_2_copy?: string;
  wisdom_2_left?: string;
  wisdom_2_right?: string;
  wisdom_3_kicker?: string;
  wisdom_3_title?: string;
  wisdom_3_copy?: string;
  wisdom_3_left?: string;
  wisdom_3_right?: string;
  featured_image?: WPImage;
  image_1?: WPImage;
  image_1_title?: string;
  image_1_copy?: string;
  image_2?: WPImage;
  image_2_title?: string;
  image_2_copy?: string;
  i18n?: ContentI18n;
};

export type HomePayload = {
  settings: SiteSettings;
  poojas: Pooja[];
  products: Product[];
  astrologers?: Astrologer[];
  services: AstrologyService[];
  travel: TravelDestination[];
  faqs: FaqItem[];
  testimonials: Testimonial[];
  articles: Article[];
  vendors?: Vendor[];
};
