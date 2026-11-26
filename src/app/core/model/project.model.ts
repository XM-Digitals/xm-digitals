export interface GetProjects {
  status: {
    code: number;
    message: string;
  };
  data: Project[];
}

export interface Project {
  slug: string;
  image: string;
  imageAlt: string;
  company: string;
  category: string;
  challengeTitle: string;
  challengeIntro: string;
  challenges: string[];
  link: string;
  banner?: string;
  metaTitle?: string;
  metaDescription?: string;
  content?: string;
  ctaTitle?: string;
  ctaUrl?: string;
}
