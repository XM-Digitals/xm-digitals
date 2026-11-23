import { inject, Injectable } from '@angular/core';

import { UseCasePromise } from '../base/base.usecase';
import { SitemapMapper } from '../mapper/sitemap.mapper';
import { GetSitemap } from '../model/sitemap.model';
import { SitemapRepository } from '../repository/sitemap.repository';

@Injectable({
  providedIn: 'root',
})
export class GetSitemapUseCase implements UseCasePromise<GetSitemap> {
  private sitemapRepository = inject(SitemapRepository);
  private sitemapMapper = inject(SitemapMapper);

  async execute(): Promise<GetSitemap> {
    const rawXml = await this.sitemapRepository.fetchRawSitemap();
    const groups = this.sitemapMapper.mapFrom(rawXml);

    return {
      status: {
        code: rawXml ? 200 : 206,
        message: rawXml ? 'Success' : 'Loaded from fallback',
      },
      data: groups,
    };
  }
}