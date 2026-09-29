/** Shared content types. The shapes here mirror the files under /content. */

export interface NavLink {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  /** Items without `href` only toggle their dropdown. */
  href?: string;
  children?: NavItem[];
}

export interface SocialLink extends NavLink {
  /** Icon-font class from the theme, e.g. `icon-linkedin-in-brands`. */
  icon: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  url: string;
  logo: { src: string; srcOnDark: string; width: number; height: number };
  timeZone: string;
  utilityLink: NavLink;
  mainNav: NavItem[];
  footer: {
    loginUrl: string;
    helpUrl: string;
    nav: NavItem[];
    social: SocialLink[];
    copyright: NavLink;
    legalLinks: NavLink[];
  };
}

/** An image stored under /public/media. */
export interface MediaImage {
  /** Path relative to /public/media, e.g. `uploads/images/default/photo.jpg`. */
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export type PageHeaderVariant = 'image' | 'plain' | 'gradient';

export interface PageFrontmatter {
  title: string;
  /** Meta description; defaults to `intro`. */
  description?: string;
  /** `landing` = full-width blocks (About, Research); `basic` = sidebar + article. */
  layout?: 'landing' | 'basic' | 'home';
  header?: {
    variant?: PageHeaderVariant;
    intro?: string;
    /** Small label above the title. */
    eyebrow?: string;
    /** Background image, path relative to /public/media. */
    image?: string;
  };
  /** Show the section menu of this main-menu group (e.g. `About`). */
  sectionMenu?: string;
  /** Breadcrumb link to the parent page. */
  parent?: NavLink;
}

export interface NewsCategory {
  slug: string;
  label: string;
}

export interface NewsItem {
  slug: string;
  title: string;
  /** ISO date, e.g. `2026-02-04`. */
  date: string;
  author?: string;
  /** Category slug, see content/news/categories.ts. */
  category?: string;
  /** Label shown instead of the category link (e.g. `UT News`). */
  source?: string;
  url: string;
  image?: MediaImage;
  summary?: string;
}

export type EventType = 'in_person' | 'virtual' | 'hybrid';

export interface EventItem {
  slug: string;
  title: string;
  series?: string;
  /** Local date-time strings in the site time zone, e.g. `2024-11-01T14:00`. */
  start: string;
  end?: string;
  /** Show only the start time (no end) in listings. */
  hideEndTime?: boolean;
  cost?: string;
  /** How people attend; omit when not applicable. */
  type?: EventType;
  speakers?: string;
  image?: MediaImage;
  /** Markdown caption under the event image. */
  imageCaption?: string;
  /** Thumbnail used in listings when it differs from `image`. */
  teaserImage?: MediaImage;
  /** Heading above the body; defaults to "Description". */
  descriptionHeading?: string;
  /** Short line shown under the title and in listings. */
  summary?: string;
  /** Call-to-action button next to the summary. */
  cta?: NavLink;
  /** `details` is Markdown (room, building…); `address` feeds the map and calendar links. */
  location?: { details?: string; address?: string };
  eventLink?: string;
  audience?: string[];
  /** Plain-text description used for calendar invites. */
  calendarDescription?: string;
  /** Hide the "Other Events in This Series" list. */
  hideOtherEvents?: boolean;
  body: string;
}

export interface EventSeries {
  slug: string;
  title: string;
  /** Date shown under the title (ISO date). */
  date?: string;
  image?: MediaImage;
  /** Markdown shown next to the image. */
  intro?: string;
  /** Heading of the list of this series' events; omit to hide the list. */
  eventsHeading?: string;
  body: string;
}

export interface Person {
  slug: string;
  name: string;
  roles: string[];
  department?: string;
  bio?: string;
  email?: string;
  phone?: string;
  building?: string;
  buildingUrl?: string;
  room?: string;
  /** Link for "View Profile"; an empty string shows the label without a link. */
  profileUrl?: string;
  /** Research group link shown under the bio. */
  researchGroup?: NavLink;
  image?: MediaImage;
}

export interface PersonProfile extends Person {
  affiliations?: string[];
  links?: NavLink[];
  sections?: { heading: string; items: string[] }[];
}
