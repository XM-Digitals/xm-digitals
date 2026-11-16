export interface GetListInsight {
  status: {
    code: number;
    message: string;
  }
  data: ListInsight[];
}

export interface ListInsight {
  banner: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  slugCategory: string;
}

export interface GetInsight {
  status: {
    code: number;
    message: string;
  }
  data: Insight[];
}

export interface Insight {
  banner: string;
  slug: string;
  title: string;
  category?: string;
  slugCategory?: string;
  description: string;
  outcomeTitle?: string;
  outcomeDescription?: string;
  metaTitle: string;
  metaDescription: string;
  contentDescription?: string;
  content?: any;
  ctaTitle?: string;
  ctaUrl?: string;
}