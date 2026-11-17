import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';;

import { SeoService } from '../../../../shared/services/seo.service';
import { LIST_MOCK_INSIGHT } from '../../../../core/mock/insight.mock';
import { ListInsight } from '../../../../core/model/insight.model';

@Component({
  selector: 'app-insight',
  imports: [RouterLink, DatePipe],
  templateUrl: './insight.component.html',
  styleUrl: './insight.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InsightComponent implements OnInit {
  listInsights?: ListInsight[];

  constructor(private seo: SeoService){}

  ngOnInit(): void {
    this.listInsights = LIST_MOCK_INSIGHT.data;

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Insights | XM Digitals",
      "description": "Latest trends in AI, Technology, and Digital Growth."
    }

    this.seo.update({
      title: 'Insights | XM Digitals',
      description: 'Latest trends in AI, Technology, and Digital Growth.',
      schema: schemaData
    }); 
  }

}
