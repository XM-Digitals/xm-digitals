import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-sitemap',
  imports: [RouterLink],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SitemapComponent implements OnInit {
  constructor(private seo: SeoService){}

  ngOnInit(): void {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Sitemap | XM Digitals",
      "description": "Sitemap of XM Digitals website for easy navigation."
    }

    this.seo.update({
      title: 'Sitemap | XM Digitals',
      description: 'Sitemap of XM Digitals website for easy navigation.',
      schema: schemaData
    }); 
  }
}
