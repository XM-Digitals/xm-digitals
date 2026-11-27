import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SeoService } from '../../../../shared/services/seo.service';
import { MOCK_PROJECTS } from '../../../../core/mock/project.mock';
import { DetailProject } from '../../../../core/model/project.model';
import { HeroDetailComponent } from '../../components/hero-detail/hero-detail.component';

@Component({
  selector: 'app-detail-project',
  imports: [RouterLink, HeroDetailComponent],
  templateUrl: './detail-project.component.html',
  styleUrl: './detail-project.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class DetailProjectComponent implements OnInit {
  detailProject?: DetailProject;

  constructor(
    private seo: SeoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      this.detailProject = MOCK_PROJECTS.data.find((item) => item.slug === slug);

      if (!this.detailProject) {
        this.router.navigate(['/about-us']);
        return;
      }

      this.seoUpdate(this.detailProject);
    });
  }

  private seoUpdate(detailProject: DetailProject): void {
    const pageUrl = `https://xmdigitals.com/project/${detailProject.slug}/`;
    const pageTitle = detailProject.metaTitle || `${detailProject.company} | XM Digitals`;
    const pageDesc = detailProject.metaDescription || detailProject.challengeIntro;
    const rawImage =
      detailProject.bannerDetail || detailProject.banner || 'xm-digitals-center.png';
    const pageImage = rawImage.startsWith('http')
      ? rawImage
      : `https://xmdigitals.com/assets/images/${rawImage.replace(/^\/?(assets\/images\/)?/, '')}`;

    const schemaData = [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: pageDesc,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://xmdigitals.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'About Us',
            item: 'https://xmdigitals.com/about-us/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: detailProject.company,
            item: pageUrl,
          },
        ],
      },
    ];

    this.seo.update({
      title: pageTitle,
      description: pageDesc,
      image: pageImage,
      url: pageUrl,
      type: 'website',
      schema: schemaData,
    });
  }
}