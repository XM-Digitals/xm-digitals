export interface GetProjects {
  status: {
    code: number;
    message: string;
  };
  data: DetailProject[];
}

export interface DetailProject {
  slug: string;
  banner: string;
  bannerAlt: string;
  bannerDetail: string;
  company: string;
  category: string;

  // Challenge Section
  challengeTitle: string;
  challengeIntro: string;
  challenges: string[];

  // Solution & Architecture Section
  solutionTitle?: string;
  solutionIntro?: string;
  solutions?: string[];

  // Business Impact Section
  impactTitle?: string;
  impacts?: string[];

  // Navigation, SEO & CTA
  link: string;
  metaTitle?: string;
  metaDescription?: string;
  content?: string;
  ctaTitle?: string;
  ctaUrl?: string;
}
