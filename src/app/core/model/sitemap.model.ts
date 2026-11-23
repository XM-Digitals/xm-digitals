export interface SitemapItem {
  label: string;
  route: string;
  lastmod?: string;
}

export interface SitemapGroup {
  category: string;
  items: SitemapItem[];
}

export interface GetSitemap {
  status: {
    code: number;
    message: string;
  };
  data: SitemapGroup[];
}