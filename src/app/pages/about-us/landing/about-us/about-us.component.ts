import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    const aboutUrl = 'https://xmdigitals.com/about-us';
    const pageTitle = 'About Us | XM Digitals';
    const pageDesc = 'Learn more about XM Digitals — a digital agency and technology partner in Jakarta delivering creative, web & app development, digital growth, and AI automation.';

    const schemaData = [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "@id": `${aboutUrl}#aboutpage`,
        "url": aboutUrl,
        "name": pageTitle,
        "description": pageDesc,
        "isPartOf": {
          "@id": "https://xmdigitals.com/#website"
        },
        "about": {
          "@id": "https://xmdigitals.com/#organization"
        },
        "mainEntity": {
          "@id": "https://xmdigitals.com/#organization"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://xmdigitals.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "About Us",
            "item": aboutUrl
          }
        ]
      }
    ];

    this.seo.update({
      title: pageTitle,
      description: pageDesc,
      url: aboutUrl,
      schema: schemaData
    });
  }
}