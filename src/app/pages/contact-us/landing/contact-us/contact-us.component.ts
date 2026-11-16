import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../../../shared/services/seo.service';

@Component({
  selector: 'app-contact-us',
  imports: [RouterLink],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent implements OnInit {
  constructor(private seo: SeoService){}

  ngOnInit(): void {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Contact Us | XM Digitals",
      "description": "Get in touch with us for any inquiries or support."
    }

    this.seo.update({
      title: 'Contact Us | XM Digitals',
      description: 'Get in touch with us for any inquiries or support.',
      schema: schemaData
    }); 
  }
}
