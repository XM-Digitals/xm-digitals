import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { HeroDarkParalaxComponent } from '../../components/hero-dark-paralax/hero-dark-paralax.component';
import { SectionServiceComponent } from '../../components/section-service/section-service.component';
import { SectionUsecaseComponent } from '../../components/section-usecase/section-usecase.component';
import { SectionWhyusComponent } from '../../components/section-whyus/section-whyus.component';
import { SeoService } from '../../../../shared/services/seo.service';
import { GetService } from '../../../../core/model/service.model';
import { GetInsight } from '../../../../core/model/insight.model';
import { GetWhyUs } from '../../../../core/model/why-us.model';
import { MOCK_SERVICE } from '../../../../core/mock/service.mock';
import { MOCK_INSIGHT } from '../../../../core/mock/insight.mock';
import { MOCK_WHYUS } from '../../../../core/mock/why-us.mock';

@Component({
  selector: 'app-home',
  imports: [HeroDarkParalaxComponent, SectionServiceComponent, SectionUsecaseComponent, SectionWhyusComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  getService?: GetService;
  getInsight?: GetInsight;
  getWhyUs?: GetWhyUs;

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://xmdigitals.com/#organization",
          "name": "XM Digitals",
          "url": "https://xmdigitals.com/",
          "logo": {
            "@type": "ImageObject",
            "url": "https://xmdigitals.com/assets/images/xm-digitals-center.png"
          },
          "description": "End-to-end digital solutions to help businesses build their online presence, operate efficiently, and grow sustainably.",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jakarta",
            "addressCountry": "ID"
          },
          "sameAs": [
            "https://twitter.com/xmdigitals-indonesia",
            "https://linkedin.com/company/xmdigitals-indonesia",
            "https://instagram.com/xmdigitals-indonesia"
          ]
        },
        {
          "@type": "LocalBusiness",
          "@id": "https://xmdigitals.com/#localbusiness",
          "name": "XM Digitals",
          "url": "https://xmdigitals.com/",
          "image": "https://xmdigitals.com/assets/images/xm-digitals-center.png",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jakarta",
            "addressCountry": "ID"
          }
        },
        {
          "@type": "WebSite",
          "@id": "https://xmdigitals.com/#website",
          "url": "https://xmdigitals.com/",
          "name": "XM Digitals",
          "publisher": {
            "@id": "https://xmdigitals.com/#organization"
          }
        }
      ]
    };

    this.seo.update({
      title: 'End-to-End Digital Solutions, Enhanced with AI',
      description: 'XM Digitals helps businesses grow with end-to-end digital solutions — from creative, web & app development, digital growth, to optional AI-powered automation.',
      url: 'https://xmdigitals.com/',
      schema: schemaData
    });

    this.getService = MOCK_SERVICE;
    this.getInsight = MOCK_INSIGHT;
    this.getWhyUs = MOCK_WHYUS;
  }
}