import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-contact-us',
  imports: [RouterLink],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ContactUsComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    const contactUrl = 'https://xmdigitals.com/contact-us';
    const pageTitle = 'Contact Us | XM Digitals';
    const pageDesc = 'Get in touch with XM Digitals in Jakarta for inquiries, consultations, and end-to-end digital solutions across web, mobile, growth, and AI.';

    const schemaData = [
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": `${contactUrl}#contactpage`,
        "url": contactUrl,
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
            "name": "Contact Us",
            "item": contactUrl
          }
        ]
      }
    ];

    this.seo.update({
      title: pageTitle,
      description: pageDesc,
      url: contactUrl,
      schema: schemaData
    });
  }
}