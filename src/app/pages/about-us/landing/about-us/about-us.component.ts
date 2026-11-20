import { Component, OnInit } from '@angular/core';

import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {
  readonly robotPixels = [
    { top: '14%', left: '46%', delay: '0s', duration: '3.6s', maxOpacity: 0.42 },
    { top: '22%', left: '58%', delay: '1.2s', duration: '4.1s', maxOpacity: 0.35 },
    { top: '28%', left: '38%', delay: '2.4s', duration: '3.8s', maxOpacity: 0.45 },
    { top: '34%', left: '66%', delay: '0.6s', duration: '4.4s', maxOpacity: 0.32 },
    { top: '41%', left: '52%', delay: '1.8s', duration: '3.5s', maxOpacity: 0.48 },
    { top: '46%', left: '36%', delay: '3.0s', duration: '4.0s', maxOpacity: 0.38 },
    { top: '53%', left: '62%', delay: '0.9s', duration: '3.9s', maxOpacity: 0.4 },
    { top: '58%', left: '44%', delay: '2.1s', duration: '4.3s', maxOpacity: 0.35 },
    { top: '65%', left: '55%', delay: '1.4s', duration: '3.7s', maxOpacity: 0.44 },
    { top: '72%', left: '42%', delay: '2.7s', duration: '4.2s', maxOpacity: 0.32 }
  ];

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