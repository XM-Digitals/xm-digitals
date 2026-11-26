import { Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../../../shared/services/seo.service';
import { MOCK_PROJECTS } from '../../../../core/mock/project.mock';
import { Project } from '../../../../core/model/project.model';

@Component({
  selector: 'app-about-us',
  imports: [RouterLink],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AboutUsComponent implements OnInit, OnDestroy {
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

  readonly projects: Project[] = MOCK_PROJECTS.data;

  // Carousel config (ubah autoSlide ke false untuk mematikan auto slide)
  readonly carouselConfig = {
    autoSlide: true,
    intervalMs: 4500,
  };

  // Carousel state
  currentIndex = 0;
  slidesPerView = 3;
  isHovered = false;
  isDragging = false;
  dragOffsetPx = 0;

  private readonly isBrowser: boolean;
  private autoSlideTimer: ReturnType<typeof setInterval> | null = null;
  private pointerStartX = 0;

  constructor(
    private seo: SeoService,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

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

    if (this.isBrowser) {
      this.updateSlidesPerView();
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) return;
    this.updateSlidesPerView();
  }

  get maxIndex(): number {
    return Math.max(0, this.projects.length - this.slidesPerView);
  }

  get dots(): number[] {
    return Array.from({ length: this.maxIndex + 1 }, (_, i) => i);
  }

  get trackTransform(): string {
    const shiftPercent = -(this.currentIndex * (100 / this.slidesPerView));
    return `translate3d(calc(${shiftPercent}% + ${this.dragOffsetPx}px), 0, 0)`;
  }

  goToSlide(index: number): void {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    this.restartAutoSlideIfActive();
  }

  nextSlide(): void {
    this.currentIndex = this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1;
    this.restartAutoSlideIfActive();
  }

  prevSlide(): void {
    this.currentIndex = this.currentIndex <= 0 ? this.maxIndex : this.currentIndex - 1;
    this.restartAutoSlideIfActive();
  }

  onMouseEnter(): void {
    this.isHovered = true;
    this.stopAutoSlide();
  }

  onMouseLeave(): void {
    this.isHovered = false;
    if (this.isDragging) {
      this.finishDrag();
    }
    if (this.carouselConfig.autoSlide) {
      this.startAutoSlide();
    }
  }

  onPointerDown(event: PointerEvent): void {
    if (this.maxIndex === 0 || (event.target as HTMLElement)?.closest('a, button')) return;
    this.isDragging = true;
    this.pointerStartX = event.clientX;
    this.dragOffsetPx = 0;
    this.stopAutoSlide();
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.isDragging) return;
    this.dragOffsetPx = event.clientX - this.pointerStartX;
  }

  onPointerUp(): void {
    if (!this.isDragging) return;
    this.finishDrag();
    if (this.carouselConfig.autoSlide && !this.isHovered) {
      this.startAutoSlide();
    }
  }

  private finishDrag(): void {
    const threshold = 50;
    if (this.dragOffsetPx <= -threshold) {
      this.currentIndex = this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1;
    } else if (this.dragOffsetPx >= threshold) {
      this.currentIndex = this.currentIndex <= 0 ? this.maxIndex : this.currentIndex - 1;
    }
    this.isDragging = false;
    this.dragOffsetPx = 0;
  }

  private updateSlidesPerView(): void {
    const width = window.innerWidth;
    if (width >= 992) {
      this.slidesPerView = 3;
    } else if (width >= 768) {
      this.slidesPerView = 2;
    } else {
      this.slidesPerView = 1;
    }
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }

  private startAutoSlide(): void {
    if (!this.isBrowser || !this.carouselConfig.autoSlide || this.isHovered) return;
    this.stopAutoSlide();
    this.autoSlideTimer = setInterval(() => {
      this.currentIndex = this.currentIndex >= this.maxIndex ? 0 : this.currentIndex + 1;
    }, this.carouselConfig.intervalMs);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideTimer !== null) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = null;
    }
  }

  private restartAutoSlideIfActive(): void {
    if (this.carouselConfig.autoSlide && !this.isHovered) {
      this.startAutoSlide();
    }
  }
}